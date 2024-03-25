import express from "express";
import net from "net";
import fs from "fs";
import { readFile } from "node:fs/promises";

const device_size_x = 320;
const device_size_y = 640;

const app = express();
app.use(express.urlencoded({ extended: false }));
const socket_client = net.createConnection({ port: 3000, host: "android" });

async function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

let doneWrite = 0;
let screenshotPromise = null;

async function screenshot() {
	socket_client.write("screenshot");
	while (!doneWrite) await sleep(15);
	doneWrite = 0;
	screenshotPromise = null;
}

async function guardedScreenshot() {
	if (!screenshotPromise) {
		screenshotPromise = screenshot();
	}
	return screenshotPromise;
}

async function waitFullBoot() {
	var start = performance.now();
	var counter = 0;

	//will timeout after 10 min
	while (performance.now() - start < 600 * 1000) {
		var before = performance.now();
		await screenshot();
		var after = performance.now();
		if (after - before < process.env.screenshotDelayMs) counter++;
		else counter = 0;

		if (counter === 10) return;
	}

	throw new Error("wait for screenshot time to be less than 0.5s timed out");
}

let fd;
socket_client.on("data", (dataBuf) => {
	if (dataBuf.toString() === "start")
		fd = fs.openSync("/code/screenshot.png", "w");
	else {
		if (dataBuf.toString().includes("ENDOFMSG")) {
			fs.writeSync(fd, dataBuf);
			fs.close(fd);
			doneWrite = 1;
		} else fs.writeSync(fd, dataBuf);
	}
});

console.log("Waiting for full boot...");
await waitFullBoot();
console.log("Boot detected! activating endpoints");

app.get("/screen", async function (req, res) {
	await guardedScreenshot();
	res.sendFile("/code/screenshot.png");
});

app.get("/favicon.ico", function (req, res) {
	res.sendFile("/code/favicon.ico");
});

app.get("/trafficLog.js", function (req, res) {
	res.sendFile("/code/dist/trafficLog.js");
});

app.get("/trafficLog", async function (req, res) {
	res.sendFile("/log/trafficLog");
});

app.post("/touch", function (req, res) {
	const x = parseInt(req.body.x);
	const y = parseInt(req.body.y);

	if (isNaN(x) || isNaN(y) || x > device_size_x || y > device_size_y) {
		res.send(
			`the query params must be x <= ${device_size_x}, y <= ${device_size_y}\n`
		);
	} else {
		socket_client.write(`touch ${x} ${y}`);
		res.sendStatus(200);
	}
});

app.get("/", async function (req, res) {
	let fileData = (await readFile("/code/index.html")).toString();

	fileData = fileData.replace(
		"___screenshotDelayMs___",
		process.env.screenshotDelayMs
	);

	res.setHeader("Content-Type", "text/html");
	res.setHeader("Content-Disposition", "inline");

	res.send(fileData);
});

app.post("/back", function (req, res) {
	socket_client.write(`back`);
	res.sendStatus(200);
});

app.post("/home", function (req, res) {
	socket_client.write(`home`);
	res.sendStatus(200);
});

app.listen(8080, () => console.log("Listening in port 8080"));

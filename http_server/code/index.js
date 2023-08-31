const express = require("express");
const net = require("net");
const fs = require("fs");

const device_size_x = 320;
const device_size_y = 640;

const app = express();
const socket_client = net.createConnection({ port: 3000, host: "android" });

async function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

let doneWrite = 0;
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

app.get("/", async function (req, res) {
	socket_client.write("screenshot");
	while (!doneWrite) await sleep(15);
	res.sendFile("/code/screenshot.png");
	doneWrite = 0;
});

app.post("/", function (req, res) {
	const x = parseInt(req.query.x);
	const y = parseInt(req.query.y);

	if (isNaN(x) || isNaN(y) || x > device_size_x || y > device_size_y) {
		res.send(
			`the query params must be x <= ${device_size_x}, y <= ${device_size_y}\n`
		);
	} else {
		socket_client.write(`touch ${x} ${y}`);
		res.sendStatus(200);
	}
});

app.listen(8080, () => console.log("Listening in port 8080"));

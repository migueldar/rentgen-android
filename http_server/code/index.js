const express = require("express");
const child_process = require("child_process");

const device_size_x = 320;
const device_size_y = 640;

let app = express();

app.get("/", function (req, res) {
	const screenshot_cmd_res = child_process.spawnSync("sshpass", [
		"-p",
		"toor",
		"ssh",
		"android",
		"bash",
		"/conf/screenshot.sh",
	]);
	if (screenshot_cmd_res.status === 0) {
		const scp_cmd_res = child_process.spawnSync("sshpass", [
			"-p",
			"toor",
			"scp",
			"android:/screenshot.png",
			"/images/screenshot.png",
		]);
		if (scp_cmd_res.status === 0) {
			res.sendFile("/images/screenshot.png");
			return;
		}
	}
	res.send("Screenshot event didnt happen\n");
});

app.post("/", function (req, res) {
	const x = parseInt(req.query.x);
	const y = parseInt(req.query.y);

	if (isNaN(x) || isNaN(y) || x > device_size_x || y > device_size_y) {
		res.send(
			`the query params must be x <= ${device_size_x}, y <= ${device_size_y}\n`
		);
	} else {
		const cmd_res = child_process.spawnSync("sshpass", [
			"-p",
			"toor",
			"ssh",
			"android",
			"bash",
			"/conf/touch.sh",
			x,
			y,
		]);
		if (cmd_res.status === 0) res.sendStatus(200);
		else res.send("Touch event didnt happen\n");
	}
});

app.listen(8080, () => console.log("Listening in port 8080\n"));

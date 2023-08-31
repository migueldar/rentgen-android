const net = require("net");
const child_process = require("child_process");
const fs = require("fs");

const server = net.createServer();

//maybe check output of child processe and send errors in some way
server.on("connection", (socket) => {
	socket.on("data", async (dataBuf) => {
		data = dataBuf.toString();
		if (data === "screenshot") {
			socket.write("start");
			child_process.spawnSync("bash", ["/conf/screenshot.sh"]);
			socket.write(fs.readFileSync("/screenshot.png"));
			socket.write("ENDOFMSG");
		} else if (data.includes("touch")) {
			dataSplit = data.split(" ");
			child_process.spawnSync("bash", ["/conf/touch.sh", dataSplit[1], dataSplit[2]]);
		}
	});
});

server.listen(3000, () => {
	console.log("listening on 3000");
});

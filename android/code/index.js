const net = require("net");
const child_process = require("child_process");
const fs = require("fs");

const server = net.createServer();

async function spawnPromise(program, args) {
	return new Promise((resolve, reject) => {
		const process = child_process.spawn(program, args);
		process.on("close", (_) => {
			resolve();
		});
	});
}

//maybe check output of child processe and send errors in some way
server.on("connection", (socket) => {
	socket.on("data", async (dataBuf) => {
		data = dataBuf.toString();  
		if (data === "screenshot") {
			socket.write("start");
			await spawnPromise("bash", ["/conf/screenshot.sh"]);
			socket.write(fs.readFileSync("/screenshot.png"));
			socket.write("ENDOFMSG");
		} else if (data.includes("touch")) {
			dataSplit = data.split(" ");
			await spawnPromise("bash", [
				"/conf/touch.sh",
				dataSplit[1],
				dataSplit[2],
			]);
		} else if (data === "back") {
			await spawnPromise("bash", [
				"/conf/back.sh",
			]);
		} else if (data === "home") {
		await spawnPromise("bash", [
			"/conf/home.sh",
		]);
	}
	
	});
	socket.on("close", (_) => {
		socket.end();
	});
});

server.listen(3000, () => {
	console.log("listening on 3000");
});

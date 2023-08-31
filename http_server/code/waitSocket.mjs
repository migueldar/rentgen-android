import net from "net";
import { exit } from "process";

async function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

while (true) {
	let socket = net.createConnection({ port: 3000, host: "android" });

	socket.on("connect", () => {
		exit(0);
	});
	socket.on("error", () => {});
	await sleep(200);
}

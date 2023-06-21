import { promises as fs } from "fs";

async function checkCertExistance() {
	return await Promise.all([
		fs.access("./certificates/mitmproxy-ca-cert.cer", fs.constants.R_OK),
		fs.access("./certificates/mitmproxy-ca-cert.p12", fs.constants.R_OK),
		fs.access("./certificates/mitmproxy-ca-cert.pem", fs.constants.R_OK),
		fs.access("./certificates/mitmproxy-ca.p12"),
		fs.access("./certificates/mitmproxy-ca.pem"),
		fs.access("./certificates/mitmproxy-dhparam.pem", fs.constants.R_OK),
	]);
}

async function generateCert() {
	//remove certs if they exist
	try {
		await $`rm -rf certificates`;
	} catch {
		throw new Error(
			"To remove certificates, and create new ones, this command must be run with sudo"
		);
	}

	//iniciate docker which will create certs
	$`docker run --rm -v $PWD/certificates:/home/mitmproxy/.mitmproxy --name certGenerator mitmproxy/mitmproxy:9.0.1 mitmdump &`;

	//wait for certs to generate
	let generated = false;
	while (!generated) {
		try {
			await checkCertExistance();
			generated = true;
		} catch {}
	}

	//kill docker container
	await $`docker stop certGenerator`;
}

if (process.argv.length !== 4) throw new Error("expected an argument");
else if (process.argv[3] === "up") {
	try {
		await checkCertExistance();
	} catch {
		await generateCert();
	}
	await $`docker compose build`;
	await $`docker compose up`;
} else if (process.argv[3] === "down") await $`docker compose down`;
else if (process.argv[3] === "generateCert") {
	generateCert();
} else throw new Error("expected [up | down | generateCert ] as argument");

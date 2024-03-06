import { promises as fs } from "fs";

async function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

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
	$`docker stop certGenerator`;
}

async function generatePreAndroid() {
	await $`docker build -t pre_android pre_android`;
	$`docker run --rm -v $PWD/certificates/mitmproxy-ca-cert.cer:/ca-cert.cer -v $PWD/pre_android/preconf:/preconf --device=/dev/kvm --name pre_android_cont pre_android &`;

	console.log(
		"Installing tls certificate and culebra into the android pre-image..."
	);
	//the way of knowing when the culebra install is creating a file in the shared volume
	let finished = false;
	while (!finished) {
		try {
			await fs.access(
				"./pre_android/preconf/finished",
				fs.constants.R_OK
			),
				$`rm -f ./pre_android/preconf/finished`;
			finished = true;
		} catch {
			await sleep(100);
		}
	}

	await $`docker commit pre_android_cont pre_android/ready`;
	$`docker stop pre_android_cont`;
}

if (process.argv.length !== 4) throw new Error("expected an argument");
else if (process.argv[3] === "up") {
	try {
		await checkCertExistance();
	} catch {
		await generateCert();
	}

	try {
		await $`docker image inspect pre_android/ready > /dev/null 2> /dev/null`;
	} catch {
		await generatePreAndroid();
	}

	await $`docker compose build`;
	await $`docker compose up`;
} else if (process.argv[3] === "down") await $`docker compose down`;
else if (process.argv[3] === "generateCert") {
	generateCert();
} else if (process.argv[3] === "generatePreAndroid") {
	generatePreAndroid();
} else
	throw new Error(
		"expected [up | down | generateCert | generatePreAndroid ] as argument"
	);

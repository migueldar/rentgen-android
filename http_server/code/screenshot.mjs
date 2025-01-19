import net from "net";
import fs from "fs";
import { sleep } from "./utils.mjs";

export const socket_client = net.createConnection({ port: 3000, host: "android" });

let doneWrite = 0;
let screenshotPromise = null;

async function screenshot() {
  const time_start = Date.now();
  socket_client.write("screenshot");
  while (!doneWrite) {
    await sleep(15);
    if (Date.now() - time_start > 2000) {
      console.error("Screenshot timed out after 2s");
      break; // timeout
    }
  }
  doneWrite = 0;
  screenshotPromise = null;
}

export async function guardedScreenshot() {
  console.log("Requesting a screenshot");
  if (!screenshotPromise) {
    console.log("no ongoing promise, starting a new one");
    screenshotPromise = screenshot();
  }
  return screenshotPromise;
}

export async function waitFullBoot() {
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
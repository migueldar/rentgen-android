import express from "express";
import { readFile } from "node:fs/promises";
import { guardedScreenshot, socket_client, waitFullBoot } from "./screenshot.mjs";

const device_size_x = 320;
const device_size_y = 640;

const app = express();
app.use(express.urlencoded({ extended: false }));

console.log("Waiting for full boot...");
await waitFullBoot();
console.log("Boot detected! activating endpoints");

//GET
app.get("/favicon.ico", function (req, res) {
  res.sendFile("/code/favicon.ico");
});

app.get("/trafficLog.js", function (req, res) {
  res.sendFile("/code/dist/trafficLog.js");
});

app.get("/trafficLog", async function (req, res) {
  res.sendFile("/log/trafficLog");
});

app.get("/screen", async function (req, res) {
  await guardedScreenshot();
  res.sendFile("/code/screenshot.png");
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

//POST
app.post("/back", function (req, res) {
  socket_client.write(`back`);
  res.sendStatus(200);
});

app.post("/home", function (req, res) {
  socket_client.write(`home`);
  res.sendStatus(200);
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

app.post("/drag", function (req, res) {
  const body = req.body;
  const startX = Number(body.startX);
  const startY = Number(body.startY);
  const endX = Number(body.endX);
  const endY = Number(body.endY);
  socket_client.write(`drag ${startX} ${startY} ${endX} ${endY}`);
  res.sendStatus(200);
});

app.listen(8080, () => console.log("Listening in port 8080"));

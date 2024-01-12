# RENTGEN ANDROID

## INTRODUCTION

The aim of this project is to be able to visualize all the data that a given android app ~~steals~~ sends to third parties.

We are currently in v1, the environment, which is made up of a mitmproxy
machine, a http server and an ubuntu machine with android emulator was created
using docker, and all the tcp traffic from the android machine is redirected
through the proxy. In future versions the
[rentgen](https://github.com/internet-czas-dzialac/rentgen) firefox extension
will be adapted to interpret the traffic from the proxy and display it in a
user-friendly way.

## COMMANDS

To get started, run `npm install` and `npm start`

If you get a time out after "Waiting for full boot..." your machine may be to slow to run the software comfortably, however, you can change the delay between screenshots in ./http_server/Dockerfile, changing "ENV screenshotDelayMs 1000" with as much time as you want to have between screenshots. The time is measured in miliseconds.

And then, to check the proxy's logs you can do `docker exec -it proxy tail -f
/log` and to go into the android `docker exec -it android bash`.

To control the android device, go to localhost:8080 in a browser. The endpoint
takes a while to be enabled (because the tls certificate has to install in the
android), but it will show in the output of `npm start` whenever it
is.

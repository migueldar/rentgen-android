# RENTGEN ANDROID
## INTRODUCTION
The aim of this project is to be able to visualize all the data that a given android app ~~steals~~ sends to third parties.

We are currently in v1, the environment, which is made up of a mitmproxy machine, a http server and an ubuntu machine with android emulator was created using docker, and all the tcp traffic from the android machine is redirected through the proxy. In future versions the [rentgen](https://github.com/internet-czas-dzialac/rentgen) firefox extension will be adapted to interpret the traffic from the proxy and display it in a user-friendly way.

## COMMANDS
To get started, run `npm install` and `npx zx start.mjs up`
And then, to check the proxy's logs you can do `docker exec -it proxy tail -f /log` and to go into the android `docker exec -it android bash`.
To see the android screen, go to localhost:8080 in a browser. The endpoint takes a while to be enabled (because the tls certificate has to install in the android), but it will show in the output of `npx zx start.mjs up` whenever it is. To execute touch events, run a post request with query params x and y for the coordinates where the touch will happen (the screen size is 320x640). The way to do it with curl would be `curl -X POST "localhost:8080?x=$coordinate_x&y=$coordinate_y"`.
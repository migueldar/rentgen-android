# RENTGEN ANDROID
The aim of this project is to be able to visualize all the data that a given android app ~~steals~~ sends to third parties.

We are currently in v1, the environment, which is made up of a mitmproxy machine and an ubuntu machine with android emulator was created using docker, and all the tcp traffic from the android machine is redirected through the proxy. In future versions the [rentgen](https://github.com/internet-czas-dzialac/rentgen) firefox extension will be adapted to interpret the traffic from the proxy and display it in a user-friendly way

To get started, run `npm install` and `npx zx start.mjs up`
And then, to check the proxy's logs you can do `docker exec -it proxy tail -f /log` and to go into the android `docker exec -it android bash`
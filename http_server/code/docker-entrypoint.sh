#!/bin/bash

npm i -C /code
mkdir /root/.ssh

#for ssh not asking us to add to known_hosts
ssh-keyscan -H android >> /root/.ssh/known_hosts 
while [ $? != 0 ]; do
	sleep 2
	ssh-keyscan -H android >> /root/.ssh/known_hosts 
done

node /code/index.js
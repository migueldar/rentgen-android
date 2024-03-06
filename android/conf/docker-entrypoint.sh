bash /conf/start_culebra.sh	
npm i -C /code
bash /conf/iptables_conf.sh
redsocks -c /conf/redsocks.conf &
bash /conf/wait_for_sd.sh
node /code/index.js

#tail -f /dev/null

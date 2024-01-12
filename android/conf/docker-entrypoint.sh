hashed_name=`openssl x509 -inform PEM -subject_hash_old -in /ca-cert.cer | head -1` 

npm i -C /code
cp /ca-cert.cer /$hashed_name.0
bash /conf/iptables_conf.sh
redsocks -c /conf/redsocks.conf &
emulator -avd virtual_dev -writable-system -no-window -no-audio &
bash /conf/install_cert.sh $hashed_name.0
bash /conf/wait_for_sd.sh
#wait for cert to be installed before launching socket server
node /code/index.js

#tail -f /dev/null

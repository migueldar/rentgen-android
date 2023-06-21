hashed_name=`openssl x509 -inform PEM -subject_hash_old -in /ca-cert.cer | head -1` 

cp /ca-cert.cer /$hashed_name.0
bash /conf/iptables_conf.sh
redsocks -c /conf/redsocks.conf &
emulator -avd virtual_dev -writable-system -no-window -no-audio &
bash /conf/install_cert.sh $hashed_name.0
tail -f /dev/null

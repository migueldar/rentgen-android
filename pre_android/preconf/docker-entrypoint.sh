hashed_name=`openssl x509 -inform PEM -subject_hash_old -in /ca-cert.cer | head -1` 

adb start-server
emulator -avd virtual_dev -writable-system -no-window -no-audio &
cp /ca-cert.cer /$hashed_name.0
bash /preconf/install_cert.sh $hashed_name.0
bash /preconf/install_culebra.sh

adb emu avd snapshot save configured

adb emu kill
#to let the host know it finished installing
install -m 777 /dev/null /preconf/finished

tail -f /dev/null
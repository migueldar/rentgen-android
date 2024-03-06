rm -f /opt/android-sdk-linux/.android/avd/virtual_dev.avd/*.lock
adb start-server
emulator -avd virtual_dev -writable-system -no-window -no-audio &
adb wait-for-device
adb emu avd snapshot load configured
adb wait-for-device

export PATH=$PATH:/root/culebraDependencies
cd /root/culebra
./culebratester2 start-server &

#wait for the server to start
while ! curl http://localhost:9987/v2/uiDevice/screenshot > /dev/null 2> /dev/null; do   
  sleep 0.1
done
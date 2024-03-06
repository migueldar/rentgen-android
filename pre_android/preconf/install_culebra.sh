adb wait-for-device
cd /root
git clone https://github.com/dtmilano/CulebraTester2-public culebra
git clone https://gist.github.com/dtmilano/4537110 culebraDependencies
export PATH=$PATH:/root/culebraDependencies

cd culebra
git checkout 4ce1987e7ec6ae627d8f33a1a3b59f684aff90c0
echo "/opt/android-sdk-linux" >> local.properties
./culebratester2 install
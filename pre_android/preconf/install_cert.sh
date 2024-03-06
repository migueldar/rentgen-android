wait-for-offline() {
	while [ $(adb devices | grep offline | wc -l) -eq 0 ]; do
		sleep 0.1
	done
}

adb wait-for-device
adb root

wait-for-offline
adb wait-for-device	
adb shell avbctl disable-verification

#here may be the issue with the bypass (start) 
adb wait-for-device
adb reboot

adb wait-for-device
adb root
#(end)

wait-for-offline
adb wait-for-device
adb remount

adb wait-for-device
adb reboot

adb wait-for-device
adb root

wait-for-offline
adb wait-for-device
adb remount

adb wait-for-device
adb push /$1 /system/etc/security/cacerts
adb shell chmod 664 /system/etc/security/cacerts/$1
adb reboot

#wait for complete boot
adb wait-for-device
while [ "$(adb shell getprop sys.boot_completed | tr -d '\r')" != "1" ]; do
    sleep 1
done

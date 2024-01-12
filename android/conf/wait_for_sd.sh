/opt/android-sdk-linux/platform-tools/adb shell screencap /sdcard/screenshot.png 2> /dev/null
while [ "$?" != 0 ]; do  
	sleep 0.5
	/opt/android-sdk-linux/platform-tools/adb shell screencap /sdcard/screenshot.png 2> /dev/null
done
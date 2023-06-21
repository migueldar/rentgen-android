adb shell screencap /sdcard/$N_IMG.png
adb pull /sdcard/$N_IMG.png
export N_IMG=$((N_IMG + 1))
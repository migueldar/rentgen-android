FROM runmymind/docker-android-sdk:ubuntu-standalone-20230511

ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/opt/android-sdk-linux/cmdline-tools/latest/bin:/opt/android-sdk-linux/cmdline-tools/tools/bin:/opt/android-sdk-linux/tools/bin:/opt/android-sdk-linux/build-tools/32.0.0:/opt/android-sdk-linux/platform-tools:/opt/android-sdk-linux/emulator:/opt/android-sdk-linux/bin

RUN sdkmanager "system-images;android-33;google_apis;x86_64"
RUN echo no | avdmanager create avd -n virtual_dev -b google_apis/x86_64 -k "system-images;android-33;google_apis;x86_64"

RUN apt-get update && apt-get install -y iproute2 iputils-ping iptables redsocks npm git

EXPOSE 3000

CMD bash /conf/docker-entrypoint.sh

FROM runmymind/docker-android-sdk:ubuntu-standalone-20230511

ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/opt/android-sdk-linux/cmdline-tools/latest/bin:/opt/android-sdk-linux/cmdline-tools/tools/bin:/opt/android-sdk-linux/tools/bin:/opt/android-sdk-linux/build-tools/32.0.0:/opt/android-sdk-linux/platform-tools:/opt/android-sdk-linux/emulator:/opt/android-sdk-linux/bin

RUN sdkmanager "system-images;android-33;google_apis;x86_64"
RUN echo no | avdmanager create avd -n virtual_dev -b google_apis/x86_64 -k "system-images;android-33;google_apis;x86_64"

#remove iproute2 ping traceroute curl vim 
RUN apt-get update && apt-get install -y iproute2 iputils-ping traceroute curl vim iptables redsocks 

#COPY certificates/mitmproxy-ca-cert.cer /certificate.cer
#RUN hashed_name=`openssl x509 -inform PEM -subject_hash_old -in mitmproxy-ca-cert.cer | head -1` && cp mitmproxy-ca-cert.cer $hashed_name.0

CMD bash /conf/docker-entrypoint.sh

FROM mitmproxy/mitmproxy:9.0.1

# COPY ../certificates /root/.mitmproxy

CMD mitmdump --mode socks5 > /log
# CMD tail -f /dev/null
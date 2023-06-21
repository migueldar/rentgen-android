#!/bin/bash

iptables -t nat -N REDSOCKS

iptables -t nat -A REDSOCKS -d 0.0.0.0/8 -j RETURN
iptables -t nat -A REDSOCKS -d 10.0.0.0/8 -j RETURN
iptables -t nat -A REDSOCKS -d 100.64.0.0/10 -j RETURN
iptables -t nat -A REDSOCKS -d 127.0.0.0/8 -j RETURN
iptables -t nat -A REDSOCKS -d 169.254.0.0/16 -j RETURN
iptables -t nat -A REDSOCKS -d 172.16.0.0/12 -j RETURN
iptables -t nat -A REDSOCKS -d 192.168.0.0/16 -j RETURN
iptables -t nat -A REDSOCKS -d 198.18.0.0/15 -j RETURN
iptables -t nat -A REDSOCKS -d 224.0.0.0/4 -j RETURN
iptables -t nat -A REDSOCKS -d 240.0.0.0/4 -j RETURN
iptables -t nat -A REDSOCKS -p tcp -j REDIRECT --to-ports 12345

iptables -t nat -A OUTPUT -p tcp -j REDSOCKS

# iptables -t nat -N UDPSOCKS

# iptables -t nat -A UDPSOCKS -d 0.0.0.0/8 -j RETURN
# iptables -t nat -A UDPSOCKS -d 10.0.0.0/8 -j RETURN
# iptables -t nat -A UDPSOCKS -d 100.64.0.0/10 -j RETURN
# iptables -t nat -A UDPSOCKS -d 127.0.0.0/8 -j RETURN
# iptables -t nat -A UDPSOCKS -d 169.254.0.0/16 -j RETURN
# iptables -t nat -A UDPSOCKS -d 172.16.0.0/12 -j RETURN
# iptables -t nat -A UDPSOCKS -d 192.168.0.0/16 -j RETURN
# iptables -t nat -A UDPSOCKS -d 198.18.0.0/15 -j RETURN
# iptables -t nat -A UDPSOCKS -d 224.0.0.0/4 -j RETURN
# iptables -t nat -A UDPSOCKS -d 240.0.0.0/4 -j RETURN
# iptables -t nat -A UDPSOCKS -p udp -j REDIRECT --to-ports 12346

# iptables -t nat -A OUTPUT -p udp -j UDPSOCKS
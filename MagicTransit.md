# CloudFlare Magic Transit 
This is a list of current ways to "bypass" CloudFlare's magic transit. This should only be used to mitigate the attacks and not to harm any servers.
> Contact Me: https://twitter.com/FuckBinary | https://t.me/trespassed | SmallDoink#0666

## Protocol(s)
- To route the traffic, CloudFlare uses BGP (Border Gateway Protocol) route announcements to contact the AnyCast network.
- To tunnel the traffic, CloudFlare uses GRE tunnels or PNI (Private Network Interconnects)

## Issues/Flaws
- These are not vulnerabilities, but flaws within the firewall. TCP attacks aren't blocked or mitigated well with Magic Transit. TCP Amplification, or TCP packets with various flags will reach the server, bypassing CloudFlare's Firewall.
- Other layer 4 attacks, layer 3 attacks, and layer 7 attacks are mitigated well by the firewall. Most AMP attacks affect the servers, but the most frequent ones are mitigated. 


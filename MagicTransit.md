# CloudFlare Magic Transit 
This is a list of current ways to "bypass" CloudFlare's magic transit. This should only be used to mitigate the attacks and not to harm any servers.
> Contact Me: https://twitter.com/FuckBinary | https://t.me/trespassed | SmallDoink#0666

## Update (7/13/2020)
- CloudFlare still has not released 'FlowTrack', which is their proposed solution to stopping most TCP attacks such as TCP reflection attacks. No mitigation improvments have been made that are noticable,

## Update (4/1/2020)
- CloudFlare Magic Transit is mitigating TCP attacks better than before, with various TCP attacks easily mitigated. Major UDP amplification attacks are also easily mitigated within their recent updates to the network and firewall. 


## Protocol(s)
- To route the traffic, CloudFlare uses BGP (Border Gateway Protocol) route announcements to contact the AnyCast network.
- To tunnel the traffic, CloudFlare uses GRE tunnels or PNI (Private Network Interconnects)

## Issues/Flaws
- Other layer 4 attacks, layer 3 attacks, and layer 7 attacks are mitigated well by the firewall. Most AMP attacks affect the servers, but the most frequent ones are mitigated. 


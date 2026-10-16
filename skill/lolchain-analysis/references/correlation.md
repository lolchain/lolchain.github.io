# Correlate chain and host evidence

Prove the transition from a blockchain read to execution, communication or data movement.

## Build a timeline

Record UTC host-event time, acquisition time and block/slot time separately. Keep clock offset and uncertainty. Order browser/RPC requests, decoded responses, downstream connections, process starts and resulting files; do not substitute block time for the endpoint’s read time.

## Test the claimed role

1. Delivery: connect response bytes to the saved file or script; record the later process or browser execution separately.
2. C2: connect a decoded endpoint or command to a session, task or command result. A lookup can be preparatory without establishing C2.
3. Victim tracking: identify the actual UUID, IP or flag fields and whether they were read or written. Duplicate-visitor checks and sensitive-data exfiltration are different findings.
4. Exfiltration: identify data collected, the sending process, destination and transfer evidence. A skimmer that reads a contract then sends HTTP data is off-chain exfiltration.
5. WebRTC: link the chain-returned script/SDP to ICE negotiation, the selected peer/data channel and later payload handling. Signaling configuration alone does not prove a completed channel.

## Make a proportionate control recommendation

Start with the specific contacted destination, resource or application behavior. Shared RPC/gateway blocking can affect legitimate workloads and does not remove the stored object.

1. Use the Infrastructure page to download hosts/IPs for the chosen provenance and class. Keep the CSV/JSON evidence context alongside the plain list.
2. Retain full URL paths, contract/selectors, canister names, CIDs and IPNS names as separate hunting observables. Host-only exports intentionally omit this precision.
3. Mark source-linked observations, historical indicators, configured routes and community-directory entries distinctly. A community RPC entry is a baseline candidate, not a malicious indicator.

Procedures are LOLCHAIN analyst guidance. Protocol documentation establishes protocol behavior; campaign attribution comes from the technique sources.

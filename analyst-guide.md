# LOLCHAIN Analyst Guide

Analyst procedures are LOLCHAIN guidance; campaign claims and object attribution remain tied to the catalog sources.

Reviewed 2026-10-16 · Catalog snapshot 2026-10-16

## Contents

- [Start an investigation](#start)
- [Chain evidence essentials](#essentials)
- [EVM contracts and transaction data](#evm)
- [Bitcoin transaction channels](#bitcoin)
- [Solana memo resolution](#solana)
- [Cross-chain routing](#cross-chain)
- [IPFS, IPNS and Arweave](#content)
- [NKN and TON transport](#overlays)
- [Canisters, naming and NFTs](#services)
- [Correlate chain and host evidence](#correlation)
- [Write a reproducible finding](#reporting)
- [Technique playbooks](#technique-playbooks)

<a id="start"></a>

# Start an investigation

Establish what the blockchain does in this incident before following addresses.

## 1. Preserve the starting evidence

Work from a captured request, sample, script or published object. Keep original bytes and a SHA-256 hash; do decoding on a copy.

1. Record case ID, UTC acquisition time, artifact path, source URL and the host/process or browser context.
2. Keep HTTP method, full URL, request body, response body and status when available. Separate secret API credentials from the shareable record.
3. For ledger objects, record chain, network, chain ID or cluster, object type and the exact address, transaction hash, signature, CID or name.

## 2. Classify the chain’s role

Decide whether the object holds a payload, returns a pointer, carries commands, tracks visitors or supports transport. One infection chain can use several techniques.

1. Read the matching technique’s playbook and evidence label. Research, implemented capability and observed campaign use have different meanings.
2. A returned URL is resolution; JavaScript returned in the response is payload hosting. A gateway, contract and downstream server are separate objects.
3. Keep case evidence separate from historical examples in this catalog. A matching provider hostname alone does not establish compromise.

## 3. Reproduce the read

Use a trusted explorer or an approved read-only provider. Preserve the request and the raw answer rather than copying only the decoded result.

1. Confirm the correct network. Testnet and mainnet addresses can look identical.
2. Use incident-time blocks or saved responses where possible; record historical-state gaps, missing pages and provider errors.
3. Do not execute retrieved code or visit the decoded destination while interpreting the chain data.

## 4. Decode and correlate

Write down each transformation, with input and output hashes. Then test the proposed chain-to-network relationship against endpoint evidence.

1. Retain offsets, byte order, ABI types, keys and their provenance. A selector database entry is a hypothesis, not a verified function definition.
2. Correlate the read time with browser, process, DNS, proxy and network events. Record the off-chain request that followed, if captured.
3. Separate a downloaded payload from execution, a staged destination from contacted infrastructure, and a command from its result.

## 5. Report a bounded conclusion

Use the reporting chapter for a consistent case record. A useful result explains both what the evidence supports and what remains unknown.

1. Link each assertion to a saved artifact or publication. Mark analyst inferences explicitly.
2. Recommend the narrowest justified network or application control and describe likely shared-service impact.
3. List unconfirmed branches, missing history and further evidence needed. Do not treat ledger activity as a victim count.

Procedures are LOLCHAIN analyst guidance. Protocol documentation establishes protocol behavior; campaign attribution comes from the technique sources.

<a id="essentials"></a>

# Chain evidence essentials

Read the object types and visibility limits before interpreting a transaction list.

## Addresses, contracts and networks

An address identifies an account within a network. A contract account has code; a wallet-like account is not automatically a contract. The same address string on two EVM networks identifies two separate contexts. Record chain/network and chain ID together; testnet observations can be operationally relevant without being mainnet activity.

## Read requests and state changes

A transaction can change state and has an inclusion/status record. A getter read such as eth_call evaluates a request without creating a new transaction. The provider may observe the read, but the ledger does not list everyone who queried it. Keep transaction input, contract return data, stored state and emitted logs distinct.

## Selectors and ABI

In common EVM contract calls, the first four calldata bytes select a function; later bytes encode arguments. The ABI describes how to interpret these fields and return values. A selector match can collide or be intentionally misleading. Verify it against the actual code or the loader’s use of the result.

## Pointers, payloads and transports

A URL returned by a contract is a pointer. Script or file bytes returned by the chain can be a payload. Commands/configuration are another role. A CID addresses content, while IPNS is a mutable name that resolves to content. The RPC/gateway/relay that transports a request is a separate object from the resolved server or the stored content.

## What the evidence can establish

1. Published chain data establishes available bytes/state at a specific context; it does not establish that a victim read or executed them.
2. Host/network evidence establishes the request and subsequent behavior when captured; TLS-only metadata may not disclose the exact method or response.
3. A configured or staged route is a potential path. Disabled modules, research designs and unconfirmed runtime branches retain those limitations.

## Protocol references

- [Ethereum: Ethereum JSON-RPC](https://ethereum.org/developers/docs/apis/json-rpc/)
- [IPFS: IPNS records](https://docs.ipfs.tech/concepts/ipns/)
- [IPFS: IPFS addressing](https://docs.ipfs.tech/how-to/address-ipfs-on-web/)

Procedures are LOLCHAIN analyst guidance. Protocol documentation establishes protocol behavior; campaign attribution comes from the technique sources.

<a id="evm"></a>

# EVM contracts and transaction data

Inspect contract getters, storage, calldata and change history on Ethereum-compatible chains.

## Confirm the object

Identify the network from the captured provider and corroborate it with eth_chainId. Preserve the contract address, input data and incident block. Check runtime code with eth_getCode at the relevant block. An address without code at that block may still be a wallet, a pre-deployment address or a transaction recipient.

## Choose the right read

Use eth_getTransactionByHash for transaction input; eth_getTransactionReceipt for status and logs. For a getter, reproduce the captured eth_call using its original to, data and any relevant from/value fields. Only interpret storage slots when the layout is known. Contract storage is not a list of printable strings.

1. Match a verified ABI to the deployed code and network. Follow a proxy implementation only when evidence supports that relationship.
2. Keep raw ABI return bytes. Decode dynamic strings/bytes using their offsets and lengths; preserve any later hex, Base64, compression or cipher layers.
3. Use the exact captured selector and arguments. Do not guess a getter from its name or assume a familiar ERC-20 selector has normal token semantics.

## Read-only request templates

Replace placeholders with values from evidence. Use an explicit block number in hexadecimal, not latest, for a reproducible historical read. These are RPC examples, not SIEM queries.

```text
{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}
{"jsonrpc":"2.0","id":2,"method":"eth_getCode","params":["<CONTRACT>","<BLOCK_HEX>"]}
{"jsonrpc":"2.0","id":3,"method":"eth_call","params":[{"to":"<CONTRACT>","data":"<CAPTURED_CALLDATA>"},"<BLOCK_HEX>"]}
```

## Decode an ABI string offline · synthetic

This example creates an inert URL under the reserved .example domain, wraps it as one ABI string return and decodes it. Real evidence must use the verified return type, raw captured bytes and a pinned read. Never execute decoded text. This small decoder handles one standard dynamic string result, not arbitrary ABI tuples or packed data.

```text
raw_text = "https://c2.example/x".encode("utf-8")
word = lambda n: n.to_bytes(32, "big")
# Synthetic single-string ABI response: offset, length, padded value.
response = word(32) + word(len(raw_text)) + raw_text.ljust(32, b"\x00")
# For a real capture, use: response = bytes.fromhex(saved_result.removeprefix("0x"))
if len(response) < 64:
    raise ValueError("Truncated response")
offset = int.from_bytes(response[:32], "big")
if offset != 32 or offset + 32 > len(response):
    raise ValueError("Not a single standard ABI string return")
length = int.from_bytes(response[offset:offset+32], "big")
start = offset + 32
if start + length > len(response):
    raise ValueError("Truncated string")
decoded = response[start:start+length].decode("utf-8", errors="strict")
print(decoded)  # inert text only
```

## Reconstruct changes

Compare saved or block-pinned responses around the incident. Keep block hashes as well as numbers, and note the chain’s finality and provider retention. Supporting providers may accept a block-hash object under EIP-1898; support must be checked for the chain/client.

1. A getter call does not create a ledger transaction. Explorer transaction totals cannot count readers or infections.
2. Transactions and events can locate state changes, but logs alone may not expose every update. Absence of an event does not prove unchanged storage.
3. Archive-state errors and an empty result on the wrong network are collection gaps, not evidence that the reported contract never existed.

## Protocol references

- [Ethereum: Ethereum JSON-RPC](https://ethereum.org/developers/docs/apis/json-rpc/)
- [Ethereum: Block-pinned reads (EIP-1898)](https://eips.ethereum.org/EIPS/eip-1898)

Procedures are LOLCHAIN analyst guidance. Protocol documentation establishes protocol behavior; campaign attribution comes from the technique sources.

<a id="bitcoin"></a>

# Bitcoin transaction channels

Inspect OP_RETURN, output values and address bytes without confusing payment activity with malware signaling.

## Collect the exact transaction

Preserve transaction ID, raw transaction, block hash/height, confirmation context and the source of any address history. Bitcoin Core historical lookup depends on available blocks and indexing; it is not a general address-history search.

```text
bitcoin-cli getrawtransaction "<TXID>" false "<BLOCKHASH>"
bitcoin-cli decoderawtransaction "<RAW_TRANSACTION_HEX>"
```

## Identify the field used by the sample

Inspect output scripts and their pushed bytes for OP_RETURN. For amount-based signaling, retain integer satoshi values. For address-based signaling, preserve the decoded address representation and the exact bytes the malware selects.

1. Reproduce output ordering, transaction selection and fallback behavior from the analyzed code. Do not choose a convenient output by eye.
2. Apply only evidenced decoding, decryption and byte order. Keep scripts, ciphertext, decoded bytes and proposed destinations separately.
3. Record history pagination and reorganization/confirmation context. An address can receive irrelevant or adversarial transactions.

## Bound the result

An encoded value becomes a malware destination only when linked to the sample’s selection and decoding logic. Distinguish an attacker-controlled wallet from a public reference address. Transaction counts and coin transfers do not establish a victim total.

## Protocol references

- [Bitcoin Core: Bitcoin raw transaction decoding](https://bitcoincore.org/en/doc/28.0.0/rpc/rawtransactions/decoderawtransaction/)
- [Bitcoin Core: Bitcoin historical transaction lookup](https://bitcoincore.org/en/doc/24.0.0/rpc/rawtransactions/getrawtransaction/)

Procedures are LOLCHAIN analyst guidance. Protocol documentation establishes protocol behavior; campaign attribution comes from the technique sources.

<a id="solana"></a>

# Solana memo resolution

Recover the memo and selection rule that a loader uses, with cluster and commitment recorded.

## Recover the lookup

Extract the address, provider, cluster and selection rule from the loader. getSignaturesForAddress returns signatures referencing an address, newest first; use pagination to cover the incident window. A referenced account is not necessarily the signer or controller.

## Inspect each selected transaction

Retrieve the transaction with getTransaction. Preserve its slot, block time if available, commitment, execution status, account keys, signers and instruction bytes. Inspect memo instructions and inner instructions where the sample’s behavior requires them.

```text
{"jsonrpc":"2.0","id":1,"method":"getSignaturesForAddress","params":["<ADDRESS>",{"limit":100,"commitment":"finalized"}]}
{"jsonrpc":"2.0","id":2,"method":"getTransaction","params":["<SIGNATURE>",{"encoding":"jsonParsed","commitment":"finalized","maxSupportedTransactionVersion":0}]}
```

## Decode and correlate

Use the source program and encoding to interpret the memo. Preserve both encoded and decoded forms; do not run any returned command.

1. Handle unsupported transaction versions as collection limitations. Set the supported version according to the transaction/client, rather than discarding errors.
2. Check failed transaction status and apply the loader’s actual acceptance rule. A memo in address history alone does not prove that it was selected.
3. Correlate the chosen memo with the next HTTP request, payload hash and execution artifacts. Configured fallback RPCs do not prove contact with every provider.

## Protocol references

- [Solana: Solana address history](https://solana.com/docs/rpc/http/getsignaturesforaddress)
- [Solana: Solana transaction retrieval](https://solana.com/docs/rpc/http/gettransaction)

Procedures are LOLCHAIN analyst guidance. Protocol documentation establishes protocol behavior; campaign attribution comes from the technique sources.

<a id="cross-chain"></a>

# Cross-chain routing

Follow application pointers across networks without assuming a bridge or asset transfer.

## Keep each hop independently identifiable

Extract the first-chain request, the response that selects the next object, fallback conditions and any decryption inputs. Create one evidence row per chain/network/object and link the rows with the exact response bytes that establish the pointer.

## TRON lookup

Retrieve the transaction body by transaction ID on the evidenced network. The SolidityNode gettransactionbyid view returns solidified transactions; use the receipt API separately when execution status matters. Preserve raw_data and the exact field the loader reads. Do not assume HTTP 200 means a successful API result.

## Aptos lookup

Preserve the transaction-by-hash response, ledger version/time, status and the Move payload or other field selected by the loader. Distinguish pending from committed transactions. Use Aptos-native parsing rather than treating its response as Ethereum calldata.

## Validate the next hop

1. Decode only the field and transformation used by the sample. A destination-chain transaction hash or pointer is a distinct artifact, not evidence that coins crossed chains.
2. For the BSC/EVM stage, retrieve input or getter output according to the next request. Preserve the chosen chain ID and incident block.
3. Record which branch ran. TRON and Aptos can be redundant alternatives; two configured routes do not establish two successful reads.

## Protocol references

- [TRON: TRON transaction-body lookup](https://developers.tron.network/reference/gettransactionbyid)
- [Aptos: Aptos transaction status and lookup](https://aptos.dev/build/guides/application-integration)
- [Ethereum: Ethereum JSON-RPC](https://ethereum.org/developers/docs/apis/json-rpc/)

Procedures are LOLCHAIN analyst guidance. Protocol documentation establishes protocol behavior; campaign attribution comes from the technique sources.

<a id="content"></a>

# IPFS, IPNS and Arweave

Separate immutable content identifiers, mutable names, gateway transport and stored configuration.

## IPFS: identify the content

Extract the CID, optional path and gateway separately. Handle both /ipfs/<CID>/ paths and <CID>.ipfs.<gateway> subdomains. Preserve the original spelling and the parsed identifier; different encodings can represent the same CID.

1. Save bytes as inert evidence from an approved collection environment; do not render the page or execute the file.
2. Record content type, file hash, size, retrieval time and gateway response. A CID identifies a content structure; a downloaded file’s SHA-256 is not automatically its CID.
3. One CID can be served by different gateways. A provider or gateway is a delivery intermediary, not automatically the uploader or attacker.

## IPNS: preserve the resolution

Keep the mutable name, observation time and resolved /ipfs/ path together. Where tooling exposes the signed record, retain sequence, validity and signature material and note whether you verified it. Gateway resolution delegates trust to that gateway.

1. Compare saved resolutions over time. Today’s answer does not reconstruct an incident-time target.
2. A failed gateway read does not prove the content is gone. Do not silently replace an IPNS name with a current CID in historical evidence.

## Native IPFS transport

If the sample uses peers rather than HTTP gateways, collect peer identifiers, application configuration and connection telemetry. Content routing and peer messaging require application visibility; a gateway-only hostname list will miss native peer traffic.

## Arweave: preserve selection and bytes

Record the query, tags such as a Drive-Id, selected transaction or data-item identifier, gateway, and retrieval time. Preserve transaction metadata and returned data. Separate an upload record from the gateway that serves it, and apply the sample’s ordering and decryption rules. A configured recovery path does not prove it ran.

## Protocol references

- [IPFS: IPFS addressing](https://docs.ipfs.tech/how-to/address-ipfs-on-web/)
- [IPFS: IPFS content routing](https://docs.ipfs.tech/concepts/how-ipfs-works/)
- [IPFS: IPNS records](https://docs.ipfs.tech/concepts/ipns/)
- [Arweave: Arweave HTTP API](https://docs.arweave.org/developers/arweave-node-server/http-api)

Procedures are LOLCHAIN analyst guidance. Protocol documentation establishes protocol behavior; campaign attribution comes from the technique sources.

<a id="overlays"></a>

# NKN and TON transport

Distinguish blockchain-backed lookup from peer messaging that is not stored on the ledger.

## NKN messages

Collect sample configuration, client identifier/public-key address, seed discovery responses, relay connections and process context. Separate client send/publish activity from blockchain wallet transactions. NKN messages travel off-chain; a block explorer is not a message transcript.

1. Correlate send/receive events with commands, screenshots or other local artifacts. Encrypted traffic may permit timing and volume analysis without disclosing its contents.
2. Do not infer client ownership from a relay node. Keep other transports, such as MQTT, in a separate evidence path.

## TON overlay or contract?

Determine whether the artifact is a .adnl destination/local proxy route or a smart-contract/API read. Preserve native addresses and identifiers exactly. A .adnl pseudo-hostname is not an ordinary DNS name.

1. For overlay sessions, collect proxy configuration, process/socket context, peer destinations and the local artifacts that support remote-control or upload claims.
2. For contract lookup, preserve account, network, get-method name, arguments, returned stack and block context. Decode cells/slices using the getter’s structure.
3. Record archive and proof availability. A TON get method is a read; its invocation is not a new ledger transaction. Do not substitute an invented address when a report redacts it.

## Protocol references

- [NKN: NKN client SDK](https://docs.nkn.org/nkn-sdk-js/)
- [NKN: NKN network architecture](https://www.nkn.org/static/doc/NewKindofNetwork_EN.pdf)
- [TON: TON API access and historical coverage](https://docs.ton.org/api/overview)
- [TON: TON get methods](https://docs.ton.org/contracts/blueprint/first-smart-contract)

Procedures are LOLCHAIN analyst guidance. Protocol documentation establishes protocol behavior; campaign attribution comes from the technique sources.

<a id="services"></a>

# Canisters, naming and NFTs

Inspect application identifiers and mutable records without assuming that every lookup is a transaction.

## ICP canister resolution

Preserve the canister principal, exact hostname, request path, method and raw response. Distinguish ordinary HTTP delivery from direct canister query/update calls. Record certification verification where relevant. An update and a query have different execution and authenticity properties; a query is not a public transaction log of readers.

## Namecoin and Emercoin records

Record the name/namespace, resolver or gateway and observed answer. Capture available record history, height/time and expiration context; compare it with DNS/proxy evidence at the incident time.

1. Namecoin .bit resolution can involve Namecoin-aware software or gateways. Preserve both the blockchain name and the ordinary DNS infrastructure used to reach it.
2. Emercoin name-value records can hold DNS-related values. Retain the full record and name_history/name_show outputs when using compatible tooling.
3. A current mapping does not prove a historical destination, and a gateway hostname does not prove ownership of the underlying name.

## NFT metadata or token state

Preserve chain, contract, token ID and incident-time response/state. Follow the demonstrated command path: token fields, events or metadata URI. tokenURI belongs to the optional ERC-721 metadata extension; do not assume every NFT contract implements it.

1. Keep metadata content and URI resolution separate, including IPFS/HTTP retrieval. Token ownership does not by itself attribute control of all linked infrastructure.
2. Research demonstrations remain research unless a separate campaign source supports operational use.

## Protocol references

- [Internet Computer: ICP canister query and update calls](https://docs.internetcomputer.org/concepts/canisters/)
- [Internet Computer: ICP response certification](https://docs.internetcomputer.org/concepts/certified-data/)
- [Namecoin: Namecoin resolution](https://www.namecoin.org/docs/electrum-nmc/)
- [Emercoin: Emercoin name-value history](https://emercoin.com/documentation/blockchain-services/emernvs/)
- [Ethereum: ERC-721 metadata interface](https://eips.ethereum.org/EIPS/eip-721)

Procedures are LOLCHAIN analyst guidance. Protocol documentation establishes protocol behavior; campaign attribution comes from the technique sources.

<a id="correlation"></a>

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

<a id="reporting"></a>

# Write a reproducible finding

Use the same evidence record for every chain and technique.

## Minimum case record

1. Question and scope: case ID, analyst, technique IDs, evidence label and the exact behavior being tested.
2. Artifact provenance: original file/request/source, UTC collection time, SHA-256 and access/collection method.
3. Chain context: chain/network/ID or cluster; object type and exact value; block hash/height or slot/signature; finality/commitment.
4. Read: provider/explorer, method/arguments, raw response, acquisition time, historical-state coverage and any authentication redaction.
5. Transformation: byte range, decoder/ABI, key provenance, ordered steps and hashes of derived files.
6. Correlation: host/process/browser evidence and the next observed action, with timestamps and uncertainty.
7. Conclusion: observed facts, explicit inferences, alternatives, missing evidence and confidence.
8. Control: exact scope, shared-service impact, historical/configured/community qualification and validation owner.

## Confidence

High: the selected chain object, reproducible decode and matching host/network sequence are preserved. Moderate: the decode or source evidence is strong, but one transition lacks telemetry. Low: the finding rests on a configured path, shared provider match or an untested interpretation. Confidence is an analyst assessment; it does not change the catalog’s evidence label.

## Worked example · synthetic

A captured getter read at block B returns a URL. A browser then requests that URL, but no execution artifact is available. Report contract-based resolution and observed retrieval, with execution unconfirmed. Do not report an on-chain payload, a victim count or confirmed code execution from this evidence alone. All values in this example are placeholders, not case indicators.

Procedures are LOLCHAIN analyst guidance. Protocol documentation establishes protocol behavior; campaign attribution comes from the technique sources.

<a id="technique-playbooks"></a>

# Technique playbooks

## LBC-001 · Smart-contract payload hosting

Evidence: Observed · Methods: EVM contracts and transaction data

### Collect

Captured loader, contract, selector/arguments, chain/network and returned bytes.

### Inspect

Reproduce the getter at the incident block; ABI-decode the returned string/bytes, then preserve each script decoding layer.

### Correlate

Match the recovered script hash or content to browser cache, injection and subsequent network/process activity.

### Interpretation limits

If only a URL is returned, classify that step as LBC-003. A reader does not appear as a ledger transaction.

Sources: [Guardio Labs: EtherHiding: hiding malicious code in smart contracts](https://guard.io/labs/etherhiding-hiding-web2-malicious-code-in-web3-smart-contracts), [Israel National Digital Agency: Malware on the blockchain](https://govextra.gov.il/national-digital-agency/cyber/research/malware-on-the-blockchain/), [Expel: ClearFake: new LOTL techniques](https://expel.com/blog/clearfake-new-lotl-techniques/), [VMRay: Pivoting off the blockchain](https://www.vmray.com/threat-intelligence-insights-pivoting-off-the-blockchain/), [Netskope Threat Labs: Malware on the Blockchain: An Ongoing Campaign’s New WebRTC Twist](https://www.netskope.com/blog/malware-on-the-blockchain-an-ongoing-campaigns-new-webrtc-twist), [LOLC2: LOLC2: Blockchain Smart Contracts](https://lolc2.github.io/#blockchain-smart-contracts), [Cisco Talos: ClearFake WebDAV infection chain delivers Amatera stealer, ZigCryptoStealer, and NetSupport Manager](https://blog.talosintelligence.com/clearfake-webdav-infection-chain), [Netskope Threat Labs: Amatera ClickFix: published IOC supplement](https://github.com/netskopeoss/NetskopeThreatLabsIOCs/blob/main/Malware/Amatera%20ClickFix/IOCs/README.md)

## LBC-002 · Transaction calldata as a payload store

Evidence: Observed · Methods: EVM contracts and transaction data

### Collect

Transaction hash/history API response, input field and the loader’s selection rule.

### Inspect

Retrieve the selected transaction input; retain destination, status, block and exact byte offsets before decoding.

### Correlate

Connect the decoded instructions or configuration to the next stage and the loader’s actual history ordering.

### Interpretation limits

Do not confuse calldata with getter return data. A transaction to a burn address does not establish contract execution.

Sources: [Google Threat Intelligence Group: DPRK adopts EtherHiding](https://cloud.google.com/blog/topics/threat-intelligence/dprk-adopts-etherhiding), [Chainalysis: DPRK and Iran are Leading a 5.2x Surge YoY in Blockchain-Assisted Cyberattacks](https://www.chainalysis.com/blog/etherhiding-blockchain-dead-drops/), [GBHackers: DPRK-Linked Hackers Add HashHiding to Blockchain C2 Network for Takedown-Resistant Malware](https://gbhackers.com/hashhiding-to-blockchain-c2/#google_vignette), [Palo Alto Networks Unit 42: Evolution of Web3 in Cloud Supply Chain Attacks](https://unit42.paloaltonetworks.com/web3-cloud-supply-chain-attacks/)

## LBC-003 · Contract-based C2 address resolution

Evidence: Observed · Methods: EVM contracts and transaction data

### Collect

Contract getter request, relevant caller fields, resolver output and configured provider set.

### Inspect

Decode the returned pointer and compare block-pinned answers; reproduce any evidenced decryption or provider-voting rule.

### Correlate

Find the downstream connection in endpoint telemetry and distinguish it from the RPC request.

### Interpretation limits

A public provider is not the C2. A configured provider list is not proof that every provider was contacted.

Sources: [Chainalysis: DPRK and Iran are Leading a 5.2x Surge YoY in Blockchain-Assisted Cyberattacks](https://www.chainalysis.com/blog/etherhiding-blockchain-dead-drops/), [Israel National Digital Agency: Malware on the blockchain](https://govextra.gov.il/national-digital-agency/cyber/research/malware-on-the-blockchain/), [Sysdig Threat Research Team: EtherRAT: Ethereum contract resolution and RPC voting](https://www.sysdig.com/blog/etherrat-dprk-uses-novel-ethereum-implant-in-react2shell-attacks), [Ethereum: Ethereum JSON-RPC API](https://ethereum.org/developers/docs/apis/json-rpc/), [Kaspersky / Securelist: Tsundere: a Node.js botnet that uses Ethereum](https://securelist.com/tsundere-node-js-botnet-uses-ethereum-blockchain/117979/), [Checkmarx: Supply-chain attack using Ethereum smart contracts to distribute multi-platform malware](https://checkmarx.com/uncategorized/supply-chain-attack-using-ethereum-smart-contracts-to-distribute-multi-platform-malware/), [ReversingLabs: Ethereum contracts conceal malicious code](https://www.reversinglabs.com/blog/ethereum-contracts-malicious-code), [Sucuri: SC WordPress malware: a self-healing mesh and blockchain-controlled backdoor](https://blog.sucuri.net/2026/09/sc-wordpress-malware-a-self-healing-mesh-of-loaders-drop-ins-and-a-blockchain-controlled-backdoor.html), [Gelato07 / Cyber Weblog: From Blockchain to Clipboard: Dissecting an EtherHiding ClickFix Attack](https://gelato07.github.io/posts/EtherHiding-Blockchain-ClickFix/), [Hunt.io: The Gentlemen Affiliate Deploys EtherRAT Across Windows Networks Using Ethereum Smart Contract C2](https://hunt.io/blog/the-gentlemen-etherrat-ethereum-smart-contract-c2), [Filescan.io Threat Labs: EtherHiding Under the Hood: On-Chain Forensics Beyond the Public Disclosure](https://blog.filescan.io/posts/Redline-EtherHiding/), [Confiant: Skimming on the Blockchain: A Magecart Campaign That Uses EtherHiding, Found by Malvertising Scanning](https://blog.confiant.com/p/skimming-on-the-blockchain-a-magecart), [LOLC2: LOLC2: Blockchain Smart Contracts](https://lolc2.github.io/#blockchain-smart-contracts), [Elastic Security Labs: REVSTEALER ramps up: analysis of up-and-coming infostealer](https://www.elastic.co/security-labs/threat-command/revstealer-credential-harvesting-infostealer), [Elastic Security Labs: REVSTEALER technical white paper](https://assets.contentstack.io/v3/assets/bltefdd0b53724fa2ce/blt9cd59668ba5a104d/6a97978bd04dac6f166ca8ce/REVSTEALER_-_White_paper.pdf), [ADAMnetworks: HBO Max ads exposed the PasteSwitch ClickFix operation](https://adamnet.works/blog/hbo-max-ads-exposed-the-pasteswitch-clickfix-operation/), [The Hunter’s Ledger: Sliver C2 Windows Post-Exploitation Staging, 193.233.202.17](https://the-hunters-ledger.com/reports/sliver-c2-windows-postex-staging-193-233-202-17/), [Cisco Talos: ClearFake WebDAV infection chain delivers Amatera stealer, ZigCryptoStealer, and NetSupport Manager](https://blog.talosintelligence.com/clearfake-webdav-infection-chain), [Palo Alto Networks Unit 42: Evolution of Web3 in Cloud Supply Chain Attacks](https://unit42.paloaltonetworks.com/web3-cloud-supply-chain-attacks/)

## LBC-004 · On-chain command and configuration retrieval

Evidence: Observed · Methods: EVM contracts and transaction data

### Collect

Polling requests, returned command/configuration bytes and module handling code.

### Inspect

Recover command boundaries, encryption and task selection from the sample; compare responses at incident-time blocks.

### Correlate

Link an identified task to process, file or command-result evidence. Preserve unexecuted tasks separately.

### Interpretation limits

Configuration reads do not prove all modules or commands ran. Do not reclassify a URL-only resolver as a command channel.

Sources: [Palo Alto Networks Unit 42: Analyzing Aeternum’s blockchain-based C2 operations](https://unit42.paloaltonetworks.com/aeternum-blockchain-c2-analysis/), [LOLC2: LOLC2: Blockchain Smart Contracts](https://lolc2.github.io/#blockchain-smart-contracts), [Elastic Security Labs: REVSTEALER ramps up: analysis of up-and-coming infostealer](https://www.elastic.co/security-labs/threat-command/revstealer-credential-harvesting-infostealer), [Elastic Security Labs: REVSTEALER technical white paper](https://assets.contentstack.io/v3/assets/bltefdd0b53724fa2ce/blt9cd59668ba5a104d/6a97978bd04dac6f166ca8ce/REVSTEALER_-_White_paper.pdf)

## LBC-005 · Bitcoin OP_RETURN dead drops

Evidence: Observed · Methods: Bitcoin transaction channels

### Collect

Reference address, transaction history, raw transactions and sample OP_RETURN decoder.

### Inspect

Select the transaction/output exactly as the sample does; extract pushed bytes and reproduce the evidenced decryption.

### Correlate

Correlate the recovered backup domain with a later DNS/proxy/C2 event and the fallback trigger.

### Interpretation limits

A public reference address may not be attacker-owned. OP_RETURN transactions cannot enumerate readers or infected hosts.

Sources: [Google Threat Analysis Group: Disrupting the Glupteba operation](https://blog.google/threat-analysis-group/disrupting-glupteba-operation/), [Chainalysis: DPRK and Iran are Leading a 5.2x Surge YoY in Blockchain-Assisted Cyberattacks](https://www.chainalysis.com/blog/etherhiding-blockchain-dead-drops/), [Trend Micro: Glupteba updates C&C using Bitcoin transactions](https://www.trendmicro.com/tr_tr/research/19/i/glupteba-campaign-hits-network-routers-and-updates-cc-servers-with-data-from-bitcoin-transactions.html)

## LBC-006 · C2 encoded in transaction amounts

Evidence: Observed · Methods: Bitcoin transaction channels

### Collect

Candidate transaction outputs, integer satoshi values and the amount-to-address logic.

### Inspect

Apply the documented output selection, numeric conversion and byte order; retain a reproducible calculation.

### Correlate

Compare the proposed IP with destination connections and recovery timing from the host.

### Interpretation limits

Do not decode arbitrary payments into IPs or use floating-point amounts. A plausible address alone is weak evidence.

Sources: [Akamai SIRT: Bitcoins, blockchains, and botnets](https://www.akamai.com/blog/security/bitcoins--blockchains--and-botnets), [BI.ZONE: RTM: banking malware analysis](https://habr.com/ru/companies/bizone/articles/456804/), [LOLC2: LOLC2: Blockchain Smart Contracts](https://lolc2.github.io/#blockchain-smart-contracts)

## LBC-007 · Recipient-address C2 signaling

Evidence: Observed · Methods: EVM contracts and transaction data

### Collect

Wallet/block scan, selected transfer, sender/recipient bytes and loader selection code.

### Inspect

Determine whether the sample scans blocks or outbound zero-value transfers; decode only the selected recipient bytes.

### Correlate

Match the reconstructed destination to a contacted server and the sample’s other recovery routes.

### Interpretation limits

This need not involve a contract. Wallet activity is signaling evidence, not an infection count or automatic ownership proof.

Sources: [Ransom-ISAC: XCTDH adopts Hash Hiding](https://ransom-isac.org/blog/xctdh-adopts-hash-hiding/), [Open Source Malware: NullReceiver: DPRK C2 technique](https://opensourcemalware.com/blog/nullreceiver-dprk-c2-technique), [Sonatype: Six npm packages use Ethereum transactions to retrieve malicious payloads](https://www.sonatype.com/blog/six-npm-packages-use-ethereum-transactions-to-retrieve-malicious-payloads), [GBHackers: DPRK-Linked Hackers Add HashHiding to Blockchain C2 Network for Takedown-Resistant Malware](https://gbhackers.com/hashhiding-to-blockchain-c2/#google_vignette), [Palo Alto Networks Unit 42: Evolution of Web3 in Cloud Supply Chain Attacks](https://unit42.paloaltonetworks.com/web3-cloud-supply-chain-attacks/)

## LBC-008 · Cross-chain payload routing

Evidence: Observed · Methods: Cross-chain routing, EVM contracts and transaction data

### Collect

TRON/Aptos lookup responses, fallback order and the BSC transaction pointer returned by each route.

### Inspect

Preserve each hop as a separate chain/network/object; retrieve the BSC input and follow the evidenced decryption.

### Correlate

Build the observed route and identify which fallback branch actually executed before the off-chain stage.

### Interpretation limits

Use chain-native parsing for TRON and Aptos; EVM RPC examples apply only to the BSC stage. Do not infer transfers or bridges between chains.

Sources: [Chainalysis: DPRK and Iran are Leading a 5.2x Surge YoY in Blockchain-Assisted Cyberattacks](https://www.chainalysis.com/blog/etherhiding-blockchain-dead-drops/), [GBHackers: DPRK-Linked Hackers Add HashHiding to Blockchain C2 Network for Takedown-Resistant Malware](https://gbhackers.com/hashhiding-to-blockchain-c2/#google_vignette), [Palo Alto Networks Unit 42: Evolution of Web3 in Cloud Supply Chain Attacks](https://unit42.paloaltonetworks.com/web3-cloud-supply-chain-attacks/)

## LBC-009 · On-chain victim tracking

Evidence: Observed · Methods: EVM contracts and transaction data

### Collect

Visitor UUID/cookie, contract request, any transaction and the schema of telemetry fields.

### Inspect

Identify whether the code checks a flag or writes IP/visitor data. Preserve field-level decoded evidence and transaction status.

### Correlate

Link a specific visitor check/write to browser-session timestamps without exposing unnecessary personal data in the report.

### Interpretation limits

A getter check is not a write. UUID de-duplication is not automatically IP or file exfiltration; raw counts are not unique victims.

Sources: [Israel National Digital Agency: Malware on the blockchain](https://govextra.gov.il/national-digital-agency/cyber/research/malware-on-the-blockchain/), [Expel: ClearFake: new LOTL techniques](https://expel.com/blog/clearfake-new-lotl-techniques/), [Cisco Talos: ClearFake WebDAV infection chain delivers Amatera stealer, ZigCryptoStealer, and NetSupport Manager](https://blog.talosintelligence.com/clearfake-webdav-infection-chain)

## LBC-010 · Blockchain DNS for C2 and delivery

Evidence: Observed · Methods: Canisters, naming and NFTs

### Collect

Original .bit name, resolver configuration, chain record and observed DNS/HTTP resolution path.

### Inspect

Capture the available record/history and expiration context; separate Namecoin data from gateway/resolver responses.

### Correlate

Compare the incident-time answer with the actual download/C2 destination from the host.

### Interpretation limits

Current records can differ from historical answers. Ordinary gateway DNS infrastructure is not the blockchain name itself.

Sources: [Microsoft: Behavior monitoring stops a Dofoil campaign](https://www.microsoft.com/en-us/security/blog/2018/03/07/behavior-monitoring-combined-with-machine-learning-spoils-a-massive-dofoil-coin-mining-campaign/), [Mandiant / FireEye: Blockchain infrastructure use in cyber crime](https://cloud.google.com/blog/topics/threat-intelligence/how-rise-cryptocurrencies-shaping-cyber-crime-landscape-blockchain-infrastructure-use), [BI.ZONE: RTM: banking malware analysis](https://habr.com/ru/companies/bizone/articles/456804/), [Positive Technologies: Namecoin and malware infrastructure](https://habr.com/ru/companies/pt/articles/460857/), [ESET: Read The Manual: banking malware research](https://web-assets.esetstatic.com/wls/2017/02/Read-The-Manual.pdf)

## LBC-011 · Emercoin naming for malicious infrastructure

Evidence: Observed · Methods: Canisters, naming and NFTs

### Collect

Emercoin namespace/name, name-value data, gateway and incident-time resolution.

### Inspect

Inspect complete name_show/name_history results where available; preserve TTL/expiration and field interpretation.

### Correlate

Connect the resolved destination to the browser/process that used the name.

### Interpretation limits

Do not treat all names in a namespace as malicious or infer owner identity from a shared gateway.

Sources: [Mandiant / FireEye: Blockchain infrastructure use in cyber crime](https://cloud.google.com/blog/topics/threat-intelligence/how-rise-cryptocurrencies-shaping-cyber-crime-landscape-blockchain-infrastructure-use)

## LBC-012 · Content-addressed payload and phishing hosting

Evidence: Observed · Methods: IPFS, IPNS and Arweave

### Collect

CID, optional path, gateway form, HTTP response and payload/page bytes.

### Inspect

Parse path/subdomain addressing; preserve the CID and inert bytes plus file hash without rendering the page.

### Correlate

Match the artifact to download, execution or credential-collection telemetry and any subsequent destination.

### Interpretation limits

Gateway ownership is not uploader attribution. Content hosting does not establish that credentials or files were exfiltrated over IPFS.

Sources: [Trend Micro: IPFS: a new data frontier or a cybercriminal hideout?](https://www.trendaisecurity.com/en-us/resources-insights/deep-research/ipfs-a-new-data-frontier-or-a-new-cybercriminal-hideout), [IPFS: IPFS network configuration and ports](https://docs.ipfs.tech/how-to/nat-configuration/), [Cisco Talos: IPFS abuse](https://blog.talosintelligence.com/ipfs-abuse/), [Cisco Talos: Dark Utilities: malicious campaigns from C2-as-a-service](https://blog.talosintelligence.com/dark-utilities/), [Proofpoint: 10 things I hate about attribution: RomCom vs. TransferLoader](https://www.proofpoint.com/us/blog/threat-insight/10-things-i-hate-about-attribution-romcom-vs-transferloader), [Securonix: Dead#Vax: multi-stage VHD delivery and self-parsing batch scripts](https://www.securonix.com/blog/deadvax-threat-research-security-advisory/), [Datadog Security Labs: Compromised AsyncAPI npm packages: inside a CI supply-chain attack](https://securitylabs.datadoghq.com/articles/compromised-asyncapi-npm-packages/), [Microsoft: Unpacking the AsyncAPI npm supply-chain compromise](https://www.microsoft.com/en-us/security/blog/2026/07/15/unpacking-asyncapi-npm-supply-chain-compromise-import-time-payload-delivery/), [Cofense: IPFS abuse continues as attackers mix and match techniques](https://cofense.com/blog/ipfs-abuse-continues-as-attackers-mix-and-match-techniques/), [Forcepoint X-Labs: Unpacking a curious 2-in-1 threat](https://www.forcepoint.com/blog/x-labs/phishing-malware-combo-threat)

## LBC-013 · Peer-to-peer C2 over IPFS infrastructure

Evidence: Observed · Methods: IPFS, IPNS and Arweave

### Collect

IPFS peer/client configuration, process sockets and available application messages.

### Inspect

Determine whether the sample uses native peer messaging, content retrieval or both; preserve peer IDs and session context.

### Correlate

Relate peer traffic to host commands or results using application/endpoint evidence.

### Interpretation limits

HTTP gateway inventory does not cover native peer traffic. A peer connection alone does not reveal message contents or attacker control.

Sources: [Intezer: IPStorm cross-platform malware analysis](https://intezer.com/blog/a-storm-is-brewing-ipstorm-now-has-linux-malware)

## LBC-014 · Generated content identifiers for C2 discovery

Evidence: Research · Methods: IPFS, IPNS and Arweave

### Collect

Research algorithm, identifier-generation inputs, time/seed parameters and a preserved demonstration trace.

### Inspect

Reproduce candidate identifiers offline from the supplied algorithm and recorded inputs; compare with the trace.

### Correlate

Explain which generated identifiers were actually requested and what the demonstration returned.

### Interpretation limits

Keep this as research unless independent operational evidence exists. Do not probe generated identifiers on public networks by default.

Sources: [Patsakis & Casino: Hydras and IPFS: a decentralised playground for malware](https://arxiv.org/abs/1905.11880)

## LBC-015 · NKN overlay command and control

Evidence: Observed · Methods: NKN and TON transport

### Collect

NKN client identity, seed discovery, selected relay and malware message-handling code.

### Inspect

Separate discovery, relay sessions and NKN messaging from wallet transactions; preserve encrypted message envelopes if available.

### Correlate

Link incoming messages to commands and host behavior; keep MQTT or other parallel channels distinct.

### Interpretation limits

A relay is not automatically attacker-owned. Ledger history cannot reconstruct off-chain NKN message contents.

Sources: [Kaspersky GERT / Securelist: Unveiling NKAbuse](https://securelist.com/unveiling-nkabuse/111512/), [Palo Alto Networks Unit 42: NGLite in a targeted attack campaign](https://unit42.paloaltonetworks.com/manageengine-godzilla-nglite-kdcsponge/), [AhnLab ASEC: NKNShell malware distributed via VPN website](https://asec.ahnlab.com/en/91139/)

## LBC-016 · Data return over NKN messaging

Evidence: Observed · Methods: NKN and TON transport

### Collect

NKN send events, client/recipient identity and locally collected screenshots, output or system information.

### Inspect

Map serialized message fields to local artifacts; keep encryption/key provenance and message direction.

### Correlate

Correlate a specific send with data collection, process context and connection timing/volume.

### Interpretation limits

Code capable of sending data is not proof of a completed transfer. Do not claim public-chain storage of overlay messages.

Sources: [Kaspersky GERT / Securelist: Unveiling NKAbuse](https://securelist.com/unveiling-nkabuse/111512/), [AhnLab ASEC: NKNShell malware distributed via VPN website](https://asec.ahnlab.com/en/91139/)

## LBC-017 · TON overlay transport for remote control

Evidence: Observed · Methods: NKN and TON transport

### Collect

Android/app artifacts, .adnl destination, local TON proxy configuration and session telemetry.

### Inspect

Trace the app-to-local-proxy-to-overlay route; keep pseudo-hostnames and native peer identifiers intact.

### Correlate

Match remote-control or upload activity to screen/file/network evidence from the device.

### Interpretation limits

Do not put .adnl identifiers in ordinary DNS hostname blocklists. This is distinct from TON smart-contract resolution.

Sources: [ThreatFabric: TrickMo variant C: TON transport and device takeover](https://www.threatfabric.com/blogs/new-trickmo-variant-device-take-over-malware-targeting-banking-fintech-wallet-auth-app)

## LBC-018 · ICP canister as a dead-drop resolver

Evidence: Observed · Methods: Canisters, naming and NFTs

### Collect

Canister principal/hostname, polling request, returned URL and loader artifact.

### Inspect

Inspect the exact canister response and method; preserve query/update/HTTP distinctions and certification context.

### Correlate

Find the subsequent fetch in host telemetry and preserve the downloaded artifact hash.

### Interpretation limits

A shared parent domain is broader than the canister hostname. Query readers are not enumerable as ordinary ledger transactions.

Sources: [Aikido Security: TeamPCP deploys CanisterWorm on npm](https://www.aikido.dev/blog/teampcp-deploys-worm-npm-trivy-compromise)

## LBC-019 · Ransomware communication proxy discovery

Evidence: Observed · Methods: EVM contracts and transaction data

### Collect

Polygon getter request, returned messaging-proxy address and fallback RPC configuration.

### Inspect

Reproduce the pointer read and any decode at the incident block; retain state changes over the relevant window.

### Correlate

Connect the resolved proxy to captured victim–operator communication metadata.

### Interpretation limits

The message relay is off-chain. A pointer does not show message contents, and configured RPCs do not prove use.

Sources: [Group-IB: DeadLock: smart contracts for malicious purposes](https://www.group-ib.com/blog/deadlock-ransomware-polygon-smart-contracts/)

## LBC-020 · Blockchain covert data channels

Evidence: Research · Methods: Bitcoin transaction channels

### Collect

Research protocol, Bitcoin testnet trace, encoded transaction material and evaluation parameters.

### Inspect

Apply the paper’s channel-specific extraction to the supplied trace and preserve each transformation.

### Correlate

Distinguish protocol feasibility from a real host sending sensitive data; report the experiment’s actual scope.

### Interpretation limits

A covert-channel demonstration is not measured malware prevalence or proof of operational exfiltration.

Sources: [Ma et al.: ABC-Channel: an advanced blockchain-based covert channel](https://arxiv.org/abs/2403.06261)

## LBC-021 · Decentralized ransomware service coordination

Evidence: Research · Methods: EVM contracts and transaction data, IPFS, IPNS and Arweave

### Collect

Research contract/workflow, Ethereum transactions, IPFS identifiers and the demonstration’s actor roles.

### Inspect

Map coordination state and content references separately using EVM and content procedures.

### Correlate

Reconstruct only the demonstrated coordination path and any supplied execution evidence.

### Interpretation limits

Do not describe the research architecture as an attributed ransomware group or assume its IPFS objects store victim data.

Sources: [Karapapas et al.: Ransomware as a service using smart contracts and IPFS](https://arxiv.org/abs/2003.04426)

## LBC-022 · Solana memo dead-drop resolution

Evidence: Observed · Methods: Solana memo resolution

### Collect

Wallet, cluster, getSignaturesForAddress/getTransaction responses and loader memo-selection rule.

### Inspect

Page history to the incident window, inspect transaction status/instructions and decode the selected memo.

### Correlate

Match the next-stage URL/content to the loader’s request and later execution or collection events.

### Interpretation limits

Address references need not be signatures by that address. A configured fallback route is not a confirmed session.

Sources: [Socket: GlassWorm loader: Solana transaction memos](https://socket.dev/blog/glassworm-loader-hits-open-vsx-via-suspected-developer-account-compromise), [StepSecurity: Malicious npm releases in popular React Native packages](https://www.stepsecurity.io/blog/malicious-npm-releases-found-in-popular-react-native-packages---130k-monthly-downloads-compromised), [Sonatype: Hijacked npm packages deliver malware via Solana](https://www.sonatype.com/blog/hijacked-npm-packages-deliver-malware-via-solana-linked-to-glassworm), [StepSecurity: ForceMemo: GitHub Python repositories compromised via account takeover](https://www.stepsecurity.io/blog/forcememo-hundreds-of-github-python-repos-compromised-via-account-takeover-and-force-push)

## LBC-023 · Mutable IPNS C2 recovery

Evidence: Observed · Methods: IPFS, IPNS and Arweave

### Collect

Stable IPNS name, fallback trigger, time-stamped resolution and resulting CID/path.

### Inspect

Preserve the IPNS record where available, verification status and the exact target fetched at that time.

### Correlate

Correlate the failed original connection, IPNS recovery and new downstream request.

### Interpretation limits

IPNS names are mutable names, not CIDs. A present-day resolution cannot establish an old C2 target.

Sources: [IPFS: IPNS: mutable content addressing](https://docs.ipfs.tech/concepts/ipns/), [Volexity: Charming Kitten updates POWERSTAR with an InterPlanetary twist](https://www.volexity.com/blog/2023/06/28/charming-kitten-updates-powerstar-with-an-interplanetary-twist/), [Zscaler ThreatLabz: Technical analysis of TransferLoader](https://www.zscaler.com/blogs/security-research/technical-analysis-transferloader)

## LBC-024 · Arweave-backed configuration recovery

Evidence: Implemented · Methods: IPFS, IPNS and Arweave

### Collect

Arweave query/tags, selection logic, returned transaction/data-item ID and encrypted configuration.

### Inspect

Recover the selected data from preserved responses; apply the sample’s keys and decode sequence.

### Correlate

Establish whether the Arweave branch ran and connect the recovered transport settings to host activity.

### Interpretation limits

The cited intrusion did not confirm runtime use. Code connected to a sample is not proof of execution in that incident.

Sources: [The DFIR Report: EtherRAT and TukTuk before The Gentlemen ransomware](https://thedfirreport.com/2026/05/11/flash-alert-etherrat-and-tuktuk-c2-end-in-the-gentleman-ransomware/)

## LBC-025 · NFT-backed command channels

Evidence: Research · Methods: Canisters, naming and NFTs

### Collect

Research NFT contract, token ID, state/metadata/event source and demonstration trace.

### Inspect

Identify the field used as the command channel and retrieve its incident/demo-time value or saved response.

### Correlate

Link a decoded command/result to the supplied demonstration, keeping token ownership and infrastructure control separate.

### Interpretation limits

The metadata interface is optional. The catalog entry is research, not an operational campaign attribution.

Sources: [Mauro Eldritch & Cybelle Oliveira / Adversary Village: MFT: Malicious Fungible Tokens — DEF CON 32](https://adversaryvillage.org/adversary-events/DEFCON-32/Mauro-Eldritch/)

## LBC-026 · Contract-backed platform-specific delivery

Evidence: Observed · Methods: EVM contracts and transaction data

### Collect

First-stage request, subsequent contract/selectors and captured platform detection/branch logic.

### Inspect

Record each return value and contract hop on its actual network; preserve which platform branch was chosen.

### Correlate

Connect the selected platform payload with browser/OS evidence and subsequent execution artifacts.

### Interpretation limits

Several contracts on one network are not automatically cross-chain routing. Unselected platform branches remain code capabilities.

Sources: [Expel: ClearFake: new LOTL techniques](https://expel.com/blog/clearfake-new-lotl-techniques/), [VMRay: Pivoting off the blockchain](https://www.vmray.com/threat-intelligence-insights-pivoting-off-the-blockchain/), [Checkmarx: Supply-chain attack using Ethereum smart contracts to distribute multi-platform malware](https://checkmarx.com/uncategorized/supply-chain-attack-using-ethereum-smart-contracts-to-distribute-multi-platform-malware/), [Cisco Talos: ClearFake WebDAV infection chain delivers Amatera stealer, ZigCryptoStealer, and NetSupport Manager](https://blog.talosintelligence.com/clearfake-webdav-infection-chain)

## LBC-027 · Blockchain-backed ClickFix execution

Evidence: Observed · Methods: EVM contracts and transaction data

### Collect

Page/loader, chain-returned lure code, displayed instruction and browser-to-shell evidence.

### Inspect

Decode the chain stage as inert text and separate it from the user instruction and shell command.

### Correlate

Correlate copy/paste or execution artifacts with the subsequent payload; record gaps if only the lure was seen.

### Interpretation limits

A blockchain request alone does not prove ClickFix execution. General ClickFix detections are not blockchain-specific evidence.

Sources: [Israel National Digital Agency: Malware on the blockchain](https://govextra.gov.il/national-digital-agency/cyber/research/malware-on-the-blockchain/), [Expel: ClearFake: new LOTL techniques](https://expel.com/blog/clearfake-new-lotl-techniques/), [VMRay: Pivoting off the blockchain](https://www.vmray.com/threat-intelligence-insights-pivoting-off-the-blockchain/), [Gelato07 / Cyber Weblog: From Blockchain to Clipboard: Dissecting an EtherHiding ClickFix Attack](https://gelato07.github.io/posts/EtherHiding-Blockchain-ClickFix/), [Netskope Threat Labs: Malware on the Blockchain: An Ongoing Campaign’s New WebRTC Twist](https://www.netskope.com/blog/malware-on-the-blockchain-an-ongoing-campaigns-new-webrtc-twist), [ADAMnetworks: HBO Max ads exposed the PasteSwitch ClickFix operation](https://adamnet.works/blog/hbo-max-ads-exposed-the-pasteswitch-clickfix-operation/), [Cisco Talos: ClearFake WebDAV infection chain delivers Amatera stealer, ZigCryptoStealer, and NetSupport Manager](https://blog.talosintelligence.com/clearfake-webdav-infection-chain)

## LBC-028 · Contract-routed payment skimming

Evidence: Observed · Methods: EVM contracts and transaction data

### Collect

Injected browser script, resolver/hosting contract response, skimmer code and transfer telemetry.

### Inspect

Recover the destination and distinguish plaintext/encrypted variants; identify enabled collection and transmission paths.

### Correlate

Match card-field access to actual HTTP/WebSocket sends when captured; separate contacted hosts from staged hosts.

### Interpretation limits

Contract routing does not mean card data is stored on-chain. Alternative code paths are not confirmed transfers.

Sources: [Source Defense: New Magecart attack uses blockchain to hide skimmer infrastructure](https://sourcedefense.com/resources/sd-research/new-magecart-attack-uses-blockchain-to-hide-skimmer-infrastructure/), [Source Defense: Malicious blockchain contracts: the EtherHiding tracker](https://sourcedefense.com/resources/sd-research/malicious-blockchain-contracts-the-etherhiding-tracker/), [Source Defense: Blockchain C2 and fileless execution make Magecart harder to disrupt](https://sourcedefense.com/resources/sd-research/blockchain-c2-and-fileless-execution-make-magecart-harder-to-disrupt/), [Trinity Cyber: Lost in the Ether: unravelling a JavaScript card-skimming campaign](https://www.trinitycyber.com/blog/lost-in-the-ether-unravelling-a-javascript-card-skimming-campaign), [Confiant: Skimming on the Blockchain: A Magecart Campaign That Uses EtherHiding, Found by Malvertising Scanning](https://blog.confiant.com/p/skimming-on-the-blockchain-a-magecart)

## LBC-029 · Split-secret encrypted contract configuration

Evidence: Observed · Methods: EVM contracts and transaction data

### Collect

Encrypted contract value, compromised-site password/key material and the decoding routine.

### Inspect

Preserve both halves and provenance; reproduce decryption offline with input/output hashes.

### Correlate

Link the recovered destination only to the individually evidenced encrypted loader and its network behavior.

### Interpretation limits

A contract alone may be insufficient. Do not attach the whole plaintext tracker or infer encrypted transport from encrypted storage.

Sources: [Source Defense: Magecart expands to 97 Ethereum contracts and adds encryption](https://sourcedefense.com/resources/sd-research/magecart-expands-to-97-ethereum-contracts-and-adds-encryption/), [Source Defense: Malicious blockchain contracts: the EtherHiding tracker](https://sourcedefense.com/resources/sd-research/malicious-blockchain-contracts-the-etherhiding-tracker/), [Confiant: Skimming on the Blockchain: A Magecart Campaign That Uses EtherHiding, Found by Malvertising Scanning](https://blog.confiant.com/p/skimming-on-the-blockchain-a-magecart)

## LBC-030 · TON smart-contract C2 resolution

Evidence: Observed · Methods: NKN and TON transport

### Collect

TON API get-method request, account if available, returned stack and incident network/block context.

### Inspect

Decode the getter result using the sample’s method and cell/stack interpretation; compare saved historical values.

### Correlate

Connect the resolved domain to a captured follow-on session from the affected host.

### Interpretation limits

The cited report redacts the account. Mark it unavailable; do not invent an explorer link or substitute a TON overlay destination.

Sources: [ITOCHU Cyber & Intelligence: Hotel-industry email attacks, part 2: technical details](https://blog-en.itochuci.co.jp/entry/2026/08/28/130100)

## LBC-031 · Blockchain-controlled server-side loader mesh

Evidence: Observed · Methods: EVM contracts and transaction data

### Collect

WordPress files/persistence locations, RPC request/selectors and off-chain POST artifacts.

### Inspect

Reconstruct the server-side loader path and decode captured responses; keep site/session collection logic separate.

### Correlate

Correlate web-server execution and POSTs with the resolved endpoint and persisted loader locations.

### Interpretation limits

The report omits full contract/network details and exact RPC hosts. Missing values stay unknown; a selector is not a complete contract IOC.

Sources: [Sucuri: SC WordPress malware: a self-healing mesh and blockchain-controlled backdoor](https://blog.sucuri.net/2026/09/sc-wordpress-malware-a-self-healing-mesh-of-loaders-drop-ins-and-a-blockchain-controlled-backdoor.html)

## LBC-032 · Blockchain fallback in multi-channel bootstrapping

Evidence: Implemented · Methods: EVM contracts and transaction data, IPFS, IPNS and Arweave

### Collect

Multi-channel loader configuration, IPFS stage, Ethereum branch and module enable/disable state.

### Inspect

Map fallback conditions and determine which route ran from captured requests; inspect IPFS and EVM evidence separately.

### Correlate

Tie enabled behavior to payload and process artifacts; mark disabled collection/propagation features as code-only.

### Interpretation limits

Ethereum configuration is not a confirmed command exchange. Do not report disabled exfiltration modules as observed data loss.

Sources: [StepSecurity: Coordinated AsyncAPI supply-chain attack: Miasma RAT](https://www.stepsecurity.io/blog/compromised-next-branch-pushes-malicious-asyncapi-generator-generator-helpers-and-generator-components-to-npm), [Datadog Security Labs: Compromised AsyncAPI npm packages: inside a CI supply-chain attack](https://securitylabs.datadoghq.com/articles/compromised-asyncapi-npm-packages/), [Microsoft: Unpacking the AsyncAPI npm supply-chain compromise](https://www.microsoft.com/en-us/security/blog/2026/07/15/unpacking-asyncapi-npm-supply-chain-compromise-import-time-payload-delivery/)

## LBC-033 · Blockchain-staged browser WebRTC payload channel

Evidence: Observed · Methods: EVM contracts and transaction data

### Collect

BSC-testnet getter response, staged JavaScript, SDP/ICE/DTLS parameters and browser session evidence.

### Inspect

Decode the returned script offline; preserve hardcoded signaling material and any CSP nonce/Function branch.

### Correlate

Match ICE negotiation and a selected WebRTC data channel to buffered payload bytes and later DOM/execution artifacts.

### Interpretation limits

SDP in chain data is signaling, not the payload transport itself. A failed negotiation does not prove delivery or on-chain exfiltration.

Sources: [Netskope Threat Labs: Malware on the Blockchain: An Ongoing Campaign’s New WebRTC Twist](https://www.netskope.com/blog/malware-on-the-blockchain-an-ongoing-campaigns-new-webrtc-twist), [Netskope Threat Labs: Amatera ClickFix: published IOC supplement](https://github.com/netskopeoss/NetskopeThreatLabsIOCs/blob/main/Malware/Amatera%20ClickFix/IOCs/README.md)

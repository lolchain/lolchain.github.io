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

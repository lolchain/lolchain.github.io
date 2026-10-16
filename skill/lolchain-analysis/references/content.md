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

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

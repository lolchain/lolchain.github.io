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

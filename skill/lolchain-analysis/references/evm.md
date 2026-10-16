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

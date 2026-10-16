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

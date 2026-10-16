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

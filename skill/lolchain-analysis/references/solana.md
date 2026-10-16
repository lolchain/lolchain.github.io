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

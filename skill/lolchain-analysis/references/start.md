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

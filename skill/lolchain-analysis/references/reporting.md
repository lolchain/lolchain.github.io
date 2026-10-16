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

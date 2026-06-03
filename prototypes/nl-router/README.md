# NL Router (prototype)

Experimental natural-language router that maps free-text requests ("check the
balance of DE89…", "transfer 100 EUR to …") to IBM Bank CLI operations by
invoking the teller and back-office clients directly.

Prototype only — **not** part of the production services. Kept for reference
while evaluating conversational front-ends.

```bash
python classic_flow.py
```

It shells out to the sibling CLIs under `services/teller-cli/` and
`services/backoffice-cli/`, so those must be runnable and `COREBANK_URL` set.

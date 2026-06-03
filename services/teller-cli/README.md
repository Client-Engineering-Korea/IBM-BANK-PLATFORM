# Teller CLI

Command-line client used by branch tellers against the core banking API.

## Usage

```bash
pip install -r requirements.txt
export COREBANK_URL=http://127.0.0.1:8000   # defaults to this if unset

# Balance inquiry + latest ledger rows
python teller_client.py --src-iban DE89545769475769453536

# Internal transfer
python teller_client.py --src-iban <SRC_IBAN> --dst-iban <DST_IBAN> --amount 100.00

# Print an overdraft request for the back office
python teller_client.py --src-iban <SRC_IBAN> --request-overdraft 2000
```

| Variable       | Default                   | Description           |
|----------------|---------------------------|-----------------------|
| `COREBANK_URL` | `http://127.0.0.1:8000`   | Core banking API base |

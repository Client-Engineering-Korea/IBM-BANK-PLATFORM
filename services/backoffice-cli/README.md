# Back-office CLI

Command-line client used by the operations centre. Requires the **BACKOFFICE**
role on the core banking API.

## Usage

```bash
pip install -r requirements.txt
export COREBANK_URL=http://127.0.0.1:8000   # defaults to this if unset

# Look up a customer by IBAN or by name substring
python backoffice_client.py --iban DE89545769475769453536
python backoffice_client.py --customer-name "Mueller"

# Grant / change an overdraft limit (0–10 000 EUR)
python backoffice_client.py --iban <IBAN> --set-overdraft 2500

# Post a fee reversal (default 15.00 EUR)
python backoffice_client.py --iban <IBAN> --fee-reversal-iban <IBAN> --fee-reversal-amount 15.00
```

| Variable       | Default                   | Description           |
|----------------|---------------------------|-----------------------|
| `COREBANK_URL` | `http://127.0.0.1:8000`   | Core banking API base |

# Core Banking API

FastAPI service backing the IBM Bank core ledger.

## Endpoints

| Method | Path                                  | Role        | Description                          |
|--------|---------------------------------------|-------------|--------------------------------------|
| POST   | `/token`                              | —           | OAuth2 password login → access token |
| GET    | `/accounts`                           | TELLER+     | List accounts (BACKOFFICE sees all fields) |
| GET    | `/customers`                          | BACKOFFICE  | List customers (PII)                 |
| GET    | `/transactions/{account_id}`          | TELLER+     | Account ledger                       |
| POST   | `/transfer`                           | TELLER+     | Internal transfer (debit + credit)   |
| PATCH  | `/accounts/{account_id}/overdraft`    | BACKOFFICE  | Set overdraft limit (0–10 000 EUR)   |
| POST   | `/transactions/{account_id}`          | BACKOFFICE  | Manual FEE_REVERSAL / MANUAL_ADJ     |

## Run

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Interactive docs: http://127.0.0.1:8000/docs

## Configuration

| Variable           | Default               | Description                  |
|--------------------|-----------------------|------------------------------|
| `COREBANK_DB_PATH` | `./data/corebank.db`  | Path to the SQLite ledger    |

## Data model

The ledger (`data/corebank.db`) holds `users`, `customers`, `accounts`, and
`transactions`. An account balance is the sum of its transaction amounts;
transfers post two rows (`TRANSFER_OUT` debit + `TRANSFER_IN` credit) and are
rejected when they would breach the account's overdraft limit.

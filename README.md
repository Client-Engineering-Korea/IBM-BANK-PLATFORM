# IBM Bank — Core Banking Platform

Monorepo for IBM Bank's core banking platform: the ledger API, the operational
CLIs used by branch and back-office staff, the data/analytics tooling, and the
customer-facing web applications.

## Repository layout

```
ibm-bank-platform/
├── services/
│   ├── core-banking-api/     FastAPI core ledger service (accounts, transfers, ...)
│   ├── teller-cli/           Branch teller command-line client
│   └── backoffice-cli/       Operations-centre command-line client
├── data-platform/
│   ├── pipelines/            Batch ingestion / ETL jobs
│   └── generators/           Synthetic data generation for lower environments
├── apps/
│   └── teller-web/           Teller web front-end (React / IBM Carbon)  — see its README
└── prototypes/
    └── nl-router/            Experimental natural-language → operation router
```

## Services overview

| Component            | Stack            | Purpose                                                  |
|----------------------|------------------|----------------------------------------------------------|
| `core-banking-api`   | Python / FastAPI | OAuth2 auth, accounts, customers, transactions, transfers |
| `teller-cli`         | Python           | Balance inquiry, ledger view, internal transfers          |
| `backoffice-cli`     | Python           | Customer lookup, overdraft limits, manual fee reversals   |
| `data-platform`      | Python           | CSV ingestion, model fetch, synthetic data for test envs  |
| `apps/teller-web`    | React / Carbon   | Modern teller front-end (built on the core banking API)   |

## Roles & access

The platform uses two roles, enforced by the core banking API:

- **TELLER** — customer-facing operations: balance inquiry, ledger, transfers.
- **BACKOFFICE** — privileged operations: customer PII, overdraft limits, manual
  adjustments and fee reversals.

## Local development

Start the core banking API, then point the CLIs at it:

```bash
# 1. core banking API
cd services/core-banking-api
pip install -r requirements.txt
uvicorn app.main:app --reload          # serves http://127.0.0.1:8000

# 2. teller CLI (separate shell)
cd services/teller-cli
pip install -r requirements.txt
export COREBANK_URL=http://127.0.0.1:8000
python teller_client.py --src-iban DE89545769475769453536
```

Both CLIs read the API base URL from the `COREBANK_URL` environment variable
(default `http://127.0.0.1:8000`).

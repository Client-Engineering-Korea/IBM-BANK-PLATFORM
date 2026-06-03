# Teller Web (planned)

Modern teller front-end for IBM Bank, to be built with **React** and the
**IBM Carbon Design System**, talking to the core banking API.

This app is not implemented yet — it is the next deliverable on the roadmap.

## Contract

- **Backend (core banking API):** `https://ibm-corebanking.2alcc5emod4t.us-south.codeengine.appdomain.cloud`
  (locally: `http://127.0.0.1:8000`)
- **Reference behaviour:** mirror the operations in
  [`services/teller-cli/teller_client.py`](../../services/teller-cli/teller_client.py)
  (balance inquiry, ledger view, internal transfer, overdraft request).
- **Auth:** OAuth2 password flow against `POST /token`. Credentials come from a
  `.env` file (do not hard-code).

## Expected scope

- Login page (Carbon form components)
- Dashboard with "IBM Bank" branding and a live backend status indicator
- Balance inquiry, transaction history (Carbon data table), internal transfer,
  overdraft request, account detail

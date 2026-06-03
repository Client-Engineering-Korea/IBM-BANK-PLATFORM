# Data Platform

Batch data tooling for IBM Bank's analytics and lower (non-production)
environments.

```
data-platform/
├── pipelines/
│   └── data_pipeline.py        CSV ingestion + archival/upload + model fetch
└── generators/
    └── synthetic_generator.py  Synthetic user/account data for test envs
```

## Components

- **`pipelines/data_pipeline.py`** — ingests uploaded CSVs into SQLite, archives
  and ships directories, and fetches model artifacts from remote hosts.
- **`generators/synthetic_generator.py`** — produces synthetic user records,
  tokens, and JWTs used to seed non-production environments.

## Run

```bash
pip install -r requirements.txt
python pipelines/data_pipeline.py
python generators/synthetic_generator.py
```

> These jobs handle untrusted input (uploaded files, user-supplied transforms)
> and credentials. Review against the bank's secure-coding standard before any
> change is promoted toward production.

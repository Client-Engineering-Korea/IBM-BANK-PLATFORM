# IBM Bank — Core Banking API
# Container image for the FastAPI core banking service.

# Use a Python base image (3.11+ required: app uses datetime.UTC)
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install required packages
RUN pip install --no-cache-dir fastapi uvicorn python-multipart

# Copy application code and the seeded ledger
COPY app/ ./app/
COPY data/ ./data/
COPY data/corebank.db ./data/corebank_org.db

# The service reads the ledger from this path
ENV COREBANK_DB_PATH=/app/data/corebank.db

# Install cron for scheduled tasks
RUN apt-get update && apt-get -y install cron procps

# Create a script to refresh the ledger from the seed and reload uvicorn
RUN echo '#!/bin/bash\n\
cp /app/data/corebank_org.db /app/data/corebank.db\n\
pkill -HUP uvicorn\n\
echo "Database refreshed at $(date)" >> /var/log/db-refresh.log\n' > /app/update_db.sh && chmod +x /app/update_db.sh

# Set up cron job to run every 45 minutes
RUN echo "*/45 * * * * /app/update_db.sh >> /var/log/cron.log 2>&1" > /etc/cron.d/db-update-cron
RUN chmod 0644 /etc/cron.d/db-update-cron
RUN crontab /etc/cron.d/db-update-cron
RUN touch /var/log/cron.log /var/log/db-refresh.log

# Create a startup script
RUN echo '#!/bin/bash\n\
cron\n\
echo "Starting application at $(date)" >> /var/log/app.log\n\
uvicorn app.main:app --reload --host 0.0.0.0\n' > /app/start.sh && chmod +x /app/start.sh

# Expose the port used by uvicorn
EXPOSE 8000

# Start the application and cron
CMD ["/app/start.sh"]

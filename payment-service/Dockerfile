FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Payment service is a long-running script, not HTTP API
CMD ["python", "main.py"]

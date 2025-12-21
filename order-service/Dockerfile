# Use the version required by the Command Manual 
FROM python:3.9

# Set the directory where your code will live in the container
WORKDIR /app

# Copy your local files (app.py, requirements.txt, etc.) into the container [cite: 91]
COPY . /app

# Install the necessary libraries [cite: 92]
RUN pip install fastapi uvicorn kafka-python

# The command to start your Order Service [cite: 95]
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
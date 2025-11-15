FROM python:3.11-slim

WORKDIR /workspace

# Install git and other dependencies
RUN apt-get update && apt-get install -y git curl

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

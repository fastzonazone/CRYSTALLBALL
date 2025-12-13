# ---- Build stage ----
FROM python:3.12-slim AS builder
WORKDIR /app

# Install build deps only for the build stage
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY backend/requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# ---- Runtime stage ----
FROM python:3.12-slim
WORKDIR /app

# Copy only the installed packages from the builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY backend/ /app/
# Create a non‑root user
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Expose FastAPI port
EXPOSE 8000

# Run the API
# Run the API
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "debug"]

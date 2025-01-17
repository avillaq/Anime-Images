FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

EXPOSE 8080

CMD ["gunicorn", "-b", "0.0.0.0:8080", "wsgi:app"]
FROM python:3.9-slim

ENV PYTHONUNBUFFERED=1
WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libssl-dev build-essential libssl-dev libffi-dev python3-dev && \
    rm -rf /var/lib/apt/lists/*

COPY blocks.py config.py /app/

RUN pip install --no-cache-dir pycryptodome steem pymongo requests

CMD ["python", "blocks.py"]
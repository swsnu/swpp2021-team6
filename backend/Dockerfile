FROM python:3.10.0
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt ./
RUN python -m pip install --upgrade pip && pip install -r requirements.txt
COPY . ./
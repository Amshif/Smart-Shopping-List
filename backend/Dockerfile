FROM python:3.13.1

WORKDIR /code

# Update pip
RUN pip install --upgrade pip

# Copy resources
COPY . /code

# Install requirements (prod/dev)
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Expose port
EXPOSE 80
WORKDIR /code

# Execution command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
FROM ubuntu:22.04

# Set environment variables to prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Update the package repository and install essential packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    wget \
    git \
    vim \
    ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the default working directory inside the container
WORKDIR /app

# Copy application files into the container (adjust the source path as needed)
# COPY . .

# Set a default command (change as per your application needs)
CMD ["tail", "-f", "/dev/null"]


# 🐻 MAMA BEAR POWERED VS CODE ENVIRONMENT
# This creates a VS Code environment with Mama Bear AI integrated
FROM codercom/code-server:4.20.0

USER root

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    nodejs \
    npm \
    python3 \
    python3-pip \
    python3-venv \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Docker CLI for container management
RUN curl -fsSL https://get.docker.com | sh

# Create mama-bear user
RUN useradd -m -s /bin/bash mama-bear && \
    echo "mama-bear ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Switch to mama-bear user
USER mama-bear
WORKDIR /home/mama-bear

# Copy VS Code configuration
COPY --chown=mama-bear:mama-bear ./vscode-config/ /home/mama-bear/.local/share/code-server/User/

# Install VS Code extensions for AI development
RUN code-server --install-extension ms-python.python && \
    code-server --install-extension ms-vscode.vscode-typescript-next && \
    code-server --install-extension esbenp.prettier-vscode && \
    code-server --install-extension ms-vscode.vscode-json && \
    code-server --install-extension bradlc.vscode-tailwindcss && \
    code-server --install-extension GitHub.copilot && \
    code-server --install-extension ms-python.black-formatter && \
    code-server --install-extension ms-vscode.remote-containers

# Create workspace directory
RUN mkdir -p /home/mama-bear/workspace

# Install Python packages for AI development
RUN python3 -m pip install --user \
    requests \
    anthropic \
    openai \
    google-cloud-aiplatform \
    fastapi \
    uvicorn \
    websockets \
    aiohttp

# Expose code-server port
EXPOSE 8080

# Start code-server with Mama Bear configuration
CMD ["code-server", "--bind-addr", "0.0.0.0:8080", "--auth", "none", "/home/mama-bear/workspace"]

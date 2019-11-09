# define ubuntu version, you can use --build-arg
ARG ubuntu_version="19.10"
FROM ubuntu:${ubuntu_version}

# Dockerfile on bash
SHELL ["/bin/bash", "-c"]

# default node version, you can use --build-arg
ARG node_version="v12.9.0"

# nvm version
ARG nvm_version="v0.34.0"

RUN apt update
RUN apt install -y vim git curl yarn libmecab-dev mecab-ipadic mecab-ipadic-utf8 mecab-utils libmagickwand-dev openjdk-8-jdk graphicsmagick graphviz curl nginx

# Set correct environment variables.
RUN mkdir -p /var/www/docker
WORKDIR /var/www/docker

# installv nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/${nvm_version}/install.sh | bash
ENV NVM_DIR "/root/.nvm"
RUN . ${NVM_DIR}/nvm.sh \
    && nvm install ${node_version} \
    && nvm alias default ${node_version} \
    && npm install

# Set up application
COPY . .
COPY src/provisioning/nginx/sites-available/default /etc/nginx/sites-available/default
COPY src/provisioning/startup.sh /startup.sh

CMD ["bash", "/startup.sh"]

EXPOSE 80
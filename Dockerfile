# define ubuntu version, you can use --build-arg
ARG ubuntu_version="latest"
FROM ubuntu:${ubuntu_version}

# Dockerfile on bash
SHELL ["/bin/bash", "-c"]

# default node version, you can use --build-arg
ARG node_version="v16.13.0"

# nvm version
ARG nvm_version="v0.39.0"

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update
RUN apt install -y vim git curl yarn libmecab-dev mecab-ipadic mecab-ipadic-utf8 mecab-utils libmagickwand-dev openjdk-8-jdk graphicsmagick graphviz curl nginx

# Set correct environment variables.
RUN mkdir -p /var/www/docker
WORKDIR /var/www/docker

# Set up application
COPY . .
COPY src/provisioning/nginx/sites-available/default /etc/nginx/sites-available/default
COPY src/provisioning/startup.sh /startup.sh

# installv nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/${nvm_version}/install.sh | bash
ENV NVM_DIR "/root/.nvm"
RUN . ${NVM_DIR}/nvm.sh \
    && nvm install ${node_version} \
    && nvm alias default ${node_version} \
    && npm install

CMD ["bash", "/startup.sh"]

EXPOSE 80

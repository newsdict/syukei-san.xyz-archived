# define ubuntu version, you can use --build-arg
ARG ubuntu_version="18.10"
FROM ubuntu:${ubuntu_version}

# Dockerfile on bash
SHELL ["/bin/bash", "-c"]

# default node version, you can use --build-arg
ARG node_version="v12.4.0"

RUN apt update
RUN apt install -y vim git curl yarn libmecab-dev mecab-ipadic-utf8 libmagickwand-dev openjdk-8-jdk nodejs graphicsmagick graphviz curl nginx

# installv nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
ENV NVM_DIR "/root/.nvm"
RUN . ${NVM_DIR}/nvm.sh \
    && nvm install ${node_version} \
    && nvm alias default ${node_version}

EXPOSE 8080
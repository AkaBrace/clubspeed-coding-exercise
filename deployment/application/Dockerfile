FROM brucelarsen/centos

LABEL \
    name="Node.js Application"

# Build arguments...used for bumping versions
ARG workingDirectory
ARG gosuVersion
ARG gosuSha256
ARG nodejsVersion

COPY deployment/application/nodesource.repo /etc/yum.repos.d/
RUN \
    yum install -y \
        nodejs-$nodejsVersion-* && \
    yum clean all

# Create an unprivileged user to run the nodejs application
RUN useradd --user-group --create-home --shell /bin/false nodejsapp

# very verbose debugging for NPM
#ENV NPM_CONFIG_LOGLEVEL warn

# The 'gosu' utility is like sudo for containers. This is used for non-Joyent docker hosts
RUN \
    set -x && \
    curl -o /usr/local/bin/gosu -SL "https://github.com/tianon/gosu/releases/download/$gosuVersion/gosu-amd64" && \
    curl -o /usr/local/bin/gosu.asc -SL "https://github.com/tianon/gosu/releases/download/$gosuVersion/gosu-amd64.asc" && \
    export GNUPGHOME="$(mktemp -d)" && \
    gpg --keyserver ha.pool.sks-keyservers.net --recv-keys $gosuSha256 && \
    gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu && \
    rm -r "$GNUPGHOME" /usr/local/bin/gosu.asc && \
    chmod +x /usr/local/bin/gosu

WORKDIR $workingDirectory

RUN \
    # Make web directory accessible by under priv user so that npm can install packages
    chown -R nodejsapp:nodejsapp $PWD

# Pre-seed the remaining npm packages as a separate
# layer in order to utilize docker layer caching
# and faster re-compilation of container images
USER nodejsapp
COPY package.json ./
RUN npm \
        install && \
    npm \
        cache clean

COPY . .

USER root
RUN \
    # Make web directory accessible by under priv user
    chown -R nodejsapp:nodejsapp $PWD

ENTRYPOINT ["bash", "deployment/application/entrypoint.sh"]
CMD ["node", "server.js"]

EXPOSE \
    # Allowing incoming connections on node.js port that will listen on
    3000

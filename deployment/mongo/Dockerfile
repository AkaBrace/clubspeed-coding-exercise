FROM brucelarsen/centos

LABEL \
    name="Node.js Application"

COPY mongosource.repo /etc/yum.repos.d/
RUN \
    yum install -y \
        mongodb-server && \
    yum clean all

RUN \
    mkdir -p /data/db

EXPOSE 27017

ENTRYPOINT ["/usr/bin/mongod"]

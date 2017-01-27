FROM centos:7

LABEL \
    "name"="CentOS Base" \
    "vendor"="Club Speed"

# Ensure we have a decent base of utilities/repos available
RUN \
    yum install -y \
        bind-utils \
        epel-release \
        iproute \
        net-tools \
        unzip && \
    yum clean all

# Set the image timezone to PST/PDT (especially relevant to NGINX logs)
RUN ln -sf ../usr/share/zoneinfo/America/Los_Angeles /etc/localtime

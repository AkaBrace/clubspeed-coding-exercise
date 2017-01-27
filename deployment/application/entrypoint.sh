#!/bin/bash
set -e

# For docker hosts not on Joyent's Triton SDC, we need to beef up security
if [ ! -z ${CONSUL_ALLOW_PRIVILEGED_PORTS+x} ]; then
    # Only non Joyent docker hosts need to run as an unpriv user
    set -- gosu nodejsapp "$@"
fi

exec "$@"

# clubspeed-coding-exercise

## Docker Compose (`docker-compose`)

Given a Docker instance (assuming `docker-compose` is installed and `docker info` / `docker version` complete successfully),
the following commands can be used to start a local copy of the application stack.

Be sure to populate the environment variables in the `.env` and `local.dev.env`. Consult the `.env.example file for a full listing
of all available environment variables for this application.

For a full overview of docker-compose please refer to the [docker compose documentation](https://docs.docker.com/compose/).

### Local Development and Test Environments

For the remainder of this document, we will assume you're running Docker via `docker-machine`, and that running `docker-machine ip`
on your host returns `192.168.99.100` -- please adjust expectations accordingly (for example, if running Docker locally
on a Linux native host, swap out `192.168.99.100` for `localhost`).

Once your stack is functional, you should be able to visit http://192.168.99.100:3000/ in order to see the web interface.

### Building with Docker Compose

One can use docker-compose to build container images for various environments (testing, development, staging, and
production).

#### Building the base image

Before images for any environment are built, one must first build a base image. Other images depend on this base image
being built locally first. The following command can be used to build the base images.

```console
me@host:~/bracelars$ docker-compose -f docker-compose.base.yml build --no-cache base-centos
```

#### Building additional images

After base images are built, they are cached locally. Additional images for a specific environment can be built next. The
`docker-compose.*.yml` files (prod, local.dev, etc.) define how docker should build an image for a specific environment. If
the `COMPOSE_FILE` environment variable is defined, then use the `-f` to force `docker-compose` to use a different
default `yml` file. One can also optionally build and deploy images for a specific environment within the same command.

The remaining images can be built using the following command:

```console
me@host:~/bracelars$ docker-compose -f docker-compose.dev.yml build
```

### Deploying containers with Docker Compose

Once all of the necessary images have been built and cached locally, it's easy to bring up a stack. The MongoDB container
will need to be deployed first. After the MongoDB container has successfully initialized and can accept connections, feel
free to deploy the Node.js application container.

```console
me@host:~/bracelars$ docker-compose up -d mongo
```

```console
me@host:~/bracelars$ docker-compose up -d application
```

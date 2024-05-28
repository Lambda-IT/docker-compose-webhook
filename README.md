# Docker Compose Webhook

With this agent it is possible to receive webhooks and execute docker-compose commands to restart containers with i.e. new image tags.

**Features:**

- list all docker-compose services for the given file
- get the complete config for the given docker-compose file (careful, potentially sensitive data, can be disabled)
- start all docker-compose services for the given file
- restart all docker-compose services for the given file
- stop all docker-compose services for the given file

**Configuration:**

| Environment Variable | Description                                                                           | Default |
| -------------------- | ------------------------------------------------------------------------------------- | ------- |
| API_KEY              | API Key to protect the API from unauthorized access and manipulation                  |         |
| API_PORT             | Optional: Port for the API                                                            | 8080    |
| API_HOST             | Optional: Host for the API                                                            | 0.0.0.0 |
| URL                  | Optional: Only required if the docs "Try it" functions should work                    |         |
| ENABLE_GET_CONFIG    | Optional: Enable the get config endpoint                                              | false   |
| ENABLE_BACKUPS       | Optional: Enable creating a backup copy before editing the remote docker-compose file | true    |

**Required Volmues:**

| Volume               | Description                                                                                     | Default |
| -------------------- | ----------------------------------------------------------------------------------------------- | ------- |
| /var/run/docker.sock | Mount the docker socket to have access to the docker daemon and running docker-compose commands |         |
| /opt/docker          | Mount the directory where the docker-compose files are located                                  |         |

**Tags:**

| Tag             | Description                                                                                |
| --------------- | ------------------------------------------------------------------------------------------ |
| latest          | latest stable version                                                                      |
| Github Releases | Tag Name without `v`, v1.0.0 -> registry.lambda-it.ch/library/docker-compose-webhook:1.0.0 |

### Example Usage

**Container**

```bash
docker run --rm \
    -p 8080:8080 \
    -e API_KEY=test123 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    registry.lambda-it.ch/library/docker-compose-webhook:latest
```

> [!WARNING]
> **Security**
>
> Note: This container requires to set an API Key to protect the API from unauthorized access and manipulation.
>
> Note: docker.sock mount is required to have access to the docker daemon and running docker-compose commands.
> Because of this it is important to know that the container has full access to the docker daemon and can do everything with it.
> This is a security risk and should be considered before using this container.
> Maybe protect the API with additional authentication and use it only in private and trusted networks.

**API**

Documentation is available on every instance with http://${IP}/docs.

```bash
# pull and start
curl -X POST --header "X-API-KEY: ${API_KEY}" 'http://${IP}:8080/compose/up?path=/opt/docker&file=apps.yml'
```

### Build

```bash
docker build -t registry.lambda-it.ch/library/docker-compose-webhook .
docker push registry.lambda-it.ch/library/docker-compose-webhook
```

# Barcode Detection API

## Docker

### Run

```
docker run -it --rm -d -p 8080:80 --name web --mount type=bind,source=./html,target=/usr/share/nginx/html nginx:latest
```

### Stop

```
docker stop web
```
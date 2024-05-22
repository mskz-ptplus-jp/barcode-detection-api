# Barcode Detection API

[demo](https://mskz-ptplus-jp.github.io/barcode-detection-api/src/)

- [Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API#browser_compatibility)


## Docker

### Provisioning

1. Go to the ngrok dashboard and set up *<YOUR_AUTH_TOKEN>*.  
  https://dashboard.ngrok.com/get-started/your-authtoken
1. Create ngrok.yml
   ```
    version: "2"
    authtoken: <YOUR_AUTH_TOKEN>
    tunnels:
    nginx:
        proto: http
        addr: nginx:80
        host_header: rewrite
   ```

### Run

```
docker compose up -d
```

- Get started, Access http://localhost:4040/ in browser
- Make a request of tunnel URLs

### Stop

```
docker compose down
```
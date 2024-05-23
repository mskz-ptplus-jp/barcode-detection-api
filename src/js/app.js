window.addEventListener('load', function() {
  const stream = navigator.mediaDevices;
  const video = document.querySelector('.reader-video');
  let footer = document.getElementsByTagName('footer')[0];
  let detectButton = document.getElementById('detect');
  let stopButton = document.getElementById('stop');
  let switchingCameraButton = document.getElementById('switching-camera');
  let isFacingMode = true;

  if (window.BarcodeDetector === undefined) {
    footer.innerHTML = "Barcode Detection not supported"
                     + `<br>`
                     + `<a href="https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API#browser_compatibility" target="_blank">Browser compatibility</a>`;
    console.error(footer.innerHTML);
    return;
  }

  const detector = new window.BarcodeDetector({
    formats: ['qr_code']  // 検出をQRコードのみに限定する
  });

  const getStream = async () => {
    return await stream.getUserMedia({
      video: {
        facingMode: isFacingMode ? "user" : "environment"
      }
    });
  };

  const scanBarcode = () => {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      detector.detect(video)
        .then((barcodes) => {
          barcodes.forEach(barcode => {
            if(barcode.rawValue === footer.innerHTML) return;
            console.log(barcode.rawValue);
            footer.innerHTML = barcode.rawValue;
          });
        })
        .catch((err) => {
          console.error('Barcode detection error: ', err);
        });
    }
    requestAnimationFrame(scanBarcode);
  };

  detectButton.addEventListener('click', async () => {
    try {
      video.srcObject = await getStream();
      video.onloadedmetadata = () => {
        video.play();
        scanBarcode();
      };
    } catch (err) {
      console.error('Error accessing the camera: ', err);
    }
  });

  stopButton.addEventListener('click', () => {
    footer.innerHTML = '';
    video.pause();
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
    }
    video.srcObject = null;
  });

  switchingCameraButton.addEventListener('click', () => {
    isFacingMode = !isFacingMode;
    stopButton.click();
    detectButton.click();
  });
});

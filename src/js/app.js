window.addEventListener('load', function() {
  const footer = document.getElementsByTagName('footer')[0];
  const reader = document.getElementById('reader');
  let video = document.createElement('video');
  let detectButton = document.getElementById('detect');
  let stopButton = document.getElementById('stop');
  let switchingCameraButton = document.getElementById('switching-camera');
  let isFacingMode = true;
  let timeOutId = null;

  if (window.BarcodeDetector === undefined) {
    footer.innerHTML = "Barcode Detection not supported"
                     + `<br>`
                     + `<a href="https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API#browser_compatibility" target="_blank">Browser compatibility</a>`;
    console.error(footer.innerHTML);
    return;
  }

  const getStream = async () => {
    navigator.mediaDevices = null;
    return await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: isFacingMode ? "user" : { exact: "environment" }
      }
    });
  };

  const scanBarcode = async () => {
    if (!video.srcObject) return;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const detector = new window.BarcodeDetector({
        formats: ['qr_code']  // 検出をQRコードのみに限定する
      });
      detector.detect(video)
        .then((barcodes) => {
          barcodes.forEach(barcode => {
            if(barcode.rawValue === footer.innerHTML) {
              if(timeOutId === null)
                timeOutId = setTimeout(() => {
                  footer.innerHTML = '';
                  timeOutId = null
                }, 10000);
              return;
            }
            footer.innerHTML = barcode.rawValue;
          });
          requestAnimationFrame(scanBarcode);
        })
        .catch( async (err) => {
          console.error('Barcode detection error: ', err);
          setTimeout(() => detectButton.click(), 10000);
        });
    }
  };

  detectButton.addEventListener('click', async () => {
    footer.innerHTML = '';
    reader.innerHTML = '';
    video = document.createElement('video');
    video.classList.add('reader-video');
    console.log('detectButton');
    try {
      video.srcObject = await getStream();
      video.onloadedmetadata = async () => {
        await video.play();
        await scanBarcode();
      };
    } catch (err) {
      console.error('Error accessing the camera: ', err);
    }
    reader.appendChild(video);
  });

  stopButton.addEventListener('click', async () => {
    navigator.mediaDevices = null;
    reader.innerHTML = '';
    footer.innerHTML = '';
    console.log('stopButton: innerHTML', footer.innerHTML);
  });

  switchingCameraButton.addEventListener('click', () => {
    isFacingMode = !isFacingMode;
    stopButton.click();
    detectButton.click();
  });
});

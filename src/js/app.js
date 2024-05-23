window.addEventListener('load', function() {
  const stream = navigator.mediaDevices;
  const video = document.querySelector('.reader-video');
  let footer = document.getElementsByTagName('footer')[0];
  let detectButton = document.getElementById('detect');
  let stopButton = document.getElementById('stop');
  let switchingCameraButton = document.getElementById('switching-camera');
  let timerId = null;
  let isFacingMode = true;

  if (window.BarcodeDetector == undefined) {
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

  detectButton.addEventListener('click', async () => {
      video.srcObject = await getStream();
      await video.play();

      // QRコードの検出
      clearInterval(timerId);
      timerId = setInterval( async () => {
        const detectionList = await detector.detect(video);
        for(const detected of detectionList) {
          if(footer.innerHTML == detected.rawValue) continue;
          console.log(detected.rawValue);
          footer.innerHTML = detected.rawValue;
        }
      }, 500);
  });

  stopButton.addEventListener('click', () => {
    clearInterval(timerId);
    footer.innerHTML = '';
    video.pause();
    video.srcObject = null;
  });

  switchingCameraButton.addEventListener('click', () => {
    isFacingMode = !isFacingMode;
    stopButton.click();
    detectButton.click();
  });
});

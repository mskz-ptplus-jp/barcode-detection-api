window.addEventListener('load', function() {
  const video = document.querySelector('.reader-video');
  let footer = document.getElementsByTagName('footer')[0];
  let detectButton = document.getElementById('detect');
  let stopButton = document.getElementById('stop');
  let timerId = null;

  if (window.BarcodeDetector == undefined) {
    footer.innerHTML = "Barcode Detection not supported"
                      + `<br>`
                      + `<a href="https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API#browser_compatibility" target="_blank">Browser compatibility</a>`;
    console.error(footer.innerHTML);
    return;
  }

  detectButton.addEventListener('click', () => {

    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user"
        }
      });
      video.srcObject = stream;
      await video.play();

      // 検出をQRコードのみに限定する
      const detector = new window.BarcodeDetector({
        formats: ['qr_code']
      });

      // QRコードの検出
      timerId = setInterval( async () => {
        const detectionList = await detector.detect(video);
        for(const detected of detectionList) {
          if(footer.innerHTML == detected.rawValue) continue;
          console.log(detected.rawValue);
          footer.innerHTML = detected.rawValue;
        }
      }, 500);
    })();
  });

  stopButton.addEventListener('click', () => {
    clearInterval(timerId);
    video.pause();
    video.srcObject = null;
  });
});

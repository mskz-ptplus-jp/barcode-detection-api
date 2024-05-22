window.addEventListener('load', function() {
  let detectButton = document.getElementById('detect');
  let footer = document.getElementsByTagName('footer')[0];

    detectButton.addEventListener('click', () => {
      if (window.BarcodeDetector == undefined) {
        footer.innerHTML = "Barcode Detection not supported";
        console.error(footer.innerHTML);
        return;
      }

      (async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user"
          }
        });
        const video = document.querySelector('.reader-video');
        video.srcObject = stream;
        await video.play();

        // 検出をQRコードのみに限定する
        const detector = new window.BarcodeDetector({
          formats: ['qr_code']
        });

        // QRコードの検出
        setInterval(async () => {
          const detectionList = await detector.detect(video);
          for(const detected of detectionList) {
            console.log(detected.rawValue);
            if(footer.innerHTML == detected.rawValue) continue;
            footer.innerHTML = detected.rawValue;
          }
        }, 500);
      })();
    });

});

window.addEventListener('load', function() {
    let detectButton = document.getElementById('detect');
    let image = document.getElementById('image');
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext("2d");

    image.addEventListener('load', () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 
                    0, 0, image.width, image.height,
                    0, 0, canvas.width, canvas.height);

      const scale = canvas.width / image.width;

      console.log('image', image.width, image.height);

      detectButton.addEventListener('click', () => {
        if (window.BarcodeDetector == undefined) {
          let footer = document.getElementsByTagName('footer')[0];
          footer.innerHTML = "Barcode Detection not supported";
          console.error(footer.innerHTML);
          return;
        }
        let footer = document.getElementsByTagName('footer')[0];

        let barcodeDetector = new BarcodeDetector();
        barcodeDetector.detect(image)
          .then(barcodes => {
            // Draw the boxes on the <canvas>.
            let ctx = document.getElementById('canvas').getContext("2d");
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
            for(let i = 0; i < barcodes.length; i++) {
              ctx.rect(
                Math.floor(barcodes[i].boundingBox.x * scale), 
                Math.floor(barcodes[i].boundingBox.y * scale),
                Math.floor(barcodes[i].boundingBox.width * scale), 
                Math.floor(barcodes[i].boundingBox.height * scale)
              );
              ctx.stroke();
            }
            ctx.closePath();

            ctx.beginPath();
            ctx.strokeStyle = "yellow";
            for(let i = 0; i < barcodes.length; i++) {
              ctx.moveTo(Math.floor(barcodes[i].cornerPoints[0].x * scale), 
                        Math.floor(barcodes[i].cornerPoints[0].y * scale));
              ctx.lineTo(Math.floor(barcodes[i].cornerPoints[1].x * scale), 
                        Math.floor(barcodes[i].cornerPoints[1].y * scale));
              ctx.lineTo(Math.floor(barcodes[i].cornerPoints[2].x * scale), 
                        Math.floor(barcodes[i].cornerPoints[2].y * scale));
              ctx.lineTo(Math.floor(barcodes[i].cornerPoints[3].x * scale), 
                        Math.floor(barcodes[i].cornerPoints[3].y * scale));
              ctx.lineTo(Math.floor(barcodes[i].cornerPoints[0].x * scale), 
                        Math.floor(barcodes[i].cornerPoints[0].y * scale));
              ctx.stroke();
            }
            ctx.closePath();

            // Add the barcodes as strings to the <footer>
            footer.innerHTML = `<p>Detected ${barcodes.length} barcodes</p>`;
            const ul = document.createElement('ul');
            for(let i = 0; i < barcodes.length; i++) {
              const li = document.createElement('li');
              li.innerHTML = `@ (${barcodes[i].boundingBox.x}, ${barcodes[i].boundingBox.y}),`
                            + ` size (${barcodes[i].boundingBox.width}x${barcodes[i].boundingBox.height});`
                            + ` rawValue=${barcodes[i].rawValue}`;
              ul.appendChild(li);
            }
            footer.appendChild(ul);
          }).catch((e) => {
            footer.innerHTML = `Boo, Barcode Detection failed: ${e}`;
            console.error(footer.innerHTML);
          })
      });
    });

    // 画像の再読み込みを強制
    image.src = image.src;
  });

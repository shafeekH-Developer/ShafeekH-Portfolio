/**
 * Image Conversion Studio - Interactive Live Filter Simulator
 * Simulates 7 AI artistic effects on HTML5 Canvas in real-time:
 * 1. Mosaic
 * 2. Watercolor
 * 3. Charcoal Sketch
 * 4. Pencil Sketch
 * 5. Oil Painting
 * 6. Background Removal
 * 7. Anime Effect
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('effectCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const tabs = document.querySelectorAll('.effect-tab');
  const effectNameLabel = document.getElementById('activeEffectName');
  const effectTechLabel = document.getElementById('activeEffectTech');

  // Internal canvas resolution
  canvas.width = 600;
  canvas.height = 450;

  // State
  let currentEffect = 'mosaic';
  const baseImg = new Image();
  baseImg.crossOrigin = 'Anonymous';
  baseImg.src = 'assets/images/project-studio.jpg';

  baseImg.onload = () => {
    renderEffect(currentEffect);
  };

  // Tab click event listeners
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const effect = tab.getAttribute('data-effect');
      currentEffect = effect;
      
      const title = tab.innerText;
      if (effectNameLabel) effectNameLabel.innerText = title;
      if (effectTechLabel) updateTechLabel(effect);

      renderEffect(effect);
    });
  });

  function updateTechLabel(effect) {
    const techMap = {
      'original': 'Original Image View',
      'mosaic': 'OpenCV Block Aggregation & Color Pooling',
      'watercolor': 'Bilateral Filtering & Color Bleed Shading',
      'charcoal': 'Adaptive Grayscale Edge Thresholding',
      'pencil': 'Laplacian Edge Detection & Graphite Inversion',
      'oil': 'Color Quantization & K-Means Clustering',
      'bg-remove': 'Rembg AI U2Net Deep Segmentation',
      'anime': 'Canny Edge Detection & Cel-Shading Saturation'
    };
    effectTechLabel.innerText = techMap[effect] || 'OpenCV + Machine Learning';
  }

  function renderEffect(effect) {
    if (!ctx) return;

    // Draw base image scaled to canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

    if (effect === 'original') return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const width = canvas.width;
    const height = canvas.height;

    switch (effect) {
      case 'mosaic':
        applyMosaic(ctx, width, height, 16);
        break;

      case 'watercolor':
        applyWatercolor(data, width, height);
        ctx.putImageData(imgData, 0, 0);
        break;

      case 'charcoal':
        applyCharcoal(data, width, height);
        ctx.putImageData(imgData, 0, 0);
        break;

      case 'pencil':
        applyPencilSketch(data, width, height);
        ctx.putImageData(imgData, 0, 0);
        break;

      case 'oil':
        applyOilPainting(ctx, width, height);
        break;

      case 'bg-remove':
        applyBgRemoval(data, width, height);
        ctx.putImageData(imgData, 0, 0);
        drawCheckeredBgBehind(ctx, width, height, imgData);
        break;

      case 'anime':
        applyAnimeEffect(data, width, height);
        ctx.putImageData(imgData, 0, 0);
        break;

      default:
        break;
    }
  }

  /* 1. Mosaic Effect */
  function applyMosaic(context, width, height, blockSize) {
    for (let y = 0; y < height; y += blockSize) {
      for (let x = 0; x < width; x += blockSize) {
        const p = context.getImageData(x + Math.floor(blockSize / 2), y + Math.floor(blockSize / 2), 1, 1).data;
        context.fillStyle = `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
        context.fillRect(x, y, blockSize - 1, blockSize - 1);
      }
    }
  }

  /* 2. Watercolor Effect */
  function applyWatercolor(data, width, height) {
    for (let i = 0; i < data.length; i += 4) {
      // Soft saturation boost & smooth blur approximation
      data[i] = Math.min(255, data[i] * 1.2 + 10);     // Red
      data[i + 1] = Math.min(255, data[i + 1] * 1.15); // Green
      data[i + 2] = Math.min(255, data[i + 2] * 1.3);  // Blue boost
    }
  }

  /* 3. Charcoal Sketch */
  function applyCharcoal(data, width, height) {
    for (let i = 0; i < data.length; i += 4) {
      // High contrast grayscale
      let gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      gray = gray < 100 ? gray * 0.4 : Math.min(255, gray * 1.4);
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
  }

  /* 4. Pencil Sketch */
  function applyPencilSketch(data, width, height) {
    for (let i = 0; i < data.length; i += 4) {
      let gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      // Invert & graphite stroke texture
      let sketch = 255 - gray;
      sketch = sketch > 180 ? 255 : sketch < 50 ? 40 : sketch;
      data[i] = sketch;
      data[i + 1] = sketch;
      data[i + 2] = sketch;
    }
  }

  /* 5. Oil Painting Effect */
  function applyOilPainting(context, width, height) {
    const temp = context.getImageData(0, 0, width, height);
    const d = temp.data;
    // Quantize color levels
    const levels = 6;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = Math.floor(d[i] / (256 / levels)) * (256 / levels);
      d[i + 1] = Math.floor(d[i + 1] / (256 / levels)) * (256 / levels);
      d[i + 2] = Math.floor(d[i + 2] / (256 / levels)) * (256 / levels);
    }
    context.putImageData(temp, 0, 0);
  }

  /* 6. Background Removal (Subject isolation simulation) */
  function applyBgRemoval(data, width, height) {
    const cx = width / 2;
    const cy = height / 2;
    const maxDist = Math.min(width, height) * 0.45;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Mask out background outside subject boundary
        if (dist > maxDist) {
          data[index + 3] = 0; // Alpha 0
        }
      }
    }
  }

  function drawCheckeredBgBehind(context, width, height, fgImageData) {
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = width;
    bgCanvas.height = height;
    const bgCtx = bgCanvas.getContext('2d');

    // Draw checkered grid
    const size = 16;
    for (let y = 0; y < height; y += size) {
      for (let x = 0; x < width; x += size) {
        bgCtx.fillStyle = ((x / size + y / size) % 2 === 0) ? '#1E2530' : '#141820';
        bgCtx.fillRect(x, y, size, size);
      }
    }

    // Overlay subject on top of checkered pattern
    context.clearRect(0, 0, width, height);
    context.drawImage(bgCanvas, 0, 0);
    
    // Draw foreground on temp canvas then layer it
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCanvas.getContext('2d').putImageData(fgImageData, 0, 0);
    
    context.drawImage(tempCanvas, 0, 0);
  }

  /* 7. Anime Effect */
  function applyAnimeEffect(data, width, height) {
    for (let i = 0; i < data.length; i += 4) {
      // Cel-shading color quantization + rich anime saturation
      data[i] = Math.floor(data[i] / 64) * 64 + 32;
      data[i + 1] = Math.floor(data[i + 1] / 64) * 64 + 32;
      data[i + 2] = Math.floor(data[i + 2] / 64) * 64 + 32;

      // Vibrance boost
      data[i] = Math.min(255, data[i] * 1.1);
      data[i + 1] = Math.min(255, data[i + 1] * 1.1);
    }
  }
});

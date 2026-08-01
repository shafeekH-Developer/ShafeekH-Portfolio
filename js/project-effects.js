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
 *
 * Uses canvas CSS filters & compositing (no getImageData) so effects work
 * even when the page is opened directly from disk (file://).
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('effectCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const tabs = document.querySelectorAll('.effect-tab');
  const effectNameLabel = document.getElementById('activeEffectName');
  const effectTechLabel = document.getElementById('activeEffectTech');

  // Internal canvas resolution
  canvas.width = 600;
  canvas.height = 450;

  // State
  let currentEffect = 'mosaic';
  const baseImg = new Image();

  // CSS filter map per effect (safe, non-tainting)
  const EFFECT_FILTERS = {
    original: 'none',
    mosaic: 'none', // handled separately
    watercolor: 'saturate(1.35) brightness(1.08) contrast(0.95) blur(1px)',
    charcoal: 'grayscale(1) contrast(1.55) brightness(0.88)',
    pencil: 'grayscale(1) invert(1) contrast(1.7) brightness(1.12)',
    oil: 'saturate(1.6) contrast(1.22) brightness(1.02)',
    'bg-remove': 'none', // handled separately
    anime: 'saturate(2.1) contrast(1.35) brightness(1.05)'
  };

  const TECH_MAP = {
    'original': 'Original Image View',
    'mosaic': 'OpenCV Block Aggregation & Color Pooling',
    'watercolor': 'Bilateral Filtering & Color Bleed Shading',
    'charcoal': 'Adaptive Grayscale Edge Thresholding',
    'pencil': 'Laplacian Edge Detection & Graphite Inversion',
    'oil': 'Color Quantization & K-Means Clustering',
    'bg-remove': 'Rembg AI U2Net Deep Segmentation',
    'anime': 'Canny Edge Detection & Cel-Shading Saturation'
  };

  function updateTechLabel(effect) {
    if (effectTechLabel) {
      effectTechLabel.innerText = TECH_MAP[effect] || 'OpenCV + Machine Learning';
    }
  }

  function renderEffect(effect) {
    if (!ctx || !baseImg.complete) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'source-over';

    if (effect === 'original') {
      ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
      return;
    }

    if (effect === 'mosaic') {
      applyMosaic();
      return;
    }

    if (effect === 'bg-remove') {
      applyBgRemoval();
      return;
    }

    // Standard CSS filter effect
    ctx.filter = EFFECT_FILTERS[effect] || 'none';
    ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';
  }

  /* 1. Mosaic Effect - downscale + pixelated upscale (no pixel reads) */
  function applyMosaic() {
    const block = 16;
    const smallW = Math.max(1, Math.round(canvas.width / block));
    const smallH = Math.max(1, Math.round(canvas.height / block));

    const small = document.createElement('canvas');
    small.width = smallW;
    small.height = smallH;
    const sCtx = small.getContext('2d');
    sCtx.imageSmoothingEnabled = false;
    sCtx.drawImage(baseImg, 0, 0, smallW, smallH);

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(small, 0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
  }

  /* 6. Background Removal - radial subject mask + checkered backdrop */
  function applyBgRemoval() {
    const w = canvas.width;
    const h = canvas.height;

    // Draw the base image into an offscreen canvas
    const off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    const offCtx = off.getContext('2d');
    offCtx.drawImage(baseImg, 0, 0, w, h);

    // Apply radial alpha mask (subject stays in center, edges fade out)
    offCtx.globalCompositeOperation = 'destination-in';
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.48;
    const grad = offCtx.createRadialGradient(cx, cy, radius * 0.45, cx, cy, radius);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    offCtx.fillStyle = grad;
    offCtx.fillRect(0, 0, w, h);

    // Draw checkered background on main canvas
    const size = 16;
    for (let y = 0; y < h; y += size) {
      for (let x = 0; x < w; x += size) {
        ctx.fillStyle = ((x / size + y / size) % 2 === 0) ? '#1E2530' : '#141820';
        ctx.fillRect(x, y, size, size);
      }
    }

    // Layer the masked subject on top
    ctx.drawImage(off, 0, 0);
  }

  // Load base image
  baseImg.src = 'assets/images/project-studio.jpg';
  baseImg.onload = () => {
    renderEffect(currentEffect);
  };
  baseImg.onerror = () => {
    // Graceful fallback so the canvas is never a blank black box
    ctx.fillStyle = '#161B22';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#3B82F6';
    ctx.font = '700 22px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Image Conversion Studio', canvas.width / 2, canvas.height / 2 - 6);
    ctx.fillStyle = '#8B949E';
    ctx.font = '500 14px JetBrains Mono, monospace';
    ctx.fillText('Could not load preview image', canvas.width / 2, canvas.height / 2 + 22);
  };

  // Tab click event listeners
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const effect = tab.getAttribute('data-effect');
      currentEffect = effect;

      if (effectNameLabel) effectNameLabel.innerText = tab.innerText;
      updateTechLabel(effect);

      renderEffect(effect);
    });
  });
});


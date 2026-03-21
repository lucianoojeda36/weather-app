import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// SVG del ícono: fondo gradiente azul oscuro, sol dorado, nube blanca
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1a1a6e"/>
      <stop offset="100%" stop-color="#0a0a2e"/>
    </radialGradient>
    <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f0c040"/>
      <stop offset="100%" stop-color="#e8a020"/>
    </radialGradient>
    <radialGradient id="cloudGrad" cx="45%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#d0dce8"/>
    </radialGradient>
  </defs>

  <!-- Fondo -->
  <rect width="1024" height="1024" fill="url(#bgGrad)" rx="200"/>

  <!-- Sol (detrás de la nube) -->
  <!-- Rayos del sol -->
  <g transform="translate(420, 390)" stroke="#f0c040" stroke-width="28" stroke-linecap="round" opacity="0.9">
    <line x1="0" y1="-170" x2="0" y2="-130"/>
    <line x1="120" y1="-120" x2="92" y2="-92"/>
    <line x1="170" y1="0" x2="130" y2="0"/>
    <line x1="120" y1="120" x2="92" y2="92"/>
    <line x1="0" y1="170" x2="0" y2="130"/>
    <line x1="-120" y1="120" x2="-92" y2="92"/>
    <line x1="-170" y1="0" x2="-130" y2="0"/>
    <line x1="-120" y1="-120" x2="-92" y2="-92"/>
  </g>
  <!-- Círculo del sol -->
  <circle cx="420" cy="390" r="115" fill="url(#sunGrad)" opacity="0.95"/>

  <!-- Nube (en primer plano) -->
  <!-- Sombra suave de la nube -->
  <ellipse cx="555" cy="630" rx="265" ry="40" fill="#0a0a2e" opacity="0.15"/>
  <!-- Cuerpos de la nube -->
  <circle cx="390" cy="590" r="110" fill="url(#cloudGrad)"/>
  <circle cx="510" cy="545" r="140" fill="url(#cloudGrad)"/>
  <circle cx="650" cy="570" r="120" fill="url(#cloudGrad)"/>
  <circle cx="740" cy="610" r="90" fill="url(#cloudGrad)"/>
  <!-- Base plana de la nube -->
  <rect x="280" y="600" width="540" height="100" fill="url(#cloudGrad)" rx="20"/>
</svg>`;

// SVG circular (para Android round icons)
const roundIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <clipPath id="circle">
      <circle cx="512" cy="512" r="512"/>
    </clipPath>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1a1a6e"/>
      <stop offset="100%" stop-color="#0a0a2e"/>
    </radialGradient>
    <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f0c040"/>
      <stop offset="100%" stop-color="#e8a020"/>
    </radialGradient>
    <radialGradient id="cloudGrad" cx="45%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#d0dce8"/>
    </radialGradient>
  </defs>

  <g clip-path="url(#circle)">
    <!-- Fondo -->
    <rect width="1024" height="1024" fill="url(#bgGrad)"/>

    <!-- Sol (detrás de la nube) -->
    <g transform="translate(420, 390)" stroke="#f0c040" stroke-width="28" stroke-linecap="round" opacity="0.9">
      <line x1="0" y1="-170" x2="0" y2="-130"/>
      <line x1="120" y1="-120" x2="92" y2="-92"/>
      <line x1="170" y1="0" x2="130" y2="0"/>
      <line x1="120" y1="120" x2="92" y2="92"/>
      <line x1="0" y1="170" x2="0" y2="130"/>
      <line x1="-120" y1="120" x2="-92" y2="92"/>
      <line x1="-170" y1="0" x2="-130" y2="0"/>
      <line x1="-120" y1="-120" x2="-92" y2="-92"/>
    </g>
    <circle cx="420" cy="390" r="115" fill="url(#sunGrad)" opacity="0.95"/>

    <!-- Nube -->
    <ellipse cx="555" cy="630" rx="265" ry="40" fill="#0a0a2e" opacity="0.15"/>
    <circle cx="390" cy="590" r="110" fill="url(#cloudGrad)"/>
    <circle cx="510" cy="545" r="140" fill="url(#cloudGrad)"/>
    <circle cx="650" cy="570" r="120" fill="url(#cloudGrad)"/>
    <circle cx="740" cy="610" r="90" fill="url(#cloudGrad)"/>
    <rect x="280" y="600" width="540" height="100" fill="url(#cloudGrad)" rx="20"/>
  </g>
</svg>`;

const svgBuffer = Buffer.from(iconSvg);
const roundSvgBuffer = Buffer.from(roundIconSvg);

// Android sizes: { dir, size }
const androidSizes = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

// iOS sizes: { filename, size }
const iosSizes = [
  { filename: 'Icon-40.png', size: 40 },
  { filename: 'Icon-60.png', size: 60 },
  { filename: 'Icon-58.png', size: 58 },
  { filename: 'Icon-87.png', size: 87 },
  { filename: 'Icon-80.png', size: 80 },
  { filename: 'Icon-120.png', size: 120 },
  { filename: 'Icon-180.png', size: 180 },
  { filename: 'Icon-1024.png', size: 1024 },
];

async function generateIcons() {
  console.log('Generando íconos Android...');
  for (const { dir, size } of androidSizes) {
    const basePath = path.join(ROOT, 'android/app/src/main/res', dir);

    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(basePath, 'ic_launcher.png'));

    await sharp(roundSvgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(basePath, 'ic_launcher_round.png'));

    console.log(`  ✓ ${dir}: ${size}×${size}`);
  }

  console.log('\nGenerando íconos iOS...');
  const iosPath = path.join(ROOT, 'ios/WeatherApp/Images.xcassets/AppIcon.appiconset');
  for (const { filename, size } of iosSizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(iosPath, filename));

    console.log(`  ✓ ${filename}: ${size}×${size}`);
  }

  console.log('\n✅ Todos los íconos generados exitosamente.');
}

generateIcons().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

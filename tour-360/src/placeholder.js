// Gera um panorama equirretangular provisório (2:1) com grade de graus,
// usado enquanto a foto real do ambiente ainda não foi adicionada.
const cache = new Map();

export function placeholderPanorama(label, hue = 30) {
  const key = `${label}|${hue}`;
  if (cache.has(key)) return cache.get(key);

  const w = 4096;
  const h = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const sky = ctx.createLinearGradient(0, 0, 0, h / 2);
  sky.addColorStop(0, `hsl(${hue} 30% 10%)`);
  sky.addColorStop(1, `hsl(${hue} 35% 32%)`);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h / 2);

  const floor = ctx.createLinearGradient(0, h / 2, 0, h);
  floor.addColorStop(0, `hsl(${hue} 15% 22%)`);
  floor.addColorStop(1, `hsl(${hue} 10% 8%)`);
  ctx.fillStyle = floor;
  ctx.fillRect(0, h / 2, w, h / 2);

  // Grade: linhas verticais a cada 30° de yaw, horizontais a cada 15° de pitch.
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '600 34px system-ui, sans-serif';
  ctx.textAlign = 'center';
  for (let yaw = -180; yaw < 180; yaw += 30) {
    const x = ((yaw + 180) / 360) * w;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
    ctx.fillText(`${yaw}°`, x, h / 2 - 20);
  }
  for (let pitch = -75; pitch <= 75; pitch += 15) {
    const y = ((90 - pitch) / 180) * h;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '300 110px Poppins, system-ui, sans-serif';
  for (const yaw of [0, 90, 180, -90]) {
    const x = ((yaw + 180) / 360) * w;
    ctx.fillText(label, x, h / 2 - 180);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '400 36px system-ui, sans-serif';
  for (const yaw of [0, 90, 180, -90]) {
    const x = ((yaw + 180) / 360) * w;
    ctx.fillText('foto 360° em breve', x, h / 2 - 110);
  }

  const url = canvas.toDataURL('image/jpeg', 0.85);
  cache.set(key, url);
  return url;
}

import { sectors, tot, PI, arc } from './wheelConfig';

export const drawWheel = (canvas) => {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dia = Math.min(canvas.width, canvas.height);
  const rad = dia / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw sectors
  sectors.forEach((sector, i) => {
    const ang = arc * i;
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
  });

  // Draw text
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.font = `bold ${rad / 8}px sans-serif`;
  
  sectors.forEach((sector, i) => {
    const ang = arc * i + arc / 2;
    ctx.save();
    ctx.translate(rad, rad);
    ctx.rotate(ang);
    ctx.fillText(sector.label, rad - 10, 0);
    ctx.restore();
  });
};

export const rotate = (canvas, angle) => {
  canvas.style.transform = `rotate(${-angle}rad)`;
};
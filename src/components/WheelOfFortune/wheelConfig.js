export const sectors = [
  { color: "#f82", label: "50 Gold" },
  { color: "#0bf", label: "10 XP" },
  { color: "#fb0", label: "200 Gold" },
  { color: "#0fb", label: "50 XP" },
  { color: "#b0f", label: "100 Gold" },
  { color: "#f0b", label: "5 XP" }
];

export const rand = (m, M) => Math.random() * (M - m) + m;
export const tot = sectors.length;
export const PI = Math.PI;
export const TAU = 2 * PI;
export const arc = TAU / sectors.length;

export const friction = 0.995;
export const angVelMin = 0.002;
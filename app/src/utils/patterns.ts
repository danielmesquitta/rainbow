export const patternToString = (pattern: RegExp) =>
  pattern.toString().slice(1, -1);

export const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

export const colorPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

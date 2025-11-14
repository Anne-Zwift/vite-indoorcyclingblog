export const createP = (text: string, className?: string): HTMLParagraphElement => {
  const p = document.createElement('p');
  p.textContent = text;
  if (className) p.className = className;

  return p;
    
}
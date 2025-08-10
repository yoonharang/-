export const utilityColors = {
  water: 'blue',
  sewage: 'brown',
  gas: 'orange',
};

export function getClosestPointOnEdges(points, mx, my, isShapeClosed) {
  let minDist = Infinity;
  let closest = { x: mx, y: my };

  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    if (!isShapeClosed && i === points.length - 1) break;

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const lengthSquared = dx * dx + dy * dy;
    const t = Math.max(0, Math.min(1, ((mx - p1.x) * dx + (my - p1.y) * dy) / lengthSquared));
    const projX = p1.x + t * dx;
    const projY = p1.y + t * dy;
    const dist = Math.hypot(mx - projX, my - projY);

    if (dist < minDist) {
      minDist = dist;
      closest = { x: projX, y: projY };
    }
  }

  return closest;
}
import React, { useEffect, useRef } from 'react';

function linePolygonIntersections(line, polygon) {
  const intersections = [];

  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length];

    const denom = (b.y - a.y) * (line.x2 - line.x1) - (b.x - a.x) * (line.y2 - line.y1);
    if (denom === 0) continue;

    const ua = ((b.x - a.x) * (line.y1 - a.y) - (b.y - a.y) * (line.x1 - a.x)) / denom;
    const ub = ((line.x2 - line.x1) * (line.y1 - a.y) - (line.y2 - line.y1) * (line.x1 - a.x)) / denom;

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      const x = line.x1 + ua * (line.x2 - line.x1);
      const y = line.y1 + ua * (line.y2 - line.y1);
      intersections.push({ x, y });
    }
  }

  return intersections;
}

function sortPointsOnLine(points, line) {
  if (line.x1 === line.x2) {
    return points.sort((a, b) => a.y - b.y);
  } else {
    return points.sort((a, b) => a.x - b.x);
  }
}

export default function runDesignAI({ initialSettings }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log('initialSettings:', initialSettings);

    if (!initialSettings?.userPoints || initialSettings.userPoints.length < 3) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const xs = initialSettings.userPoints.map(p => p.x);
    const ys = initialSettings.userPoints.map(p => p.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const canvasCenterX = canvas.width / 2;
    const canvasCenterY = canvas.height / 2;
    const shapeCenterX = (minX + maxX) / 2;
    const shapeCenterY = (minY + maxY) / 2;
    const offsetX = canvasCenterX - shapeCenterX;
    const offsetY = canvasCenterY - shapeCenterY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    initialSettings.userPoints.forEach((point, index) => {
      const x = point.x + offsetX;
      const y = point.y + offsetY;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    const roomCount = initialSettings.roomSettings?.roomCount || 1;
    if (roomCount < 2) return;

    const splitLineCount = roomCount - 1;
    const verticalRatio = 0.5;

    const totalWidth = maxX - minX;
    const totalHeight = maxY - minY;

    function generateLinePositions(totalLength, count) {
      const positions = [];
      const gap = totalLength / (count + 1);
      for (let i = 1; i <= count; i++) {
        let pos = gap * i + (Math.random() * gap * 0.3 - gap * 0.15);
        positions.push(pos);
      }
      return positions.sort((a, b) => a - b);
    }

    const verticalCount = Math.round(splitLineCount * verticalRatio);
    const horizontalCount = splitLineCount - verticalCount;

    console.log('roomCount:', roomCount);
    console.log('verticalCount:', verticalCount, 'horizontalCount:', horizontalCount);

    const verticalPositions = generateLinePositions(totalWidth, verticalCount).map(x => minX + x);
    const horizontalPositions = generateLinePositions(totalHeight, horizontalCount).map(y => minY + y);

    console.log('verticalPositions:', verticalPositions);
    console.log('horizontalPositions:', horizontalPositions);

    const verticalLines = verticalPositions.map(x => ({
      x1: x, y1: minY, x2: x, y2: maxY,
      vertical: true
    }));
    const horizontalLines = horizontalPositions.map(y => ({
      x1: minX, y1: y, x2: maxX, y2: y,
      vertical: false
    }));

    const allLines = [...verticalLines, ...horizontalLines];

    const clippedLines = [];
    allLines.forEach(line => {
      const intersects = linePolygonIntersections(line, initialSettings.userPoints);
      if (intersects.length < 2) return;
      const sorted = sortPointsOnLine(intersects, line);
      clippedLines.push({
        x1: sorted[0].x,
        y1: sorted[0].y,
        x2: sorted[1].x,
        y2: sorted[1].y,
        vertical: line.vertical
      });
    });

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    clippedLines.forEach(line => {
      ctx.beginPath();
      ctx.moveTo(line.x1 + offsetX, line.y1 + offsetY);
      ctx.lineTo(line.x2 + offsetX, line.y2 + offsetY);
      ctx.stroke();
    });

  }, [initialSettings]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{
        border: '1px solid #ccc',
        position: 'relative',
        zIndex: 9999,
        marginTop: '-600px',
      }}
    />
  );
}
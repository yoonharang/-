import React, { useEffect, useRef } from 'react';

const utilityColors = {
  water: 'blue',
  sewage: 'brown',
  gas: 'orange',
  maingate: 'black',
};

export default function DrawingCanvas({
  points,
  isShapeClosed,
  utilityMarkers,
  onClickPoint,   // 클릭 시 좌표 추가 콜백 (기존)
  isSurveyFinished,
  isEraseMode,
  handleMarkerClick,
  onDataChange,   // 새로 추가한 콜백: 점/마킹 변경 시 상위로 알림
}) {
  const canvasRef = useRef(null);

  const drawLineWithLabel = (ctx, start, end) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = '#0071e3';
    ctx.lineWidth = 2;
    ctx.stroke();

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const pixelLength = Math.sqrt(dx * dx + dy * dy);
    const meterLength = (pixelLength / 120).toFixed(1);

    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;

    ctx.font = '14px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(`${meterLength}m`, midX, midY - 8);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isShapeClosed && points.length > 2) {
      ctx.fillStyle = 'rgba(150, 202, 255, 0.22)';
      ctx.strokeStyle = '#0071e3';
      ctx.lineWidth = 2;
      ctx.beginPath();
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#0071e3';
      ctx.fill();
    });

    for (let i = 0; i < points.length - 1; i++) {
      drawLineWithLabel(ctx, points[i], points[i + 1]);
    }
    if (isShapeClosed && points.length > 1) {
      drawLineWithLabel(ctx, points[points.length - 1], points[0]);
    }

    utilityMarkers.forEach((mark) => {
      ctx.beginPath();
      ctx.arc(mark.x, mark.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = utilityColors[mark.type] || 'gray';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
    });
  }, [points, isShapeClosed, utilityMarkers]);

  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (onClickPoint) onClickPoint({ x, y });

    // 여기에 상위 컴포넌트로 점 추가 데이터도 전달
    if (onDataChange) {
      const newPoints = [...points, { x, y }];
      // 유틸리티 마킹은 그대로 전달
      onDataChange(newPoints, utilityMarkers);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={540}
      onClick={handleCanvasClick}
      style={{
        border: '2px solid #afafaf3d',
        borderRadius: '25px',
        background: 'linear-gradient(to right, #e3f5ff, #fcdfff)',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        cursor: isSurveyFinished ? (isEraseMode ? 'crosshair' : 'pointer') : 'pointer',
        userSelect: 'none',
        display: 'block',
        margin: '0 auto',
      }}
    />
  );
}

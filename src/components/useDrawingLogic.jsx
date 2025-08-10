import { useState, useEffect } from 'react';
import { getClosestPointOnEdges } from './utils';

export default function useDrawingLogic(isVisible) {
  const [visible, setVisible] = useState(false);
  const [points, setPoints] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isShapeClosed, setIsShapeClosed] = useState(false);
  const [selectedUtility, setSelectedUtility] = useState(null);
  const [utilityMarkers, setUtilityMarkers] = useState([]);
  const [isSurveyFinished, setIsSurveyFinished] = useState(false);
  const [isEraseMode, setIsEraseMode] = useState(false); // 지우기 모드 상태

  const toggleEraseMode = () => {
    setIsEraseMode((prev) => !prev);
    setSelectedUtility(null); // 지우기 모드 켜면 선택된 유틸리티 해제
  };

  const handleCanvasClick = (point) => {
  if (!point) return;
  const { x, y } = point;

  if (!isShapeClosed && !isSurveyFinished) {
    if (points.length >= 3) {
      const dist = Math.hypot(x - points[0].x, y - points[0].y);
      if (dist < 10) {
        setIsShapeClosed(true);
        return;
      }
    }
    setUndoStack((prev) => [...prev, points]);
    setRedoStack([]);
    setPoints([...points, { x, y }]);
  } else if (isSurveyFinished) {
    const snapped = getClosestPointOnEdges(points, x, y, isShapeClosed);
    if (!snapped) return;

    if (isEraseMode) {
      const closestMarker = utilityMarkers.find(
        (m) => Math.hypot(m.x - snapped.x, m.y - snapped.y) < 10
      );
      if (closestMarker) {
        setUtilityMarkers((prev) =>
          prev.filter(
            (m) =>
              !(m.x === closestMarker.x && m.y === closestMarker.y && m.type === closestMarker.type)
          )
        );
      }
    } else if (selectedUtility) {
      setUtilityMarkers((prev) => [...prev, { ...snapped, type: selectedUtility }]);
    }
  }
};


  const handleMouseMove = () => {};

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, points]);
    setPoints(last);
    setUndoStack((prev) => prev.slice(0, -1));
    setIsShapeClosed(false);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, points]);
    setPoints(next);
    setRedoStack((prev) => prev.slice(0, -1));
  };

  const handleReset = () => {
    setPoints([]);
    setUndoStack([]);
    setRedoStack([]);
    setUtilityMarkers([]);
    setIsShapeClosed(false);
    setIsSurveyFinished(false);
    setSelectedUtility(null);
    setIsEraseMode(false);
  };

  const toggleUtility = (key) => {
    setSelectedUtility((prev) => (prev === key ? null : key));
    setIsEraseMode(false); // 유틸리티 선택 시 지우기 모드 해제
  };

  const finishSurvey = () => {
    setIsSurveyFinished(true);
    setSelectedUtility(null);
    setIsEraseMode(false);
  };

  // 모든 유틸리티 종류가 1개 이상 있어야 설정 끝내기 가능
  const canFinishSetting =
    utilityMarkers.some((m) => m.type === 'water') &&
    utilityMarkers.some((m) => m.type === 'sewage') &&
    utilityMarkers.some((m) => m.type === 'gas') &&
    utilityMarkers.some((m) => m.type === 'maingate');

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(isVisible), 300);
    return () => clearTimeout(timeout);
  }, [isVisible]);

  return {
    visible,
    points,
    undoStack,
    redoStack,
    isShapeClosed,
    isSurveyFinished,
    selectedUtility,
    utilityMarkers,
    setUtilityMarkers,   // 추가: 마커 상태 직접 수정 가능하도록
    canFinishSetting,
    isEraseMode,         // 지우기 모드 상태
    toggleEraseMode,     // 토글 함수
    handleCanvasClick,
    handleMouseMove,
    handleUndo,
    handleRedo,
    handleReset,
    toggleUtility,
    finishSurvey,
  };
}
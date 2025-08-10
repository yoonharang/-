import React, { useState } from 'react';
import DrawingCanvas from './drawingCanvas.jsx';
import UtilityBar from './utilityBar';
import ControlButtons from './ControlButtons';
import useDrawingLogic from './useDrawingLogic';
import RoomSettingsPanel from './RoomInfoModal';

export default function Index({ isVisible, onClose, onAIStart }) {
  const {
    visible,
    points,
    undoStack,
    redoStack,
    isShapeClosed,
    isSurveyFinished,
    selectedUtility,
    utilityMarkers,
    setUtilityMarkers,
    canFinishSetting,
    isEraseMode,
    toggleEraseMode,
    handleMouseMove,
    handleCanvasClick,
    handleUndo,
    handleRedo,
    handleReset,
    toggleUtility,
    finishSurvey,
  } = useDrawingLogic(isVisible);

  const [showRoomSettings, setShowRoomSettings] = useState(false);

  // 유틸리티 마커 삭제 함수
  const handleMarkerClick = (index) => {
    setUtilityMarkers((prev) => prev.filter((_, i) => i !== index));
  };

  // 모달 닫기
  const closeModal = () => {
    setShowRoomSettings(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        width: '100%',
        minHeight: '550px',
        paddingTop: '40px',
        boxSizing: 'border-box',
        position: 'relative',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.8s ease',
        userSelect: 'none',
      }}
    >
      <h2 style={{ marginTop: '-50px', color: '#0071e3' }}>
        {!isSurveyFinished ? '토지 모양 설계' : '배관 및 입구 설정'}
      </h2>
      <p style={{ marginBottom: '40px', color: '#555' }}>
        {!isSurveyFinished ? '마우스로 클릭하여 토지 그리기' : '마우스로 클릭하여 마킹하기'}
      </p>

      {/* 유틸리티 바 */}
      {isSurveyFinished && (
        <UtilityBar
          selectedUtility={selectedUtility}
          toggleUtility={toggleUtility}
          isEraseMode={isEraseMode}
          toggleEraseMode={toggleEraseMode}
        />
      )}

      {/* 도면 캔버스 */}
      <DrawingCanvas
        points={points}
        isShapeClosed={isShapeClosed}
        utilityMarkers={utilityMarkers}
        onClickPoint={handleCanvasClick}
        isSurveyFinished={isSurveyFinished}
        isEraseMode={isEraseMode}
        handleMarkerClick={handleMarkerClick}
      />

      {/* 제어 버튼 */}
      <ControlButtons
        isSurveyFinished={isSurveyFinished}
        undoStack={undoStack}
        redoStack={redoStack}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleReset}
        onFinish={finishSurvey}
        isShapeClosed={isShapeClosed}
      />

      {/* 완료 버튼 */}
      {isSurveyFinished && canFinishSetting && (
        <button
          onClick={() => setShowRoomSettings(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '60px',
            padding: '12px 24px',
            backgroundColor: '#0071e3',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '700',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
          }}
        >
          완료
        </button>
      )}

      {/* RoomSettingsPanel 모달 */}
      {showRoomSettings && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1100,
          }}
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              minWidth: '320px',
              maxWidth: '90vw',
            }}
          >
            <RoomSettingsPanel
              onSubmit={(roomSettingsData) => {
                // AI 시작 함수 호출 시, RoomInfoModal 데이터 + DrawingCanvas 데이터 함께 전달
                if (onAIStart) {
                  onAIStart({
                    ...roomSettingsData,
                    userPoints: points,
                    userUtilities: utilityMarkers,
                  });
                }
                setShowRoomSettings(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

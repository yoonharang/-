import React from 'react';
import { FaUndo, FaRedo } from 'react-icons/fa';

export default function ControlButtons({
  isSurveyFinished,
  undoStack,
  redoStack,
  onUndo,
  onRedo,
  onReset,
  onFinish,
  isShapeClosed,
}) {
  return (
    <>
      {/* 실행 취소 / 다시 실행 / 초기화 버튼 묶음 */}
      {!isSurveyFinished && (
        <div
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            marginLeft: '-940px',
            marginTop: '-540px',
          }}
        >
          <button
            onClick={onUndo}
            disabled={undoStack.length === 0}
            style={{
              padding: '10px 20px',
              borderRadius: '15px',
              backgroundColor: '#000',
              color: '#fff',
              fontWeight: '600',
            }}
            title="실행 취소"
          >
            <FaUndo />
          </button>

          <button
            onClick={onRedo}
            disabled={redoStack.length === 0}
            style={{
              padding: '10px 20px',
              borderRadius: '15px',
              backgroundColor: '#000',
              color: '#fff',
              fontWeight: '600',
            }}
            title="다시 실행"
          >
            <FaRedo />
          </button>

          <button
            onClick={onReset}
            style={{
              padding: '10px 20px',
              borderRadius: '15px',
              backgroundColor: '#000',
              color: '#fff',
              fontWeight: '600',
            }}
            title="초기화"
          >
            초기화
          </button>
        </div>
      )}

      {/* 토지 측량 끝내기 버튼 별도 */}
      {!isSurveyFinished && isShapeClosed && (
        <div
          style={{
            position: 'absolute',
            bottom: '-85px',
            left: '1080px',
          }}
        >
          <button
            onClick={onFinish}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              backgroundColor: '#0071e3',
              color: '#fff',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.5s',
            }}
            title="클릭하여 토지 측량 끝내기"
          >
            토지 측량 끝내기
          </button>
        </div>
      )}
    </>
  );
}
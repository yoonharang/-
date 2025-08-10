import React, { useRef, useState, useEffect } from 'react';
import Index from './components/index';
import RoomInfoModal from './components/RoomInfoModal'; // RoomInfoModal 임포트
import { FaTimes } from 'react-icons/fa';
import AI from './components/ai';

function App() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCanvasVisible, setIsCanvasVisible] = useState(false);
  const [animateCanvas, setAnimateCanvas] = useState(false);
  const [fadeInText, setFadeInText] = useState(false);
  const canvasRef = useRef(null);

  const [showRoomSettings, setShowRoomSettings] = useState(false);
  const [roomSettings, setRoomSettings] = useState(null);

  const openCanvas = () => {
    setIsExpanded(true);
    setTimeout(() => {
      setAnimateCanvas(true);
      setIsCanvasVisible(true);
    }, 50);
  };

  const closeCanvas = () => {
    if (canvasRef.current && typeof canvasRef.current.resetAll === 'function') {
      canvasRef.current.resetAll();
    }
    setAnimateCanvas(false);
    setIsCanvasVisible(false);
    setShowRoomSettings(false);
    setTimeout(() => {
      setIsExpanded(false);
    }, 500);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isExpanded) {
      const timer = setTimeout(() => setFadeInText(true), 100);
      return () => clearTimeout(timer);
    } else {
      setFadeInText(false);
    }
  }, [isExpanded]);

  // RoomInfoModal에서 전달받은 데이터 처리 함수
  const handleRoomSettingsSubmit = (data) => {
    setRoomSettings(data);
    setShowRoomSettings(false); // 설정창 닫기

    // 여기에 저장 로직 추가 가능 (ex. 서버 전송, 로컬 저장 등)
    console.log('설정 완료:', data);
  };

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '175vh',
        background:
          'linear-gradient(to right, rgba(184, 255, 255, 1), rgba(249, 205, 255, 1))',
        fontFamily:
          'Apple SD Gothic Neo, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen',
      }}
    >
      <header
        style={{
          backgroundColor: '#1d1d1f',
          padding: '180px 0',
          textAlign: 'center',
          animation: 'fadeInUp 1s ease-out',
          animationFillMode: 'forwards',
          color: 'white',
        }}
      >
        <h1 style={{ fontSize: '2.8rem', fontWeight: '700' }}>AI 건축 설계 프로젝트</h1>
        <p style={{ fontSize: '1.1rem', color: '#ccc' }}>공간 최적화를 위한 스마트 설계 플랫폼</p>
        <p style={{ fontSize: '1.5rem', color: '#ccc' }}>토지 디자인부터 AI 설계까지</p>
      </header>

      <main>
        <div
          style={{
            position: 'absolute',
            top: animateCanvas ? '800px' : '500px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#fff',
            borderRadius: '40px',
            boxShadow: '0 4px 20px rgba(83, 83, 83, 0.47)',
            padding: '25px',
            width: animateCanvas ? '1300px' : '200px',
            height: animateCanvas ? '700px' : '200px',
            textAlign: 'center',
            transition: 'all 0.5s ease 0.2s',
            overflow: 'hidden',
          }}
        >
          {!isExpanded && (
            <div
              style={{
                opacity: fadeInText ? 1 : 0,
                transform: fadeInText ? 'translateY(0px)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease, transform 0.8s ease',
              }}
            >
              <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#000000ff' }}>
                시작하기
              </h2>
              <button
                onClick={() => {
                  openCanvas();
                  window.scrollBy({ top: 700, behavior: 'smooth' });
                }}
                style={{
                  marginTop: '30px',
                  backgroundColor: '#0071e3',
                  color: 'white',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.63)',
                }}
              >
                디자인 만들기
              </button>
            </div>
          )}

          {isExpanded && (
            <div
              style={{
                opacity: animateCanvas ? 1 : 0,
                transform: animateCanvas ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 0.5s ease',
                position: 'relative',
                width: '100%',
                height: '100%',
              }}
            >
              {isCanvasVisible && (
                <>
                  <button
                    onClick={() => {
                      setTimeout(() => {
                        closeCanvas();
                        window.scrollBy({ top: -700, behavior: 'smooth' });
                      }, 500);
                    }}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      fontSize: '1.5rem',
                      color: '#5a5a5aff',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '50%',
                      zIndex: 10,
                    }}
                    title="닫기"
                  >
                    <FaTimes />
                  </button>

                  <Index ref={canvasRef} isVisible={animateCanvas} onAIStart={(data) => setRoomSettings(data)} />

                  {/* RoomInfoModal 표시 조건부 렌더링 */}
                  {showRoomSettings && (
                    <RoomInfoModal onSubmit={handleRoomSettingsSubmit} />
                  )}
                  {roomSettings && <AI initialSettings={roomSettings} />}
                </>
              )}
            </div>
          )}
        </div>
      </main>

      
    </div>
  );
}

export default App;

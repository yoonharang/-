import React, { useState } from 'react';

export default function RoomInfoModal({ onSubmit }) {
  const [roomCount, setRoomCount] = useState(3);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [hasBalcony, setHasBalcony] = useState(false);
  const [hasHallway, setHasHallway] = useState(false);
  const [hasLivingRoom, setHasLivingRoom] = useState(true);
  const [hasKitchen, setHasKitchen] = useState(true);

  const handleSubmit = () => {
    onSubmit({
      roomCount,
      bathroomCount,
      hasBalcony,
      hasHallway,
      hasLivingRoom,
      hasKitchen,
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        width: '320px',
        color: '#000',
        textAlign: 'left',
        zIndex: 1001,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ marginBottom: '16px' }}>세부 설정</h2>

      <div style={{ marginBottom: '12px' }}>
        <label>방 개수: </label>
        <input
          type="number"
          min={1}
          value={roomCount}
          onChange={(e) => setRoomCount(parseInt(e.target.value) || 1)}
          style={{ width: '60px', marginLeft: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label>화장실 개수: </label>
        <input
          type="number"
          min={0}
          value={bathroomCount}
          onChange={(e) => setBathroomCount(parseInt(e.target.value) || 0)}
          style={{ width: '60px', marginLeft: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label>
          <input
            type="checkbox"
            checked={hasBalcony}
            onChange={() => setHasBalcony(!hasBalcony)}
          />{' '}
          베란다
        </label>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label>
          <input
            type="checkbox"
            checked={hasHallway}
            onChange={() => setHasHallway(!hasHallway)}
          />{' '}
          복도
        </label>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label>
          <input
            type="checkbox"
            checked={hasLivingRoom}
            onChange={() => setHasLivingRoom(!hasLivingRoom)}
          />{' '}
          거실
        </label>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label>
          <input
            type="checkbox"
            checked={hasKitchen}
            onChange={() => setHasKitchen(!hasKitchen)}
          />{' '}
          주방
        </label>
      </div>

      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: '#0071e3',
            color: 'white',
            padding: '10px 22px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          설정 완료
        </button>
      </div>
    </div>
  );
}
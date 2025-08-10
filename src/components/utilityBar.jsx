import React from 'react';
import { FaTint, FaToilet, FaFire, FaTrashAlt, FaDoorOpen } from 'react-icons/fa';

const utilityOptions = [
  { key: 'water', icon: <FaTint />, color: 'blue', label: '상수도' },
  { key: 'sewage', icon: <FaToilet />, color: 'brown', label: '하수도' },
  { key: 'gas', icon: <FaFire />, color: 'orange', label: '가스관' },
  { key: 'maingate', icon: <FaDoorOpen />, color: 'black', label: '정문' },
];

export default function UtilityBar({ selectedUtility, toggleUtility, isEraseMode, toggleEraseMode }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '120px',
        left: '60px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '10px',
        borderRadius: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.54)',
        zIndex: 20,
        backgroundColor: '#fff',
      }}
    >
      {utilityOptions.map(({ key, icon, color, label }) => (
        <button
          key={key}
          onClick={() => toggleUtility(key)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: selectedUtility === key && !isEraseMode ? '#eee' : '#fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            transform: selectedUtility === key && !isEraseMode ? 'translateX(5px)' : 'translateX(0)',
            transition: 'all 0.3s ease',
            color: '#000',
            fontWeight: '600',
          }}
        >
          <div style={{ width: '20px', height: '20px', backgroundColor: color, borderRadius: '50%' }} />
          {icon} <span>{label}</span>
        </button>
      ))}

      {/* 지우기 버튼 */}
      <button
        onClick={toggleEraseMode}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          borderRadius: '10px',
          border: 'none',
          backgroundColor: isEraseMode ? '#f88' : '#fff',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          color: isEraseMode ? '#fff' : '#000',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <FaTrashAlt />
        지우기
      </button>
    </div>
  );
}
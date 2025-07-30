import React from 'react';
import './Loading.css';

const Loading: React.FC = () => {
  return (
    <div className="loading-overlay">
      <div className="dot-loader">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p className="loading-text">Đang tải dữ liệu...</p>
    </div>
  );
};

export default Loading;

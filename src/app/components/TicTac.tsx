"use client";

import React, { useEffect, useState } from 'react';
const TicTac: React.FC = () => {
  const [text, setText] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      const randomText = text === 'tic' ? 'tac' : 'tic';
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      setText(randomText);
      const ticTacElement = document.getElementById('tic-tac');
      if (ticTacElement) {
        ticTacElement.style.left = `${x}vw`;
        ticTacElement.style.top = `${y}vh`;
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      id="tic-tac"
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        userSelect: 'none',
        fontSize: '2rem',
        opacity: 0.7,
      }}
    >
      {text}
    </div>
  );
};

export default TicTac;

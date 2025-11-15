import React from 'react';

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="absolute w-2 h-3" style={style}></div>
);

export const Confetti: React.FC = () => {
  const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
  
  // Use a fixed seed for the random values to avoid re-rendering on every frame if React batches updates
  const randomSeed = React.useMemo(() => Array.from({ length: 100 }, Math.random), []);

  const pieces = randomSeed.map((rand, i) => {
    const colorIndex = Math.floor(randomSeed[i * 2 % 100] * colors.length);
    const style = {
      left: `${randomSeed[i * 3 % 100] * 100}%`,
      top: `${-10 - randomSeed[i * 4 % 100] * 20}%`,
      backgroundColor: colors[colorIndex],
      animation: `fall ${1.5 + randomSeed[i * 5 % 100] * 1.5}s ease-out forwards`,
      animationDelay: `${randomSeed[i * 6 % 100] * 0.8}s`,
      transform: `rotate(${randomSeed[i * 7 % 100] * 360}deg)`,
      opacity: 1,
    };
    return <ConfettiPiece key={i} style={style} />;
  });

  return (
    <>
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(120vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
      <div className="absolute inset-0 pointer-events-none z-50">
        {pieces}
      </div>
    </>
  );
};

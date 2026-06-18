import { useUI } from '../../context/UIContext';

export default function ThemeBackground() {
  const { theme } = useUI();

  return (
    <div className="theme-bg-container">
      {theme === 'space' || theme === 'dark' ? <SpaceBackground /> : <SkyBackground />}
    </div>
  );
}

function SpaceBackground() {
  // Create 3 layers of stars for parallax
  const createStars = (count, sizeRange, speedRange) => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * sizeRange[0] + sizeRange[1]}px`,
      duration: `${Math.random() * speedRange[0] + speedRange[1]}s`,
      delay: `${Math.random() * -20}s`,
      opacity: Math.random() * 0.5 + 0.3
    }));

  const layers = [
    { count: 60, size: [1, 1], speed: [40, 60] },
    { count: 30, size: [2, 1], speed: [20, 30] },
    { count: 15, size: [3, 2], speed: [10, 15] }
  ];

  return (
    <div className="space-bg">
      <div className="nebula" />
      {layers.map((layer, lIdx) => (
        <div key={lIdx} className="star-layer">
          {createStars(layer.count, layer.size, layer.speed).map(star => (
            <div
              key={star.id}
              className="star"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                '--d': star.duration,
                '--op': star.opacity,
                animationDelay: star.delay
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function SkyBackground() {
  const clouds = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 50}%`,
    duration: `${Math.random() * 20 + 40}s`,
    delay: `${Math.random() * -40}s`,
    scale: Math.random() * 0.4 + 0.6
  }));

  return (
    <div className="sky-bg">
      <div className="sunbeams" />
      <div className="sun" />
      {clouds.map(cloud => (
        <div
          key={cloud.id}
          className="cloud"
          style={{
            top: cloud.top,
            '--d': cloud.duration,
            animationDelay: cloud.delay,
            transform: `scale(${cloud.scale})`
          }}
        >
          <svg viewBox="0 0 24 24" fill="white">
             <path d="M17.5,19c-3.037,0-5.5-2.463-5.5-5.5c0-0.212,0.013-0.42,0.038-0.625C11.191,12.56,10.151,12.35,9,12.35 c-2.485,0-4.5,2.015-4.5,4.5c0,0.111,0.005,0.22,0.014,0.328C3.12,17.653,2,18.895,2,20.35c0,1.464,1.186,2.65,2.65,2.65h12.85 c1.381,0,2.5-1.119,2.5-2.5C20,19.219,18.881,18.1,17.5,19z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

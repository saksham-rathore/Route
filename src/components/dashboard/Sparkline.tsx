'use client';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  strokeColor?: string;
}

export function Sparkline({ 
  data, 
  width = 80, 
  height = 24,
  strokeColor 
}: SparklineProps) {
  if (!data || data.length === 0) {
    return (
      <svg width={width} height={height} className="opacity-30">
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="#3b82f6"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  // Determine color based on data trend and values
  const avg = data.reduce((a, b) => a + b, 0) / data.length;
  const color = strokeColor || (avg > 500 ? '#f59e0b' : avg > 1000 ? '#ef4444' : '#3b82f6');

  // Calculate min and max for normalization
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Generate points for the polyline
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1 || 1)) * width;
    // Invert Y because SVG coordinates start from top
    const normalizedValue = (value - min) / range;
    const y = height - (normalizedValue * (height - 4) + 2); // Add padding
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

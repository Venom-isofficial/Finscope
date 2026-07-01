/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";

interface AssetChartProps {
  data: number[];
  color?: string; // e.g. hex var(--chart-green) or var(--chart-red)
  height?: number;
  symbol: string;
}

export const AssetChart: React.FC<AssetChartProps> = ({ data, color = "var(--chart-green)", height = 180, symbol }) => {
  const [activeTab, setActiveTab] = useState<"1D" | "1W" | "1M" | "6M" | "1Y">("1D");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [width, setWidth] = useState(300);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive container sizing
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Generate different variations of data points based on interval
  const getPointsForTab = () => {
    if (activeTab === "1D") return data;
    // Build simulated history for larger periods
    const seed = data[data.length - 1] || 100;
    if (activeTab === "1W") return [seed * 0.96, seed * 0.98, seed * 0.95, seed * 1.01, seed * 0.99, seed * 1.02, seed];
    if (activeTab === "1M") return [seed * 0.92, seed * 0.95, seed * 0.91, seed * 0.98, seed * 0.94, seed * 1.04, seed * 0.98, seed * 1.05, seed];
    if (activeTab === "6M") return [seed * 0.82, seed * 0.88, seed * 0.85, seed * 0.96, seed * 0.92, seed * 1.08, seed * 0.99, seed * 1.15, seed];
    return [seed * 0.72, seed * 0.85, seed * 0.79, seed * 0.98, seed * 0.91, seed * 1.25, seed * 1.12, seed * 1.42, seed]; // 1Y
  };

  const points = getPointsForTab();
  const minVal = Math.min(...points) * 0.995;
  const maxVal = Math.max(...points) * 1.005;
  const valRange = maxVal - minVal || 1;

  // Build SVG Path
  const svgPoints = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - ((val - minVal) / valRange) * (height - 30) - 15;
    return { x, y, value: val };
  });

  const pathD = svgPoints.length > 0 
    ? `M ${svgPoints[0].x} ${svgPoints[0].y} ` + svgPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ")
    : "";

  const areaD = svgPoints.length > 0
    ? `${pathD} L ${svgPoints[svgPoints.length - 1].x} ${height} L ${svgPoints[0].x} ${height} Z`
    : "";

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    // Find closest index
    let closestIdx = 0;
    let minDiff = Infinity;
    svgPoints.forEach((p, idx) => {
      const diff = Math.abs(p.x - mouseX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    setHoverIndex(closestIdx);
    setCoords({ x: svgPoints[closestIdx].x, y: svgPoints[closestIdx].y });
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setCoords(null);
  };

  // Check overall trend to color the chart
  const isPositive = points[points.length - 1] >= points[0];
  const activeColor = isPositive ? "var(--chart-green)" : "var(--chart-red)";

  return (
    <div ref={containerRef} className="w-full flex flex-col">
      {/* Dynamic Hover Details Panel */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-brand-text-secondary">
            {hoverIndex !== null ? "TRACKING PRICE" : "CURRENT VALUE"}
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold font-mono tracking-tight text-brand-text-primary">
              ${(hoverIndex !== null ? svgPoints[hoverIndex].value : points[points.length - 1]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <span className={`text-xs font-bold font-mono ${isPositive ? "text-brand-chart-green" : "text-brand-chart-red"}`}>
              {isPositive ? "+" : ""}{(((points[points.length - 1] - points[0]) / points[0]) * 100).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Time filters */}
        <div className="flex gap-1 bg-brand-text-primary/5 p-1 rounded-xl border border-brand-text-primary/5">
          {(["1D", "1W", "1M", "6M", "1Y"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setHoverIndex(null); }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider transition-all duration-300 ${
                activeTab === tab
                  ? "bg-brand-btn-accent text-brand-primary shadow-sm"
                  : "text-brand-text-secondary hover:text-brand-text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-visible" style={{ height }}>
        <svg
          className="w-full h-full overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id={`grad-${symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={activeColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={activeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Guideline */}
          <line x1="0" y1={height - 15} x2={width} y2={height - 15} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1="0" y1="15" x2={width} y2="15" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

          {/* Glowing Vector Area */}
          {areaD && (
            <path
              d={areaD}
              fill={`url(#grad-${symbol})`}
              className="transition-all duration-500"
            />
          )}

          {/* Core Vector Chart Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={activeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round" />
          )}

          {/* Crosshair Tracking Indicators */}
          {coords && (
            <>
              {/* Vertical Crosshair dotted line */}
              <line
                x1={coords.x}
                y1="0"
                x2={coords.x}
                y2={height}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />

              {/* Glowing anchor node */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r="6"
                fill={activeColor}
                stroke="var(--bg-primary)"
                strokeWidth="2"
              />
              <circle
                cx={coords.x}
                cy={coords.y}
                r="12"
                fill={activeColor}
                fillOpacity="0.25"
                className="animate-ping"
              />
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

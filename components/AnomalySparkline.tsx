"use client";

import { useEffect, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { useTheme } from "next-themes";

interface SparklinePoint {
  date: string;
  price: number;
  isAnomaly: boolean;
  deviation: number;
}

interface AnomalySparklineProps {
  data: SparklinePoint[];
  direction: "spike" | "drop" | "none";
}

export default function AnomalySparkline({ data, direction }: AnomalySparklineProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-14 w-full bg-background-deep animate-pulse rounded-card" />;
  }

  // Accent Orange (#FFA946) for spike, Crimson/Red (#E05252) for drop
  const strokeColor = direction === "spike" ? "#FFA946" : "#E05252";

  return (
    <div className="h-14 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 6, bottom: 6, left: 6, right: 6 }}>
          <defs>
            <linearGradient id={`gradient-${direction}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.15} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" hide />
          <YAxis domain={["auto", "auto"]} hide />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-[#1A1A1A] text-[#FFFFEB] text-[9px] px-2.5 py-1.5 rounded-card border border-white/10 shadow-lg font-sans">
                    <div className="font-semibold">{item.date}</div>
                    <div className="font-extrabold mt-0.5">
                      ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                    </div>
                    {item.isAnomaly && (
                      <div className="text-[#FFA946] font-bold mt-0.5 text-[8px] uppercase tracking-wider">
                        {Math.abs(item.deviation).toFixed(1)} SD {item.deviation >= 0 ? "Spike" : "Drop"}
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={1.5}
            fill={`url(#gradient-${direction})`}
            dot={(props) => {
              const { cx, cy, index } = props;
              const item = data[index];
              if (item && item.isAnomaly) {
                return (
                  <circle
                    key={index}
                    cx={cx}
                    cy={cy}
                    r={3.5}
                    fill={strokeColor}
                    stroke={resolvedTheme === "dark" ? "#232320" : "#FFFFEB"}
                    strokeWidth={1.2}
                  />
                );
              }
              return <g key={index} />; // empty element to satisfy typing return
            }}
            activeDot={{ r: 4, strokeWidth: 0, fill: strokeColor }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

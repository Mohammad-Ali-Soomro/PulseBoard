import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "light" | "deep";
}

export default function Skeleton({ className = "", variant = "deep" }: SkeletonProps) {
  // variant "deep" uses bg-background-deep/60 (#E4E4D0 base) for contrast on lemon cream bg
  // variant "light" uses bg-background/60 (#FFFFEB base) for contrast on deep backgrounds
  const baseColor = variant === "deep" ? "bg-background-deep/60" : "bg-background/60";
  return (
    <div
      className={`animate-pulse ${baseColor} ${className}`}
    />
  );
}

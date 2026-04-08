interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { fontSize: "text-xl", gap: "gap-1", lineHeight: "h-5" },
  md: { fontSize: "text-3xl", gap: "gap-1.5", lineHeight: "h-7" },
  lg: { fontSize: "text-5xl", gap: "gap-2", lineHeight: "h-10" },
};

export function Logo({ size = "md", className }: LogoProps) {
  const s = sizeMap[size];

  return (
    <div className={`flex items-center ${s.gap} select-none ${className ?? ""}`}>
      <span
        className={`${s.fontSize} font-bold tracking-tight`}
        style={{ color: "#1A6B5A" }}
      >
        R
      </span>
      <span
        className={`${s.lineHeight} border-l-2 border-dashed`}
        style={{ borderColor: "rgba(26,107,90,0.25)" }}
      />
      <span
        className={`${s.fontSize} font-bold tracking-tight opacity-[0.18]`}
        style={{ color: "#1A6B5A", transform: "scaleX(-1)" }}
      >
        R
      </span>
    </div>
  );
}

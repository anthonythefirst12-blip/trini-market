interface BadgeProps {
  children: React.ReactNode;
  variant?: "blue" | "green" | "amber" | "red" | "gray";
  size?: "sm" | "md";
}

const variantClasses = {
  blue: "bg-blue-100 text-blue-800",
  green: "bg-green-100 text-green-800",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-800",
  gray: "bg-gray-100 text-gray-700",
};

export function Badge({ children, variant = "gray", size = "sm" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center font-medium rounded-full",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        variantClasses[variant],
      ].join(" ")}
    >
      {children}
    </span>
  );
}

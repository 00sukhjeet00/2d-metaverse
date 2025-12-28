interface AvatarProps {
  initial: string;
  size?: "sm" | "md" | "lg";
  variant?: "blue" | "gray";
  title?: string;
}

const Avatar = ({
  initial,
  size = "md",
  variant = "blue",
  title,
}: AvatarProps) => {
  const sizes = {
    sm: "h-6 w-6 text-[8px]",
    md: "h-8 w-8 text-[10px]",
    lg: "h-12 w-12 text-lg",
  };

  const variants = {
    blue: "bg-blue-500 text-white",
    gray: "bg-gray-700 text-gray-400",
  };

  return (
    <div
      className={`${sizes[size]} ${variants[variant]} rounded-full ring-2 ring-gray-800 flex items-center justify-center font-bold relative group`}
      title={title}
    >
      <span className="uppercase">{initial}</span>
    </div>
  );
};

export default Avatar;

import { FC } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  onClick: () => void;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
};

export const Button: FC<Props> = ({
  onClick,
  className = "",
  onKeyDown,
  children,
}) => {
  return (
    <button
      className={twMerge(
        "bg-red-500 text-white px-4 py-2 rounded-md",
        className,
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      onKeyDown={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (onKeyDown) {
          onKeyDown(e);
        } else {
          if (e.key === "Enter" || e.key === " ") {
            onClick();
          }
        }
      }}
    >
      {children}
    </button>
  );
};

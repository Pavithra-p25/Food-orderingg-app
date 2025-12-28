import React from "react";
import "./Button.css";

interface MyButtonProps {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "cancel" |"outline-secondary"; //button theme
  style?: React.CSSProperties; //inline styles if needed
  className?: string;
  text?:string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>; //TypeScript to know the exact element type(button)
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const MyButton: React.FC<MyButtonProps> = ({
  text,
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`theme-btn ${variant} ${className}`}
      {...props} //collect style, onClick, disabled..
    >
      {children || text}
    </button>
  );
};

export default MyButton;

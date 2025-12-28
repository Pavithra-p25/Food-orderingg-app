import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

interface MyToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
  type?: "success" | "error" | "info";
  position?: "top-end" | "top-start" | "bottom-end" | "bottom-start" | "top-center" | "bottom-center" | "middle-center";
  delay?: number;
}

const MyToast: React.FC<MyToastProps> = ({
  show,
  message,
  onClose,
  type = "info",
  position = "top-end",
  delay = 2000,
}) => {
  
  const bgColor =
    type === "success"
      ? "green"
      : type === "error"
      ? "red"
      : "gray";

  const textColor = "white";

  return (
    <ToastContainer position={position} className="p-3">
      <Toast
        show={show}
        onClose={onClose}
        delay={delay}
        autohide
        className="border-0"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <Toast.Body className="text-center">{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default MyToast;

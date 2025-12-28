import React from "react";
import { Form } from "react-bootstrap";

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  name?: string; 
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  error?: string;
  accept?: string;
  required?: boolean; // for required error

}

const MyInput: React.FC<InputProps> = ({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  className,
  error,
  accept,
  required,
  ...rest
  
}) => {
  return (
     <Form.Group className="mb-3">
      {label && (
        <Form.Label>
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </Form.Label>
      )}
     
      <Form.Control
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className={className}
        accept={accept}
        {...rest}
      />

      {error && <small className="text-danger d-block mt-1 mb-2">{error}</small>}
    </Form.Group>
  );
};

export default MyInput;

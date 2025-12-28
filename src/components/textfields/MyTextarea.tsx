import React from "react";
import { Form } from "react-bootstrap";

interface MyTextareaProps {
  label?: string;
  placeholder?: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  className?: string;
  error?: string;
  required ?: boolean
}

const MyTextarea: React.FC<MyTextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
  className,
  error,
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
        as="textarea"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={className}
        {...rest}
      />

      {error && <small className="text-danger">{error}</small>}
    </Form.Group>
  );
};

export default MyTextarea;

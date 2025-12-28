import React from "react";
import { Form } from "react-bootstrap";

interface MyDropdownProps {
  label?: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  className?: string;
  error?: string;
  required?: boolean;
}

const MyDropdown: React.FC<MyDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  className,
  required,
  error,
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

      <Form.Select {...rest} value={value} onChange={onChange} className={className}>
        <option value="">Select {label}</option>
        {options.map((opt, index) => (
          <option key={index} value={opt}>
            {opt}
           
          </option>
        ))}
      </Form.Select>

      {error && <small className="text-danger">{error}</small>}
    </Form.Group>
  );
};

export default MyDropdown;

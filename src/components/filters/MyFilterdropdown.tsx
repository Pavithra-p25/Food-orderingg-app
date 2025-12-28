import React from "react";
import { Form, InputGroup } from "react-bootstrap";

interface MyFilterdropdownProps {
  label?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
  icon?: React.ReactNode; 
}

const MyFilterdropdown: React.FC<MyFilterdropdownProps> = ({
  label,
  value,
  options,
  onChange,
  className,
  icon,
}) => {
  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}

      <InputGroup>
        {icon && <InputGroup.Text>{icon}</InputGroup.Text>}
        <Form.Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Form.Select>
      </InputGroup>
    </Form.Group>
  );
};

export default MyFilterdropdown;

import React from "react";
import { Form, InputGroup } from "react-bootstrap";

interface MyFilterinputProps {
  label?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode; // optional icon prop
}

const MyFilterinput: React.FC<MyFilterinputProps> = ({
  label,
  value,
  placeholder,
  onChange,
  icon,
}) => {
  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}

      <InputGroup>
        {icon && <InputGroup.Text>{icon}</InputGroup.Text>}
        <Form.Control
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </InputGroup>
    </Form.Group>
  );
};

export default MyFilterinput;

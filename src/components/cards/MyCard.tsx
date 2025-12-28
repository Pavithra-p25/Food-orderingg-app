import React from "react";
import { Card } from "react-bootstrap";
import MyButton from "../button/MyButton";

interface MyCardProps {
  image?: string;
  title?: string;
  subtitle?: string; // category, rating
  description?: string;
  buttonText?: string;
  buttonClassName?: string;
  onButtonClick?: () => void;
  height?: string;
  children?: React.ReactNode;
}

const MyCard: React.FC<MyCardProps> = ({
  image,
  title,
  subtitle,
  description,
  buttonText,
  buttonClassName,
  onButtonClick,
  height = "200px",
  children,
}) => {
  return (
    <Card className="h-100 shadow-sm d-flex flex-column">
      {image && (
        <Card.Img
          variant="top"
          src={image}
          style={{ height, objectFit: "cover" }}
        />
      )}

      <Card.Body className="d-flex flex-column">
        {title && <Card.Title>{title}</Card.Title>}

        {subtitle && (
          <Card.Subtitle className="mb-2 text-muted">
            {subtitle}
          </Card.Subtitle>
        )}

        {description && <Card.Text>{description}</Card.Text>}

        {buttonText && (
          <MyButton
            className={buttonClassName || "theme-btn primary"}
            onClick={onButtonClick}
          >
            {buttonText}
          </MyButton>
        )}

        {children && <div className="mt-3">{children}</div>}
      </Card.Body>
    </Card>
  );
};

export default MyCard;

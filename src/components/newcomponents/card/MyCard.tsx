import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import MyButton from "../button/MyButton";
import type { SxProps, Theme } from "@mui/material/styles";

type CustomCardProps = {
  title?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonVariant?: "primary" | "secondary" | "success" | "cancel" | "outlined";
  onButtonClick?: () => void;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
};

const CustomCard: React.FC<CustomCardProps> = ({
  title,
  description,
  image,
  buttonText,
  buttonVariant = "primary",
  onButtonClick,
  children,
  
}) => {
  return (
    <Card>
      {image && <CardMedia component="img" height="140" image={image} />}
      <CardContent>
        {title && <Typography variant="h6">{title}</Typography>}
        {description && (
          <Typography variant="body2" color="text.secondary" mt={1}>
            {description}
          </Typography>
        )}
        {children}
        {buttonText && onButtonClick && (
          <Box mt={2}>
            <MyButton fullWidth variant={buttonVariant} onClick={onButtonClick}>
              {buttonText}
            </MyButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomCard;

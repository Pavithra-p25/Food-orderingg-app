import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import MyButton from "../button/MyButton";
import type { SxProps, Theme } from "@mui/material/styles";

type CustomCardProps = {
  title?: string;
  description?: string;
  image?: string;
  imageHeight?: number;
  buttonText?: string;
  buttonVariant?: "primary" | "secondary" | "success" | "cancel" | "outlined";
  onButtonClick?: () => void;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
};

const MyCard: React.FC<CustomCardProps> = ({
  title,
  description,
  image,
  imageHeight = 180,
  buttonText,
  buttonVariant = "primary",
  onButtonClick,
  children,
  sx,
}) => {
  return (
    <Card
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderRadius: 2,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
        ...sx,
      }}
    >
      {image && (
        <CardMedia component="img" height={imageHeight} image={image} />
      )}

      <CardContent>
        {title && (
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        )}

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

export default MyCard;

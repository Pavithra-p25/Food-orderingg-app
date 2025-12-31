import React from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";

interface CloseIconButtonProps {
  onClick: () => void;
  tooltip?: string;
}

const CloseIconButton: React.FC<CloseIconButtonProps> = ({
  onClick,
  tooltip = "Close",
}) => {
  return (
    <Tooltip title={tooltip}>
      <IconButton
        aria-label="close"
        onClick={onClick}
        sx={{ color: "grey" }}
      >
        <CloseIcon />
      </IconButton>
    </Tooltip>
  );
};

export default CloseIconButton;

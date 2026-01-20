import React, { type ReactNode } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type MyAccordionProps = {
  expanded: boolean;
  onChange: (_: React.SyntheticEvent, isExpanded: boolean) => void;
  summary: ReactNode;
  children: ReactNode;
  sx?: object;
};

const MyAccordion: React.FC<MyAccordionProps> = ({
  expanded,
  onChange,
  summary,
  children,
  sx,
}) => {
  return (
    <Accordion expanded={expanded} onChange={onChange} sx={sx}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>{summary}</AccordionSummary>
      <AccordionDetails>
        <Box>{children}</Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default MyAccordion;

import React, { type ReactNode } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  type AccordionProps,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export type MyAccordionProps = {
  summary: ReactNode;
  children: ReactNode;
} & AccordionProps;

const MyAccordion: React.FC<MyAccordionProps> = ({
  summary,
  children,
  ...props
}) => {
  return (
    <Accordion disableGutters {...props}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {summary}
      </AccordionSummary>

      <AccordionDetails>
        <Box>{children}</Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default MyAccordion;

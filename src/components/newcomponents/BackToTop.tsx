import { useEffect, useState } from "react";
import { Fab, Zoom } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300); // show after scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Zoom in={visible}>
      <Fab
        onClick={scrollToTop}
        aria-label="back to top"
        size="small"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          backgroundColor: "black",
          color: "white",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          "&:hover": {
            backgroundColor: "dimgray",
            transform: "scale(1.1)",
          },
          transition: "all 0.3s ease",
          zIndex: 1300,
        }}
      >
        <KeyboardArrowUpIcon fontSize="large" />
      </Fab>
    </Zoom>
  );
};

export default BackToTop;

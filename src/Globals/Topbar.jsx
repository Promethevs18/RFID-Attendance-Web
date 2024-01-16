import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../theme";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";


const Topbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlined />
          ) : (
            <LightModeOutlined />
          )}
        </IconButton>
        <a href="https://www.facebook.com/perpetualmolino/">
          <img
            alt="SSG Logo"
            width="35px"
            height="45px"
            src="https://firebasestorage.googleapis.com/v0/b/protoperp-attendance-monitor.appspot.com/o/university-icon-removebg-preview.png?alt=media&token=a0718810-f2b7-43f8-9ad6-a44caf59b95a"
            style={{ borderRadius: "40%", marginLeft: "10px" }}
            />
        </a>
        </Box>
    </Box>
  );
};

export default Topbar;

//THIS PROJECT WAS MADE BY PROMETHEUS

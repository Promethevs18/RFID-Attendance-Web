import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../theme";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";


const Topbar = ({userName, access}) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const[name, setName] = useState("");

  useEffect(() => {
    if(userName && userName !== null){
      setName(userName)
    }
    else{
      setName(access)
    }
  }, [access, userName])
 


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
        { access !== 'Unauthorized' && (
          <Typography
          variant="h4"
          color={tokens(theme.palette.mode).white}
          fontWeight="bold"
          fontStyle="italic"
          sx={{ml: "20px"}}
          >Welcome {name}</Typography>
          )}
        </Box>
    </Box>
  );
};

export default Topbar;

//THIS PROJECT WAS MADE BY PROMETHEUS

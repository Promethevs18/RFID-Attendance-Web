import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color={colors.white[100]}
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        {title}
      </Typography>
      <Typography variant="h4" color={colors.white[200]} fontStyle="italic">
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;

//THIS PROJECT WAS MADE BY PROMETHEUS

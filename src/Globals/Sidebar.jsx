import { useState, React } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../theme";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Diversity3Icon from '@mui/icons-material/Diversity3';
import LogoutIcon from '@mui/icons-material/Logout';

const Item = ({ title, to, icon, selected, setSelected, user }) => {
  const theme = useTheme();
  const kulay = tokens(theme.palette.mode);
  const out_and_select = (pamagat) => {
    if (user?.uid) {
      signOut(auth).then(() => {
        toast.info("You have successfully logged out");
      });
    }
    setSelected(pamagat)
  };

  return (
    <MenuItem
      active={selected === title}
      style={{ color: kulay.maroon[100] }}
      onClick={() => out_and_select(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ user, setActive }) => {
  const theme = useTheme();
  const kulay = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");


  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${kulay.maroon[600]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-inner-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed} style={{ height: "100%" }}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: kulay.maroon[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {/* USER */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="SSG Logo"
                  width="150px"
                  height="150px"
                  src="https://firebasestorage.googleapis.com/v0/b/pnhs-online-voting.appspot.com/o/Misc%2FSSG%20Logo.png?alt=media&token=3939d326-17b9-424b-9ef1-efc3b1f9559f&_gl=1*1mbw1rd*_ga*OTc5MjU5NDA0LjE2OTY4MjM3NjY.*_ga_CW55HF8NVT*MTY5NzAwMTM1NS4xMi4xLjE2OTcwMDEzNTkuNTYuMC4w"
                  style={{ borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                {"lXIif4C0GcdeNxKVDv2oIyrlUG13" === user?.uid && (
                  <Typography
                    variant="h2"
                    color={kulay.maroon[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    Administrator
                  </Typography>
                )}
                <Typography variant="h5" color={kulay.goldish[500]}>
                  SSG Online Voting System CMS
                </Typography>
              </Box>
            </Box>
          )}

          {/* Menu Items */}
          <Box paddingLeft={!isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlined />}
              selected={selected}
              setSelected={setSelected}
            />
            { "lXIif4C0GcdeNxKVDv2oIyrlUG13" === user?.uid && (
                <Item
                     title="Add Candidate"
                     to="/addcandidate"
                     icon={<Diversity3Icon/>}
                     selected={selected}
                     setSelected={setSelected}
                /> 
            )}
     
            {user?.uid ? (
              <Item
                title="Press me to logout"
                to="/"
                icon={<LogoutIcon/>}
                selected={selected}
                setSelected={setSelected}
                user={user}
            /> 
            ):(
              <Item
                title="Log in to the system"
                to="/authentication"
                icon={<LogoutIcon/>}
                selected={selected}
                setSelected={setSelected}
            /> 
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;

//THIS PROJECT WAS MADE BY PROMETHEUS

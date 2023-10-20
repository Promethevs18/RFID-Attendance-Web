import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useEffect, useState } from "react";
import { auth } from "./firebase"
import Sidebar from "./Globals/Sidebar";
import Topbar from "./Globals/Topbar";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import { Dashboard } from "@mui/icons-material";

function App() {
  const [theme, colorMode] = useMode();
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("Dashboard");

  useEffect(() =>{
    auth.onAuthStateChanged((authUser) =>{
      if(authUser){
        setUser(authUser);
      }
      else{
        setUser(null);
      }
    })
  },[])


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <div className="app">
          <Sidebar setActive={setActive} active={active} user={user}/>
          <main className="content">
            <Topbar/>
            <ToastContainer position="top-center" theme="colored" autoClose={3000}/>
            <Routes setUser={user}>
              <Route path="/" element={<Dashboard setActive={setActive} />}/>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

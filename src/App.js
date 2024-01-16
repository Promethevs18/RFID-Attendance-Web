import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useEffect, useState } from "react";
import { auth } from "./firebase"
import Sidebar from "./Globals/Sidebar";
import Topbar from "./Globals/Topbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Scenes/Dashboard";
import Authentication from "./Scenes/Authentication";
import AddStudent from "./Scenes/AddStudent";
import StudentLister from "./Scenes/StudentLister";
import ModifyCategories from "./Scenes/ModifyCategories";

function App() {
  const [theme, colorMode] = useMode();
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("Dashboard");
  const [isSidebar, setIsSidebar] = useState(true);

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
          <Sidebar setActive={setActive} active={active} user={user} isSidebar={isSidebar}/>
          <main className="content">
            <ToastContainer position="top-center" theme="colored" autoClose={3000}/>
            <Topbar setIsSidebar={setIsSidebar}/>
            <Routes setUser={user}>
              <Route path="/" element={<Dashboard setActive={setActive} />}/>
              <Route path="/authentication" element={<Authentication setActive={setActive} user={user}/>}/>
              <Route path="/addstudent" element={<AddStudent setActive={setActive}/>}/>
              <Route path="/modifycategories" element={<ModifyCategories setActive={setActive}/>}/>
              <Route path="/studentlist" element={<StudentLister setActive={setActive}/>}/>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

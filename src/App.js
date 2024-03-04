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
import AddUser from "./Scenes/AddUser"
import { getDatabase, onValue, ref } from "firebase/database";

function App() {
  const [theme, colorMode] = useMode();
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("Dashboard");
  const [isSidebar, setIsSidebar] = useState(true);
  const db = getDatabase()
  const [allUsers, setAllUsers] = useState([]);
  const [access, setAccess] = useState('')

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        
        onValue(ref(db, "System Users/"), (snapshot) => {
          const users = [];
          snapshot.forEach((laman) => {
            laman.forEach((snap) => {
              users.push(snap.val());
            });
          });
          setAllUsers(users);
  
          const emailList = allUsers.map((laman) => laman.email);
          if (emailList.includes(auth.currentUser.email)) {
      
            const index = emailList.indexOf(auth.currentUser.email);
            setAccess(users[index].accessLevel);
          }
          setUser(authUser);
        });
      } else {
        setUser(null);
        setAccess("Unauthorized")
      }
    });
  },[db]);
  
  useEffect(() => {
    // Update access whenever allUsers changes
    auth.onAuthStateChanged((userNow) => {
      if(userNow){
        const emailList = allUsers.map((laman) => laman.email);
        if (emailList.includes(auth.currentUser.email)) {
          const index = emailList.indexOf(auth.currentUser.email);
          setAccess(allUsers[index].accessLevel);
        }
      }
      else{
        setUser(null)
      }
    })
  }, [allUsers]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <div className="app">
          <Sidebar setActive={setActive} active={active} user={user} isSidebar={isSidebar}/>
          <main className="content">
            <ToastContainer position="top-center" theme="colored" autoClose={3000}/>
            <Topbar setIsSidebar={setIsSidebar}/>
            <Routes>
              <Route path="/" element={<Dashboard setActive={setActive} access={access} />}/>
              <Route path="/authentication" element={<Authentication setActive={setActive} user={user} access={access}/>}/>
              <Route path="/addstudent" element={<AddStudent setActive={setActive} access={access}/>}/>
              <Route path="/modifycategories" element={<ModifyCategories setActive={setActive} access={access}/>}/>
              <Route path="/studentlist" element={<StudentLister setActive={setActive} access={access}/>}/>
              <Route path="/adduser" element={<AddUser setActive={setActive} access={access}/>}/> 
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

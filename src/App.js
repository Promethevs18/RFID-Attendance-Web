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
import Recall from "./Scenes/Recall";
import { getDatabase, onValue, ref } from "firebase/database";
import AddSched from "./Scenes/AddSched";
import { signInWithEmailAndPassword } from "firebase/auth";

function App() {
  const [theme, colorMode] = useMode();
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("Dashboard");
  const [isSidebar, setIsSidebar] = useState(true);
  const db = getDatabase()
  const [allUsers, setAllUsers] = useState([]);
  const [access, setAccess] = useState('')
  const [userName, setUserName] = useState('')

  //authentication checker
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
          if(auth.currentUser && auth.currentUser.email){
            if (emailList.includes(auth.currentUser.email)) {
              const index = emailList.indexOf(auth.currentUser.email);
              setAccess(users[index].accessLevel);
            }
            setUserName(authUser.displayName)
            setUser(authUser);
          }
          else{
            signInWithEmailAndPassword(auth, 'admin@attendance.system', 'admin123')
          }
        });
      } else {
        setUser(null);
        setAccess("Unauthorized")
        setUserName('')
      }
    });
  },[db]);

  //updating user status
  useEffect(() => {
    // Update access whenever allUsers changes
    auth.onAuthStateChanged((userNow) => {
      if(userNow){
        const emailList = allUsers.map((laman) => laman.email);
        if (emailList.includes(auth.currentUser.email)) {
          const index = emailList.indexOf(auth.currentUser.email);
          setAccess(allUsers[index].accessLevel);
        }
        setUserName(userNow.displayName)
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
          <Sidebar setActive={setActive} active={active} user={user} isSidebar={isSidebar} access={access} />
          <main className="content">
            <ToastContainer position="top-center" theme="colored" autoClose={3000}/>
            <Topbar setIsSidebar={setIsSidebar} userName={userName} access={access}/>
            <Routes>
              <Route path="/" element={<Dashboard setActive={setActive} access={access}  />}/>
              <Route path="/authentication" element={<Authentication setActive={setActive} user={user} access={access}/>}/>
              <Route path="/addstudent" element={<AddStudent setActive={setActive} access={access}/>}/>
              <Route path="/modifycategories" element={<ModifyCategories setActive={setActive} access={access} />}/>
              <Route path="/studentlist" element={<StudentLister setActive={setActive} access={access}/>}/>
              <Route path="/adduser" element={<AddUser setActive={setActive} access={access} />}/> 
              <Route path="/recall" element={<Recall access={access}/>}/>
              <Route path="/addschedule" element={<AddSched access={access}/>} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

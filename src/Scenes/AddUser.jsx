import { Box } from '@mui/system'
import React, {  useEffect, useState } from 'react'
import Header from '../Components/Header'
import { Form, Formik } from 'formik'
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material'
import * as yup from 'yup'
import { getDatabase, onValue, ref, remove, update } from 'firebase/database'
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword, deleteUser, getAuth, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid'
import { tokens } from '../theme'
import { useTheme } from '@emotion/react'
import DeleteIcon from '@mui/icons-material/Delete';


const AddUser = () => {

    const initialValues = {
        email: "",
        password: "",
        userName: "",
        userID: "",
    }
    const db = getDatabase();
    const auth = getAuth();


    // For radio buttons
    const [value, setValue] = useState([]);
    const buttonHandler = (event) => {
        setValue(event.target.value)
    }

    // change schema for the textboxes
    const userSchema = yup.object().shape({ 
        email: yup.string().required("This field is required"),
        password: yup.string().required("This field is required"),
        userName: yup.string().required("This field is required"),
        userID: yup.string().required("This field is required")
      })
    

    //   sign-in logic
    const signInToSystem = async (values) => {
      try {
         await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        ).then((user) => {
            // Update the newly created user's display name
            updateProfile(user.user, {
            displayName: values.userName,
          }).then(() => {
          // Update additional user information in the database
          update(ref(db, `System Users/${value}/${values.userID}`), {
            email: values.email,
            userName: values.userName,
            accessLevel: value,
            userID: values.userID,
            password: values.password
          }).then(() => {
            signInWithEmailAndPassword(auth, "admin@attendance.system", "admin123")
          }).catch((error) => {
            toast.error(`Error occured due to ` + error)
          });
          });
        });
    
        toast.success(
          "User is now added"
        );
      } catch (error) {
        toast.error(`Error signing in to system due to ${error}`);
      }
    };

    const burahin = (data) => {
      const result = window.confirm("Are you sure you want to revoke this user's access?")
      if(result){
        try{
          signInWithEmailAndPassword(auth, data.row.email, data.row.password).then(() => {
            deleteUser(auth.currentUser).then(() => {
            remove(ref(db, `System Users/${data.row.accessLevel}/${data.row.userID}`)).then(()=>{
                  signInWithEmailAndPassword(auth, 'admin@attendance.system', 'admin123')
              })
            })
          })
        }catch(error){
          toast.error(`Error occured due to: ${error}`)
        }
      }
    }

    //DataGrid codes
    const columns = [
      {field:"email", headerName: "User's Email", flex: 1},
      {field:"userName", headerName: "Username", flex: 1},
      {field:"accessLevel", headerName: "ICT", flex: 1},
      {field:"userID", headerName: "User ID", flex: 1},
      {field:"actions", type: 'actions', headerName:'Revoke Access', flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon/>}
          label='Delete'
          onClick={() => {
            burahin(params)
          }}
        />
    ]}
   
    ]
    const [rows, setRows] = useState([])
    const theme = useTheme()
    const colors = tokens(theme.palette.mode) 

    // get the list of users in the database
    useEffect(() => {
      const nakuha = []
      const getNow = () => {
        const useRef = ref(db, "System Users");
        onValue(useRef, (snapshot) => {
            snapshot.forEach((laman) => {
              laman.forEach((taken)=>{
                const users = {
                  id: taken.val().email,
                  ...taken.val()
                }
                nakuha.push(users)
              })
            })
        })
        setRows([...nakuha])
      }
      getNow()
    },[rows, db])

  return (
    <Box m="20px">
        <Header title="Add System User" subtitle="This section allows the administrator to add another system account. They can choose which access level to give to the user"/>
    
        <Box display="flex" justifyContent="space-evenly" m='10px'>
            <Box padding="20px" sx={{backgroundColor: "rgba(112,37,51, 0.3)", borderRadius:"20px"  }}>
              <Box>
                  <img src='https://firebasestorage.googleapis.com/v0/b/protoperp-attendance-monitor.appspot.com/o/8081%20(2).png?alt=media&token=398f3c20-a2b2-4025-b269-b5acf4f501d3' 
                  alt='perps-imahe'
                  style={{width:"500px"}}/>
                </Box> 
               <Box marginTop="20px">
               <Formik 
                initialValues={initialValues}
                validationSchema={userSchema}
                onSubmit={signInToSystem}
                >
                  {({values, errors, touched, handleChange, handleBlur}) =>(
                    <Form>
                      <Box>
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="User Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.userName}
                            name="userName"
                            error={!!touched.userName && !!errors.userName}
                            helperText={touched.userName && errors.userName}
                            sx={{ gridColumn: "span 2", marginTop:"20px", marginBottom: "20px" }}
                          />
                      </Box>
                      <Box display="flex" alignContent="center"
                      >
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Email address"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                            error={!!touched.email && !!errors.email}
                            helperText={touched.email && errors.email}
                            sx={{ gridColumn: "span 2" }}/>
                      </Box>

                      <Box>
                        <TextField
                            fullWidth
                            variant="filled"
                            type="password"
                            label="Password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name="password"
                            error={!!touched.password && !!errors.password}
                            helperText={touched.password && errors.password}
                            sx={{ gridColumn: "span 2", marginTop:"20px" }}
                          />
                      </Box>
              
                        {/* Radio Buttons */}
                      <Box marginTop="10px">
                        <FormControl>
                            <FormLabel>Level Handle</FormLabel>
                            <RadioGroup value={value} onChange={buttonHandler}>
                                <FormControlLabel value="ICT" control={<Radio/>} label="ICT"/>
                                <FormControlLabel value="STEM" control={<Radio/>} label="STEM"/>
                            </RadioGroup>
                        </FormControl>
                      </Box>
                      <Box>
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Teacher Card ID"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.userID}
                            name="userID"
                            error={!!touched.userID && !!errors.userID}
                            helperText={touched.userID && errors.userID}
                            sx={{ gridColumn: "span 2", marginTop:"20px" }}
                          />
                      </Box>
                      <Box display="flex" justifyContent="center" m="20px" sx={{display: "none"}}>
                        <Button type="submit" color="secondary" variant="contained" >
                          Sign in
                        </Button>
                      </Box>
                    </Form>
                  )}
           </Formik>
        </Box>    
            </Box>
            <Box display='flex' height='75vh' width='50%' m='20px'
             sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: colors.white[200],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.maroon[700],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.yellow[700],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.maroon[600],
              },
              "& .MuiButtonBase-root":{
                color: colors.white[200]
              }
            }}>
              <DataGrid
                columns={columns}
                rows={rows}
                slots={{toolbar: GridToolbar}}
                sx={{
                  '@media print':{
                    '.MuiDataGrid-main': { color: 'rgba(0, 0, 0, 0.87)' },
                  },
                }}
              />
            </Box>
       </Box>
       <Box>
       </Box>   
        
    </Box>
  )
}

export default AddUser
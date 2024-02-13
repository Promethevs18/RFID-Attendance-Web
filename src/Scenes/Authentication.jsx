import { Box, Button, TextField } from '@mui/material'
import React from 'react'
import { Form, Formik } from 'formik'
import * as yup from "yup"
import {getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, } from "firebase/auth"
import { toast } from 'react-toastify'
import {auth} from "../firebase"
import { useNavigate } from 'react-router-dom'


const Authentication = ({setUser, setActive}) => {

  const initialValues = {
    email: "",
    password: ""
  }

  const userSchema = yup.object().shape({ 
    email: yup.string().required("This field is required"),
    password: yup.string().required("This field is required")
  })

  const navi = useNavigate();

  const loginToSystem = async (values) => {
       const { user } = await signInWithEmailAndPassword(
        auth, values.email, values.password
      ).catch((error) => {
        toast.error(error.message)
      });
      toast.success("You have succesfully logged in");
      navi("/")
      setUser(user)
      setActive("Dashboard")
      
  }

  const nalimutan = (balyu) => {
      const newAuth = getAuth();
      sendPasswordResetEmail(newAuth, balyu)
      .then(() => {
        toast.success("Email sent")
      }).catch((error) =>{
        toast.error(error)
      })
  }

  return (
    <Box m="20px" justifyContent="center" alignItems="center" marginTop="170px">
     

       <Box display="flex" justifyContent="space-evenly">
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
                onSubmit={loginToSystem}
                >
                  {({values, errors, touched, handleChange, handleBlur}) =>(
                    <Form>
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
                          <Button color='primary' variant='secondary' sx={{marginTop: '20px'}} onClick={() => nalimutan(values.email)}>Forgot password?</Button>
                      </Box>
                      <Box display="flex" justifyContent="center" m="20px">
                        <Button type="submit" color="secondary" variant="contained">
                          Log in
                        </Button>
                      </Box>
                    </Form>
                  )}
           </Formik>
        </Box>    
            </Box>
       </Box>
       <Box>
       </Box>
       
    </Box>
  )
}

export default Authentication
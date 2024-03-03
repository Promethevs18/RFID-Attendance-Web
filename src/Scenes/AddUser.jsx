import { Box } from '@mui/system'
import React, { useState } from 'react'
import Header from '../Components/Header'
import { Form, Formik } from 'formik'
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material'
import * as yup from 'yup'
import { getDatabase, ref, update } from 'firebase/database'
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from 'firebase/auth'


const AddUser = () => {

    const initialValues = {
        email: "",
        password: ""
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
        password: yup.string().required("This field is required")
      })
    

    //   sign-in logic
    const signInToSystem = async (values) => {
        try{
            update(ref(db, `System Users/${value}/${value}`),{
                email: values.email,
                accessLevel: value
            }).then(() => {
               createUserWithEmailAndPassword(auth,values.email, values.password).then(() => {
                sendEmailVerification(auth.currentUser).then(() => {
                    toast.success("User is now added. Check email for verification before logging in")
                })
               })
            })
        }
        catch(error){
            console.log(`Error occured due to ${error.message}`)
        }
    }

  return (
    <Box m="20px">
        <Header title="Add System User" subtitle="This section allows the administrator to add another system account. They can choose which access level to give to the user"/>
    
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
                onSubmit={signInToSystem}
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
                      </Box>
                        {/* Radio Buttons */}
                      <Box marginTop="10px">
                        <FormControl>
                            <FormLabel>Subject Handle</FormLabel>
                            <RadioGroup value={value} onChange={buttonHandler}>
                                <FormControlLabel value="ICT" control={<Radio/>} label="ICT"/>
                                <FormControlLabel value="STEM" control={<Radio/>} label="STEM"/>
                            </RadioGroup>
                        </FormControl>
                    </Box>

                      <Box display="flex" justifyContent="center" m="20px">
                        <Button type="submit" color="secondary" variant="contained">
                          Sign in
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

export default AddUser
import { Box, Button, TextField } from '@mui/material'
import React from 'react'
import Header from '../Components/Header'
import { Form, Formik } from 'formik'
import * as yup from "yup"
import {signInWithEmailAndPassword} from "firebase/auth"
import { auth } from "../firebase"
import { toast } from 'react-toastify'
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

  return (
    <Box m="20px">
      <Header title="AUTHENTICATION PAGE" subtitle="Log in to the website using your default credentails to access functionalities"/>
      
      <Formik 
        initialValues={initialValues}
        validationSchema={userSchema}
        onSubmit={loginToSystem}
        >
          {({values, errors, touched, handleChange, handleBlur}) =>(
            <Form>
              <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))"
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
                    sx={{ gridColumn: "span 2" }}
                  />
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
  )
}

export default Authentication
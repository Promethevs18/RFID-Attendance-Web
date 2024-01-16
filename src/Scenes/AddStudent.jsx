import React, { useRef, useState } from "react";
import { Box, Avatar, Button, TextField } from "@mui/material";
import Header from "../Components/Header";
import * as yup from "yup";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";
import {getDatabase, ref as ref_database, update } from "firebase/database"
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@emotion/react";
import { tokens } from "../theme";



const AddStudent = () => {

    const initialValues = {
        student_name: "",
        id_num: "",
        grade_level: "",
        strand: "",
        address: "",
        caretaker_name: "",
        caretaker_num: ""
      };
    
      const formikRef = useRef(null);
      const database = getDatabase();

    

      const phoneRegExp =
  // eslint-disable-next-line
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

      const validation = yup.object().shape({
        student_name: yup.string().required("This field is required"),
        grade_level: yup.string().required("This field is required"),
        id_num: yup.string().required("This field is required"), 
        strand: yup.string().required("This field is required"),
        address: yup.string().required("This field is required"),
        caretaker_name: yup.string().required("This field is required"),
        caretaker_num: yup.string().matches(phoneRegExp, "Phone number is invalid").required("This field is required")
    });
    
    
    
      //this is to upload the information to firebase database
      const addStudent =  (values) => {
        if(values.student_name != null && values.id_num != null && values.grade_level != null 
            && values.strand != null && values.address != null && values.caretaker_name != null && values.caretaker_num != null){
          try{
            update(
                //This is for the per grade level
              ref_database(database, "Grade Level/" + values.grade_level + "/" + values.id_num),
              {...values,
              })   
              update( 
                    //This is for the strand 
                ref_database(database, "Strand/" + values.strand + "/" + values.id_num),
                    {...values,
                })
        
          } catch(mali){
            toast.error("Error uploading data due to: " , mali)
          }
        }
        toast.success("Student added successfully!");
      };

      //---------------------------------------------------------------------
      //DataGrid codes

      //DataGrid rows
        const [dataRows, setRows] = useState([
            { id: 1, name: 'John Doe', age: 25, city: 'New York' },
            { id: 2, name: 'Jane Doe', age: 30, city: 'San Francisco' },
        ]);

        //Datagrid table columns
        const dataColumns = [
            { field: 'id', headerName: 'Student name', flex: 1 },
        ];
        const tema = useTheme();
        const colors = tokens(tema.palette.mode)



  return (
    <Box m="20px">
            {/* HEADER */}
            <Header title="STUDENT SECTION CUSTOMIZATION" subtitle="This section allows you to perform CRUD (Create, Read, Update, Delete) student information to our database"/>
            <Box m="20px" display="flex" justifyContent="space-between">
              <Box display="flex">
                  <Formik 
                  innerRef={formikRef}
                  initialValues={initialValues}
                  validationSchema={validation}
                  onSubmit={addStudent}
                  >
                      {({values, errors, touched, handleBlur, handleChange}) => (
                        <Form>

                   
                     <Box justifyContent="start">
                        <Box display="flex" m="20px">
                                <TextField
                                    variant="filled"
                                    fullWidth
                                    type="text"
                                    value={values.student_name}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    label="Student Name"
                                    name="student_name"
                                    error={!!touched.student_name && !!errors.student_name}
                                    helperText={touched.student_name && 
                                        <span className="error-message">{errors.student_name}</span>}
                                    sx={{ maxWidth: "50%", marginRight: "2px" }}
                                />
                                <TextField
                                    variant="filled"
                                    fullWidth
                                    type="text"
                                    value={values.id_num}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    label = "ID Number"
                                    name="id_num"
                                    error={!!touched.id_num && !! errors.id_num}
                                    helperText={touched.id_num &&
                                    <span className="error-message">{errors.id_num}</span>}
                                    sx={{maxWidth: "50%", marginLeft: "15px"}}
                                />
                        </Box>
                        <Box display="flex" m="5px"> 
                                <TextField
                                    variant="filled"
                                        fullWidth
                                        type="text"
                                        value={values.grade_level}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label = "Grade Level (G11 or G12)"
                                        name="grade_level"
                                        error={!!touched.grade_level && !! errors.grade_level}
                                        helperText={touched.grade_level && 
                                            <span className="error-message">{errors.grade_level}</span>}
                                    sx={{maxWidth: "50%", marginLeft: "15px"}}
                                />              
                                <TextField
                                    variant="filled"
                                        fullWidth
                                        type="text"
                                        value={values.address}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label = "Physical Address"
                                        name="address"
                                        error={!!touched.address && !! errors.address}
                                        helperText={touched.address && 
                                            <span className="error-message">{errors.address}</span>}
                                    sx={{maxWidth: "50%", marginLeft: "10px"}}
                                /> 
                        </Box>
                        <Box display="flex" m="5px">
                                <TextField
                                    variant="filled"
                                    fullWidth
                                    type="text"
                                    value={values.caretaker_name}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    label = "Parent/Guardian Name"
                                    name="caretaker_name"
                                    error={!!touched.caretaker_name && !! errors.caretaker_name}
                                    helperText={touched.caretaker_name && 
                                        <span className="error-message">{errors.caretaker_name}</span>}
                                    sx={{maxWidth: "50%", marginLeft: "15px", marginTop:"10px"}}
                                />
                                <TextField
                                    variant="filled"
                                    fullWidth
                                    type="text"
                                    value={values.caretaker_num}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    label = "Caretaker's phone number"
                                    name="caretaker_num"
                                    error={!!touched.caretaker_num && !! errors.caretaker_num}
                                    helperText={touched.caretaker_num &&
                                        <span className="error-message">{errors.caretaker_num}</span>}
                                    sx={{maxWidth: "50%", marginLeft: "15px", marginTop: "10px"}}
                                />
                        </Box>
                        <Box m="5px" display="flex">
                                <TextField
                                    variant="filled"
                                    fullWidth
                                    type="text"
                                    value={values.strand}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    label = "Student's Strand"
                                    name="strand"
                                    error={!!touched.strand && !! errors.strand}
                                    helperText={<touched className="str"></touched> &&
                                        <span className="error-message">{errors.strand}</span>}
                                    sx={{ marginLeft: "15px", marginTop: "10px"}}
                                />      
                        </Box>
                        {/* Add Button */}
                        <Box display="flex" justifyContent="center" m="20px">
                            <Button
                            variant="contained"
                            color = "secondary"
                            type="submit"
                            >
                            Add Student to the Database
                            </Button>
                        </Box>
                 </Box>
                 </Form>
                      )}
                  </Formik>
              </Box>
              <Box  display="flex" 
                    justifyContent="center"
                    alignContent="center" 
                    height="75vh"
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
                 }}>
                  <DataGrid columns={dataColumns} rows={dataRows}/>
              </Box>             
            </Box> 
    </Box>
  )
}

export default AddStudent
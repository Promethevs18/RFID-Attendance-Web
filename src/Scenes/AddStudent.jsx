import React, { useRef } from "react";
import { Box, Avatar, Button, TextField } from "@mui/material";
import Header from "../Components/Header";
import * as yup from "yup";
import { Form, Formik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import {ref as ref_storage, getDownloadURL, uploadBytesResumable, getStorage} from "firebase/storage"
import {getDatabase, ref as ref_database, update } from "firebase/database"



const AddStudent = () => {

    const initialValues = {
        student_name: "",
        id_num: "",
        grade_level: "",
        student_img: "",
        strand: "",
        address: "",
        caretaker_name: "",
        caretaker_num: ""
      };
    
      const formikRef = useRef(null);
      const [image, setImage] = useState("https://www.pngall.com/wp-content/uploads/2/Upload-Transparent.png");
      const database = getDatabase();
      const storage = getStorage();
    
    

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
                student_img: image,
              })   
              update( 
                    //This is for the strand 
                ref_database(database, "Strand/" + values.strand + "/" + values.id_num),
                    {...values,
                        student_img: image,
                })
        
          } catch(mali){
            toast.error("Error uploading data due to: " , mali)
          }
        }
        toast.success("Student added successfully!");
      };


    const uploadImage = (nakuha) => {
        toast.info("File uploading...");
        const uploadFile =() =>{
          const storageRef = ref_storage(storage, "Student Images/" + nakuha.name);
          const uploadTask = uploadBytesResumable(storageRef, nakuha);
          uploadTask.on("state_changed", (snapshot)=>{
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            toast.info("Upload is " + progress + " % done")
          }, (error) =>{
            toast.error(error)
          }, () =>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) =>{
              toast.success("Image uploaded to the database successfully!");
              setImage(downloadUrl)
            })
          })
        }
        nakuha && uploadFile()
      }
    

  return (
    <Box m="20px">
            {/* HEADER */}
            <Header title="ADD STUDENT" subtitle="This section allows you to add student information to our database"/>

            <Formik 
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validation}
                onSubmit={addStudent}
            >
                {({values, errors, touched, handleBlur, handleChange}) => (
                    <Form>
                        <Box display="flex" justifyContent="center" m="20px">
                               <input
                                type="file"
                                style={{display: "none"}}
                                id="imageUpload"
                                accept="image/*"
                                onChange={(e) => uploadImage(e.target.files[0])}
                                />
                            <Avatar
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    height: "30%",
                                    width: "30%",
                                }}
                                alt = "service-image"
                                src = {image}
                                onClick={() => {
                                document.getElementById("imageUpload").click();
                                }}
                                />
                       
                      </Box>
                            <Box display="flex" justifyContent="start" m="20px">
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
                                    sx={{ maxWidth: "40%", marginRight: "15px" }}
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
                                sx={{maxWidth: "40%", marginLeft: "15px"}}
                            />
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
                                sx={{maxWidth: "20%", marginLeft: "15px"}}
                            />
                  </Box>
                        <Box display="flex" justifyContent="center" m="20px">               
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
                                sx={{maxWidth: "33%", marginLeft: "15px"}}
                            />
                             
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
                                sx={{maxWidth: "33%", marginLeft: "15px"}}
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
                                sx={{maxWidth: "33%", marginLeft: "15px"}}
                            />
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
                                sx={{maxWidth: "33%", marginLeft: "15px"}}
                            />
                            
                        </Box>
                        <Box display="flex" justifyContent="center" m="20px">
                            <Button
                            variant="contained"
                            color = "secondary"
                            onClick={() => addStudent(values)}
                            >
                            Add Student to the Database
                            </Button>
                        </Box>
                    </Form>
                        )}

            </Formik>
        
    </Box>
  )
}

export default AddStudent
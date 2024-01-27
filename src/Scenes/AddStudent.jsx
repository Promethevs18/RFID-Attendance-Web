import React, { useEffect, useRef, useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Header from "../Components/Header";
import * as yup from "yup";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";
import {
  child,
  get,
  getDatabase,
  onValue,
  ref,
  ref as ref_database,
  update,
} from "firebase/database";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@emotion/react";
import { tokens } from "../theme";


const AddStudent = () => {
  //global properties
  const database = getDatabase();
  const [napilingLevel, setNapilingLevel] = useState("");
  const [mgaLevel, setMgaLevel] = useState([])
  
  const [napilingBranch, setNapilingBranch] = useState("")
  const [mgaBranch, setBranch] = useState([])

  const [hideAdd, setHideAdd] = useState(true)


  //Adding student code section
  const initialValues = {
    student_name: "",
    id_num: "",
    grade_level: "",
    strand: "",
    address: "",
    caretaker_name: "",
    caretaker_num: "",
  };

  const formikRef = useRef(null);
 
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
    caretaker_num: yup
      .string()
      .matches(phoneRegExp, "Phone number is invalid")
      .required("This field is required"),
  });

  //this is to upload the information to firebase database
  const addStudent = (values) => {
    if (
      values.student_name != null &&
      values.id_num != null &&
      values.address != null &&
      values.caretaker_name != null &&
      values.caretaker_num != null
    ) {
      try {
        update(
          //This is for the per grade level
          ref_database(database, "Grade Level/" + napilingLevel + "/" + values.id_num),
          { ...values, status: "enrolled", grade_level: napilingLevel, strand: napilingBranch }
           
        );
        update(
          //This is for the strand
          ref_database(database, "Strand/" + napilingBranch + "/" + values.id_num),
          { ...values , status: "enrolled", grade_level: napilingLevel, strand: napilingBranch }
        );
          //This is for the grand list
        update(
          ref_database(database, "Grand List/" + values.id_num),
          {...values, status: "enrolled", grade_level: napilingLevel, strand: napilingBranch }
        )
      } catch (mali) {
        toast.error("Error uploading data due to: ", mali);
      }
    }
    toast.success("Student added successfully!");
    setTimeout(() => {
      window.location.reload()
    }, 3000)
  };

  // END of add student codes
  //---------------------------------------------------------------------

  //DataGrid codes

  //DataGrid rows
  const [dataRows, setRows] = useState([]);

  //get the data from the Grade Level
  useEffect(() => {
    const kuhanin = () => {
      const listahan = [];
      const getList = ref(database, "Grand List/");
      onValue(
        getList,
        (snapshot) => {
          const nakuha = snapshot.val();
          Object.keys(nakuha).forEach((val) => {
            const kuhain = {
              id: val,
              ...nakuha[val],
            };
            listahan.push(kuhain);
          });
          setRows([...listahan]);
        }
      );
    };
    kuhanin();
  }, [database]);

  //Datagrid table columns and codes

  const [selectionModel, setSelectionModel] = useState([]);
  const [fieldFalse, setFieldFalse] = useState(false)

  //THIS CODE IS RESPONSIBLE TO GET THE DATA BASED SA SELECTION SA TALBE
  //UPON GETTING THE DATA, IT WILL ASSIGN THE NECESSARIES SA LOOB NG TEXTFIELDS FOR EDITING
  const checkSelected = (newSelected) => {
    setSelectionModel(newSelected)
    setShowButton(true)
    setHideAdd(false)

    const takeUser = ref(database);
    get(child(takeUser, `Grand List/${selectionModel}`))
    .then((snapshot) => {
        const updatedIni = {
          student_name: snapshot.val().student_name || "",
          id_num: snapshot.val().id_num || "",
          grade_level: snapshot.val().grade_level || "",
          address: snapshot.val().address || "",
          caretaker_name: snapshot.val().caretaker_name|| "",
          caretaker_num: snapshot.val().caretaker_num|| "",
          strand: snapshot.val().strand || ""
        }
        formikRef.current.setFieldValue("student_name", updatedIni.student_name);
        formikRef.current.setFieldValue("id_num", updatedIni.id_num);
        formikRef.current.setFieldValue("address", updatedIni.address);        
        formikRef.current.setFieldValue("caretaker_name", updatedIni.caretaker_name);        
        formikRef.current.setFieldValue("caretaker_num", updatedIni.caretaker_num);
        
        setNapilingLevel(updatedIni.grade_level)
        setNapilingBranch(updatedIni.strand)
            
    })
    setFieldFalse(true)
  }
  //END OF DATA EDITING CODES


  const dataColumns = [
    { field: "id_num", headerName: "Student ID", flex: 1},
    { field: "student_name", headerName: "Student Name", flex: 1},
    { field: "address", headerName: "Student Address", flex: 1},
    { field: "grade_level", headerName: "Grade Level", flex: 1},
    { field: "strand", headerName: "Strand/Track", flex: 1},
    { field: "caretaker_name", headerName: "Caretaker Name", flex: 1},
    {
      field: "caretaker_num",
      headerName: "Caretaker Number",
      flex: 1,
      editable: true,
    },
   
  ];

  const tema = useTheme();
  const colors = tokens(tema.palette.mode);

  const [showButton, setShowButton] = useState(false);

  const updateData = (values) => {
    if (
      values.address != null &&
      values.caretaker_name != null &&
      values.caretaker_num != null
    ) {
      try {
        update(
          //This is for the per grade level
          ref_database(database, "Grade Level/" + values.grade_level + "/" + values.id_num),
          { ...values, status: "updated" }
           
        );
        update(
          //This is for the strand
          ref_database(database, "Strand/" + values.strand + "/" + values.id_num),
          { ...values , status: "updated"}
        );
          //This is for the grand list
        update(
          ref_database(database, "Grand List/" + values.id_num),
          {...values, status: "updated"}
        )
      } catch (mali) {
        toast.error("Error uploading data due to: ", mali);
      }
      toast.success("Student updated successfully!");
      setFieldFalse(false)
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    }
    else {
      toast.error("An error occured during the update. Contact your developer")
    }
    
  }
  //End of DataGrid codes

  //START OF SELECT UI FUNCTIONALITIES (YUNG DROPDOWNS)

  //FIRST, FOR GRADE LEVEL

  useEffect(() => {
    const levelArray = []
    const kunin = () => {
      const levelData = ref(database, "Grade Level/");
      onValue(levelData, (snapshot) => {
        snapshot.forEach((snappy) => {
          const kuninLevel = {
            id: snappy.key
          }
          levelArray.push(kuninLevel)
          setMgaLevel(levelArray)
        })
      })
    }
    kunin();
  })

  const changeHandler = (nyare) => {
    setNapilingLevel(nyare.target.value)
  }

  //FOR THE STUDENT STRAND

  useEffect(() => {
    const branches = []
    const getNow = () => {
    const kuninBranches = ref(database, "Strand/")
    onValue(kuninBranches, (snapshot) => {
      snapshot.forEach((value) => {
        const taken = {
          id: value.key
        }
        branches.push(taken)
      })
      setBranch(branches)
    })
  }
  getNow();
  })

  const handleChanger = (nyare) => {
    setNapilingBranch(nyare.target.value)
  }


  //UI part
  return (
    <Box m="20px">
      {/* HEADER */}
      <Header
        title="STUDENT SECTION CUSTOMIZATION"
        subtitle="This section allows you to perform CRUD (Create, Read, Update, Delete) student information to our database"
      />
      <Box m="20px" display="flex" justifyContent="space-between">
        <Box display="flex">
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={validation}
          >
            {({ values, errors, touched, handleBlur, handleChange }) => (
              <Form>
                <Box justifyContent="start">
                  <Box display="flex" m="20px">  
                    <TextField
                      disabled={fieldFalse}
                      variant="filled"
                      fullWidth
                      type="text"
                      value={values.student_name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Student Name"
                      name="student_name"
                      error={!!touched.student_name && !!errors.student_name}
                      helperText={
                        touched.student_name && (
                          <span className="error-message">
                            {errors.student_name}
                          </span>
                        )
                      }
                      sx={{ maxWidth: "50%", marginRight: "2px" }}
                    />
                   <FormControl sx={{width: "70%", marginLeft:"20px"}}>
                    <InputLabel id="gradeId">Select a Strand/Track</InputLabel>
                      <Select
                      labelId="gradeId"              
                      label="Select a Grade Level"
                      onChange={handleChanger}
                      value={napilingBranch}
                      >
                        {mgaBranch.map((option) => (
                          <MenuItem 
                          key={option.id} value={option.id}>
                            {option.id}
                          </MenuItem>
                        ))}
                        
                      </Select>
                    </FormControl>
                  </Box>
                  <Box display="flex" m="5px">
                    <TextField
                      variant="filled"
                      fullWidth
                      type="text"
                      value={values.address}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Physical Address"
                      name="address"
                      error={!!touched.address && !!errors.address}
                      helperText={
                        touched.address && (
                          <span className="error-message">
                            {errors.address}
                          </span>
                        )
                      }
                      sx={{ maxWidth: "50%", marginLeft: "15px" }}
                    />
                    <FormControl sx={{width: "50%", marginLeft:"20px"}}>
                    <InputLabel id="gradeId">Select a Grade Level</InputLabel>
                      <Select
                      labelId="gradeId"              
                      label="Select a Grade Level"
                      onChange={changeHandler}
                      value={napilingLevel}
                      >
                        {mgaLevel.map((option) => (
                          <MenuItem 
                          key={option.id} value={option.id}>
                            {option.id}
                          </MenuItem>
                        ))}
                        
                      </Select>
                    </FormControl>
                  </Box>
                  <Box display="flex" m="5px">
                    <TextField
                      variant="filled"
                      fullWidth
                      type="text"
                      value={values.caretaker_name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Parent/Guardian Name"
                      name="caretaker_name"
                      error={!!touched.caretaker_name && !!errors.caretaker_name}
                      helperText={
                        touched.caretaker_name && (
                          <span className="error-message">
                            {errors.caretaker_name}
                          </span>
                        )
                      }
                      sx={{ maxWidth: "50%", marginLeft: "15px", marginTop: "10px" }}
                    />
                    <TextField
                      variant="filled"
                      fullWidth
                      type="text"
                      value={values.caretaker_num}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Caretaker's phone number"
                      name="caretaker_num"
                      error={!!touched.caretaker_num && !!errors.caretaker_num}
                      helperText={
                        touched.caretaker_num && (
                          <
                          span className="error-message">
                          {errors.caretaker_num}
                        </span>
                      )
                    }
                    sx={{ maxWidth: "50%", marginLeft: "15px", marginTop: "10px" }}
                  />
                </Box>
                <Box m="5px" display="flex">
                  <TextField
                      variant="filled"
                      disabled={fieldFalse}
                      fullWidth
                      type="text"
                      value={values.id_num}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="ID Number"
                      name="id_num"
                      error={!!touched.id_num && !!errors.id_num}
                      helperText={
                        touched.id_num && (
                          <span className="error-message">{errors.id_num}</span>
                        )
                      }
                    sx={{ marginLeft: "15px", marginTop: "10px" }}
                  />
                </Box> 
                {hideAdd &&( 
                  <Button 
                  variant="contained" 
                  color="secondary" 
                  sx={{m:"20px"}}
                  onClick={() => addStudent(values)}
                  >Add Now Information</Button>   
                  )}
         
                {showButton && (
                 <Button 
                  variant="contained" 
                  color="secondary" 
                  sx={{m:"20px"}}
                  onClick={() => updateData(values)}
                  >Update Information</Button>   
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignContent="center"
        height="65vh"
        width="68%"
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
        }}
      >
        <DataGrid
          columns={dataColumns}
          rows={dataRows}
          editMode="row"
          slots={
            {
            toolbar: GridToolbar,
           
          }}
          onRowSelectionModelChange={(newSelection) => {
            checkSelected(newSelection)
          }}
          rowSelectionModel={selectionModel}
        />
      </Box>
    </Box>
  </Box>
);
};

export default AddStudent;

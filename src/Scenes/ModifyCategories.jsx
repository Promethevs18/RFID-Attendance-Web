import { Box } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'
import Header from '../Components/Header'
import { DataGrid } from '@mui/x-data-grid'
import { Button, TextField, Typography } from '@mui/material'
import { getDatabase, onValue, ref } from 'firebase/database'
import { Form, Formik } from 'formik'
import * as yup from "yup";
import { toast } from 'react-toastify'
import { useTheme } from '@emotion/react'
import { tokens } from '../theme'

const ModifyCategories = () => {

  //Arrays and other iterations
  const db = getDatabase();

  const [checkedLevel, setCheckedLevel] = useState([]);
  const [levelArray, setLevelArray] = useState([]);
  const [levelList, setLevel] = useState([]);

  //initialize respective arrays and elements
  const[checkedOption, setCheckedOption] = useState([]);
  const[optionArray, setOptionArray] = useState([])
  const[optionList, setOptionList] = useState([])
  const [fetchData, setFetchData] = useState(false);

  //START OF YEAR LEVEL CODES
   //useEffect to get the data from Firebase
   useEffect(() =>{
    const fetchLevels = () =>{
    const levels = []
    const levelDB = ref(db, "Grade Level/");
    onValue(
      levelDB,
      (snapshot) => {
        snapshot.forEach((snappy) =>{
          const snapLevel = snappy.key;
          const takenLevel = {
            id: snapLevel
          }
          levels.push(takenLevel)
          setLevel(levels)
        })
      }
    )

  }
  fetchLevels()
  },[db])

    //UseEffect para i update agad ang array sa current 
  useEffect(()=>{
    if (checkedLevel.length > 0) {
      const selectedLevels = checkedLevel.map((id) => levelList.find((row) => row.id === id)?.id);
      setLevelArray(selectedLevels);
    } else {
      console.error('No selected grade levels');
    }

  }, [checkedLevel, levelList, levelArray,db])

  //change handler for the selection ng level muna
  const chosenLevel = (napili) => {
    setCheckedLevel(napili)
    setOptionArray([])
    setFetchData(true); 
  }
// for the columns of the first datagrid
const gradeColumns = [
  {field: "id", headerName: "Grade Level", flex: 1}
]
// END OF YEAR LEVEL CODES

// --------------------------------------------------------------------

// START OF STRANDS/TRACKS
//Useeffect to get all the tracks from the database
useEffect(() =>{
  const fetchOptions = () =>{
    const options = []
    const optionsDB = ref(db, "Strand/");
    onValue(
      optionsDB,
      (snapshot) =>{
        snapshot.forEach((snappy) =>{
          const takenOptions = {
            id: snappy.key
          }
          options.push(takenOptions)
          setOptionList(options)
        })
      }
    )
  }
  fetchOptions();
}, [db])

   //UseEffect para i update agad ang array sa current 
  useEffect(()=>{
    if(checkedOption.length > 0){
      const selectedOptions = checkedOption.map((id) => optionList.find((row) => row.id === id)?.id);
      setOptionArray(selectedOptions);
    }else {
    console.error('No selected grade levels');
  }
  }, [optionArray, checkedOption, optionList])

//change hanlder para pag pinili ng admin ang section
const handleOptionChange = (napili) => {
  setCheckedOption(napili)
  setLevelArray([])
  setFetchData(true); 
}

//column definition para sa ating table
const optionColumn = [
  {field: "id", headerName: "Tracks/Strands Listed", flex:1}
]
// END OF TRACK/STRAND OPTIONS CODE

//--------------------------------------------------------------

//START OF INPUT RELATED UI CODES
  // eto ang para sa gradeLevel
const levelInitial = {gradeLevel: ""}
const formikRef = useRef(null);

const levelValidation = yup.object().shape({
  gradeLevel: yup.string().required("This field is required"),
});


const addLevel = (k) => {
  toast.info(k.gradeLevel)
};


// ------------------------------------------------------------------------------
// Eto naman ang para sa table of all codes

const tema = useTheme();
const colors = tokens(tema.palette.mode)

const [dataRows, setDataRows] = useState([])


useEffect(() => {
  const fetchAll = () => {
    const dataTaken = [];
    let locRef;

    if (levelArray.length !== 0) {
      locRef = ref(db, "Grade Level/" + levelArray[0]);
    } else if (optionArray.length !== 0) {
      locRef = ref(db, "Strand/" + optionArray[0]);
    } else {
      // Handle other cases or return if no condition is met
      return;
    }

    onValue(
      locRef,
      (snapshot) => {
        snapshot.forEach((takenNames) => {
          const takenData = takenNames.val();
          const names = {
            id: takenNames.key,
            ...takenData,
          };
          dataTaken.push(names);
        });
        setDataRows(dataTaken);
        console.log(dataTaken);
      },
      (error) => {
        toast.error("Something went wrong. Reload the page or try later: " + error);
      }
    );
  };

  if (fetchData) {
    fetchAll();
    setFetchData(false); // Reset fetchData to avoid continuous fetching
  }

}, [db, levelArray, optionArray, fetchData]); // Add fetchData to the dependency array


const dataColumns = [
  { field: "student_name", headerName: "Student's Name", flex: 1 },
  { field: "strand", headerName: "Strand", flex: 1 },
  { field: "id_num", headerName: "ID Number", flex: 1 },
  { field: "grade_level", headerName: "Grade Level", flex: 1 },
  { field: "caretaker_name", headerName: "Caretaker's Name", flex: 1 },
  { field: "caretaker_num", headerName: "Caretaker's Phone Number", flex: 1 },
];

// End of table of all codes
  //UI part
  return (
    <Box m="20px">
        <Header title="Category Manifesto" subtitle="This section allows you to modify your schools academic strands and tracks"/>

        <Box m="20px" display="flex" flexDirection="row" justifyContent="space-around">
                    {/* For the school level section */}
          <Box display="flex" flexDirection="row" justifyContent="center">
               <Box>
                <Typography
                    variant="h3"
                    color="white"
                    marginTop="10px"
                    fontWeight="bold"
                    fontSize="40px"
                    >
                      School Grade Level 
                    </Typography>
                    <Box padding="20px">
                        <DataGrid
                        rows={levelList}
                        columns={gradeColumns}
                        onRowSelectionModelChange={chosenLevel}
                        />
                        
                    </Box>
               </Box>
               {/* For the school level input and buttons */}
            <Box marginTop="70px">
                <Formik
                  ref={formikRef}
                  initialValues={levelInitial}
                  validationSchema={levelValidation}
                  onSubmit={addLevel}
                  >
                    {({values, errors, touched, handleBlur, handleChange}) => (
                      <Form>
                        <Box display="flex">
                          <TextField
                            variant='filled'
                            fullWidth
                            type='text'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Grade Level to add"
                            name="gradeLevel"
                            error={!!touched.gradeLevel && !!errors.gradeLevel}
                            helperText={touched.gradeLevel && errors.gradeLevel}                            
                            />
                        </Box>
                        <Button 
                          sx={{m:"10px"}}
                          variant='outlined'
                          color="secondary"
                          type='submit'
                          >
                            Add grade level to system
                          </Button>
                      </Form>
                    )}
                  </Formik>
            </Box>
          </Box>
                    {/* For the track/strand section */}
          <Box display="flex" flexDirection="row" justifyContent="center">
             <Box marginTop="70px">
                 Hwllo
             </Box> 
                  <Box>
                      <Typography
                            variant="h3"
                            color="white"
                            marginTop="10px"
                            fontWeight="bold"
                            fontSize="40px"
                            >
                            Academic Strands/Tracks
                      </Typography>
                      <Box padding="20px">
                              <DataGrid
                              rows={optionList}
                              columns={optionColumn}
                              onRowSelectionModelChange={handleOptionChange}
                              />
                      </Box>
                  </Box>
          </Box>
          </Box>

        <Box 
          display="flex" 
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
          }}
          >
            <DataGrid rows={dataRows} columns={dataColumns}/>
        </Box>  
     </Box>
  )
}

export default ModifyCategories
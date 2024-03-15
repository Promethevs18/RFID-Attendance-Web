import { Box } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'
import Header from '../Components/Header'
import { useTheme } from '@emotion/react'
import { tokens } from '../theme'
import { DataGrid } from '@mui/x-data-grid'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import { FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material'
import { equalTo, getDatabase, onValue, orderByChild, orderByKey, query, ref } from 'firebase/database'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'


const AddSched = () => {

  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const db = getDatabase();

  //Start of Datagrid Codes
    //for the columns
    const columns = [
      {field: "strand", headerName: "Strand", flex: 1}
    ]

    //for the rows where the data is taken from Firebase
    const [schedules, setSchedule] = useState([]);
  //End of Datagrid codes


//Start of Form codes
    const formikRef = useRef(null)
    const initialValues = {
      subject: ""
    }
    const validate = yup.object().shape({
      subject: yup.string().required("This field is required")
    })


      //for the Dropdowns
        const [strands, setStrands] = useState([])
        const [selectedStrand, setSelStrand] = useState("");
        const [teachers, setTeachers] = useState([])
        const [selectedTeacher, setSelectedTeacher] = useState("")

        //getting the strands from the database
        useEffect(() => {
          const strandsArray = []
          const getStrands = () => {
            const dataNode = ref(db, "Strand/");
            onValue(dataNode, (snapshot) => {
              snapshot.forEach((snappy) => {
                const getLevel = {
                  id: snappy.key
                }
                strandsArray.push(getLevel)
                setStrands(strandsArray)
              })
            })
          }
          getStrands();
          
          if(selectedStrand !== ""){
            getTeacher(selectedStrand)
          }
        }, [db, selectedStrand])

        //getting the teacher's name from the database 
        const getTeacher = (pinili) => { 
            const list = [];

            const getData = ref(db, `System Users/${pinili}`);
            const filtered = query(getData, orderByChild("accessLevel"), equalTo(pinili));
            onValue(
              filtered,
              (snapshot) => {
                 snapshot.forEach((value) => {
                    const nakuha = value.val();
                    list.push(nakuha.userName)
                 })
              }
            )
            setTeachers([ ...list]);
        }

        //change handler for the strand drop down
          const strandChange = (change) => {
             setSelStrand(change.target.value)
        
          }

          const teacherChange = (bago) => {
           setSelectedTeacher(bago.target.value)
         
          }
      
          console.log(selectedTeacher)
        
      //For the time picker
      const [startOras, setStartOras] = useState(dayjs(new Date()))
      const [endOras, setEndOras] = useState(dayjs(new Date()))


  //End of Form Codes

  return (
    <Box m="20px">
        <Header title="Class Schedule Manifesto" subtitle="This is the area where the administrator can edit the content of the class schedule"/>

        <Box m='20px' display='flex' justifyContent='space-around'>
          
          <Box display='flex' justifyContent='space-between'>
            <Formik
              innerRef={formikRef}
              initialValues={initialValues}
              validationSchema={validate}
              >
                {({values, errors, touched, handleBlur, handleChange}) => (
                  <Form>
                      {/* For the First Line of UI */}
                      <Box justifyContent='center' display='flex' >
                        <TextField
                          variant='filled'
                          fullWidth
                          value = {values.subject}
                          type = 'text'
                          label = 'Subject'
                          onChange = {handleChange}
                          onBlur = {handleBlur}
                          name = 'subject'
                          error = {!!touched.subject && !! errors.subject}
                          helperText = {touched.subject && errors.subject}
                        />

                        <FormControl sx={{width: "300px", marginLeft: "20px", marginRight: '20px'}}>
                          <InputLabel id = 'levelLabel'>Select a Strand/Track</InputLabel>
                            <Select
                              labelId='levelLabel'
                              label='Select a Strand/Track'
                              onChange={strandChange}
                              value={selectedStrand}
                            > 
                              {strands.map((laman) => (
                                <MenuItem key={laman.id} value={laman.id}>
                                  {laman.id}
                                </MenuItem>
                              ))}
                            </Select>
                        </FormControl>
                      </Box>

                      <Box justifyContent='space-evenly' display='flex' marginTop='20px'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>

                          <TimePicker 
                          label='Choose a time' 
                          value={startOras} 
                          onChange={(newValue) => setStartOras(newValue.format('hh:mm'))}
                          sx={{marginRight: "20px"}}/>

                          <TimePicker 
                          label='Choose a time' 
                          value={endOras} 
                          onChange={(newValue) => setEndOras(newValue.format('hh:mm'))}
                          sx={{marginRight: "20px"}}/>

                        </LocalizationProvider>
                      </Box>
                      
                      <Box display="flex" justifyContent="center" m="20px">
                      <FormControl sx={{width: "300px", marginLeft: "20px", marginRight: '20px'}}>
                          <InputLabel id = 'teacherLabel'>Select a Teacher To Assign</InputLabel>
                            <Select
                              labelId='teacherLabel'
                              label='Select a Teacher To Assign'
                              onChange={teacherChange}
                              value={selectedTeacher}
                            > 
                              {teachers.map((value, index) => (
                                <MenuItem key={index} value={value}>
                                  {value}
                                </MenuItem>
                              ))}
                            </Select>
                        </FormControl>
                      </Box>
                      
                </Form>
                )}
            </Formik>

          </Box>

          <Box 
            display="flex"
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
              columns={columns}
              rows={schedules}
              />
          
          </Box>
    
        </Box>
    
    </Box>

   
  )
}

export default AddSched
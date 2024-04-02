import { Box } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'
import Header from '../Components/Header'
import { useTheme } from '@emotion/react'
import { tokens } from '../theme'
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import { FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material'
import { equalTo, getDatabase, onValue, orderByChild, query, ref, remove, update } from 'firebase/database'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import DeleteIcon from '@mui/icons-material/Delete';


const AddSched = () => {

  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const db = getDatabase();

  //Start of Datagrid Codes
   

    //for the rows where the data is taken from Firebase
    const [schedules, setSchedule] = useState([]);
    //for the row where the user selects
    const [selectedSub, setSelectedSub] = useState('')

    //for getting the data from the database
    useEffect(() => {
      const getSubjects = () => {
        const subjects = []
        const subRef = ref(db, "Subject Schedules/");
        onValue(subRef, (snapshot) => {
          const subData = snapshot.val();
            Object.keys(subData).forEach((laman) => {
              const subs = {
                id: laman,
                ...subData[laman]
              }
              subjects.push(subs)
            });
        });
        setSchedule([...subjects])
      }
      getSubjects();
    })

    //for the selection chang
    const rowChange = (data) => {
      setSelectedSub(data)
    }

    //for the deletion
    const burahin = (laman) => {
     remove(ref(db,`Subject Schedules/${laman}`)).then(() =>{
      toast.success("Subject is deleted from the database")
     }).catch((error) => {
        toast.error(`An error occured due to: ${error}`)
     })
    }

     //for the columns
     const columns = [
      {field: "subject", headerName: "Subject", flex: 1},
      {field: "strandAssigned", headerName: "Strand", flex: 1},
      {field: "teacherAssigned", headerName: "Teacher Assigned", flex: 1},
      {field: "timeStart", headerName: "Period Start", flex: 1},
      {field: "endTime", headerName: "Period End", flex: 1},
      {field: "actions", type: 'actions', headerName: "Action", flex: 1, getActions: (params) => [
        <GridActionsCellItem 
          icon={<DeleteIcon/>}
          label='Delete'
          onClick={() => {
            burahin(params.id)
          }}
          />
     ]}
    ]

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

          //change handler for the teacher drop down
          const teacherChange = (bago) => {
           setSelectedTeacher(bago.target.value)
         
          }
        
      //For the time picker
      const [startOras, setStartOras] = useState(dayjs(new Date()))
      const [endOras, setEndOras] = useState(dayjs(new Date()))

  //End of Form Codes


  //Form Submission Code
  const uploadData = async (values) => {
    try{
      await update(ref(db, `Subject Schedules/${values.subject}`),
      {
        ...values,
        timeStart: startOras,
        endTime: endOras,
        strandAssigned: selectedStrand,
        teacherAssigned: selectedTeacher

      }
      );
      toast.success("Data uploaded successfully")
    }
    catch (error){
      toast.error(`Error occured due to ${error}`)
    }
  }


  return (
    <Box m="20px">
        <Header title="Class Schedule Manifesto" subtitle="This is the area where the administrator can edit the content of the class schedule"/>

        <Box m='20px' display='flex' justifyContent='space-around'>
          
          <Box display='flex' justifyContent='space-between'>
            <Formik
              innerRef={formikRef}
              initialValues={initialValues}
              validationSchema={validate}
              onSubmit={uploadData}
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

                      <Box display="flex" justifyContent="center">
                        <Button variant='contained' onClick={() => uploadData(values)}>
                          Upload
                        </Button>
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
              slots={{toolbar: GridToolbar}}
              rowSelectionModel={selectedSub}
              onRowSelectionModelChange={(value) => {
                rowChange(value)
              }}
              />
          </Box>
          <Box>
    
          </Box>
    
        </Box>
    </Box>

   
  )
}

export default AddSched
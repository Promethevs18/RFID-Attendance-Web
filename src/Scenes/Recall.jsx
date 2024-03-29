import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import {  DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { tokens } from '../theme'
import { useTheme } from '@emotion/react'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { equalTo, getDatabase, onValue, orderByChild, query, ref } from 'firebase/database'

const Recall = ({access}) => {

    //for the colors
    const colors = tokens(useTheme().palette.mode) 
    //for the database reference
    const db = getDatabase(); 

    //For the datePicker
    const [chosenDate, setChosenDate] = useState('')

     //for the DataGrid
     const [allAttendance, setAllAttendance] = useState([])
     const attendanceColumn = [
         {field: "id_num", headerName: "ID Number", flex: 1},
         {field: "student_name", headerName: "Student Name", flex: 1},
         {field: "grade_level", headerName: "Grade Level", flex: 1},
         {field: "strand", headerName: "Strand", flex: 1},
         {field: "timeIn", headerName: "Timed In", flex: 1},
         {field: "timeOut", headerName: "Timed Out", flex: 1},
     ]

     useEffect(() => {
      const getChosen = () => {
        const list = [];

        const getList = ref(db, `Grand Attendance/${chosenDate}/${chosenLevel}`);
        const filtered = query(getList, orderByChild('strand'), equalTo(chosenStrand));

        onValue(filtered, (snappy) => {
             snappy.forEach((laman) => {
               const arrange = {
                 id: laman.key,
                 ...laman.val()
               }
               list.push(arrange)
             })
         
        })
        setAllAttendance(list)
    }
    getChosen();
    })


    //for the GradeLevel
    const [chosenLevel, setChosenLevel] = useState('');
    const [allLevels, setAllLevels] = useState([]);
    useEffect(() => {
      const takenLevels = [];
      const getLevels = () => {
        const getter = ref(db, "Grade Level");
        onValue(getter, (snapshot) => {
          snapshot.forEach((laman) =>{
            const filter = {
              id: laman.key
            }
            takenLevels.push(filter)
          })
        })
        setAllLevels(takenLevels)
      }
      getLevels();
     
    }, [db])
    const handlerChange = (event) => {
       setChosenLevel(event.target.value)
    }

    //for the Strands
    const [chosenStrand, setChosenStrand] = useState('');
    const [allStrands, setAllStrands] = useState([]);
    useEffect(() => {
      const getStrands = []
      if(access === 'Administrator'){
        const getNow = () => {
            const getter = ref(db, "Strand");
            onValue(getter, (snappy) => {
              snappy.forEach((laman) => {
                getStrands.push(laman.key)
              })
            })
        }
        setAllStrands(getStrands)
        getNow();
      }
      else {
        setAllStrands(access)
        setChosenStrand(access)
      }
    }, [access,db])
    const strandChanger = (event) => {
      setChosenStrand(event.target.value)
    }


  return (
    <Box m="20px">
        <Header title="ATTENDANCE RECALL" subtitle="This section allows you to recall the attendance for a specific date. Just select the date on the picker, and you're done"/>
        <Box m="10px">
            <Box display="flex" justifyContent="center" m="10px">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label='Choose a date'
                        value={chosenDate}
                        onChange={(date) => setChosenDate(new Date(date).toDateString())}
                        />
                </LocalizationProvider>
            </Box>

                <Box display="flex" justifyContent="center" m="10px">
                    <FormControl sx={{margin : '20px'}}>
                      <FormLabel>Select a Grade Level</FormLabel>
                      <RadioGroup value={chosenLevel} onChange={handlerChange} >
                          {allLevels.map((item) => (
                            <FormControlLabel key={item.id} value={item.id} control={<Radio/>} label={item.id}/>
                          ))}
                      </RadioGroup>
                    </FormControl>

                    {access === 'Administrator' && (
                      <FormControl sx={{margin : '20px'}}>
                      <FormLabel>Select a Strand</FormLabel>
                      <RadioGroup value={chosenStrand} onChange={strandChanger} >

                          {Object.values(allStrands).map((item) => (
                            <FormControlLabel key={item} value={item} control={<Radio/>} label={item}/>
                          ))}

                      </RadioGroup>
                      </FormControl>

                    )}
                </Box>

            <Box 
            display="flex"
            height="65vh"
            justifyContent="center"
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
              columns={attendanceColumn}
              rows={allAttendance}
              slots={{toolbar: GridToolbar}}
              />
          
            </Box>
        </Box>
    </Box>
  )
}

export default Recall
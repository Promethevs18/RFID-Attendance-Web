import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import { Box, Typography } from '@mui/material'
import {get, getDatabase, onValue, ref} from "firebase/database"
import { BarChart, PieChart, axisClasses } from '@mui/x-charts'
import { useTheme } from '@emotion/react'
import { tokens } from '../theme'
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton } from '@mui/x-data-grid'

const Dashboard = () => {

  const [allGrades, setAllGrades] = useState([]);
  const [allStrands, setAllStrands] = useState([])

  const [oneRow, setOneRow] = useState({})

  const [optionList, setOptionList] = useState([])

  const db = getDatabase();

  const tema = useTheme();
  const colors = tokens(tema.palette.mode);


  // A useEffect to get all data from the database
  useEffect(() => {
    const gradeCounts = []
    onValue(ref(db, "Grade Level/"),
    (snapshot) => {
      snapshot.forEach((element) =>{
       gradeCounts.push({id: element.key, value: element.size})
      })
      setAllGrades(gradeCounts)
    })

    onValue(ref(db, `Grand Attendance/${new Date().toDateString()}`),
    (snapshot) =>{
      const strandCounts = [];
      snapshot.forEach((elemento) => {
        elemento.forEach((element) =>{
          element.forEach((laman) => {
            const strand = laman.child("strand").val();
            if(strand){
              if(strandCounts[strand]){
                strandCounts[strand] += 1;
              }
              else {
                strandCounts[strand] = 1;
              }
            }
          })
      });
      });

      const uniquesArray = [];
      for (const strands in strandCounts){
        uniquesArray.push({value: strandCounts[strands], label: strands})
      }

      setAllStrands(uniquesArray)

    })
  },[db])


  //this code is for the student table 
  useEffect(()=> {
    //this is to get all the strand muna
    const levels = new Set();
    const fetchLevels = () => {
      const levelDB = ref(db, `Grand Attendance/${new Date().toDateString()}`);
      onValue(
        levelDB,
        (snapshot) => {
          snapshot.forEach((snappy) => {
            snappy.forEach((snappy) => {
              snappy.forEach((snappy) => {
                const snapLevel = snappy.val();
                const takenLevel = {
                  yearLevel: snapLevel.grade_level,
                  subject: snapLevel.subject
                };
                const key = `${takenLevel.yearLevel}_${takenLevel.subject}`;
                if (!levels.has(key)) { 
                  levels.add(key);
                }
                
              });
            });
          });
          setOptionList(Array.from(levels).map(key => {
            const [yearLevel, subject] = key.split('_');
            return { yearLevel, subject };
          }));
        }
      );
    };



    //this code is to get the attendance based on the taken strand
    const fetchAttendance = async () => {
      const fetchAll = {};
    
      for (const option of optionList) {
        const attendance = ref(db, `Grand Attendance/${new Date().toDateString()}/${option.yearLevel}/${option.subject}`);
        const snapshot = await get(attendance);
        const attendanceList = [];
        snapshot.forEach((kuha) => {
          const attendanceData = {
            id: kuha.key,
            ...kuha.val()
          };
          attendanceList.push(attendanceData);
        });
        fetchAll[`${option.yearLevel}_${option.subject}`] = attendanceList;
      }
      setOneRow(fetchAll);
    };
    fetchAttendance();
    fetchLevels();
  },[db, optionList])

  
  //code for the columns of one datagrid
  const oneColumn = [
    { field: "id_num", headerName: "Student ID", flex: 1 },
    { field: "student_name", headerName: "Student Name", flex: 1},
    { field: "strand", headerName: "Strand", flex: 1},
    { field: "subject", headerName: "Subject", flex: 1},
    { field: "grade_level", headerName: "Grade Level", flex: 1},
    { field: "timeIn", headerName: "Time In", flex: 1},
    { field: "timeOut", headerName: "Time Out", flex: 1},
  ]

// This code is for the chart y axis (Grade Level students)
  const chartSetting = {
    yAxis: [
      {
        label: 'Number of Students',
      },
    ],
    width: 500,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'translate(-6px, 0)',
      },
    },
  };


  // UI part
  return (
    <Box m="20px">
         <Header title="DASHBOARD" subtitle="This is where general information are displayed "/>
       <Box display="flex" justifyContent="space-evenly" m="10px">
           {/*For the Grade Level Chart*/}
        <Box sx={{backgroundColor: "rgba(112,37,51, 0.3)", borderRadius:"20px"  }}>
            {allGrades.length > 0 && (
                <BarChart
                  dataset={allGrades}
                  xAxis={[{ scaleType: 'band', dataKey: 'id',  label: "Grade Level"}]}
                  series={[{ dataKey: 'value', label: 'Registered Students',  }]}
                  {...chartSetting}
                />
            )}
        </Box>

         {/*For the Strands Chart Chart*/}
         {allStrands.length > 0 && (
         <Box sx={{backgroundColor: "rgba(112,37,51, 0.3)", borderRadius:"20px", padding:"10px" }}>
            <Typography
              variant='h4'
              color={'#ffffff'}
              fontStyle={'italic'}
              display='flex'
              justifyContent='center'
              marginTop='10px'
              >
                Number of Students Present per Strand/Track
              </Typography>
                  <PieChart
                
                  series={[
                    {
                      data: [
                      ...allStrands
                      ],
                      highlightScope: { faded: 'global', highlighted: 'item' },
                      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    },
                  ]}
                  width={400}
                  height={250}
                  sx={{marginTop: '20px'}}
                  />
         </Box>
         )}
       </Box>
       <Box m='20px'
            display="grid"
            gridTemplateColumns="repeat(2, 1fr)" 
            justifyContent="space-between">

            {optionList.map((option) => (
                <Box
                  key={`${option.yearLevel}_${option.subject}`}
                  display="flex"
                  justifyContent="center"
                  alignContent="center"
                  height="68vh"
                  width='95%'
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

                  <DataGrid  key={`${option.yearLevel}_${option.subject}`}  columns={oneColumn} rows={oneRow[`${option.yearLevel}_${option.subject}`] || []} slots={{toolbar: CustomToolBar}}/>
                </Box>
                ))}
        </Box>
    </Box>
  )
}
function CustomToolBar () {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton/>
      <GridToolbarFilterButton/>
      <GridToolbarDensitySelector/>
    </GridToolbarContainer>
  )
 }

export default Dashboard
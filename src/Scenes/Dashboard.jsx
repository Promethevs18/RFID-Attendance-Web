import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import { Box, Typography, useTheme } from '@mui/material'
import { tokens } from '../theme'
import {getDatabase, onValue, ref} from "firebase/database"
import { BarChart, axisClasses } from '@mui/x-charts'

const Dashboard = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode);
  const [allGrades, setAllGrades] = useState([]);
  const [allStrands, setAllStrands] = useState([])
  const db = getDatabase();

  useEffect(() => {
    const gradeCounts = []
    const strandCounts = []
    onValue(ref(db, "Grade Level/"),
    (snapshot) => {
      snapshot.forEach((element) =>{
       gradeCounts.push({id: element.key, value: element.size})
      })
      setAllGrades(gradeCounts)
    })
    onValue(ref(db, "Strand"),
    (snapshot) =>{
      snapshot.forEach((elemento) =>{
        strandCounts.push({id: elemento.key, value: elemento.size})
      })
      setAllStrands(strandCounts)
    })

  },[db])

// This code is for the chart y axis (Grade Level students)
  const chartSetting = {
    yAxis: [
      {
        label: 'Number of Students',
      },
    ],
    width: 500,
    height: 300,
  };

  return (
    <Box m="20px">
         <Header title="DASHBOARD" subtitle="This is where general information are displayed "/>
       <Box display="flex" justifyContent="space-evenly">
        <Box sx={{backgroundColor: "maroon" }}>
        <BarChart
            dataset={allGrades}
            xAxis={[{ scaleType: 'band', dataKey: 'id' }]}
            series={[{ dataKey: 'value', label: 'Number of Students' }]}
            {...chartSetting}
          />  
        </Box>

       </Box>
   
    </Box>
  )
}

export default Dashboard
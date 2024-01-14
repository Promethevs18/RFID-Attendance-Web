import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import { Box } from '@mui/material'
import {getDatabase, onValue, ref} from "firebase/database"
import { BarChart, axisClasses } from '@mui/x-charts'

const Dashboard = () => {

  const [allGrades, setAllGrades] = useState([]);
  const [allStrands, setAllStrands] = useState([])
  const db = getDatabase();

  // A useEffect to get all data from the database
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
       <Box display="flex" justifyContent="space-evenly">
        <Box sx={{backgroundColor: "rgba(112,37,51, 0.3)", borderRadius:"20px"  }}>

                {/*For the Grade Level Chart*/}
        {allGrades.length > 0 && (
            <BarChart
              dataset={allGrades}
              xAxis={[{ scaleType: 'band', dataKey: 'id',  label: "Grade Level"}]}
              series={[{ dataKey: 'value', label: 'Registered Students' }]}
              {...chartSetting}
            />
         )}
        </Box>
  
       </Box>
    
    </Box>
  )
}

export default Dashboard
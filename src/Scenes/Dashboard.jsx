import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import { Box, Typography, useTheme } from '@mui/material'
import { tokens } from '../theme'
import { ResponsivePie } from "@nivo/pie"
import {getDatabase, onValue, ref} from "firebase/database"
import Clock from '../Globals/Clock'

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
  

  return (
    <Box m="20px">
         <Header title="DASHBOARD" subtitle="This is where general "/>
       <Box display="flex" justifyContent="space-evenly">
          <Typography
            variant="h2"
            color={colors.goldish[100]}
            fontWeight="bold"
            sx={{m: "5px 0 0 0"}}>
              Grade Level Chart
            </Typography>

            <Typography
            variant="h2"
            color={colors.goldish[100]}
            fontWeight="bold"
            sx={{m: "5px 0 0 0"}}>
              Strand Chart
            </Typography>
       </Box>
   
    </Box>
  )
}

export default Dashboard
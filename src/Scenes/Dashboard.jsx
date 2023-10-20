import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import { Box, Typography, useTheme } from '@mui/material'
import { tokens } from '../theme'
import { ResponsivePie } from "@nivo/pie"
import {getDatabase, onValue, ref} from "firebase/database"

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
         <Header title="DASHBOARD" subtitle="This page shows you the summary of everything"/>
       <Box display="flex" justifyContent="space-around">
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
       <Box height="250px" justifyContent="space-between" display="flex">
         {/*Pie*/}
         <ResponsivePie
          data={allGrades}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: colors.maroon[100],
                },
              },
              legend: {
                text: {
                  fill: colors.maroon[100],
                },
              },
              ticks: {
                line: {
                  stroke: colors.maroon[100],
                  strokeWidth: 1,
                },
                text: {
                  fill: colors.maroon[100],
                },
              },
            },
            legends: {
              text: {
                fill: colors.maroon[100],
              },
            },
          }}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor={colors.maroon[100]}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={colors.maroon[100]}
          arcLabelsRadiusOffset={0.4}
          arcLabelsSkipAngle={7}
          arcLabelsTextColor="black"
          isInteractive = {false}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: colors.maroon[100],
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: colors.maroon[100],
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          />
           <ResponsivePie
          data={allStrands}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: colors.maroon[100],
                },
              },
              legend: {
                text: {
                  fill: colors.maroon[100],
                },
              },
              ticks: {
                line: {
                  stroke: colors.maroon[100],
                  strokeWidth: 1,
                },
                text: {
                  fill: colors.maroon[100],
                },
              },
            },
            legends: {
              text: {
                fill: colors.maroon[100],
              },
            },
          }}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor={colors.maroon[100]}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={colors.maroon[100]}
          arcLabelsRadiusOffset={0.4}
          arcLabelsSkipAngle={7}
          arcLabelsTextColor="black"
          isInteractive = {false}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: colors.maroon[100],
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: colors.maroon[100],
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          />
       </Box>
    </Box>
  )
}

export default Dashboard
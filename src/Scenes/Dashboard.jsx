import React from 'react'
import Header from '../Components/Header'
import { Box } from '@mui/material'

const Dashboard = () => {
  return (
    <Box m="20px">
       <Box display="flex" justifyContent="space-between">
         <Header title="DASHBOARD" subtitle="This page shows you the summary of everything"/>
       </Box>
    </Box>
  )
}

export default Dashboard
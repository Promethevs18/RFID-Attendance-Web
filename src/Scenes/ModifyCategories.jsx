import { Box } from '@mui/system'
import React, { useState } from 'react'
import Header from '../Components/Header'
import { DataGrid } from '@mui/x-data-grid'
import { Typography } from '@mui/material'

const ModifyCategories = () => {
  
  const [levelList, setLevel] = useState([
    {id:1, gradeLevel:"G10"},
    {id:2, gradeLevel:"G11"},
    {id:3, gradeLevel:"G12"},
   ]);



// for the columns of the first datagrid
const gradeColumns = [
  {field: "id", headerName: "ID", flex: 1},
  {field: "gradeLevel", headerName: "Grade Level", flex: 1}
]

  //UI part
  return (
    <Box m="20px">
        <Header title="MODIFY CATEGORIES" subtitle="This section allows you to modify your schools academic strands and tracks"/>

        <Box m="20px" display="flex" justifyContent="space-around" alignContent="center">
          <Box >
                <Typography
                  variant="h3"
                  color="white"
                  marginTop="10px"
                  alignContent="center"
                  fontWeight="bold"
                  fontSize="40px"
                  >
                    Hello World
                  </Typography>
          </Box>
          <Box alignSelf="center">
                <Typography
                    variant="h3"
                    color="white"
                    marginTop="10px"
                    alignContent="center"
                    fontWeight="bold"
                    fontSize="40px"
                    >
                      Hello Mundo
                    </Typography>
          </Box>
         
        </Box>
        <Box display="flex" justifyContent="space-evenly" alignContent="center" >
          <Box padding="20px">
          <DataGrid
                       rows={levelList}
                       columns={gradeColumns}
                       checkboxSelection
                       disableRowSelectionOnClick
                       />
          </Box>
        <Box padding="20px">
             <DataGrid
                       rows={levelList}
                       columns={gradeColumns}
                       checkboxSelection
                       disableRowSelectionOnClick
                       />
        </Box>   
          </Box>
    </Box>
  )
}

export default ModifyCategories
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { getDatabase, onValue, ref } from 'firebase/database'

const ModifyCategories = () => {
  
  //Arrays and other iterations
  const [checkedLevel, setCheckedLevel] = useState([]);
  const [levelArray, setLevelArray] = useState([]);
  const [levelList, setLevel] = useState([]);
  const db = getDatabase();


   //START OF YEAR LEVEL CODES

   //useEffect to get the data from Firebase
   useEffect(() =>{
    const fetchLevels = () =>{
    const levels = []
    const levelDB = ref(db, "Grade Level/");
    onValue(
      levelDB,
      (snapshot) => {
        snapshot.forEach((snappy) =>{
          const snapLevel = snappy.key;
          const takenLevel = {
            id: snapLevel
          }
          levels.push(takenLevel)
          setLevel(levels)
        })
      }
    )

  }
  fetchLevels()
  },[db])

  // Effect to log levelArray when it changes
  useEffect(() => {
    console.log(levelArray);
  }, [levelArray]);
  
  //change handler for the selection ng level muna
  const chosenLevel = (napili) => {
    setCheckedLevel(napili)
  }
  const addLevelArray = () => {
    if (checkedLevel.length > 0) {
      const selectedLevels = checkedLevel.map((id) => levelList.find((row) => row.id === id)?.id);
      setLevelArray(selectedLevels);
    } else {
      toast.error('No selected levels');
    }

  }

// for the columns of the first datagrid
const gradeColumns = [
  {field: "id", headerName: "Grade Level", flex: 1}
]

// END OF YEAR LEVEL CODES




  //UI part
  return (
    <Box m="20px">
        <Header title="MODIFY CATEGORIES" subtitle="This section allows you to modify your schools academic strands and tracks"/>

        <Box marginLeft="20px" display="flex" justifyContent="space-between" alignContent="center">
          <Box >
                <Typography
                  variant="h3"
                  color="white"
                  marginTop="10px"
                  fontWeight="bold"
                  fontSize="40px"
                  >
                    School Grade Level 
                  </Typography>
          </Box>
          <Box alignSelf="center">
                <Typography
                    variant="h3"
                    color="white"
                    marginTop="10px"
                    fontWeight="bold"
                    fontSize="40px"
                    >
                     Academic Strands/Tracks
                    </Typography>
          </Box>
         
        </Box>
        <Box display="flex" justifyContent="space-between" alignContent="center" >
          <Box padding="20px">
                      <DataGrid
                       rows={levelList}
                       columns={gradeColumns}
                       checkboxSelection
                       disableRowSelectionOnClick
                       onRowSelectionModelChange={chosenLevel}
                       />
                       
          </Box>
          <Button
            variant="contained"
            color = "primary"
            onClick={() => addLevelArray()}
            sx={{height: "70px"}}>
            Press me motherfucker
          </Button>
          <Button
            variant="contained"
            color = "primary"
            sx={{height: "70px"}}  
            >
              Press me motherfucker
            </Button> 
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
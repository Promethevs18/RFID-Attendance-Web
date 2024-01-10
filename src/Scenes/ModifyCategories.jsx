import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Typography } from '@mui/material'
import { getDatabase, onValue, ref } from 'firebase/database'

const ModifyCategories = () => {

  //Arrays and other iterations
    const db = getDatabase();

   //START OF YEAR LEVEL CODES
  const [checkedLevel, setCheckedLevel] = useState([]);
  const [levelArray, setLevelArray] = useState([]);
  const [levelList, setLevel] = useState([]);
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

    //UseEffect para i update agad ang array sa current 
  useEffect(()=>{
    if (checkedLevel.length > 0) {
      const selectedLevels = checkedLevel.map((id) => levelList.find((row) => row.id === id)?.id);
      setLevelArray(selectedLevels);
    } else {
      console.error('No selected grade levels');
    }

  }, [checkedLevel, levelList, levelArray,db])

  //change handler for the selection ng level muna
  const chosenLevel = (napili) => {
    setCheckedLevel(napili)
    console.log(checkedLevel)
  }
// for the columns of the first datagrid
const gradeColumns = [
  {field: "id", headerName: "Grade Level", flex: 1}
]
// END OF YEAR LEVEL CODES

// START OF STRANDS/TRACKS
//initialize respective arrays and elements
const[checkedOption, setCheckedOption] = useState([]);
const[optionArray, setOptionArray] = useState([])
const[optionList, setOptionList] = useState([])

//Useeffect to get all the tracks from the database
useEffect(() =>{
  const fetchOptions = () =>{
    const options = []
    const optionsDB = ref(db, "Strand/");
    onValue(
      optionsDB,
      (snapshot) =>{
        snapshot.forEach((snappy) =>{
          const takenOptions = {
            id: snappy.key
          }
          options.push(takenOptions)
          setOptionList(options)
        })
      }
    )
  }
  fetchOptions();
}, [db])

   //UseEffect para i update agad ang array sa current 
  useEffect(()=>{
    if(checkedOption.length > 0){
      const selectedOptions = checkedOption.map((id) => optionList.find((row) => row.id === id)?.id);
      setOptionArray(selectedOptions);
    }else {
    console.error('No selected grade levels');
  }
  }, [optionArray, checkedOption, optionList])

//change hanlder para pag pinili ng admin ang section
const handleOptionChange = (napili) => {
  setCheckedOption(napili)
  console.log(checkedOption)
}

//column definition para sa ating table
const optionColumn = [
  {field: "id", headerName: "Tracks/Strands Listed", flex:1}
]
// END OF TRACK/STRAND OPTIONS CODE
  //UI part
  return (
    <Box m="20px">
        <Header title="Category Manifesto" subtitle="This section allows you to modify your schools academic strands and tracks"/>

        <Box m="20px" display="flex" flexDirection="row" justifyContent="space-around">
                    {/* For the school level section */}
          <Box display="flex" flexDirection="row" justifyContent="center">
               <Box>
                <Typography
                    variant="h3"
                    color="white"
                    marginTop="10px"
                    fontWeight="bold"
                    fontSize="40px"
                    >
                      School Grade Level 
                    </Typography>
                    <Box padding="20px">
                        <DataGrid
                        rows={levelList}
                        columns={gradeColumns}
                        onRowSelectionModelChange={chosenLevel}
                        />
                        
                    </Box>
               </Box>
            <Box marginTop="70px">
        
                  <Box>Hellow</Box>
                  <Box>Hellow</Box>
                  <Box>Hellow</Box>
            </Box>
          </Box>
                    {/* For the track/strand section */}
          <Box display="flex" flexDirection="row" justifyContent="center">
             <Box marginTop="70px">
                 Hwllo
             </Box> 
                  <Box>
                      <Typography
                            variant="h3"
                            color="white"
                            marginTop="10px"
                            fontWeight="bold"
                            fontSize="40px"
                            >
                            Academic Strands/Tracks
                      </Typography>
                      <Box padding="20px">
                              <DataGrid
                              rows={optionList}
                              columns={optionColumn}
                              onRowSelectionModelChange={handleOptionChange}
                              />
                      </Box>
                  </Box>
          </Box>
          </Box>

        <Box display="flex" justifyContent="center" alignContent="center" >
                Test area to demo the freakin' table
        </Box>  
     </Box>
  )
}

export default ModifyCategories
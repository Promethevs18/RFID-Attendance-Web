import { Box } from '@mui/system'
import React, { useRef, useState } from 'react'
import Header from '../Components/Header'
import { useTheme } from '@emotion/react'
import { tokens } from '../theme'
import { DataGrid } from '@mui/x-data-grid'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import { FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material'


const AddSched = () => {

  const theme = useTheme()
  const colors = tokens(theme.palette.mode)


  //Start of Datagrid Codes
    //for the columns
    const columns = [
      {field: "strand", headerName: "Strand", flex: 1}
    ]

    //for the rows where the data is taken from Firebase
    const [schedules, setSchedule] = useState([]);
  //End of Datagrid codes


  //Start of Form codes
    const formikRef = useRef(null)
    const initialValues = {
      subject: ""
    }
    const validate = yup.object().shape({
      subject: yup.string().required("This field is required")
    })


      //for the Dropdowns
        const [strands, setStrands] = useState([])
        const [selectedStrand, setSelStrand] = useState([])

        //change handler for the strand drop down
          const strandChange = (change) => {
             setSelStrand(change.target.value)
          }
  //End of Form Codes

  return (
    <Box m="20px">
        <Header title="Class Schedule Manifesto" subtitle="This is the area where the administrator can edit the content of the class schedule"/>

        <Box m='20px' display='flex' justifyContent='space-around'>
          
          <Box display='flex' justifyContent='space-between'>
            <Formik
              innerRef={formikRef}
              initialValues={initialValues}
              validationSchema={validate}
              >
                {({values, errors, touched, handleBlur, handleChange}) => (
                  <Form>
                  <Box justifyContent='center' display='flex' >
                    <TextField
                      variant='filled'
                      fullWidth
                      value = {values.subject}
                      type = 'text'
                      label = 'Subject'
                      onChange = {handleChange}
                      onBlur = {handleBlur}
                      name = 'subject'
                      error = {!!touched.subject && !! errors.subject}
                      helperText = {touched.subject && errors.subject}
                    />

                    <FormControl sx={{width: "150px", marginLeft: "20px"}}>
                      <InputLabel id = 'levelLabel'>Select a Strand/Track</InputLabel>
                        <Select
                          labelId='levelLabel'
                          label='Select a Strand/Track'
                          onChange={strandChange}
                          value={selectedStrand}
                        > 
                          <MenuItem value='ICT'>
                            ICT
                          </MenuItem>
                        </Select>
                    </FormControl>
                  </Box>
                </Form>
                )}
            </Formik>

          </Box>

          <Box 
            display="flex"
            height="65vh"
            width="68%"
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
              columns={columns}
              rows={schedules}
              />
          
          </Box>
    
        </Box>
    
    </Box>

   
  )
}

export default AddSched
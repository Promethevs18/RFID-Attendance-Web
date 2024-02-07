import React from 'react'
import Header from '../Components/Header'
import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { getDatabase, onValue, ref } from 'firebase/database'
import { useState } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useTheme } from '@emotion/react'
import { tokens } from '../theme'

const StudentLister = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [studentList, setStudentList] = useState([]);
    const database = getDatabase();

    useEffect(() => {
        const fetchData = () => {
          const patients = [];
          const databaseRef = ref(database, "Grand List/");
          onValue(
            databaseRef,
            (snapshot) => {
                const patientData = snapshot.val();
                Object.keys(patientData).forEach((key) => {
                  const patient = {
                    id: key,
                    ...patientData[key],
                  };
                  patients.push(patient);
              });
    
              setStudentList([...patients]); // Create a new array with the updated data
            },
            (error) => {
              toast.error(error);
            }
          );
        };
        fetchData();
      });

  
      
    const columns = [
        {
          field: "student_name",
          headerName: "Student's Name",
          flex: 1,
          cellClassName: "name-column--cell",
        },
        { field: "strand", headerName: "Strand", flex: 1 },
        { field: "grade_level", headerName: "Grade Level", flex: 1 },
        { field: "id_num", headerName: "ID Number", flex: 1 },
        { field: "caretaker_name", headerName: "Caretaker's Name", flex: 1 },
        { field: "caretaker_num", headerName: "Caretaker's Phone", flex: 1 },
      ];
    
  return (
    <Box m="20px">
        <Header 
            title="Grand Student Manifesto"
            subtitle="This section allows you to view all the listed students in the system"/>
        <Box 
            m="40px 0 0 0"
            height="75vh"
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
              }}
        >

        <DataGrid rows={studentList} columns={columns}/>
       </Box>
    </Box>
  )
}

export default StudentLister
import { Box } from '@mui/system';
import React, { useEffect, useRef, useState } from 'react';
import Header from '../Components/Header';
import { useTheme } from '@emotion/react';
import { tokens } from '../theme';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import { equalTo, getDatabase, onValue, orderByChild, query, ref, remove, update } from 'firebase/database';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';

const AddSched = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const db = getDatabase();

  // State variables
  const [schedules, setSchedules] = useState([]);
  const [selectedSub, setSelectedSub] = useState('');
  const [strands, setStrands] = useState([]);
  const [selectedStrand, setSelectedStrand] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [startOras, setStartOras] = useState(dayjs(new Date()));
  const [endOras, setEndOras] = useState(dayjs(new Date()));

  // Fetch schedules
  useEffect(() => {
    const subRef = ref(db, 'Subject Schedules/');
    const unsubscribe = onValue(subRef, (snapshot) => {
      if (snapshot.exists()) {
        const subjects = Object.keys(snapshot.val()).map((key) => ({
          id: key,
          ...snapshot.val()[key],
        }));
        setSchedules(subjects);
      } else {
        setSchedules([]);
      }
    });
    return () => unsubscribe(); // Cleanup listener
  }, [db]);

  // Fetch strands and teachers based on selected strand
  useEffect(() => {
    const strandsRef = ref(db, 'System Users/');
    const unsubscribeStrands = onValue(strandsRef, (snapshot) => {
      if (snapshot.exists()) {
        const strandsArray = [];
        snapshot.forEach((snap) => {
          if(snap.key !== 'Administrator'){
            strandsArray.push({ id: snap.key });
          }
        });
        setStrands(strandsArray);
      }
    });

    if (selectedStrand) {
      const teachersRef = query(
        ref(db, `System Users/${selectedStrand}`),
        orderByChild('accessLevel'),
        equalTo(selectedStrand)
      );
      const unsubscribeTeachers = onValue(teachersRef, (snapshot) => {
        if (snapshot.exists()) {
          const teacherList = [];
          snapshot.forEach((snap) => {
            teacherList.push(snap.val().userName);
          });
          setTeachers(teacherList);
        } else {
          setTeachers([]);
        }
      });

      return () => unsubscribeTeachers(); // Cleanup teacher listener
    }

    return () => unsubscribeStrands(); // Cleanup strand listener
  }, [db, selectedStrand]);

  // Handle row selection
  const rowChange = (data) => {
    setSelectedSub(data);
  };

  // Handle delete
  const deleteSchedule = (id) => {
    remove(ref(db, `Subject Schedules/${id}`))
      .then(() => toast.success('Subject deleted successfully'))
      .catch((error) => toast.error(`Error: ${error.message}`));
  };

  // Form submission
  const uploadData = async (values) => {
    if (!selectedStrand || !selectedTeacher) {
      toast.error('Please select both a strand and a teacher.');
      return;
    }

    try {
      await update(ref(db, `Subject Schedules/${values.subject}`), {
        ...values,
        timeStart: startOras.format('HH:mm'),
        endTime: endOras.format('HH:mm'),
        strandAssigned: selectedStrand,
        teacherAssigned: selectedTeacher,
      });
      toast.success('Data uploaded successfully');
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const columns = [
    { field: 'subject', headerName: 'Subject', flex: 1 },
    { field: 'strandAssigned', headerName: 'Strand', flex: 1 },
    { field: 'teacherAssigned', headerName: 'Teacher Assigned', flex: 1 },
    { field: 'timeStart', headerName: 'Period Start', flex: 1 },
    { field: 'endTime', headerName: 'Period End', flex: 1 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Action',
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => deleteSchedule(params.id)}
        />,
      ],
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Class Schedule Manifesto"
        subtitle="This is the area where the administrator can edit the content of the class schedule"
      />
      <Box m="20px" display="flex" justifyContent="space-around">
        {/* Form Section */}
        <Formik
          initialValues={{ subject: '' }}
          validationSchema={yup.object().shape({
            subject: yup.string().required('This field is required'),
          })}
          onSubmit={uploadData}
        >
          {({ values, errors, touched, handleBlur, handleChange }) => (
            <Form>
              <Box display="flex" justifyContent="center">
                <TextField
                  variant="filled"
                  fullWidth
                  value={values.subject}
                  type="text"
                  label="Subject"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="subject"
                  error={!!touched.subject && !!errors.subject}
                  helperText={touched.subject && errors.subject}
                />
                <FormControl sx={{ width: '300px', marginLeft: '20px' }}>
                  <InputLabel id="levelLabel">Select a Strand/Track</InputLabel>
                  <Select
                    labelId="levelLabel"
                    value={selectedStrand}
                    onChange={(e) => setSelectedStrand(e.target.value)}
                  >
                    {strands.map((strand) => (
                      <MenuItem key={strand.id} value={strand.id}>
                        {strand.id}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box display="flex" justifyContent="center" marginTop="20px">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Choose Start Time"
                    value={startOras}
                    onChange={(newValue) => setStartOras(newValue || dayjs())}
                    sx={{ marginRight: '20px' }}
                  />
                  <TimePicker
                    label="Choose End Time"
                    value={endOras}
                    onChange={(newValue) => setEndOras(newValue || dayjs())}
                  />
                </LocalizationProvider>
              </Box>
              <Box display="flex" justifyContent="center" marginTop="20px">
                <FormControl sx={{ width: '300px', marginLeft: '20px' }}>
                  <InputLabel id="teacherLabel">Select a Teacher To Assign</InputLabel>
                  <Select
                    labelId="teacherLabel"
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                  >
                    {teachers.map((teacher, index) => (
                      <MenuItem key={index} value={teacher}>
                        {teacher}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box display="flex" justifyContent="center" marginTop="20px">
                <Button variant="contained" type="submit">
                  Upload
                </Button>
              </Box>
            </Form>
          )}
        </Formik>

        {/* DataGrid Section */}
        <Box
          height="65vh"
          width="68%"
          sx={{
            '& .MuiDataGrid-root': { border: 'none' },
            '& .MuiDataGrid-columnHeaders': { backgroundColor: colors.maroon[700] },
            '& .MuiDataGrid-footerContainer': { backgroundColor: colors.maroon[600] },
          }}
        >
          <DataGrid
            rows={schedules}
            columns={columns}
            pageSize={5}
            checkboxSelection
            onRowSelectionModelChange={(value) => rowChange(value)}
            sx={{ '@media print': { '.MuiDataGrid-main': { color: 'black' } } }}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AddSched;

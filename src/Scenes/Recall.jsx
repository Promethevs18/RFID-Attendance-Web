import React, { useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/system';
import { useTheme } from '@emotion/react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';
import { tokens } from '../theme';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { getDatabase, onValue, ref } from 'firebase/database';
import Header from '../Components/Header';

const Recall = ({ access }) => {
    const colors = tokens(useTheme().palette.mode);
    const db = getDatabase();

    const [chosenDate, setChosenDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [chosenLevel, setChosenLevel] = useState('');
    const [chosenStrand, setChosenStrand] = useState('');
    const [allAttendance, setAllAttendance] = useState([]);
    const [allLevels, setAllLevels] = useState([]);
    const [allStrands, setAllStrands] = useState([]);

    const attendanceColumn = [
        { field: "id_num", headerName: "ID Number", width: 173 },
        { field: "student_name", headerName: "Student Name", width: 173 },
        { field: "grade_level", headerName: "Grade Level", width: 173 },
        { field: "strand", headerName: "Strand", width: 173 },
        { field: "timeIn", headerName: "Timed In", width: 173 },
        { field: "timeOut", headerName: "Timed Out", width: 173 },
    ];

    // Fetch Grade Levels
    useEffect(() => {
        const getLevels = ref(db, "Grade Level");
        onValue(getLevels, (snapshot) => {
            const levels = [];
            snapshot.forEach((child) => levels.push({ id: child.key }));
            setAllLevels(levels);
        });
    }, [db]);

    // Fetch Strands
    useEffect(() => {
        if (access === 'Administrator') {
            const getStrands = ref(db, "Strand");
            onValue(getStrands, (snapshot) => {
                const strands = [];
                snapshot.forEach((child) => strands.push(child.key));
                setAllStrands(strands);
            });
        } else {
            setAllStrands([access]);
            setChosenStrand(access);
        }
    }, [access, db]);

    // Fetch Attendance based on Date and Range
    const fetchAttendanceData = useCallback(() => {
        const list = [];
        const start = new Date(startDate || chosenDate);
        const end = endDate ? new Date(endDate) : start;
        const formatDate = (date) => date.toDateString();

        const addDateAttendance = (date) => {
            const path = `Grand Attendance/${formatDate(date)}/${chosenLevel}`;
            const dateRef = ref(db, path);

            onValue(dateRef, (snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((subjectSnapshot) => {
                        subjectSnapshot.forEach((data) => {
                            const attendance = { id: data.key, ...data.val() };
                            list.push(attendance);
                        });
                    });
                    setAllAttendance(list.filter((item) => item.strand === chosenStrand));
                }
            });
        };

        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
            addDateAttendance(new Date(d));
        }
    }, [chosenDate, startDate, endDate, chosenLevel, chosenStrand, db]);

    useEffect(() => {
        if (chosenLevel && chosenStrand && (chosenDate || (startDate && endDate))) {
            fetchAttendanceData();
        }
    }, [fetchAttendanceData, chosenLevel, chosenStrand, chosenDate, startDate, endDate]);

    return (
        <Box m="20px" justifyContent='center'>
            <Header title="ATTENDANCE RECALL" subtitle="This section allows you to recall attendance for a specific date or date range." />
            <Box m="10px" display="grid" justifyContent="center" textAlign="center">
                <p>Choose a single date or a date range</p>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label='Date' value={chosenDate} onChange={(date) => setChosenDate(new Date(date).toDateString())} />
                </LocalizationProvider>
                <Box display="flex" justifyContent="center" mt="20px">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label='Start Date' value={startDate} onChange={(date) => setStartDate(new Date(date).toDateString())} />
                        <DatePicker label='End Date' value={endDate} onChange={(date) => setEndDate(new Date(date).toDateString())} />
                    </LocalizationProvider>
                </Box>
                <Box display="flex" justifyContent="center" mt="20px">
                    <FormControl>
                        <FormLabel>Grade Level</FormLabel>
                        <RadioGroup value={chosenLevel} onChange={(e) => setChosenLevel(e.target.value)}>
                            {allLevels.map((item) => (
                                <FormControlLabel key={item.id} value={item.id} control={<Radio />} label={item.id} />
                            ))}
                        </RadioGroup>
                    </FormControl>
                    {access === 'Administrator' && (
                        <FormControl>
                            <FormLabel>Strand</FormLabel>
                            <RadioGroup value={chosenStrand} onChange={(e) => setChosenStrand(e.target.value)}>
                                {allStrands.map((strand) => (
                                    <FormControlLabel key={strand} value={strand} control={<Radio />} label={strand} />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    )}
                </Box>
            </Box>
            <Box height="65vh" display="flex" justifyContent='center' mt="20px">
                <DataGrid
                    columns={attendanceColumn}
                    rows={allAttendance}
                    slots={{ toolbar: CustomToolBar }}
                    sx={{
                        "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.maroon[700] },
                        "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.yellow[700] },
                        "& .MuiDataGrid-footerContainer": { backgroundColor: colors.maroon[600] },
                        "& .MuiButtonBase-root": { color: colors.white[200] }
                    }}
                />
            </Box>
        </Box>
    );
};

// Custom Toolbar for DataGrid
function CustomToolBar() {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}

export default Recall;

import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import moment from 'moment';
import GlobalApi from '@/app/_services/GlobalApi';
import { toast } from 'sonner';

import { useTheme } from 'next-themes';

const pagination = true;
const paginationPageSize = 25;
const paginationPageSizeSelector = [25, 50, 100];

function AttendanceGrid({attendanceList, selectedMonth}) {
    const { theme } = useTheme();
    const [rowData, setRowData] = useState();
    const [colDefs, setColDefs] = useState()
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const numberOfDays = selectedMonth
        ? moment(selectedMonth).daysInMonth()
        : moment().daysInMonth();

    let daysArrays = Array.from({length: numberOfDays}, (_, i) => i + 1)

    useEffect(() => {
        setColDefs([
            { field: 'studentId', filter: true, headerName: 'ID', width: 100 },
            { field: 'name', filter: true, headerName: 'Student Name', minWidth: 200 },
        ]);
        if (attendanceList) {
            const userList = getUniqueRecord();
            setRowData(userList);

            daysArrays.forEach((date) => {
                setColDefs(prevData => [...prevData, {
                    field: date.toString(),
                    width: 60,
                    editable: true,
                    cellRenderer: (params) => {
                        if (params.value === true) return '<div class="w-2.5 h-2.5 rounded-full bg-primary mx-auto shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>';
                        if (params.value === false) return '<div class="w-1.5 h-1.5 rounded-full bg-muted mx-auto"></div>';
                        return '';
                    }
                }])

                userList.forEach(obj => {
                    obj[date] = isPresent(obj.studentId, date)
                })
            })
        }
    }, [attendanceList])

    const isPresent = (studentId, day) => {
        const result = attendanceList.find(item => item.day == day && item.studentId == studentId)
        return result ? true : false
    }

    const getUniqueRecord = () => {
        const uniqueRecord = [];
        const existingUser = new Set();
        attendanceList?.forEach(record => {
            if (!existingUser.has(record.studentId)) {
                existingUser.add(record.studentId);
                uniqueRecord.push(record);
            }
        });
        return uniqueRecord;
    }

    const onMarkAttendance = (day, studentId, presentStatus) => {
        const date = moment(selectedMonth).format('MM/YYYY')
        if (presentStatus) {
            const data = { day, studentId, present: presentStatus, date }
            GlobalApi.MarkAttendance(data).then(() => {
                toast.success("Attendance synced successfully")
            }).catch(() => toast.error("Sync failed"))
        } else {
            GlobalApi.MarkAbsent(studentId, day, date)
                .then(() => {
                    toast.info("Marked as absent")
                }).catch(() => toast.error("Sync failed"))
        }
    }

    if (!mounted) return null;

    return (
        <div className='bg-card rounded-[2.5rem] border border-border shadow-2xl shadow-primary/10 overflow-hidden mt-8'>
            <div className='p-8 border-b border-border flex justify-between items-center bg-muted/20 backdrop-blur-md'>
                <div>
                    <h3 className='font-black text-2xl text-foreground tracking-tight'>Data <span className='text-primary'>Intelligence</span></h3>
                    <p className='text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1'>Grid Engine v4.2 // Real-time Sync</p>
                </div>
                <div className='flex gap-3 opacity-50'>
                    <div className='w-4 h-4 rounded-full bg-red-500/20 border border-red-500/40' />
                    <div className='w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500/40' />
                    <div className='w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.5)]' />
                </div>
            </div>
            <div
                className={`${theme === 'dark' ? 'ag-theme-quartz-dark' : 'ag-theme-quartz'} p-6 transition-all duration-500`}
                style={{ height: 650 }}
            >
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    onCellValueChanged={(e) => onMarkAttendance(e.colDef.field, e.data.studentId, e.newValue)}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    gridOptions={{
                        headerHeight: 60,
                        rowHeight: 60,
                        animateRows: true,
                    }}
                />
            </div>
            <style jsx global>{`
                .ag-theme-quartz, .ag-theme-quartz-dark {
                    --ag-border-radius: 20px;
                    --ag-header-column-separator-display: none;
                    --ag-font-family: 'Inter', sans-serif;
                    --ag-header-foreground-color: hsl(var(--muted-foreground));
                    --ag-header-background-color: transparent;
                }
                .ag-header-cell-label { 
                    justify-content: center; 
                    font-weight: 900; 
                    text-transform: uppercase; 
                    font-size: 11px; 
                    letter-spacing: 0.1em;
                }
                .ag-cell {
                    display: flex;
                    align-items: center;
                    font-weight: 600;
                    border-bottom: 1px solid hsl(var(--border) / 0.3) !important;
                }
            `}</style>
        </div>
    )
}

export default AttendanceGrid
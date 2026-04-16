"use client"
import GradeSelect from '@/app/_components/GradeSelect'
import MonthSelection from '@/app/_components/MonthSelection'
import GlobalApi from '@/app/_services/GlobalApi'
import { Button } from '@/components/ui/button'
import moment from 'moment'
import React, { useState } from 'react'
import AttendanceGrid from './_components/AttendanceGrid'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import SmartAttendance from './_components/SmartAttendance'
import { toast } from 'sonner'
import { QrCode, Grid, Download } from 'lucide-react'

function Attendance() {
    const [selectedMonth, setSelectedMonth] = useState(moment().format('MM/YYYY'));
    const [selectedGrade, setSelectedGrade] = useState('5th');
    const [attendanceList, setAttendceList] = useState();
    const [viewMode, setViewMode] = useState('smart'); // 'smart' or 'manual'
    const role = 'teacher'; 

    const exportToPDF = () => {
        const doc = new jsPDF()
        doc.text(`Attendance Report - ${selectedMonth} (${selectedGrade})`, 14, 15)
        
        const tableData = attendanceList ? attendanceList.map(item => [
            item.studentId,
            item.name,
            item.grade,
            item.present ? "Present" : "Absent",
            item.date
        ]) : [];

        autoTable(doc, {
            head: [['Student ID', 'Name', 'Grade', 'Status', 'Month']],
            body: tableData,
            startY: 20,
            theme: 'striped',
            headStyles: { fillStyle: '#4f46e5' }
        })
        
        doc.save(`Attendance_${selectedGrade}_${selectedMonth.replace('/', '_')}.pdf`)
        toast.success("Report downloaded successfully!")
    }

    const onSearchHandler = () => {
        const month = moment(selectedMonth).format('MM/YYYY');
        GlobalApi.GetAttendanceList(selectedGrade, month).then(resp => {
            setAttendceList(resp.data);
        })
    }
    return (
        <div className='p-8 md:p-12 lg:p-16 space-y-10 bg-dashboard-gradient min-h-screen'>
            <div className='flex justify-between items-end'>
                <div>
                    <h2 className='font-black text-4xl text-slate-800 tracking-tight flex items-center gap-3'>
                        Attendance
                    </h2>
                    <p className='text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest'>Verification Hub</p>
                </div>
                
                <div className='flex items-center gap-4'>
                    {attendanceList && (
                        <Button 
                            variant="outline" 
                            onClick={exportToPDF}
                            className="rounded-2xl flex items-center gap-2 border-primary/20 text-primary hover:bg-primary/5"
                        >
                            <Download size={18} /> Export PDF
                        </Button>
                    )}
                    <div className='flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200'>
                        <button 
                            onClick={() => setViewMode('smart')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'smart' ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <QrCode size={16} /> Digital
                        </button>
                        <button 
                            onClick={() => setViewMode('manual')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'manual' ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Grid size={16} /> Manual
                        </button>
                    </div>
                </div>
            </div>

            {viewMode === 'smart' ? (
                <div className='bg-white p-12 rounded-[2rem] border border-slate-100 shadow-2xl shadow-indigo-500/5 transition-all'>
                    <SmartAttendance role={role} selectedGrade={selectedGrade} studentId={101} />
                </div>
            ) : (
                <>
                    <div className='flex flex-col md:flex-row gap-6 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm'>
                        <div className='flex flex-col gap-2 flex-1'>
                            <label className='text-xs font-bold text-slate-400 uppercase tracking-wider ml-1'>Select Month</label>
                            <MonthSelection selectedMonth={(value) => setSelectedMonth(value)} />
                        </div>
                        <div className='flex flex-col gap-2 flex-1'>
                            <label className='text-xs font-bold text-slate-400 uppercase tracking-wider ml-1'>Select Grade</label>
                            <GradeSelect selectedGrade={(v) => setSelectedGrade(v)} />
                        </div>
                        <div className='flex items-end'>
                            <Button
                                className="w-full md:w-auto px-8 py-6 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                                onClick={() => onSearchHandler()}
                            >
                                Fetch Grid
                            </Button>
                        </div>
                    </div>

                    <div className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden'>
                        <AttendanceGrid attendanceList={attendanceList} selectedMonth={selectedMonth} />
                    </div>
                </>
            )}
        </div>
    )
}

export default Attendance
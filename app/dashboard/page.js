"use client"
import React, { useEffect, useState } from 'react'
import MonthSelection from '../_components/MonthSelection'
import GradeSelect from '../_components/GradeSelect'
import GlobalApi from '../_services/GlobalApi'
import moment from 'moment'
import StatusList from './_components/StatusList'
import BarChartComponent from './_components/BarChartComponent'
import PieChartComponent from './_components/PieChartComponent'

import AttendanceInsights from './_components/AttendanceInsights'
import { toast } from 'sonner' // Added missing toast import

function Dashboard() {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedGrade, setSelectedGrade] = useState('5th');
    const [attendanceList, setAttendanceList] = useState([]);
    const [totalPresentData, setTotalPresentData] = useState([]);

    useEffect(() => {
        GetTotalPresentCountByDay();
        getStudentAttendance();
    }, [selectedMonth, selectedGrade]) 

    const getStudentAttendance = () => {
        GlobalApi.GetAttendanceList(selectedGrade, moment(selectedMonth).format('MM/YYYY'))
            .then(resp => {
                setAttendanceList(resp.data)
            })
            .catch(error => {
                console.error("Failed to fetch attendance:", error);
                toast.error("Failed to load attendance records.");
            })
    }

    const GetTotalPresentCountByDay = () => {
        GlobalApi.TotalPresentCountByDay(moment(selectedMonth).format('MM/YYYY'), selectedGrade)
            .then(resp => {
                setTotalPresentData(resp.data);
            })
            .catch(error => {
                console.error("Failed to fetch daily stats:", error);
            })
    }

    return (
        <div className='p-8 md:p-12 lg:p-16 space-y-10 bg-dashboard-gradient min-h-screen'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                <div>
                    <h2 className='font-black text-5xl text-foreground tracking-tight'>
                        Insight <span className='text-primary'>Dashboard</span>
                    </h2>
                    <p className='text-muted-foreground mt-2 font-black uppercase text-[10px] tracking-[0.2em]'>Intelligence & Analytics Engine</p>
                </div>

                <div className='flex items-center gap-6 bg-card/40 backdrop-blur-xl p-3 px-6 rounded-[2.5rem] border border-border/50 shadow-2xl shadow-primary/5'>
                    <div className='flex flex-col'>
                        <label className='text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-widest'>Period</label>
                        <MonthSelection selectedMonth={setSelectedMonth} />
                    </div>
                    <div className='w-[1px] h-10 bg-border/50' />
                    <div className='flex flex-col'>
                        <label className='text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-widest'>Cohort</label>
                        <GradeSelect selectedGrade={(v) => { setSelectedGrade(v); }} />
                    </div>
                </div>
            </div>

            {/* AI Insights & At-Risk Prediction Section */}
            <AttendanceInsights attendanceList={attendanceList} role='admin' />

            <StatusList attendanceList={attendanceList} />

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                <div className='lg:col-span-2'>
                    <BarChartComponent attendanceList={attendanceList}
                        totalPresentData={totalPresentData} />
                </div>
                <div className='lg:col-span-1'>
                    <PieChartComponent attendanceList={attendanceList} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
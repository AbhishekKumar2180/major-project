"use client"
import { getUniqueRecord } from '@/app/_services/service'
import React, { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTheme } from 'next-themes'

function BarChartComponent({attendanceList, totalPresentData}) {
    const { theme } = useTheme();
    const [data, setData] = useState([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        setData([])
        if (attendanceList && totalPresentData) {
            formatAttendanceListCount();
        }
    }, [attendanceList, totalPresentData])

    const formatAttendanceListCount = () => {
        const totalStudent = getUniqueRecord(attendanceList);
        const result = totalPresentData.map((item => ({
            day: item.day,
            presentCount: item.presentCount,
            absentCount: Math.max(0, Number(totalStudent?.length) - Number(item.presentCount))
        })));
        setData(result)
    }

    if (!mounted) return null;

    return (
        <div className='bg-card p-8 rounded-[2.5rem] border border-border/50 shadow-2xl shadow-primary/5 transition-all duration-500 relative overflow-hidden'>
            <div className='absolute top-0 right-0 p-8 opacity-5'>
                <BarChart size={40} />
            </div>
            <div className='mb-8'>
                <h2 className='font-black text-2xl text-foreground tracking-tight'>Weekly <span className='text-primary'>Pulse</span></h2>
                <p className='text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1'>Presence Distribution Over Time</p>
            </div>
            
            <ResponsiveContainer width={'100%'} height={350}>
                <BarChart data={data}>
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9}/>
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid 
                        strokeDasharray="4 4" 
                        vertical={false} 
                        stroke="hsl(var(--border) / 0.5)" 
                    />
                    <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 900 }}
                        dy={15}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 900 }}
                    />
                    <Tooltip 
                        cursor={{ fill: 'hsl(var(--primary) / 0.03)' }}
                        contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            borderColor: 'hsl(var(--border))', 
                            borderRadius: '24px',
                            color: 'hsl(var(--foreground))',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                            padding: '16px',
                            borderWidth: '2px',
                            fontSize: '12px',
                            fontWeight: '800'
                        }}
                    />
                    <Bar 
                        dataKey="presentCount" 
                        name="Presence" 
                        fill="url(#barGradient)" 
                        radius={[8, 8, 2, 2]} 
                        barSize={32}
                    />
                    <Bar 
                        dataKey="absentCount" 
                        name="Absence" 
                        fill="hsl(var(--muted))" 
                        radius={[8, 8, 2, 2]} 
                        barSize={32}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default BarChartComponent
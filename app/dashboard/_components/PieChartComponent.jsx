import { getUniqueRecord } from '@/app/_services/service'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

function PieChartComponent({attendanceList}) {
    const data01 = [
        {
          "name": "Group A",
          "value": 400,
          
        },
        {
          "name": "Group B",
          "value": 300
        },
    ]
    const [data,setData]=useState([])

    useEffect(() => {
        if (attendanceList && attendanceList.length > 0) {
            const totalSt = getUniqueRecord(attendanceList);
            const today = moment().format('D');
            const totalPossible = totalSt.length * Number(today);
            
            let presentPerc = 0;
            if (totalPossible > 0) {
                const actualPresent = attendanceList.filter(item => item.attendanceId).length;
                presentPerc = (actualPresent / totalPossible * 100);
            }

            setData([
                {
                    name: 'Present',
                    value: Number(presentPerc.toFixed(1)),
                    fill: 'hsl(var(--primary))',
                },
                {
                    name: 'Absent',
                    value: Number((100 - presentPerc).toFixed(1)),
                    fill: 'hsl(var(--muted))',
                },
            ]);
        }
    }, [attendanceList])

    return (
        <div className='bg-card p-6 rounded-[2.5rem] border border-border shadow-xl shadow-primary/5'>
            <h2 className='font-black text-xl text-foreground mb-6'>Institutional <span className='text-primary'>Reach</span></h2>
            <ResponsiveContainer width={'100%'} height={300}>
                <PieChart>
                    <Pie 
                        data={data} 
                        dataKey="value"
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={70} 
                        outerRadius={95}  
                        paddingAngle={5}
                        stroke="none"
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            borderColor: 'hsl(var(--border))', 
                            borderRadius: '15px',
                            color: 'hsl(var(--foreground))'
                        }} 
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default PieChartComponent
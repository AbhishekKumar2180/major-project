import { getUniqueRecord } from '@/app/_services/service';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import Card from './Card';
import { GraduationCap, TrendingDown, TrendingUp } from 'lucide-react';

function StatusList({attendanceList}) {
    const [totalStudent,setTotalStudent]=useState(0);
    const [presentPerc,setPresentPerc]=useState(0);
    
    useEffect(() => {
        if (attendanceList && attendanceList.length > 0) {
            const totalSt = getUniqueRecord(attendanceList);
            setTotalStudent(totalSt.length);

            const today = moment().format('D');
            const totalPossible = totalSt.length * Number(today);
            
            if (totalPossible > 0) {
                const actualPresent = attendanceList.filter(item => item.attendanceId).length;
                const PresentPrec = (actualPresent / totalPossible * 100);
                setPresentPerc(PresentPrec);
            } else {
                setPresentPerc(0);
            }
        } else {
            setTotalStudent(0);
            setPresentPerc(0);
        }
    }, [attendanceList])
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-10'>
        <Card icon={<GraduationCap/>} title='Total Student' value={totalStudent} />
        <Card icon={<TrendingUp/>} title='Total Present' value={presentPerc.toFixed(1)+'%'} />
        <Card icon={<TrendingDown/>} title='Total Absent' value={(100-presentPerc).toFixed(1)+"%"} />
   
    </div>
  )
}

export default StatusList
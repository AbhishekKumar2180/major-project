"use client"
import React, { useEffect, useState } from 'react'
import AddNewStudent from './_components/AddNewStudent'
import GlobalApi from '@/app/_services/GlobalApi'
import StudentListTable from './_components/StudentListTable';

function Student() {

  const [studentList,setStudentList]=useState([]);
  useEffect(()=>{
    GetAllStudents();
  },[])
  /**
   * Used to Get All Students
   */
  const GetAllStudents=()=>{
    GlobalApi.GetAllStudents().then(resp=>{
      setStudentList(resp.data);
    })
  }
  return (
    <div className='p-8 md:p-12 lg:p-16 space-y-10 min-h-screen bg-transparent'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
            <div>
                <h2 className='font-black text-5xl text-foreground tracking-tight'>
                    Resident <span className='text-primary'>Registry</span>
                </h2>
                <p className='text-muted-foreground mt-2 font-black uppercase text-[10px] tracking-[0.2em]'>Student Lifecycle Management</p>
            </div>
            <AddNewStudent refreshData={GetAllStudents}/>
        </div>

        <div className='bg-card p-4 rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 overflow-hidden'>
            <StudentListTable studentList={studentList}
            refreshData={GetAllStudents} />
        </div>
    </div>
  )
}

export default Student
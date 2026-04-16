"use client"
import React, { useEffect, useState } from 'react'
import { AlertCircle, TrendingUp, TrendingDown, Target, Lightbulb } from 'lucide-react'
import { motion } from 'framer-motion'
import moment from 'moment'

function AttendanceInsights({ attendanceList, role }) {
    const [atRisk, setAtRisk] = useState([]);
    const [stats, setStats] = useState({ avg: 0, trend: 'up' });

    useEffect(() => {
        if (attendanceList && attendanceList.length > 0) {
            calculateInsights();
        }
    }, [attendanceList]);

    const calculateInsights = () => {
        const studentMap = {};
        const daysPassed = moment().date();

        attendanceList.forEach(record => {
            if (!studentMap[record.studentId]) {
                studentMap[record.studentId] = { 
                    name: record.name, 
                    presentCount: 0, 
                    studentId: record.studentId 
                };
            }
            if (record.present) {
                studentMap[record.studentId].presentCount += 1;
            }
        });

        const riskList = Object.values(studentMap)
            .map(s => {
                const perc = (s.presentCount / daysPassed) * 100;
                return { ...s, percentage: perc.toFixed(1) };
            })
            .filter(s => s.percentage < 75);

        setAtRisk(riskList);
        
        // Mocking average for demo
        setStats({ avg: 78.5, trend: 'up' });
    };

    return (
        <div className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Insight Card 1: Risk Analysis */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm'
                >
                    <div className='flex items-center gap-3 mb-4'>
                        <div className='p-2 bg-red-100 rounded-xl'>
                            <AlertCircle className='text-red-500' size={20} />
                        </div>
                        <h3 className='font-bold text-slate-800'>Attendance at Risk</h3>
                    </div>
                    
                    {atRisk.length > 0 ? (
                        <div className='space-y-4'>
                            {atRisk.slice(0, 3).map((student, idx) => (
                                <div key={idx} className='flex items-center justify-between p-3 bg-slate-50 rounded-2xl'>
                                    <div>
                                        <p className='text-sm font-bold text-slate-700'>{student.name}</p>
                                        <p className='text-[10px] text-slate-400 font-bold uppercase tracking-wider'>Below 75% Criteria</p>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-sm font-black text-red-500'>{student.percentage}%</p>
                                        <p className='text-[10px] text-slate-400'>Critical</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='py-8 text-center'>
                            <p className='text-slate-400 text-sm italic'>All students are currently on track!</p>
                        </div>
                    )}
                </motion.div>

                {/* Insight Card 2: Smart Recommendation */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='bg-indigo-600 p-6 rounded-3xl shadow-xl shadow-indigo-200 relative overflow-hidden'
                >
                    <div className='relative z-10'>
                        <div className='flex items-center gap-3 mb-4'>
                            <div className='p-2 bg-white/20 rounded-xl backdrop-blur-md'>
                                <Lightbulb className='text-white' size={20} />
                            </div>
                            <h3 className='font-bold text-white'>Smart Optimizer</h3>
                        </div>
                        
                        <p className='text-indigo-100 text-sm'>
                            Based on current trends, students in <span className='text-white font-bold'>Grade 5th</span> show a <span className='text-white font-bold font-black'>12% improvement</span> in morning attendance compared to last week.
                        </p>
                        
                        <div className='mt-6 flex items-center gap-4'>
                            <div className='flex-1 bg-white/10 h-2 rounded-full overflow-hidden'>
                                <motion.div 
                                    className='bg-white h-full' 
                                    initial={{ width: 0 }}
                                    animate={{ width: '78%' }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            </div>
                            <span className='text-white font-bold text-sm'>78% Avg</span>
                        </div>
                        
                        <div className='mt-4 p-3 bg-white/10 rounded-2xl border border-white/20'>
                            <p className='text-[10px] text-indigo-100 font-bold uppercase tracking-widest'>Suggestion</p>
                            <p className='text-xs text-white mt-1'>"Schedule labs in the 2nd period for 95%+ engagement."</p>
                        </div>
                    </div>
                    {/* Background decorative circles */}
                    <div className='absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full' />
                    <div className='absolute -top-4 -left-4 w-24 h-24 bg-white/5 rounded-full' />
                </motion.div>
            </div>
        </div>
    )
}

export default AttendanceInsights

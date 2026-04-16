"use client"
import React, { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, BookOpen, GraduationCap, Timer, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import moment from 'moment'
import GlobalApi from '@/app/_services/GlobalApi'
import GradeSelect from '@/app/_components/GradeSelect'
import { useTheme } from 'next-themes'

function Timetable() {
    const { theme } = useTheme();
    const [selectedGrade, setSelectedGrade] = useState('5th');
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    useEffect(() => {
        setMounted(true);
        fetchTimetable();
    }, [selectedGrade]);

    const fetchTimetable = () => {
        setLoading(true);
        // Assuming 5th grade has an ID of 1 for now, or we fetch it
        GlobalApi.GetTimetable(1).then(resp => {
            if (resp.data) {
                setTimetable(resp.data);
            } else {
                setMockData();
            }
            setLoading(false);
        }).catch(() => {
            setMockData();
            setLoading(false);
        });
    }

    const setMockData = () => {
        setTimetable([
            { id: 1, subjectName: 'Advanced Mathematics', start: '09:00', end: '10:00', room: 'Room 101', day: 'Monday', teacher: 'Dr. John Smith' },
            { id: 2, subjectName: 'Quantum Physics', start: '10:15', end: '11:15', room: 'Lab 1', day: 'Monday', teacher: 'Ms. Sarah Connor' },
            { id: 3, subjectName: 'History of Sci', start: '13:00', end: '14:00', room: 'Room 202', day: 'Monday', teacher: 'Mr. Robert Brown' },
            { id: 4, subjectName: 'Literature', start: '09:00', end: '10:00', room: 'Room 105', day: 'Tuesday', teacher: 'Mrs. Emily Davis' }
        ]);
    }

    if (!mounted) return null;

    return (
        <div className='p-8 md:p-12 lg:p-16 space-y-12 bg-dashboard-gradient min-h-screen'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-8'>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className='font-black text-5xl text-foreground tracking-tight'>Schedule <span className='text-primary'>Engine</span></h2>
                    <p className='text-muted-foreground mt-2 uppercase text-[10px] font-black tracking-[0.3em]'>Academic Chronology & Resource Allocation</p>
                </motion.div>
                
                <div className='flex items-center gap-4 bg-card/60 backdrop-blur-2xl p-4 px-8 rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 hover:scale-105 transition-transform'>
                    <Calendar size={20} className='text-primary' />
                    <span className='text-sm font-black text-foreground uppercase tracking-widest leading-none mt-0.5'>{moment().format('dddd, MMM Do')}</span>
                    <div className='w-[2px] h-6 bg-border mx-2' />
                    <GradeSelect selectedGrade={(v) => setSelectedGrade(v)} />
                </div>
            </div>

            {loading ? (
                <div className='flex flex-col items-center justify-center py-40 gap-4'>
                    <Loader2 className='animate-spin text-primary' size={48} />
                    <p className='text-xs font-black uppercase text-muted-foreground tracking-widest'>Calibrating Time Slots...</p>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-8'>
                    {days.map((day, idx) => (
                        <div key={idx} className='space-y-6'>
                            <div className='bg-primary/5 p-5 rounded-3xl border border-primary/10 transition-all hover:bg-primary/10'>
                                <h3 className='text-center font-black text-[11px] uppercase tracking-[0.3em] text-primary'>{day}</h3>
                            </div>
                            
                            <div className='space-y-6'>
                                {timetable.filter(t => t.day === day).map((slot, sIdx) => (
                                    <motion.div 
                                        key={slot.id}
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ delay: sIdx * 0.1 }}
                                        className='bg-card p-6 rounded-[2.5rem] border border-border/60 shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden'
                                    >
                                        <div className='absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity'>
                                            <Clock size={48} />
                                        </div>
                                        <div className='flex items-center gap-2 mb-4'>
                                            <Timer size={14} className='text-primary' />
                                            <span className='text-[11px] font-black text-foreground uppercase tracking-wider'>{slot.start} — {slot.end}</span>
                                        </div>
                                        <h4 className='font-black text-lg text-foreground mb-1 tracking-tight group-hover:text-primary transition-colors leading-tight'>{slot.subjectName}</h4>
                                        <div className='flex items-center gap-2 mb-6'>
                                            <MapPin size={12} className='text-muted-foreground' />
                                            <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em]'>{slot.room}</span>
                                        </div>
                                        
                                        <div className='pt-6 border-t border-border/50 flex items-center gap-4'>
                                            <div className='w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-all'>
                                                <GraduationCap size={16} className='text-muted-foreground group-hover:text-primary' />
                                            </div>
                                            <div>
                                                <p className='text-[9px] font-black text-muted-foreground uppercase leading-none mb-1 tracking-widest'>Instructor</p>
                                                <p className='text-xs font-black text-foreground leading-none'>{slot.teacher || 'Assigned Staff'}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {timetable.filter(t => t.day === day).length === 0 && (
                                    <div className='py-12 text-center border-2 border-dashed border-border/40 rounded-[2.5rem] bg-muted/5'>
                                        <p className='text-muted-foreground/40 text-[10px] font-black uppercase tracking-widest'>Idle Node</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Timetable

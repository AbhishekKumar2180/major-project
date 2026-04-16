"use client"
import React, { useState, useEffect } from 'react'
import { ClipboardList, Plus, Search, Mail, Phone, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import GlobalApi from '@/app/_services/GlobalApi'
import { motion } from 'framer-motion'
import Image from 'next/image'

function Faculty() {
    const [facultyList, setFacultyList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFaculty();
    }, []);

    const fetchFaculty = () => {
        setLoading(true);
        GlobalApi.GetFaculty().then(resp => {
            setFacultyList(resp.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen bg-dashboard-gradient'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin' />
                    <p className='text-xs font-black uppercase text-slate-400 tracking-widest'>Accessing Directory...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='p-8 md:p-12 lg:p-16 space-y-10 bg-dashboard-gradient min-h-screen'>
            <div className='flex justify-between items-end'>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className='font-black text-5xl text-foreground tracking-tight italic'>Faculty <span className='text-primary not-italic'>Directory</span></h2>
                    <p className='text-muted-foreground mt-2 uppercase text-[10px] font-black tracking-[0.3em]'>Verified Institutional Staff</p>
                </motion.div>
                <Button className="rounded-2xl px-8 py-7 shadow-xl shadow-primary/20 flex gap-3 hover:scale-105 transition-all text-xs font-black uppercase tracking-widest">
                    <Plus size={18} /> Add Faculty
                </Button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                {facultyList.length > 0 ? facultyList.map((faculty, idx) => (
                    <motion.div 
                        key={faculty.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className='bg-card p-10 rounded-[3rem] border border-border shadow-xl hover:shadow-indigo-500/10 transition-all group relative overflow-hidden backdrop-blur-xl'
                    >
                        <div className='absolute top-0 left-0 w-2 h-full bg-primary opacity-0 group-hover:opacity-100 transition-all' />
                        <div className='flex items-center gap-6 mb-10'>
                            <div className='relative'>
                                <Image 
                                    src={faculty.picture || `https://ui-avatars.com/api/?name=${faculty.name}&background=4f46e5&color=fff`} 
                                    width={80} 
                                    height={80} 
                                    alt={faculty.name} 
                                    className='rounded-[2rem] border-4 border-background shadow-lg group-hover:rotate-6 transition-transform' 
                                />
                                <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-4 border-card animate-pulse' />
                            </div>
                            <div>
                                <h3 className='font-black text-xl text-foreground leading-tight'>{faculty.name}</h3>
                                <p className='text-xs font-black text-primary uppercase tracking-widest mt-1 opacity-80'>{faculty.role}</p>
                            </div>
                        </div>

                        <div className='space-y-4'>
                            <div className='flex items-center gap-4 text-foreground bg-background/50 p-4 rounded-[1.5rem] border border-border transition-colors hover:bg-primary/5'>
                                <div className='p-2 bg-primary/10 rounded-xl'><Mail size={16} className='text-primary' /></div>
                                <span className='text-xs font-bold truncate'>{faculty.email}</span>
                            </div>
                            <div className='flex items-center gap-4 text-foreground bg-background/50 p-4 rounded-[1.5rem] border border-border transition-colors hover:bg-primary/5'>
                                <div className='p-2 bg-indigo-500/10 rounded-xl'><BookOpen size={16} className='text-indigo-500' /></div>
                                <span className='text-xs font-bold'>{faculty.department || 'Academic Staff'}</span>
                            </div>
                        </div>

                        <div className='mt-10 pt-8 border-t border-border/50 flex gap-4'>
                            <Button variant="ghost" className="flex-1 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">View Bio</Button>
                            <Button className="flex-1 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white dark:bg-white dark:text-black">Schedule</Button>
                        </div>
                    </motion.div>
                )) : (
                    <div className='col-span-full py-20 text-center bg-card rounded-[3rem] border-2 border-dashed border-border'>
                        <p className='text-muted-foreground font-bold'>No verified faculty members found in the current registry.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Faculty

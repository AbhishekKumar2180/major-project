"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import GlobalApi from '@/app/_services/GlobalApi';
import { toast } from 'sonner';
import { LoaderIcon, UserPlus, X, Hash, MapPin, Phone, GraduationCap } from 'lucide-react'

function AddNewStudent({refreshData}) {
    const [open, setOpen] = useState(false);
    const [grades,setGrades]=useState([]);
    const [loading,setLoading]=useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    useEffect(()=>{
        GetAllGradesList();
    },[])

    const GetAllGradesList=()=>{
        GlobalApi.GetAllGrades().then(resp=>{
            setGrades(resp.data);
        })
    }

    const onSubmit = (data) => {
        setLoading(true)
        GlobalApi.CreateNewStudent(data).then(resp=>{
            if(resp.data) {
                reset();
                refreshData();
                setOpen(false);
                toast.success('Ecryption Key Generated: New Student Enrolled') 
            }
            setLoading(false)
        }).catch(err => {
            setLoading(false);
            toast.error("Registry Access Denied: Failed to add student.");
        })
    }

    return (
        <div>
            <Button 
                onClick={() => setOpen(true)}
                className='rounded-2xl px-8 py-7 shadow-xl shadow-primary/20 flex gap-3 hover:scale-105 transition-all text-xs font-black uppercase tracking-widest bg-primary'
            >
                <UserPlus size={18} /> Add New Student
            </Button>
            
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="glass-morphism rounded-[3rem] border-border/50 max-w-xl p-0 overflow-hidden shadow-2xl">
                    <div className='p-10 space-y-8'>
                        <DialogHeader>
                            <div className='flex items-center gap-4 mb-2'>
                                <div className='p-3 bg-primary/10 rounded-2xl text-primary'>
                                    <UserPlus size={24} />
                                </div>
                                <div>
                                    <DialogTitle className='text-3xl font-black text-foreground tracking-tight'>Enroll <span className='text-primary'>Student</span></DialogTitle>
                                    <DialogDescription className='text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1'>
                                        New Operational Record Entry
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='space-y-2'>
                                    <label className='text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2'>
                                        <GraduationCap size={12} /> Full Name
                                    </label>
                                    <Input 
                                        placeholder='Ex. Alex Morgan'
                                        className='rounded-2xl py-6 bg-muted/20 border-border focus:ring-4 focus:ring-primary/5 font-bold transition-all'
                                        {...register('name', { required: true })}
                                    />
                                    {errors.name && <span className='text-[10px] text-destructive font-black uppercase tracking-widest'>Required Field</span>}
                                </div>

                                <div className='space-y-2'>
                                    <label className='text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2'>
                                        <Hash size={12} /> Assigned Cohort
                                    </label>
                                    <select 
                                        className='w-full p-3.5 rounded-2xl bg-muted/20 border border-border focus:ring-4 focus:ring-primary/5 font-bold transition-all outline-none text-sm appearance-none'
                                        {...register('grade', { required: true })}
                                    >
                                        <option value="">Select Grade</option>
                                        {grades.map((item,index)=>(
                                            <option key={index} value={item.grade}>{item.grade}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className='space-y-2'>
                                    <label className='text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2'>
                                        <Phone size={12} /> Contact Pulse
                                    </label>
                                    <Input 
                                        type="number" 
                                        placeholder='Ex. +1 555 0123'
                                        className='rounded-2xl py-6 bg-muted/20 border-border focus:ring-4 focus:ring-primary/5 font-bold transition-all'
                                        {...register('contact')} 
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <label className='text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2'>
                                        <MapPin size={12} /> Geographic Node
                                    </label>
                                    <Input 
                                        placeholder='Ex. Sector 4, Orion City'
                                        className='rounded-2xl py-6 bg-muted/20 border-border focus:ring-4 focus:ring-primary/5 font-bold transition-all'
                                        {...register('address')} 
                                    />
                                </div>
                            </div>

                            <div className='flex gap-4 pt-6'>
                                <Button 
                                    type="button" 
                                    onClick={() => setOpen(false)} 
                                    variant="ghost" 
                                    className="flex-1 rounded-2xl py-7 font-black uppercase tracking-widest text-[10px] hover:bg-muted"
                                >
                                    Abort
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className='flex-1 rounded-2xl py-7 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 bg-primary'
                                >
                                    {loading ? <LoaderIcon className='animate-spin'/> : 'Commit Record'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewStudent
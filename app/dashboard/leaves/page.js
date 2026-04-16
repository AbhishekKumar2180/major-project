"use client"
import React, { useState, useEffect } from 'react'
import { Calendar, FileText, Send, CheckCircle2, Clock, XCircle, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import GlobalApi from '@/app/_services/GlobalApi'
import { motion, AnimatePresence } from 'framer-motion'
import moment from 'moment'

function LeaveRequests() {
    const [role, setRole] = useState('student'); // Mocking role
    const [leaves, setLeaves] = useState([
        { id: 1, studentName: 'Emily Davis', startDate: '2024-04-20', endDate: '2024-04-22', reason: 'Family medical emergency', status: 'pending' },
        { id: 2, studentName: 'Jacob Wilson', startDate: '2024-04-15', endDate: '2024-04-15', reason: 'Dental appointment', status: 'approved' }
    ]);
    const [showNewRequest, setShowNewRequest] = useState(false);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const newLeave = {
            id: leaves.length + 1,
            studentName: 'Emily Davis (Me)',
            ...formData,
            status: 'pending'
        };
        setLeaves([newLeave, ...leaves]);
        setShowNewRequest(false);
        toast.success("Leave request submitted successfully!");
    };

    const handleStatusUpdate = (id, status) => {
        setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        toast.success(`Request marked as ${status}`);
    };

    return (
        <div className='p-8 md:p-12 lg:p-16 space-y-10 bg-dashboard-gradient min-h-screen'>
            <div className='flex justify-between items-end'>
                <div>
                    <h2 className='font-black text-4xl text-slate-800 tracking-tight'>Leave Management</h2>
                    <p className='text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest'>Workflow Portal</p>
                </div>
                {role === 'student' && (
                    <Button 
                        onClick={() => setShowNewRequest(true)}
                        className="rounded-2xl px-6 py-6 shadow-lg shadow-primary/20 flex gap-2"
                    >
                        <Plus size={18} /> New Request
                    </Button>
                )}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
                {/* Request Form (Modal/Drawer style) */}
                <AnimatePresence>
                    {showNewRequest && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className='lg:col-span-1 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-2xl h-fit'
                        >
                            <h3 className='font-black text-xl mb-6'>Apply for Leave</h3>
                            <form onSubmit={handleSubmit} className='space-y-4'>
                                <div className='space-y-2'>
                                    <label className='text-xs font-bold uppercase text-slate-400 ml-1'>Start Date</label>
                                    <Input 
                                        type="date" 
                                        required 
                                        className="rounded-xl border-slate-100 bg-slate-50"
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-xs font-bold uppercase text-slate-400 ml-1'>End Date</label>
                                    <Input 
                                        type="date" 
                                        required 
                                        className="rounded-xl border-slate-100 bg-slate-50"
                                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-xs font-bold uppercase text-slate-400 ml-1'>Reason</label>
                                    <textarea 
                                        required
                                        className='w-full p-4 rounded-xl border border-slate-100 bg-slate-50 text-sm focus:ring-2 focus:ring-primary outline-none transition-all'
                                        placeholder='Explain the reason for absence...'
                                        rows={4}
                                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                    />
                                </div>
                                <div className='flex gap-2 pt-4'>
                                    <Button type="submit" className="flex-1 rounded-xl">Submit Request</Button>
                                    <Button variant="ghost" onClick={() => setShowNewRequest(false)} className="rounded-xl">Cancel</Button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Requests List */}
                <div className={`${showNewRequest ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
                    {leaves.map((leave) => (
                        <motion.div 
                            key={leave.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4'
                        >
                            <div className='flex gap-4 items-center'>
                                <div className={`p-4 rounded-2xl ${
                                    leave.status === 'approved' ? 'bg-emerald-50 text-emerald-500' : 
                                    leave.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                                }`}>
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className='font-bold text-slate-800'>{leave.studentName}</h4>
                                    <p className='text-xs text-slate-400 flex items-center gap-1 mt-0.5'>
                                        <Calendar size={12} /> {moment(leave.startDate).format('MMM D')} - {moment(leave.endDate).format('MMM D, YYYY')}
                                    </p>
                                </div>
                            </div>

                            <div className='flex-1 md:max-w-md'>
                                <p className='text-sm text-slate-600 line-clamp-1 italic'>"{leave.reason}"</p>
                            </div>

                            <div className='flex items-center gap-3 w-full md:w-auto justify-between md:justify-end'>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    leave.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                                    leave.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                    {leave.status}
                                </span>
                                
                                {role === 'teacher' && leave.status === 'pending' && (
                                    <div className='flex gap-2'>
                                        <button onClick={() => handleStatusUpdate(leave.id, 'approved')} className='p-2 hover:bg-emerald-50 text-emerald-500 rounded-lg transition-colors'><CheckCircle2 size={20}/></button>
                                        <button onClick={() => handleStatusUpdate(leave.id, 'rejected')} className='p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors'><XCircle size={20}/></button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LeaveRequests

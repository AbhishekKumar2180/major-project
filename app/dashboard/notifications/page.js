"use client"
import React, { useState } from 'react'
import { Bell, AlertTriangle, CheckCircle2, Info, Trash2, MailOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import moment from 'moment'

function Notifications() {
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'warning', message: 'Low Attendance Alert: Your attendance in Math is 68%. Attend next 3 classes to cross 75%.', time: '2 hours ago', isRead: false },
        { id: 2, type: 'success', message: 'Leave Approved: Your leave request for April 20-22 has been approved by Dr. John Smith.', time: '5 hours ago', isRead: true },
        { id: 3, type: 'info', message: 'Schedule Change: Quantum Physics lab moved to Room 104 for this Friday.', time: '1 day ago', isRead: true }
    ]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getIcon = (type) => {
        switch(type) {
            case 'warning': return <AlertTriangle className='text-amber-500' size={20} />;
            case 'success': return <CheckCircle2 className='text-emerald-500' size={20} />;
            default: return <Info className='text-blue-500' size={20} />;
        }
    };

    return (
        <div className='p-8 md:p-12 lg:p-16 space-y-10 bg-dashboard-gradient min-h-screen'>
            <div className='flex justify-between items-end'>
                <div>
                    <h2 className='font-black text-4xl text-slate-800 tracking-tight'>Notifications</h2>
                    <p className='text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest'>Stay Informed</p>
                </div>
                <Button variant="ghost" onClick={() => setNotifications(notifications.map(n => ({...n, isRead: true})))} className="text-primary font-bold text-xs uppercase tracking-widest">
                    Mark all as read
                </Button>
            </div>

            <div className='max-w-4xl space-y-4'>
                <AnimatePresence>
                    {notifications.length > 0 ? notifications.map((notif) => (
                        <motion.div 
                            key={notif.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={`group relative p-6 rounded-[1.5rem] border transition-all duration-300 flex gap-6 items-start ${
                                notif.isRead ? 'bg-white/50 border-slate-100 opacity-80' : 'bg-white border-primary/10 shadow-lg shadow-primary/5'
                            }`}
                        >
                            <div className={`p-3 rounded-2xl ${
                                notif.type === 'warning' ? 'bg-amber-100' : 
                                notif.type === 'success' ? 'bg-emerald-100' : 'bg-blue-100'
                            }`}>
                                {getIcon(notif.type)}
                            </div>

                            <div className='flex-1 space-y-1'>
                                <div className='flex justify-between items-start'>
                                    <p className={`text-sm ${notif.isRead ? 'text-slate-500' : 'text-slate-800 font-bold'}`}>
                                        {notif.message}
                                    </p>
                                    <span className='text-[10px] font-bold text-slate-400 whitespace-nowrap ml-4'>{notif.time}</span>
                                </div>
                                <div className='flex gap-4 pt-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                                    {!notif.isRead && (
                                        <button onClick={() => markAsRead(notif.id)} className='text-[10px] font-black uppercase tracking-tighter text-primary flex items-center gap-1'>
                                            <MailOpen size={12} /> Mark read
                                        </button>
                                    )}
                                    <button onClick={() => deleteNotification(notif.id)} className='text-[10px] font-black uppercase tracking-tighter text-red-400 flex items-center gap-1'>
                                        <Trash2 size={12} /> Delete
                                    </button>
                                </div>
                            </div>
                            
                            {!notif.isRead && (
                                <div className='absolute top-6 right-6 w-2 h-2 bg-primary rounded-full animate-pulse' />
                            )}
                        </motion.div>
                    )) : (
                        <div className='py-20 text-center space-y-4'>
                            <Bell size={48} className='mx-auto text-slate-200' />
                            <p className='text-slate-400 italic'>No notifications yet.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Notifications

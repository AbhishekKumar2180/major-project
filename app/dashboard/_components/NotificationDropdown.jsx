"use client"
import React, { useState, useEffect } from 'react'
import { Bell, Check, Info, AlertTriangle, CheckCircle2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import GlobalApi from '@/app/_services/GlobalApi'
import moment from 'moment'

function NotificationDropdown({ userId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
    }, [userId]);

    const fetchNotifications = () => {
        // Mocking notifications if API fails or userId is missing (for Demo Mode)
        GlobalApi.GetUserNotifications(userId || 'demo-user').then(resp => {
            if (resp.data && resp.data.length > 0) {
                setNotifications(resp.data);
                setUnreadCount(resp.data.filter(n => !n.isRead).length);
            } else {
                setMockNotifications();
            }
        }).catch(() => {
            setMockNotifications();
        });
    };

    const setMockNotifications = () => {
        const mock = [
            { id: 1, message: "New student 'Alice' added to 5th Grade", type: 'success', isRead: false, createdAt: new Date() },
            { id: 2, message: "Attendance report for March is ready", type: 'info', isRead: false, createdAt: new Date(Date.now() - 3600000) },
            { id: 3, message: "System maintenance scheduled for midnight", type: 'warning', isRead: true, createdAt: new Date(Date.now() - 86400000) },
        ];
        setNotifications(mock);
        setUnreadCount(mock.filter(n => !n.isRead).length);
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
        // In a real app, call GlobalApi.MarkNotificationRead(id)
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle2 size={16} className='text-emerald-500' />;
            case 'warning': return <AlertTriangle size={16} className='text-amber-500' />;
            default: return <Info size={16} className='text-blue-500' />;
        }
    };

    return (
        <div className='relative'>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className='relative cursor-pointer hover:scale-110 transition-transform group p-2 rounded-xl hover:bg-primary/5'
            >
                <Bell size={22} className='text-foreground group-hover:text-primary transition-colors' />
                {unreadCount > 0 && (
                    <span className='absolute top-1 right-1 bg-primary text-primary-foreground text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-background shadow-sm animate-pulse'>
                        {unreadCount}
                    </span>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className='fixed inset-0 z-40' onClick={() => setIsOpen(false)} />
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className='absolute right-0 mt-4 w-80 glass-morphism rounded-[2rem] border border-border overflow-hidden z-50 shadow-2xl'
                        >
                            <div className='p-5 border-b border-border/50 flex justify-between items-center bg-primary/5'>
                                <h4 className='font-black text-sm uppercase tracking-widest'>Notifications</h4>
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={markAllRead}
                                        className='text-[10px] font-bold text-primary hover:underline'
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            <div className='max-h-96 overflow-y-auto'>
                                {notifications.length > 0 ? (
                                    <div className='divide-y divide-border/30'>
                                        {notifications.map((notif) => (
                                            <div 
                                                key={notif.id} 
                                                className={`p-4 flex gap-3 hover:bg-primary/[0.02] transition-colors relative group ${!notif.isRead ? 'bg-primary/[0.03]' : ''}`}
                                            >
                                                <div className='mt-1'>
                                                    {getTypeIcon(notif.type)}
                                                </div>
                                                <div className='flex-1 pr-4'>
                                                    <p className={`text-xs leading-relaxed ${!notif.isRead ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>
                                                        {notif.message}
                                                    </p>
                                                    <p className='text-[9px] text-muted-foreground/60 mt-1 font-bold uppercase'>
                                                        {moment(notif.createdAt).fromNow()}
                                                    </p>
                                                </div>
                                                {!notif.isRead && (
                                                    <button 
                                                        onClick={() => markAsRead(notif.id)}
                                                        className='absolute right-2 top-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-primary/10 rounded-full text-primary'
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='p-10 text-center'>
                                        <div className='w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 opacity-20'>
                                            <Bell size={24} />
                                        </div>
                                        <p className='text-xs font-bold text-muted-foreground'>All caught up!</p>
                                    </div>
                                )}
                            </div>

                            <div className='p-4 border-t border-border/50 bg-muted/30 text-center'>
                                <button className='text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors tracking-widest'>
                                    View All Activity
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default NotificationDropdown

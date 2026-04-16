"use client"
import React, { useState, useEffect } from 'react'
import { User, Bell, Shield, Palette, LogOut, Check, Save, Loader2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import GlobalApi from '@/app/_services/GlobalApi'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components'

function Settings() {
    const { theme, setTheme } = useTheme();
    const { user: kindeUser, isAuthenticated } = useKindeBrowserClient();
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        name: 'Admin User',
        email: 'admin@school.edu',
        role: 'Administrator',
        picture: 'https://ui-avatars.com/api/?name=Admin+User&background=4c8cf8&color=fff'
    });

    const [notifs, setNotifs] = useState({
        emailNotifications: true,
        pushNotifications: false,
        systemAlerts: true
    });

    useEffect(() => {
        setMounted(true);
        if (isAuthenticated && kindeUser) {
            fetchUserData(kindeUser.email);
        }
    }, [isAuthenticated, kindeUser]);

    const fetchUserData = (email) => {
        GlobalApi.GetUser(email).then(resp => {
            if (resp.data) {
                setUser({
                    ...user,
                    name: resp.data.name,
                    email: resp.data.email,
                    picture: kindeUser?.picture || user.picture
                });
                setNotifs({
                    emailNotifications: resp.data.emailNotifications,
                    pushNotifications: resp.data.pushNotifications,
                    systemAlerts: resp.data.systemAlerts
                });
            }
        });
    }

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const data = {
                email: user.email,
                name: user.name,
                ...notifs
            };
            await GlobalApi.UpdateUser(data);
            toast.success("Settings synchronized with database!");
        } catch (error) {
            toast.error("Failed to save settings.");
        } finally {
            setLoading(false);
        }
    };

    const toggleNotif = (key) => {
        setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!mounted) return null;

    return (
        <div className='p-8 md:p-12 lg:p-16 max-w-6xl mx-auto space-y-12 bg-dashboard-gradient min-h-screen'>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <h2 className='font-black text-5xl text-foreground tracking-tight'>Control <span className='text-primary'>Panel</span></h2>
                <p className='text-muted-foreground mt-2 font-medium'>Manage institutional preferences and security protocols.</p>
            </motion.div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
                {/* Left Column: Profile & Account */}
                <div className='lg:col-span-1 space-y-8'>
                    <div className='bg-card p-10 rounded-[3rem] border border-border shadow-xl shadow-primary/5 text-center relative overflow-hidden'>
                        <div className='absolute top-0 left-0 w-full h-24 bg-primary/10' />
                        <div className='relative z-10'>
                            <img 
                                src={user.picture} 
                                alt="Profile" 
                                className='w-32 h-32 rounded-[2rem] border-4 border-background mx-auto shadow-2xl mb-6 object-cover p-1 bg-white'
                            />
                            <h3 className='text-2xl font-black text-foreground'>{user.name}</h3>
                            <p className='text-sm font-bold text-primary uppercase tracking-widest mt-1'>{user.role}</p>
                            
                            <div className='mt-8 space-y-3'>
                                <div className='text-left'>
                                    <label className='text-[10px] font-black uppercase text-muted-foreground ml-2 mb-1 block'>Full Name</label>
                                    <input 
                                        className='w-full p-4 bg-background border border-border rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all'
                                        value={user.name}
                                        onChange={(e) => setUser({...user, name: e.target.value})}
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className='text-left'>
                                    <label className='text-[10px] font-black uppercase text-muted-foreground ml-2 mb-1 block'>Email Identity</label>
                                    <input 
                                        className='w-full p-4 bg-background border border-border rounded-2xl text-sm font-bold opacity-60 cursor-not-allowed'
                                        value={user.email}
                                        readOnly
                                        placeholder="Email Address"
                                    />
                                </div>
                                <Button 
                                    onClick={handleSaveProfile} 
                                    disabled={loading}
                                    className='w-full py-7 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform font-black uppercase tracking-widest text-xs'
                                >
                                    {loading ? <Loader2 className='animate-spin mr-2' size={18} /> : <Save size={18} className='mr-2' />} 
                                    Commit Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Preferences */}
                <div className='lg:col-span-2 space-y-8'>
                    {/* Appearance */}
                    <div className='bg-card p-8 rounded-[3rem] border border-border shadow-sm'>
                        <div className='flex items-center gap-4 mb-8'>
                            <div className='p-4 bg-purple-500/10 text-purple-500 rounded-2xl'>
                                <Palette size={24} />
                            </div>
                            <div>
                                <h4 className='text-xl font-black text-foreground uppercase tracking-tight'>Appearance</h4>
                                <p className='text-xs font-bold text-muted-foreground'>Custom visual experience</p>
                            </div>
                        </div>
                        
                        <div className='grid grid-cols-2 gap-6'>
                            <button 
                                onClick={() => setTheme('light')}
                                className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${theme === 'light' ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-border grayscale hover:grayscale-0'}`}
                            >
                                <div className='w-full h-24 bg-slate-100 rounded-2xl mb-2 flex items-center justify-center border border-slate-200'>
                                    <div className='w-16 h-3 bg-slate-300 rounded-full' />
                                </div>
                                <span className='text-xs font-black uppercase tracking-widest'>Core Light</span>
                            </button>
                            <button 
                                onClick={() => setTheme('dark')}
                                className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${theme === 'dark' ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-border grayscale hover:grayscale-0'}`}
                            >
                                <div className='w-full h-24 bg-slate-900 rounded-2xl mb-2 flex items-center justify-center border border-white/10'>
                                    <div className='w-16 h-3 bg-white/20 rounded-full' />
                                </div>
                                <span className='text-xs font-black uppercase tracking-widest'>Deep Dark</span>
                            </button>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className='bg-card p-8 rounded-[3rem] border border-border shadow-sm'>
                        <div className='flex items-center gap-4 mb-8'>
                            <div className='p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl'>
                                <Bell size={24} />
                            </div>
                            <div>
                                <h4 className='text-xl font-black text-foreground uppercase tracking-tight'>Protocols</h4>
                                <p className='text-xs font-bold text-muted-foreground'>Communication preferences</p>
                            </div>
                        </div>

                        <div className='space-y-4'>
                            {[
                                { id: 'emailNotifications', label: 'Email Alerts', desc: 'Receive daily attendance summaries' },
                                { id: 'pushNotifications', label: 'Push Notifications', desc: 'Real-time alerts for suspicious activity' },
                                { id: 'systemAlerts', label: 'System Ticker', desc: 'In-app notification bubble' }
                            ].map((item) => (
                                <div key={item.id} className='flex items-center justify-between p-6 bg-background border border-border rounded-3xl transition-all hover:border-primary/40 group'>
                                    <div>
                                        <p className='text-sm font-black text-foreground uppercase tracking-tight'>{item.label}</p>
                                        <p className='text-[10px] text-muted-foreground font-bold'>{item.desc}</p>
                                    </div>
                                    <div 
                                        onClick={() => toggleNotif(item.id)}
                                        className={`w-14 h-8 rounded-full p-1.5 cursor-pointer transition-all ${notifs[item.id] ? 'bg-primary' : 'bg-muted'}`}
                                    >
                                        <motion.div 
                                            animate={{ x: notifs[item.id] ? 24 : 0 }}
                                            className='w-5 h-5 bg-white rounded-full shadow-lg'
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='mt-8 pt-8 border-t border-border flex justify-end'>
                             <Button onClick={handleSaveProfile} variant="secondary" className='rounded-xl font-bold text-xs px-6 py-6'>
                                Update Protocols
                             </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className='pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6'>
                <div>
                  <p className='text-[10px] font-black uppercase text-muted-foreground tracking-widest'>Application Node</p>
                  <p className='text-xs font-bold text-foreground/40'>Session ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
                <LogoutLink>
                    <Button variant="ghost" className='px-10 py-7 rounded-2xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all font-black uppercase tracking-widest text-xs border border-red-500/10'>
                        <LogOut size={18} className='mr-2' /> Terminate Session
                    </Button>
                </LogoutLink>
            </div>
        </div>
    )
}

export default Settings

"use client"
import React, { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { QrCode, MapPin, Camera, CheckCircle2, XCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import GlobalApi from '@/app/_services/GlobalApi'
import { motion, AnimatePresence } from 'framer-motion'

function SmartAttendance({ role, studentId, selectedGrade }) {
    const [mode, setMode] = useState('none'); // 'generate', 'scan', 'verifying', 'success'
    const [qrData, setQrData] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const generateQR = () => {
        const data = {
            grade: selectedGrade || '5th',
            timestamp: Date.now(),
            token: Math.random().toString(36).substring(7)
        };
        setQrData(JSON.stringify(data));
        setMode('generate');
    };

    const handleScan = async (result) => {
        if (!result) return;
        setMode('verifying');
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const geoData = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                try {
                    const scanData = JSON.parse(result[0].rawValue);
                    const verificationRequest = {
                        studentId: studentId || 101,
                        ...scanData,
                        location: geoData,
                        method: 'qr_geo'
                    };

                    const resp = await GlobalApi.VerifySmartAttendance(verificationRequest);
                    if (resp.data.success) {
                        setMode('success');
                        toast.success("Identity Verified & Presence Recorded");
                    } else {
                        setMode('error');
                        toast.error(resp.data.message || "Credential Node Rejection");
                    }
                } catch (err) {
                    setMode('none');
                    toast.error("Decoys detected: Invalid Code");
                }
            }, (err) => {
                setMode('none');
                toast.error("Location Access Denied: Secure Verification Requires GPS");
            });
        }
    };

    if (!mounted) return null;

    return (
        <div className='flex flex-col items-center justify-center p-10 space-y-8'>
            <AnimatePresence mode='wait'>
                {mode === 'none' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className='text-center space-y-6 max-w-sm'
                    >
                        <div className='relative group mx-auto w-fit'>
                            <div className='absolute -inset-4 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all duration-500' />
                            <div className='relative p-8 bg-card border-2 border-primary/20 rounded-[2.5rem] shadow-2xl'>
                                <QrCode size={56} className='text-primary' />
                            </div>
                        </div>
                        <div>
                            <h3 className='text-2xl font-black text-foreground tracking-tight italic'>Smart <span className='text-primary not-italic'>Credential</span></h3>
                            <p className='text-xs font-bold text-muted-foreground mt-2 leading-relaxed opacity-80'>
                                {role === 'teacher' 
                                    ? "Broadcast a unique, time-sensitive presence token for synchronization." 
                                    : "Scan the node to verify your identity and physical proximity."}
                            </p>
                        </div>
                        <Button 
                            className="rounded-2xl px-12 py-8 shadow-[0_15px_30px_-5px_hsla(var(--primary)/25%)] hover:scale-105 transition-all text-sm font-black uppercase tracking-widest bg-primary"
                            onClick={() => role === 'teacher' ? generateQR() : setMode('scan')}
                        >
                            {role === 'teacher' ? 'Initialize Node' : 'Scan Access Code'}
                        </Button>
                    </motion.div>
                )}

                {mode === 'generate' && (
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className='bg-card p-10 rounded-[3rem] border border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] text-center space-y-8 relative overflow-hidden'
                    >
                        <div className='absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-primary animate-gradient-x' />
                        <h3 className='font-black text-xs uppercase tracking-[0.3em] text-muted-foreground'>Broadcast Active</h3>
                        <div className='p-6 bg-white rounded-3xl inline-block border-8 border-primary/5 shadow-inner'>
                            <QRCodeSVG value={qrData} size={256} bgColor="#ffffff" fgColor="hsl(var(--foreground))" level="H" />
                        </div>
                        <div className='flex items-center justify-center gap-3 text-emerald-500 font-black animate-pulse'>
                            <ShieldCheck size={20} />
                            <span className='text-[10px] uppercase tracking-widest'>Encryption Key Synchronized</span>
                        </div>
                        <Button variant="outline" onClick={() => setMode('none')} className="rounded-2xl w-full py-6 dark:bg-muted/10 font-bold border-border/50">Stop Broadcast</Button>
                    </motion.div>
                )}

                {mode === 'scan' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='w-full max-w-sm aspect-square relative bg-black rounded-[3rem] overflow-hidden shadow-2xl border-4 border-primary/20'
                    >
                        <Scanner
                            onScan={handleScan}
                            onError={(err) => toast.error("Camera Engine Failure: " + err)}
                            constraints={{ facingMode: 'environment' }}
                        />
                        <div className='absolute inset-0 border-[50px] border-black/60 pointer-events-none' />
                        <div className='absolute inset-0 pointer-events-none flex items-center justify-center'>
                             <div className='w-2/3 h-2/3 border-2 border-white/20 rounded-3xl relative'>
                                <div className='absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-xl' />
                                <div className='absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-xl' />
                                <div className='absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-xl' />
                                <div className='absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-xl' />
                                <div className='absolute top-1/2 left-0 w-full h-0.5 bg-primary/40 animate-scan-line shadow-[0_0_15px_hsl(var(--primary))]' />
                             </div>
                        </div>
                        <Button 
                            className='absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl text-white border-white/20 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px]'
                            onClick={() => setMode('none')}
                        >
                            Abort Scan
                        </Button>
                    </motion.div>
                )}

                {mode === 'verifying' && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='text-center space-y-6 py-20'
                    >
                        <div className='relative'>
                             <Loader2 size={72} className='mx-auto text-primary animate-spin opacity-40' />
                             <Sparkles className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse' size={32} />
                        </div>
                        <div>
                            <h3 className='font-black text-2xl uppercase tracking-tighter'>Authenticating</h3>
                            <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-2'>Verifying Node Token & GPS Proximity</p>
                        </div>
                    </motion.div>
                )}

                {mode === 'success' && (
                    <motion.div 
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className='text-center space-y-8 py-10'
                    >
                        <div className='relative'>
                             <div className='absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full' />
                             <div className='relative p-10 bg-emerald-500/10 rounded-full inline-block border-2 border-emerald-500/30'>
                                <CheckCircle2 size={80} className='text-emerald-500' />
                             </div>
                        </div>
                        <div>
                            <h3 className='font-black text-3xl text-emerald-500 uppercase italic'>Verified</h3>
                            <p className='text-xs font-bold text-muted-foreground mt-2 px-10 leading-relaxed opacity-60'>Node synchronization successful. Attendance recorded for cohort {selectedGrade}.</p>
                        </div>
                        <Button 
                            onClick={() => setMode('none')} 
                            className="bg-emerald-500 hover:bg-emerald-600 rounded-2xl w-full py-8 font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20"
                        >
                            Return to Interface
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default SmartAttendance

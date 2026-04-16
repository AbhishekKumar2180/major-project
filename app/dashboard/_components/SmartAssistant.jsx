"use client"
import React, { useState, useEffect, useRef } from 'react'
import { MessageSquare, Mic, Send, X, Bot, User, Sparkles, Volume2, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import GlobalApi from '@/app/_services/GlobalApi'

function SmartAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [stats, setStats] = useState(null);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I am your AI Attendance Assistant. How can I help you today?' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        GlobalApi.GetSummaryStats().then(resp => {
            setStats(resp.data);
        }).catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Handle AI Logic (Now using DB Stats)
    const handleSend = async (text) => {
        if (!text.trim()) return;
        
        const userMsg = { role: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Simulated AI Logic with real data injection
        setTimeout(() => {
            let botResponse = "I'm sorry, I didn't quite catch that. Could you rephrase?";
            const lowerText = text.toLowerCase();

            if (lowerText.includes('attendance')) {
                botResponse = stats 
                    ? `The institutional attendance average is currently ${stats.averageAttendance}%. We are monitoring ${stats.totalStudents} total students.`
                    : "I'm currently accessing the attendance records. One moment...";
            } else if (lowerText.includes('risk')) {
                botResponse = stats 
                    ? `We have identified approximately ${stats.atRiskCount} students currently below the safe attendance threshold.`
                    : "Analyzing risk factors now...";
            } else if (lowerText.includes('faculty') || lowerText.includes('teacher')) {
                botResponse = stats 
                    ? `There are ${stats.totalFaculty} faculty members currently registered in the school directory.`
                    : "Checking the staff directory...";
            } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
                botResponse = "Hi! I am synced with your live database. You can ask me about attendance averages, students at risk, or faculty counts!";
            }

            setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
            setIsTyping(false);
        }, 1000);
    };

    // Voice Command Implementation
    const toggleVoice = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Speech Recognition is not supported in this browser.");
            return;
        }

        if (isListening) {
             setIsListening(false);
             return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            handleSend(transcript);
        };
        recognition.onend = () => setIsListening(false);
        recognition.start();
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <div className='fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3'>
                <AnimatePresence>
                    {!isOpen && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={() => setIsOpen(true)}
                            className='w-16 h-16 bg-primary rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all'
                        >
                            <div className='relative'>
                                <MessageSquare size={28} />
                                <span className='absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-primary animate-pulse' />
                            </div>
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Main Chat Interface */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            className='w-[400px] h-[580px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden max-w-[90vw]'
                        >
                            {/* Header */}
                            <div className='bg-primary p-6 text-white flex justify-between items-center relative overflow-hidden'>
                                <div className='flex items-center gap-3 relative z-10'>
                                    <div className='p-2.5 bg-white/20 rounded-xl backdrop-blur-md'>
                                        <Bot size={24} />
                                    </div>
                                    <div>
                                        <h3 className='font-bold tracking-tight'>Smart助理</h3>
                                        <div className='flex items-center gap-1.5'>
                                            <span className='w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse' />
                                            <span className='text-[10px] uppercase font-black tracking-widest opacity-80'>AI Always Online</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className='p-2 hover:bg-white/20 rounded-xl transition-colors relative z-10'>
                                    <X size={20} />
                                </button>
                                {/* Decorative circle */}
                                <div className='absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full' />
                            </div>

                            {/* Messages Area */}
                            <div className='flex-1 overflow-y-auto p-6 space-y-6' ref={scrollRef}>
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: msg.role === 'bot' ? -10 : 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        <div className={`p-2.5 rounded-xl ${msg.role === 'bot' ? 'bg-slate-100 text-slate-700' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
                                            {msg.role === 'bot' ? <Bot size={18} /> : <User size={18} />}
                                        </div>
                                        <div className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                            msg.role === 'bot' ? 'bg-slate-50 border border-slate-100 rounded-tl-none text-slate-700' : 'bg-primary/5 border border-primary/10 rounded-tr-none text-slate-800'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <div className='flex items-center gap-3'>
                                        <div className='p-2.5 rounded-xl bg-slate-100 text-slate-400'>
                                            <Bot size={18} />
                                        </div>
                                        <div className='bg-slate-50 p-4 rounded-2xl rounded-tl-none flex gap-1.5'>
                                            <span className='w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce' />
                                            <span className='w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-100' />
                                            <span className='w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-200' />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className='p-6 bg-slate-50 border-t border-slate-100'>
                                <div className='relative flex items-center bg-white rounded-2xl border border-slate-200 p-1.5 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all'>
                                    <button 
                                        onClick={toggleVoice}
                                        className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-primary hover:bg-slate-50'}`}
                                    >
                                        <Mic size={20} />
                                    </button>
                                    <input 
                                        type='text' 
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
                                        placeholder='Ask anything...'
                                        className='flex-1 outline-none bg-transparent px-3 text-sm placeholder:text-slate-400'
                                    />
                                    <button 
                                        onClick={() => handleSend(inputText)}
                                        className='p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all'
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                                <div className='flex justify-between items-center mt-4 px-1'>
                                    <p className='text-[10px] font-bold text-slate-400 flex items-center gap-1'>
                                        <Sparkles size={10} className='text-primary' /> Powered by AI 助理
                                    </p>
                                    {isListening && <span className='text-[9px] font-black uppercase text-red-500 tracking-widest'>Listening...</span>}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}

export default SmartAssistant

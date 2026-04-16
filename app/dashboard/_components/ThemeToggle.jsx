"use client"
import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-10 h-10" />;
    }

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="relative rounded-xl w-10 h-10 transition-colors hover:bg-primary/5 active:scale-90"
            >
                <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${theme === 'dark' ? 'scale-0 rotate-90' : 'scale-100 rotate-0'} text-amber-500`} />
                <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${theme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'} text-indigo-400`} />
                <span className="sr-only">Toggle theme</span>
            </Button>
        </motion.div>
    )
}

export default ThemeToggle

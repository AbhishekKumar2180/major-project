"use client"
import { Search } from 'lucide-react'
import Image from 'next/image';
import React, { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle';
import NotificationDropdown from './NotificationDropdown';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

function Header() {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Mock user for "Works Completely" demo mode if not authenticated
  const displayUser = isAuthenticated ? user : {
    given_name: 'Admin',
    family_name: 'User',
    picture: 'https://ui-avatars.com/api/?name=Admin+User&background=4c8cf8&color=fff',
    email: 'admin@school.edu'
  };

  if (!mounted) return null;

  return (
    <div className='p-5 px-10 flex justify-between items-center glass-morphism sticky top-0 z-50 border-b border-border shadow-sm'>
        <div className='flex gap-3 p-2.5 px-5 border rounded-2xl bg-card/40 backdrop-blur-md items-center border-border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all w-96 group'>
            <Search size={18} className='text-muted-foreground group-focus-within:text-primary transition-colors' />
            <input 
              type='text' 
              placeholder='Search analytics, students...' 
              className='outline-none bg-transparent w-full text-sm font-medium text-foreground placeholder:text-muted-foreground/60' 
            />
        </div>
        
        <div className='flex gap-6 items-center'>
          <ThemeToggle />
          
          <NotificationDropdown userId={displayUser?.id || 'demo-admin'} />
          
          <div className='flex items-center gap-3 pl-6 border-l border-border/50'>
             <div className='text-right hidden md:block'>
                <p className='text-[10px] font-black uppercase text-muted-foreground leading-none mb-1.5 tracking-widest'>Institutional Node</p>
                <p className='text-xs font-black text-foreground leading-none'>
                  {displayUser?.given_name} {displayUser?.family_name}
                </p>
             </div>
             <div className='relative group'>
                <div className='absolute -inset-1.5 bg-gradient-to-tr from-primary to-purple-500 rounded-full blur opacity-0 group-hover:opacity-20 transition duration-500' />
                <Image 
                    src={displayUser?.picture} 
                    width={42} 
                    height={42}
                    alt='user'
                    className='relative rounded-full ring-2 ring-primary/20 transition-all group-hover:ring-primary/50 cursor-pointer shadow-lg p-0.5 bg-background'
                />
             </div>
          </div>
        </div>
    </div>
  )
}

export default Header
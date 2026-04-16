"use client"
import { GraduationCap, Hand, LayoutIcon, Settings, Calendar, Bell, ClipboardList, LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function SideNav() {
  const [role, setRole] = useState('admin'); // 'admin', 'teacher', 'student'

  // Mock User Data based on roles
  const mockUsers = {
    admin: {
      name: 'System Admin',
      email: 'admin@school.edu',
      picture: 'https://ui-avatars.com/api/?name=Admin+User&background=4f46e5&color=fff'
    },
    teacher: {
      name: 'Dr. John Smith',
      email: 'math.teacher@school.edu',
      picture: 'https://ui-avatars.com/api/?name=John+Smith&background=10b981&color=fff'
    },
    student: {
      name: 'Emily Davis',
      email: 'emily@school.edu',
      picture: 'https://ui-avatars.com/api/?name=Emily+Davis&background=f59e0b&color=fff'
    }
  };

  const currentMenu = {
    admin: [
      { id: 1, name: 'Overview', icon: LayoutIcon, path: '/dashboard' },
      { id: 2, name: 'Students', icon: GraduationCap, path: '/dashboard/students' },
      { id: 3, name: 'Faculty', icon: ClipboardList, path: '/dashboard/faculty' },
      { id: 4, name: 'Attendance', icon: Hand, path: '/dashboard/attendance' },
      { id: 5, name: 'Settings', icon: Settings, path: '/dashboard/settings' },
    ],
    teacher: [
      { id: 1, name: 'Class Analytics', icon: LayoutIcon, path: '/dashboard' },
      { id: 2, name: 'My Students', icon: GraduationCap, path: '/dashboard/students' },
      { id: 3, name: 'Timetable', icon: Calendar, path: '/dashboard/timetable' },
      { id: 4, name: 'Mark Attendance', icon: Hand, path: '/dashboard/attendance' },
      { id: 5, name: 'Settings', icon: Settings, path: '/dashboard/settings' },
    ],
    student: [
      { id: 1, name: 'My Stats', icon: LayoutIcon, path: '/dashboard' },
      { id: 2, name: 'My Timetable', icon: Calendar, path: '/dashboard/timetable' },
      { id: 3, name: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
      { id: 4, name: 'Leave Requests', icon: Hand, path: '/dashboard/leaves' },
      { id: 5, name: 'Settings', icon: Settings, path: '/dashboard/settings' },
    ]
  };

  const path = usePathname();
  const user = mockUsers[role];

  return (
    <div className='glass-morphism h-screen p-6 shadow-2xl transition-all duration-300 flex flex-col justify-between'>
      <div>
        <div className='flex items-center gap-2 mb-8'>
          <Image src={'/logo.svg'} width={180} height={50} alt='logo' className='drop-shadow-sm' />
        </div>

        {/* Role Switcher (For Demo purposes) */}
        <div className='mb-6 p-2 bg-slate-100/50 rounded-xl flex gap-1 border border-slate-200'>
          {['admin', 'teacher', 'student'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 text-[10px] font-bold uppercase py-1.5 rounded-lg transition-all ${role === r ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className='space-y-2'>
          {currentMenu[role].map((menu) => (
            <Link key={menu.id} href={menu.path}>
              <h2 className={`flex items-center gap-4 text-sm font-medium p-3.5
              transition-all duration-200 ease-in-out
              hover:translate-x-1
              cursor-pointer
              rounded-xl
              my-1
              ${path == menu.path
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'}
              `}>
                <menu.icon size={20} />
                {menu.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>

      <div className='flex gap-4 items-center p-4 glass-morphism rounded-2xl border border-border/50 shadow-sm'>
        <Image src={user.picture} width={40} height={40} alt='user' className='rounded-full border-2 border-primary/20 p-0.5' />
        <div className='overflow-hidden uppercase flex-1'>
          <h2 className='text-xs font-black text-foreground truncate leading-tight'>{user.name}</h2>
          <h2 className='text-[10px] text-muted-foreground truncate leading-tight'>{role}</h2>
        </div>
        <LogOut size={18} className='text-muted-foreground hover:text-red-500 cursor-pointer transition-colors' />
      </div>
    </div>
  )
}

export default SideNav
import React from 'react'

function Card({icon,title,value}) {
  return (
    <div className='flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300'>
        <div className='p-3.5 rounded-2xl bg-primary/10 text-primary border border-primary/5'>
            {React.cloneElement(icon, { size: 28 })}
        </div>
        <div>
            <h2 className='text-sm font-semibold text-slate-500 uppercase tracking-wider'>{title}</h2>
            <h2 className='text-3xl font-black text-slate-800 mt-1'>{value}</h2>
        </div>
    </div>
  )
}

export default Card
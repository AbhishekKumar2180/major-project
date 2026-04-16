import React from 'react'
import SideNav from './_components/SideNav'
import Header from './_components/Header'
import SmartAssistant from './_components/SmartAssistant'

function layout({children}) {
  return (
    <div>
      <div className='md:w-64 fixed hidden md:block z-50'>
        <SideNav/>
      </div>
      <div className='md:ml-64'>
        <Header/>
        <div className='min-h-screen'>
          {children}
        </div>
      </div>
      <SmartAssistant />
     </div>
  )
}

export default layout
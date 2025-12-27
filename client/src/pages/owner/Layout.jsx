import React from 'react'
import Sidebar from '../../components/owner/Sidebar'
import NavbarOwner from '../../components/owner/NavbarOwner'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="">
        <NavbarOwner />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="">
          <Sidebar />
        </div>
        
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
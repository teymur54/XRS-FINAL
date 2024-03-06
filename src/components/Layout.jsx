import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const Layout = () => {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar component */}
      <Sidebar />
      {/* Rest of the content. Because of max-height: 100vh; on "body" element, on overflow sidebar stays on its place */}
      {/* overflow-auto */}
      <main className="relative flex h-full flex-grow overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
export default Layout

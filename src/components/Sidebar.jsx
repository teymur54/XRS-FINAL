import toast from 'react-hot-toast'
import { NavLink, useNavigate } from 'react-router-dom'
import { LogoutIcon } from '../assets/HeroIcons'
import { useAuth } from '../context/AuthContext'
import { MessageIcon } from '../assets/HeroIcons'
import { useState } from 'react'
import { ArrowLeft } from '../assets/HeroIcons'
import LogoutPage from './LogoutPage'

const Sidebar = () => {
  const { logout, auth } = useAuth()
  const [showMenu, setShowMenu] = useState(true)
  const navigate = useNavigate()
  const [logoutOpen, setLogoutOpen] = useState(false)

  return (
    <>
      <div className="z-1 flex h-screen flex-col border-r-4 border-purple-950 bg-gradient-to-r from-darkblue-900 to-darkblue-100">
        <div className={` ${showMenu ? 'w-40' : 'w-16 '} relative h-screen px-3 pt-4 duration-300`}>
          <img
            src={`data:image/svg+xml,${encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>`
            )}`}
            className={`absolute -right-4 bottom-11 w-7 cursor-pointer rounded-full border-2 border-purple-950
           bg-white ${!showMenu && 'rotate-180'} z-10`}
            alt="Arrow Left"
            onClick={() => setShowMenu(!showMenu)}
          />
          <div className="flex items-center gap-x-4">
            <img src="../public/mia-logo.png" className={`w-10`} />
            <h1
              className={`origin-left text-xl font-medium text-white duration-200 ${!showMenu && 'scale-0'}`}
            >
              XRŞ
            </h1>
          </div>
          <nav>
            <NavLink
              end
              to="/letters"
              className={({ isActive }) => (isActive ? 'active-nav-element' : `nav-element`)}
            >
              <div className="flex items-center gap-1 pl-0.5">
                <MessageIcon />
                <span className={`${!showMenu && 'scale-0'}`}>Məktublar</span>
              </div>
            </NavLink>
            <NavLink
              end
              to="/letter"
              className={({ isActive }) => (isActive ? 'active-nav-element' : `nav-element`)}
            >
              <div className="flex items-center gap-1 pl-0.5">
                <MessageIcon />
                <span className={`${!showMenu && 'scale-0'}`}>Paketlər</span>
              </div>
            </NavLink>
          </nav>
          <button
            onClick={() => setLogoutOpen(true)}
            className="absolute -right-4 bottom-2 z-10 w-7 cursor-pointer rounded-full border-2 border-red-950 bg-white text-red-950"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
      <LogoutPage logoutOpen={logoutOpen} onLogoutClose={() => setLogoutOpen(false)} logout={logout} />
    </>
  )
}
export default Sidebar

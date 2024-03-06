import React from 'react'
import { useNavigate } from 'react-router-dom'
import { DeleteXIcon, LogoutIcon } from '../assets/HeroIcons'

const LogoutPage = ({ logoutOpen, onLogoutClose, logout }) => {
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.stopPropagation()
    logout()
    navigate('/login')
    onLogoutClose()
  }

  return (
    <div
      onClick={onLogoutClose}
      className={`
    fixed inset-0 z-10 flex items-center justify-center transition-colors
    ${logoutOpen ? 'visible bg-black/90' : 'invisible'}
    `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`rounded-xl border-2 border-oceanblue bg-darkblue-900 px-6 pb-3 pt-9 shadow transition-all duration-300 ${
          logoutOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        <div className="text-center text-xl font-bold text-white">Çıxış etmək istəyirsiniz?</div>
        <button
          onClick={onLogoutClose}
          className="absolute right-1 top-1 rounded-md px-2 py-1 text-white hover:bg-red-500"
        >
          <DeleteXIcon />
        </button>
        <form className="flex flex-col items-center gap-2" onSubmit={handleSubmit}>
          <button
            type="submit"
            className="btn-red custom-box-shadow mt-3 rounded-md border-oceanblue px-5 py-1 hover:bg-red-600"
          >
            <LogoutIcon />
          </button>
        </form>
      </div>
    </div>
  )
}

export default LogoutPage

import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { signIn } from '../api/axiosApi'
import Loading from '../components/Loading/Loading'
import { useAuth } from '../context/AuthContext'
import { ClosedEyeIcon, EyeIcon, LoginIcon } from '../assets/HeroIcons'
import EyeBalls from './EyeBalls'
import AnimCursor from './AnimCursor'

const LoginPage = () => {
  // Global variables
  const { auth, login, isVerifying } = useAuth()

  // Form data variables
  const loginRef = useRef(null)
  const passwordRef = useRef(null)
  const [showPassword, setShowPassword] = useState(false)

  // React router variables
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  // Mutation for login function
  const signInMutation = useMutation({
    mutationFn: ({ username, password }) => signIn({ username, password }),
    onSuccess: (data) => {
      login(data)
      // navigate(from, { replace: true })
      navigate('/letters', { replace: true })
      toast.success('İstifadəçi daxil oldu')
    },
    onError: (error) => {
      if (!error?.response) toast.error('Server cavab vermir')
      else if (error?.response?.status === 400) toast.error('İstifadəçi adı və ya şifrə daxil olunmayıb')
      else if (error?.response?.status === 401) toast.error('Yalnış istifadəçi adı və ya şifrə')
      else toast.error('Error, səhifəni yeniləyin')
    },
  })

  // Form submit handle function
  const handleSubmit = async (e) => {
    e.preventDefault()
    signInMutation.mutate({ username: loginRef.current.value, password: passwordRef.current.value })
  }

  return (
    <>
      {/* <AnimCursor /> */}
      {/* If jwt inside AuthContext is in verification process display loading screen */}
      {isVerifying && <Loading />}
      {/* If jwt verification is over and user is authenticated navigate to home page */}
      {!isVerifying && auth?.isAuth && <Navigate to="/letters" />}
      {/* If jwt verification is over and user is not authenticated display login page */}
      {!isVerifying && !auth?.isAuth && (
        <div className="custom-cursor relative flex h-full w-full items-center justify-center">
          <EyeBalls />
          <form
            className="login-box-shadow flex w-96 flex-col rounded-2xl border-2 border-purple-950 bg-darkblue-300 p-6 text-white"
            onSubmit={handleSubmit}
          >
            <h2 className="mb-8 self-center text-2xl font-bold ">Xüsusi Rabitə Şöbəsi</h2>
            <label className="text-md mb-1 " htmlFor="login">
              İstifadəçi adı
            </label>
            <input
              required
              autoComplete="off"
              ref={loginRef}
              className="text-md placeholder:text-md custom-box-shadow rounded-md border-2 border-purple-950 bg-white p-2 text-black"
              id="login"
              type="text"
              placeholder="Login"
            />
            <label className="text-md mb-1 mt-3" htmlFor="password">
              Şifrə
            </label>
            <div className="relative w-full">
              <input
                required
                ref={passwordRef}
                className="text-md placeholder:text-md custom-box-shadow w-full rounded-md border-2 border-purple-950 bg-white p-2 text-black"
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
              />
              <span
                className="absolute right-[3%] top-1/2 translate-y-[-50%] text-purple-950"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <ClosedEyeIcon /> : <EyeIcon />}
              </span>
            </div>
            <button
              disabled={signInMutation.isPending}
              className="btn mt-5 w-full self-center border-2 border-purple-950 bg-red-700 py-2 text-white transition-all duration-300 hover:bg-red-800"
              type="submit"
            >
              {signInMutation.isPending ? 'Loading...' : <LoginIcon />}
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default LoginPage

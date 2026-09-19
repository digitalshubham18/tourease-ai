import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchMe } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

export default function GoogleAuthSuccess() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const token = params.get('token')
    if (token) {
      localStorage.setItem('token', token)
      dispatch(fetchMe()).then(() => {
        toast.success('Logged in with Google!')
        navigate('/dashboard')
      })
    } else {
      navigate('/login?error=google_failed')
    }
  }, [])

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Completing Google login...</p>
      </div>
    </div>
  )
}

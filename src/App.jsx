import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Explore from './pages/Explore'
import AddSkill from './pages/AddSkill'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
          <Routes>
            {/* Public auth routes — no navbar */}
            <Route path="/login"  element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* App shell — all pages freely browsable */}
            <Route path="/*" element={
              <>
                <Navbar />
                <main className="w-full">
                  <Routes>
                    <Route path="/"          element={<Home />} />
                    <Route path="/explore"   element={<Explore />} />
                    <Route path="/profile"   element={<Profile />} />
                    {/* Only adding a skill requires login */}
                    <Route path="/add-skill" element={<ProtectedRoute><AddSkill /></ProtectedRoute>} />
                  </Routes>
                </main>
              </>
            } />
          </Routes>

          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'dark:bg-gray-800 dark:text-white',
              style: { borderRadius: '12px', fontFamily: 'Poppins, sans-serif' },
            }}
          />
        </div>
      </AppProvider>
    </AuthProvider>
  )
}

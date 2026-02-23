import { useAuth } from '../contexts/AuthContext'; 
 
export function Login() { 
  const { signInWithGoogle, loading } = useAuth(); 
 
  return ( 
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center p-4"> 
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 max-w-md w-full"> 
        <h1 className="text-3xl font-light text-white mb-2 text-center">AUY Student Portal</h1> 
        <p className="text-white/70 text-center mb-8">Sign in with your university email</p> 
 
        <button 
          onClick={signInWithGoogle} 
          disabled={loading} 
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/90 text-gray-800 font-medium py-3 px-4 rounded-xl" 
        > 
          {loading ? 'Loading...' : 'Sign in with Google'} 
        </button> 
      </div> 
    </div> 
  ); 
} 

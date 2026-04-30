import { motion } from 'motion/react';
import { LogIn, Award, BadgeCheck, Shield, ChevronRight, Globe, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface LandingViewProps {
  onLogin: () => void;
  isLoading: boolean;
}

export default function LandingView({ onLogin, isLoading }: LandingViewProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0c] selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Layered Radial Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[150px]" />
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-600/5 blur-[100px]" />
        
        {/* Animated Mesh Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Floating Shapes */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[20%] w-32 h-32 border border-white/5 rounded-full backdrop-blur-sm"
        />
        <motion.div 
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-40 left-[15%] w-48 h-48 border border-white/5 rounded-[2rem] backdrop-blur-[2px]"
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Branding & Micro-interactions */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden lg:block space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium tracking-wide uppercase">
              <Zap className="w-3 h-3 fill-current" />
              <span>Version 2.0 • 2026 Edition</span>
            </div>
            
            <h2 className="text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Sertifikat <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Digital Outhouse
              </span>
            </h2>
            
            <div className="space-y-2">
              <p className="text-xl font-bold text-white tracking-wide">
                “Core of Smart Digital Systems”
              </p>
              <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                “Satu Platform, Semua Terkelola”<br />
                “Solusi Data Terintegrasi & Real-Time”
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: Shield, label: "Aman & Terenkripsi", desc: "Keamanan data tingkat enterprise" },
                { icon: Globe, label: "Validasi QR", desc: "Verifikasi instan via scan" },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200">{item.label}</h4>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Login Card (Glassmorphism) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="relative group">
              {/* Card Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              
              <div className="relative bg-[#16161a]/80 backdrop-blur-2xl border border-white/10 p-10 lg:p-12 rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center">
                
                <div className="space-y-3 mb-10">
                  <h1 className="text-4xl font-black text-white tracking-tight leading-tight uppercase">
                    Diklit Sistem Informasi
                  </h1>
                  <p className="text-slate-400 text-sm font-medium">
                    Masuk dengan akun Google organisasi Anda untuk melanjutkan
                  </p>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onLogin}
                  disabled={isLoading}
                  className={cn(
                    "group relative w-full flex items-center justify-center gap-4 px-8 py-4 bg-white text-black rounded-2xl font-bold text-sm tracking-tight transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  )}
                >
                  {/* Subtle Shimmer Effect on Button */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  
                  {isLoading ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      {/* Using a placeholder for Google G icon since we only have Lucide */}
                      <div className="w-5 h-5 flex items-center justify-center">
                        <LogIn className="w-5 h-5" />
                      </div>
                      <span>Masuk dengan Google</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </div>
                  )}
                </motion.button>

                <div className="mt-8 flex items-center justify-center gap-6">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[#16161a] bg-slate-800 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 opacity-50" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    Trusted by 200+ Institutions
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 w-full px-6 flex flex-col md:row items-center justify-between gap-4 text-slate-600">
        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
          © 2026 Diklit Sistem Informasi • RSUD dr.H.Jusuf.SK Tarakan Kalimantan Utara
        </p>
      </footer>
    </div>
  );
}

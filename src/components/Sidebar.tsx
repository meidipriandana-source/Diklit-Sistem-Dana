import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';
import AnimatedLogo from './AnimatedLogo';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <div 
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors duration-200 group",
      active 
        ? "bg-white/15 text-white rounded-lg mx-3 shadow-sm border border-white/10" 
        : "text-white/60 hover:text-white hover:bg-white/5"
    )}
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  themeColor: string;
  bgImage?: string | null;
  onLogout?: () => void;
  user?: any;
  selectedEmployee?: any;
}

export default function Sidebar({ activeTab, onTabChange, themeColor, bgImage, onLogout, user, selectedEmployee }: SidebarProps) {
  return (
    <div className={cn(
      "w-64 h-screen flex flex-col text-white fixed left-0 top-0 z-50 transition-all duration-500 shadow-xl border-r border-black/5 overflow-hidden",
      themeColor
    )}>
      {/* Background Image Layer */}
      {bgImage && (
        <>
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none transition-all duration-700 scale-105"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-[1px] pointer-events-none" />
        </>
      )}
      
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col h-full backdrop-blur-[2px]">
        <div className="px-6 py-10 flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-widest uppercase text-white">Diklit</span>
            <span className="text-[10px] font-bold tracking-tight leading-tight text-white/70">Sistem Informasi</span>
          </div>
        </div>

      <nav className="flex-1 flex flex-col gap-1">
        <SidebarItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          active={activeTab === 'dashboard'} 
          onClick={() => onTabChange('dashboard')} 
        />
        <SidebarItem 
          icon={FileText} 
          label="Sertifikat" 
          active={activeTab === 'sertifikat'} 
          onClick={() => onTabChange('sertifikat')} 
        />
        <SidebarItem 
          icon={Users} 
          label="Karyawan" 
          active={activeTab === 'karyawan'} 
          onClick={() => onTabChange('karyawan')} 
        />
        <SidebarItem 
          icon={BarChart3} 
          label="Analitik" 
          active={activeTab === 'analitik'} 
          onClick={() => onTabChange('analitik')} 
        />
        <SidebarItem 
          icon={Settings} 
          label="Pengaturan" 
          active={activeTab === 'pengaturan'} 
          onClick={() => onTabChange('pengaturan')} 
        />

        {/* Selected Employee Section */}
        {selectedEmployee && (
          <div className="mt-6 mx-4 p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Karyawan Terpilih</div>
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => onTabChange('karyawan')}
            >
              <img 
                src={selectedEmployee.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedEmployee.name || 'User')}`} 
                className="w-10 h-10 rounded-xl border border-white/20 object-cover"
                alt={selectedEmployee.name}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate group-hover:text-blue-200 transition-colors">{selectedEmployee.name}</div>
                <div className="text-[10px] text-white/60 truncate uppercase tracking-tighter">{selectedEmployee.role || 'Staf'}</div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="pb-8 flex flex-col gap-1">
        {user && (
          <div className="px-6 py-4 flex items-center gap-3 border-t border-white/10 mb-2">
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}`} 
              className="w-8 h-8 rounded-full border border-white/20"
              alt="Profile"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold truncate">{user.displayName || 'User'}</div>
              <div className="text-[10px] text-white/60 truncate">{user.email}</div>
            </div>
          </div>
        )}
        <SidebarItem icon={LogOut} label="Keluar" onClick={onLogout} />
      </div>
      </div>
    </div>
  );
}

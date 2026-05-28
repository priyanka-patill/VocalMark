import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Activity, Mic, BarChart3, User as UserIcon, LogOut, FileText, Phone, Mail, Camera, Users } from 'lucide-react';

const Layout = ({ user, onLogout }) => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Activity size={32} />
          </div>
          <span>VocalMark</span>
        </div>
        
        <nav className="nav-links">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink 
            to="/diary" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Mic size={20} />
            <span>Voice Diary</span>
          </NavLink>
          <NavLink 
            to="/visual" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Camera size={20} />
            <span>Pill Scanner</span>
          </NavLink>
        </nav>
        
        <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <NavLink 
            to="/family" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            style={{ padding: '0.75rem 1rem' }}
          >
            <Users size={20} />
            <span>Family Alerts</span>
          </NavLink>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div>
            <h1 className="header-title" style={{ fontSize: '2.5rem' }}>VocalMark AI</h1>
            <p className="header-subtitle" style={{ fontSize: '1.2rem' }}>Continuous Vocal Biomarker Monitoring</p>
          </div>
          
          <div style={{ position: 'relative' }}>
            <div 
              className="user-profile" 
              onClick={() => setShowProfile(!showProfile)}
              style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            >
              <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
              </div>
              <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                {user?.name || "Patient #842"}
              </span>
            </div>

            {showProfile && (
              <div className="glass-card" style={{ 
                position: 'absolute', top: '120%', right: '0', width: '320px', 
                padding: '1.5rem', zIndex: 50, display: 'flex', flexDirection: 'column', gap: '1rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Patient Profile</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <UserIcon size={18} style={{ color: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full Name</div>
                    <div style={{ fontWeight: 500 }}>{user?.name || "N/A"}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileText size={18} style={{ color: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Age</div>
                    <div style={{ fontWeight: 500 }}>{user?.age || "N/A"}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Phone size={18} style={{ color: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Contact Number</div>
                    <div style={{ fontWeight: 500 }}>{user?.contact || "N/A"}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail size={18} style={{ color: 'var(--primary)' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email</div>
                    <div style={{ fontWeight: 500, wordBreak: 'break-all' }}>{user?.email || "N/A"}</div>
                  </div>
                </div>

                <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <button 
                    className="btn btn-outline" 
                    style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--accent)', color: 'var(--accent)' }}
                    onClick={onLogout}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <section className="page-content" style={{ minHeight: 'calc(100vh - 120px)' }}>
          <Outlet context={{ user }} />
        </section>
      </main>
    </div>
  );
};

export default Layout;

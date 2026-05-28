import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, AlertCircle, User, Calendar, Phone, CheckCircle2, Brain, Heart, Wind } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    contact: '',
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, age, contact, email, password } = formData;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    
    if (!isLoginMode) {
      if (!name || !age || !contact) {
        setError("All fields are required to register your medical profile.");
        return false;
      }
      if (isNaN(age) || parseInt(age) <= 0) {
        setError("Please enter a valid age.");
        return false;
      }
    }
    
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isLoginMode) {
        const response = await fetch('http://localhost:8000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Login failed');
        onLogin(data.user);
        navigate('/dashboard');
      } else {
        const response = await fetch('http://localhost:8000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Registration failed');
        onLogin(data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: 'var(--bg-main)' }}>
      
      {/* LEFT SIDE: Premium Hero Section to fill empty space */}
      <div 
        className="login-hero" 
        style={{ 
          flex: '1.2', 
          background: 'linear-gradient(135deg, var(--primary) 0%, #1e1b4b 100%)', 
          color: 'white', 
          padding: '4rem 6rem', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative Glass Blobs */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '40vw', height: '40vw', background: 'rgba(99, 102, 241, 0.3)', borderRadius: '50%', filter: 'blur(80px)' }}></div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
              <Activity size={48} />
            </div>
            <span style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>VocalMark</span>
          </div>

          <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1px' }}>
            AI-Powered Voice<br/>Biomarker Analysis
          </h1>
          
          <p style={{ fontSize: '1.5rem', opacity: 0.9, marginBottom: '3.5rem', lineHeight: 1.6 }}>
            We track microscopic changes in your vocal patterns to provide continuous health monitoring between scheduled clinical visits.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '14px' }}><Brain size={32} color="#a5b4fc" /></div>
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Neurological Disorders</h3>
                <p style={{ opacity: 0.7, fontSize: '1.15rem' }}>Early detection of Parkinson's and post-stroke tremors.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '14px' }}><Wind size={32} color="#86efac" /></div>
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Respiratory Conditions</h3>
                <p style={{ opacity: 0.7, fontSize: '1.15rem' }}>Continuous tracking of asthma and breathlessness.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '14px' }}><Heart size={32} color="#fca5a5" /></div>
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Cardiovascular Health</h3>
                <p style={{ opacity: 0.7, fontSize: '1.15rem' }}>Monitoring vocal strains related to cardiovascular distress.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: The Login Form */}
      <div 
        style={{ 
          flex: '1', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '2rem',
          position: 'relative'
        }}
      >
        <div className="glass-card login-card" style={{ width: '100%', maxWidth: isLoginMode ? '580px' : '750px', transition: 'max-width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3.2rem', marginBottom: '0.75rem' }}>
              {isLoginMode ? "Welcome Back" : "Patient Registration"}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.35rem' }}>
              {isLoginMode ? "Sign in to access your dashboard" : "Register your medical profile"}
            </p>
          </div>

          {error && (
            <div className="login-error" style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className={isLoginMode ? '' : 'form-grid'} style={{ display: isLoginMode ? 'flex' : 'grid', flexDirection: 'column', gap: '1.5rem', gridTemplateColumns: isLoginMode ? '1fr' : '1fr 1fr' }}>
              
              {!isLoginMode && (
                <>
                  <div className="input-group">
                    <label>Full Name</label>
                    <div className="input-wrapper">
                      <User size={20} className="input-icon" />
                      <input 
                        type="text" 
                        name="name"
                        placeholder="John Doe" 
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Age</label>
                    <div className="input-wrapper">
                      <Calendar size={20} className="input-icon" />
                      <input 
                        type="number"
                        name="age" 
                        placeholder="35" 
                        value={formData.age}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Contact Number</label>
                    <div className="input-wrapper">
                      <Phone size={20} className="input-icon" />
                      <input 
                        type="tel"
                        name="contact" 
                        placeholder="+1 (555) 000-0000" 
                        value={formData.contact}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail size={20} className="input-icon" />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="patient@example.com" 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock size={20} className="input-icon" />
                  <input 
                    type="password"
                    name="password" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary login-btn" style={{ marginTop: '2rem' }}>
              {isLoginMode ? "Sign In" : "Create Profile & Sign In"}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', fontSize: '1.25rem' }}>
            <div style={{ width: '100%', height: '1px', background: 'var(--border)', margin: '1rem 0' }}></div>
            {isLoginMode ? (
              <p style={{ color: 'var(--text-muted)' }}>
                New to VocalMark AI? <span onClick={toggleMode} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Create Account</span>
              </p>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>
                Already registered? <span onClick={toggleMode} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Sign In</span>
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Specific CSS overrides for this component to ensure perfect split layout rendering on small screens */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 900px) {
          .login-hero { display: none !important; }
        }
      `}} />
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Phone, User, Heart, ShieldAlert, Trash2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const FamilyContacts = () => {
  const { user } = useOutletContext();
  const [contacts, setContacts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', relationship: '', contact: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertStatus, setAlertStatus] = useState('');
  const [inactivityTimer, setInactivityTimer] = useState(20);

  useEffect(() => {
    fetchContacts();
  }, [user]);

  // Automated Inactivity Tracker (True Automatic Feature)
  useEffect(() => {
    let timerId;
    const resetTimer = () => setInactivityTimer(20);

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    timerId = setInterval(() => {
      setInactivityTimer((prev) => {
        if (prev <= 1) {
          // Time is up. AUTOMATICALLY trigger the backend SMS script.
          triggerEmergencyDispatch(true);
          return 20; // reset for next cycle
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [user]);

  const fetchContacts = async () => {
    try {
      const res = await fetch(`https://vocalmark-backend.onrender.com/api/family/${user?.email || 'guest'}`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data.family || []);
      }
    } catch (err) {
      console.error("Failed to fetch family contacts", err);
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('https://vocalmark-backend.onrender.com/api/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: user?.email || 'guest',
          ...formData
        })
      });
      if (res.ok) {
        setShowAddForm(false);
        setFormData({ name: '', relationship: '', contact: '' });
        fetchContacts();
      } else {
        console.error("HTTP Error:", res.status);
      }
    } catch (err) {
      console.error("Failed to add contact", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerEmergencyDispatch = async (isAuto = false) => {
    try {
      setAlertStatus('dispatching');
      const fd = new FormData();
      fd.append('email', user?.email || 'guest');
      fd.append('reason', isAuto ? 'Automated Inactivity Alert (Patient Unresponsive for 20s)' : 'Manual Emergency Override');

      const res = await fetch('https://vocalmark-backend.onrender.com/api/alert', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (data.status === 'success') {
        setTimeout(() => setAlertStatus('sent'), 1000);
      } else {
        setTimeout(() => setAlertStatus('error'), 1000);
      }
      setTimeout(() => setAlertStatus(''), 6000);
    } catch (err) {
      console.error(err);
      setAlertStatus('error');
      setTimeout(() => setAlertStatus(''), 3000);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      const res = await fetch(`https://vocalmark-backend.onrender.com/api/family/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchContacts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      <div className="glass-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Users size={28} color="var(--primary)" /> Emergency & Family Contacts
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Loved ones listed here will receive automatic SMS alerts if your voice biomarkers show unstable conditions or inactivity.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <UserPlus size={20} /> Add Contact
        </button>
      </div>

      {showAddForm && (
        <div className="glass-card fade-in" style={{ padding: '2rem', border: '1px solid var(--primary)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>New Family Member</h3>
          <form onSubmit={handleAddContact} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '1.1rem' }}>Full Name</label>
                <div className="input-wrapper" style={{ position: 'relative' }}>
                  <User size={20} className="input-icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input required type="text" placeholder="John Doe"
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', fontSize: '1.2rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', color: 'var(--text)' }} />
                </div>
              </div>

              <div className="input-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '1.1rem' }}>Relationship</label>
                <div className="input-wrapper" style={{ position: 'relative' }}>
                  <Heart size={20} className="input-icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input required type="text" placeholder="e.g. Daughter"
                    value={formData.relationship} onChange={e => setFormData({ ...formData, relationship: e.target.value })}
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', fontSize: '1.2rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', color: 'var(--text)' }} />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '1.1rem' }}>Phone Number</label>
              <div className="input-wrapper" style={{ position: 'relative' }}>
                <Phone size={20} className="input-icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input required type="tel" placeholder="e.g. 555-1234 (For SMS Alerts)"
                  value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })}
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', fontSize: '1.2rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', color: 'var(--text)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => setShowAddForm(false)} style={{ fontSize: '1.2rem', padding: '0.8rem 1.5rem' }}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ fontSize: '1.2rem', padding: '0.8rem 1.5rem' }}>
                {isSubmitting ? 'Saving...' : 'Save Contact'}
              </button>
            </div>
          </form>
        </div>
      )}

      {contacts.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Users size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
          <h3>No Family Contacts Added</h3>
          <p>You haven't configured any emergency contacts yet. Please add a family member to activate alerts.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {contacts.map((c, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
              <button
                onClick={() => handleDeleteContact(c.id)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%' }}
                title="Remove Contact"
              >
                <Trash2 size={20} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', margin: 0 }}>{c.name}</h4>
                  <span className="badge" style={{ marginTop: '0.25rem', background: '#e0e7ff', color: '#4338ca' }}>{c.relationship}</span>
                </div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text)' }}>
                  <Phone size={16} color="var(--primary)" /> {c.contact}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Automated Emergency Trigger */}
      <div className="glass-card" style={{
        marginTop: '2rem', padding: '2rem', border: '1px solid #ef4444',
        background: inactivityTimer <= 5 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s ease'
      }}>
        <div>
          <h3 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <ShieldAlert size={24} /> Automated Inactivity Monitor
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>Background process monitoring patient vitals and mouse/keyboard activity. If unresponsive, an S.O.S alert is sent automatically.</p>
          <div style={{ marginTop: '1rem', color: inactivityTimer <= 10 ? '#ef4444' : 'var(--text-muted)', fontWeight: inactivityTimer <= 10 ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: inactivityTimer <= 10 ? '#ef4444' : '#10B981', animation: 'pulse 1s infinite' }}></div>
            Time until auto-dispatch: {inactivityTimer} seconds
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <button
            className="btn"
            style={{ background: '#ef4444', color: 'white', padding: '1rem 2rem', fontSize: '1.1rem' }}
            onClick={() => triggerEmergencyDispatch(false)}
            disabled={alertStatus === 'dispatching'}
          >
            {alertStatus === 'dispatching' ? 'Dispatching...' : 'Override & Send Now'}
          </button>

          {alertStatus === 'sent' && <span style={{ color: '#10b981', fontWeight: 600 }}>✅ Alerts dispatched successfully!</span>}
          {alertStatus === 'error' && <span style={{ color: '#ef4444', fontWeight: 600 }}>❌ Add contacts before alerting!</span>}
        </div>
      </div>

    </div>
  );
};

export default FamilyContacts;
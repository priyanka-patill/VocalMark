import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Activity, Wind, Waves, AlertTriangle, CheckCircle2, Trash2, Plus, Battery, MessageSquare } from 'lucide-react';
import { useOutletContext, Link } from 'react-router-dom';

const mockProgressionData = [
  { day: 'Mon', tremor: 12, breathlessness: 15, fatigue: 18, fluency: 90 },
  { day: 'Tue', tremor: 14, breathlessness: 16, fatigue: 20, fluency: 88 },
  { day: 'Wed', tremor: 11, breathlessness: 13, fatigue: 16, fluency: 94 },
  { day: 'Thu', tremor: 16, breathlessness: 18, fatigue: 24, fluency: 85 },
  { day: 'Fri', tremor: 15, breathlessness: 22, fatigue: 30, fluency: 80 },
  { day: 'Sat', tremor: 22, breathlessness: 28, fatigue: 45, fluency: 72 },
  { day: 'Sun', tremor: 18, breathlessness: 24, fatigue: 35, fluency: 78 },
];

const Dashboard = () => {
  const { user } = useOutletContext();
  const [chartData, setChartData] = useState([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    tremor: null,
    breathlessness: null,
    fatigue: null,
    fluency: null,
    status: "Loading..."
  });
  const [prescriptions, setPrescriptions] = useState([]);
  const [showAddRx, setShowAddRx] = useState(false);
  const [newRx, setNewRx] = useState({ name: '', duration: 30 });

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`https://vocalmark-backend.onrender.com/api/dashboard/${user?.email || 'guest'}`);
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      const data = await res.json();

      if (data.history && data.history.length > 0) {
        setChartData(data.history);
        const lastEntry = data.history[data.history.length - 1];
        setCurrentMetrics({
          tremor: lastEntry.tremor,
          breathlessness: lastEntry.breathlessness,
          fatigue: lastEntry.fatigue ?? 20,
          fluency: lastEntry.fluency ?? 85,
          status: lastEntry.status
        });
      } else {
        setChartData([]);
        setCurrentMetrics({
          tremor: null,
          breathlessness: null,
          fatigue: null,
          fluency: null,
          status: "No Logs"
        });
      }

      if (data.prescriptions) {
        setPrescriptions(data.prescriptions);
      }
    } catch (err) {
      console.log("Using local mock data fallback", err);
      setChartData([]);
      setCurrentMetrics({
        tremor: null,
        breathlessness: null,
        fatigue: null,
        fluency: null,
        status: "No Logs"
      });
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  // Automated Patient Condition Monitor (Background Task)
  useEffect(() => {
    if (currentMetrics.status === 'Warning') {
      const fd = new FormData();
      fd.append('email', user?.email || 'guest');
      fd.append('reason', 'Automated Health Plunge Detected');
      fetch('https://vocalmark-backend.onrender.com/api/alert', { method: 'POST', body: fd }).catch(() => { });
    }
  }, [currentMetrics.status, user]);

  const triggerCrisisMode = () => {
    setCurrentMetrics({
      tremor: 26.5,
      breathlessness: 28.2,
      fatigue: 48,
      fluency: 62,
      status: 'Warning'
    });
    setChartData(prev => [...prev, { day: 'Live', tremor: 26.5, breathlessness: 28.2 }]);
  };

  const handleDeleteRx = async (id) => {
    try {
      const res = await fetch(`https://vocalmark-backend.onrender.com/api/prescriptions/${id}`, { method: 'DELETE' });
      if (res.ok) fetchDashboard();
    } catch (err) {
      console.error("Failed to delete Rx", err);
    }
  };

  const handleAddRx = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        user_email: user?.email || 'guest',
        medication_name: newRx.name,
        duration_days: parseInt(newRx.duration) || 30
      };
      const res = await fetch('https://vocalmark-backend.onrender.com/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowAddRx(false);
        setNewRx({ name: '', duration: 30 });
        fetchDashboard();
      }
    } catch (err) {
      console.error("Failed to add Rx", err);
    }
  };

  return (
    <div>
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="glass-card stat-card" style={{ padding: '1.5rem', border: currentMetrics.tremor && currentMetrics.tremor > 18 ? '1px solid rgba(239, 68, 68, 0.3)' : undefined }}>
          <div className="stat-info">
            <div className="label" style={{ fontSize: '1rem', color: currentMetrics.tremor && currentMetrics.tremor > 18 ? '#ef4444' : undefined }}>Tremor Index</div>
            <div className="value" style={{ fontSize: '2.5rem', color: currentMetrics.tremor && currentMetrics.tremor > 18 ? '#ef4444' : undefined }}>{currentMetrics.tremor ?? '--'}</div>
          </div>
          <div className="stat-icon" style={{ width: '56px', height: '56px', background: currentMetrics.tremor && currentMetrics.tremor > 18 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(79, 70, 229, 0.1)', color: currentMetrics.tremor && currentMetrics.tremor > 18 ? '#ef4444' : '#4F46E5' }}>
            <Waves size={28} />
          </div>
        </div>

        <div className="glass-card stat-card" style={{ padding: '1.5rem', border: currentMetrics.breathlessness && currentMetrics.breathlessness > 18 ? '1px solid rgba(245, 158, 11, 0.3)' : undefined }}>
          <div className="stat-info">
            <div className="label" style={{ fontSize: '1rem', color: currentMetrics.breathlessness && currentMetrics.breathlessness > 18 ? '#f59e0b' : undefined }}>Breathlessness</div>
            <div className="value" style={{ fontSize: '2.5rem', color: currentMetrics.breathlessness && currentMetrics.breathlessness > 18 ? '#f59e0b' : undefined }}>{currentMetrics.breathlessness ?? '--'}</div>
          </div>
          <div className="stat-icon" style={{ width: '56px', height: '56px', background: currentMetrics.breathlessness && currentMetrics.breathlessness > 18 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: currentMetrics.breathlessness && currentMetrics.breathlessness > 18 ? '#f59e0b' : '#10B981' }}>
            <Wind size={28} />
          </div>
        </div>

        <div className="glass-card stat-card" style={{ padding: '1.5rem', border: currentMetrics.fatigue && currentMetrics.fatigue > 35 ? '1px solid rgba(239, 68, 68, 0.3)' : undefined }}>
          <div className="stat-info">
            <div className="label" style={{ fontSize: '1rem', color: currentMetrics.fatigue && currentMetrics.fatigue > 35 ? '#ef4444' : undefined }}>Fatigue Factor</div>
            <div className="value" style={{ fontSize: '2.5rem', color: currentMetrics.fatigue && currentMetrics.fatigue > 35 ? '#ef4444' : undefined }}>{currentMetrics.fatigue !== null ? `${currentMetrics.fatigue}%` : '--'}</div>
          </div>
          <div className="stat-icon" style={{ width: '56px', height: '56px', background: currentMetrics.fatigue && currentMetrics.fatigue > 35 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: currentMetrics.fatigue && currentMetrics.fatigue > 35 ? '#ef4444' : '#F59E0B' }}>
            <Battery size={28} />
          </div>
        </div>

        <div className="glass-card stat-card" style={{ padding: '1.5rem', border: currentMetrics.fluency && currentMetrics.fluency < 75 ? '1px solid rgba(245, 158, 11, 0.3)' : undefined }}>
          <div className="stat-info">
            <div className="label" style={{ fontSize: '1rem', color: currentMetrics.fluency && currentMetrics.fluency < 75 ? '#f59e0b' : undefined }}>Speech Fluency</div>
            <div className="value" style={{ fontSize: '2.5rem', color: currentMetrics.fluency && currentMetrics.fluency < 75 ? '#f59e0b' : undefined }}>{currentMetrics.fluency !== null ? `${currentMetrics.fluency}%` : '--'}</div>
          </div>
          <div className="stat-icon" style={{ width: '56px', height: '56px', background: currentMetrics.fluency && currentMetrics.fluency < 75 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(139, 92, 246, 0.1)', color: currentMetrics.fluency && currentMetrics.fluency < 75 ? '#f59e0b' : '#8B5CF6' }}>
            <MessageSquare size={28} />
          </div>
        </div>

        <div className="glass-card stat-card" style={{ padding: '1.5rem' }}>
          <div className="stat-info">
            <div className="label" style={{ fontSize: '1rem' }}>Overall Status</div>
            <div className="value" style={{ color: currentMetrics.status === 'Warning' ? 'var(--accent)' : (currentMetrics.status === 'Stable' ? 'var(--secondary)' : 'var(--text-muted)'), fontSize: '2rem', marginTop: '0.8rem' }}>
              {currentMetrics.status}
            </div>
            {currentMetrics.status === 'Stable' && (
              <button
                onClick={triggerCrisisMode}
                style={{ marginTop: '1rem', background: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Simulate Crisis
              </button>
            )}
          </div>
          <div className={`stat-icon ${currentMetrics.status === 'Warning' ? 'icon-red' : (currentMetrics.status === 'Stable' ? 'icon-green' : 'icon-blue')}`} style={{ width: '56px', height: '56px' }}>
            {currentMetrics.status === 'Warning' ? <Activity size={28} /> : (currentMetrics.status === 'Stable' ? <CheckCircle2 size={28} /> : <Activity size={28} />)}
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="glass-card">
          <div className="chart-header">
            <h3>Vocal Biomarker Progression (7 Days)</h3>
            <span className={`badge ${currentMetrics.status === 'Warning' ? 'badge-warning' : 'badge-normal'}`}>
              {currentMetrics.status === 'Warning' ? 'Review Needed' : 'Stable'}
            </span>
          </div>
          <div style={{ width: '100%', height: 450, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {chartData && chartData.length > 0 ? (
              <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTremor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentMetrics.status === 'Warning' ? '#ef4444' : '#4F46E5'} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={currentMetrics.status === 'Warning' ? '#ef4444' : '#4F46E5'} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorBreath" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentMetrics.status === 'Warning' ? '#f59e0b' : '#10B981'} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={currentMetrics.status === 'Warning' ? '#f59e0b' : '#10B981'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Area type="monotone" dataKey="tremor" stroke={currentMetrics.status === 'Warning' ? '#ef4444' : '#4F46E5'} fillOpacity={1} fill="url(#colorTremor)" />
                  <Area type="monotone" dataKey="breathlessness" stroke={currentMetrics.status === 'Warning' ? '#f59e0b' : '#10B981'} fillOpacity={1} fill="url(#colorBreath)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', gap: '1rem', color: 'var(--text-muted)' }}>
                <Activity size={48} style={{ opacity: 0.5 }} />
                <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>No vocal biomarker data logged yet</span>
                <p style={{ fontSize: '0.9rem', maxWidth: '320px', textAlign: 'center', opacity: 0.8 }}>
                  Complete your first daily voice check-in to begin tracking your biomarker progression.
                </p>
                <Link to="/diary" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.95rem', marginTop: '0.5rem', textDecoration: 'none' }}>
                  Go to Voice Diary
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
            <h3>AI Health Alerts</h3>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(() => {
              if (currentMetrics.tremor === null) {
                return (
                  <div style={{
                    display: 'flex', gap: '1.25rem', padding: '1.5rem',
                    background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    borderRadius: '16px', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', textAlign: 'center', flex: 1
                  }}>
                    <MessageSquare size={32} style={{ color: 'var(--text-muted)', opacity: 0.6 }} />
                    <div>
                      <h4 style={{ fontSize: '1.15rem', marginBottom: '0.25rem', fontWeight: 600 }}>No Alerts Pending</h4>
                      <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Log your daily voice check-in to analyze vital biomarkers for potential clinical flags.</p>
                    </div>
                  </div>
                );
              }
              const alerts = [];
              if (currentMetrics.breathlessness > 20) {
                alerts.push({
                  type: 'danger', icon: <AlertTriangle size={24} />, bg: '#FFE4E6', color: '#F43F5E',
                  title: 'Elevated Breathlessness', desc: `Current level (${currentMetrics.breathlessness}) matches asthmatic profile.`
                });
              } else if (currentMetrics.breathlessness > 12) {
                alerts.push({
                  type: 'warning', icon: <Activity size={24} />, bg: '#FEF3C7', color: '#D97706',
                  title: 'Slight Breathlessness', desc: `Slight elevation (${currentMetrics.breathlessness}) from baseline.`
                });
              } else {
                alerts.push({
                  type: 'success', icon: <Wind size={24} />, bg: '#D1FAE5', color: '#10B981',
                  title: 'Optimal Respiration', desc: 'Breathlessness is well within normal parameters.'
                });
              }

              if (currentMetrics.fatigue > 35) {
                alerts.push({
                  type: 'warning', icon: <Battery size={24} />, bg: '#FEF3C7', color: '#D97706',
                  title: 'Vocal Fatigue Noticed', desc: `High energy dropoff (${currentMetrics.fatigue}%) detected in audio.`
                });
              } else {
                alerts.push({
                  type: 'success', icon: <Battery size={24} />, bg: '#D1FAE5', color: '#10B981',
                  title: 'Energy Levels Optimal', desc: `No significant vocal fatigue detected (${currentMetrics.fatigue}%).`
                });
              }

              if (currentMetrics.fluency < 75) {
                alerts.push({
                  type: 'warning', icon: <MessageSquare size={24} />, bg: '#FEF3C7', color: '#D97706',
                  title: 'Fluency Decrease', desc: `Slurring or pausing detected (Fluency: ${currentMetrics.fluency}%).`
                });
              } else {
                alerts.push({
                  type: 'success', icon: <MessageSquare size={24} />, bg: '#D1FAE5', color: '#10B981',
                  title: 'Speech Fluency Stable', desc: `Speech pacing and cadence are well preserved (${currentMetrics.fluency}%).`
                });
              }

              if (currentMetrics.tremor > 18) {
                alerts.push({
                  type: 'danger', icon: <AlertTriangle size={24} />, bg: '#FFE4E6', color: '#F43F5E',
                  title: 'High Vocal Tremor', desc: `Tremor index is extremely high (${currentMetrics.tremor}).`
                });
              } else if (currentMetrics.tremor > 12) {
                alerts.push({
                  type: 'warning', icon: <Waves size={24} />, bg: '#FEF3C7', color: '#D97706',
                  title: 'Minor Tremor Noticed', desc: `Tremor index (${currentMetrics.tremor}) shows mild instability.`
                });
              } else {
                alerts.push({
                  type: 'success', icon: <CheckCircle2 size={24} />, bg: '#D1FAE5', color: '#10B981',
                  title: 'Pitch Stable', desc: 'No abnormal pitch variation detected today.'
                });
              }

              if (currentMetrics.status === 'Warning') {
                alerts.push({
                  type: 'danger', icon: <AlertTriangle size={24} />, bg: '#FFE4E6', color: '#F43F5E',
                  title: 'Automated SOS Dispatched', desc: 'AI detected severe irregularities. Relatives alerted.'
                });
              } else if (alerts.filter(a => a.type === 'success').length >= 2 && currentMetrics.status === 'Stable') {
                alerts.push({
                  type: 'success', icon: <CheckCircle2 size={24} />, bg: '#D1FAE5', color: '#10B981',
                  title: 'Overall Profile: Excellent', desc: 'All biomarkers are incredibly stable.'
                });
              }

              const w = { danger: 3, warning: 2, success: 1 };
              const sorted = alerts.sort((a, b) => w[b.type] - w[a.type]).slice(0, 4);

              return sorted.map((alert, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '1.25rem', padding: '1.5rem',
                  background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  borderRadius: '16px', alignItems: 'center'
                }}>
                  <div style={{ background: alert.bg, color: alert.color, width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {alert.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', marginBottom: '0.25rem', fontWeight: 600 }}>{alert.title}</h4>
                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{alert.desc}</p>
                  </div>
                </div>
              ));
            })()}

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', justifyContent: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite' }}></div>
              Always-On Diagnostic Monitoring Active
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid" style={{ marginTop: '2rem' }}>
        <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
          <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={24} color="var(--primary)" /> Active Prescriptions
            </h3>
            <button className="btn btn-primary" onClick={() => setShowAddRx(!showAddRx)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              <Plus size={16} /> Add Medication
            </button>
          </div>

          {showAddRx && (
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '1.5rem', marginTop: '1rem' }}>
              <form onSubmit={handleAddRx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Medication Name</label>
                  <input type="text" required placeholder="e.g. Lisinopril (10mg)" value={newRx.name} onChange={e => setNewRx({ ...newRx, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-dark)', color: 'white' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Duration (Days)</label>
                  <input type="number" required min="1" max="180" value={newRx.duration} onChange={e => setNewRx({ ...newRx, duration: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-dark)', color: 'white' }} />
                </div>
                <div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', height: '100%' }}>Save</button>
                </div>
              </form>
            </div>
          )}

          {prescriptions.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No active prescriptions logged.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
              {prescriptions.map(med => {
                const daysLeft = med.durationDays - med.daysElapsed;
                const isEndingSoon = daysLeft <= 5 && daysLeft > 0;
                const isUrgent = daysLeft <= 2;
                const progressPercent = (med.daysElapsed / med.durationDays) * 100;

                const accentColor = isUrgent ? '#ef4444' : (isEndingSoon ? '#f59e0b' : 'var(--primary)');
                const bgColor = isUrgent ? 'rgba(239, 68, 68, 0.1)' : (isEndingSoon ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.02)');
                const borderColor = isUrgent ? 'rgba(239, 68, 68, 0.3)' : (isEndingSoon ? 'rgba(245, 158, 11, 0.3)' : 'var(--border)');

                return (
                  <div key={med.id} style={{ padding: '1.5rem', background: bgColor, borderRadius: '12px', border: `1px solid ${borderColor}`, position: 'relative' }}>
                    <button
                      onClick={() => handleDeleteRx(med.id)}
                      style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%' }}
                      title="Remove Prescription"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingRight: '2rem' }}>
                      <h4 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {med.name}
                        {isEndingSoon && (
                          <span className="badge" style={{ background: isUrgent ? '#fee2e2' : '#fef3c7', color: accentColor }}>
                            Reminder
                          </span>
                        )}
                      </h4>
                      <div style={{ fontWeight: 600, color: isEndingSoon ? accentColor : 'var(--text)' }}>
                        {daysLeft} Days Remaining
                      </div>
                    </div>

                    {isEndingSoon && (
                      <div style={{ color: accentColor, marginBottom: '1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertTriangle size={18} />
                        Your {med.durationDays}-day supply ends in {daysLeft} {daysLeft === 1 ? 'day' : 'days'}! Please contact your doctor for a refill.
                      </div>
                    )}

                    <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${progressPercent}%`, height: '100%', background: accentColor, transition: 'width 1s ease-in-out' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
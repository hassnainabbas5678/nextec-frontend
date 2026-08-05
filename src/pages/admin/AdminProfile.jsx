import { useState } from 'react';
import { toast } from 'react-toastify';
import { authApi } from '../../services/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function AdminProfile() {
  const { admin, setAdmin } = useAuth();
  const [profile, setProfile] = useState({ name: admin?.name || '', email: admin?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const updateProfile = async (event) => { event.preventDefault(); const data = await authApi.updateProfile(profile); setAdmin(data.admin); toast.success('Profile updated.'); };
  const changePassword = async (event) => { event.preventDefault(); await authApi.changePassword(passwords); setPasswords({ currentPassword: '', newPassword: '' }); toast.success('Password changed.'); };

  return (
    <section className="admin-page">
      <h1>Profile Management</h1>
      <div className="admin-grid">
        <form className="premium-card admin-form" onSubmit={updateProfile}><h2>Profile</h2><label>Name<input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label><label>Email<input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></label><button className="btn primary">Save Profile</button></form>
        <form className="premium-card admin-form" onSubmit={changePassword}><h2>Password Change</h2><label>Current Password<input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} /></label><label>New Password<input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} /></label><button className="btn primary">Change Password</button></form>
      </div>
    </section>
  );
}

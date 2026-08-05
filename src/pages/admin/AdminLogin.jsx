import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLock } from 'react-icons/fi';
import Logo from '../../components/common/Logo.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import SEO from '../../utils/seo.js';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();

  const onSubmit = async (values) => {
    setError('');
    try {
      await login(values);
      toast.success('Welcome back.');
      navigate('/nxt-admin');
    } catch (err) {
      setError(err.message || 'Login failed.');
    }
  };

  return (
    <section className="admin-login">
      <SEO title="Admin Login" path="/nxt-admin-login" />
      <form className="premium-card" onSubmit={handleSubmit(onSubmit)}>
        <Logo />
        <h1>Secure Admin Login</h1>
        <label>Email<input type="email" {...register('email', { required: 'Email is required' })} /></label>
        <label>Password<input type="password" {...register('password', { required: 'Password is required', minLength: 8 })} /></label>
        <div className="form-errors">{Object.values(errors).map((item) => <small key={item.message}>{item.message}</small>)}{error && <small>{error}</small>}</div>
        <button className="btn primary" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Login'} <FiLock /></button>
      </form>
    </section>
  );
}

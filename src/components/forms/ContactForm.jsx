import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FiSend } from 'react-icons/fi';
import { publicApi } from '../../services/api.js';

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    try {
      await publicApi.sendMessage(values);
      setSent(true);
      reset();
      toast.success('Message sent. Nextec will contact you shortly.');
    } catch (error) {
      toast.error(error.message || 'Please check your details and try again.');
    }
  };

  return (
    <form className="contact-form premium-card" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-grid two">
        <label>Your Name<input {...register('name', { required: 'Name is required', minLength: 2 })} /></label>
        <label>Your Email<input type="email" {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/i })} /></label>
      </div>
      <label>Subject<input {...register('subject', { required: 'Subject is required', minLength: 3 })} /></label>
      <label>Your Message<textarea rows="7" {...register('message', { required: 'Message is required', minLength: 10 })} /></label>
      <div className="form-errors">{Object.values(errors).map((error) => <small key={error.message}>{error.message}</small>)}</div>
      {sent && <p className="success-state">Your message has been stored securely and emailed to the Nextec team.</p>}
      <button className="btn primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send Message'} <FiSend /></button>
    </form>
  );
}

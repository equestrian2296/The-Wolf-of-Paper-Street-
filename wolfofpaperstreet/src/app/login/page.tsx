'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../../Firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import styles from './styles/login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Email already in use. Please try logging in or use a different email.';
      case 'auth/invalid-email':
        return 'Invalid email address. Please enter a valid email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/user-not-found':
        return 'No user found with this email. Please sign up.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          username: username,
          balance: 0,
          transactions: [],
        });

        router.push('/home');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/home');
      }
    } catch (error: any) {
      console.error('Error during auth operation:', error.message);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>{isSignUp ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          {isSignUp && (
            <div className={styles.inputGroup}>
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={styles.input}
              />
            </div>
          )}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        <p className={styles.toggleText}>
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <span className={styles.toggleLink} onClick={() => setIsSignUp(false)}>
                Login here
              </span>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <span className={styles.toggleLink} onClick={() => setIsSignUp(true)}>
                Sign Up here
              </span>
            </>
          )}
        </p>
      </div>
      <div className={styles.imageContainer}>
        <Image src="/bg.webp" alt="Background" layout="fill" objectFit="cover" />
      </div>
    </div>
  );
};

export default Login;

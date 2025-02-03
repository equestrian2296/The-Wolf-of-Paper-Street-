'use client';

import React, { useState } from 'react'; // Make sure 'useState' is imported from React
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../../Firebase/firebase'; // Correct path to Firebase initialization
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions

const Login = () => {
  const [email, setEmail] = useState(''); // Initializing state for email
  const [password, setPassword] = useState(''); // Initializing state for password
  const [error, setError] = useState(''); // Initializing state for errors
  const [isSignUp, setIsSignUp] = useState(false); // Track if user is signing up or logging in
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        // Attempt sign up with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create Firestore profile
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          balance: 0, // Initial balance
          transactions: [] // Empty array for transactions
        });

        router.push('/dashboard'); // Redirect to dashboard after successful sign-up
      } else {
        // Attempt login with email and password
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/dashboard'); // Redirect to dashboard after successful login
      }
    } catch (error: any) {
      console.error("Error during auth operation:", error.message); // Log error to console
      setError(isSignUp ? `Sign-up failed. ${error.message}` : 'Invalid email or password'); // Show user-friendly error
    }
  };

  return (
    <div>
      <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <p>
        {isSignUp ? (
          <>
            Already have an account?{' '}
            <span
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => setIsSignUp(false)}
            >
              Login here
            </span>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <span
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up here
            </span>
          </>
        )}
      </p>
    </div>
  );
};

export default Login;

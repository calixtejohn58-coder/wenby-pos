'use client';

import axios from 'axios';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const login = async () => {
    try {
      const response = await axios.post(
        'http://${process.env.NEXT_PUBLIC_API_URL}/auth/login',
        {
          email,
          password,
        },
      );

      const token =
        response.data.access_token;

      localStorage.setItem(
        'token',
        token,
      );

      localStorage.setItem(
        'user',
        JSON.stringify(
          response.data.user,
        ),
      );

      // COOKIE FOR MIDDLEWARE
      document.cookie =
        `token=${token}; path=/`;

      alert('Login successful');

      window.location.href =
        '/dashboard';

    } catch (error) {
      console.log(error);

      alert('Login failed');
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-10">

      <div className="bg-zinc-900 border border-zinc-800 p-12 rounded-3xl w-full max-w-xl">

        <h1 className="text-6xl font-black mb-4 text-center">
          Wenby POS
        </h1>

        <p className="text-zinc-400 text-center text-lg mb-10">
          Professional Business System
        </p>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value,
              )
            }
            className="w-full bg-zinc-800 border border-zinc-700 p-5 rounded-2xl text-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value,
              )
            }
            className="w-full bg-zinc-800 border border-zinc-700 p-5 rounded-2xl text-white"
          />

          <button
            onClick={login}
            className="w-full bg-white text-black py-5 rounded-2xl text-2xl font-black"
          >
            Login
          </button>

        </div>

      </div>

    </main>
  );
}
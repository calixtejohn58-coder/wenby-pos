'use client';

import axios from 'axios';

import Link from 'next/link';

import { useState } from 'react';

export default function RegisterPage() {
  const [fullName, setFullName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const register = async () => {
    try {
      await axios.post(
        'http://localhost:3000/auth/register',
        {
          fullName,
          email,
          password,
        },
      );

      alert(
        'Account created successfully',
      );

      window.location.href =
        '/';

    } catch (error) {
      console.log(error);

      alert('Register failed');
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-10">

      <div className="bg-zinc-900 border border-zinc-800 p-12 rounded-3xl w-full max-w-xl">

        <h1 className="text-6xl font-black mb-4 text-center">
          Create Account
        </h1>

        <p className="text-zinc-400 text-center text-lg mb-10">
          Wenby POS Register
        </p>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) =>
              setFullName(
                e.target.value,
              )
            }
            className="w-full bg-zinc-800 border border-zinc-700 p-5 rounded-2xl text-white"
          />

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
            onClick={register}
            className="w-full bg-white text-black py-5 rounded-2xl text-2xl font-black"
          >
            Register
          </button>

          <Link href="/">
            <button className="w-full bg-zinc-800 py-5 rounded-2xl text-xl font-bold">
              Back To Login
            </button>
          </Link>

        </div>

      </div>

    </main>
  );
}
'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const login = () => {

    // ADMIN LOGIN
    if (
      email ===
        'calixtejohn58@gmail.com' &&
      password ===
        'Wenby509'
    ) {

      localStorage.setItem(
        'token',
        'admin-token',
      );

      localStorage.setItem(
        'user',
        JSON.stringify({
          fullName:
            'Wenby Admin',

          email:
            'calixtejohn58@gmail.com',

          role: 'ADMIN',
        }),
      );

      window.location.href =
        '/dashboard';

      return;
    }

    alert(
      'Email ou mot de passe incorrect',
    );
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-10">

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 w-full max-w-xl">

        <h1 className="text-6xl font-black mb-4 text-center">
          Wenby POS
        </h1>

        <p className="text-zinc-400 text-center text-lg mb-10">
          Connexion Sécurisée
        </p>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value,
              )
            }
            className="w-full bg-zinc-800 border border-zinc-700 p-5 rounded-2xl"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value,
              )
            }
            className="w-full bg-zinc-800 border border-zinc-700 p-5 rounded-2xl"
          />

          <button
            onClick={login}
            className="w-full bg-white text-black py-5 rounded-2xl text-2xl font-black"
          >
            Connexion
          </button>

        </div>

      </div>

    </main>
  );
}
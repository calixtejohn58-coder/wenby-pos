'use client';

import axios from 'axios';
import Link from 'next/link';

import {
  useState,
} from 'react';

export default function RegisterPage() {

  const [fullName, setFullName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const register =
    async () => {

      try {

        setLoading(true);

        await axios.post(

          `${process.env.NEXT_PUBLIC_API_URL}/users`,

          {
            fullName,
            email,
            password,
          },
        );

        alert(
          'Utilisateur créé avec succès',
        );

        window.location.href =
          '/';

      } catch (error) {

        console.log(error);

        alert(
          'Erreur lors de la création',
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <main className="min-h-screen bg-black text-white flex items-center justify-center p-5">

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 w-full max-w-lg">

        <h1 className="text-5xl font-black mb-3 text-center">
          Wenby POS
        </h1>

        <p className="text-zinc-400 text-center mb-10">
          Création utilisateur
        </p>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Nom complet"
            value={fullName}
            onChange={(e) =>
              setFullName(
                e.target.value,
              )
            }
            className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl outline-none"
          />

          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value,
              )
            }
            className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl outline-none"
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
            className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl outline-none"
          />

          <button
            onClick={register}
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg hover:scale-[1.02] transition"
          >

            {loading
              ? 'Chargement...'
              : 'Créer utilisateur'}

          </button>

        </div>

        <div className="mt-8 text-center">

          <Link
            href="/"
            className="text-zinc-400 hover:text-white transition"
          >

            Retour connexion

          </Link>

        </div>

      </div>

    </main>
  );
}
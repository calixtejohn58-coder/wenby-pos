'use client';

import axios from 'axios';

import Link from 'next/link';

import {
  useEffect,
  useState,
} from 'react';

interface User {
  id: string;

  fullName: string;

  email: string;

  role: string;
}

export default function UsersPage() {
  const [users, setUsers] =
    useState<User[]>([]);

  const [fullName, setFullName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [role, setRole] =
    useState('CASHIER');

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const user =
      localStorage.getItem(
        'user',
      );

    if (!user) {
      window.location.href =
        '/';

      return;
    }

    const parsedUser =
      JSON.parse(user);

    if (
      parsedUser.role !==
      'ADMIN'
    ) {
      window.location.href =
        '/dashboard';

      return;
    }

    fetchUsers();

    setLoading(false);
  }, []);

  const fetchUsers = async () => {
    try {
      const response =
        await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`
        );

      setUsers(
        response.data,
      );
    } catch (error) {
      console.log(error);
    }
  };

  const createUser =
    async () => {
      try {
        await axios.post(
          'http://${process.env.NEXT_PUBLIC_API_URL}/users',
          {
            fullName,

            email,

            password,

            role,
          },
        );

        setFullName('');
        setEmail('');
        setPassword('');

        fetchUsers();
      } catch (error) {
        console.log(error);
      }
    };

  const deleteUser =
    async (id: string) => {
      try {
        await axios.delete(
          `http://${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        );

        fetchUsers();
      } catch (error) {
        console.log(error);
      }
    };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">

        <h1 className="text-4xl font-black">
          Chargement...
        </h1>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="flex">

        {/* Sidebar */}
        <aside className="w-64 bg-zinc-950 border-r border-zinc-800 min-h-screen p-5">

          <h1 className="text-4xl font-black mb-10">
            Wenby POS
          </h1>

          <nav className="space-y-4">

            <Link href="/dashboard">
              <button className="w-full text-left bg-zinc-900 hover:bg-zinc-800 p-4 rounded-2xl">
                Tableau de bord
              </button>
            </Link>

            <Link href="/products">
              <button className="w-full text-left bg-zinc-900 hover:bg-zinc-800 p-4 rounded-2xl">
                Produits
              </button>
            </Link>

            <Link href="/pos">
              <button className="w-full text-left bg-zinc-900 hover:bg-zinc-800 p-4 rounded-2xl">
                POS
              </button>
            </Link>

            <Link href="/sales">
              <button className="w-full text-left bg-zinc-900 hover:bg-zinc-800 p-4 rounded-2xl">
                Ventes
              </button>
            </Link>

            <Link href="/users">
              <button className="w-full text-left bg-white text-black p-4 rounded-2xl font-bold">
                Utilisateurs
              </button>
            </Link>

          </nav>

        </aside>

        {/* Content */}
        <section className="flex-1 p-10">

          {/* Header */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl mb-8">

            <h1 className="text-5xl font-black mb-3">
              Gestion Utilisateurs
            </h1>

            <p className="text-zinc-400">
              Gérez admins et caissiers
            </p>

          </div>

          {/* Add User */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl mb-8">

            <h2 className="text-3xl font-black mb-6">
              Créer Utilisateur
            </h2>

            <div className="grid grid-cols-4 gap-4">

              <input
                type="text"
                placeholder="Nom complet"
                value={fullName}
                onChange={(e) =>
                  setFullName(
                    e.target.value,
                  )
                }
                className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl"
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
                className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl"
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
                className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl"
              />

              <select
                value={role}
                onChange={(e) =>
                  setRole(
                    e.target.value,
                  )
                }
                className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl"
              >

                <option value="ADMIN">
                  ADMIN
                </option>

                <option value="CASHIER">
                  CAISSIER
                </option>

              </select>

            </div>

            <button
              onClick={createUser}
              className="mt-6 bg-white text-black px-8 py-4 rounded-2xl text-lg font-black"
            >
              Créer Utilisateur
            </button>

          </div>

          {/* Users List */}
          <div className="grid grid-cols-3 gap-6">

            {users.map(
              (user) => (
                <div
                  key={user.id}
                  className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl"
                >

                  <h2 className="text-3xl font-black mb-2">
                    {user.fullName}
                  </h2>

                  <p className="text-zinc-400 mb-2">
                    {user.email}
                  </p>

                  <p className="uppercase text-sm text-zinc-500 mb-5">
                    {user.role}
                  </p>

                  <button
                    onClick={() =>
                      deleteUser(
                        user.id,
                      )
                    }
                    className="bg-red-500 px-5 py-3 rounded-2xl font-bold"
                  >
                    Supprimer
                  </button>

                </div>
              ),
            )}

          </div>

        </section>

      </div>

    </main>
  );
}
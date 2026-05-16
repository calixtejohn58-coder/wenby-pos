'use client';

import axios from 'axios';
import Link from 'next/link';

import {
  useEffect,
  useState,
} from 'react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Product {
  id: string;
  name?: string;
  price: number;
  stock: number;
}

interface Sale {
  id: string;
  total: number;
  createdAt: string;
}

export default function DashboardPage() {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [sales, setSales] =
    useState<Sale[]>([]);

  const [userName, setUserName] =
    useState('');

  const [role, setRole] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [theme, setTheme] =
    useState('cyan');

  const [time, setTime] =
    useState('');

  const [date, setDate] =
    useState('');

  // CLOCK
  useEffect(() => {

    const interval =
      setInterval(() => {

        const now =
          new Date();

        setTime(
          now.toLocaleTimeString(),
        );

        setDate(
          now.toLocaleDateString(),
        );

      }, 1000);

    return () =>
      clearInterval(interval);

  }, []);

  // LOAD DATA
  useEffect(() => {

    fetchProducts();

    fetchSales();

    const user =
      localStorage.getItem(
        'user',
      );

    if (user) {

      const parsedUser =
        JSON.parse(user);

      setUserName(
        parsedUser.fullName ||
          'Admin',
      );

      setRole(
        parsedUser.role ||
          'ADMIN',
      );
    }

  }, []);

  // FETCH PRODUCTS
  const fetchProducts =
    async () => {

      try {

        const response =
          await axios.get(
            'http://${process.env.NEXT_PUBLIC_API_URL}/products',
          );

        setProducts(
          response.data,
        );

      } catch (error) {

        console.log(error);

      }
    };

  // FETCH SALES
  const fetchSales =
    async () => {

      try {

        const response =
          await axios.get(
            'http://${process.env.NEXT_PUBLIC_API_URL}/sales',
          );

        setSales(
          response.data,
        );

      } catch (error) {

        console.log(error);

      }
    };

  // STATS
  const inventoryValue =
    products.reduce(
      (sum, product) =>
        sum +
        product.price *
          product.stock,
      0,
    );

  const salesRevenue =
    sales.reduce(
      (sum, sale) =>
        sum + sale.total,
      0,
    );

  const today =
    new Date().toDateString();

  const todaySales =
    sales.filter(
      (sale) =>
        new Date(
          sale.createdAt,
        ).toDateString() ===
        today,
    );

  const todayRevenue =
    todaySales.reduce(
      (sum, sale) =>
        sum + sale.total,
      0,
    );

  // SEARCH
  const filteredProducts =
    products.filter(
      (product) =>
        product.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase(),
          ),
    );

  // CHART
  const chartData =
    sales.map((sale) => ({
      date: new Date(
        sale.createdAt,
      ).toLocaleDateString(),

      revenue:
        sale.total,
    }));

  // LOGOUT
  const logout = () => {

    localStorage.removeItem(
      'token',
    );

    localStorage.removeItem(
      'user',
    );

    window.location.href =
      '/';
  };

  return (

    <main

      className={`

      min-h-screen
      overflow-hidden
      relative

      ${
        theme === 'cyan'
          ? 'bg-black text-white'

          : theme === 'purple'
          ? 'bg-[#140021] text-white'

          : theme === 'light'
          ? 'bg-zinc-100 text-black'

          : 'bg-black text-white'
      }
    `}
    >

      {/* GLOW */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full" />

      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full" />

      <div className="flex flex-col xl:flex-row relative z-10">

        {/* SIDEBAR */}
        <aside className="w-full xl:w-72 bg-zinc-950/90 backdrop-blur-xl border-r border-cyan-500/10 text-white min-h-screen p-6">

          <div className="flex items-center gap-4 mb-12">

            <img
              src="/logo.png"
              alt="Wenby MS"
              className="w-20 h-20 object-contain"
            />

            <div>

              <h1 className="text-4xl font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                Wenby MS
              </h1>

              <p className="text-cyan-400 text-sm tracking-[3px] uppercase">
                Technology
              </p>

            </div>

          </div>

          <nav className="space-y-4">

            <Link href="/dashboard">
              <button className="w-full text-left bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-2xl font-black shadow-2xl">
                Tableau de bord
              </button>
            </Link>

            <Link href="/products">
              <button className="w-full text-left bg-zinc-900 hover:bg-zinc-800 p-4 rounded-2xl transition">
                Produits
              </button>
            </Link>

            <Link href="/pos">
              <button className="w-full text-left bg-zinc-900 hover:bg-zinc-800 p-4 rounded-2xl transition">
                POS
              </button>
            </Link>

            <Link href="/sales">
              <button className="w-full text-left bg-zinc-900 hover:bg-zinc-800 p-4 rounded-2xl transition">
                Ventes
              </button>
            </Link>

            <button
              onClick={logout}
              className="w-full text-left bg-red-500 hover:bg-red-600 p-4 rounded-2xl font-bold transition"
            >
              Déconnexion
            </button>

          </nav>

        </aside>

        {/* CONTENT */}
        <section className="flex-1 p-4 md:p-8 xl:p-10">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-cyan-500/20 rounded-[35px] p-8 md:p-10 shadow-2xl mb-10 overflow-hidden relative">

            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full" />

            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full" />

            <div className="relative z-10 flex flex-col xl:flex-row justify-between gap-8">

              <div className="flex items-center gap-6">

                <div className="bg-black border border-cyan-500/20 p-4 rounded-3xl">

                  <img
                    src="/logo.png"
                    alt="Wenby MS"
                    className="w-24 h-24 object-contain"
                  />

                </div>

                <div>

                  <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                    Wenby MS
                  </h1>

                  <p className="text-cyan-400 tracking-[4px] uppercase mt-2">
                    Technology Solutions
                  </p>

                  <p className="text-zinc-400 mt-3">
                    Smart POS • Inventory • Analytics • Sales Management
                  </p>

                  {/* THEMES */}
                  <div className="flex flex-wrap gap-3 mt-6">

                    <button
                      onClick={() =>
                        setTheme('cyan')
                      }
                      className="bg-cyan-500 px-4 py-2 rounded-2xl font-bold"
                    >
                      Cyber Blue
                    </button>

                    <button
                      onClick={() =>
                        setTheme('purple')
                      }
                      className="bg-purple-500 px-4 py-2 rounded-2xl font-bold"
                    >
                      Purple Tech
                    </button>

                    <button
                      onClick={() =>
                        setTheme('light')
                      }
                      className="bg-white text-black px-4 py-2 rounded-2xl font-bold"
                    >
                      Light
                    </button>

                  </div>

                </div>

              </div>

              <div className="flex flex-col gap-4">

                <div className="bg-black/40 border border-cyan-500/20 px-6 py-4 rounded-3xl">

                  <p className="text-zinc-400 text-sm">
                    Heure
                  </p>

                  <p className="text-2xl font-black">
                    {time}
                  </p>

                  <p className="text-zinc-500 text-sm">
                    {date}
                  </p>

                </div>

                <div className="bg-black/40 border border-blue-500/20 px-6 py-4 rounded-3xl">

                  <p className="text-zinc-400 text-sm">
                    Connecté
                  </p>

                  <p className="text-2xl font-black">
                    {userName}
                  </p>

                  <p className="text-cyan-400 uppercase text-sm">
                    {role}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* SEARCH */}
          <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl mb-8">

            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value,
                )
              }
              className="w-full bg-black border border-zinc-700 p-5 rounded-2xl text-white outline-none"
            />

          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

            <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 border border-cyan-500/20 rounded-3xl p-8 shadow-2xl">

              <p className="text-zinc-400 uppercase tracking-[3px] mb-3">
                Produits
              </p>

              <h2 className="text-5xl font-black">
                {products.length}
              </h2>

            </div>

            <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 border border-blue-500/20 rounded-3xl p-8 shadow-2xl">

              <p className="text-zinc-400 uppercase tracking-[3px] mb-3">
                Valeur Stock
              </p>

              <h2 className="text-5xl font-black">
                ${inventoryValue}
              </h2>

            </div>

            <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 border border-green-500/20 rounded-3xl p-8 shadow-2xl">

              <p className="text-zinc-400 uppercase tracking-[3px] mb-3">
                Revenus
              </p>

              <h2 className="text-5xl font-black">
                ${salesRevenue}
              </h2>

            </div>

            <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 border border-purple-500/20 rounded-3xl p-8 shadow-2xl">

              <p className="text-zinc-400 uppercase tracking-[3px] mb-3">
                Aujourd'hui
              </p>

              <h2 className="text-5xl font-black">
                ${todayRevenue}
              </h2>

            </div>

          </div>

          {/* CHART */}
          <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl">

            <h2 className="text-3xl font-black mb-8">
              Analyse des ventes
            </h2>

            <div className="h-[400px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart data={chartData}>

                  <XAxis dataKey="date" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#06b6d4"
                    strokeWidth={4}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}
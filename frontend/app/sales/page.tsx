'use client';

import axios from 'axios';

import Link from 'next/link';

import {
  useEffect,
  useState,
} from 'react';

interface SaleItem {
  id: string;

  quantity: number;

  price: number;

  product?: {
    name: string;
  };
}

interface Sale {
  id: string;

  total: number;

  createdAt: string;

  cashier?: {
    fullName: string;

    role: string;
  };

  items?: SaleItem[];
}

export default function SalesPage() {

  const [sales, setSales] =
    useState<Sale[]>([]);

  const [search, setSearch] =
    useState('');

  const [darkMode, setDarkMode] =
    useState(true);

  useEffect(() => {

    fetchSales();

  }, []);

  // FETCH SALES
  const fetchSales =
    async () => {

      try {

        const token =
          localStorage.getItem(
            'token',
          );

        const response =
          await axios.get(

            `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          );

        setSales(
          response.data,
        );

      } catch (error) {

        console.log(error);

      }
    };

  // FILTER SALES
  const filteredSales =
    sales.filter(
      (sale) =>
        sale.cashier?.fullName
          ?.toLowerCase()
          .includes(
            search.toLowerCase(),
          ),
    );

  // TOTAL REVENUE
  const totalRevenue =
    filteredSales.reduce(
      (sum, sale) =>
        sum + sale.total,
      0,
    );

  return (
    <main
      className={`min-h-screen ${
        darkMode
          ? 'bg-black text-white'
          : 'bg-zinc-100 text-black'
      }`}
    >

      <div className="flex flex-col xl:flex-row">

        {/* SIDEBAR */}
        <aside className="w-full xl:w-64 bg-zinc-950 border-r border-zinc-800 text-white min-h-screen p-5">

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
              <button className="w-full text-left bg-white text-black p-4 rounded-2xl font-bold">
                Ventes
              </button>
            </Link>

            <Link href="/users">
              <button className="w-full text-left bg-zinc-900 hover:bg-zinc-800 p-4 rounded-2xl">
                Utilisateurs
              </button>
            </Link>

          </nav>

        </aside>

        {/* CONTENT */}
        <section className="flex-1 p-4 md:p-10">

          {/* HEADER */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-sm mb-8">

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-5">

              <div>

                <h1 className="text-3xl md:text-5xl font-black mb-3 text-white">
                  Historique des ventes
                </h1>

                <p className="text-zinc-400">
                  Toutes les ventes enregistrées
                </p>

              </div>

              <button
                onClick={() =>
                  setDarkMode(
                    !darkMode,
                  )
                }
                className="bg-zinc-800 text-white px-5 py-3 rounded-2xl font-bold"
              >
                {darkMode
                  ? 'Mode Clair'
                  : 'Mode Sombre'}
              </button>

            </div>

          </div>

          {/* SEARCH */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-sm mb-8">

            <input
              type="text"
              placeholder="Rechercher par caissier..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value,
                )
              }
              className="w-full bg-zinc-800 border border-zinc-700 p-5 rounded-2xl text-white"
            />

          </div>

          {/* TOTAL */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-sm mb-8">

            <h2 className="text-zinc-400 mb-3">
              Revenus Totals
            </h2>

            <p className="text-5xl font-black">
              ${totalRevenue}
            </p>

          </div>

          {/* SALES */}
          <div className="space-y-6">

            {filteredSales.map(
              (sale) => (

                <div
                  key={sale.id}
                  className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl"
                >

                  <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4 mb-6">

                    <div>

                      <p className="text-2xl font-black">

                        {sale.cashier?.fullName}

                      </p>

                      <p className="text-zinc-400">

                        {new Date(
                          sale.createdAt,
                        ).toLocaleString()}

                      </p>

                      <p className="text-zinc-500 uppercase text-sm mt-1">

                        {sale.cashier?.role}

                      </p>

                    </div>

                    <div className="xl:text-right">

                      <p className="text-4xl font-black">

                        ${sale.total}

                      </p>

                      <button
                        onClick={() =>
                          window.print()
                        }
                        className="mt-3 bg-white text-black px-5 py-2 rounded-xl font-bold"
                      >

                        Imprimer

                      </button>

                    </div>

                  </div>

                  {/* PRODUCTS */}
                  <div className="space-y-3">

                    {sale.items?.map(
                      (item) => (

                        <div
                          key={item.id}
                          className="bg-zinc-800 p-4 rounded-2xl flex justify-between items-center"
                        >

                          <p className="font-bold">

                            {item.product?.name}
                            {' '}
                            x
                            {' '}
                            {item.quantity}

                          </p>

                          <p className="font-black">

                            $
                            {item.price *
                              item.quantity}

                          </p>

                        </div>
                      ),
                    )}

                  </div>

                </div>
              ),
            )}

          </div>

        </section>

      </div>

    </main>
  );
}
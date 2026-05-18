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

  product: {
    name: string;
    price: number;
  };
}

interface Sale {
  id: string;

  total: number;

  createdAt: string;

  cashier: {
    fullName: string;
  };

  items: SaleItem[];
}

export default function SaleDetailsPage({
  params,
}: {
  params: {
    id: string;
  };
}) {

  const [sale, setSale] =
    useState<Sale | null>(null);

  useEffect(() => {

    fetchSale();

  }, []);

  // FETCH SALE
  const fetchSale =
    async () => {

      try {

        const token =
          localStorage.getItem(
            'token',
          );

        const response =
          await axios.get(

            `${process.env.NEXT_PUBLIC_API_URL}/sales/${params.id}`,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          );

        setSale(
          response.data,
        );

      } catch (error) {

        console.log(error);
      }
    };

  if (!sale) {

    return (

      <main className="min-h-screen bg-black text-white flex items-center justify-center">

        <h1 className="text-4xl font-black">
          Loading...
        </h1>

      </main>
    );
  }

  return (

    <main className="min-h-screen bg-black text-white">

      <div className="flex flex-col xl:flex-row">

        {/* SIDEBAR */}
        <aside className="w-full xl:w-64 bg-zinc-950 border-r border-zinc-800 min-h-screen p-5">

          <h1 className="text-4xl font-black mb-10">
            Wenby POS
          </h1>

          <nav className="space-y-4">

            <Link href="/dashboard">

              <button className="w-full text-left bg-zinc-900 hover:bg-zinc-800 p-4 rounded-2xl">

                Dashboard

              </button>

            </Link>

            <Link href="/products">

              <button className="w-full text-left bg-zinc-900 hover:bg-zinc-800 p-4 rounded-2xl">

                Products

              </button>

            </Link>

            <Link href="/pos">

              <button className="w-full text-left bg-zinc-900 hover:bg-zinc-800 p-4 rounded-2xl">

                POS

              </button>

            </Link>

            <Link href="/sales">

              <button className="w-full text-left bg-white text-black p-4 rounded-2xl font-bold">

                Sales

              </button>

            </Link>

          </nav>

        </aside>

        {/* CONTENT */}
        <section className="flex-1 p-4 md:p-10">

          {/* HEADER */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8">

            <h1 className="text-5xl font-black mb-3">
              Sale Details
            </h1>

            <p className="text-zinc-400 text-lg">

              Sale #
              {sale.id.slice(0, 8)}

            </p>

          </div>

          {/* SALE INFO */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div>

                <h2 className="text-zinc-500 mb-2">
                  Cashier
                </h2>

                <p className="text-2xl font-bold">

                  {sale.cashier
                    ?.fullName ||
                    'Admin'}

                </p>

              </div>

              <div>

                <h2 className="text-zinc-500 mb-2">
                  Date
                </h2>

                <p className="text-2xl font-bold">

                  {new Date(
                    sale.createdAt,
                  ).toLocaleString()}

                </p>

              </div>

              <div>

                <h2 className="text-zinc-500 mb-2">
                  Total
                </h2>

                <p className="text-4xl font-black">

                  $
                  {sale.total}

                </p>

              </div>

            </div>

          </div>

          {/* ITEMS */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <div className="flex flex-col md:flex-row justify-between md:items-center gap-5 mb-8">

              <h2 className="text-4xl font-black">
                Products
              </h2>

              <button
                onClick={() =>
                  window.print()
                }
                className="bg-white text-black px-6 py-3 rounded-2xl font-black"
              >

                Print Receipt

              </button>

            </div>

            <div className="space-y-5">

              {sale.items.map(
                (item) => (

                  <div
                    key={item.id}
                    className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 flex flex-col md:flex-row justify-between md:items-center gap-5"
                  >

                    <div>

                      <h3 className="text-3xl font-black mb-2">

                        {item.product.name}

                      </h3>

                      <p className="text-zinc-400 text-lg">

                        Quantity:
                        {' '}
                        {item.quantity}

                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-zinc-400 text-lg mb-2">

                        Unit Price:
                        {' '}
                        $
                        {item.product.price}

                      </p>

                      <p className="text-3xl font-black">

                        $
                        {item.product.price *
                          item.quantity}

                      </p>

                    </div>

                  </div>
                ),
              )}

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}
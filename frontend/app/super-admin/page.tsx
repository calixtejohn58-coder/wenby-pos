'use client';

import axios from 'axios';

import {
  useEffect,
  useState,
} from 'react';

interface Business {

  id: string;

  name: string;

  email?: string;

  phone?: string;

  isActive: boolean;

  createdAt: string;
}

export default function SuperAdminPage() {

  const [
    businesses,
    setBusinesses,
  ] = useState<Business[]>([]);

  useEffect(() => {

    fetchBusinesses();

  }, []);

  const fetchBusinesses =
    async () => {

      try {

        const response =
          await axios.get(

            `${process.env.NEXT_PUBLIC_API_URL}/businesses`,
          );

        setBusinesses(
          response.data,
        );

      } catch (error) {

        console.log(error);
      }
    };

  const suspendBusiness =
    async (id: string) => {

      try {

        await axios.patch(

          `${process.env.NEXT_PUBLIC_API_URL}/businesses/${id}/suspend`,
        );

        fetchBusinesses();

      } catch (error) {

        console.log(error);
      }
    };

  return (

    <main className="min-h-screen bg-black text-white p-10">

      <div className="mb-10">

        <h1 className="text-6xl font-black mb-3">

          SUPER ADMIN

        </h1>

        <p className="text-zinc-400 text-xl">

          Wenby POS SaaS Management

        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {businesses.map(
          (business) => (

            <div
              key={business.id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
            >

              <div className="flex items-center justify-between mb-5">

                <h2 className="text-3xl font-black">

                  {business.name}

                </h2>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    business.isActive
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                >

                  {business.isActive
                    ? 'ACTIVE'
                    : 'SUSPENDED'}

                </span>

              </div>

              <p className="text-zinc-400 mb-2">

                {business.email || 'No email'}

              </p>

              <p className="text-zinc-500 mb-5">

                {new Date(
                  business.createdAt,
                ).toLocaleDateString()}

              </p>

              <button
                onClick={() =>
                  suspendBusiness(
                    business.id,
                  )
                }
                className="bg-red-500 hover:bg-red-600 transition px-5 py-3 rounded-2xl font-black"
              >

                Suspendre

              </button>

            </div>
          ),
        )}

      </div>

    </main>
  );
}
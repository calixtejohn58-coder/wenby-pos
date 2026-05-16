'use client';

import axios from 'axios';

import Link from 'next/link';

import Barcode from 'react-barcode';

import {
  useEffect,
  useState,
} from 'react';

interface Product {
  id: string;

  name: string;

  price: number;

  stock: number;

  barcode?: string;
}

export default function ProductsPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [name, setName] =
    useState('');

  const [price, setPrice] =
    useState('');

  const [stock, setStock] =
    useState('');

  const [barcode, setBarcode] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [editingId, setEditingId] =
    useState<string | null>(
      null,
    );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response =
        await axios.get(
          'http://localhost:3000/products',
        );

      setProducts(
        response.data,
      );
    } catch (error) {
      console.log(error);
    }
  };

  const editProduct = (
    product: Product,
  ) => {
    setEditingId(product.id);

    setName(product.name);

    setPrice(
      product.price.toString(),
    );

    setStock(
      product.stock.toString(),
    );

    setBarcode(
      product.barcode || '',
    );
  };

  const createProduct =
    async () => {
      try {
        if (editingId) {
          await axios.patch(
            `http://localhost:3000/products/${editingId}`,
            {
              name,

              price:
                Number(price),

              stock:
                Number(stock),

              barcode,
            },
          );

          setEditingId(null);
        } else {
          await axios.post(
            'http://localhost:3000/products',
            {
              name,

              price:
                Number(price),

              stock:
                Number(stock),

              barcode,
            },
          );
        }

        setName('');
        setPrice('');
        setStock('');
        setBarcode('');

        fetchProducts();
      } catch (error) {
        console.log(error);
      }
    };

  const deleteProduct =
    async (id: string) => {
      try {
        await axios.delete(
          `http://localhost:3000/products/${id}`,
        );

        fetchProducts();
      } catch (error) {
        console.log(error);
      }
    };

  const filteredProducts =
    products.filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase(),
          ),
    );

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
              <button className="w-full text-left bg-white text-black p-4 rounded-2xl font-bold">
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
              <button className="w-full text-left bg-zinc-900 hover:bg-zinc-800 p-4 rounded-2xl">
                Utilisateurs
              </button>
            </Link>

          </nav>

        </aside>

        {/* Content */}
        <section className="flex-1 p-10">

          {/* Header */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-sm mb-8">

            <h1 className="text-5xl font-black mb-3">
              Produits
            </h1>

            <p className="text-zinc-400 text-lg">
              Gérez votre inventaire
            </p>

          </div>

          {/* Add Product */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-sm mb-8">

            <h2 className="text-3xl font-bold mb-6">

              {editingId
                ? 'Modifier Produit'
                : 'Ajouter Produit'}

            </h2>

            <div className="grid grid-cols-4 gap-4">

              <input
                type="text"
                placeholder="Nom du produit"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value,
                  )
                }
                className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl"
              />

              <input
                type="number"
                placeholder="Prix"
                value={price}
                onChange={(e) =>
                  setPrice(
                    e.target.value,
                  )
                }
                className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl"
              />

              <input
                type="text"
                placeholder="Code barre"
                value={barcode}
                onChange={(e) =>
                  setBarcode(
                    e.target.value,
                  )
                }
                className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl"
              />

              <input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) =>
                  setStock(
                    e.target.value,
                  )
                }
                className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl"
              />

            </div>

            <button
              onClick={createProduct}
              className="mt-6 bg-white text-black px-8 py-4 rounded-2xl text-lg font-black"
            >
              {editingId
                ? 'Mettre à jour'
                : 'Ajouter Produit'}
            </button>

          </div>

          {/* Search */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-sm mb-8">

            <input
              type="text"
              placeholder="Rechercher produit..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value,
                )
              }
              className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl"
            />

          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-3 gap-6">

            {filteredProducts.map(
              (product) => (
                <div
                  key={product.id}
                  className={`p-6 rounded-3xl border ${
                    product.stock <= 5
                      ? 'bg-red-950 border-red-500'
                      : 'bg-zinc-900 border-zinc-800'
                  }`}
                >

                  <h3 className="text-3xl font-black mb-3">
                    {product.name}
                  </h3>

                  <p className="text-zinc-400 mb-2">
                    Stock:
                    {' '}
                    {product.stock}
                  </p>

                  {product.barcode && (
                    <p className="text-zinc-400 mb-3">
                      Code barre:
                      {' '}
                      {product.barcode}
                    </p>
                  )}

                  {/* Barcode */}
                  <div className="mt-4 bg-white p-3 rounded-xl flex justify-center">

                    <Barcode
                      value={
                        product.barcode ||
                        product.id
                      }
                      width={1}
                      height={40}
                      fontSize={12}
                    />

                  </div>

                  {product.stock <= 5 && (
                    <p className="text-red-400 font-bold mt-4 mb-4">
                      Stock faible
                    </p>
                  )}

                  <p className="text-4xl font-black mb-5">
                    ${product.price}
                  </p>

                  <div className="flex flex-wrap gap-3">

                    <button
                      onClick={() =>
                        editProduct(
                          product,
                        )
                      }
                      className="bg-white text-black px-5 py-3 rounded-2xl font-bold"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() =>
                        deleteProduct(
                          product.id,
                        )
                      }
                      className="bg-red-500 px-5 py-3 rounded-2xl font-bold"
                    >
                      Supprimer
                    </button>

                    <button
                      onClick={() =>
                        window.print()
                      }
                      className="bg-zinc-700 px-5 py-3 rounded-2xl font-bold"
                    >
                      Imprimer Barcode
                    </button>

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
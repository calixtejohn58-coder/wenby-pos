'use client';

import axios from 'axios';
import Link from 'next/link';

import {
  useEffect,
  useState,
} from 'react';

const BUSINESS_NAME =
  'Wenby MS';

const BUSINESS_PHONE =
  '+509 4249-6992';

const BUSINESS_ADDRESS =
  'Delmas 31, Haïti';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function PosPage() {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [search, setSearch] =
    useState('');

  const [receipt, setReceipt] =
    useState<any>(null);

  const [
    customerName,
    setCustomerName,
  ] = useState('');

  const [
    customerPhone,
    setCustomerPhone,
  ] = useState('');

  const [
    cashierName,
    setCashierName,
  ] = useState('');

  useEffect(() => {

    fetchProducts();

    const user =
      localStorage.getItem(
        'user',
      );

    if (user) {

      const parsedUser =
        JSON.parse(user);

      setCashierName(
        parsedUser.fullName ||
        'Admin',
      );
    }

  }, []);

  // FETCH PRODUCTS
  const fetchProducts =
    async () => {

      try {

        const response =
          await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/products`,
          );

        setProducts(
          response.data,
        );

      } catch (error) {

        console.log(error);
      }
    };

  // ADD TO CART
  const addToCart = (
    product: Product,
  ) => {

    const existing =
      cart.find(
        (item) =>
          item.id ===
          product.id,
      );

    if (existing) {

      const updated =
        cart.map(
          (item) =>

            item.id ===
            product.id

              ? {

                  ...item,

                  quantity:
                    item.quantity +
                    1,
                }

              : item,
        );

      setCart(updated);

    } else {

      setCart([

        ...cart,

        {

          id: product.id,

          name:
            product.name,

          price:
            product.price,

          quantity: 1,
        },
      ]);
    }
  };

  // REMOVE
  const removeFromCart =
    (id: string) => {

      setCart(

        cart.filter(
          (item) =>
            item.id !== id,
        ),
      );
    };

  // FILTER
  const filteredProducts =
    products.filter(
      (product) =>

        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase(),
          ),
    );

  // TOTAL
  const total =
    cart.reduce(

      (sum, item) =>

        sum +
        item.price *
        item.quantity,

      0,
    );

  // CHECKOUT
  const checkout =
    async () => {

      if (
        cart.length === 0
      ) {

        alert(
          'Panier vide',
        );

        return;
      }

      try {

        await axios.post(

          `${process.env.NEXT_PUBLIC_API_URL}/sales`,

          {

            customerName,

            customerPhone,

            items:
              cart.map(
                (item) => ({

                  productId:
                    item.id,

                  quantity:
                    item.quantity,
                }),
              ),
          },
        );

        setReceipt({

          items: cart,

          total,

          customerName,

          customerPhone,

          cashierName,
        });

        alert(
          'Vente effectuée',
        );

        setCart([]);

        setCustomerName('');

        setCustomerPhone('');

        fetchProducts();

        setTimeout(() => {

          window.print();

        }, 500);

      } catch (error: any) {

        console.log(error);

        alert(

          JSON.stringify(
            error?.response?.data ||
            error.message,
          ),
        );
      }
    };

  return (

    <main className="min-h-screen bg-black text-white">

      <div className="flex flex-col xl:flex-row">

        {/* SIDEBAR */}
        <aside className="w-full xl:w-64 bg-zinc-950 border-r border-zinc-800 min-h-screen p-5">

          <h1 className="text-4xl font-black mb-10">
            Wenby MS
          </h1>

          <nav className="space-y-4">

            <Link href="/dashboard">
              <button className="w-full text-left bg-zinc-900 p-4 rounded-2xl">
                Tableau de bord
              </button>
            </Link>

            <Link href="/products">
              <button className="w-full text-left bg-zinc-900 p-4 rounded-2xl">
                Produits
              </button>
            </Link>

            <Link href="/pos">
              <button className="w-full text-left bg-white text-black p-4 rounded-2xl font-bold">
                POS
              </button>
            </Link>

            <Link href="/sales">
              <button className="w-full text-left bg-zinc-900 p-4 rounded-2xl">
                Ventes
              </button>
            </Link>

          </nav>

        </aside>

        {/* CONTENT */}
        <section className="flex-1 p-4 md:p-10">

          {/* HEADER */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8">

            <img
              src="/logo.png"
              alt="Wenby MS"
              className="w-24 h-24 object-contain mb-4"
            />

            <h1 className="text-5xl font-black mb-2">
              {BUSINESS_NAME}
            </h1>

            <p className="text-xl text-zinc-300 mt-2">
              {BUSINESS_PHONE}
            </p>

            <p className="text-zinc-500">
              {BUSINESS_ADDRESS}
            </p>

          </div>

          {/* CLIENT */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl mb-8">

            <h2 className="text-3xl font-black mb-4">
              Client
            </h2>

            <p className="mb-4">
              Caissier:
              {' '}
              {cashierName}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                type="text"
                placeholder="Nom du client"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(
                    e.target.value,
                  )
                }
                className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl"
              />

              <input
                type="text"
                placeholder="Téléphone client"
                value={customerPhone}
                onChange={(e) =>
                  setCustomerPhone(
                    e.target.value,
                  )
                }
                className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl"
              />

            </div>

          </div>

          {/* SEARCH */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl mb-8">

            <input
              type="text"
              placeholder="Rechercher produit..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value,
                )
              }
              className="w-full bg-zinc-800 border border-zinc-700 p-5 rounded-2xl"
            />

          </div>

          {/* PRODUCTS + MODERN CART */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* PRODUCTS */}
            <div className="col-span-2">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {filteredProducts.map(
                  (product) => (

                    <div
                      key={product.id}

                      onClick={() =>
                        addToCart(
                          product,
                        )
                      }

                      className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-[30px] cursor-pointer hover:scale-[1.03] transition-all duration-300 shadow-2xl"
                    >

                      <div className="flex justify-between items-center mb-4">

                        <div className="bg-white text-black px-4 py-2 rounded-2xl font-black">

                          Stock:
                          {' '}
                          {product.stock}

                        </div>

                        <div className="bg-zinc-800 px-4 py-2 rounded-2xl">

                          🛒

                        </div>

                      </div>

                      <h3 className="text-3xl font-black mb-4">
                        {product.name}
                      </h3>

                      <p className="text-5xl font-black">
                        $
                        {product.price}
                      </p>

                    </div>
                  ),
                )}

              </div>

            </div>

            {/* MODERN CART */}
            <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-[30px] h-fit sticky top-5 shadow-2xl">

              <div className="flex items-center justify-between mb-8">

                <h2 className="text-4xl font-black">
                  Panier
                </h2>

                <div className="bg-white text-black px-4 py-2 rounded-2xl font-black text-lg">

                  {cart.length}

                </div>

              </div>

              <div className="space-y-4 max-h-[500px] overflow-auto pr-2">

                {cart.length === 0 && (

                  <div className="text-center py-16">

                    <p className="text-zinc-500 text-xl">
                      Aucun produit
                    </p>

                  </div>
                )}

                {cart.map((item) => (

                  <div
                    key={item.id}
                    className="bg-zinc-800/60 backdrop-blur border border-zinc-700 rounded-3xl p-5"
                  >

                    <div className="flex justify-between items-start">

                      <div>

                        <h3 className="text-xl font-black mb-2">

                          {item.name}

                        </h3>

                        <p className="text-zinc-400">

                          $
                          {item.price}

                        </p>

                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(
                            item.id,
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 transition w-10 h-10 rounded-2xl font-black"
                      >

                        ×

                      </button>

                    </div>

                    <div className="flex items-center justify-between mt-5">

                      <div className="flex items-center gap-3">

                        <button
                          onClick={() => {

                            const updated =
                              cart.map(
                                (cartItem) =>

                                  cartItem.id ===
                                  item.id

                                    ? {

                                        ...cartItem,

                                        quantity:
                                          Math.max(
                                            1,
                                            cartItem.quantity - 1,
                                          ),
                                      }

                                    : cartItem,
                              );

                            setCart(updated);
                          }}
                          className="bg-zinc-700 hover:bg-zinc-600 transition w-10 h-10 rounded-2xl text-xl font-black"
                        >

                          -

                        </button>

                        <div className="bg-black px-5 py-2 rounded-2xl font-black text-xl">

                          {item.quantity}

                        </div>

                        <button
                          onClick={() => {

                            const updated =
                              cart.map(
                                (cartItem) =>

                                  cartItem.id ===
                                  item.id

                                    ? {

                                        ...cartItem,

                                        quantity:
                                          cartItem.quantity + 1,
                                      }

                                    : cartItem,
                              );

                            setCart(updated);
                          }}
                          className="bg-white text-black hover:scale-105 transition w-10 h-10 rounded-2xl text-xl font-black"
                        >

                          +

                        </button>

                      </div>

                      <p className="text-2xl font-black">

                        $
                        {item.price *
                          item.quantity}

                      </p>

                    </div>

                  </div>
                ))}

              </div>

              <div className="mt-8 border-t border-zinc-800 pt-8">

                <div className="bg-black rounded-3xl p-5 mb-6">

                  <div className="flex justify-between items-center">

                    <span className="text-zinc-400 text-xl">
                      Total
                    </span>

                    <span className="text-4xl font-black">

                      $
                      {total}

                    </span>

                  </div>

                </div>

                <button
                  onClick={checkout}
                  className="w-full bg-white text-black hover:scale-[1.02] transition py-5 rounded-3xl text-2xl font-black shadow-2xl"
                >

                  Paiement

                </button>

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}
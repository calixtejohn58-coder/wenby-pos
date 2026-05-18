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

  // LOAD
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

        // RECEIPT
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

        // PRINT
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

          {/* PRODUCTS */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

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

                      className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl cursor-pointer hover:scale-105 transition"
                    >

                      <h3 className="text-3xl font-black mb-3">
                        {product.name}
                      </h3>

                      <p className="text-zinc-400 mb-3">
                        Stock:
                        {' '}
                        {product.stock}
                      </p>

                      <p className="text-4xl font-black">
                        $
                        {product.price}
                      </p>

                    </div>
                  ),
                )}

              </div>

            </div>

            {/* CART */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl h-fit">

              <h2 className="text-4xl font-black mb-6">
                Panier
              </h2>

              <div className="space-y-4">

                {cart.map(
                  (item) => (

                    <div
                      key={item.id}
                      className="flex justify-between items-center border-b border-zinc-800 pb-4"
                    >

                      <div>

                        <p className="font-bold">
                          {item.name}
                        </p>

                        <p>
                          {item.quantity}
                          {' '}
                          x $
                          {item.price}
                        </p>

                      </div>

                      <div className="flex items-center gap-4">

                        <p className="font-black text-xl">

                          $
                          {item.price *
                            item.quantity}

                        </p>

                        <button
                          onClick={() =>
                            removeFromCart(
                              item.id,
                            )
                          }
                          className="bg-red-500 px-3 py-2 rounded-xl"
                        >
                          X
                        </button>

                      </div>

                    </div>
                  ),
                )}

              </div>

              <div className="mt-6 border-t border-zinc-800 pt-6">

                <div className="flex justify-between text-3xl font-black">

                  <span>Total</span>

                  <span>
                    ${total}
                  </span>

                </div>

                <button
                  onClick={checkout}
                  className="w-full mt-6 bg-white text-black py-5 rounded-2xl text-2xl font-black"
                >
                  Paiement
                </button>

              </div>

            </div>

          </div>

          {/* RECEIPT */}
          {receipt && (

            <div
              id="receipt"
              className="hidden print:block bg-white text-black p-4 w-[300px]"
            >

              <div className="text-center mb-4">

                <h1 className="text-2xl font-black">
                  Wenby MS
                </h1>

                <p>
                  +509 4249-6992
                </p>

                <p>
                  Delmas 31, Haïti
                </p>

              </div>

              <div className="border-t border-b border-black py-3 mb-4 text-sm">

                <p>
                  Client:
                  {' '}
                  {receipt.customerName || 'N/A'}
                </p>

                <p>
                  Téléphone:
                  {' '}
                  {receipt.customerPhone || 'N/A'}
                </p>

                <p>
                  Caissier:
                  {' '}
                  {receipt.cashierName}
                </p>

                <p>
                  Date:
                  {' '}
                  {new Date().toLocaleString()}
                </p>

              </div>

              <div className="space-y-3 mb-4">

                {receipt.items.map((item: any) => (

                  <div
                    key={item.id}
                    className="flex justify-between"
                  >

                    <div>

                      <p className="font-bold">
                        {item.name}
                      </p>

                      <p>
                        {item.quantity}
                        {' '}
                        x $
                        {item.price}
                      </p>

                    </div>

                    <p>
                      $
                      {item.quantity *
                        item.price}
                    </p>

                  </div>
                ))}

              </div>

              <div className="border-t border-black pt-3">

                <div className="flex justify-between text-xl font-black">

                  <span>
                    TOTAL
                  </span>

                  <span>
                    $
                    {receipt.total}
                  </span>

                </div>

              </div>

              <div className="text-center mt-6">

                <p>
                  Merci pour votre achat ❤
                </p>

              </div>

            </div>
          )}

        </section>

      </div>

    </main>
  );
}
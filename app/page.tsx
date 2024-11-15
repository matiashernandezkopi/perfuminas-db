'use client'

import Link from "next/link";
import { ProductosTable } from "./components/productosTable";
import { ProductosForm } from "./components/productosForm";
import { AddProductoForm } from "./components/productosAddForm";
import { useState } from "react";

export default function Home() {
  const [addModal, setAddModal] = useState<boolean>(true)
  return (
    <div className=" w-screen h-screen flex">
      <Link
          href='/ventas'
          className={`block text-white font-semibold py-2 px-4 rounded transition duration-200 bg-red-600 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600 `}
          >
          Ventas
      </Link>
      {/* Formulario */}
      <ProductosForm />

      
      {addModal?
        (<button
              onClick={() => setAddModal(!addModal)}
              className="p-2 bg-gray-300 rounded disabled:opacity-50"
          >
              Añadir Producto
          </button>)
        :(
          <div>
            <AddProductoForm />
            <button
            onClick={() => setAddModal(!addModal)}
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            >
            Cerrar
            </button>
          </div>
        )
      }

      <ProductosTable/>
      
    </div>
  );
}

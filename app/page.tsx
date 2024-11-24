'use client'

import Link from "next/link";
import { ProductosTable } from "./components/productosTable";
import { ProductosForm } from "./components/productosForm";
import { AddProductoForm } from "./components/productosAddForm";
import { useState } from "react";

export default function Home() {
  const [addModal, setAddModal] = useState<boolean>(true)
  return (
    <div className="w-screen h-full flex flex-col space-y-6 p-4 bg-gray-50 dark:bg-gray-900">
        {/* Navegación */}
        <div className="flex justify-between items-center">
            <Link
                href="/ventas"
                className="block text-white font-semibold py-2 px-4 rounded transition duration-200 bg-green-600 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600"
            >
                Ventas
            </Link>
        </div>

        {/* Formulario de productos */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <ProductosForm />
        </div>

        {/* Modal para añadir producto */}
        <div className="flex justify-center items-center">
            {addModal ? (
                <button
                    onClick={() => setAddModal(!addModal)}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-500 transition duration-200"
                >
                    Añadir Producto
                </button>
            ) : (
                <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <AddProductoForm />
                    <button
                        onClick={() => setAddModal(!addModal)}
                        className="mt-4 w-full px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-500 transition duration-200"
                    >
                        Cerrar
                    </button>
                </div>
            )}
        </div>

        {/* Tabla de productos */}
        <div className="flex-grow bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 overflow-auto">
            <ProductosTable />
        </div>
    </div>
  );

}

'use client'

import { useState } from "react";
import { addVenta } from "../lib/ventas";
import { ContextType, useProductos } from "../context/productosContext";

export function VentasForm() {
    const { fetchVentas } = useProductos() as ContextType
    const [fecha, setFecha] = useState<string>("");
    const [productos, setProductos] = useState<string>('');
    const [cantidad, setCantidad] = useState<number>(0);

    const handleAgregarVenta = async () => {
        try {
            // Convierte la fecha al formato dd/mm/aaaa
            const fechaFormateada = new Date(fecha).toLocaleDateString("es-ES");
            await addVenta({ fecha: fechaFormateada, productos, cantidad });
            fetchVentas()
            setFecha('');
            setProductos('');
            setCantidad(0);
        } catch (error) {
            console.error("Error al agregar la venta:", error);
            alert("Hubo un error al agregar la venta. Inténtalo de nuevo.");
        }
    };

    return (
        <div className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md mx-auto">
            {/* Título */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Agregar Nueva Venta
            </h2>
    
            {/* Campo de Fecha */}
            <div>
                <label
                    htmlFor="fecha"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Fecha
                </label>
                <input
                    id="fecha"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>
    
            {/* Campo de Productos */}
            <div>
                <label
                    htmlFor="productos"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Productos
                </label>
                <input
                    id="productos"
                    type="text"
                    value={productos}
                    onChange={(e) => setProductos(e.target.value)}
                    placeholder="Nombre del producto"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>
    
            {/* Campo de Cantidad */}
            <div>
                <label
                    htmlFor="cantidad"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Cantidad
                </label>
                <input
                    id="cantidad"
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(parseInt(e.target.value))}
                    min="0"
                    placeholder="Cantidad vendida"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>
    
            {/* Botón para agregar venta */}
            <button
                onClick={handleAgregarVenta}
                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition dark:bg-blue-700 dark:hover:bg-blue-600"
            >
                Agregar Venta
            </button>
        </div>
    );
    
}

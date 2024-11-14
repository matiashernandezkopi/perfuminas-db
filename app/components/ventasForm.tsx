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
        <div className="space-y-4 p-6 bg-gray-100 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800">Agregar Nueva Venta</h2>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Productos</label>
                <input
                    type="text"
                    value={productos}
                    onChange={(e) => setProductos(e.target.value)}
                    placeholder="Nombre del producto"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                <input
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(parseInt(e.target.value))}
                    min="0"
                    placeholder="Cantidad vendida"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button 
                onClick={handleAgregarVenta} 
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mt-4 font-semibold hover:bg-blue-600 transition"
            >
                Agregar Venta
            </button>
        </div>
    );
}

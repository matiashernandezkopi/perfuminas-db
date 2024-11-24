'use client'

import { useState, useEffect } from "react";
import { addProducto, getProductos } from "../lib/productos";
import { ContextType, useProductos } from "../context/productosContext";

interface Productos {
    id: string;
    tipo: string;
    nombre: string;
    precio: number;
    cantidad: number;
}

export function AddProductoForm() {
    const { fetchProducts } = useProductos() as ContextType
    const [tiposExistentes, setTiposExistentes] = useState<string[]>([]);
    const [tipoSeleccionado, setTipoSeleccionado] = useState<string | null>(null);
    const [esNuevoTipo, setEsNuevoTipo] = useState<boolean>(false);
    const [nuevoTipo, setNuevoTipo] = useState<string>("");
    const [nombre, setNombre] = useState<string>("");
    const [precio, setPrecio] = useState<number>(0);
    const [cantidad, setCantidad] = useState<number>(0);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await getProductos();

                // Obtener tipos únicos de los productos
                const tiposUnicos = Array.from(new Set(data.map(producto => producto.tipo)));
                setTiposExistentes(tiposUnicos);
            } catch (error) {
                console.error("Error fetching productos:", error);
            }
        };

        fetchProductos();
    }, []);

    const handleAgregarProducto = async () => {
        const tipo = esNuevoTipo ? nuevoTipo : tipoSeleccionado;

        if (tipo && nombre && precio > 0 && cantidad >= 0) {
            const nuevoProducto: Productos = {
                id: crypto.randomUUID(),
                tipo,
                nombre,
                precio,
                cantidad,
            };

            try {
                await addProducto(nuevoProducto);
                alert(`Producto agregado: ${nombre}`);
                
                // Llamar a la función para actualizar la tabla de productos
                fetchProducts();

                // Resetear el formulario
                setTipoSeleccionado(null);
                setEsNuevoTipo(false);
                setNuevoTipo("");
                setNombre("");
                setPrecio(0);
                setCantidad(0);
            } catch (error) {
                console.error("Error al agregar el producto:", error);
                alert("Hubo un error al agregar el producto. Inténtalo de nuevo.");
            }
        } else {
            alert("Por favor, completa todos los campos correctamente.");
        }
    };

    return (
        <div className="space-y-6 p-6 bg-white rounded shadow-lg max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-gray-800">Agregar Nuevo Producto</h2>
    
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Producto</label>
                <select
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "nuevo") {
                            setEsNuevoTipo(true);
                            setTipoSeleccionado(null);
                        } else {
                            setEsNuevoTipo(false);
                            setTipoSeleccionado(value);
                        }
                    }}
                    value={esNuevoTipo ? "nuevo" : tipoSeleccionado || ""}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="" disabled>
                        Selecciona un tipo existente o crea uno nuevo
                    </option>
                    {tiposExistentes.map((tipo) => (
                        <option key={tipo} value={tipo}>
                            {tipo}
                        </option>
                    ))}
                    <option value="nuevo">Crear nuevo tipo</option>
                </select>
    
                {esNuevoTipo && (
                    <input
                        type="text"
                        value={nuevoTipo}
                        onChange={(e) => setNuevoTipo(e.target.value)}
                        placeholder="Escribe el nuevo tipo de producto"
                        className="w-full mt-3 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                )}
            </div>
    
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre del producto"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
    
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                <input
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(parseFloat(e.target.value))}
                    min="0"
                    placeholder="Precio del producto"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
    
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                <input
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(parseInt(e.target.value))}
                    min="0"
                    placeholder="Cantidad en inventario"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
    
            <button
                onClick={handleAgregarProducto}
                className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
            >
                Agregar Producto
            </button>
        </div>
    );
    
}

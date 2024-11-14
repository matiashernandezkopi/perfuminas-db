'use client';

import { useEffect, useState } from "react";
import {  updateProductoByID } from "../lib/productos";
import { ContextType, useProductos } from "../context/productosContext"; // Asegúrate de que esta ruta sea correcta
import { addVentaToday } from "../lib/ventas";


interface ProductoSeleccionado {
    id: string;
    tipo: string;
    nombre: string;
    precio: number;
    cantidad: number;
    cantidadComprada: number;
}

export function ProductosForm() {
    const { productos, fetchProducts } = useProductos() as ContextType
    const [tipos, setTipos] = useState<string[]>([]);
    const [productosFiltrados, setProductosFiltrados] = useState<Productos[]>([]);
    const [tipoSeleccionado, setTipoSeleccionado] = useState<string | null>(null);
    const [productoSeleccionado, setProductoSeleccionado] = useState<Productos | null>(null);
    const [cantidad, setCantidad] = useState<number>(0);
    const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);

    useEffect(() => {
        const tiposUnicos = Array.from(new Set(productos.map(producto => producto.tipo)));
        setTipos(tiposUnicos);
    }, [productos]); // Actualiza los tipos cuando los productos cambien

    const handleTipoSeleccionado = (tipo: string) => {
        setTipoSeleccionado(tipo);
        setProductosFiltrados(productos.filter(producto => producto.tipo === tipo));
        setProductoSeleccionado(null);
        setCantidad(0);
    };

    const handleProductoSeleccionado = (id: string) => {
        const producto = productosFiltrados.find(prod => prod.id === id);
        if (producto) {
            setProductoSeleccionado({
                id: producto.id,
                tipo: producto.tipo,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: producto.cantidad ?? 0,
            });
            setCantidad(0);
        }
    };

    const handleCantidadChange = (cantidad: number) => {
        setCantidad(cantidad);
    };

    const agregarProducto = () => {
        if (productoSeleccionado && cantidad > 0 && cantidad <= productoSeleccionado.cantidad) {
            const productoYaSeleccionado = productosSeleccionados.find(p => p.id === productoSeleccionado.id);

            if (productoYaSeleccionado) {
                productoYaSeleccionado.cantidadComprada += cantidad;
                setProductosSeleccionados([...productosSeleccionados]); // Actualiza el estado
            } else {
                setProductosSeleccionados([...productosSeleccionados, {
                    ...productoSeleccionado,
                    cantidadComprada: cantidad,
                }]);
            }

            setProductoSeleccionado(null);
            setCantidad(0);
        } else {
            alert("Cantidad no válida o insuficiente en inventario.");
        }
    };

    const quitarProducto = (id: string) => {
        const nuevosProductosSeleccionados = productosSeleccionados.filter(prod => prod.id !== id);
        setProductosSeleccionados(nuevosProductosSeleccionados);
    };

    // Define un tipo para las cantidades
    type CantidadesNuevas = {
        [key: string]: number; // Clave es un string (ID del producto), valor es un número (cantidad)
    };

    const handleComprar = async () => {
        try {
            // Crea un objeto para almacenar las cantidades nuevas de cada producto
            const cantidadesNuevas: CantidadesNuevas = { ...productos.reduce((acc, prod) => ({ ...acc, [prod.id]: prod.cantidad }), {}) };

            // Añade la venta a la DB
            const productosVendidos = productosSeleccionados.map(producto=> `${producto.cantidadComprada} ${producto.tipo} ${producto.nombre} Unidad: ${producto.precio} Total: ${producto.precio*producto.cantidadComprada} `)
            const ventaProductos = productosVendidos.join('|')
            console.log('asasas',ventaProductos)
            addVentaToday({productos:ventaProductos, cantidad: total})

            for (const producto of productosSeleccionados) {
                const nuevaCantidad = cantidadesNuevas[producto.id] - producto.cantidadComprada;
        
                // Actualiza las cantidades en el objeto
                cantidadesNuevas[producto.id] = nuevaCantidad;
        
                // Actualizar el producto en la base de datos
                await updateProductoByID(producto.id, { cantidad: nuevaCantidad });
            }
            
            // Actualiza el contexto con las cantidades nuevas
            fetchProducts(); // Refresca la lista de productos desde la base de datos
        
            alert("Compra realizada con éxito");
            fetchProducts()
            setProductosSeleccionados([]); // Reinicia los productos seleccionados
        } catch (error) {
            console.error("Error al realizar la compra:", error);
            alert("Hubo un error al realizar la compra. Inténtalo de nuevo.");
        }
    };

    const total = productosSeleccionados.reduce((sum, prod) => sum + (prod.precio * prod.cantidadComprada), 0);

    return (
        <div className="space-y-4">
            <div>
                <h2>Elige un Tipo de Producto</h2>
                <select onChange={(e) => handleTipoSeleccionado(e.target.value)} value={tipoSeleccionado || ""}>
                    <option value="" disabled>Selecciona un tipo</option>
                    {tipos.map((tipo) => (
                        <option key={tipo} value={tipo}>
                            {tipo}
                        </option>
                    ))}
                </select>
            </div>

            {tipoSeleccionado && (
                <div>
                    <h2>Elige un Producto</h2>
                    <select onChange={(e) => handleProductoSeleccionado(e.target.value)} value={productoSeleccionado?.id || ""}>
                        <option value="" disabled>Selecciona un producto</option>
                        {productosFiltrados.map((producto) => (
                            <option key={producto.id} value={producto.id}>
                                {producto.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {productoSeleccionado && (
                <div>
                    <h2>Cantidad</h2>
                    <input
                        type="number"
                        min="1"
                        max={productoSeleccionado.cantidad}
                        value={cantidad}
                        onChange={(e) => handleCantidadChange(parseInt(e.target.value))}
                    />
                </div>
            )}

            {productoSeleccionado && (
                <button onClick={agregarProducto} className="btn btn-primary">
                    Agregar a la Compra
                </button>
            )}

            <div>
                <h3>Productos Seleccionados</h3>
                <ul>
                    {productosSeleccionados.map((prod) => (
                        <li key={prod.id}>
                            {prod.nombre} - {prod.cantidadComprada} unidades - ${prod.precio * prod.cantidadComprada}
                            <button onClick={() => quitarProducto(prod.id)} className="ml-2 text-red-600">
                                Quitar
                            </button>
                        </li>
                    ))}
                </ul>
                <h3>Total a Pagar: ${total.toFixed(2)}</h3>
            </div>

            {productosSeleccionados.length > 0 && (
                <button onClick={handleComprar} className="btn btn-success">
                    Comprar Todo
                </button>
            )}
        </div>
    );
}
// ProductsContext.js
'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { getProductos, updateProductoByID, deleteProductoById } from '../lib/productos'; // Asegúrate de que la ruta sea correcta
import { getVentas } from '../lib/ventas';

// Crea el contexto

export interface ContextType {
    productos: Productos[];
    updateProducto: (id: string, cantidad: number) => Promise<void>;
    removeProducto: (id: string) => Promise<void>;
    fetchProducts: () => void;

    ventas: Ventas[];
    fetchVentas: () => void;
}


const ProductsContext = createContext<ContextType | undefined>(undefined);

// Proveedor del contexto
export const ProductsProvider = ({ children }: { children: ReactNode }) => {
    const [productos, setProductos] = useState<Productos[]>([]);
    const [ventas, setVentas] = useState<Ventas[]>([]);

    const fetchVentas = useCallback(async () => {
        try {
            const ventasDesdeDB = await getVentas();
            setVentas(ventasDesdeDB);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            const productosDesdeDB = await getProductos();
            setProductos(productosDesdeDB);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, []);

    useEffect(() => {
        fetchProducts(); // Obtiene los productos al iniciar
    }, [fetchProducts]);

    // Asegúrate de que la función updateProducto esté correctamente tipada
    const updateProducto = async (id: string, cantidad: number) => {
        try {
            await updateProductoByID(id, { cantidad }); // Actualiza en Firebase
            fetchProducts(); // Vuelve a obtener productos para actualizar el estado
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };


    const removeProducto = async (id:string) => {
        try {
            await deleteProductoById(id); // Elimina en Firebase
            fetchProducts(); // Vuelve a obtener productos para actualizar el estado
        } catch (error) {
            console.error('Error removing product:', error);
        }
    };

    return (
        <ProductsContext.Provider value={{ productos, updateProducto, removeProducto, fetchProducts, ventas, fetchVentas }}>
            {children}
        </ProductsContext.Provider>
    );
};

// Hook para usar el contexto
export const useProductos = () => {
    return useContext(ProductsContext);
};

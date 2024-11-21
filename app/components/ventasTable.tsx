'use client'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { ContextType, useProductos } from "../context/productosContext";
import { deleteVentaById } from "../lib/ventas";

export function VentasTable() {
    const { ventas, fetchVentas } = useProductos() as ContextType;

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Número de ventas por página

    const totalPages = Math.ceil(ventas.length / itemsPerPage);

    useEffect(() => {
        fetchVentas();
    }, [fetchVentas]);

    const handlePageChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        } else if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteVentaById(id);
            fetchVentas(); // Refresca la lista de ventas después de eliminar
        } catch (error) {
            console.error(`Error al eliminar la venta con ID ${id}:`, error);
        }
    };

    // Ordenar las ventas por fecha (más recientes primero)
    const sortedVentas = [...ventas].sort((a, b) => {
        const parseDate = (fecha: string) => {
            const [day, month, year] = fecha.split("/").map(Number);
            return new Date(year, month - 1, day); // Convertir a objeto Date
        };
        return parseDate(b.fecha).getTime() - parseDate(a.fecha).getTime();
    });

    // Aplicar paginación
    const paginatedVentas = sortedVentas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex flex-col h-full w-full">
            <Table>
                <TableCaption>A list of your products.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead className="text-right">Cantidad</TableHead>
                        <TableHead className="text-right">Productos</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedVentas.map((venta) => (
                        <TableRow key={venta.id}>
                            <TableCell>{venta.fecha}</TableCell>
                            <TableCell className="text-right">{venta.cantidad.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</TableCell>
                            <TableCell className="text-right">
                                {venta.productos.split('|').map((producto, index) => (
                                    <div key={index}>{producto}</div>
                                ))}
                            </TableCell>
                            <TableCell className="text-right">
                                <button
                                    onClick={() => handleDelete(venta.id)}
                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Eliminar
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3} className="text-right">Total vendido</TableCell>
                        <TableCell className="text-right">
                            {ventas.reduce((acc, producto) => acc + (producto.cantidad ?? 0), 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => handlePageChange('prev')}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                <span>
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange('next')}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}

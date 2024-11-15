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
import { useEffect } from "react";
import { ContextType, useProductos } from "../context/productosContext";

export function VentasTable() {
    const { ventas, fetchVentas } = useProductos() as ContextType

    useEffect(() => {
        fetchVentas();
    }, [fetchVentas]);

    return (
        <div className=" flex h-full w-full">
            <Table>
                <TableCaption>A list of your products.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead className="text-right">Cantidad</TableHead>
                        <TableHead className="text-right">Productos</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ventas.map((venta) => (
                        <TableRow key={venta.id}>
                            <TableCell>{venta.fecha}</TableCell>
                            <TableCell className="text-right">{venta.cantidad.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</TableCell>
                            <TableCell className="text-right">
                            {venta.productos.split('|').map((producto,index) => (
                                <div key={index}>{producto}</div>
                            ))}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4} className="text-right">Total vendido</TableCell>
                        <TableCell className="text-right">
                            {ventas.reduce((acc, producto) => acc + (producto.cantidad ?? 0), 0)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

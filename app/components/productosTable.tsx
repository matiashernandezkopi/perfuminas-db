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
import { ProductosForm } from "./productosForm";
import { AddProductoForm } from "./productosAddForm";
import { ContextType, useProductos } from "../context/productosContext";

export function ProductosTable() {
    const { productos, fetchProducts } = useProductos() as ContextType

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div className=" flex h-full w-full">
            <ProductosForm/>

            <AddProductoForm />

            {/* Tabla de productos */}
            <Table>
                <TableCaption>A list of your products.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead>Cantidad</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productos.map((producto) => (
                        <TableRow key={producto.id}>
                            <TableCell className="font-medium">{producto.id}</TableCell>
                            <TableCell>{producto.tipo}</TableCell>
                            <TableCell>{producto.nombre}</TableCell>
                            <TableCell className="text-right">{producto.precio}</TableCell>
                            <TableCell>{producto.cantidad ?? 'N/A'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4} className="text-right">Total de unidades</TableCell>
                        <TableCell className="text-right">
                            {productos.reduce((acc, producto) => acc + (producto.cantidad ?? 0), 0)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

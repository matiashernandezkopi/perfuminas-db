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
import { updateProductoByID } from "../lib/productos";
import ModalCantidadProductos from "./modalCantidadProductos";
import { deleteProductoById } from "../lib/productos"; // Importar la función de eliminación

export function ProductosTable() {
    const { productos, fetchProducts } = useProductos() as ContextType;

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProductos, setFilteredProductos] = useState(productos);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState<Productos|null>(null); // Producto seleccionado
    const [newCantidad, setNewCantidad] = useState(0); // Nueva cantidad del producto
    const itemsPerPage = 10;

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        setFilteredProductos(
            productos.filter((producto) =>
                producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                producto.tipo.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setCurrentPage(1);
    }, [searchTerm, productos]);

    const paginatedProductos = filteredProductos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);

    const handleCantidadClick = (producto:Productos) => {
        setSelectedProducto(producto);
        setNewCantidad(producto.cantidad ?? 0);
        setModalOpen(true); // Abrir el modal
    };

    const handleSave = async () => {
        if (selectedProducto) {
            await updateProductoByID(selectedProducto.id, { cantidad: newCantidad });
            fetchProducts(); // Refrescar productos después de actualizar
            setModalOpen(false); // Cerrar el modal
        }
    };

    return (
        <div className="flex flex-col h-full w-full space-y-4">
            {/* Buscador */}
            <div className="flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Buscar por tipo o nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded w-full max-w-sm"
                />
            </div>

            {/* Tabla de productos */}
            <Table>
                <TableCaption>A list of your products.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedProductos.map((producto) => (
                        <TableRow key={producto.id}>
                            <TableCell>{producto.tipo}</TableCell>
                            <TableCell>{producto.nombre}</TableCell>
                            <TableCell className="text-right">
                                {producto.precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                            </TableCell>
                            <TableCell
                                className="cursor-pointer underline"
                                onClick={() => handleCantidadClick(producto)}
                            >
                                {producto.cantidad ?? 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">
                                <button
                                   onClick={async () => {
                                        if (window.confirm(`¿Estás seguro de eliminar el producto "${producto.nombre}"?`)) {
                                            await deleteProductoById(producto.id);
                                            fetchProducts();
                                        }
                                    }}
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
                        <TableCell colSpan={4} className="text-right">Total de unidades</TableCell>
                        <TableCell className="text-right">
                            {paginatedProductos.reduce((acc, producto) => acc + (producto.cantidad ?? 0), 0)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>

            {/* Controles de paginación */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                <span>
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>

            {/* Modal para editar cantidad */}
            {modalOpen && selectedProducto && (
               <ModalCantidadProductos
               setModalOpen={setModalOpen}
               setNewCantidad={setNewCantidad}
               selectedProducto={selectedProducto}
               newCantidad={newCantidad}
               handleSave={handleSave}
           />
            )}
        </div>
    );
}

import React from 'react';

interface ModalProps {
    setModalOpen: (isOpen: boolean) => void;
    setNewCantidad: (cantidad: number) => void;
    selectedProducto: { nombre: string };
    newCantidad: number;
    handleSave: () => void;
}

const ModalCantidadProductos: React.FC<ModalProps> = ({
    setModalOpen,
    setNewCantidad,
    selectedProducto,
    newCantidad,
    handleSave,
}) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow-lg space-y-4">
            <h2 className="text-lg font-bold">Editar cantidad</h2>
            <p>Producto: <strong>{selectedProducto.nombre}</strong></p>
            <input
                type="number"
                value={newCantidad}
                onChange={(e) => setNewCantidad(Number(e.target.value))}
                className="border p-2 w-full rounded"
                min={0}
            />
            <div className="flex justify-end space-x-4">
                <button
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Guardar
                </button>
            </div>
        </div>
    </div>
);

export default ModalCantidadProductos;

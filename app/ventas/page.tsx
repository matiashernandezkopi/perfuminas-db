import React from 'react'
import { VentasTable } from '../components/ventasTable'
import { VentasForm } from '../components/ventasForm'
import { VentasPorMes } from '../graphics/ventasPorMes'
import { VentasPorSemana } from '../graphics/ventasPorSemana'
import { VentasPorDia } from '../graphics/ventasPorDia'

function page() {
  return (
    <div className="p-4 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Gráficos de Ventas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <VentasPorDia />
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <VentasPorSemana />
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <VentasPorMes />
            </div>
        </div>

        {/* Formulario de Ventas */}
        <div className="flex p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <VentasForm />
            <VentasTable />
        </div>
    </div>
  );

}

export default page

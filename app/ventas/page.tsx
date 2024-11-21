import React from 'react'
import { VentasTable } from '../components/ventasTable'
import { VentasForm } from '../components/ventasForm'
import { VentasPorMes } from '../graphics/ventasPorMes'
import { VentasPorSemana } from '../graphics/ventasPorSemana'
import { VentasPorDia } from '../graphics/ventasPorDia'

function page() {
  return (
    <div>
      <div className='flex'>
        <VentasPorDia/>
        <VentasPorSemana/>
        <VentasPorMes/>

      </div>
      <VentasForm/>
      <VentasTable/>

    </div>
  )
}

export default page

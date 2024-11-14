import React from 'react'
import { VentasTable } from '../components/ventasTable'
import { VentasForm } from '../components/ventasForm'

function page() {
  return (
    <div>
      <VentasForm/>
      <VentasTable/>

    </div>
  )
}

export default page

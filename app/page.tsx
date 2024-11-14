

import Link from "next/link";
import { ProductosTable } from "./components/productosTable";

export default function Home() {
  return (
    <div className=" w-screen h-screen flex">
      <Link
          href='/ventas'
          className={`block text-white font-semibold py-2 px-4 rounded transition duration-200 bg-red-600 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600 `}
          >
          Ventas
        </Link>


      <ProductosTable/>
      
    </div>
  );
}

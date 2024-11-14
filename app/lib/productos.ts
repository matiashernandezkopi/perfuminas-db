'use client';

// lib/Productos.ts
import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Importa uuid para generar un ID único


// Función para agregar un gasto
export async function addProducto(producto: Productos) {
  try {
    const docRef = await addDoc(collection(db, 'productos'), {
      ...producto,
      id: uuidv4(),
    });
    return docRef.id; // Devuelve el ID generado del producto
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('No se pudo agregar el producto');
  }
}


// Función para obtener los gastos del usuario
export async function getProductos(): Promise<Productos[]> {
  try {
    const ProductosRef = collection(db, 'productos');
    const q = query(ProductosRef);
    const snapshot = await getDocs(q);
    
    const productos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Productos, 'id'> // Agrega todos los campos restantes al tipo
    })) as Productos[]; // Asegúrate de hacer un cast a Productos[] para evitar errores de tipo

    return productos;
  } catch (error) {
    console.error('Error fetching Productos:', error);
    throw error;
  }
}

export async function updateProductoByID(id: string, data: Partial<Productos>): Promise<void> {
  try {
    const productosRef = collection(db, 'productos');
    
    // Crea la consulta para encontrar el documento que coincida con el 'id' proporcionado
    const q = query(productosRef, where('id', '==', id));
    
    // Obtiene los documentos que coinciden con la consulta
    const querySnapshot = await getDocs(q);
    
    // Verifica si se encontró al menos un documento
    if (querySnapshot.empty) {
      console.error('No se encontró ningún documento con el id:', id);
      return; // Salir si no se encontró el documento
    }
    
    // Si se encontró un documento, actualiza el primero
    const productoDoc = querySnapshot.docs[0]; // Obtiene el primer documento que coincide
    await updateDoc(doc(db, 'productos', productoDoc.id), data);
    
    console.log(`Producto ${id} actualizado correctamente con los datos:`, data);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
  }
}




// Función para eliminar un gasto
export async function deleteProductoById(id: string): Promise<void> {
  try {
    // Referencia directa al documento usando su ID
    const productoRef = collection(db, 'productos');
    
    const q = query(productoRef, where('id', '==', id));
    // Verifica si la referencia es válida antes de intentar eliminar
    const querySnapshot = await getDocs(q);
    

    // Verifica si se encontró al menos un documento
    if (querySnapshot.empty) {
      console.error(`No expense found with name ${id}`);
      return;
    }

    // Elimina todos los documentos encontrados con el nombre proporcionado
    for (const docSnapshot of querySnapshot.docs) {
      const productoRef = doc(db, 'productos', docSnapshot.id);
      await deleteDoc(productoRef);
      console.log(`producto with ID ${docSnapshot.id} deleted successfully.`);
    }
  } catch (error) {
    console.error('Error eliminando el producto de Firestore:', error);
    throw new Error(`Error al intentar eliminar el producto con ID: ${id}`);
  }
}


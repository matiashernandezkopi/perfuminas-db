'use client';

// lib/Ventas.ts
import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Importa uuid para generar un ID único


// Función para agregar un gasto
export async function addVenta(Venta: Omit<Ventas, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, 'ventas'), {
      ...Venta,
      id: uuidv4(),
    });
    return docRef.id; // Devuelve el ID generado del Venta
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('No se pudo agregar el Venta');
  }
}


export async function addVentaToday(Venta: Omit<Ventas, 'id'|'fecha'>) {
  const today = new Date().toLocaleDateString("es-ES");
  try {
    const docRef = await addDoc(collection(db, 'ventas'), {
      ...Venta,
      id: uuidv4(),
      fecha: today
    });
    return docRef.id; // Devuelve el ID generado del Venta
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('No se pudo agregar el Venta');
  }
}

// Función para obtener los gastos del usuario
export async function getVentas(): Promise<Ventas[]> {
  try {
    const VentasRef = collection(db, 'ventas');
    const q = query(VentasRef);
    const snapshot = await getDocs(q);
    
    const Ventas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Ventas, 'id'> // Agrega todos los campos restantes al tipo
    })) as Ventas[]; // Asegúrate de hacer un cast a Ventas[] para evitar errores de tipo

    return Ventas;
  } catch (error) {
    console.error('Error fetching Ventas:', error);
    throw error;
  }
}

export async function updateVentaByID(id: string, data: Partial<Ventas>): Promise<void> {
  try {
    const VentasRef = collection(db, 'ventas');
    
    // Crea la consulta para encontrar el documento que coincida con el 'id' proporcionado
    const q = query(VentasRef, where('id', '==', id));
    
    // Obtiene los documentos que coinciden con la consulta
    const querySnapshot = await getDocs(q);
    
    // Verifica si se encontró al menos un documento
    if (querySnapshot.empty) {
      console.error('No se encontró ningún documento con el id:', id);
      return; // Salir si no se encontró el documento
    }
    
    // Si se encontró un documento, actualiza el primero
    const VentaDoc = querySnapshot.docs[0]; // Obtiene el primer documento que coincide
    await updateDoc(doc(db, 'ventas', VentaDoc.id), data);
    
    console.log(`Venta ${id} actualizado correctamente con los datos:`, data);
  } catch (error) {
    console.error('Error al actualizar el Venta:', error);
  }
}




// Función para eliminar un gasto
export async function deleteVentaById(id: string): Promise<void> {
  try {
    // Referencia directa al documento usando su ID
    const VentaRef = collection(db, 'ventas');
    
    const q = query(VentaRef, where('id', '==', id));
    // Verifica si la referencia es válida antes de intentar eliminar
    const querySnapshot = await getDocs(q);
    

    // Verifica si se encontró al menos un documento
    if (querySnapshot.empty) {
      console.error(`No expense found with name ${id}`);
      return;
    }

    // Elimina todos los documentos encontrados con el nombre proporcionado
    for (const docSnapshot of querySnapshot.docs) {
      const VentaRef = doc(db, 'ventas', docSnapshot.id);
      await deleteDoc(VentaRef);
      console.log(`Venta with ID ${docSnapshot.id} deleted successfully.`);
    }
  } catch (error) {
    console.error('Error eliminando el Venta de Firestore:', error);
    throw new Error(`Error al intentar eliminar el Venta con ID: ${id}`);
  }
}


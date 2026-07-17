import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./config";
import { Product } from "../../types";

export async function getActiveProducts(): Promise<Product[]> {
  try {
    // Consultamos solo los muebles marcados como disponibles
    const q = query(collection(db, "products"), where("isAvailable", "==", true));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error("Error obteniendo productos de Firestore:", error);
    return []; // Retorna array vacío si falla, protegiendo la UI
  }
}
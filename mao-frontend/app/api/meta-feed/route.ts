import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../lib/firebase/config";

export async function GET() {
  try {
    // 1. Buscamos solo los muebles que tienes en stock
    const q = query(collection(db, "products"), where("isAvailable", "==", true));
    const querySnapshot = await getDocs(q);

    // 2. Cabeceras estrictas que Meta Business Manager exige para su CSV
    let csvContent = "id,title,description,availability,condition,price,link,image_link,brand\n";

    querySnapshot.docs.forEach((doc) => {
      const product = doc.data();
      
      // Limpiamos los textos para que las comas o saltos de línea no rompan el CSV de Facebook
      const cleanTitle = product.name.replace(/,/g, " ");
      const cleanDesc = product.description.replace(/,/g, " ").replace(/\n/g, " ");
      
      // Formateo de precio exigido por Meta (Ej: 2500000 PYG)
      const formattedPrice = `${product.price} PYG`;
      
      // URL de tu tienda (Deberás cambiar esto por tu dominio real en producción)
      const productLink = `https://mao-muebles.com/#producto-${doc.id}`;

      // Construcción de la fila del producto
      csvContent += `${doc.id},${cleanTitle},${cleanDesc},in stock,new,${formattedPrice},${productLink},${product.imageGeneral},MAO\n`;
    });

    // 3. Devolvemos el archivo como un CSV real
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        // Evitamos que Meta lea datos en caché viejos
        "Cache-Control": "s-maxage=1, stale-while-revalidate=59", 
      },
    });

  } catch (error) {
    console.error("Error generando el feed de Meta:", error);
    return new NextResponse("Error interno generando el catálogo", { status: 500 });
  }
}
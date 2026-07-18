export interface Product {
  id: string;
  name: string;
  description: string;
  materials: string;
  dimensions: string;
  price: number;
  imageGeneral: string;
  imageFrontal: string;
  imageMacro: string;
  isAvailable: boolean;
  createdAt?: any;
  originalPrice?: number; // Nueva variable para manejar promociones
  category: 'mesas' | 'sillas' | 'juegos' | 'parrillas' | 'general';
}

export type UnitOfMeasure = 'metros' | 'unidades' | 'tablas' | 'litros' | 'kg';

export interface Material {
  id?: string;
  name: string;         // Ej: Caño Estructural 30x30
  unit: UnitOfMeasure;  // Ej: metros
  unitCost: number;     // Ej: 15000 (en Gs)
  currentStock: number; // Ej: 12.5
  minStock: number;     // Ej: 5 (Para alertas de recompra)
  lastUpdated?: any;    // Timestamp de Firebase

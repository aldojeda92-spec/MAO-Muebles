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

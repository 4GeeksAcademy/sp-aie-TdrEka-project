export type OperatingCountry = "US" | "ES" | "BOTH" | "OTHER";

export type ProductType =
  | "fashion"
  | "electronics"
  | "cosmetics"
  | "food"
  | "other";

export type MonthlyShippingVolume =
  | "0-100"
  | "101-500"
  | "501-2000"
  | "2000+"
  | "not-sure";

export type ServiceOfInterest = "warehousing" | "last-mile" | "reverse";

export type Current3PL = "yes" | "no" | "evaluating";

export interface Client {
  companyName: string;
  contactPerson: string;
  corporateEmail: string;
  phone: string;
  website?: string;
  operatingCountry: OperatingCountry;
  productType: ProductType;
  monthlyShippingVolume: MonthlyShippingVolume;
  servicesOfInterest: ServiceOfInterest[];
  current3PL: Current3PL;
  comments?: string;
}

export type WarehouseOrigin = "los-angeles" | "zaragoza";

export interface Shipment {
  id: string;
  clientId: string;
  originWarehouse: WarehouseOrigin;
  carrier: string;
  status: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  weightKg: number;
  destinationCountry: string;
}

export interface WarehouseItem {
  id: string;
  sku: string;
  name: string;
  category: ProductType;
  quantity: number;
  warehouseLocation: WarehouseOrigin;
  lastUpdatedDate: string;
}

export interface Report {
  generatedDate: string;
  totalClients: number;
  clientsByCountry: Record<OperatingCountry, number>;
  clientsByProductType: Record<ProductType, number>;
  clientsByVolumeRange: Record<MonthlyShippingVolume, number>;
  averageShipmentsPerClient: number;
}

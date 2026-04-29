import type {
  Client,
  MonthlyShippingVolume,
  OperatingCountry,
  ProductType,
  Report,
  Shipment,
  WarehouseItem,
} from "../types/models";

const COUNTRIES: OperatingCountry[] = ["US", "ES", "BOTH", "OTHER"];
const PRODUCT_TYPES: ProductType[] = [
  "fashion",
  "electronics",
  "cosmetics",
  "food",
  "other",
];
const VOLUME_RANGES: MonthlyShippingVolume[] = [
  "0-100",
  "101-500",
  "501-2000",
  "2000+",
  "not-sure",
];

function countBy(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function zeroedRecord<T extends string>(keys: T[]): Record<T, number> {
  return keys.reduce<Record<T, number>>((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {} as Record<T, number>);
}

export function countClientsByCountry(clients: Client[]): Record<string, number> {
  return countBy(clients.map((client) => client.operatingCountry));
}

export function countClientsByProductType(
  clients: Client[]
): Record<string, number> {
  return countBy(clients.map((client) => client.productType));
}

export function countClientsByVolumeRange(
  clients: Client[]
): Record<string, number> {
  return countBy(clients.map((client) => client.monthlyShippingVolume));
}

export function countClientsByService(clients: Client[]): Record<string, number> {
  return countBy(
    clients
      .filter((client) => client.servicesOfInterest.length > 0)
      .flatMap((client) => client.servicesOfInterest)
  );
}

export function totalWeightByWarehouse(
  shipments: Shipment[]
): Record<string, number> {
  return shipments.reduce<Record<string, number>>((acc, shipment) => {
    const key = shipment.originWarehouse;
    acc[key] = (acc[key] ?? 0) + shipment.weightKg;
    return acc;
  }, {});
}

export function averageWeightPerShipment(shipments: Shipment[]): number {
  if (shipments.length === 0) {
    return 0;
  }

  const totalWeight = shipments
    .map((shipment) => shipment.weightKg)
    .reduce((sum, weight) => sum + weight, 0);

  return totalWeight / shipments.length;
}

export function findHeaviestShipment(shipments: Shipment[]): Shipment | null {
  return shipments.reduce<Shipment | null>((heaviest, shipment) => {
    if (!heaviest || shipment.weightKg > heaviest.weightKg) {
      return shipment;
    }

    return heaviest;
  }, null);
}

export function findLightestShipment(shipments: Shipment[]): Shipment | null {
  return shipments.reduce<Shipment | null>((lightest, shipment) => {
    if (!lightest || shipment.weightKg < lightest.weightKg) {
      return shipment;
    }

    return lightest;
  }, null);
}

export function totalStockByCategory(items: WarehouseItem[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = item.category;
    acc[key] = (acc[key] ?? 0) + item.quantity;
    return acc;
  }, {});
}

export function generateClientReport(
  clients: Client[],
  shipments: Shipment[]
): Report {
  const clientsByCountry = clients.reduce<Record<OperatingCountry, number>>(
    (acc, client) => {
      acc[client.operatingCountry] += 1;
      return acc;
    },
    zeroedRecord(COUNTRIES)
  );

  const clientsByProductType = clients.reduce<Record<ProductType, number>>(
    (acc, client) => {
      acc[client.productType] += 1;
      return acc;
    },
    zeroedRecord(PRODUCT_TYPES)
  );

  const clientsByVolumeRange = clients.reduce<Record<MonthlyShippingVolume, number>>(
    (acc, client) => {
      acc[client.monthlyShippingVolume] += 1;
      return acc;
    },
    zeroedRecord(VOLUME_RANGES)
  );

  const averageShipmentsPerClient =
    clients.length === 0 ? 0 : shipments.length / clients.length;

  return {
    generatedDate: new Date().toISOString(),
    totalClients: clients.length,
    clientsByCountry,
    clientsByProductType,
    clientsByVolumeRange,
    averageShipmentsPerClient,
  };
}

import type {
  Carrier,
  Product,
  ProductCategory,
  Shipment,
  ShipmentStatus,
} from "../types/models";

const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Fashion",
  "Electronics",
  "Cosmetics",
  "Home",
  "Other",
];

const SHIPMENT_STATUSES: ShipmentStatus[] = [
  "Pending",
  "Assigned",
  "In transit",
  "Delivered",
  "Failed",
];

type CarrierSelection = { carrier: Carrier; score: number; cost: number };

export function calculateShippingCost(
  shipment: Shipment,
  product: Product,
  carrier: Carrier
): number {
  const base: number = carrier.baseRateUSD;
  const weightCost: number =
    product.weightKg * carrier.ratePerKgUSD * shipment.quantity;
  const distanceCost: number =
    shipment.destination.distanceKm * carrier.ratePerKmUSD;
  const subtotal: number = base + weightCost + distanceCost;

  const surchargeMultiplier: number =
    shipment.priority === "Express"
      ? 1.3
      : shipment.priority === "Same-day"
        ? 1.6
        : 1;

  const total: number = subtotal * surchargeMultiplier;
  return Math.round(total * 100) / 100;
}

export function scoreCarrierForShipment(
  carrier: Carrier,
  shipment: Shipment,
  product: Product
): number {
  const operatesScore: number = carrier.operatesIn.includes(
    shipment.destination.country
  )
    ? 20
    : 0;

  const totalWeight: number = product.weightKg * shipment.quantity;
  const weightScore: number = totalWeight <= carrier.maxWeightKg ? 20 : 0;

  const priorityScore: number = carrier.acceptsPriority.includes(shipment.priority)
    ? 15
    : 0;

  const fragileScore: number = !product.isFragile || carrier.handlesFragile ? 15 : 0;

  const reliabilityScore: number = carrier.onTimeRate * 0.3;
  const score: number =
    operatesScore +
    weightScore +
    priorityScore +
    fragileScore +
    reliabilityScore;

  return Math.round(score * 100) / 100;
}

export function selectBestCarrier(
  carriers: Carrier[],
  shipment: Shipment,
  product: Product
): CarrierSelection | null {
  const suitableCarriers: CarrierSelection[] = carriers
    .map(
      (carrier: Carrier): CarrierSelection => ({
        carrier,
        score: scoreCarrierForShipment(carrier, shipment, product),
        cost: calculateShippingCost(shipment, product, carrier),
      })
    )
    .filter((option: CarrierSelection) => option.score >= 50);

  if (suitableCarriers.length === 0) {
    return null;
  }

  return suitableCarriers.reduce(
    (best: CarrierSelection, current: CarrierSelection): CarrierSelection =>
      current.cost < best.cost ? current : best
  );
}

export function countProductsByCategory(
  products: Product[]
): Record<ProductCategory, number> {
  const initialCounts: Record<ProductCategory, number> = PRODUCT_CATEGORIES.reduce(
    (acc: Record<ProductCategory, number>, category: ProductCategory) => {
      acc[category] = 0;
      return acc;
    },
    {} as Record<ProductCategory, number>
  );

  return products.reduce(
    (acc: Record<ProductCategory, number>, product: Product) => {
      acc[product.category] += 1;
      return acc;
    },
    initialCounts
  );
}

export function calculateTotalInventoryValue(products: Product[]): number {
  const total: number = products
    .map((product: Product) => product.stockQuantity * product.unitCostUSD)
    .reduce((sum: number, value: number) => sum + value, 0);

  return Math.round(total * 100) / 100;
}

export function calculateAverageShipmentDistance(shipments: Shipment[]): number {
  if (shipments.length === 0) {
    return 0;
  }

  const totalDistance: number = shipments
    .map((shipment: Shipment) => shipment.destination.distanceKm)
    .reduce((sum: number, distance: number) => sum + distance, 0);

  const average: number = totalDistance / shipments.length;
  return Math.round(average * 100) / 100;
}

export function groupShipmentsByStatus(
  shipments: Shipment[]
): Record<ShipmentStatus, Shipment[]> {
  const initialGroups: Record<ShipmentStatus, Shipment[]> = SHIPMENT_STATUSES.reduce(
    (acc: Record<ShipmentStatus, Shipment[]>, status: ShipmentStatus) => {
      acc[status] = [];
      return acc;
    },
    {} as Record<ShipmentStatus, Shipment[]>
  );

  return shipments.reduce(
    (acc: Record<ShipmentStatus, Shipment[]>, shipment: Shipment) => {
      return {
        ...acc,
        [shipment.status]: [...acc[shipment.status], shipment],
      };
    },
    initialGroups
  );
}

export function findTopCarriers(
  shipments: Shipment[],
  topN: number
): Array<{ carrier: string; count: number }> {
  if (topN <= 0) {
    return [];
  }

  const counts: Record<string, number> = shipments
    .filter((shipment: Shipment) => shipment.carrier !== null)
    .reduce((acc: Record<string, number>, shipment: Shipment) => {
      const carrierName: string = shipment.carrier as string;
      acc[carrierName] = (acc[carrierName] ?? 0) + 1;
      return acc;
    }, {});

  return Object.entries(counts)
    .map(([carrier, count]: [string, number]) => ({ carrier, count }))
    .sort((a: { carrier: string; count: number }, b: { carrier: string; count: number }) => b.count - a.count)
    .slice(0, topN);
}

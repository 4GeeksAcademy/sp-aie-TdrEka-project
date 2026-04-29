import type { Product, Shipment } from "../types/models";

export function findProductBySKU(
  products: Product[],
  sku: string
): Product | null {
  if (products.length === 0) {
    return null;
  }

  const normalizedSku: string = sku.toLowerCase();

  for (const product of products) {
    if (product.sku.toLowerCase() === normalizedSku) {
      return product;
    }
  }

  return null;
}

export function findShipmentById(
  shipments: Shipment[],
  id: string
): Shipment | null {
  if (shipments.length === 0) {
    return null;
  }

  for (const shipment of shipments) {
    if (shipment.id === id) {
      return shipment;
    }
  }

  return null;
}

/**
 * Performs binary search by product weight.
 * Warning: The input array must be pre-sorted by `weightKg` in ascending order.
 */
export function binarySearchProductByWeight(
  sortedProducts: Product[],
  targetWeight: number
): number {
  if (sortedProducts.length === 0) {
    return -1;
  }

  let left: number = 0;
  let right: number = sortedProducts.length - 1;

  while (left <= right) {
    const mid: number = Math.floor((left + right) / 2);
    const midWeight: number = sortedProducts[mid].weightKg;

    if (midWeight === targetWeight) {
      return mid;
    }

    if (midWeight < targetWeight) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

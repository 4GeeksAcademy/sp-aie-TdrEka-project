import type { Client, Shipment, WarehouseItem } from "../types/models";

export function linearSearchClientByEmail(
  clients: Client[],
  email: string
): Client | null {
  if (clients.length === 0) {
    return null;
  }

  for (const client of clients) {
    if (client.corporateEmail === email) {
      return client;
    }
  }

  return null;
}

export function linearSearchClientByCompany(
  clients: Client[],
  companyName: string
): Client | null {
  if (clients.length === 0) {
    return null;
  }

  for (const client of clients) {
    if (client.companyName === companyName) {
      return client;
    }
  }

  return null;
}

export function linearSearchShipmentById(
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

export function linearSearchItemBySku(
  items: WarehouseItem[],
  sku: string
): WarehouseItem | null {
  if (items.length === 0) {
    return null;
  }

  for (const item of items) {
    if (item.sku === sku) {
      return item;
    }
  }

  return null;
}

/**
 * Performs a binary search by company name.
 * Warning: The input array must be pre-sorted alphabetically by `companyName`.
 */
export function binarySearchClientByCompany(
  sortedClients: Client[],
  companyName: string
): number {
  if (sortedClients.length === 0) {
    return -1;
  }

  let left = 0;
  let right = sortedClients.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const comparison = sortedClients[mid].companyName.localeCompare(companyName);

    if (comparison === 0) {
      return mid;
    }

    if (comparison < 0) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

/**
 * Performs a binary search by SKU.
 * Warning: The input array must be pre-sorted alphabetically by `sku`.
 */
export function binarySearchItemBySku(
  sortedItems: WarehouseItem[],
  sku: string
): number {
  if (sortedItems.length === 0) {
    return -1;
  }

  let left = 0;
  let right = sortedItems.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const comparison = sortedItems[mid].sku.localeCompare(sku);

    if (comparison === 0) {
      return mid;
    }

    if (comparison < 0) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

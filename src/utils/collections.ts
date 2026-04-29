import type { Client, Shipment, WarehouseItem } from "../types/models";

type SortOrder = "asc" | "desc";
type ShipmentDateField = "estimatedDelivery" | "actualDelivery";
type ClientMonthlyVolume = Client extends { monthlyVolume: infer V }
  ? V
  : Client["monthlyShippingVolume"];

function toTimestamp(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : timestamp;
}

export function filterClientsByCountry(
  clients: Client[],
  country: Client["operatingCountry"]
): Client[] {
  return clients.filter((client) => client.operatingCountry === country);
}

export function filterClientsByService(
  clients: Client[],
  service: string
): Client[] {
  return clients.filter((client) =>
    client.servicesOfInterest.some((serviceItem) => serviceItem === service)
  );
}

export function filterClientsByVolumeRange(
  clients: Client[],
  volume: ClientMonthlyVolume
): Client[] {
  return clients.filter((client) => client.monthlyShippingVolume === volume);
}

export function filterShipmentsByWarehouse(
  shipments: Shipment[],
  warehouse: Shipment["originWarehouse"]
): Shipment[] {
  return shipments.filter((shipment) => shipment.originWarehouse === warehouse);
}

export function filterShipmentsByStatus(
  shipments: Shipment[],
  status: string
): Shipment[] {
  return shipments.filter((shipment) => shipment.status === status);
}

export function sortClientsByName(
  clients: Client[],
  order: SortOrder
): Client[] {
  const direction = order === "asc" ? 1 : -1;

  return [...clients].sort((a, b) =>
    a.companyName.localeCompare(b.companyName) * direction
  );
}

export function sortShipmentsByDate(
  shipments: Shipment[],
  field: ShipmentDateField,
  order: SortOrder
): Shipment[] {
  const direction = order === "asc" ? 1 : -1;

  return [...shipments].sort((a, b) => {
    const aDateValue =
      field === "estimatedDelivery"
        ? toTimestamp(a.estimatedDeliveryDate)
        : toTimestamp(a.actualDeliveryDate);
    const bDateValue =
      field === "estimatedDelivery"
        ? toTimestamp(b.estimatedDeliveryDate)
        : toTimestamp(b.actualDeliveryDate);

    // Keep missing/invalid dates at the end regardless of sort order.
    if (aDateValue === null && bDateValue === null) {
      return 0;
    }

    if (aDateValue === null) {
      return 1;
    }

    if (bDateValue === null) {
      return -1;
    }

    return (aDateValue - bDateValue) * direction;
  });
}

export function sortWarehouseItemsByQuantity(
  items: WarehouseItem[],
  order: SortOrder
): WarehouseItem[] {
  const direction = order === "asc" ? 1 : -1;

  return [...items].sort((a, b) => (a.quantity - b.quantity) * direction);
}

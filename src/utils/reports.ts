import type {
  InventoryMovement,
  Product,
  ProductCategory,
  Shipment,
  ShipmentStatus,
  WarehouseLocation,
} from "../types/models";
import {
  calculateTotalInventoryValue,
  countProductsByCategory,
  findTopCarriers,
  groupShipmentsByStatus,
} from "./transformations";
import { getMovementSummary } from "./inventory";
import {
  filterLowStockProducts,
  filterProductsByWarehouse,
} from "./collections";

export interface WarehouseReport {
  generatedAt: Date;
  warehouse: WarehouseLocation | "All";
  summary: {
    totalProducts: number;
    totalInventoryValueUSD: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
  productsByCategory: Record<ProductCategory, number>;
  shipmentsByStatus: Record<ShipmentStatus, number>;
  topCarriers: Array<{ carrier: string; count: number }>;
  movementSummary: {
    totalInbound: number;
    totalOutbound: number;
    totalAdjustments: number;
    netChange: number;
  };
  lowStockAlerts: Array<{
    sku: string;
    name: string;
    currentStock: number;
    minThreshold: number;
    deficit: number;
  }>;
}

export function generateWarehouseReport(
  products: Product[],
  shipments: Shipment[],
  movements: InventoryMovement[],
  warehouse: WarehouseLocation | "All"
): WarehouseReport {
  const scopedProducts: Product[] =
    warehouse === "All"
      ? products
      : filterProductsByWarehouse(products, warehouse);

  const lowStockProducts: Product[] = filterLowStockProducts(scopedProducts);
  const groupedShipments = groupShipmentsByStatus(shipments);

  const shipmentsByStatus: Record<ShipmentStatus, number> =
    (Object.keys(groupedShipments) as ShipmentStatus[]).reduce(
      (acc: Record<ShipmentStatus, number>, status: ShipmentStatus) => {
        acc[status] = groupedShipments[status].length;
        return acc;
      },
      {} as Record<ShipmentStatus, number>
    );

  return {
    generatedAt: new Date(),
    warehouse,
    summary: {
      totalProducts: scopedProducts.length,
      totalInventoryValueUSD: calculateTotalInventoryValue(scopedProducts),
      lowStockCount: lowStockProducts.length,
      outOfStockCount: scopedProducts.filter(
        (product: Product) => product.status === "Out of stock"
      ).length,
    },
    productsByCategory: countProductsByCategory(scopedProducts),
    shipmentsByStatus,
    topCarriers: findTopCarriers(shipments, 3),
    movementSummary: getMovementSummary(movements),
    lowStockAlerts: lowStockProducts.map((product: Product) => ({
      sku: product.sku,
      name: product.name,
      currentStock: product.stockQuantity,
      minThreshold: product.minStockThreshold,
      deficit: product.minStockThreshold - product.stockQuantity,
    })),
  };
}

export function formatReportAsText(report: WarehouseReport): string {
  const categoryLine =
    `Fashion: ${report.productsByCategory.Fashion} | ` +
    `Electronics: ${report.productsByCategory.Electronics} | ` +
    `Cosmetics: ${report.productsByCategory.Cosmetics} | ` +
    `Home: ${report.productsByCategory.Home} | ` +
    `Other: ${report.productsByCategory.Other}`;

  const statusLine =
    `Pending: ${report.shipmentsByStatus.Pending} | ` +
    `Assigned: ${report.shipmentsByStatus.Assigned} | ` +
    `In transit: ${report.shipmentsByStatus["In transit"]} | ` +
    `Delivered: ${report.shipmentsByStatus.Delivered} | ` +
    `Failed: ${report.shipmentsByStatus.Failed}`;

  const carriersText =
    report.topCarriers.length === 0
      ? "No carrier data"
      : report.topCarriers
          .map(
            (entry: { carrier: string; count: number }, index: number) =>
              `${index + 1}. ${entry.carrier} — ${entry.count} shipments`
          )
          .join("\n");

  const alertsText =
    report.lowStockAlerts.length === 0
      ? "✅ No low stock alerts"
      : report.lowStockAlerts
          .map(
            (alert) =>
              `⚠️  ${alert.sku} — ${alert.name}: ${alert.currentStock} units (min: ${alert.minThreshold}, deficit: ${alert.deficit})`
          )
          .join("\n");

  return [
    "===== TRACKFLOW WAREHOUSE REPORT =====",
    `Generated: ${report.generatedAt.toISOString()}`,
    `Warehouse: ${report.warehouse}`,
    "",
    "INVENTORY SUMMARY",
    `Total products: ${report.summary.totalProducts}`,
    `Total value: $${report.summary.totalInventoryValueUSD.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    `Low stock items: ${report.summary.lowStockCount}`,
    `Out of stock: ${report.summary.outOfStockCount}`,
    "",
    "PRODUCTS BY CATEGORY",
    categoryLine,
    "",
    "SHIPMENTS BY STATUS",
    statusLine,
    "",
    "TOP CARRIERS",
    carriersText,
    "",
    "MOVEMENT SUMMARY",
    `Inbound: +${report.movementSummary.totalInbound} | Outbound: -${report.movementSummary.totalOutbound} | Adjustments: ${report.movementSummary.totalAdjustments} | Net: ${report.movementSummary.netChange}`,
    "",
    "LOW STOCK ALERTS",
    alertsText,
    "=======================================",
  ].join("\n");
}

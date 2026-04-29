import type { Carrier, InventoryMovement, Product, Shipment } from "./types/models";
import {
  filterLowStockProducts,
  filterProductsByWarehouse,
  sortCarriersByReliability,
} from "./utils/collections";
import { binarySearchProductByWeight, findProductBySKU } from "./utils/search";
import {
  calculateShippingCost,
  calculateTotalInventoryValue,
  countProductsByCategory,
  findTopCarriers,
  groupShipmentsByStatus,
  scoreCarrierForShipment,
  selectBestCarrier,
} from "./utils/transformations";
import {
  applyInventoryMovement,
  applyMultipleMovements,
  getMovementSummary,
  projectStockLevel,
} from "./utils/inventory";
import { formatReportAsText, generateWarehouseReport } from "./utils/reports";
import { validateCarrier, validateProduct } from "./utils/validations";

const sampleProducts: Product[] = [
  {
    sku: "SHOE-BLK-42",
    name: "Black Running Shoes - Size 42",
    category: "Fashion",
    weightKg: 0.8,
    dimensions: { lengthCm: 35, widthCm: 22, heightCm: 12 },
    warehouse: "Los Angeles",
    stockQuantity: 45,
    minStockThreshold: 20,
    unitCostUSD: 35.0,
    isFragile: false,
    status: "Active",
  },
  {
    sku: "LAPTOP-DELL-15",
    name: "Dell Laptop 15 inch",
    category: "Electronics",
    weightKg: 2.3,
    dimensions: { lengthCm: 40, widthCm: 28, heightCm: 3 },
    warehouse: "Zaragoza",
    stockQuantity: 8,
    minStockThreshold: 10,
    unitCostUSD: 650.0,
    isFragile: true,
    status: "Low stock",
  },
  {
    sku: "PERFUME-COCO-50",
    name: "Coco Perfume 50ml",
    category: "Cosmetics",
    weightKg: 0.3,
    dimensions: { lengthCm: 12, widthCm: 8, heightCm: 15 },
    warehouse: "Los Angeles",
    stockQuantity: 120,
    minStockThreshold: 30,
    unitCostUSD: 85.0,
    isFragile: true,
    status: "Active",
  },
  {
    sku: "LAMP-WOOD-01",
    name: "Wooden Table Lamp",
    category: "Home",
    weightKg: 1.9,
    dimensions: { lengthCm: 28, widthCm: 28, heightCm: 45 },
    warehouse: "Zaragoza",
    stockQuantity: 3,
    minStockThreshold: 6,
    unitCostUSD: 42.5,
    isFragile: true,
    status: "Low stock",
  },
  {
    sku: "MISC-KIT-99",
    name: "Utility Starter Kit",
    category: "Other",
    weightKg: 1.1,
    dimensions: { lengthCm: 20, widthCm: 15, heightCm: 10 },
    warehouse: "Los Angeles",
    stockQuantity: 60,
    minStockThreshold: 15,
    unitCostUSD: 19.99,
    isFragile: false,
    status: "Active",
  },
];

const sampleCarriers: Carrier[] = [
  {
    id: "CAR-UPS",
    name: "UPS",
    operatesIn: ["United States"],
    baseRateUSD: 5.0,
    ratePerKgUSD: 1.2,
    ratePerKmUSD: 0.05,
    avgDeliveryDays: 3,
    onTimeRate: 88,
    maxWeightKg: 30,
    handlesFragile: true,
    acceptsPriority: ["Standard", "Express"],
  },
  {
    id: "CAR-SEUR",
    name: "SEUR",
    operatesIn: ["Spain"],
    baseRateUSD: 6.5,
    ratePerKgUSD: 1.5,
    ratePerKmUSD: 0.08,
    avgDeliveryDays: 2,
    onTimeRate: 92,
    maxWeightKg: 25,
    handlesFragile: true,
    acceptsPriority: ["Standard", "Express", "Same-day"],
  },
  {
    id: "CAR-DHL",
    name: "DHL Express",
    operatesIn: ["United States", "Spain"],
    baseRateUSD: 12.0,
    ratePerKgUSD: 2.0,
    ratePerKmUSD: 0.1,
    avgDeliveryDays: 1,
    onTimeRate: 95,
    maxWeightKg: 50,
    handlesFragile: true,
    acceptsPriority: ["Express", "Same-day"],
  },
];

const sampleShipment: Shipment = {
  id: "SH-2024-8821",
  sku: "LAPTOP-DELL-15",
  quantity: 1,
  origin: "Zaragoza",
  destination: {
    city: "Madrid",
    country: "Spain",
    postalCode: "28001",
    distanceKm: 320,
  },
  priority: "Express",
  declaredValueUSD: 650.0,
  carrier: null,
  status: "Pending",
  createdAt: new Date("2024-03-15"),
};

const additionalShipments: Shipment[] = [
  {
    id: "SH-2024-8822",
    sku: "SHOE-BLK-42",
    quantity: 2,
    origin: "Los Angeles",
    destination: {
      city: "San Diego",
      country: "United States",
      postalCode: "92101",
      distanceKm: 195,
    },
    priority: "Standard",
    declaredValueUSD: 70.0,
    carrier: "UPS",
    status: "Delivered",
    createdAt: new Date("2024-03-16"),
  },
  {
    id: "SH-2024-8823",
    sku: "PERFUME-COCO-50",
    quantity: 1,
    origin: "Los Angeles",
    destination: {
      city: "Barcelona",
      country: "Spain",
      postalCode: "08001",
      distanceKm: 6120,
    },
    priority: "Express",
    declaredValueUSD: 85.0,
    carrier: "DHL Express",
    status: "In transit",
    createdAt: new Date("2024-03-17"),
  },
];

const allShipments: Shipment[] = [sampleShipment, ...additionalShipments];

const inventoryMovements: InventoryMovement[] = [
  {
    id: "MOV-001",
    sku: "LAPTOP-DELL-15",
    warehouse: "Zaragoza",
    type: "Inbound",
    quantity: 20,
    reason: "Supplier restock",
    timestamp: new Date("2024-03-10T09:00:00Z"),
  },
  {
    id: "MOV-002",
    sku: "LAPTOP-DELL-15",
    warehouse: "Zaragoza",
    type: "Outbound",
    quantity: 8,
    reason: "Customer orders",
    timestamp: new Date("2024-03-14T12:30:00Z"),
  },
  {
    id: "MOV-003",
    sku: "LAPTOP-DELL-15",
    warehouse: "Zaragoza",
    type: "Adjustment",
    quantity: 1,
    reason: "Cycle count correction",
    timestamp: new Date("2024-03-15T18:45:00Z"),
  },
];

function generateLowStockAlert(products: Product[]): string {
  const lowStock: Product[] = filterLowStockProducts(products);

  if (lowStock.length === 0) {
    return "No low-stock products at the moment.";
  }

  return lowStock
    .map(
      (product: Product) =>
        `⚠️  LOW STOCK ALERT — ${product.sku}: ${product.stockQuantity} units (min: ${product.minStockThreshold})`
    )
    .join("\n");
}

const dhlCarrier: Carrier =
  sampleCarriers.find((carrier: Carrier) => carrier.id === "CAR-DHL") ?? sampleCarriers[0];

const sampleShipmentProduct: Product =
  findProductBySKU(sampleProducts, sampleShipment.sku) ?? sampleProducts[0];

const productsSortedByWeight: Product[] = [...sampleProducts].sort(
  (a: Product, b: Product) => a.weightKg - b.weightKg
);

const targetWeight: number = sampleShipmentProduct.weightKg;

const carrierScores: Array<{ carrier: string; score: number }> = sampleCarriers.map(
  (carrier: Carrier) => ({
    carrier: carrier.name,
    score: scoreCarrierForShipment(carrier, sampleShipment, sampleShipmentProduct),
  })
);

const bestCarrier = selectBestCarrier(sampleCarriers, sampleShipment, sampleShipmentProduct);

const groupedShipments = groupShipmentsByStatus(allShipments);
const groupedShipmentCounts = Object.fromEntries(
  Object.entries(groupedShipments).map(([status, items]: [string, Shipment[]]) => [
    status,
    items.length,
  ])
);

const invalidProduct: Product = {
  ...sampleProducts[0],
  sku: "",
  weightKg: -1,
  unitCostUSD: 0,
};

const invalidCarrier: Carrier = {
  ...sampleCarriers[0],
  onTimeRate: 150,
  operatesIn: [],
};

console.log("Inventory movements (LAPTOP-DELL-15):", inventoryMovements);
console.log(
  "1. filterProductsByWarehouse (Los Angeles):",
  filterProductsByWarehouse(sampleProducts, "Los Angeles")
);
console.log("2. filterLowStockProducts:", filterLowStockProducts(sampleProducts));
console.log(
  "3. sortCarriersByReliability (desc):",
  sortCarriersByReliability(sampleCarriers, "desc")
);
console.log(
  "4. findProductBySKU (laptop-dell-15):",
  findProductBySKU(sampleProducts, "laptop-dell-15")
);
console.log(
  "5. binarySearchProductByWeight (on weight-sorted products):",
  binarySearchProductByWeight(productsSortedByWeight, targetWeight)
);
console.log(
  "6. calculateShippingCost (sample shipment with DHL):",
  calculateShippingCost(sampleShipment, sampleShipmentProduct, dhlCarrier)
);
console.log("7. scoreCarrierForShipment (all carriers):", carrierScores);
console.log(
  "8. selectBestCarrier (winner):",
  bestCarrier
    ? {
        winner: bestCarrier.carrier.name,
        score: bestCarrier.score,
        cost: bestCarrier.cost,
      }
    : null
);
console.log("9. countProductsByCategory:", countProductsByCategory(sampleProducts));
console.log(
  "10. calculateTotalInventoryValue:",
  calculateTotalInventoryValue(sampleProducts)
);
console.log("11. groupShipmentsByStatus (counts):", groupedShipmentCounts);
console.log("12. findTopCarriers (topN = 2):", findTopCarriers(allShipments, 2));
console.log("13. validateProduct (invalid product):", validateProduct(invalidProduct));
console.log("14. validateCarrier (invalid carrier):", validateCarrier(invalidCarrier));
console.log("BONUS. generateLowStockAlert:\n" + generateLowStockAlert(sampleProducts));

// ===== BONUS UTILITIES SECTION =====
const sampleMovements: InventoryMovement[] = [
  {
    id: "MOV-001",
    sku: "LAPTOP-DELL-15",
    warehouse: "Zaragoza",
    type: "Inbound",
    quantity: 15,
    reason: "Restock from supplier",
    timestamp: new Date("2024-03-10"),
  },
  {
    id: "MOV-002",
    sku: "LAPTOP-DELL-15",
    warehouse: "Zaragoza",
    type: "Outbound",
    quantity: 3,
    reason: "Order fulfillment",
    timestamp: new Date("2024-03-12"),
  },
  {
    id: "MOV-003",
    sku: "SHOE-BLK-42",
    warehouse: "Los Angeles",
    type: "Adjustment",
    quantity: 40,
    reason: "Stock count correction",
    timestamp: new Date("2024-03-14"),
  },
];

const laptopProduct: Product =
  findProductBySKU(sampleProducts, "LAPTOP-DELL-15") ?? sampleProducts[0];
const inboundMovement: InventoryMovement = sampleMovements[0];
const inboundAppliedProduct: Product = applyInventoryMovement(
  laptopProduct,
  inboundMovement
);

console.log("BONUS 1 — applyInventoryMovement (MOV-001 Inbound +15):", {
  before: {
    stockQuantity: laptopProduct.stockQuantity,
    status: laptopProduct.status,
  },
  after: {
    stockQuantity: inboundAppliedProduct.stockQuantity,
    status: inboundAppliedProduct.status,
  },
});

const sequentialMovements: InventoryMovement[] = [sampleMovements[0], sampleMovements[1]];
const multiAppliedProduct: Product = applyMultipleMovements(
  laptopProduct,
  sequentialMovements
);

console.log("BONUS 2 — applyMultipleMovements final stockQuantity:", {
  stockQuantity: multiAppliedProduct.stockQuantity,
});

const stockProjection = projectStockLevel(laptopProduct, 1.5, 10);
console.log("BONUS 3 — projectStockLevel (1.5/day, 10 days):", stockProjection);

console.log("BONUS 4 — getMovementSummary:", getMovementSummary(sampleMovements));

const zaragozaReport = generateWarehouseReport(
  sampleProducts,
  allShipments,
  sampleMovements,
  "Zaragoza"
);

console.log("BONUS 5 — generateWarehouseReport (Zaragoza):", zaragozaReport);
console.log("BONUS 6 — formatReportAsText:\n" + formatReportAsText(zaragozaReport));

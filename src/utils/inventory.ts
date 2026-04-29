import type { InventoryMovement, Product, ProductStatus } from "../types/models";

function recalculateProductStatus(product: Product, stockQuantity: number): ProductStatus {
  if (product.status === "Discontinued") {
    return "Discontinued";
  }

  if (stockQuantity === 0) {
    return "Out of stock";
  }

  if (stockQuantity <= product.minStockThreshold) {
    return "Low stock";
  }

  return "Active";
}

export function applyInventoryMovement(
  product: Product,
  movement: InventoryMovement
): Product {
  if (movement.quantity < 0) {
    throw new Error("Movement quantity cannot be negative");
  }

  const nextStockQuantity: number =
    movement.type === "Inbound"
      ? product.stockQuantity + movement.quantity
      : movement.type === "Adjustment"
        ? movement.quantity
        : product.stockQuantity - movement.quantity;

  if (
    (movement.type === "Outbound" || movement.type === "Transfer") &&
    nextStockQuantity < 0
  ) {
    throw new Error("Insufficient stock for outbound movement");
  }

  const safeStockQuantity: number = Math.max(0, nextStockQuantity);

  return {
    ...product,
    stockQuantity: safeStockQuantity,
    status: recalculateProductStatus(product, safeStockQuantity),
  };
}

export function applyMultipleMovements(
  product: Product,
  movements: InventoryMovement[]
): Product {
  return movements.reduce(
    (currentProduct: Product, movement: InventoryMovement) =>
      applyInventoryMovement(currentProduct, movement),
    product
  );
}

export function projectStockLevel(
  product: Product,
  dailyUsageRate: number,
  daysAhead: number
): {
  projectedStock: number;
  daysUntilStockout: number | null;
  willNeedRestock: boolean;
} {
  if (dailyUsageRate < 0) {
    throw new Error("Daily usage rate cannot be negative");
  }

  if (daysAhead < 0) {
    throw new Error("Days ahead cannot be negative");
  }

  const projectedStockRaw: number = Math.max(
    0,
    product.stockQuantity - dailyUsageRate * daysAhead
  );
  const projectedStock: number = Math.round(projectedStockRaw);

  const daysUntilStockout: number | null =
    dailyUsageRate === 0
      ? null
      : Math.floor(product.stockQuantity / dailyUsageRate);

  return {
    projectedStock,
    daysUntilStockout,
    willNeedRestock: projectedStock <= product.minStockThreshold,
  };
}

export function getMovementSummary(movements: InventoryMovement[]): {
  totalInbound: number;
  totalOutbound: number;
  totalAdjustments: number;
  netChange: number;
} {
  const summary = movements.reduce(
    (
      acc: {
        totalInbound: number;
        totalOutbound: number;
        totalAdjustments: number;
      },
      movement: InventoryMovement
    ) => {
      if (movement.type === "Inbound") {
        return {
          ...acc,
          totalInbound: acc.totalInbound + movement.quantity,
        };
      }

      if (movement.type === "Outbound" || movement.type === "Transfer") {
        return {
          ...acc,
          totalOutbound: acc.totalOutbound + movement.quantity,
        };
      }

      if (movement.type === "Adjustment") {
        return {
          ...acc,
          totalAdjustments: acc.totalAdjustments + 1,
        };
      }

      return acc;
    },
    {
      totalInbound: 0,
      totalOutbound: 0,
      totalAdjustments: 0,
    }
  );

  return {
    totalInbound: summary.totalInbound,
    totalOutbound: summary.totalOutbound,
    totalAdjustments: summary.totalAdjustments,
    netChange: summary.totalInbound - summary.totalOutbound,
  };
}

import type { Carrier, Product, Shipment } from "../types/models";

type ValidationResult = { valid: boolean; errors: string[] };

export function validateProduct(product: Product): ValidationResult {
  const errors: string[] = [];

  if (product.sku.trim().length === 0) {
    errors.push("SKU must not be empty");
  }

  if (product.weightKg <= 0 || product.weightKg > 100) {
    errors.push("Weight must be between 0 and 100 kg");
  }

  const { lengthCm, widthCm, heightCm } = product.dimensions;
  const dimensionsAreValid: boolean =
    lengthCm > 0 &&
    lengthCm <= 200 &&
    widthCm > 0 &&
    widthCm <= 200 &&
    heightCm > 0 &&
    heightCm <= 200;

  if (!dimensionsAreValid) {
    errors.push("All dimensions must be between 0 and 200 cm");
  }

  if (product.stockQuantity < 0) {
    errors.push("Stock quantity cannot be negative");
  }

  if (product.minStockThreshold < 0) {
    errors.push("Min stock threshold cannot be negative");
  }

  if (product.unitCostUSD <= 0) {
    errors.push("Unit cost must be greater than 0");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateShipment(shipment: Shipment): ValidationResult {
  const errors: string[] = [];

  if (shipment.quantity <= 0) {
    errors.push("Quantity must be greater than 0");
  }

  if (shipment.declaredValueUSD <= 0) {
    errors.push("Declared value must be greater than 0");
  }

  if (shipment.destination.distanceKm < 0) {
    errors.push("Distance cannot be negative");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateCarrier(carrier: Carrier): ValidationResult {
  const errors: string[] = [];

  if (
    carrier.baseRateUSD < 0 ||
    carrier.ratePerKgUSD < 0 ||
    carrier.ratePerKmUSD < 0
  ) {
    errors.push("Carrier rates cannot be negative");
  }

  if (carrier.avgDeliveryDays <= 0) {
    errors.push("Average delivery days must be greater than 0");
  }

  if (carrier.onTimeRate < 0 || carrier.onTimeRate > 100) {
    errors.push("On-time rate must be between 0 and 100");
  }

  if (carrier.maxWeightKg <= 0) {
    errors.push("Max weight must be greater than 0");
  }

  if (carrier.operatesIn.length < 1) {
    errors.push("Carrier must operate in at least one country");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

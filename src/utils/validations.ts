import type { Client, Shipment, WarehouseItem } from "../types/models";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const OPERATING_COUNTRIES: Client["operatingCountry"][] = [
  "US",
  "ES",
  "BOTH",
  "OTHER",
];

const PRODUCT_TYPES: Client["productType"][] = [
  "fashion",
  "electronics",
  "cosmetics",
  "food",
  "other",
];

const VOLUME_RANGES: Client["monthlyShippingVolume"][] = [
  "0-100",
  "101-500",
  "501-2000",
  "2000+",
  "not-sure",
];

const CURRENT_3PL_OPTIONS: Client["current3PL"][] = ["yes", "no", "evaluating"];
const WAREHOUSES: Shipment["originWarehouse"][] = ["los-angeles", "zaragoza"];

const MESSAGES = {
  companyName: "Company name must have at least 2 characters",
  contactPerson: "Enter first and last name of contact",
  email: "Enter a valid corporate email (example: name@company.com)",
  phone: "Phone must include country code (example: +1 213 555 0147)",
  website: "If you include website, it must be a valid URL",
  country: "Select main operating country",
  product: "Select the type of product you handle",
  volume: "Select estimated monthly volume",
  services: "Select at least one service of interest",
  threepl: "Indicate if you currently work with another logistics provider",
  comments: "Comments cannot exceed 500 characters",
  shipmentId: "Shipment id is required",
  shipmentWarehouse: "Origin warehouse must be los-angeles or zaragoza",
  shipmentWeight: "Shipment weight must be a positive number greater than 0",
  shipmentEstimatedDelivery: "Estimated delivery must be a valid future date",
  sku: "SKU is required",
  quantity: "Quantity must be an integer greater than or equal to 0",
  category: "Category must be one of the allowed product types",
} as const;

function hasValue(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function extractMonthlyVolume(
  client: Partial<Client> & { monthlyVolume?: string }
): string | undefined {
  return client.monthlyShippingVolume ?? client.monthlyVolume;
}

function extractWeight(shipment: Partial<Shipment> & { weight?: number }): number | undefined {
  return shipment.weightKg ?? shipment.weight;
}

function extractEstimatedDelivery(
  shipment: Partial<Shipment> & { estimatedDelivery?: string }
): string | undefined {
  return shipment.estimatedDeliveryDate ?? shipment.estimatedDelivery;
}

function buildResult(errors: string[]): ValidationResult {
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateClient(client: Partial<Client>): ValidationResult {
  const errors: string[] = [];
  const input = client as Partial<Client> & {
    monthlyVolume?: string;
    privacyAccepted?: boolean;
  };

  if (!hasValue(input.companyName) || input.companyName!.trim().length < 2) {
    errors.push(MESSAGES.companyName);
  }

  const contactWords = (input.contactPerson ?? "").trim().split(/\s+/).filter(Boolean);
  if (contactWords.length < 2) {
    errors.push(MESSAGES.contactPerson);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((input.corporateEmail ?? "").trim())) {
    errors.push(MESSAGES.email);
  }

  if (!/^\+\d[\d\s().-]*$/.test((input.phone ?? "").trim())) {
    errors.push(MESSAGES.phone);
  }

  const website = (input.website ?? "").trim();
  if (website !== "") {
    const startsWithHttp = /^https?:\/\//i.test(website);
    let validUrl = true;
    try {
      new URL(website);
    } catch {
      validUrl = false;
    }

    if (!startsWithHttp || !validUrl) {
      errors.push(MESSAGES.website);
    }
  }

  if (!OPERATING_COUNTRIES.includes(input.operatingCountry as Client["operatingCountry"])) {
    errors.push(MESSAGES.country);
  }

  if (!PRODUCT_TYPES.includes(input.productType as Client["productType"])) {
    errors.push(MESSAGES.product);
  }

  const monthlyVolume = extractMonthlyVolume(input);
  if (!VOLUME_RANGES.includes(monthlyVolume as Client["monthlyShippingVolume"])) {
    errors.push(MESSAGES.volume);
  }

  if (!Array.isArray(input.servicesOfInterest) || input.servicesOfInterest.length === 0) {
    errors.push(MESSAGES.services);
  }

  if (!CURRENT_3PL_OPTIONS.includes(input.current3PL as Client["current3PL"])) {
    errors.push(MESSAGES.threepl);
  }

  const commentsLength = (input.comments ?? "").length;
  if (commentsLength > 500) {
    const remaining = Math.max(0, 500 - commentsLength);
    errors.push(`${MESSAGES.comments} (${remaining} remaining)`);
  }

  return buildResult(errors);
}

export function validateShipment(shipment: Partial<Shipment>): ValidationResult {
  const errors: string[] = [];
  const input = shipment as Partial<Shipment> & {
    weight?: number;
    estimatedDelivery?: string;
  };

  if (!hasValue(input.id)) {
    errors.push(MESSAGES.shipmentId);
  }

  if (!WAREHOUSES.includes(input.originWarehouse as Shipment["originWarehouse"])) {
    errors.push(MESSAGES.shipmentWarehouse);
  }

  const weight = extractWeight(input);
  if (typeof weight !== "number" || Number.isNaN(weight) || weight <= 0) {
    errors.push(MESSAGES.shipmentWeight);
  }

  const estimatedDelivery = extractEstimatedDelivery(input);
  const timestamp = estimatedDelivery ? Date.parse(estimatedDelivery) : Number.NaN;
  if (Number.isNaN(timestamp) || timestamp <= Date.now()) {
    errors.push(MESSAGES.shipmentEstimatedDelivery);
  }

  return buildResult(errors);
}

export function validateWarehouseItem(item: Partial<WarehouseItem>): ValidationResult {
  const errors: string[] = [];

  if (!hasValue(item.sku)) {
    errors.push(MESSAGES.sku);
  }

  if (
    typeof item.quantity !== "number" ||
    Number.isNaN(item.quantity) ||
    !Number.isInteger(item.quantity) ||
    item.quantity < 0
  ) {
    errors.push(MESSAGES.quantity);
  }

  if (!PRODUCT_TYPES.includes(item.category as Client["productType"])) {
    errors.push(MESSAGES.category);
  }

  return buildResult(errors);
}

export function isLowVolumeWarning(client: Partial<Client>): boolean {
  const input = client as Partial<Client> & { monthlyVolume?: string };
  return extractMonthlyVolume(input) === "0-100";
}

export function validatePrivacyAccepted(
  accepted: boolean | undefined
): ValidationResult {
  if (accepted !== true) {
    return {
      valid: false,
      errors: ["You must accept the privacy policy to continue"],
    };
  }

  return {
    valid: true,
    errors: [],
  };
}

import type { Client, Shipment, WarehouseItem } from "./types/models";
import * as collections from "./utils/collections";
import * as search from "./utils/search";
import * as transformations from "./utils/transformations";
import * as validations from "./utils/validations";

const clients: Client[] = [
  {
    companyName: "Aster Fashion Co",
    contactPerson: "Mia Carter",
    corporateEmail: "ops@asterfashion.com",
    phone: "+1 213 555 0101",
    website: "https://asterfashion.com",
    operatingCountry: "US",
    productType: "fashion",
    monthlyShippingVolume: "101-500",
    servicesOfInterest: ["warehousing", "last-mile"],
    current3PL: "yes",
    comments: "Needs same-day options in LA.",
  },
  {
    companyName: "VoltEdge Electronics",
    contactPerson: "Luis Navarro",
    corporateEmail: "contact@voltedge.io",
    phone: "+34 976 555 102",
    website: "https://voltedge.io",
    operatingCountry: "ES",
    productType: "electronics",
    monthlyShippingVolume: "501-2000",
    servicesOfInterest: ["last-mile", "reverse"],
    current3PL: "evaluating",
  },
  {
    companyName: "BloomSkin Labs",
    contactPerson: "Nora Blake",
    corporateEmail: "team@bloomskin.com",
    phone: "+1 323 555 0199",
    operatingCountry: "BOTH",
    productType: "cosmetics",
    monthlyShippingVolume: "2000+",
    servicesOfInterest: ["warehousing", "reverse"],
    current3PL: "no",
  },
  {
    companyName: "FreshCrate Market",
    contactPerson: "Pablo Ortiz",
    corporateEmail: "hello@freshcrate.es",
    phone: "+34 640 555 778",
    operatingCountry: "OTHER",
    productType: "food",
    monthlyShippingVolume: "0-100",
    servicesOfInterest: ["warehousing"],
    current3PL: "no",
  },
  {
    companyName: "Circuit Nest",
    contactPerson: "Emma Reed",
    corporateEmail: "logistics@circuitnest.com",
    phone: "+1 562 555 0188",
    website: "https://circuitnest.com",
    operatingCountry: "US",
    productType: "electronics",
    monthlyShippingVolume: "not-sure",
    servicesOfInterest: ["last-mile"],
    current3PL: "yes",
  },
  {
    companyName: "MonoCos",
    contactPerson: "Alex",
    corporateEmail: "",
    phone: "+1 424 555 0177",
    operatingCountry: "US",
    productType: "cosmetics",
    monthlyShippingVolume: "0-100",
    servicesOfInterest: ["reverse"],
    current3PL: "evaluating",
    comments: "Potential pilot account.",
  },
];

const shipments: Shipment[] = [
  {
    id: "SHP-1001",
    clientId: "Aster Fashion Co",
    originWarehouse: "los-angeles",
    carrier: "SwiftShip",
    status: "in-transit",
    estimatedDeliveryDate: "2026-05-05T12:00:00.000Z",
    actualDeliveryDate: undefined,
    weightKg: 42.5,
    destinationCountry: "US",
  },
  {
    id: "SHP-1002",
    clientId: "Circuit Nest",
    originWarehouse: "los-angeles",
    carrier: "ParcelFly",
    status: "delivered",
    estimatedDeliveryDate: "2026-05-03T10:00:00.000Z",
    actualDeliveryDate: "2026-05-03T09:32:00.000Z",
    weightKg: 18.2,
    destinationCountry: "US",
  },
  {
    id: "SHP-2001",
    clientId: "VoltEdge Electronics",
    originWarehouse: "zaragoza",
    carrier: "IberiaExpress",
    status: "processing",
    estimatedDeliveryDate: "2026-05-06T15:00:00.000Z",
    actualDeliveryDate: undefined,
    weightKg: 55.9,
    destinationCountry: "ES",
  },
  {
    id: "SHP-2002",
    clientId: "BloomSkin Labs",
    originWarehouse: "zaragoza",
    carrier: "EuroRoad",
    status: "in-transit",
    estimatedDeliveryDate: "2026-05-07T16:30:00.000Z",
    actualDeliveryDate: undefined,
    weightKg: 31.4,
    destinationCountry: "FR",
  },
];

const warehouseItems: WarehouseItem[] = [
  {
    id: "ITM-01",
    sku: "FASH-TSHIRT-001",
    name: "Premium Cotton Tee",
    category: "fashion",
    quantity: 320,
    warehouseLocation: "los-angeles",
    lastUpdatedDate: "2026-04-28T08:30:00.000Z",
  },
  {
    id: "ITM-02",
    sku: "ELEC-EARBUD-210",
    name: "Wireless Earbuds Pro",
    category: "electronics",
    quantity: 140,
    warehouseLocation: "los-angeles",
    lastUpdatedDate: "2026-04-28T09:10:00.000Z",
  },
  {
    id: "ITM-03",
    sku: "COSM-SERUM-080",
    name: "Hydra Glow Serum",
    category: "cosmetics",
    quantity: 500,
    warehouseLocation: "zaragoza",
    lastUpdatedDate: "2026-04-28T10:15:00.000Z",
  },
  {
    id: "ITM-04",
    sku: "FOOD-BAR-030",
    name: "Protein Snack Bar",
    category: "food",
    quantity: 900,
    warehouseLocation: "zaragoza",
    lastUpdatedDate: "2026-04-28T11:20:00.000Z",
  },
];

const sortedClients = collections.sortClientsByName(clients, "asc");
const targetEmail = "team@bloomskin.com";
const targetCompany = "Circuit Nest";
const invalidClient = clients.find((client) => client.companyName === "MonoCos") ?? null;
const lowVolumeClient = clients.find(
  (client) => client.companyName === "FreshCrate Market"
) ?? null;

console.log("1. US clients:", collections.filterClientsByCountry(clients, "US"));
console.log("2. Clients sorted by name (asc):", sortedClients);
console.log(
  "3. Linear search by email:",
  search.linearSearchClientByEmail(clients, targetEmail)
);
console.log(
  "4. Binary search index by company on sorted clients:",
  search.binarySearchClientByCompany(sortedClients, targetCompany)
);
console.log(
  "5. Clients by product type:",
  transformations.countClientsByProductType(clients)
);
console.log("6. Generated client report:", transformations.generateClientReport(clients, shipments));
console.log(
  "7. Invalid client validation errors:",
  invalidClient ? validations.validateClient(invalidClient).errors : ["Invalid client sample not found"]
);
console.log(
  "8. Low-volume warning:",
  lowVolumeClient ? validations.isLowVolumeWarning(lowVolumeClient) : false
);

void warehouseItems;

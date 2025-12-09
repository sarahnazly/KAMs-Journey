import { KPIKey } from "@/interfaces/evaluasi/types";

export interface KPIDefinition {
  key: KPIKey;
  name: string;
  description?:  string;
}

export interface KPISubcategory {
  key: string;
  name: string;
  kpis: KPIDefinition[];
}

export interface KPICategory {
  key: string;
  name: string;
  hasSubcategories: boolean;
  subcategories: KPISubcategory[];
}

/**
 * KPI taxonomy
 * 
 * Overview Tab (no subcategories):
 * - Revenue Sales Achievement
 * - Sales Achievement DATin  
 * - Collection Rate Achievement
 * - Profitability Achievement
 * - NPS Achievement
 * - AE Tools Achievement
 * 
 * Result Tab (with subcategories):
 * - Financial Metrics: Revenue, Profitability, Collection Rate
 * - Sales Performance: All 4 sales KPIs (Datin, WiFi, HSI, Wireline)
 * - Customer: NPS
 * 
 * Process Tab (no subcategories):
 * - AE Tools Achievement
 * - Capability Achievement
 * - Behaviour Achievement
 */
export const KPI_CATEGORIES:  KPICategory[] = [
  {
    key: "overview",
    name: "Overview",
    hasSubcategories:  false,
    subcategories:  [
      {
        key:  "overview",
        name: "Overview",
        kpis: [
          {
            key: "revenueSales",
            name: "Revenue Sales Achievement",
            description: "Overall revenue target achievement",
          },
          {
            key: "profitability",
            name: "Profitability Achievement",
            description: "Profit margin achievement",
          },
          {
            key: "nps",
            name: "NPS Achievement",
            description: "Net Promoter Score",
          },
          {
            key: "aeTools",
            name: "AE Tools Achievement",
            description: "Account Executive tools utilization",
          },
        ],
      },
    ],
  },
  {
    key: "result",
    name: "Result",
    hasSubcategories: true,
    subcategories: [
      {
        key: "financial",
        name: "Financial Metrics",
        kpis: [
          {
            key: "revenueSales",
            name:  "Revenue Sales Achievement",
            description: "Overall revenue target achievement",
          },
          {
            key: "profitability",
            name: "Profitability Achievement",
            description: "Profit margin achievement",
          },
          {
            key: "collectionRate",
            name: "Collection Rate Achievement",
            description: "Payment collection rate",
          },
        ],
      },
      {
        key: "sales",
        name: "Sales Performance",
        kpis: [
          {
            key: "salesDatin",
            name: "Sales Datin Achievement",
            description:  "Data and Internet product sales (Datin)",
          },
          {
            key: "salesWifi",
            name: "Sales WiFi Achievement",
            description: "WiFi product sales",
          },
          {
            key: "salesHSI",
            name:  "Sales HSI Achievement",
            description: "High-Speed Internet sales",
          },
          {
            key: "salesWireline",
            name: "Sales Wireline Achievement",
            description:  "Wireline product sales",
          },
        ],
      },
      {
        key: "customer",
        name: "Customer",
        kpis: [
          {
            key: "nps",
            name: "NPS Achievement",
            description:  "Net Promoter Score - customer satisfaction",
          },
        ],
      },
    ],
  },
  {
    key: "process",
    name: "Process",
    hasSubcategories: false,
    subcategories: [
      {
        key: "process",
        name: "Process",
        kpis: [
          {
            key: "aeTools",
            name: "AE Tools Achievement",
            description: "Account Executive tools utilization",
          },
          {
            key: "capability",
            name: "Capability Achievement",
            description: "Skills and capability development",
          },
          {
            key: "behaviour",
            name: "Behaviour Achievement",
            description: "Behavioral competency assessment",
          },
        ],
      },
    ],
  },
];

// Helper:  Get all KPI keys in display order
export function getAllKPIKeys(): KPIKey[] {
  const keys: KPIKey[] = [];
  for (const category of KPI_CATEGORIES) {
    for (const subcategory of category.subcategories) {
      for (const kpi of subcategory.kpis) {
        // Avoid duplicates
        if (!keys.includes(kpi.key)) {
          keys.push(kpi.key);
        }
      }
    }
  }
  return keys;
}

// Helper: Get KPI display name
export function getKPIName(key: KPIKey): string {
  for (const category of KPI_CATEGORIES) {
    for (const subcategory of category.subcategories) {
      const kpi = subcategory.kpis.find((k) => k.key === key);
      if (kpi) return kpi.name;
    }
  }
  return key; // Fallback to key name
}

// Helper: Get KPIs by category key
export function getKPIsByCategory(categoryKey:  string): KPIDefinition[] {
  const category = KPI_CATEGORIES.find((c) => c.key === categoryKey);
  if (!category) return [];

  const kpis: KPIDefinition[] = [];
  for (const subcategory of category.subcategories) {
    kpis.push(...subcategory.kpis);
  }
  return kpis;
}

// Helper:  Get KPIs by subcategory key
export function getKPIsBySubcategory(
  categoryKey: string,
  subcategoryKey: string
): KPIDefinition[] {
  const category = KPI_CATEGORIES.find((c) => c.key === categoryKey);
  if (!category) return [];

  const subcategory = category.subcategories.find(
    (s) => s.key === subcategoryKey
  );
  return subcategory?.kpis || [];
}

// Helper: Get category and subcategory for a KPI
export function getCategoryForKPI(key: KPIKey) {
  let matched: { category: string; subcategory: string } | null = null;

  for (const category of KPI_CATEGORIES) {
    for (const sub of category.subcategories) {
      if (sub.kpis.some((k) => k.key === key)) {
        // Skip OVERVIEW unless no other match exists
        if (category.key !== "overview") {
          return {
            category: category.name,
            subcategory: sub.name,
          };
        }

        // Store as fallback if no result/process match found
        matched = {
          category: category.name,
          subcategory: sub.name,
        };
      }
    }
  }

  return matched;
}

// Helper: Check if category has subcategories
export function hasSubcategories(categoryKey: string): boolean {
  const category = KPI_CATEGORIES.find((c) => c.key === categoryKey);
  return category?.hasSubcategories ??  false;
}

// Helper: Get all subcategories for a category
export function getSubcategories(categoryKey: string): KPISubcategory[] {
  const category = KPI_CATEGORIES.find((c) => c.key === categoryKey);
  return category?.subcategories || [];
}
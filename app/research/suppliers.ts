// Supplier Atlas data layer. Reads the build-time snapshot baked from the
// India Industrial Supplier Atlas workbook (scripts/bake-suppliers.py).
// Server-imported so the directory + dashboard render to static HTML.
// NOTE: this file carries only PUBLIC fields. Contact details, GSTIN, Udyam
// and MOQ are held server-side (functions/api/_supplier-contacts.json) and
// released by /api/supplier-contacts after email capture.
import data from './_suppliers.json';

export interface Supplier {
  id: string; name: string; category: string; subSpecialty: string | null;
  city: string | null; state: string | null; region: string | null;
  year: number | null; ownership: string | null;
  plantSize: number | null; headcount: number | null;
  machineCount: number | null; machineBrands: string | null;
  maxPartSize: string | null; tolerance: string | null;
  materials: string | null; monthlyCapacity: string | null;
  leadWeeks: number | null; certifications: string | null;
  customerTiers: string | null; exportExp: string | null;
  nearestPort: string | null; revenueBand: string | null;
  website: string | null; linkedin: string | null;
  verified: string | null; rating: number | null;
}

export interface SupplierAgg {
  category: [string, number][]; ownership: [string, number][];
  states_top: [string, number][]; revenue: [string, number][];
  certs: [string, number][]; verifmix: [number, number]; exportmix: [number, number];
  cats: string[]; regs: string[]; matrix: number[][];
  precision: [string, number][]; decade: [string, number][];
}

export interface SupplierMeta {
  total: number; verified: number; avg: number; states: number;
  export: number; updated: string; version: string; agg: SupplierAgg;
}

const snapshot = data as unknown as { meta: SupplierMeta; suppliers: Supplier[] };

export const suppliers: Supplier[] = snapshot.suppliers;
export const supplierMeta: SupplierMeta = snapshot.meta;

// Distinct, sorted facet option lists derived from the public data.
function distinct(key: keyof Supplier): string[] {
  const c = new Map<string, number>();
  for (const s of suppliers) {
    const v = s[key];
    if (v != null && v !== '') c.set(String(v), (c.get(String(v)) ?? 0) + 1);
  }
  return [...c.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k);
}

export const supplierFacets = {
  category: supplierMeta.agg.category.map(([k]) => k),
  state: distinct('state'),
  certs: supplierMeta.agg.certs.map(([k]) => k),
  revenue: ['10-50 Cr', '50-100 Cr', '100-250 Cr', '250-500 Cr', '500-1000 Cr', '1000+ Cr'],
};

import { t, type Lang } from '../i18n/translations';

type TranslationKey = keyof (typeof t)['ru'];

export type ProductCategory = 'finished' | 'blades' | 'accessories';

export interface ProductDefinition {
  sku: string;
  price: number;
  category: ProductCategory;
  nameKey: TranslationKey;
  shortKey: TranslationKey;
  descKey: TranslationKey;
  audienceKey: TranslationKey;
  specs: Array<{ key: TranslationKey; value: TranslationKey }>;
  variants?: { size?: string[]; binding?: string[] };
  showReviews?: boolean;
}

export interface LocalizedProduct extends Omit<ProductDefinition, 'specs'> {
  name: string;
  short: string;
  desc: string;
  audience: string;
  specs: Array<{ key: string; value: string }>;
}

const products: ProductDefinition[] = [
  {
    sku: '001',
    price: 7800,
    category: 'finished',
    nameKey: 'product_001_name',
    shortKey: 'product_001_short',
    descKey: 'product_001_desc',
    audienceKey: 'product_001_audience',
    specs: [
      { key: 'spec_purpose', value: 'spec_value_open_ice' },
      { key: 'spec_material', value: 'spec_value_steel420' },
      { key: 'spec_compatibility', value: 'spec_value_binding' },
      { key: 'spec_length', value: 'spec_value_length_ready' },
      { key: 'spec_pair_weight', value: 'spec_value_pair_weight' },
      { key: 'spec_load', value: 'spec_value_load' },
      { key: 'spec_warranty', value: 'spec_value_warranty' },
    ],
    variants: { size: ['460 мм', '520 мм'], binding: ['NNN', 'SNS'] },
    showReviews: true,
  },
  {
    sku: '002',
    price: 9200,
    category: 'finished',
    nameKey: 'product_002_name',
    shortKey: 'product_002_short',
    descKey: 'product_002_desc',
    audienceKey: 'product_002_audience',
    specs: [
      { key: 'spec_purpose', value: 'spec_value_open_ice' },
      { key: 'spec_material', value: 'spec_value_steel420' },
      { key: 'spec_coating', value: 'spec_value_powder' },
      { key: 'spec_compatibility', value: 'spec_value_binding' },
      { key: 'spec_length', value: 'spec_value_length_ready' },
      { key: 'spec_pair_weight', value: 'spec_value_pair_weight' },
      { key: 'spec_load', value: 'spec_value_load' },
      { key: 'spec_warranty', value: 'spec_value_warranty' },
    ],
    variants: { size: ['460 мм', '520 мм'], binding: ['NNN', 'SNS'] },
    showReviews: true,
  },
  {
    sku: '003',
    price: 6600,
    category: 'blades',
    nameKey: 'product_003_name',
    shortKey: 'product_003_short',
    descKey: 'product_003_desc',
    audienceKey: 'product_003_audience',
    specs: [
      { key: 'spec_purpose', value: 'spec_value_open_ice' },
      { key: 'spec_compatibility', value: 'spec_value_binding' },
      { key: 'spec_length', value: 'spec_value_length_blade' },
      { key: 'spec_weight', value: 'spec_value_blade_weight' },
      { key: 'spec_coating', value: 'spec_value_none' },
      { key: 'spec_warranty', value: 'spec_value_warranty' },
    ],
    variants: { size: ['480 мм', '520 мм'] },
  },
  {
    sku: '004',
    price: 8000,
    category: 'blades',
    nameKey: 'product_004_name',
    shortKey: 'product_004_short',
    descKey: 'product_004_desc',
    audienceKey: 'product_004_audience',
    specs: [
      { key: 'spec_purpose', value: 'spec_value_open_ice' },
      { key: 'spec_compatibility', value: 'spec_value_binding' },
      { key: 'spec_length', value: 'spec_value_length_blade' },
      { key: 'spec_weight', value: 'spec_value_blade_weight' },
      { key: 'spec_coating', value: 'spec_value_powder' },
      { key: 'spec_warranty', value: 'spec_value_warranty' },
    ],
    variants: { size: ['480 мм', '520 мм'] },
  },
  {
    sku: '005',
    price: 1200,
    category: 'accessories',
    nameKey: 'product_005_name',
    shortKey: 'product_005_short',
    descKey: 'product_005_desc',
    audienceKey: 'product_005_audience',
    specs: [
      { key: 'spec_material', value: 'spec_value_cover_material' },
      { key: 'spec_purpose', value: 'spec_value_cover_purpose' },
      { key: 'spec_weight', value: 'spec_value_cover_weight' },
    ],
  },
  {
    sku: '006',
    price: 1200,
    category: 'accessories',
    nameKey: 'product_006_name',
    shortKey: 'product_006_short',
    descKey: 'product_006_desc',
    audienceKey: 'product_006_audience',
    specs: [
      { key: 'spec_compatibility', value: 'spec_value_binding' },
      { key: 'spec_material', value: 'spec_value_binding_metal' },
      { key: 'spec_weight', value: 'spec_value_binding_weight' },
    ],
    variants: { binding: ['NNN', 'SNS'] },
  },
];

const reviewKeys = [
  { text: 'review_anton_text', meta: 'review_anton_meta' },
  { text: 'review_alexey_text', meta: 'review_alexey_meta' },
  { text: 'review_mikhail_text', meta: 'review_mikhail_meta' },
] as const;

export function getProducts(lang: Lang): LocalizedProduct[] {
  const tr = t[lang];
  return products.map((p) => ({
    ...p,
    name: tr[p.nameKey],
    short: tr[p.shortKey],
    desc: tr[p.descKey],
    audience: tr[p.audienceKey],
    specs: p.specs.map((s) => ({ key: tr[s.key], value: tr[s.value] })),
  }));
}

export function getProduct(lang: Lang, sku: string): LocalizedProduct | undefined {
  return getProducts(lang).find((p) => p.sku === sku);
}

export function getReviews(lang: Lang) {
  const tr = t[lang];
  return reviewKeys.map((r) => ({ text: tr[r.text], meta: tr[r.meta] }));
}

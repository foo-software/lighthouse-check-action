export type Category = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other'
export type Selector = (n: number | string, ord?: boolean) => Category

export default function getPluralRules(
  NumberFormat: Intl.NumberFormat,
  getSelector: (lc: string) => Selector | undefined,
  getCategories: (lc: string, ord?: boolean) => Category[] | undefined
): Intl.PluralRules

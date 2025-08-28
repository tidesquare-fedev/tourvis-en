export function formatCurrency(value: number | null | undefined, currency: string = 'USD'): string {
  if (typeof value !== 'number' || !isFinite(value)) return ''
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
  } catch {
    return `$${value.toLocaleString()}`
  }
}



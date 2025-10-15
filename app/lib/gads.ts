export function fireAdsConversion(value?: number, currency: string = "AED") {
  try {
    // @ts-ignore
    window.gtag && window.gtag('event', 'conversion', {
      send_to: 'AW-17655044695/NPTJCPab4a0bENe0yuJB',
      value: typeof value === 'number' ? value : undefined,
      currency
    });
  } catch (_) {}
}

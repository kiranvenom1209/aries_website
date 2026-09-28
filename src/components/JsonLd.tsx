import { serializeJsonLd } from '@/lib/seo'

/** Structured data for search engines and AI crawlers, escaped against `</script>` injection. */
export function JsonLd({ data }: { data: unknown }) {
  return <script dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} type="application/ld+json" />
}

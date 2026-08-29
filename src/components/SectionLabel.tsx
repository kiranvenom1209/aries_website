export function SectionLabel({ children, index }: { children: React.ReactNode; index?: string }) {
  return (
    <div className="section-label" aria-hidden="true">
      {index ? <span>{index}</span> : <span className="section-label__plus">+</span>}
      <span>{children}</span>
    </div>
  )
}


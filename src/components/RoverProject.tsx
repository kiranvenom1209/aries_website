import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

type Project = 'one' | 'two'

export function ProjectHero({
  project,
  title,
  tagline,
  summary,
  image,
  imageAlt,
  caption,
  children,
}: {
  project: Project
  title: string
  tagline: string
  summary: string
  image: string
  imageAlt: string
  caption: string
  children: ReactNode
}) {
  return (
    <section className={`project-hero project-hero--${project}`}>
      <Image
        alt={imageAlt}
        className="project-hero__image"
        fill
        preload
        sizes="100vw"
        src={image}
      />
      <div aria-hidden="true" className="project-hero__shade" />
      <div className="project-hero__content">
        <p className="project-kicker">
          PROJECT {project === 'one' ? '01 / FIELD TESTED' : '02 / IN DEVELOPMENT'}
        </p>
        <h1>
          {title}
          <em>{tagline}</em>
        </h1>
        <p className="project-hero__intro">{summary}</p>
        {project === 'two' ? (
          <p className="project-hero__phase">Current phase: design &amp; requirements</p>
        ) : null}
        <div className="project-actions">{children}</div>
      </div>
      <p className="project-hero__caption">{caption}</p>
    </section>
  )
}

export function ProjectNavigation({
  current,
  sections,
}: {
  current: Project
  sections: Array<{ href: string; label: string }>
}) {
  return (
    <div className="project-navigation">
      <nav aria-label="LEAP rover projects" className="project-navigation__projects">
        <Link aria-current={current === 'one' ? 'page' : undefined} href="/leap-one">
          <strong>LEAP-One</strong>
          <span>Field tested</span>
        </Link>
        <Link aria-current={current === 'two' ? 'page' : undefined} href="/leap-2">
          <strong>Leap-2</strong>
          <span>In development</span>
        </Link>
      </nav>
      <nav aria-label="On this page" className="project-navigation__sections">
        {sections.map((section) => (
          <a href={section.href} key={section.href}>
            {section.label}
          </a>
        ))}
      </nav>
    </div>
  )
}

export function ProjectHeading({
  label,
  title,
  accent,
  children,
}: {
  label: string
  title: string
  accent?: string
  children?: ReactNode
}) {
  return (
    <header className="project-heading">
      <div>
        <p className="project-kicker">{label}</p>
        <h2>
          {title}
          {accent ? <em>{accent}</em> : null}
        </h2>
      </div>
      {children ? <div className="project-heading__intro">{children}</div> : null}
    </header>
  )
}

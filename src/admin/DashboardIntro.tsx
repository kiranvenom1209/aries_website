import Link from 'next/link'
import type { ReactNode } from 'react'

type IconName = 'arrow' | 'crew' | 'download' | 'gallery' | 'media' | 'news' | 'settings' | 'sponsor' | 'upload'

const Icon = ({ name }: { name: IconName }) => {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    crew: <><circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M16 7h5M18.5 4.5v5" /></>,
    download: <><path d="M12 4v11M7 10l5 5 5-5" /><path d="M5 20h14" /></>,
    gallery: <><rect x="3" y="4" width="18" height="16" rx="1" /><circle cx="8.5" cy="9" r="1.5" /><path d="m4 17 5-5 4 4 2-2 5 5" /></>,
    media: <><rect x="3" y="4" width="18" height="16" rx="1" /><path d="m10 9 5 3-5 3Z" /></>,
    news: <><path d="M5 4h14v16H5z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
    sponsor: <><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" /></>,
    upload: <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M5 14v5h14v-5" /></>,
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const previews = [
  { href: '/', image: '/media/rover-hero-cinematic.jpg', label: 'HSM Aries', title: 'Space robotics, built in Schmalkalden' },
  { href: '/about', image: '/media/space-night-team.jpg', label: 'About the initiative', title: 'The people and ambition behind Aries' },
  { href: '/leap-one', image: '/media/leap-one-hero-cinematic-v2.png', label: 'LEAP Rover programme', title: 'Explore the LEAP-One platform' },
  { href: '/news', image: '/media/space-night-rover.jpg', label: 'Mission updates', title: 'Follow field work and milestones' },
]

export const DashboardIntro = () => (
  <section className="aries-editorial" aria-labelledby="aries-editorial-title">
    <header className="aries-editorial__header">
      <div>
        <h1 id="aries-editorial-title">Editorial command center<span>.</span></h1>
        <p>Create, review and publish the content behind the HSM Aries mission.</p>
      </div>
      <div className="aries-editorial__actions">
        <Link className="aries-action aries-action--quiet" href="/admin/collections/media/create"><Icon name="upload" /> Upload media</Link>
        <Link className="aries-action aries-action--primary" href="/admin/collections/news/create">Create story <Icon name="arrow" /></Link>
      </div>
    </header>

    <div className="aries-site-preview">
      <div className="aries-site-preview__label"><span aria-hidden="true" /> Live site preview</div>
      <div className="aries-site-preview__grid">
        {previews.map((preview) => (
          <a href={preview.href} target="_blank" rel="noopener noreferrer" className="aries-page-preview" key={preview.href}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview.image} alt="" />
            <span className="aries-page-preview__shade" />
            <span className="aries-page-preview__copy"><small>{preview.label}</small><strong>{preview.title}</strong><span>Open page <Icon name="arrow" /></span></span>
          </a>
        ))}
      </div>
    </div>

    <nav className="aries-editorial__rail" aria-label="Content shortcuts">
      <Link href="/admin/collections/news"><Icon name="news" /><span><strong>News</strong><small>Write and publish stories</small></span><Icon name="arrow" /></Link>
      <Link href="/admin/collections/media"><Icon name="media" /><span><strong>Media</strong><small>Browse the asset library</small></span><Icon name="arrow" /></Link>
      <Link href="/admin/collections/gallery"><Icon name="gallery" /><span><strong>Gallery</strong><small>Curate visual field reports</small></span><Icon name="arrow" /></Link>
    </nav>

    <div className="aries-directory">
      <div className="aries-directory__heading"><h2>Manage the website</h2><p>Every publishing area, explained in plain language.</p></div>
      <div className="aries-directory__grid">
        <Link href="/admin/collections/news"><Icon name="news" /><span><strong>Stories</strong><small>Articles and mission updates</small></span><Icon name="arrow" /></Link>
        <Link href="/admin/collections/media"><Icon name="media" /><span><strong>Asset library</strong><small>Source images, video and files</small></span><Icon name="arrow" /></Link>
        <Link href="/admin/collections/gallery"><Icon name="gallery" /><span><strong>Event albums</strong><small>Curated groups of media</small></span><Icon name="arrow" /></Link>
        <Link href="/admin/collections/downloads"><Icon name="download" /><span><strong>Downloads</strong><small>Public documents and dossiers</small></span><Icon name="arrow" /></Link>
        <Link href="/admin/collections/team"><Icon name="crew" /><span><strong>People</strong><small>Team profiles and roles</small></span><Icon name="arrow" /></Link>
        <Link href="/admin/collections/sponsors"><Icon name="sponsor" /><span><strong>Partners</strong><small>Sponsor logos and links</small></span><Icon name="arrow" /></Link>
        <Link href="/admin/globals/site-settings"><Icon name="settings" /><span><strong>Site settings</strong><small>Shared contact and SEO details</small></span><Icon name="arrow" /></Link>
      </div>
    </div>
  </section>
)

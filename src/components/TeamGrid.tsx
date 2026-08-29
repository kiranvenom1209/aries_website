'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

import type { TeamMember } from '@/lib/team'

const filterCategories = [
  { id: 'all', label: 'All Crew' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'mechanical', label: 'Mechanical' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'software', label: 'Software' },
  { id: 'communication', label: 'Communications' },
  { id: 'drill-manipulator', label: 'Drill & Manipulator' },
  { id: 'astroflight', label: 'Astroflight' },
  { id: 'science', label: 'Science' },
  { id: 'mro', label: 'MRO' },
  { id: 'mentors', label: 'Advisors & Mentors' },
]

export function TeamGrid({ members }: { members: TeamMember[] }) {
  const [selectedDiscipline, setSelectedDiscipline] = useState('all')

  const filteredMembers = useMemo(() => {
    if (selectedDiscipline === 'all') return members
    return members.filter((member) =>
      (member.departments ?? [member.discipline]).includes(selectedDiscipline as TeamMember['discipline']),
    )
  }, [members, selectedDiscipline])

  return (
    <div className="team-container">
      <div className="team-filter-shell">
        <div>
          <span>CREW DATABASE</span>
          <strong>{String(filteredMembers.length).padStart(2, '0')} PROFILES ONLINE</strong>
        </div>
        <div aria-label="Filter by department" className="team-filter" role="tablist">
          {filterCategories.map((category) => {
            const count =
              category.id === 'all'
                ? members.length
              : members.filter((member) =>
                  (member.departments ?? [member.discipline]).includes(category.id as TeamMember['discipline']),
                ).length
            if (count === 0) return null

            const active = selectedDiscipline === category.id
            return (
              <button
                aria-selected={active}
                className={active ? 'team-filter__tab is-active' : 'team-filter__tab'}
                key={category.id}
                onClick={() => setSelectedDiscipline(category.id)}
                role="tab"
                type="button"
              >
                <span>{category.label}</span>
                <small>{String(count).padStart(2, '0')}</small>
              </button>
            )
          })}
        </div>
      </div>

      <div className="team-grid">
        {filteredMembers.map((member, index) => (
          <article
            className={`team-card${member.discipline === 'leadership' && index === 0 ? ' team-card--command' : ''}`}
            key={member.slug}
          >
            <div className="team-card__image">
              <Image
                alt={member.imageAlt}
                fill
                sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                src={member.image}
              />
              <div aria-hidden="true" className="team-card__shade" />
              <span className="team-card__badge">{member.disciplineLabel}</span>
              <span aria-hidden="true" className="team-card__index">{String(index + 1).padStart(2, '0')}</span>
              {member.rankBadge ? (
                <span className="team-card__rank">
                  <Image alt={`${member.rank ?? 'Mission'} badge`} fill sizes="58px" src={member.rankBadge} />
                </span>
              ) : null}
            </div>

            <div className="team-card__content">
              <header>
                <h3>{member.name}</h3>
                <p className="team-card__role">{member.position}</p>
              </header>
              <p className="team-card__bio">{member.bio}</p>
              <div className="team-card__tags">
                {member.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              {member.links?.linkedIn || member.links?.website ? (
                <footer className="team-card__footer">
                  {member.links.linkedIn ? (
                    <a className="team-card__link" href={member.links.linkedIn} rel="noreferrer" target="_blank">
                      LinkedIn <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                  {member.links.website ? (
                    <a className="team-card__link" href={member.links.website} rel="noreferrer" target="_blank">
                      Profile <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </footer>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

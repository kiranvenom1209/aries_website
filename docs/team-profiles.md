# Team profiles: editing, sources and deployment

The team directory links to `/team/<slug>`. Each active CMS record has a profile with its portrait, role, departments, rich-text biography, selected research, personal links and next-person navigation. Profiles are included in the sitemap. Inactive and unknown slugs return the branded 404.

## Editing in Mission Control

Open **Organization → Team**, select a person, edit their biography, role, departments, portrait and personal links, then save. The biography editor supports paragraphs, headings, lists and links; selected publications use the same editor. Use Preview to open the saved profile. An empty biography or cleared link stays empty. Turn off **Public profile** to hide a profile. A newly added person receives the same template and appears in the directory.

When someone leaves the team, enable **Alumni** and leave **Public profile** enabled. They move to the separate alumni section, retain the same URL and sitemap entry, and their profile is labelled as a former member. Update their biography to reflect their completed contribution. Hidden legacy records are not automatically republished: they include duplicate and placeholder records, so confirm the person before publishing an alumni record.

Keep a person's slug unchanged when they become alumni so existing links and search history continue to point to the same page. Public current and alumni profiles inherit `index, follow`, use their own canonical URL and expose Person/ProfilePage structured data. The sitemap index already submitted to search engines includes these entries through the dedicated `team-sitemap.xml`; there is no need to submit 28 separate sitemaps. Google decides when to crawl and index the pages.

## Deployment setting

**Keep `BOOTSTRAP_PUBLIC_CONTENT=false`.** These profile updates do not require the general content seed. Alumni support adds one optional boolean column, `team.is_alumni`, defaulting to false. The existing Postgres configuration enables Payload schema push unless `PAYLOAD_DB_PUSH=false`; that existing mechanism adds the column. If schema push is disabled, apply `ALTER TABLE team ADD COLUMN IF NOT EXISTS is_alumni boolean DEFAULT false;` to the deployment database before building this release. The local SQLite database has been updated with the equivalent column; existing records retain their status.

The Netlify build runs `bootstrap:profiles` independently. It replaces only exact, known older generated biographies and generic company LinkedIn placeholders. It preserves custom biographies, formatting, deliberately empty content, portraits, visibility and later admin changes. It also corrects the three exact superseded roles previously approved by the team. Repeated runs do not change already imported profiles.

Before the first release, run `npm run profiles:check` against the intended database to review eligible changes. For this initial population only, `npm run profiles:populate` also fills currently null biographies with the researched drafts. Tony, Anish and Shivansh had null biographies in the local database; they are now populated locally. If those records are also blank in production, this explicit one-time command is needed there. Do not use it routinely after editors have deliberately cleared biographies. Normal builds use the conservative `bootstrap:profiles` command.

All work is prepared locally for review. No production database import or push is implied by these instructions.

## Editorial basis

The 28 biographies are original summaries. Rover responsibilities draw on the existing team roster and the team's corrections; personal background draws on matched professional profiles and public project posts. Do not treat a roster responsibility as an independently verified LinkedIn claim. Anantha's lead role, Shivansh's embedded-software work and Omar Abdelrady/Omar Abbas being the same person were confirmed by the team.

The source data is in `src/seed/teamProfiles.ts`; publication titles and direct links are attached to their authors and rendered in the editable biography. It contains 25 matched personal LinkedIn links, including Anantha's URL supplied by the team and read in the browser. Mohammad Abdulaziz, Niranjan Ramesha and Alexander Kolbai have no confidently matched personal LinkedIn link. Niranjan has an official university profile; Alexander's research contribution is supported by the conference proceedings. Do not substitute the Aries company page for a personal profile.

Anantha's [LinkedIn profile](https://www.linkedin.com/in/ananthapathmanabhansp/) describes his Mechatronics & Robotics master's study, PLC tools, CAD tools and practical ERC design/build/programming experience. His biography combines that background with his roster responsibilities in Scientific Payload.

## Research references

- [LEAP-One rover design preprint](https://www.researchgate.net/publication/401401918_LEAP-One_A_Mars_Rover_Designed_for_Remote_Mars_Analogue_Scientific_Exploration_and_Sampling_Missions): marked **2026 preprint**, not a peer-reviewed conference paper. Authorship checked against the manuscript title page: Ayan, Brahama, Danny, Harsha, Vighnesh, Rahul Khandait, Kiran Achari, Swaraj and Frank.
- [Professor Frank Schrödel's university profile and publication list](https://www.hs-schmalkalden.de/en/mitarbeiter/detail-view/frank-schroedel): academic background and full research listing. No unstable total publication count is claimed.
- [ECC 2026 programme](https://controls.papercept.net/conferences/conferences/ECC26/program/ECC26_ContentListWeb_1.html): spatial-error characterisation and correction for multi-axis robots, by Niranjan Kannali Ramesha, Nikhil Meduri and Frank Schrödel.
- [University account of the PREMETEC collaboration](https://hereingeforscht.de/en/research-in-profile/in-the-midst-of-a-paradigm-shift-how-can-low-cost-cobots-be-adapted-for-precision-measurement-technologies/): low-cost collaborative robots for precision measurement.
- [MED 2024 programme and abstracts](https://www.med-control.org/med2024/wp-content/uploads/MED-2024-Program-and-Book-of-Abstracts.pdf): low-cost mobile-robot drive system, including Prashanth, Swaraj and Frank.
- [ECC 2024 perception paper](https://paperhost.org/proceedings/controls/ECC24/files/0476.pdf): V2X perception and dynamic pedestrian occupancy analysis, including Swaraj and Frank.
- [AmEC 2024 proceedings](https://www.ame-konferenz.de/resource/blob/2257670/2a380f6607e052cbf2e16c197d6e8ece/vde-amec2024-download-data.pdf): automobile/mobile-robot interoperability, including Swaraj, G. Alexander Kolbai and Frank.
- [Multilayer environment model](https://www.researchgate.net/publication/403799969_Multilayer_Environment_Model_for_Outdoor_Autonomous_Mobile_Robot_Navigation): marked **2026 preprint**, including Swaraj and Frank.
- [Niranjan's university profile](https://www.hs-schmalkalden.de/en/mitarbeiter/detail-view/niranja-kannali-ramesha) and [wavefront-sensing poster](https://www.hs-schmalkalden.de/fileadmin/portal/Bilder/Forschung/005_Ramesha_Wavefront_Sensing_of_an_Extreme-Ultraviolet_Free-Electron_Laser_-_Kopie.pdf): additional measurement research. Christian Rödel on this poster is a different researcher from Frank Schrödel.
- [Prashanth's university publication list](https://www.hs-schmalkalden.de/en/mitarbeiter/detail-view/venkata-prashanth-uppalapti) and [Robots in Town paper](https://irispublishers.com/ojrat/fulltext/Robots-in-Town-Low-Cost-Automated-Logistic-Concept.ID.000524.php).

Examples of project-specific evidence include [Omar's autonomous-racing announcement](https://www.linkedin.com/posts/omar-mo-abbas_i-am-excited-to-announce-the-founding-of-activity-7473698616692555776-PIOO), [Ashwin's ESP32 plotter work](https://www.linkedin.com/posts/ashwinayinipully_engineering-mechatronics-esp32-activity-7471943821355028480-euHm), [Ashwin's LeKiwi teleoperation work](https://www.linkedin.com/posts/ashwinayinipully_robotics-engineeringjourney-lerobot-activity-7418753733511073793-8r8e) and [the HSM-Terra team post](https://www.linkedin.com/posts/sharad-sanjeev_field-robot-event-2026-is-officially-wrapped-activity-7474550048106803200-dzQm). Other professional-profile links are kept next to each biography in the source data for review.

## Search verification before release

`team-sitemap.xml` contains public current members and alumni, with canonical HTTPS URLs, original portrait URLs and real CMS modification timestamps. It excludes placeholder logos and invalid dates. The index has distinct page, post and team sections, with no duplicates between them; `sitemap.xml` remains the compatible aggregate. The team directory exposes a CollectionPage/ItemList, and profiles expose stable Person IDs, ProfilePage dates, breadcrumbs and Open Graph profile metadata.

Run `npm run seo:team` against localhost, or `npm run seo:team -- https://hsmaries.space` after deployment. This read-only audit checks all profiles, section/aggregate consistency, internal links, metadata uniqueness, canonical URLs, indexability, structured data, dates, accessible images and real 404s. `/about` also links its command crew, mentors and named department leads directly to public profiles.

After release, verify `sitemap_index.xml` in Search Console and inspect representative current-member and alumni URLs. The dedicated team sitemap makes profile coverage easier to track. Local validation establishes readiness; it is not a claim that Google has already indexed the pages. References: [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) and [profile structured-data guidance](https://developers.google.com/search/docs/appearance/structured-data/profile-page).

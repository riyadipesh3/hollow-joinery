import { useEffect, useRef, useState, type ReactNode } from 'react'

/* Shared primitives. Scroll reveal uses IntersectionObserver, never a scroll
   listener, and collapses to fully visible under prefers-reduced-motion. */
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* Section headings stack vertically. A big left headline with a small right
   explainer is a banned split-header, so body text always sits under the
   title rather than beside it. */
function SectionHead({
  kicker,
  title,
  body,
}: {
  kicker?: string
  title: string
  body?: string
}) {
  return (
    <div className="max-w-2xl">
      {kicker ? <p className="micro mb-5">{kicker}</p> : null}
      <h2 className="display display-lg">{title}</h2>
      {body ? <p className="lede mt-6">{body}</p> : null}
    </div>
  )
}

/* Collection cells. Five entries, five grid cells, nothing rendered to fill a
   gap. Cell geometry is declared per cell rather than derived, so both rows
   close exactly.

   Two cells carry photography and three are set in type. The stock image
   source has no joinery or furniture photography, so the two photographs are
   atmospheric shots of the land the workshop sits in, picked for the same
   muted grey-green register as the page rather than pretending to be product
   shots. The pieces themselves are described in type, which is how a shop that
   cuts to order actually presents a range. */
/* Common cell shape. */
type CellBase = {
  label: string
  timber: string
  note: string
  /* Grid placement and frame height. Row one is the tall band, row two the
     short band, so the bento reads as varied sizes rather than five equal
     cards. */
  span: string
  frame: string
}

/* Discriminated so a type cell cannot carry a dead seed and alt pair, and a
   photo cell cannot forget them. */
type Cell =
  | (CellBase & { kind: 'photo'; seed: string; alt: string; tone?: never })
  | (CellBase & { kind: 'type'; tone: 'soft' | 'surface'; seed?: never; alt?: never })

/* lg placement: one 4-column cell plus four 2-column cells fills a 6-column,
   2-row grid exactly. sm placement: the first cell spans both columns, then
   four single cells close a 2x2. No empty cell at any breakpoint.
   Sample catalogue, five cells, no invented model numbers. */
const CELLS: Cell[] = [
  {
    label: 'The field behind the yard',
    timber: 'Kilmersdon',
    note: 'The land the workshop was built on, and the reason the air here is damp in winter.',
    kind: 'photo',
    seed: 'hollow-joinery-troweled',
    alt: 'Mist rising between the conifers on the slope behind the yard',
    span: 'sm:col-span-2 lg:col-span-4',
    frame: 'aspect-[16/10] lg:aspect-auto lg:h-[520px]',
  },
  {
    label: 'Ardwick table',
    timber: 'Oak',
    note: 'Trestle base, seats eight with room for a serving dish down the middle.',
    kind: 'type',
    span: 'lg:col-span-2',
    frame: 'aspect-[4/3] lg:aspect-auto lg:h-[520px]',
    tone: 'soft',
  },
  {
    label: 'Morning in the valley',
    timber: 'Frome',
    note: 'Frost holds the ground until late, which is when deliveries can go to the door.',
    kind: 'photo',
    seed: 'hollow-joinery-morning-mist',
    alt: 'A person seated alone on a long timber bench on open dunes under a wide sky',
    span: 'lg:col-span-2',
    frame: 'aspect-[4/3] lg:aspect-auto lg:h-[370px]',
  },
  {
    label: 'Sedgelow sideboard',
    timber: 'Ash',
    note: 'Tambour doors, so there is no handle to catch a sleeve on.',
    kind: 'type',
    span: 'lg:col-span-2',
    frame: 'aspect-[4/3] lg:aspect-auto lg:h-[370px]',
    tone: 'surface',
  },
  {
    label: 'Corry chair',
    timber: 'Walnut',
    note: 'Back legs are book-matched, cut from one board and mirrored.',
    kind: 'type',
    span: 'lg:col-span-2',
    frame: 'aspect-[4/3] lg:aspect-auto lg:h-[370px]',
    tone: 'surface',
  },
]

/* Materials and specifications, presented as a two-column card grid. Six cards
   with a field name, a large display value and a one-line reason. Deliberately
   not a hairline table: a ten-row spec table is the default furniture-site
   layout and it flattens every one of these decisions into a label.
   Sample figures for a workshop of this size, kept rounded. */
const SPECS = [
  {
    name: 'Joint',
    value: 'Cut, not fastened',
    body: 'Legs and rails are mortice and tenon with a driven wedge. Nothing is screwed on from the outside, so a joint can be knocked apart and re-cut years later.',
  },
  {
    name: 'Timber',
    value: 'Oak, ash, walnut',
    body: 'Three species, chosen board by board for colour. We reject about a third of what the yard sends us.',
  },
  {
    name: 'Surface',
    value: 'Hardwax oil',
    body: 'Rubbed in by hand and burnished back between coats. A scratch sands out instead of needing a full refinish.',
  },
  {
    name: 'Batch size',
    value: 'Six to nine pieces',
    body: 'A run is cut from one stack of boards, so tone holds across a table and the chairs that go with it.',
  },
  {
    name: 'Lead time',
    value: 'Eleven to fourteen weeks',
    body: 'Seasoning and finishing set the floor on this. We have never found a way to rush it without cracking the oak.',
  },
  {
    name: 'In the showroom',
    value: 'About forty pieces',
    body: 'Sit in the chairs, open the drawers, lean on the table. The website is the shorter version of that visit.',
  },
]

/* Workshop process as numbered rows. Week labels are genuine process timing,
   not section counters. */
const PROCESS = [
  {
    n: '01',
    when: 'Weeks 1 to 2',
    title: 'Drawing and timber choice',
    body: 'We draw the piece at your dimensions and pick boards with you, holding two or three back so you can see the grain before anything is cut.',
  },
  {
    n: '02',
    when: 'Weeks 3 to 4',
    title: 'Cutting and jointing',
    body: 'Components come off the saw, then get jointed and marked in pencil. Mortices are cut before tenons so the fit is a subtraction, not a guess.',
  },
  {
    n: '03',
    when: 'Weeks 5 to 8',
    title: 'Dry assembly and wedging',
    body: 'The piece goes together dry, gets pulled down, wedges go in, and it goes together again. If a joint needs more than a mallet, it gets cut out.',
  },
  {
    n: '04',
    when: 'Weeks 9 to 11',
    title: 'Finishing and delivery',
    body: 'Three coats of hardwax oil with a week between the first two. We deliver and set it up, then come back a year later to oil it with you.',
  },
]

const NAV = ['Collection', 'Materials', 'Workshop', 'Visit']

export default function App() {
  const [navOpen, setNavOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  // Clears the simulated send timer on unmount so no state update lands after
  // the component is gone.
  useEffect(() => {
    if (status !== 'sending') return
    const t = window.setTimeout(() => setStatus('sent'), 900)
    return () => window.clearTimeout(t)
  }, [status])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
    if (!ok) {
      setEmailError('We need a working address to reply to.')
      return
    }
    setEmailError('')
    setStatus('sending')
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-[var(--color-on-accent)]"
      >
        Skip to content
      </a>

      {/* ---------------------------------------------------------------- */}
      {/* NAV - one line at desktop, 72px tall                              */}
      {/* ---------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-hairline)] bg-[var(--color-canvas)]/92 backdrop-blur-sm">
        <div className="shell flex h-[72px] items-center justify-between">
          <a
            href="#top"
            className="font-display text-[1.0625rem] font-semibold tracking-[-0.03em] text-[var(--color-ink)]"
          >
            Hollow Joinery
          </a>

          <nav className="hidden items-center gap-9 md:flex">
            {NAV.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[0.875rem] font-medium text-[var(--color-body)] transition-colors hover:text-[var(--color-ink)]"
              >
                {item}
              </a>
            ))}
          </nav>

          <a href="#visit" className="btn btn-primary hidden md:inline-flex">
            Book a visit
          </a>

          <button
            type="button"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
            aria-controls="mobile-nav"
            onClick={() => setNavOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center border border-[var(--color-hairline)] text-[var(--color-ink)] md:hidden"
          >
            <span className="flex w-4 flex-col gap-[4px]">
              <span
                className={`h-px w-full bg-[var(--color-ink)] transition-transform duration-200 ${
                  navOpen ? 'translate-y-[2.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-px w-full bg-[var(--color-ink)] transition-transform duration-200 ${
                  navOpen ? '-translate-y-[2.5px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>

        {navOpen ? (
          <div id="mobile-nav" className="border-t border-[var(--color-hairline)] md:hidden">
            <nav className="shell flex flex-col py-4">
              {NAV.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setNavOpen(false)}
                  className="border-b border-[var(--color-hairline)] py-3.5 text-[1rem] font-medium text-[var(--color-ink)] last:border-b-0"
                >
                  {item}
                </a>
              ))}
              <a
                href="#visit"
                onClick={() => setNavOpen(false)}
                className="btn btn-primary mt-5 w-full"
              >
                Book a visit
              </a>
            </nav>
          </div>
        ) : null}
      </header>

      <main id="main">
        {/* -------------------------------------------------------------- */}
        {/* HERO - asymmetric text block against a studio frame. The page     */}
        {/* buys its scale with air rather than with headline size.          */}
        {/* -------------------------------------------------------------- */}
        <section id="top" className="shell pt-16 pb-20 md:pt-20 md:pb-24">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6 lg:self-center">
              <p className="micro mb-7">Bench joinery and solid timber</p>
              <h1 className="display display-xl">
                Built to be repaired,
                <br className="hidden md:block" />
                {' '}
                <span className="font-editorial font-normal italic">
                  not replaced.
                </span>
              </h1>
              <p className="lede mt-8">
                Oak, ash and walnut, cut and wedged in a small workshop. Every
                piece comes apart when it needs repairing.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a href="#visit" className="btn btn-primary">
                  Book a visit
                </a>
                <a href="#collection" className="btn btn-secondary">
                  See the collection
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 lg:col-start-8 lg:mt-20">
              <Reveal>
                {/* A weathered bench against a peeling plaster wall. The source
                    carries a painted sign high in the frame, so the crop
                    wrapper shifts the image up and clips it at every
                    breakpoint. Alt text describes only what is in frame. */}
                <figure className="hero-crop aspect-[4/5] w-full lg:aspect-[5/6]">
                  <img
                    src="https://picsum.photos/seed/hollow-joinery-ribbed/1400/2100"
                    alt="A weathered bench against a peeling plaster wall, standing on patterned tile floor"
                    loading="eager"
                    width={1400}
                    height={2100}
                  />
                </figure>
              </Reveal>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* COLLECTION - bento grid. Exactly five cells for five pieces:     */}
        {/* the tall photo cell covers 2x2, the other four fill the rest,     */}
        {/* so no empty cell is ever left. Three carry photography and two  */}
        {/* carry flat tinted panels, which is the visual variation.          */}
        {/* -------------------------------------------------------------- */}
        <section
          id="collection"
          className="border-t border-[var(--color-hairline)] py-20 md:py-28"
        >
          <div className="shell">
            <Reveal>
              <SectionHead
                title="Five pieces in the front room"
                body="Everything listed here you can come and sit in. Nothing on this page is a render."
              />
            </Reveal>

            {/* Six columns. The yard shot takes four, the table cell two,
                which closes row one. Three two-column cells close row two.
                Every one of the five cells is one entry, so nothing is left
                empty anywhere in the grid. */}
            <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-6">
              {CELLS.map((c, i) => (
                <Reveal key={c.label} delay={i * 60} className={`min-w-0 ${c.span}`}>
                  <article>
                    {c.kind === 'photo' ? (
                      <figure className={`frame w-full ${c.frame}`}>
                        <img
                          src={`https://picsum.photos/seed/${c.seed}/1200/900`}
                          alt={c.alt}
                          loading="lazy"
                          width={1200}
                          height={900}
                        />
                      </figure>
                    ) : (
                      /* Type cells. The piece is named and described in the
                         cell itself rather than shown. Content is centred so a
                         520px cell and a 370px cell both read as composed
                         panels rather than having a void above the text, and
                         the tone alternates so three same-shaped cells do not
                         look like one repeated template. */
                      <div
                        className={`flex flex-col justify-center p-7 ${c.frame} ${
                          c.tone === 'soft'
                            ? 'bg-[var(--color-accent-soft)]'
                            : 'bg-[var(--color-surface)]'
                        }`}
                      >
                        <p
                          className={`field-name ${
                            c.tone === 'soft' ? 'text-[var(--color-accent)]' : ''
                          }`}
                        >
                          {c.timber}
                        </p>
                        <p className="mt-4 font-editorial text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.1] text-[var(--color-ink)]">
                          {c.label}
                        </p>
                        <p className="mt-4 max-w-[34ch] text-[0.875rem] leading-[1.6] text-[var(--color-body)]">
                          {c.note}
                        </p>
                      </div>
                    )}

                    {c.kind === 'photo' ? (
                      <div className="mt-4 flex items-baseline justify-between gap-4">
                        <h3 className="font-display text-[1.0625rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                          {c.label}
                        </h3>
                        <p className="shrink-0 text-[0.8125rem] text-[var(--color-mute)]">
                          {c.timber}
                        </p>
                      </div>
                    ) : null}
                    {c.kind === 'photo' ? (
                      <p className="mt-1.5 text-[0.875rem] leading-[1.6] text-[var(--color-body)]">
                        {c.note}
                      </p>
                    ) : null}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* MATERIALS - two-column spec cards, six of them. No hairline      */}
        {/* table: every card carries a large value and the reason it        */}
        {/* matters, which a two-column table cannot hold at a glance.        */}
        {/* -------------------------------------------------------------- */}
        <section id="materials" className="border-t border-[var(--color-hairline)] py-20 md:py-28">
          <div className="shell">
            <Reveal>
              <SectionHead
                title="Six things we hold to on every commission"
                body="If a quotation needs to come down, we change the timber or the finish. We do not change the joint."
              />
            </Reveal>

            <div className="mt-14 grid gap-x-6 gap-y-4 md:grid-cols-2">
              {SPECS.map((s, i) => (
                <Reveal key={s.name} delay={i * 55}>
                  <div className="h-full border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-7 transition-colors duration-200 hover:border-[var(--color-accent)]">
                    <p className="field-name">{s.name}</p>
                    <p className="mt-4 font-display text-[clamp(1.375rem,2.1vw,1.75rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--color-ink)]">
                      {s.value}
                    </p>
                    <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-[1.6] text-[var(--color-body)]">
                      {s.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* WORKSHOP - numbered rows. Week labels here are real process       */}
        {/* timing, not section counters.                                     */}
        {/* -------------------------------------------------------------- */}
        <section id="workshop" className="border-t border-[var(--color-hairline)] py-20 md:py-28">
          <div className="shell">
            <Reveal>
              <SectionHead
                kicker="How a commission runs"
                title="Eleven weeks from drawing to delivery"
                body="Four stages. You see work in progress whenever you want to come and look at it."
              />
            </Reveal>

            <ol className="mt-14">
              {PROCESS.map((s, i) => (
                <Reveal key={s.n} delay={i * 70}>
                  <li className="grid gap-x-10 gap-y-3 border-t border-[var(--color-hairline)] py-8 md:grid-cols-12 md:py-9">
                    <p className="font-display text-[0.9375rem] font-semibold tabular-nums text-[var(--color-accent)] md:col-span-1">
                      {s.n}
                    </p>
                    <p className="text-[0.8125rem] font-semibold tracking-[0.06em] text-[var(--color-mute)] md:col-span-2">
                      {s.when}
                    </p>
                    <div className="md:col-span-9">
                      <h3 className="font-display text-[1.25rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)]">
                        {s.title}
                      </h3>
                      <p className="mt-2.5 max-w-[62ch] text-[0.9375rem] leading-[1.65] text-[var(--color-body)]">
                        {s.body}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* QUOTE - editorial serif accent, max 3 lines, full attribution    */}
        {/* -------------------------------------------------------------- */}
        <section className="border-t border-[var(--color-hairline)] py-20 md:py-28">
          <div className="shell">
            <Reveal>
              <figure className="mx-auto max-w-3xl">
                <blockquote className="font-editorial text-[clamp(1.375rem,2.5vw,2rem)] font-normal leading-[1.24] tracking-[-0.01em] text-[var(--color-ink)]">
                  &ldquo;We inherited a trestle table from my grandmother. Hollow
                  re-cut two joints on it and sent it back the same week, with a
                  note about which boards had been replaced.&rdquo;
                </blockquote>
                <figcaption className="mt-8 text-[0.9375rem] text-[var(--color-mute)]">
                  Beatrix Mowlam, Head Chef at the Red Kite, Castle Cary
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* VISIT - the one wide closing band. Olive carries the whole       */}
        {/* accent budget for the page, so no other section may use it        */}
        {/* as a fill.                                                        */}
        {/* -------------------------------------------------------------- */}
        <section id="visit" className="bg-[var(--color-accent)] py-20 text-[var(--color-on-accent)] md:py-28">
          <div className="shell">
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <Reveal>
                  <h2 className="font-display text-[clamp(1.875rem,3.6vw,2.625rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--color-on-accent)]">
                    Come and sit in the chairs first
                  </h2>
                  <p className="mt-6 max-w-[46ch] text-[1.0625rem] leading-[1.65] text-[var(--color-on-accent-mute)]">
                    The workshop is open on Thursdays and Saturdays. No appointment
                    needed, though it helps if you tell us you are coming.
                  </p>

                  <dl className="mt-10 space-y-6">
                    <div>
                      <dt className="text-[0.8125rem] font-semibold text-[var(--color-on-accent)]">
                        Where
                      </dt>
                      <dd className="mt-1.5 text-[0.9375rem] text-[var(--color-on-accent-mute)]">
                        Unit 4, Kilmersdon Yard, Frome
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.8125rem] font-semibold text-[var(--color-on-accent)]">
                        Open
                      </dt>
                      <dd className="mt-1.5 text-[0.9375rem] text-[var(--color-on-accent-mute)]">
                        Thursdays and Saturdays, ten until four
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.8125rem] font-semibold text-[var(--color-on-accent)]">
                        Ring the workshop
                      </dt>
                      <dd className="mt-1.5 text-[0.9375rem] text-[var(--color-on-accent-mute)]">
                        01373 462 118
                      </dd>
                    </div>
                  </dl>
                </Reveal>
              </div>

              <div className="lg:col-span-7">
                <Reveal delay={90}>
                  {status === 'sent' ? (
                    <div
                      role="status"
                      className="panel-accent p-8"
                    >
                      <p className="font-display text-[1.375rem] font-semibold tracking-[-0.025em]">
                        That came through
                      </p>
                      <p className="mt-4 max-w-[44ch] text-[0.9375rem] leading-[1.65] text-[var(--color-on-accent-mute)]">
                        We answer within two working days, including when the
                        answer is that you do not need a new piece. If you would
                        rather just talk, ring the workshop instead.
                      </p>
                      <button
                        type="button"
                        onClick={() => setStatus('idle')}
                        className="btn btn-outline-invert mt-7"
                      >
                        Send another
                      </button>
                    </div>
                  ) : (
                    <form className="grid gap-5" noValidate onSubmit={onSubmit}>
                      <div className="grid gap-2">
                        <label
                          htmlFor="name"
                          className="text-[0.8125rem] font-semibold text-[var(--color-on-accent)]"
                        >
                          Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          aria-describedby="name-hint"
                          className="field"
                        />
                        <p id="name-hint" className="text-[0.8125rem] text-[var(--color-on-accent-mute)]">
                          So we know what to call you.
                        </p>
                      </div>

                      <div className="grid gap-2">
                        <label
                          htmlFor="email"
                          className="text-[0.8125rem] font-semibold text-[var(--color-on-accent)]"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            if (emailError) setEmailError('')
                          }}
                          aria-invalid={emailError ? true : undefined}
                          aria-describedby={emailError ? 'email-error email-hint' : 'email-hint'}
                          className="field"
                        />
                        {emailError ? (
                          <p id="email-error" className="text-[0.8125rem] text-[var(--color-on-accent)]">
                            {emailError}
                          </p>
                        ) : null}
                        <p id="email-hint" className="text-[0.8125rem] text-[var(--color-on-accent-mute)]">
                          Only used to answer you.
                        </p>
                      </div>

                      <div className="grid gap-2">
                        <label
                          htmlFor="brief"
                          className="text-[0.8125rem] font-semibold text-[var(--color-on-accent)]"
                        >
                          What you have in mind
                        </label>
                        <textarea
                          id="brief"
                          name="brief"
                          rows={5}
                          aria-describedby="brief-hint"
                          className="field resize-none"
                        />
                        <p id="brief-hint" className="text-[0.8125rem] text-[var(--color-on-accent-mute)]">
                          Rough dimensions and a room are plenty to start.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 pt-1">
                        <button
                          type="submit"
                          disabled={status === 'sending'}
                          className="btn btn-invert disabled:opacity-70"
                        >
                          {status === 'sending' ? 'Sending' : 'Send enquiry'}
                        </button>
                        <p className="text-[0.8125rem] text-[var(--color-on-accent-mute)]">
                          Two working days, usually the same week.
                        </p>
                      </div>
                    </form>
                  )}
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------------- */}
      {/* FOOTER                                                          */}
      {/* ---------------------------------------------------------------- */}
      <footer className="border-t border-[var(--color-hairline)] py-12">
        <div className="shell flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-[1rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)]">
              Hollow Joinery
            </p>
            <p className="mt-1 text-[0.875rem] text-[var(--color-mute)]">
              Unit 4, Kilmersdon Yard, Frome, Somerset
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-7 gap-y-2">
            {NAV.map((i) => (
              <a
                key={i}
                href={`#${i.toLowerCase()}`}
                className="text-[0.875rem] text-[var(--color-mute)] transition-colors hover:text-[var(--color-ink)]"
              >
                {i}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </>
  )
}

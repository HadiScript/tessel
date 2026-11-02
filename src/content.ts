// All copy lives here. Numbers marked "sample" are placeholders — swap for real ones.

export const site = {
  brand: 'Tessel',
  tag: 'Studio',
  email: 'hello@tessel.studio',
  nav: [
    { label: 'Work', href: '#work', sup: '03' },
    { label: 'Studio', href: '#studio' },
    { label: "Let's talk", href: '#contact', sup: '*' },
  ],
  socials: ['Read.cv', 'Instagram', 'Dribbble', 'GitHub'],
  jp: 'テッセル',
  caption: 'Design studio',
  team: ['AK', 'MR', 'JS', 'LT', 'NO', 'EV'],
  menuNote: 'Design‑led engineering studio',
}

export const hero = {
  chip: 'BUILT TO LAST',
  cols: ['Design‑led engineering studio', 'Product design & web engineering.', 'Lisbon base. Remote everywhere.'],
  since: '©2019—2026',
}

export const intro = {
  // [text, icon?] — icons render as small inline glyph chips between words
  parts: [
    'An independent',
    { sup: '(48+)' },
    'product-first studio committed to',
    { icon: 'eye' },
    'precise design and engineering',
    { icon: 'gear' },
    'that holds up in production.',
  ] as (string | { sup?: string; icon?: 'eye' | 'gear' })[],
  cta: 'Start a project',
  awards: [
    { title: 'Brand & Interface Design', note: '', year: '2026', mark: 'sotd', src: 'DESIGN JURY' },
    { title: 'Developer Award', note: '(2)', year: '2025, 2026', mark: 'dev', src: 'ENGINEERING JURY' },
    { title: 'Studio of the Year', note: 'Nominee', year: '2025', mark: 'pod', src: 'WEB AWARDS' },
    { title: 'Product of the Day', note: '(3)', year: '2025', mark: 'soy', src: 'MAKER COMMUNITY' },
  ], // sample
  zones: [
    { city: 'LIS', tz: 'Europe/Lisbon' },
    { city: 'NYC', tz: 'America/New_York' },
  ],
}

export type Project = {
  id: string
  name: string
  kind: string
  blurb: string
  year: string
  hues: [string, string, string] // background glow colours
  mock: 'bank' | 'climate' | 'audio'
}

export const work: Project[] = [
  {
    id: 'kairo',
    name: 'Kairo',
    kind: 'Fintech · Product design · Web app',
    blurb: 'Banking for independent creators — invoices, taxes and payouts in one calm dashboard.',
    year: '2026',
    hues: ['#ff4d1f', '#7a1405', '#ffb199'],
    mock: 'bank',
  },
  {
    id: 'nimbus',
    name: 'Nimbus Labs',
    kind: 'Climate · Data platform · Engineering',
    blurb: 'Satellite emissions data made legible for analysts, journalists and policy teams.',
    year: '2025',
    hues: ['#2d6bff', '#061a55', '#74e0ff'],
    mock: 'climate',
  },
  {
    id: 'arcade',
    name: 'Arcade.fm',
    kind: 'Music · Brand · Streaming app',
    blurb: 'An independent radio network rebuilt around live sets, crates and the people behind them.',
    year: '2025',
    hues: ['#b84dff', '#2a0647', '#ff7ad9'],
    mock: 'audio',
  },
]

export const design = {
  words: ['FUNCTIONS', 'SHIPS', 'SCALES', 'SPEAKS', 'LASTS', 'DELIGHTS'],
  left: ['PRECISE.', 'ENGINEERED.'],
  right: ['EXPRESSIVE.', 'DURABLE.'],
}

export const kit = {
  name: 'Kit',
  badge: 'NEW',
  tagline: ['BEST FIT FOR TEAMS', 'THAT MOVE FAST.'],
  corner: ['Simplified UI.', 'Faster launch.'],
  bar: ['READY-TO-GO', 'WEB', 'PRESENCE.'],
  about: 'About',
  live: 'Try it live:',
}

export const trust = {
  lead: 'Building something new is the most hopeful thing a team can do. Bring the ambition — we’ll bring the craft and the code to make it real.',
  tag: 'TSSL',
  heading: 'Shipping your product worldwide',
  pills: ['Craft', 'Speed', 'Care'],
}

export const studioCopy = {
  statement: 'Together with you, we build products people keep. Thoughtful, technical, made to last.',
  label: ['WE DELIVER WHAT', 'WE’RE ACCOUNTABLE', 'FOR:'],
  lead: 'Interfaces that feel effortless, engineering that survives real traffic, and brand systems that stay coherent as you grow.',
  cols: [
    'Our clients get products that look forward. Years later, the work still holds — because it was built on decisions, not decoration.',
    'Designers who prototype in code and engineers who care about kerning. One team, one Figma file, one repo.',
    'Small on purpose: six senior people, two projects at a time, and the person you meet is the person who builds.',
  ],
  giant: 'TSSL',
  manifesto:
    'OUR WORK STARTS WITH ENGINEERING CONSTRAINTS, REAL DATA AND HONEST DEADLINES. EVERY PIXEL IS AN EXTENSION OF WHAT THE INTERFACE HAS TO DO.',
  invite: 'Good products are built in the open, one honest decision at a time. Bring the hard problem — we’ll bring the team.',
}

export const years = { from: 2019, to: 2026, label: '( SEVEN YEARS IN THE MAKING )' }

export const voices = [
  {
    quote: 'They shipped in eight weeks what our last agency scoped for six months — and the codebase is a joy to inherit.',
    name: 'Mara Okafor',
    role: 'VP Product, Kairo',
  },
  {
    quote: 'Tessel turned a wall of satellite data into something our analysts actually open every morning.',
    name: 'Jonas Lindqvist',
    role: 'Head of Data, Nimbus Labs',
  },
  {
    quote: 'The rare studio where designers and engineers finish each other’s sentences. Our listeners noticed immediately.',
    name: 'Priya Raman',
    role: 'Founder, Arcade.fm',
  },
] // sample

export const contact = {
  eyebrow: 'Time to connect',
  mono: 'ONE SHORT MESSAGE IS ALL THAT STANDS BETWEEN YOUR IDEA AND A TEAM THAT WILL BUILD IT. A GOOD PROJECT STARTS WITH ONE WORD: "HELLO."',
  footer: 'Make something that lasts',
}

// Content and tuning constants for the Innovision 2026 experience.
import ARCHIVE_JSON from './gallery.json';
import PAST_SPONSORS_JSON from './past-sponsors.json';

export const A = '/assets/';

export type WorldKey = 'takeoff' | 'spotlight' | 'touchdown' | 'highpoint';

export interface World {
  key: WorldKey;
  /** URL segment used in #/worlds/<slug> and #/world/<slug>. */
  slug: string;
  name: string;
  category: string;
  accent: string;
  ink: string;
  tint: string;
  tint2: string;
  accentL: string;
  planet: string;
  astro: string;
  astroStyle?: import('react').CSSProperties;
  astroSit: boolean;
  /** Shows the animated rover driving over the planet on this world's slide. */
  rover?: boolean;
  /** Shows the ground station and satellite linked by radio waves on this world's slide. */
  uplink?: boolean;
  /** Asset file names shown in the mission tickets' portholes (cycled). */
  gates: string[];
  coord: string;
  /** Drifting decoration on the worlds slide: image, left (or 'auto' with decoRight), top, height, rotation. */
  deco: string;
  decoL: string;
  /** Distance from the right edge, for a decoration placed on the right (decoL: 'auto'). */
  decoRight?: string;
  decoT: string;
  decoH: string;
  decoR: string;
  /** Hides the decoration on phones, where it has no clear space on the slide. */
  decoWideOnly?: boolean;
  statL: string;
  statR: string;
  tagline: string;
  /** Line under the title on the detail page, when the world's scene has one. */
  sub?: string;
  intro: string;
  specs: [string, string][];
  /** Event categories (admin/DB keys) whose events this world lists, in display order. */
  categories: string[];
  /**
   * Shows the mission tickets in one titled group per category (in `categories` order) instead of one list, for a world
   * that combines several categories: [category, group title].
   */
  groups?: [string, string][];
  /** Placeholder line-up until events are published: [name, text, format, duration, category (grouped worlds)]. */
  missions: [string, string, string, string, string?][];
}

export const WORLDS: World[] = [
  { key: 'takeoff', slug: 'flagship-events', name: 'Flagship Events', category: 'Technical Events', accent: 'oklch(0.56 0.13 32)', accentL: 'oklch(0.76 0.11 38)', ink: 'oklch(0.3 0.08 32)', tint: 'oklch(0.94 0.02 55)', tint2: 'oklch(0.85 0.045 40)',
    planet: A + 'planet-moon.webp', astro: '', astroSit: false, rover: true,
    gates: ['indian-astronaut.webp', 'astronaut-eva.webp', 'rocket.svg', 'capsule.svg'],
    coord: 'RA 05h 35m · DEC −05° 23′',
    // The rover parks on the planet's upper-left rim, so the rocket flies in the open sky on the right, clear of its mast.
    deco: A + 'rocket.svg', decoL: 'auto', decoRight: '8vw', decoT: '22%', decoH: 'min(22vh, 210px)', decoR: '-14deg',
    statL: 'Mission 01', statR: 'Tech Arena', tagline: 'Code. Build. Break the atmosphere.',
    intro: 'Strap in for the technical arena of Innovision. Hackathons, robotics and coding battles where ideas get their launch thrust. Bring your crew, your laptop and your wildest builds.',
    specs: [['Category', 'Technical'], ['Format', 'Solo & team'], ['Launch pad', 'NIT Rourkela'], ['Fuel', 'Code & circuits'], ['Status', 'Boarding soon']],
    categories: ['flagship events'],
    missions: [['Hackathon', 'A non-stop build sprint. Ship a working prototype before the countdown hits zero.', 'Team · 2–4', '36 hrs'], ['Robo Wars', 'Bring your bot into the arena. Last machine standing takes the crown.', 'Team · up to 5', 'Knockout'], ['Code Sprint', 'Competitive programming under pressure. Fast logic, faster fingers.', 'Solo', '3 hrs'], ['Circuit Lab', 'Design, debug and demo hardware that works on the first try.', 'Team · 2', '4 hrs']] },
  { key: 'spotlight', slug: 'standout-events', name: 'Standout Events', category: 'Signature Showcases', accent: 'oklch(0.55 0.12 250)', accentL: 'oklch(0.77 0.09 250)', ink: 'oklch(0.3 0.08 250)', tint: 'oklch(0.94 0.018 250)', tint2: 'oklch(0.85 0.04 250)',
    // An astronaut planting the INNOVISION flag on the moon's crest. The pole lands beside the right boot so its base stays visible.
    // The art is pinned between its boots (24% across, 96% down): shifted 12% right, tilted 4° to the curve there,
    // and lowered into the moon's crest enough for the pole tip and boots to meet its surface.
    // It keeps its own colours (the tricolour patch and the navy mark), so it is not run through the mono filter.
    planet: A + 'planet-moon.webp', astro: A + 'astronaut-flag-planted.png', astroSit: false,
    astroStyle: { height: 'calc(min(112vw, 150vh) * .3)', transformOrigin: '24% 96%', transform: 'translate(12%, calc(6% - 3.5vh + min(112vw, 150vh) * .008)) rotate(-4deg)', filter: 'contrast(1.05) drop-shadow(0 18px 30px rgba(0,0,0,.35))' },
    gates: ['satellite.webp', 'astronaut-eva.webp', 'planet-ringed.webp', 'rocket.svg'],
    coord: 'RA 06h 45m · DEC −16° 43′', deco: A + 'satellite.webp', decoL: '64vw', decoT: '14vh', decoH: 'min(24vh, 230px)', decoR: '-10deg', decoWideOnly: true,
    statL: 'Mission 02', statR: 'Spotlight', tagline: 'Where the brightest stars take the stage.', sub: 'Showcases · Challenges · Spectacles',
    intro: 'The events that steal the show. Signature challenges and showcases built to stand out, with the biggest crowds, the boldest ideas and the brightest spotlight of the fest.',
    specs: [['Category', 'Signature'], ['Format', 'Solo & team'], ['Stage', 'Centre stage'], ['Fuel', 'Ambition'], ['Status', 'Boarding soon']],
    categories: ['standout events'],
    missions: [['Ideathon', 'Pitch a bold idea to a panel of founders and investors in five minutes flat.', 'Team · 2–4', '2 rounds'], ['Design Duel', 'Head-to-head design challenges judged live in front of the crowd.', 'Solo', '3 hrs'], ['Tech Talk Arena', 'Short, sharp talks on the ideas shaping the next decade.', 'Open to all', '90 min'], ['Innovation Showcase', 'The most ambitious student builds of the fest, on display under the spotlight.', 'Open to all', 'All fest']] },
  { key: 'touchdown', slug: 'main-events', name: 'Main Events', category: 'Workshops & Talks', accent: 'oklch(0.55 0.12 295)', accentL: 'oklch(0.77 0.09 295)', ink: 'oklch(0.3 0.08 295)', tint: 'oklch(0.94 0.018 295)', tint2: 'oklch(0.85 0.04 295)',
    planet: A + 'planet-moon.webp', astro: '', astroStyle: { transform: 'translateX(-44vh) translateY(12.5vh) rotate(-28deg)', height: '100%', mixBlendMode: 'multiply', filter: 'grayscale(1) contrast(2.2) brightness(1.2)' }, astroSit: false, uplink: true,
    gates: ['astronaut-eva.webp', 'indian-astronaut.webp', 'rocket.svg', 'planet-ringed.webp'],
    coord: 'RA 18h 36m · DEC +38° 47′', deco: '', decoL: '62vw', decoT: '12vh', decoH: 'min(30vh, 280px)', decoR: '12deg',
    statL: 'Mission 03', statR: 'Learn & Land', tagline: 'A cosmic calm for curious minds.', sub: 'Workshops · Talks · Labs',
    intro: 'Slow the descent and land on new ideas. Hands-on workshops and talks from people who have been there, built that, and are ready to show you how.',
    specs: [['Category', 'Workshops'], ['Format', 'Hands-on'], ['Crew', 'Experts & alumni'], ['Fuel', 'Curiosity'], ['Status', 'Boarding soon']],
    categories: ['main events'],
    missions: [['AI & ML Workshop', 'From first model to deployed demo in a single session.', 'Hands-on', 'Full day'], ['Guest Lectures', 'Stories and lessons from engineers, founders and researchers.', 'Open to all', '90 min'], ['Startup Talks', 'How ideas become companies, straight from the people who did it.', 'Open to all', '60 min'], ['Maker Labs', 'Solder, print and prototype with guidance at every step.', 'Limited seats', 'Half day']] },
  { key: 'highpoint', slug: 'dts-and-fun-events', name: 'DTS and Fun Events', category: 'Games & Showcases', accent: 'oklch(0.56 0.09 178)', accentL: 'oklch(0.8 0.08 178)', ink: 'oklch(0.3 0.06 185)', tint: 'oklch(0.94 0.018 178)', tint2: 'oklch(0.85 0.04 180)',
    // Line-art astronaut cut from "Astronaut on a Lunar Horizon", placed on the planet as it stands on the moon in that
    // picture: moon radius 1.705× the cutout's height, cutout bottom 18.85% of its height below the crest and its centre
    // 10.7% of its width right of the moon's centre (both boots plant just in front of the rim line).
    // Sized from the planet's diameter (WorldsView data-s-hero) rather than astroH so the fit holds on every screen; the
    // container already sits 3.5vh below the crest. Its teal trim matches this world, so it is only lightly desaturated.
    planet: A + 'planet-moon.webp', astro: A + 'astronaut-lunar.webp', astroSit: false,
    astroStyle: { height: 'calc(min(112vw, 150vh) * .293)', transform: 'translate(10.7%, calc(18.85% - 3.5vh))', filter: 'grayscale(.15) contrast(1.12) drop-shadow(0 18px 30px rgba(0,0,0,.35))' },
    gates: ['astronaut-eva.webp', 'planet-crescent.webp', 'astronaut-lunar.webp', 'capsule.svg'],
    coord: 'RA 13h 25m · DEC −11° 09′', deco: A + 'rocket.svg', decoL: 'clamp(28px,9vw,180px)', decoT: '31%', decoH: 'min(21vh, 200px)', decoR: '24deg',
    statL: 'Mission 04', statR: 'Fun Zone', tagline: 'Ride the wave where the fest peaks.',
    intro: 'The best of both worlds: competition meets celebration. Gaming arenas, quizzes and showcases that keep the energy high until the very last night.',
    specs: [['Category', 'Fun & games'], ['Format', 'Open to all'], ['Vibe', 'Euphoric'], ['Fuel', 'Team spirit'], ['Status', 'Boarding soon']],
    categories: ['dts events', 'fun events'],
    groups: [['dts events', 'DTS Events'], ['fun events', 'Fun Events']],
    missions: [['Quiz Night', 'Tech, pop culture and everything in between.', 'Team · 2–3', '3 rounds', 'dts events'], ['Project Expo', 'Walk the hall of student builds and vote for your favourite.', 'Open to all', 'All fest', 'dts events'], ['Gaming Arena', 'Squad up for LAN battles and console showdowns.', 'Squad', 'All night', 'fun events'], ['Treasure Hunt', 'Clues scattered across campus. Only the sharpest crews finish.', 'Team · 3–4', 'Campus-wide', 'fun events']] },
];

/**
 * What the loader waits for: its own planets (Loader ORBS) plus everything on the first home screen
 * (HomeView hero: starfield, orbiting asteroid and ringed planet, rocks, storm planet, astronaut).
 */
export const PRELOAD_CRITICAL = ['planet-tide.webp', 'planet-mars.webp', 'planet-earth.webp', 'starfield.svg',
  'asteroid.webp', 'planet-ringed.webp', 'planet-storm.webp', 'indian-astronaut.webp'];
/**
 * Art for the other views, warmed a few files at a time once the loader is gone (Innovision#warmDeferred),
 * roughly in the order a visitor meets it: worlds slider, the flagship world, the rest. (The transition curtain is drawn in code.)
 */
export const PRELOAD_DEFERRED = ['planet-moon.webp', 'planet-mercury.webp', 'rocket.svg', 'satellite.webp', 'receiver.webp', 'mesa.svg',
  'lab.webp', 'lander.webp', 'astronaut-eva.webp', 'astronaut-flag-planted.png', 'astronaut-lunar.webp', 'astronaut-snowboard.webp', 'capsule.svg',
  'moon-full.webp', 'moon-cratered.webp', 'planet-crescent.webp'];

/** loading="lazy" for an image in a secondary view, unless it is PRELOAD_CRITICAL art (cached already, shared with the first screen). */
export const lazyUnlessCritical = (src: string) => (PRELOAD_CRITICAL.includes(src.replace(A, '')) ? undefined : 'lazy' as const);

export const HERO_SPARKS = [
  { x: '9%', y: '24%', s: '18px', c: '#141312' }, { x: '17%', y: '62%', s: '12px', c: '#141312' }, { x: '27%', y: '14%', s: '10px', c: '#141312' },
  { x: '83%', y: '18%', s: '22px', c: '#141312' }, { x: '91%', y: '58%', s: '12px', c: '#141312' }, { x: '74%', y: '84%', s: '16px', c: '#141312' },
  { x: '38%', y: '30%', s: '10px', c: '#ECE8DF' }, { x: '61%', y: '27%', s: '14px', c: '#ECE8DF' }, { x: '43%', y: '78%', s: '12px', c: '#ECE8DF' },
  { x: '58%', y: '72%', s: '9px', c: '#ECE8DF' },
];

export const LOADER_SPARKS = [
  { x: '12%', y: '20%', s: '16px' }, { x: '22%', y: '70%', s: '10px' }, { x: '84%', y: '26%', s: '20px' }, { x: '78%', y: '64%', s: '12px' },
  { x: '6%', y: '48%', s: '10px' }, { x: '93%', y: '44%', s: '9px' }, { x: '34%', y: '10%', s: '11px' }, { x: '66%', y: '86%', s: '14px' },
];

/** Home briefing headline; it fills in word by word as it scrolls through. */
export const BRIEF = 'For a few days, NIT Rourkela turns into a launch pad for builders, thinkers and makers from across the country.';

export const STATUS = ['ALIGNING THE ORBITS', 'CHARTING CONSTELLATIONS', 'FUELLING THE THRUSTERS', 'PLOTTING THE ODYSSEY'];
export const SCRAMBLE = 'XYZXYZABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Z-distance between consecutive gallery frames. */
export const GAP = 1100;

export interface GalleryItem { id: string; no: string; title: string; titleU: string; w: string; h: string; fr: string; imageUrl?: string }

/**
 * Photos from past fests, as WebP on ImageKit (/innovision/gallery/archive). A static list, so neither the home page
 * nor the gallery queries the database for them. The first TUNNEL.length photos also fly through the home page.
 */
export interface ArchivePhoto { id: string; title: string; url: string; width: number; height: number }
export const ARCHIVE: ArchivePhoto[] = ARCHIVE_JSON;

/** An ImageKit URL resized on the CDN to `w` px wide; ImageKit also picks the best format (WebP/AVIF) per browser. */
export const ikWidth = (url: string, w: number) => url + (url.includes('?') ? '&' : '?') + 'tr=w-' + w;

/** Gallery page frame size: portrait photos get the tall frame. fr is its class, which phones resize (globals.css). */
export const gFrame = (portrait: boolean) =>
  portrait ? { w: 'min(22vw, 300px)', h: 'min(29vw, 400px)', fr: 'g-fr-p' } : { w: 'min(32vw, 440px)', h: 'min(21vw, 290px)', fr: 'g-fr-l' };

export const GALLERY: GalleryItem[] = ARCHIVE.map((p, i) => ({
  id: p.id, no: String(i + 1).padStart(2, '0'), title: p.title, titleU: p.title.toUpperCase(),
  imageUrl: ikWidth(p.url, 900), ...gFrame(p.height > p.width) }));

/** Footer "Contact us" column: name and a 10-digit Indian mobile number (dialled as +91). */
export const CONTACTS: { name: string; phone: string }[] = [
  { name: 'Rishav Bansal', phone: '7978888164' },
  { name: 'Manjeet Srichandan', phone: '7735510636' },
];

/** Top navigation: [label, key]. Events/Schedule/Gallery/Merch are routes; the rest scroll the home page. */
export const LINKS: [string, string][] = [['Home', 'home'], ['Events', 'events'], ['Schedule', 'schedule'], ['Gallery', 'gallery'], ['Sponsors', 'sponsors'], ['Merch', 'merch']];
/** LINKS keys left out of the navbar (top bar and phone menu) for now. Their views and routes still work. */
export const NAVBAR_HIDDEN: string[] = ['schedule'];

/** Frames in the home page's gallery tunnel, filled with the first ARCHIVE photos: [x offset, y offset]. */
export const TUNNEL: [string, string][] = [['-15vw', '-6vh'], ['17vw', '7vh'], ['-18vw', '9vh'], ['15vw', '-10vh'], ['-8vw', '-11vh'], ['6vw', '5vh']];
export const TUNNEL_C = ['oklch(0.76 0.11 38)', 'oklch(0.77 0.09 250)', 'oklch(0.77 0.09 295)', 'oklch(0.8 0.08 178)'];

const INK: [string, string] = ['Ink', '#141312'], BONE: [string, string] = ['Bone', '#ECE8DF'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export interface Product { id: string; name: string; price: number; tag?: string; desc: string; sizes?: string[]; colors?: [string, string][] }

export const PRODUCTS: Product[] = [
  { id: 'tee', name: 'Odyssey Tee', price: 499, tag: 'Bestseller', desc: 'Heavyweight cotton tee with the celestial disc printed across the back.', sizes: SIZES, colors: [INK, BONE, ['Ember', 'oklch(0.56 0.13 32)']] },
  { id: 'hoodie', name: 'Orbit Hoodie', price: 1199, tag: 'Limited', desc: 'Brushed fleece hoodie with an embroidered Innovision wordmark.', sizes: SIZES, colors: [INK, ['Dusk', 'oklch(0.55 0.12 295)']] },
  { id: 'cap', name: 'Mission Cap', price: 349, desc: 'Six-panel cap with a tonal orbit patch. One size, adjustable strap.', colors: [INK, ['Mint', 'oklch(0.56 0.09 178)']] },
  { id: 'mug', name: 'Celestial Mug', price: 299, desc: 'Matte ceramic mug for late-night hackathon fuel.', colors: [INK, BONE] },
  { id: 'stickers', name: 'Sticker Pack', price: 99, desc: 'Eight die-cut stickers: planets, astronauts and mission badges.' },
];

/**
 * Brands that have sponsored past fests, in the order of the 2026 sponsorship brochure. Logos are WebP on ImageKit
 * (/innovision/sponsors/past), trimmed to the mark; width and height are the file's pixels and bg is the logo's own
 * background colour, which fills its card. url is the brand's official site, left out where none was confirmed.
 */
export interface PastSponsor { id: string; name: string; logo: string; width: number; height: number; bg: string; url?: string }
export const PAST_SPONSORS: PastSponsor[] = PAST_SPONSORS_JSON;

/**
 * Images placed into image slots, keyed by slot id (e.g. 'gallery-3', 'merch-tee', 'merch-feature').
 * Slots without an entry show the placeholder, as in the design.
 * Example: 'merch-tee': { src: A + 'merch/tee.webp', fit: 'cover' }
 */
export const SLOT_IMAGES: Record<string, { src: string; fit?: 'contain' | 'cover' }> = {};

/** Schedule day tabs: [theme, planet image]. */
export const SCHED_DAYS: [string, string][] = [['Launch', 'moon-cratered.webp'], ['Orbit', 'planet-ringed.webp'], ['Re-entry', 'planet-storm.webp']];

/** Parts of a fest day on the schedule page: [name, from, until], in minutes after midnight (by start time). */
export const SCHED_BLOCKS: [string, number, number][] = [['Morning', 0, 12 * 60], ['Afternoon', 12 * 60, 17 * 60], ['Evening', 17 * 60, 24 * 60]];

/** One schedule entry: [start 'HH:MM', duration in minutes, title, world index (into WORLDS), venue]. */
export type SchedEvent = [string, number, string, number, string];

/** Events per fest day, in start order. The schedule page splits each day into morning, afternoon and evening. */
export const SCHED: SchedEvent[][] = [
  [['09:00', 60, 'Opening Ceremony', 2, 'Main Auditorium'],
   ['09:30', 90, 'Robotics Bootcamp', 2, 'Mechanical Workshop'],
   ['10:00', 120, 'Circuit Debugging', 0, 'Electronics Lab'],
   ['10:30', 90, 'AI & ML Workshop', 2, 'CS Lab 2'],
   ['11:00', 120, 'CAD Modelling Contest', 0, 'Design Studio'],
   ['11:00', 60, 'Satellites on a Budget', 2, 'Seminar Hall'],
   ['11:30', 60, 'Quiz Odyssey', 3, 'Seminar Hall'],
   ['11:30', 120, 'Robo Wars: Qualifiers', 0, 'Sports Complex Arena'],
   ['11:30', 90, 'Photography Walk', 3, 'Central Lawns'],
   ['12:30', 90, 'Startup Pitch Pit', 2, 'Innovation Hub'],
   ['13:00', 90, 'Web Dev Workshop', 2, 'CS Lab 1'],
   ['13:30', 60, 'Meme Making Contest', 3, 'Library Annexe'],
   ['14:30', 60, 'Chess Blitz', 3, 'Seminar Hall'],
   ['15:00', 120, 'Circuit Design Challenge', 0, 'Electronics Lab'],
   ['17:00', 90, 'Open Source Meetup', 2, 'CS Lab 2'],
   ['17:00', 60, 'Drone Race Heats', 0, 'Football Ground'],
   ['17:30', 90, 'Startup Pitch Pad', 2, 'Seminar Hall'],
   ['17:30', 60, 'Sketch Battle', 3, 'Design Studio'],
   ['18:00', 90, 'Mock Interviews', 2, 'Library Annexe'],
   ['18:00', 120, 'Night Coding Sprint', 0, 'CS Lab 1'],
   ['18:30', 60, 'Battle of Bands: Auditions', 3, 'Open Air Theatre'],
   ['19:00', 90, 'Quiz Night: Round One', 3, 'Lecture Hall Complex'],
   ['19:30', 60, 'Astrophotography Talk', 2, 'Main Auditorium'],
   ['20:00', 90, 'Sci-Fi Movie Night', 3, 'Golden Jubilee Hall'],
   ['20:00', 60, 'Gaming Arena: Group Stage', 3, 'SAC Hall'],
   ['20:30', 90, 'Starlight Open Mic', 3, 'Open Air Theatre'],
   ['21:00', 60, 'Astronomy Showcase', 2, 'Main Auditorium'],
   ['21:00', 60, 'Laser Show Prelims', 3, 'Central Lawns'],
   ['21:30', 60, 'Cosmic Campfire', 3, 'Central Lawns'],
   ['22:00', 60, 'Midnight Stargazing', 3, 'Rooftop Observatory']],
  [['09:00', 60, 'Hackathon Checkpoint', 0, 'Lecture Hall Complex'], ['09:00', 120, 'Origami Orbit', 3, 'Central Lawns'], ['09:30', 150, 'IoT Workshop', 2, 'Electronics Lab'], ['09:30', 90, 'Blind Coding', 0, 'CS Lab 1'],
   ['10:00', 120, 'Hydraulic Arm Challenge', 0, 'Mechanical Workshop'], ['10:30', 150, 'Robo Wars: Knockouts', 0, 'Sports Complex Arena'], ['10:30', 90, 'Debate: Tech on Trial', 2, 'Library Annexe'], ['11:00', 120, 'Paper Presentation', 2, 'Seminar Hall'],
   ['11:00', 90, 'Pictionary Showdown', 3, 'SAC Hall'], ['11:30', 60, 'Talk: Rockets 101', 2, 'Main Auditorium'],
   ['12:00', 90, 'Line Follower Sprint', 0, 'Mechanical Workshop'], ['12:30', 120, 'Reverse Engineering Lab', 0, 'Electronics Lab'], ['13:00', 90, 'Cyber Security Workshop', 2, 'CS Lab 2'], ['13:30', 75, 'Panel: Founders from Campus', 2, 'Main Auditorium'],
   ['13:30', 60, 'Ad Mad Show', 3, 'SAC Hall'], ['14:30', 120, 'Escape Room', 3, 'Library Annexe'], ['14:30', 90, 'Data Science Sprint', 0, 'CS Lab 1'], ['15:00', 60, 'Talk: Women in Aerospace', 2, 'Seminar Hall'],
   ['15:30', 120, 'Bridge Building Challenge', 0, 'Civil Engineering Yard'], ['16:30', 180, 'Gaming Arena: Finals', 3, 'SAC Hall'],
   ['17:00', 60, 'Tug of War', 3, 'Football Ground'], ['17:30', 120, 'UI/UX Design Sprint', 2, 'Design Studio'], ['17:30', 90, 'Competitive Programming', 0, 'CS Lab 1'], ['18:00', 60, 'Research Showcase Talks', 2, 'Seminar Hall'],
   ['18:30', 90, 'Laser Tag', 3, 'Central Lawns'], ['19:00', 90, 'Quiz Night: Finals', 3, 'Lecture Hall Complex'], ['19:00', 120, 'Hardware Night Build', 0, 'Electronics Lab'], ['19:30', 90, 'Dance Off', 3, 'Open Air Theatre'],
   ['20:00', 60, 'Talk: Life on Mars', 2, 'Main Auditorium'], ['21:00', 90, 'Stargazing Session', 3, 'Rooftop Observatory']],
  [['09:00', 120, 'Hackathon Final Demos', 0, 'Lecture Hall Complex'], ['09:00', 60, 'Sunrise Yoga', 3, 'Central Lawns'], ['09:30', 90, 'Typing Race', 3, 'CS Lab 1'], ['10:00', 150, 'Cloud & DevOps Workshop', 2, 'CS Lab 2'],
   ['10:30', 120, 'Robo Wars: Grand Final', 0, 'Sports Complex Arena'], ['10:30', 90, 'Talk: From Idea to Patent', 2, 'Seminar Hall'], ['11:00', 120, 'Solar Car Showcase', 0, 'Mechanical Workshop'], ['11:30', 180, 'Project Expo', 3, 'Golden Jubilee Hall'],
   ['11:30', 60, 'Crossword Rush', 3, 'Library Annexe'], ['11:30', 90, 'PCB Design Contest', 0, 'Electronics Lab'],
   ['12:30', 60, 'Model Rocketry Launch', 0, 'Football Ground'], ['13:00', 90, 'Blockchain Basics', 2, 'CS Lab 2'], ['13:00', 60, 'Mobile Gaming Cup', 3, 'SAC Hall'], ['13:30', 90, 'Debugging Duel', 0, 'CS Lab 1'],
   ['14:00', 75, 'Keynote: The Next Frontier', 2, 'Main Auditorium'], ['14:30', 90, 'Science Magic Show', 3, 'Seminar Hall'], ['15:00', 90, 'Tech Charades', 3, 'SAC Hall'], ['15:00', 120, 'Mars Rover Challenge', 0, 'Civil Engineering Yard'],
   ['15:30', 90, 'Drone Race Final', 0, 'Football Ground'], ['16:30', 120, 'Gaming Arena: Grand Final', 3, 'SAC Hall'],
   ['17:00', 60, 'Hackathon Results', 0, 'Lecture Hall Complex'], ['17:30', 75, 'Alumni Connect', 2, 'Seminar Hall'], ['17:30', 60, 'Cosmic Fashion Walk', 3, 'Golden Jubilee Hall'], ['18:00', 60, 'Talk: Careers in Deep Tech', 2, 'Main Auditorium'],
   ['18:00', 90, 'Antakshari Night', 3, 'Library Annexe'], ['18:30', 60, 'Sponsor Meet and Greet', 2, 'Design Studio'], ['19:00', 60, 'Prize Distribution', 2, 'Main Auditorium'], ['19:30', 60, 'Club Showcase', 3, 'Central Lawns'],
   ['20:00', 30, 'DJ Warm-up', 3, 'Open Air Theatre'], ['20:30', 150, 'Closing Night Pro Show', 3, 'Open Air Theatre']],
];

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN');


import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(process.cwd());
function loadEnv() {
  for (const f of ['.env', '.env.local']) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (m) process.env[m[1]] = process.env[m[1]] || m[2].replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const db = createClient(url, key);

const signal = {
  slug: 'marvell-india-semiconductor-design',
  no: 'S-023',
  title: "Marvell's US$250 Million India Investment Reinforces India's Emergence as a Global Semiconductor Design Hub",
  domain: 'Semiconductor Design & R&D Ecosystem',
  date: '2026-07-29',
  date_label: '29 Jul 2026',
  status: 'live',
  excerpt: 'Marvell will invest US$250 million over the next three years to expand technology, talent and infrastructure in India. The announcement is less about real estate than about concentrating advanced chip-design capability in India — architecture, ASIC design, verification, AI accelerators and cloud networking silicon.',
  reading_time: '5 min',
  body: [
    { type: 'p', text: "Marvell announced it will invest US$250 million over the next three years to expand its technology, talent and infrastructure in India. The company plans to double its headcount, expand its Bengaluru facility, increase its Hyderabad presence, and use India to design advanced semiconductors for artificial intelligence, cloud and data infrastructure." },
    { type: 'p', text: "For years, India's semiconductor narrative has been dominated by fabrication incentives, outsourced assembly and testing, packaging, and government support schemes. This announcement highlights another pillar that is becoming equally important: India is becoming a global semiconductor engineering and product development centre." },
    { type: 'h', text: 'The shift in the value chain' },
    { type: 'p', text: "Multinational semiconductor companies are no longer using India only for support engineering. They are investing in architecture, application-specific integrated circuit design, physical-layer development, verification, firmware, AI accelerators and cloud networking chips. That creates a different class of industrial opportunity — one that depends on design talent and intellectual-property creation rather than manufacturing subsidies alone." },
    { type: 'h', text: 'Engineering talent as strategic infrastructure' },
    { type: 'p', text: "The scarce resource is no longer office space. It is register-transfer-level engineers, physical-design engineers, design-for-test engineers, verification engineers, AI accelerator architects, high-speed serialiser/deserialiser engineers and networking ASIC designers. Marvell's announcement is as much about people as facilities, and it reinforces the growing opportunity around semiconductor talent, education and ecosystem development." },
    { type: 'h', text: 'The Bengaluru–Hyderabad semiconductor corridor' },
    { type: 'p', text: 'Marvell is expanding in both Bengaluru and Hyderabad. That reinforces the emergence of a dual-centre semiconductor research and development corridor rather than a single-city ecosystem. The concentration of design centres, talent pools and infrastructure investments across these two cities is creating a more resilient base for long-term chip-design activity in India.' },
    { type: 'h', text: 'AI infrastructure demand as the driver' },
    { type: 'p', text: "Marvell specifically mentioned artificial intelligence, cloud and data infrastructure. These are among the fastest-growing semiconductor markets globally. India's position as a design hub for these segments matters because the next wave of semiconductor value is concentrating in AI training and inference silicon, network-optimised processors and data-centre connectivity chips — precisely the domains where Indian engineering teams are already active." },
    { type: 'h', text: 'What the signal means' },
    { type: 'p', text: "Investment announcements of this kind are useful indicators when read as a pattern rather than in isolation. They suggest that India is moving from design services toward product architecture and intellectual-property creation. That increases value capture, changes the composition of economic benefit, and creates adjacent opportunity in electronic design automation tools, verification infrastructure, university-to-industry talent pipelines and supplier ecosystems around high-value chip-design clusters." }
  ],
  takeaways: [
    "Marvell will invest US$250 million over three years and expand its Bengaluru and Hyderabad presence, doubling Indian headcount to support advanced semiconductor design.",
    "The announcement signals a structural shift in India's semiconductor role: from manufacturing support and assembly toward global chip architecture, ASIC design, verification and AI accelerator development.",
    "The scarce resource is now engineering talent — RTL, physical design, DFT, verification, AI accelerator architecture and high-speed SerDes — which makes semiconductor education and ecosystem development a strategic industry.",
    "The Bengaluru–Hyderabad corridor is strengthening as India's primary semiconductor design and R&D hub, creating concentrated opportunity for adjacent vendors and institutions."
  ],
  sources: [
    'https://www.thehindu.com/business/Industry/semicon-firm-marvell-to-invest-250-mn-in-technology-talent-and-infrastructure-in-india/article71281465.ece',
    'https://www.marvell.com/'
  ]
};

async function main() {
  const { data, error } = await db.from('cms_signals').upsert(signal, { onConflict: 'slug' });
  if (error) {
    console.error('CMS signals upsert failed:', error.message);
    process.exit(1);
  }
  console.log('saved signal', JSON.stringify(data, null, 2));
}

main();

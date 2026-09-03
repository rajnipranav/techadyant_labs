import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
const env = {};
for (const f of ['.env', '.env.local']) {
  const p = path.join(process.cwd(), f);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const { data } = await supabase.from('cms_signals').select('slug, sources').in('slug', ['adra-joychandipahar-sanka-bypass-eastern-freight-corridor','apollyon-ahuti-mk2-498-kmph-indigenous-drone-interceptor']);
for (const row of data || []) {
  console.log('SLUG', row.slug);
  console.log(JSON.stringify(row.sources, null, 2));
}

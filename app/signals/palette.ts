// Shared signals colour palette + domain→colour helper. Kept in a plain (non
// 'use client') module so both the client SignalsBrowser and server-rendered
// pages (e.g. the digest) can use the exact same mapping.

export const PALETTE = ['#818CF8', '#38E1C4', '#F5B544', '#FB923C', '#34D399', '#E26B5B', '#6CB0FF', '#A78BFA', '#C77D4A', '#2BC5B4'];

export const colorFor = (domains: string[], d: string) => PALETTE[Math.max(0, domains.indexOf(d)) % PALETTE.length];

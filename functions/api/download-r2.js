/**
 * /api/download-r2 — test alias for the live R2 download handler.
 *
 * After the cutover, download.js IS the R2 implementation. This route re-exports
 * it so /api/download-r2 behaves identically to /api/download for verification
 * (e.g. ?probe=1, ?probe=key, and real free/paid downloads). Safe to delete once
 * the migration is confirmed in production.
 */
export { onRequestGet } from './download.js';

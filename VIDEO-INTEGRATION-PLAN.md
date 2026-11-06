# Video integration plan (pending — do on next video publish)

Status: **parked 2026-10-27.** Intro video is live in code (homepage `#watch`, About, Sanket button, footer, sameAs, llms.txt). The items below wait for the next video.

## Principles (agreed)
- Research-first, video-second; contextual placement only (pillar / Dependencies / report / corridor pages).
- youtube-nocookie, click-to-load, no autoplay, no gate. Dark, modest embed.
- Every video ships with written takeaways on the page; VideoObject JSON-LD on any page where the video is a main element.
- No homepage carousel; /videos archive only once there are ~8–10 videos.

## Pending tweaks to the intro embed
1. Replace "Subscribe on YouTube →" under the player with a research link (e.g. "Explore the Atlas →").
2. Add 3–4 written takeaways under the video (and a transcript link from the .srt).
3. Keep the video in one place only — drop the About-page embed (or the homepage one).

## Build: video registry
- Turn `app/lib/introVideo.ts` into `app/lib/videos.ts`: array of `{ id, title, durationLabel, duration (ISO), uploadDate, thumbnail, chapters[], takeaways[], related { label, href }, placements: [{ type: 'pillar'|'report'|'corridor'|'dependencies'|'home', slug }] }`.
- `IntroVideo` → generic `<ResearchVideo video={...} />` with caption ("Video: Title — N min"), takeaways, soft related link.
- Pillar, report, corridor and Dependencies pages look up `videosFor(type, slug)` and render it after key findings / executive summary, plus per-page VideoObject.
- Publishing a new video = add one registry entry + self-hosted thumbnail in `public/video/`.

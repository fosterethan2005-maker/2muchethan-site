// Pulls the newest uploads from the channel's public RSS feed and writes videos.json.
// Runs in GitHub Actions (see .github/workflows/update-videos.yml). No API key needed.
//
// Config (set as env vars in the workflow, or edit the defaults here):
//   YT_HANDLE      your channel handle, without the @
//   YT_CHANNEL_ID  optional: the "UC..." channel ID. Skips looking it up from the handle.
//   MAX_VIDEOS     how many videos to keep

import { readFile, writeFile } from "node:fs/promises";

const HANDLE = process.env.YT_HANDLE || "EthanSurnameYT";
const MAX = Number(process.env.MAX_VIDEOS || 6);
const OUT = new URL("../videos.json", import.meta.url);
const UA = { "User-Agent": "Mozilla/5.0 (site video updater)", "Accept-Language": "en" };

async function channelId() {
  if (process.env.YT_CHANNEL_ID) return process.env.YT_CHANNEL_ID;
  const res = await fetch(`https://www.youtube.com/@${HANDLE}`, { headers: UA });
  if (!res.ok) throw new Error(`Channel page returned ${res.status}. Is @${HANDLE} right?`);
  const html = await res.text();
  const m = html.match(/"externalId":"(UC[\w-]{22})"/) || html.match(/channel_id=(UC[\w-]{22})/);
  if (!m) throw new Error("Couldn't find the channel ID. Set YT_CHANNEL_ID in the workflow.");
  return m[1];
}

const decode = (s) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
   .replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(n))
   .replace(/&amp;/g, "&");

export function parseFeed(xml, max = MAX) {
  const entries = xml.split("<entry>").slice(1);
  return entries
    .map((e) => {
      const tag = (t) => (e.match(new RegExp(`<${t}>([\\s\\S]*?)</${t}>`)) || [])[1];
      const link = (e.match(/<link rel="alternate" href="([^"]+)"/) || [])[1] || "";
      return {
        id: tag("yt:videoId"),
        title: decode(tag("title") || ""),
        published: tag("published"),
        short: link.includes("/shorts/"),
      };
    })
    .filter((v) => v.id)
    .slice(0, max);
}

async function main() {
  const id = await channelId();
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`, { headers: UA });
  if (!res.ok) throw new Error(`Feed returned ${res.status}`);
  const videos = parseFeed(await res.text());

  // Only rewrite the file when the video list actually changed, so we don't commit every run.
  let old = {};
  try { old = JSON.parse(await readFile(OUT, "utf8")); } catch {}
  if (JSON.stringify(old.videos) === JSON.stringify(videos)) {
    console.log("No new videos.");
    return;
  }
  await writeFile(OUT, JSON.stringify({ updated: new Date().toISOString(), channelId: id, videos }, null, 2) + "\n");
  console.log(`Saved ${videos.length} videos:`, videos.map((v) => v.title));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => { console.error(err.message); process.exit(1); });
}

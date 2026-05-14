import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import type { AnyNode, Element } from "domhandler";

export interface OgpData {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  type: string | null;
}

export interface ColorData {
  primary: string | null;
  background: string | null;
  text: string | null;
  raw: string[];
}

export interface SectionInfo {
  tag: string;
  id: string | null;
  className: string | null;
  role: string | null;
  headingText: string | null;
  childCount: number;
}

export interface AnalyzeResult {
  url: string;
  ogp: OgpData;
  colors: ColorData;
  sections: SectionInfo[];
}

function extractColors($: cheerio.CheerioAPI): ColorData {
  const raw: string[] = [];

  // inline style から color / background-color を収集
  $("[style]").each((_, el) => {
    const style = $(el).attr("style") ?? "";
    const matches = style.match(/#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)/g);
    if (matches) raw.push(...matches);
  });

  // <meta name="theme-color">
  const themeColor = $('meta[name="theme-color"]').attr("content") ?? null;
  if (themeColor) raw.unshift(themeColor);

  // 頻度順に並べ、重複を除く
  const freq: Record<string, number> = {};
  for (const c of raw) {
    const normalized = c.toLowerCase();
    freq[normalized] = (freq[normalized] ?? 0) + 1;
  }
  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([c]) => c);

  return {
    primary: sorted[0] ?? themeColor,
    background: sorted.find((c) => /^#f|^#e|^rgb\(2[0-4]|^rgb\(25/i.test(c)) ?? null,
    text: sorted.find((c) => /^#[0-3]|^#[0-9a-f]{6}$/.test(c) && parseInt(c.slice(1, 3), 16) < 80) ?? null,
    raw: sorted.slice(0, 20),
  };
}

function extractOgp($: cheerio.CheerioAPI): OgpData {
  const meta = (name: string) =>
    $(`meta[property="${name}"]`).attr("content") ??
    $(`meta[name="${name}"]`).attr("content") ??
    null;

  return {
    title:
      meta("og:title") ??
      ($("title").first().text().trim() || null),
    description: meta("og:description") ?? meta("description"),
    image: meta("og:image"),
    siteName: meta("og:site_name"),
    type: meta("og:type"),
  };
}

function extractSections($: cheerio.CheerioAPI): SectionInfo[] {
  const sections: SectionInfo[] = [];

  const selectors = [
    "header",
    "nav",
    "main",
    "section",
    "article",
    "aside",
    "footer",
    '[role="banner"]',
    '[role="navigation"]',
    '[role="main"]',
    '[role="contentinfo"]',
    // id/class でよく使われるパターン
    "#hero, .hero, #top, .top",
    "#about, .about",
    "#service, .service, #services, .services",
    "#works, .works, #portfolio, .portfolio",
    "#news, .news, #blog, .blog",
    "#contact, .contact",
    "#faq, .faq",
    "#feature, .feature, #features, .features",
    "#price, .price, #pricing, .pricing",
  ];

  const seen = new Set<AnyNode>();

  for (const sel of selectors) {
    $(sel).each((_, el) => {
      if (seen.has(el)) return;
      seen.add(el);

      const elem = el as Element;
      const $el = $(el);
      const heading = $el.find("h1,h2,h3").first();

      sections.push({
        tag: elem.tagName,
        id: $el.attr("id") ?? null,
        className: ($el.attr("class") ?? "").trim() || null,
        role: $el.attr("role") ?? null,
        headingText: heading.length ? heading.text().trim() : null,
        childCount: $el.children().length,
      });
    });
  }

  return sections;
}

export async function POST(req: NextRequest) {
  let url: string;
  try {
    const body = await req.json();
    url = body?.url;
    if (!url || typeof url !== "string") throw new Error("missing url");
    new URL(url); // 形式チェック
  } catch {
    return NextResponse.json({ error: "Invalid request. Provide { url: string }" }, { status: 400 });
  }

  let html: string;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; HPWizardBot/1.0; +https://hp-wizard.example.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${res.status} ${res.statusText}` },
        { status: 502 }
      );
    }
    html = await res.text();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Fetch error: ${message}` }, { status: 502 });
  }

  const $ = cheerio.load(html);

  const result: AnalyzeResult = {
    url,
    ogp: extractOgp($),
    colors: extractColors($),
    sections: extractSections($),
  };

  return NextResponse.json(result);
}

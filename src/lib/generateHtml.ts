import type { WizardData } from "@/types/wizard";
import { ATMOSPHERE_LABELS, SITE_TYPE_LABELS } from "@/types/wizard";

function atmosphereStyles(atm: string): { font: string; radius: string; shadow: string } {
  switch (atm) {
    case "modern":
      return { font: "'Inter', sans-serif", radius: "0.5rem", shadow: "0 4px 24px rgba(0,0,0,.12)" };
    case "classic":
      return { font: "'Georgia', serif", radius: "0.125rem", shadow: "0 2px 8px rgba(0,0,0,.15)" };
    case "pop":
      return { font: "'Poppins', sans-serif", radius: "2rem", shadow: "0 8px 32px rgba(0,0,0,.18)" };
    case "minimal":
    default:
      return { font: "'Helvetica Neue', sans-serif", radius: "0", shadow: "none" };
  }
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

// picsum番号の割り当て（セクション種別ごとに固定）
const PICSUM = {
  hero: 1,
  service: [10, 11, 12],
  feature: [20, 21, 22],
  about: 30,
  works: [40, 41, 42],
  price: [],
  faq: [],
  news: [],
  blog: [50, 51, 52],
  skill: [],
  profile: 60,
  category: [70, 71, 72, 73],
  featureProducts: [80, 81],
  review: [90, 91, 92],
  products: [100, 101, 102, 103],
  contact: [],
};

function img(w: number, h: number, n: number, style = ""): string {
  return `<img src="https://picsum.photos/${w}/${h}?random=${n}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;${style}" />`;
}

function sectionHtml(name: string, primary: string, style: ReturnType<typeof atmosphereStyles>): string {
  const rgb = hexToRgb(primary.startsWith("#") && primary.length === 7 ? primary : "#3b82f6");

  const sectionMap: Record<string, string> = {
    ヒーロー: `
  <section id="hero" style="position:relative;overflow:hidden;color:#fff;padding:6rem 2rem;text-align:center;min-height:520px;display:flex;align-items:center;justify-content:center;">
    <div style="position:absolute;inset:0;z-index:0;">${img(1200, 600, PICSUM.hero)}</div>
    <div style="position:absolute;inset:0;background:rgba(${rgb},.78);z-index:1;"></div>
    <div style="position:relative;z-index:2;max-width:720px;margin:0 auto;">
      <h1 style="font-size:2.75rem;font-weight:700;margin:0 0 1.25rem;line-height:1.2">__CATCHPHRASE__</h1>
      <p style="font-size:1.125rem;opacity:.9;max-width:560px;margin:0 auto 2rem">__SERVICENAME__ へようこそ</p>
      <a href="#contact" style="background:#fff;color:${primary};padding:.875rem 2.5rem;border-radius:${style.radius};font-weight:700;text-decoration:none;display:inline-block;font-size:1rem">お問い合わせ</a>
    </div>
  </section>`,

    サービス: `
  <section id="service" style="padding:5rem 2rem;background:#f9fafb;">
    <div style="max-width:900px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;margin-bottom:3rem;color:${primary}">サービス</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem;">
        ${PICSUM.service.map((n, i) => `<div style="background:#fff;border-radius:${style.radius};overflow:hidden;box-shadow:${style.shadow}"><div style="height:180px;overflow:hidden;">${img(400, 300, n)}</div><div style="padding:1.25rem"><h3 style="margin:0 0 .5rem">サービス ${i + 1}</h3><p style="color:#6b7280;margin:0;font-size:.9375rem">説明文をここに入力します。</p></div></div>`).join("")}
      </div>
    </div>
  </section>`,

    特徴: `
  <section id="feature" style="padding:5rem 2rem;">
    <div style="max-width:960px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;margin-bottom:3rem;color:${primary}">特徴</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;">
        ${PICSUM.feature.map((n, i) => `<div style="border-radius:${style.radius};overflow:hidden;box-shadow:${style.shadow}"><div style="height:160px;">${img(400, 280, n)}</div><div style="padding:1.25rem;border:1px solid #f3f4f6;border-top:none;border-radius:0 0 ${style.radius} ${style.radius}"><h3 style="margin:0 0 .5rem;color:${primary}">特徴 ${i + 1}</h3><p style="color:#6b7280;margin:0;font-size:.9375rem">説明文をここに入力します。</p></div></div>`).join("")}
      </div>
    </div>
  </section>`,

    会社概要: `
  <section id="about" style="padding:5rem 2rem;background:#f9fafb;">
    <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center;">
      <div style="border-radius:${style.radius};overflow:hidden;aspect-ratio:4/3;">${img(600, 450, PICSUM.about)}</div>
      <div>
        <h2 style="font-size:1.75rem;color:${primary};margin:0 0 1.25rem">会社概要</h2>
        <p style="color:#374151;line-height:1.8;margin:0">私たちは__SERVICENAME__です。お客様に最高の価値を提供するために日々取り組んでいます。</p>
      </div>
    </div>
  </section>`,

    実績: `
  <section id="works" style="padding:5rem 2rem;">
    <div style="max-width:960px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">実績</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;">
        ${PICSUM.works.map((n, i) => `<div style="border-radius:${style.radius};overflow:hidden;box-shadow:${style.shadow}"><div style="height:200px;">${img(600, 400, n)}</div><div style="padding:1rem;background:#fff"><h3 style="margin:0 0 .25rem">プロジェクト ${i + 1}</h3><p style="color:#9ca3af;font-size:.875rem;margin:0">Webデザイン / 開発</p></div></div>`).join("")}
      </div>
    </div>
  </section>`,

    料金プラン: `
  <section id="price" style="padding:5rem 2rem;background:#f9fafb;">
    <div style="max-width:900px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">料金プラン</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.5rem;">
        ${[["ライト", "¥9,800"], ["スタンダード", "¥29,800"], ["プレミアム", "¥49,800"]].map(([n, p]) => `<div style="background:#fff;border-radius:${style.radius};padding:2rem;box-shadow:${style.shadow};text-align:center"><h3 style="margin:0 0 1rem">${n}</h3><p style="font-size:2rem;font-weight:700;color:${primary};margin:0 0 1rem">${p}<span style="font-size:.875rem;font-weight:400">/月</span></p><ul style="list-style:none;padding:0;margin:0;color:#6b7280;font-size:.875rem;text-align:left"><li style="padding:.25rem 0">✓ 機能 A</li><li style="padding:.25rem 0">✓ 機能 B</li><li style="padding:.25rem 0">✓ サポート</li></ul></div>`).join("")}
      </div>
    </div>
  </section>`,

    FAQ: `
  <section id="faq" style="padding:5rem 2rem;">
    <div style="max-width:700px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">よくある質問</h2>
      ${[1, 2, 3, 4].map((i) => `<div style="border-bottom:1px solid #e5e7eb;padding:1.25rem 0"><p style="font-weight:600;margin:0 0 .5rem;color:#111827">Q. よくある質問 ${i}</p><p style="color:#6b7280;margin:0;font-size:.9375rem">A. 回答をここに入力します。</p></div>`).join("")}
    </div>
  </section>`,

    ニュース: `
  <section id="news" style="padding:5rem 2rem;background:#f9fafb;">
    <div style="max-width:900px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">ニュース</h2>
      ${[1, 2, 3].map((i) => `<div style="display:flex;gap:1rem;padding:1rem 0;border-bottom:1px solid #e5e7eb;align-items:center"><time style="color:#9ca3af;min-width:6rem;font-size:.875rem">2025-0${i}-01</time><a href="#" style="color:${primary};font-weight:500;text-decoration:none">ニュースタイトル ${i}</a></div>`).join("")}
    </div>
  </section>`,

    最新記事: `
  <section id="blog" style="padding:5rem 2rem;">
    <div style="max-width:960px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">最新記事</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;">
        ${PICSUM.blog.map((n, i) => `<div style="border-radius:${style.radius};box-shadow:${style.shadow};overflow:hidden;background:#fff"><div style="height:180px;">${img(600, 400, n)}</div><div style="padding:1rem"><p style="color:#9ca3af;font-size:.8rem;margin:0 0 .375rem">2025-0${i + 1}-01</p><h3 style="margin:0 0 .5rem;font-size:1rem;line-height:1.5">記事タイトル ${i + 1}</h3><a href="#" style="color:${primary};font-size:.875rem;font-weight:600;text-decoration:none">続きを読む →</a></div></div>`).join("")}
      </div>
    </div>
  </section>`,

    スキル: `
  <section id="skill" style="padding:5rem 2rem;background:#f9fafb;">
    <div style="max-width:700px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">スキル</h2>
      ${[["デザイン", 90], ["開発", 85], ["マーケティング", 75], ["ディレクション", 80]].map(([s, v]) => `<div style="margin-bottom:1.5rem"><div style="display:flex;justify-content:space-between;margin-bottom:.375rem"><span style="font-weight:600;color:#374151">${s}</span><span style="color:${primary};font-weight:600">${v}%</span></div><div style="background:#e5e7eb;border-radius:9999px;height:.625rem"><div style="background:${primary};width:${v}%;height:100%;border-radius:9999px;transition:width .6s ease"></div></div></div>`).join("")}
    </div>
  </section>`,

    自己紹介: `
  <section id="profile" style="padding:5rem 2rem;">
    <div style="max-width:700px;margin:0 auto;text-align:center;">
      <div style="width:140px;height:140px;border-radius:50%;overflow:hidden;margin:0 auto 1.5rem;border:4px solid ${primary};">${img(280, 280, PICSUM.profile, "border-radius:50%;")}</div>
      <h2 style="font-size:1.75rem;color:${primary};margin:0 0 1rem">自己紹介</h2>
      <p style="color:#374151;line-height:1.8;max-width:480px;margin:0 auto">プロフィール文をここに入力します。経歴やスキル、得意なことなどを書きましょう。</p>
    </div>
  </section>`,

    プロフィール: `
  <section id="profile-about" style="padding:5rem 2rem;background:#f9fafb;">
    <div style="max-width:800px;margin:0 auto;display:grid;grid-template-columns:auto 1fr;gap:2.5rem;align-items:center;">
      <div style="width:160px;height:160px;border-radius:50%;overflow:hidden;border:4px solid ${primary};flex-shrink:0;">${img(320, 320, PICSUM.profile + 1, "border-radius:50%;")}</div>
      <div>
        <h2 style="font-size:1.75rem;color:${primary};margin:0 0 .75rem">プロフィール</h2>
        <p style="color:#374151;line-height:1.8;margin:0">プロフィール文をここに入力します。</p>
      </div>
    </div>
  </section>`,

    カテゴリ: `
  <section id="category" style="padding:5rem 2rem;">
    <div style="max-width:960px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">カテゴリ</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;">
        ${["技術", "デザイン", "ビジネス", "ライフスタイル"].map((c, i) => `<a href="#" style="position:relative;display:block;border-radius:${style.radius};overflow:hidden;aspect-ratio:4/3;text-decoration:none;"><div style="position:absolute;inset:0;">${img(400, 300, PICSUM.category[i])}</div><div style="position:absolute;inset:0;background:rgba(0,0,0,.42);"></div><span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:1.125rem">${c}</span></a>`).join("")}
      </div>
    </div>
  </section>`,

    特集: `
  <section id="feature-products" style="padding:5rem 2rem;background:#f9fafb;">
    <div style="max-width:960px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">特集</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;">
        ${PICSUM.featureProducts.map((n, i) => `<div style="background:#fff;border-radius:${style.radius};overflow:hidden;box-shadow:${style.shadow}"><div style="height:220px;">${img(600, 440, n)}</div><div style="padding:1.25rem"><h3 style="margin:0 0 .5rem;color:${primary}">特集 ${i + 1}</h3><p style="color:#6b7280;margin:0;font-size:.9375rem">説明文をここに入力します。</p></div></div>`).join("")}
      </div>
    </div>
  </section>`,

    レビュー: `
  <section id="review" style="padding:5rem 2rem;">
    <div style="max-width:960px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">お客様の声</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;">
        ${PICSUM.review.map((n, i) => `<div style="background:#f9fafb;border-radius:${style.radius};padding:1.5rem;box-shadow:${style.shadow}"><div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1rem"><div style="width:48px;height:48px;border-radius:50%;overflow:hidden;flex-shrink:0;">${img(96, 96, n, "border-radius:50%;")}</div><div><p style="font-weight:600;margin:0;color:#111827">お客様 ${i + 1}</p><p style="color:#9ca3af;font-size:.8rem;margin:0">★★★★★</p></div></div><p style="color:#374151;margin:0;font-size:.9375rem;line-height:1.7">"とても満足しています。品質が高く、対応も丁寧でした。"</p></div>`).join("")}
      </div>
    </div>
  </section>`,

    商品一覧: `
  <section id="products" style="padding:5rem 2rem;background:#f9fafb;">
    <div style="max-width:960px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">商品一覧</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.5rem;">
        ${PICSUM.products.map((n, i) => `<div style="background:#fff;border-radius:${style.radius};overflow:hidden;box-shadow:${style.shadow}"><div style="height:200px;">${img(400, 400, n)}</div><div style="padding:1rem"><h3 style="margin:0 0 .375rem;font-size:.9375rem">商品 ${i + 1}</h3><p style="color:${primary};font-weight:700;margin:0;font-size:1.125rem">¥${(i + 1) * 1000 + 4800}</p></div></div>`).join("")}
      </div>
    </div>
  </section>`,

    お問い合わせ: `
  <section id="contact" style="padding:5rem 2rem;background:${primary};">
    <div style="max-width:600px;margin:0 auto;text-align:center;color:#fff;">
      <h2 style="font-size:1.75rem;margin-bottom:1rem">お問い合わせ</h2>
      <p style="opacity:.85;margin-bottom:2rem">お気軽にご連絡ください。</p>
      <form style="display:flex;flex-direction:column;gap:1rem;text-align:left;">
        <input placeholder="お名前" style="padding:.75rem;border-radius:${style.radius};border:none;font-size:1rem" />
        <input placeholder="メールアドレス" type="email" style="padding:.75rem;border-radius:${style.radius};border:none;font-size:1rem" />
        <textarea placeholder="メッセージ" rows="4" style="padding:.75rem;border-radius:${style.radius};border:none;font-size:1rem;resize:vertical"></textarea>
        <button type="submit" style="background:#fff;color:${primary};padding:.75rem;border-radius:${style.radius};border:none;font-weight:700;font-size:1rem;cursor:pointer">送信する</button>
      </form>
    </div>
  </section>`,
  };

  return sectionMap[name] ?? "";
}

export function generateHtml(data: WizardData): string {
  const style = atmosphereStyles(data.atmosphere);
  const primary = data.primaryColor || "#3b82f6";
  const rgb = hexToRgb(primary.startsWith("#") && primary.length === 7 ? primary : "#3b82f6");

  const sections = data.sections
    .map((s) =>
      sectionHtml(s, primary, style)
        .replace(/__CATCHPHRASE__/g, data.catchphrase || "キャッチコピーをここに")
        .replace(/__SERVICENAME__/g, data.serviceName || "サービス名")
    )
    .join("\n");

  const navLinks = data.sections
    .map((s) => {
      const idMap: Record<string, string> = {
        ヒーロー: "hero", サービス: "service", 特徴: "feature", 会社概要: "about",
        実績: "works", 料金プラン: "price", FAQ: "faq", ニュース: "news",
        最新記事: "blog", スキル: "skill", 自己紹介: "profile", プロフィール: "profile-about",
        カテゴリ: "category", 特集: "feature-products", レビュー: "review",
        商品一覧: "products", お問い合わせ: "contact",
      };
      return `<a href="#${idMap[s] ?? s}" style="color:rgba(${rgb},.85);text-decoration:none;font-weight:500;font-size:.9375rem">${s}</a>`;
    })
    .join("");

  const googleFonts = style.font.includes("Inter")
    ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">`
    : style.font.includes("Poppins")
    ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">`
    : "";

  const siteTypeLabel = SITE_TYPE_LABELS[data.siteType] ?? "ウェブサイト";
  const atmosphereLabel = ATMOSPHERE_LABELS[data.atmosphere] ?? "";

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.serviceName || "サービス名"}</title>
  <meta name="description" content="${data.catchphrase || ""}">
  ${googleFonts}
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: ${style.font}; color: #111827; line-height: 1.6; }
    img { max-width: 100%; }
    /* ${siteTypeLabel} / ${atmosphereLabel} */
  </style>
</head>
<body>
  <header style="position:sticky;top:0;z-index:50;background:#fff;border-bottom:1px solid #e5e7eb;padding:.875rem 2rem;display:flex;align-items:center;justify-content:space-between;">
    <span style="font-weight:700;font-size:1.125rem;color:${primary}">${data.serviceName || "サービス名"}</span>
    <nav style="display:flex;gap:1.5rem;">${navLinks}</nav>
  </header>
${sections}
  <footer style="background:#111827;color:#9ca3af;text-align:center;padding:2rem;font-size:.875rem;">
    <p>&copy; ${new Date().getFullYear()} ${data.serviceName || "サービス名"}. All rights reserved.</p>
  </footer>
</body>
</html>`;
}

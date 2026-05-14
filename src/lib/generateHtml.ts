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

function sectionHtml(name: string, primary: string, style: ReturnType<typeof atmosphereStyles>): string {
  const sectionMap: Record<string, string> = {
    ヒーロー: `
  <section id="hero" style="background:${primary};color:#fff;padding:6rem 2rem;text-align:center;">
    <h1 style="font-size:2.5rem;font-weight:700;margin:0 0 1rem">__CATCHPHRASE__</h1>
    <p style="font-size:1.125rem;opacity:.85;max-width:560px;margin:0 auto 2rem">__SERVICENAME__ へようこそ</p>
    <a href="#contact" style="background:#fff;color:${primary};padding:.75rem 2rem;border-radius:${style.radius};font-weight:600;text-decoration:none;display:inline-block">お問い合わせ</a>
  </section>`,
    サービス: `
  <section id="service" style="padding:5rem 2rem;background:#f9fafb;">
    <div style="max-width:900px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;margin-bottom:3rem;color:${primary}">サービス</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.5rem;">
        ${[1, 2, 3].map((i) => `<div style="background:#fff;border-radius:${style.radius};padding:1.5rem;box-shadow:${style.shadow}"><h3>サービス ${i}</h3><p style="color:#6b7280;margin:.5rem 0 0">説明文をここに入力します。</p></div>`).join("")}
      </div>
    </div>
  </section>`,
    特徴: `
  <section id="feature" style="padding:5rem 2rem;">
    <div style="max-width:900px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;margin-bottom:3rem;color:${primary}">特徴</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.5rem;">
        ${["✓ 特徴 1", "✓ 特徴 2", "✓ 特徴 3"].map((f) => `<div style="padding:1.5rem;border:1px solid #e5e7eb;border-radius:${style.radius}"><p style="font-weight:600">${f}</p><p style="color:#6b7280;margin:.5rem 0 0">説明文をここに入力します。</p></div>`).join("")}
      </div>
    </div>
  </section>`,
    会社概要: `
  <section id="about" style="padding:5rem 2rem;background:#f9fafb;">
    <div style="max-width:700px;margin:0 auto;text-align:center;">
      <h2 style="font-size:1.75rem;color:${primary};margin-bottom:1.5rem">会社概要</h2>
      <p style="color:#374151;line-height:1.8">私たちは__SERVICENAME__です。お客様に最高の価値を提供するために日々取り組んでいます。</p>
    </div>
  </section>`,
    実績: `
  <section id="works" style="padding:5rem 2rem;">
    <div style="max-width:900px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">実績</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;">
        ${[1, 2, 3].map((i) => `<div style="border-radius:${style.radius};overflow:hidden;box-shadow:${style.shadow}"><div style="height:160px;background:#e5e7eb;display:flex;align-items:center;justify-content:center;color:#9ca3af">実績 ${i}</div><div style="padding:1rem"><h3 style="margin:0">プロジェクト ${i}</h3></div></div>`).join("")}
      </div>
    </div>
  </section>`,
    料金プラン: `
  <section id="price" style="padding:5rem 2rem;background:#f9fafb;">
    <div style="max-width:900px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">料金プラン</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.5rem;">
        ${[["ライト", "¥9,800"], ["スタンダード", "¥29,800"], ["プレミアム", "¥49,800"]].map(([n, p]) => `<div style="background:#fff;border-radius:${style.radius};padding:2rem;box-shadow:${style.shadow};text-align:center"><h3>${n}</h3><p style="font-size:2rem;font-weight:700;color:${primary}">${p}<span style="font-size:.875rem;font-weight:400">/月</span></p></div>`).join("")}
      </div>
    </div>
  </section>`,
    FAQ: `
  <section id="faq" style="padding:5rem 2rem;">
    <div style="max-width:700px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">よくある質問</h2>
      ${[1, 2, 3].map((i) => `<div style="border-bottom:1px solid #e5e7eb;padding:1.25rem 0"><p style="font-weight:600;margin:0 0 .5rem">Q. よくある質問 ${i}</p><p style="color:#6b7280;margin:0">A. 回答をここに入力します。</p></div>`).join("")}
    </div>
  </section>`,
    ニュース: `
  <section id="news" style="padding:5rem 2rem;background:#f9fafb;">
    <div style="max-width:900px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">ニュース</h2>
      ${[1, 2, 3].map((i) => `<div style="display:flex;gap:1rem;padding:1rem 0;border-bottom:1px solid #e5e7eb"><time style="color:#9ca3af;min-width:6rem">2025-0${i}-01</time><a href="#" style="color:${primary}">ニュースタイトル ${i}</a></div>`).join("")}
    </div>
  </section>`,
    最新記事: `
  <section id="blog" style="padding:5rem 2rem;">
    <div style="max-width:900px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">最新記事</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;">
        ${[1, 2, 3].map((i) => `<div style="border-radius:${style.radius};box-shadow:${style.shadow};overflow:hidden"><div style="height:120px;background:#e5e7eb"></div><div style="padding:1rem"><h3 style="margin:0 0 .5rem;font-size:1rem">記事タイトル ${i}</h3><p style="color:#9ca3af;font-size:.875rem;margin:0">2025-0${i}-01</p></div></div>`).join("")}
      </div>
    </div>
  </section>`,
    スキル: `
  <section id="skill" style="padding:5rem 2rem;background:#f9fafb;">
    <div style="max-width:700px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">スキル</h2>
      ${[["デザイン", 90], ["開発", 85], ["マーケティング", 75]].map(([s, v]) => `<div style="margin-bottom:1.25rem"><div style="display:flex;justify-content:space-between;margin-bottom:.25rem"><span>${s}</span><span>${v}%</span></div><div style="background:#e5e7eb;border-radius:9999px;height:.625rem"><div style="background:${primary};width:${v}%;height:100%;border-radius:9999px"></div></div></div>`).join("")}
    </div>
  </section>`,
    自己紹介: `
  <section id="profile" style="padding:5rem 2rem;">
    <div style="max-width:700px;margin:0 auto;text-align:center;">
      <div style="width:120px;height:120px;border-radius:50%;background:#e5e7eb;margin:0 auto 1.5rem"></div>
      <h2 style="font-size:1.75rem;color:${primary};margin-bottom:1rem">自己紹介</h2>
      <p style="color:#374151;line-height:1.8">プロフィール文をここに入力します。</p>
    </div>
  </section>`,
    プロフィール: `
  <section id="about" style="padding:5rem 2rem;background:#f9fafb;">
    <div style="max-width:700px;margin:0 auto;">
      <h2 style="font-size:1.75rem;color:${primary};margin-bottom:1.5rem">プロフィール</h2>
      <p style="color:#374151;line-height:1.8">プロフィール文をここに入力します。</p>
    </div>
  </section>`,
    カテゴリ: `
  <section id="category" style="padding:5rem 2rem;">
    <div style="max-width:900px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">カテゴリ</h2>
      <div style="display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center;">
        ${["技術", "デザイン", "ビジネス", "ライフスタイル"].map((c) => `<a href="#" style="padding:.5rem 1.25rem;border:2px solid ${primary};color:${primary};border-radius:${style.radius};text-decoration:none;font-weight:600">${c}</a>`).join("")}
      </div>
    </div>
  </section>`,
    特集: `
  <section id="feature-products" style="padding:5rem 2rem;background:#f9fafb;">
    <div style="max-width:900px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">特集</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;">
        ${[1, 2].map((i) => `<div style="background:#fff;border-radius:${style.radius};overflow:hidden;box-shadow:${style.shadow}"><div style="height:200px;background:#e5e7eb"></div><div style="padding:1.25rem"><h3>特集 ${i}</h3><p style="color:#6b7280">説明文をここに入力します。</p></div></div>`).join("")}
      </div>
    </div>
  </section>`,
    レビュー: `
  <section id="review" style="padding:5rem 2rem;">
    <div style="max-width:900px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">お客様の声</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;">
        ${[1, 2, 3].map((i) => `<div style="background:#f9fafb;border-radius:${style.radius};padding:1.5rem;box-shadow:${style.shadow}"><p style="color:#374151;margin:0 0 1rem">"とても満足しています。おすすめです。"</p><p style="font-weight:600;margin:0;color:${primary}">お客様 ${i}</p></div>`).join("")}
      </div>
    </div>
  </section>`,
    商品一覧: `
  <section id="products" style="padding:5rem 2rem;background:#f9fafb;">
    <div style="max-width:900px;margin:0 auto;">
      <h2 style="text-align:center;font-size:1.75rem;color:${primary};margin-bottom:3rem">商品一覧</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.5rem;">
        ${[1, 2, 3, 4].map((i) => `<div style="background:#fff;border-radius:${style.radius};overflow:hidden;box-shadow:${style.shadow}"><div style="height:160px;background:#e5e7eb"></div><div style="padding:1rem"><h3 style="margin:0 0 .25rem">商品 ${i}</h3><p style="color:${primary};font-weight:700;margin:0">¥${i * 1000 + 4800}</p></div></div>`).join("")}
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
        最新記事: "blog", スキル: "skill", 自己紹介: "profile", プロフィール: "about",
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

"use client";

import { useState, useCallback } from "react";
import type { WizardData, SiteType, Atmosphere } from "@/types/wizard";
import {
  SITE_TYPE_LABELS,
  ATMOSPHERE_LABELS,
  ALL_SECTIONS,
  DEFAULT_SECTIONS,
  defaultWizardData,
} from "@/types/wizard";
import { generateHtml } from "@/lib/generateHtml";
import Preview from "./Preview";

const STEPS = [
  "サイトの種類",
  "参考URL",
  "サービス名・キャッチコピー",
  "カラー",
  "セクション構成",
  "雰囲気",
] as const;

// /api/analyze のレスポンス型
interface AnalyzeSection {
  tag: string;
  id: string | null;
  className: string | null;
  role: string | null;
  headingText: string | null;
}
interface AnalyzeResult {
  ogp: { title: string | null; description: string | null; siteName: string | null };
  colors: { primary: string | null; raw: string[] };
  sections: AnalyzeSection[];
}

// セクション tag/id/class → ウィザード日本語名マッピング
const SECTION_PATTERNS: [RegExp, string][] = [
  [/hero|firstview|fv\b|kv\b|mv\b|mainvisual|top-visual|top-image/i, "ヒーロー"],
  [/about|company|overview|profile|story/i,                           "会社概要"],
  [/service(?!s)|menu|lineup/i,                                       "サービス"],
  [/feature[s]?|strength|point[s]?|reason|merit/i,                   "特徴"],
  [/work[s]?|portfolio|case[s]?|project[s]?|achievement/i,           "実績"],
  [/news|information|topics|info\b|announce/i,                        "ニュース"],
  [/blog|article|post[s]?|column/i,                                   "最新記事"],
  [/price|pricing|plan[s]?|fee|cost/i,                               "料金プラン"],
  [/faq|question[s]?|qa\b/i,                                         "FAQ"],
  [/contact|inquiry|form|access/i,                                    "お問い合わせ"],
  [/review[s]?|testimonial[s]?|voice[s]?|comment/i,                  "レビュー"],
  [/product[s]?|item[s]?|shop|store|goods|catalog/i,                 "商品一覧"],
  [/skill[s]?/i,                                                      "スキル"],
  [/categor/i,                                                        "カテゴリ"],
  [/special|pickup|feature-product|campaign/i,                       "特集"],
];

const SKIP_TAGS = new Set(["header", "nav", "footer", "aside"]);

function mapAnalyzedSections(sections: AnalyzeSection[]): string[] {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const s of sections) {
    if (SKIP_TAGS.has(s.tag)) continue;
    const haystack = [s.id, s.className, s.role, s.headingText]
      .filter(Boolean)
      .join(" ");
    for (const [pattern, name] of SECTION_PATTERNS) {
      if (pattern.test(haystack) && !seen.has(name)) {
        result.push(name);
        seen.add(name);
        break;
      }
    }
  }
  return result;
}

// 白・透明に近い色をスキップして最良の色を選ぶ
function pickBestColor(colors: AnalyzeResult["colors"]): string | null {
  const candidates = [colors.primary, ...colors.raw].filter((c): c is string => !!c);
  for (const c of candidates) {
    const hex = c.replace("#", "");
    if (hex.length !== 6) continue;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness < 210) return c; // 白・明るすぎる色をスキップ
  }
  return null;
}

export default function Wizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(defaultWizardData);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [done, setDone] = useState(false);

  const update = useCallback(<K extends keyof WizardData>(key: K, value: WizardData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
  }, []);

  const analyze = useCallback(async (url: string) => {
    if (!url) return;
    setAnalyzing(true);
    setAnalyzeError("");
    setAnalyzeResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json: AnalyzeResult & { error?: string } = await res.json();

      console.log("[analyze] status:", res.status);
      console.log("[analyze] response:", JSON.stringify(json, null, 2));

      if (!res.ok) throw new Error(json.error ?? "取得失敗");

      const mappedSections = mapAnalyzedSections(json.sections ?? []);
      const bestColor = pickBestColor(json.colors ?? { primary: null, raw: [] });

      console.log("[analyze] mappedSections:", mappedSections);
      console.log("[analyze] bestColor:", bestColor);

      setAnalyzeResult(json);
      setData((d) => {
        const next = { ...d };
        // OGP → サービス名・キャッチコピー（未入力時のみ上書き）
        if (!next.serviceName)
          next.serviceName = json.ogp?.siteName || json.ogp?.title || "";
        if (!next.catchphrase)
          next.catchphrase = json.ogp?.description || "";
        // カラー（デフォルト値のままなら上書き）
        if (bestColor && next.primaryColor === defaultWizardData.primaryColor)
          next.primaryColor = bestColor;
        // セクション（未選択なら上書き）
        if (next.sections.length === 0 && mappedSections.length > 0)
          next.sections = mappedSections;
        return next;
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "エラーが発生しました";
      console.error("[analyze] error:", msg);
      setAnalyzeError(msg);
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const canProceed = (() => {
    if (step === 0) return !!data.siteType;
    if (step === 2) return !!data.serviceName;
    if (step === 4) return data.sections.length > 0;
    if (step === 5) return !!data.atmosphere;
    return true;
  })();

  const handleNext = () => {
    if (step === 4 && data.sections.length === 0 && data.siteType) {
      update("sections", DEFAULT_SECTIONS[data.siteType] ?? []);
    }
    if (step === STEPS.length - 1) {
      setDone(true);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleDownload = () => {
    const html = generateHtml(data);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${data.serviceName || "hp"}.html`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (done) {
    return (
      <div className="flex h-full">
        <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto gap-6 p-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-zinc-900 mb-2">完成しました！</h2>
            <p className="text-sm text-zinc-500">HTMLファイルをダウンロードして<br />すぐに使えます。</p>
          </div>
          <button
            onClick={handleDownload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            HTMLをダウンロード
          </button>
          <button
            onClick={() => { setStep(0); setData(defaultWizardData); setDone(false); }}
            className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            最初からやり直す
          </button>
        </div>
        <div className="flex-1 border-l border-zinc-200 bg-zinc-50">
          <Preview data={data} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left: Wizard */}
      <div className="w-full max-w-md flex flex-col border-r border-zinc-200">
        {/* Progress */}
        <div className="px-6 pt-6 pb-4 border-b border-zinc-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-400">
              STEP {step + 1} / {STEPS.length}
            </span>
            <span className="text-xs text-zinc-400">{STEPS[step]}</span>
          </div>
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  i <= step ? "bg-blue-600" : "bg-zinc-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 0 && <StepSiteType value={data.siteType} onChange={(v) => update("siteType", v)} />}
          {step === 1 && (
            <StepReferenceUrl
              value={data.referenceUrl}
              analyzing={analyzing}
              error={analyzeError}
              result={analyzeResult}
              onChange={(v) => update("referenceUrl", v)}
              onAnalyze={() => analyze(data.referenceUrl)}
            />
          )}
          {step === 2 && (
            <StepNameCatchphrase
              serviceName={data.serviceName}
              catchphrase={data.catchphrase}
              onChangeName={(v) => update("serviceName", v)}
              onChangeCatchphrase={(v) => update("catchphrase", v)}
            />
          )}
          {step === 3 && (
            <StepColor
              value={data.primaryColor}
              onChange={(v) => update("primaryColor", v)}
            />
          )}
          {step === 4 && (
            <StepSections
              selected={data.sections}
              siteType={data.siteType}
              onChange={(v) => update("sections", v)}
            />
          )}
          {step === 5 && (
            <StepAtmosphere
              value={data.atmosphere}
              onChange={(v) => update("atmosphere", v)}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 border-t border-zinc-100 flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 py-2.5 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              戻る
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="flex-1 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white disabled:opacity-40 hover:bg-blue-700 transition-colors"
          >
            {step === STEPS.length - 1 ? "HTMLを生成する" : "次へ"}
          </button>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="flex-1 bg-zinc-50 flex flex-col">
        <div className="px-4 py-2.5 border-b border-zinc-200 bg-white flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-zinc-400 ml-1">リアルタイムプレビュー</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <Preview data={data} />
        </div>
      </div>
    </div>
  );
}

/* ─── Step components ─── */

function StepSiteType({ value, onChange }: { value: SiteType; onChange: (v: SiteType) => void }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-zinc-900 mb-1">どんなサイトを作りますか？</h2>
      <p className="text-sm text-zinc-500 mb-5">サイトの種類を選んでください</p>
      <div className="flex flex-col gap-2.5">
        {Object.entries(SITE_TYPE_LABELS).map(([k, label]) => (
          <button
            key={k}
            onClick={() => onChange(k as SiteType)}
            className={`text-left px-4 py-3.5 rounded-xl border-2 transition-all font-medium text-sm ${
              value === k
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-zinc-200 hover:border-zinc-300 text-zinc-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepReferenceUrl({
  value,
  analyzing,
  error,
  result,
  onChange,
  onAnalyze,
}: {
  value: string;
  analyzing: boolean;
  error: string;
  result: AnalyzeResult | null;
  onChange: (v: string) => void;
  onAnalyze: () => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-bold text-zinc-900 mb-1">参考サイトはありますか？</h2>
      <p className="text-sm text-zinc-500 mb-5">
        URLを入力すると色・情報を自動取得します（スキップ可）
      </p>
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAnalyze()}
          placeholder="https://example.com"
          className="flex-1 px-3 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={onAnalyze}
          disabled={!value || analyzing}
          className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg disabled:opacity-40 hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          {analyzing ? "取得中…" : "解析"}
        </button>
      </div>

      {analyzing && (
        <p className="mt-3 text-xs text-zinc-400">サイトを解析しています…</p>
      )}
      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-100">
          <p className="text-xs text-red-600 font-medium">エラー</p>
          <p className="text-xs text-red-500 mt-0.5">{error}</p>
        </div>
      )}
      {!analyzing && !error && result && (
        <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-100 space-y-1.5">
          <p className="text-xs font-semibold text-green-700">✓ 解析完了 — ウィザードに自動入力しました</p>
          {result.ogp.title && (
            <p className="text-xs text-zinc-600">
              <span className="font-medium text-zinc-500">タイトル：</span>{result.ogp.title}
            </p>
          )}
          {result.ogp.description && (
            <p className="text-xs text-zinc-600">
              <span className="font-medium text-zinc-500">説明：</span>
              {result.ogp.description.slice(0, 60)}{result.ogp.description.length > 60 ? "…" : ""}
            </p>
          )}
          {result.colors.primary && (
            <p className="text-xs text-zinc-600 flex items-center gap-1.5">
              <span className="font-medium text-zinc-500">カラー：</span>
              <span
                className="inline-block w-3.5 h-3.5 rounded-full border border-black/10"
                style={{ background: result.colors.primary }}
              />
              {result.colors.primary}
            </p>
          )}
          {result.sections.length > 0 && (
            <p className="text-xs text-zinc-600">
              <span className="font-medium text-zinc-500">セクション検出：</span>
              {result.sections.map((s) => s.id || s.tag).slice(0, 6).join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function StepNameCatchphrase({
  serviceName,
  catchphrase,
  onChangeName,
  onChangeCatchphrase,
}: {
  serviceName: string;
  catchphrase: string;
  onChangeName: (v: string) => void;
  onChangeCatchphrase: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-bold text-zinc-900 mb-1">サービスの情報を教えてください</h2>
      <p className="text-sm text-zinc-500 mb-5">参考URL解析済みの場合は自動入力されています</p>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5 uppercase tracking-wide">
            サービス名 *
          </label>
          <input
            value={serviceName}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="例：株式会社〇〇"
            className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5 uppercase tracking-wide">
            キャッチコピー
          </label>
          <textarea
            value={catchphrase}
            onChange={(e) => onChangeCatchphrase(e.target.value)}
            placeholder="例：未来を創る、テクノロジーの力で"
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>
    </div>
  );
}

const PRESET_COLORS = [
  "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899",
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#14b8a6", "#06b6d4", "#0ea5e9", "#111827",
];

function StepColor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-zinc-900 mb-1">メインカラーを選んでください</h2>
      <p className="text-sm text-zinc-500 mb-5">ブランドカラーを設定します</p>
      <div className="grid grid-cols-6 gap-2.5 mb-5">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            style={{ background: c }}
            className={`h-10 rounded-lg transition-all ${
              value === c ? "ring-2 ring-offset-2 ring-zinc-400 scale-110" : "hover:scale-105"
            }`}
          />
        ))}
      </div>
      <div>
        <label className="block text-xs font-semibold text-zinc-600 mb-2 uppercase tracking-wide">
          カスタムカラー
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-10 rounded-lg border border-zinc-200 cursor-pointer p-0.5"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#3b82f6"
            className="flex-1 px-3 py-2.5 rounded-lg border border-zinc-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="mt-5 h-16 rounded-xl flex items-center justify-center text-white text-sm font-semibold" style={{ background: value }}>
        プレビュー
      </div>
    </div>
  );
}

function StepSections({
  selected,
  siteType,
  onChange,
}: {
  selected: string[];
  siteType: SiteType;
  onChange: (v: string[]) => void;
}) {
  const defaults = siteType ? DEFAULT_SECTIONS[siteType] ?? [] : [];
  const recommended = new Set(defaults);

  const toggle = (s: string) => {
    if (selected.includes(s)) {
      onChange(selected.filter((x) => x !== s));
    } else {
      onChange([...selected, s]);
    }
  };

  const setDefaults = () => onChange([...defaults]);

  return (
    <div>
      <h2 className="text-lg font-bold text-zinc-900 mb-1">セクション構成を選んでください</h2>
      <p className="text-sm text-zinc-500 mb-3">表示したいセクションにチェックを入れてください</p>
      {siteType && (
        <button
          onClick={setDefaults}
          className="mb-4 text-xs text-blue-600 hover:underline font-medium"
        >
          おすすめ構成を選択
        </button>
      )}
      <div className="flex flex-col gap-2">
        {ALL_SECTIONS.map((s) => (
          <label key={s} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.includes(s)}
              onChange={() => toggle(s)}
              className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <span className={`text-sm ${selected.includes(s) ? "text-zinc-900 font-medium" : "text-zinc-600"}`}>
              {s}
            </span>
            {recommended.has(s) && (
              <span className="text-xs text-blue-500 font-medium">おすすめ</span>
            )}
          </label>
        ))}
      </div>
      {selected.length > 0 && (
        <p className="mt-4 text-xs text-zinc-400">{selected.length} 件選択中</p>
      )}
    </div>
  );
}

function StepAtmosphere({ value, onChange }: { value: Atmosphere; onChange: (v: Atmosphere) => void }) {
  const descriptions: Record<string, string> = {
    modern: "クリーンでスタイリッシュ。ビジネス向け。",
    classic: "格式高く信頼感のあるデザイン。",
    pop: "明るく親しみやすい。若い世代向け。",
    minimal: "シンプル＆余白重視。洗練された印象。",
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-zinc-900 mb-1">サイトの雰囲気を選んでください</h2>
      <p className="text-sm text-zinc-500 mb-5">デザインのトーンを決めます</p>
      <div className="flex flex-col gap-3">
        {Object.entries(ATMOSPHERE_LABELS).map(([k, label]) => (
          <button
            key={k}
            onClick={() => onChange(k as Atmosphere)}
            className={`text-left px-4 py-4 rounded-xl border-2 transition-all ${
              value === k
                ? "border-blue-600 bg-blue-50"
                : "border-zinc-200 hover:border-zinc-300"
            }`}
          >
            <div className={`font-semibold text-sm ${value === k ? "text-blue-700" : "text-zinc-700"}`}>
              {label}
            </div>
            <div className="text-xs text-zinc-400 mt-0.5">{descriptions[k]}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import type { WizardData } from "@/types/wizard";
import { generateHtml } from "@/lib/generateHtml";

interface PreviewProps {
  data: WizardData;
}

export default function Preview({ data }: PreviewProps) {
  const html = useMemo(() => generateHtml(data), [data]);

  const hasContent =
    data.siteType ||
    data.serviceName ||
    data.catchphrase ||
    data.sections.length > 0;

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-3 p-8 text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
        <p className="text-sm">回答すると<br />リアルタイムでプレビューされます</p>
      </div>
    );
  }

  return (
    <iframe
      srcDoc={html}
      className="w-full h-full border-0"
      title="プレビュー"
      sandbox="allow-same-origin"
    />
  );
}

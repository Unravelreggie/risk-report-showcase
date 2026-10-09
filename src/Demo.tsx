import { useState } from "react";
import { APPROVED_PRODUCTS, SCENARIOS, draftOutline, preflight } from "./logic.mjs";

type Language = "en" | "zh";
type Props = { language: Language };
type Model = typeof SCENARIOS.ready;
const text = {
  en: {
    setup: "Synthetic input map", scenario: "Preset scenario", ready: "Ready synthetic scope",
    ambiguous: "Ambiguous product", missing: "Missing denominator", type: "Demo report type",
    product: "Synthetic product", region: "Synthetic region", period: "Synthetic period",
    dose: "Net-dose denominator", link: "Apply Form02 to selected Form01 linkage",
    run: "Run synthetic preflight", draft: "Create local .txt outline", reset: "Changing an input clears readiness and any draft.",
    status: "Preflight status", idle: "Not checked", pass: "Synthetic gate ready", block: "Synthetic gate blocked",
    cases: "Form01 synthetic case map", events: "Form02 synthetic event map", productLabel: "Product label",
    caseId: "Form01 ID", event: "Event label", linked: "Linked selected-product events",
    reasons: "Blocking reasons", scope: "Synthetic scope", review: "Human review only",
    noResults: "Run the preflight to assess this synthetic input.", outline: "Local synthetic outline",
    download: "Download .txt", disabled: "A ready preflight is required.", note: "Synthetic status only. No regulated report, LLM request, file upload or operational record is created.",
    exact: "Exact approved aliases:", linkageOff: "Linkage is off: event totals are withheld in this demo.",
    reason: {
      product_not_approved: "The selected synthetic product has no approved alias set.",
      no_exact_selected_product_case: "No Form01 record has an exact selected-product alias.",
      mixed_product_case_ownership: "A Form01 record has a different or similar, non-approved product label.",
      orphan_or_other_product_event: "A Form02 event does not link to an exact selected-product Form01 ID.",
      denominator_missing: "The scoped synthetic net-dose denominator is missing.",
      denominator_zero: "The scoped synthetic net-dose denominator is zero.",
      denominator_negative: "The scoped synthetic net-dose denominator is negative.",
      denominator_nonfinite: "The scoped synthetic net-dose denominator is not finite.",
      scope_incomplete: "Product, region or period is incomplete."
    } as Record<string,string>
  },
  zh: {
    setup: "\u5408\u6210\u8f93\u5165\u6620\u5c04", scenario: "\u9884\u8bbe\u573a\u666f", ready: "\u5df2\u5c31\u7eea\u7684\u5408\u6210\u8303\u56f4",
    ambiguous: "\u4ea7\u54c1\u6807\u8bc6\u5b58\u7591", missing: "\u7f3a\u5c11\u5206\u6bcd", type: "\u6f14\u793a\u62a5\u544a\u7c7b\u578b",
    product: "\u5408\u6210\u4ea7\u54c1", region: "\u5408\u6210\u533a\u57df", period: "\u5408\u6210\u65f6\u95f4\u8303\u56f4",
    dose: "\u51c0\u5242\u91cf\u5206\u6bcd", link: "\u4f7f\u7528 Form02 \u4e0e\u5df2\u9009 Form01 \u5173\u8054",
    run: "\u8fd0\u884c\u5408\u6210\u9884\u68c0", draft: "\u521b\u5efa\u672c\u5730 .txt \u5927\u7eb2", reset: "\u4fee\u6539\u4efb\u4f55\u8f93\u5165\u5747\u4f1a\u6e05\u9664\u5c31\u7eea\u72b6\u6001\u548c\u8349\u6848\u3002",
    status: "\u9884\u68c0\u72b6\u6001", idle: "\u672a\u68c0\u67e5", pass: "\u5408\u6210\u95f8\u68c0\u901a\u8fc7", block: "\u5408\u6210\u95f8\u68c0\u963b\u65ad",
    cases: "Form01 \u5408\u6210\u75c5\u4f8b\u6620\u5c04", events: "Form02 \u5408\u6210\u4e8b\u4ef6\u6620\u5c04", productLabel: "\u4ea7\u54c1\u6807\u7b7e",
    caseId: "Form01 ID", event: "\u4e8b\u4ef6\u6807\u7b7e", linked: "\u5df2\u5173\u8054\u7684\u9009\u5b9a\u4ea7\u54c1\u4e8b\u4ef6",
    reasons: "\u963b\u65ad\u539f\u56e0", scope: "\u5408\u6210\u8303\u56f4", review: "\u4ec5\u4f9b\u4eba\u5de5\u590d\u6838",
    noResults: "\u8fd0\u884c\u9884\u68c0\u540e\u8bc4\u4f30\u6b64\u5408\u6210\u8f93\u5165\u3002", outline: "\u672c\u5730\u5408\u6210\u5927\u7eb2",
    download: "\u4e0b\u8f7d .txt", disabled: "\u9700\u8981\u9884\u68c0\u901a\u8fc7\u3002", note: "\u4ec5\u4e3a\u5408\u6210\u6f14\u793a\u72b6\u6001\u3002\u4e0d\u521b\u5efa\u76d1\u7ba1\u62a5\u544a\u3001LLM \u8bf7\u6c42\u3001\u6587\u4ef6\u4e0a\u4f20\u6216\u4e1a\u52a1\u8bb0\u5f55\u3002",
    exact: "\u7cbe\u786e\u6279\u51c6\u522b\u540d\uff1a", linkageOff: "\u5173\u8054\u5df2\u5173\u95ed\uff1b\u6b64\u6f14\u793a\u4e0d\u5c55\u793a\u4e8b\u4ef6\u8ba1\u6570\u3002",
    reason: {
      product_not_approved: "\u9009\u5b9a\u7684\u5408\u6210\u4ea7\u54c1\u6ca1\u6709\u6279\u51c6\u522b\u540d\u3002",
      no_exact_selected_product_case: "\u6ca1\u6709 Form01 \u8bb0\u5f55\u4e0e\u9009\u5b9a\u4ea7\u54c1\u522b\u540d\u7cbe\u786e\u5339\u914d\u3002",
      mixed_product_case_ownership: "Form01 \u8bb0\u5f55\u542b\u6709\u5176\u4ed6\u6216\u76f8\u4f3c\u4f46\u672a\u6279\u51c6\u7684\u4ea7\u54c1\u6807\u7b7e\u3002",
      orphan_or_other_product_event: "Form02 \u4e8b\u4ef6\u672a\u5173\u8054\u5230\u7cbe\u786e\u9009\u5b9a\u4ea7\u54c1\u7684 Form01 ID\u3002",
      denominator_missing: "\u8303\u56f4\u5185\u7684\u5408\u6210\u51c0\u5242\u91cf\u5206\u6bcd\u7f3a\u5931\u3002",
      denominator_zero: "\u8303\u56f4\u5185\u7684\u5408\u6210\u51c0\u5242\u91cf\u5206\u6bcd\u4e3a\u96f6\u3002",
      denominator_negative: "\u8303\u56f4\u5185\u7684\u5408\u6210\u51c0\u5242\u91cf\u5206\u6bcd\u4e3a\u8d1f\u503c\u3002",
      denominator_nonfinite: "\u8303\u56f4\u5185\u7684\u5408\u6210\u51c0\u5242\u91cf\u5206\u6bcd\u4e0d\u662f\u6709\u9650\u503c\u3002",
      scope_incomplete: "\u4ea7\u54c1\u3001\u533a\u57df\u6216\u65f6\u95f4\u8303\u56f4\u4e0d\u5b8c\u6574\u3002"
    } as Record<string,string>
  }
};

export default function Demo({ language }: Props) {
  const t = text[language];
  const [model, setModel] = useState<Model>({ ...SCENARIOS.ready });
  const [preset, setPreset] = useState("ready");
  const [reportType, setReportType] = useState("psur");
  const [linkageEnabled, setLinkageEnabled] = useState(true);
  const [result, setResult] = useState<ReturnType<typeof preflight> | null>(null);
  const [outline, setOutline] = useState("");

  function invalidate(next: Partial<Model> = {}) { setModel((current) => ({ ...current, ...next })); setResult(null); setOutline(""); }
  function choosePreset(key: keyof typeof SCENARIOS) { setPreset(key); setModel({ ...SCENARIOS[key] }); setLinkageEnabled(true); setResult(null); setOutline(""); }
  function runPreflight() { setResult(preflight({ ...model, linkageEnabled })); setOutline(""); }
  function createOutline() { if (!result?.ready) return; setOutline(draftOutline({ reportType, result, linkageEnabled })); }
  function download() { if (!outline) return; const url = URL.createObjectURL(new Blob([outline], { type: "text/plain" })); const link = document.createElement("a"); link.href = url; link.download = "SYN-risk-report-outline.txt"; link.click(); URL.revokeObjectURL(url); }

  return <div className="grid">
    <section className="panel">
      <span className="badge">{t.setup}</span>
      <div className="form">
        <label>{t.scenario}<select value={preset} onChange={(e) => choosePreset(e.target.value as keyof typeof SCENARIOS)}><option value="ready">{t.ready} - SYN-READY-01</option><option value="ambiguous">{t.ambiguous} - SYN-AMBIGUOUS-02</option><option value="missing">{t.missing} - SYN-MISSING-03</option></select></label>
        <div className="two-fields">
          <label>{t.type}<select value={reportType} onChange={(e) => { setReportType(e.target.value); setResult(null); setOutline(""); }}><option value="psur">PSUR (SYN demo)</option><option value="pbrer">PBRER (SYN demo)</option><option value="safety">Safety summary (SYN demo)</option></select></label>
          <label>{t.product}<select value={model.product} onChange={(e) => invalidate({ product: e.target.value })}>{Object.keys(APPROVED_PRODUCTS).map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>
        <div className="two-fields">
          <label>{t.region}<input value={model.region} onChange={(e) => invalidate({ region: e.target.value })} /></label>
          <label>{t.period}<input value={model.period} onChange={(e) => invalidate({ period: e.target.value })} /></label>
        </div>
        <label>{t.dose}<input type="number" min="0" step="1" value={model.netDose} onChange={(e) => invalidate({ netDose: e.target.value })} /></label>
        <label className="inline"><input type="checkbox" checked={linkageEnabled} onChange={(e) => { setLinkageEnabled(e.target.checked); setResult(null); setOutline(""); }} />{t.link}</label>
        <p className="small">{t.reset}</p>
        <p className="small">{t.exact} {APPROVED_PRODUCTS[model.product as keyof typeof APPROVED_PRODUCTS]?.join(" / ")}</p>
        <button className="primary" onClick={runPreflight}>{t.run}</button>
      </div>
    </section>
    <section className="panel">
      <span className={"badge " + (result ? result.ready ? "ok" : "bad" : "")}>{t.status}: {result ? result.ready ? t.pass : t.block : t.idle}</span>
      {!result ? <p className="empty">{t.noResults}</p> : <><h3>{t.scope}</h3><div className="metric-grid"><div className="metric"><span>{t.product}</span><strong>{result.scope.product}</strong></div><div className="metric"><span>{t.dose}</span><strong>{result.scope.denominator ?? "SYN-STOP"}</strong></div><div className="metric"><span>{t.caseId}</span><strong>{result.selectedCases.length}</strong></div><div className="metric"><span>{t.linked}</span><strong>{linkageEnabled ? result.linkedEvents.length : "SYN-N/A"}</strong></div></div>
      {!result.ready && <><h3 style={{marginTop:18}}>{t.reasons}</h3><ul>{result.reasons.map((reason) => <li key={reason}>{t.reason[reason] ?? reason}</li>)}</ul></>}
      {result.ready && <div className="review"><button className="primary" onClick={createOutline}>{t.draft}</button><span className="small">{t.review}</span></div>}
      {!linkageEnabled && <p className="small">{t.linkageOff}</p>}
      {outline && <><h3 style={{marginTop:18}}>{t.outline}</h3><pre>{outline}</pre><button onClick={download}>{t.download}</button></>}
      <p className="notice">{t.note}</p></>}
    </section>
    <section className="panel" style={{gridColumn:"1 / -1"}}>
      <div className="two-fields"><div><h3>{t.cases}</h3><div className="table-scroll"><table><thead><tr><th>{t.caseId}</th><th>{t.productLabel}</th></tr></thead><tbody>{model.form01.map((row) => <tr key={row.id}><td>{row.id}</td><td>{row.productLabel}</td></tr>)}</tbody></table></div></div><div><h3>{t.events}</h3><div className="table-scroll"><table><thead><tr><th>Form02 ID</th><th>{t.caseId}</th><th>{t.event}</th></tr></thead><tbody>{model.form02.map((row) => <tr key={row.id}><td>{row.id}</td><td>{row.form01Id}</td><td>{row.event}</td></tr>)}</tbody></table></div></div></div>
    </section>
  </div>;
}

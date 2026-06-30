const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

const prs = new pptxgen();
prs.layout = "LAYOUT_WIDE";
prs.author = "Dimple";
prs.company = "Chandigarh University";
prs.subject = "MCA Major Project Presentation";
prs.title = "HabitForge — A Full-Stack Habit Tracking Web Application";

const docsDir = "/Users/openclaw/.hermes/projects/habit-forge/docs";
const imgDir = path.join(docsDir, "images");
const ssDir = path.join(docsDir, "screenshots");

function img(f) { return { path: path.join(imgDir, f) }; }
function ss(f) { return { path: path.join(ssDir, f) }; }

const C = {
  primary: "028090", teal: "00A896", mint: "02C39A",
  dark: "1A2332", white: "FFFFFF", light: "F0F4F8",
  text: "2D3748", gray: "718096", accent: "055E68",
};

// ─── SLIDE 1: Title ───
(function() {
  const s = prs.addSlide();
  s.background = { color: C.dark };
  s.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.08, fill: { color: C.primary } });
  s.addText("HabitForge", { x: 0.5, y: 1.5, w: 9, h: 1.5, fontSize: 44, fontFace: "Georgia", color: C.white, bold: true, align: "center" });
  s.addText("A Full-Stack Habit Tracking Web Application", { x: 1, y: 3.0, w: 8, h: 0.8, fontSize: 20, fontFace: "Calibri", color: C.mint, align: "center" });
  s.addShape(prs.ShapeType.rect, { x: 3.5, y: 3.85, w: 3, h: 0.04, fill: { color: C.teal } });
  s.addText("MCA 4th Semester Major Project  |  Chandigarh University", { x: 1, y: 4.2, w: 8, h: 0.5, fontSize: 14, fontFace: "Calibri", color: C.gray, align: "center" });
  s.addText("Dimple  |  23ONMCR-753  |  12 Credits", { x: 1, y: 4.9, w: 8, h: 0.4, fontSize: 12, fontFace: "Calibri", color: C.gray, align: "center" });
})();

// ─── SLIDE 2: Agenda ───
(function() {
  const s = prs.addSlide();
  s.background = { color: C.light };
  s.addText("Agenda", { x: 0.7, y: 0.4, w: 8.6, h: 0.8, fontSize: 32, fontFace: "Georgia", color: C.primary, bold: true });
  const items = [
    "Introduction & Problem Statement",
    "Objectives & Scope",
    "Technology Stack",
    "System Architecture & Design",
    "Key Features & App Screenshots",
    "Database Design (ER Diagram)",
    "Testing Strategy & Results",
    "Deployment & CI/CD",
    "Sprint Timeline",
    "Conclusion & Future Scope",
  ];
  items.forEach((item, i) => {
    const y = 1.4 + i * 0.38;
    s.addShape(prs.ShapeType.ellipse, { x: 0.7, y: y, w: 0.3, h: 0.3, fill: { color: C.primary } });
    s.addText(String(i + 1), { x: 0.7, y: y, w: 0.3, h: 0.3, fontSize: 12, fontFace: "Calibri", color: C.white, bold: true, align: "center", valign: "middle" });
    s.addText(item, { x: 1.2, y: y, w: 8, h: 0.3, fontSize: 14, fontFace: "Calibri", color: C.text, valign: "middle" });
  });
})();

// ─── SLIDE 3: Problem Statement ───
(function() {
  const s = prs.addSlide();
  s.background = { color: C.light };
  s.addText("Introduction & Problem Statement", { x: 0.7, y: 0.4, w: 8.6, h: 0.8, fontSize: 28, fontFace: "Georgia", color: C.primary, bold: true });
  const stats = [
    { num: "92%", desc: "of people who set goals never achieve them" },
    { num: "40%", desc: "habit tracking increases success rate by up to 40%" },
    { num: "Gap", desc: "existing apps lack analytics, mobile-first design & open-source" },
  ];
  stats.forEach((st, i) => {
    const y = 1.5 + i * 1.05;
    s.addShape(prs.ShapeType.rect, { x: 0.7, y: y, w: 3, h: 0.8, fill: { color: C.primary }, rectRadius: 0.08 });
    s.addText(st.num, { x: 0.7, y: y, w: 3, h: 0.8, fontSize: 24, fontFace: "Georgia", color: C.white, bold: true, align: "center", valign: "middle" });
    s.addText(st.desc, { x: 4.0, y: y, w: 5.3, h: 0.8, fontSize: 14, fontFace: "Calibri", color: C.text, valign: "middle" });
  });
  s.addText("HabitForge is a modern, mobile-first, open-source habit tracker built with Next.js 14 and Supabase — designed to close the gap with analytics, gamification, and calendar-based tracking.", { x: 0.7, y: 4.7, w: 8.6, h: 0.5, fontSize: 13, fontFace: "Calibri", color: C.gray, italic: true });
})();

// ─── SLIDE 4: Objectives ───
(function() {
  const s = prs.addSlide();
  s.background = { color: C.light };
  s.addText("Objectives", { x: 0.7, y: 0.4, w: 8.6, h: 0.8, fontSize: 28, fontFace: "Georgia", color: C.primary, bold: true });
  const objs = [
    "Build a mobile-first habit tracking PWA with real-time analytics",
    "Support 4 habit types: Positive, Negative, Target Count, Groups",
    "Recurring events system (menstrual cycle, custom schedules)",
    "Calendar view with visual progress indicators",
    "Badge & achievement system with auto-award via DB triggers",
    "Collective progress tracking in group routines",
    "Deploy on Vercel with CI/CD via GitHub",
    "Complete SDLC documentation per university guidelines",
  ];
  s.addText(objs.map((o, i) => `${i + 1}.  ${o}`).join("\n"), { x: 0.9, y: 1.4, w: 8.2, h: 3.6, fontSize: 14, fontFace: "Calibri", color: C.text, lineSpacingMultiple: 1.15, valign: "top" });
  s.addShape(prs.ShapeType.rect, { x: 0, y: 5.2, w: "100%", h: 0.4, fill: { color: C.primary } });
  s.addText("8 Sprints  |  12 Credits  |  Individual Project  |  Agile SDLC", { x: 0.7, y: 5.2, w: 8.6, h: 0.4, fontSize: 12, fontFace: "Calibri", color: C.white, align: "center", valign: "middle" });
})();

// ─── SLIDE 5: Technology Stack ───
(function() {
  const s = prs.addSlide();
  s.background = { color: C.light };
  s.addText("Technology Stack", { x: 0.7, y: 0.4, w: 8.6, h: 0.8, fontSize: 28, fontFace: "Georgia", color: C.primary, bold: true });
  s.addImage(img("tech_stack.png"), { x: 2.5, y: 1.3, w: 5, h: 3.6 });
  s.addText("Next.js 14  •  Supabase (PostgreSQL)  •  Tailwind CSS v4  •  Recharts  •  Vercel", { x: 0.7, y: 5.2, w: 8.6, h: 0.4, fontSize: 13, fontFace: "Calibri", color: C.gray, align: "center" });
})();

// ─── SLIDE 6: System Architecture ───
(function() {
  const s = prs.addSlide();
  s.background = { color: C.light };
  s.addText("System Architecture", { x: 0.7, y: 0.4, w: 8.6, h: 0.8, fontSize: 28, fontFace: "Georgia", color: C.primary, bold: true });
  s.addImage(img("architecture.png"), { x: 1.5, y: 1.3, w: 7, h: 3.8 });
  s.addText("Client (Next.js) → API Routes → Supabase → PostgreSQL with RLS Policies", { x: 0.7, y: 5.2, w: 8.6, h: 0.4, fontSize: 13, fontFace: "Calibri", color: C.gray, align: "center" });
})();

// ─── SLIDE 7: App Preview — Dashboard & Analytics ───
(function() {
  const s = prs.addSlide();
  s.background = { color: C.light };
  s.addText("App Preview — Dashboard & Analytics", { x: 0.7, y: 0.4, w: 8.6, h: 0.8, fontSize: 24, fontFace: "Georgia", color: C.primary, bold: true });
  s.addImage(ss("dashboard.png"), { x: 0.5, y: 1.3, w: 4.5, h: 3.7 });
  s.addImage(ss("analytics.png"), { x: 5.2, y: 1.3, w: 4.5, h: 3.7 });
  s.addText("Dashboard — Date picker, progress bars, quick-log", { x: 0.5, y: 5.1, w: 4.5, h: 0.4, fontSize: 12, fontFace: "Calibri", color: C.gray, align: "center" });
  s.addText("Analytics — Charts, streaks, category breakdown", { x: 5.2, y: 5.1, w: 4.5, h: 0.4, fontSize: 12, fontFace: "Calibri", color: C.gray, align: "center" });
})();

// ─── SLIDE 8: App Preview — Calendar, Events & Routines ───
(function() {
  const s = prs.addSlide();
  s.background = { color: C.light };
  s.addText("App Preview — Calendar, Events & Routines", { x: 0.7, y: 0.4, w: 8.6, h: 0.8, fontSize: 24, fontFace: "Georgia", color: C.primary, bold: true });
  s.addImage(ss("calendar.png"), { x: 0.2, y: 1.3, w: 3.1, h: 3.7 });
  s.addImage(ss("events.png"), { x: 3.5, y: 1.3, w: 3.1, h: 3.7 });
  s.addImage(ss("routines.png"), { x: 6.8, y: 1.3, w: 3.1, h: 3.7 });
  s.addText("Calendar View", { x: 0.2, y: 5.1, w: 3.1, h: 0.3, fontSize: 11, fontFace: "Calibri", color: C.gray, align: "center" });
  s.addText("Recurring Events", { x: 3.5, y: 5.1, w: 3.1, h: 0.3, fontSize: 11, fontFace: "Calibri", color: C.gray, align: "center" });
  s.addText("Group Routines", { x: 6.8, y: 5.1, w: 3.1, h: 0.3, fontSize: 11, fontFace: "Calibri", color: C.gray, align: "center" });
})();

// ─── SLIDE 9: Database Design ───
(function() {
  const s = prs.addSlide();
  s.background = { color: C.light };
  s.addText("Database Design — ER Diagram", { x: 0.7, y: 0.4, w: 8.6, h: 0.8, fontSize: 28, fontFace: "Georgia", color: C.primary, bold: true });
  s.addImage(img("er_diagram.png"), { x: 1.5, y: 1.3, w: 7, h: 3.8 });
  s.addText("8 Tables  |  Row Level Security (RLS)  |  RPC Badge Awards  |  JSONB Links Column", { x: 0.7, y: 5.2, w: 8.6, h: 0.4, fontSize: 13, fontFace: "Calibri", color: C.gray, align: "center" });
})();

// ─── SLIDE 10: Testing Strategy & Results (FIXED) ───
(function() {
  const s = prs.addSlide();
  s.background = { color: C.light };
  s.addText("Testing Strategy & Results", { x: 0.7, y: 0.4, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Georgia", color: C.primary, bold: true });
  s.addImage(img("testing_pyramid.png"), { x: 0.5, y: 1.1, w: 4.0, h: 3.2 });

  // Testing details on the right
  const testDetails = [
    { label: "Unit Tests", detail: "42 tests — Jest + React Testing Library" },
    { label: "Integration", detail: "16 tests — Playwright API flows" },
    { label: "E2E Tests", detail: "8 scenarios — Manual checklist" },
    { label: "Status", detail: "✅ ALL PASSING — 100% pass rate" },
  ];
  testDetails.forEach((td, i) => {
    const y = 1.2 + i * 0.85;
    s.addShape(prs.ShapeType.rect, { x: 5.0, y: y, w: 4.5, h: 0.7, fill: { color: i === 3 ? C.mint : C.white }, rectRadius: 0.06 });
    s.addText(td.label, { x: 5.2, y: y, w: 1.5, h: 0.7, fontSize: 13, fontFace: "Calibri", color: i === 3 ? C.white : C.primary, bold: true, valign: "middle" });
    s.addText(td.detail, { x: 6.7, y: y, w: 2.6, h: 0.7, fontSize: 12, fontFace: "Calibri", color: i === 3 ? C.white : C.text, valign: "middle" });
  });

  // Summary bar at bottom
  s.addShape(prs.ShapeType.rect, { x: 0, y: 4.8, w: "100%", h: 0.5, fill: { color: C.primary } });
  s.addText("3 Layers Tested  |  66 Total Tests  |  100% Pass Rate  |  Manual QA Completed", { x: 0.7, y: 4.8, w: 8.6, h: 0.5, fontSize: 12, fontFace: "Calibri", color: C.white, align: "center", valign: "middle" });
})();

// ─── SLIDE 11: Deployment & Sprint Timeline (FIXED) ───
(function() {
  const s = prs.addSlide();
  s.background = { color: C.light };
  s.addText("Deployment & Sprint Timeline", { x: 0.7, y: 0.4, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Georgia", color: C.primary, bold: true });

  // Deployment details on the left
  const deployItems = [
    "Platform: Vercel (auto-deploy via GitHub push)",
    "Live URL: habit-forge-seven.vercel.app",
    "CI/CD: GitHub → Vercel → Production",
    "Database: Supabase PostgreSQL with RLS",
    "CDN: Vercel Edge Network (global)",
    "SSL: Automatic HTTPS via Let's Encrypt",
  ];
  s.addText(deployItems.map(d => `•  ${d}`).join("\n"), { x: 0.7, y: 1.2, w: 4.3, h: 3.0, fontSize: 13, fontFace: "Calibri", color: C.text, lineSpacingMultiple: 1.2, valign: "top" });

  // Timeline image on the right
  s.addImage(img("sprint_timeline.png"), { x: 5.3, y: 1.2, w: 4.3, h: 3.2 });

  // Summary bar
  s.addShape(prs.ShapeType.rect, { x: 0, y: 4.8, w: "100%", h: 0.5, fill: { color: C.primary } });
  s.addText("8 Sprints  |  Agile Iterative Model  |  June 2026", { x: 0.7, y: 4.8, w: 8.6, h: 0.5, fontSize: 12, fontFace: "Calibri", color: C.white, align: "center", valign: "middle" });
})();

// ─── SLIDE 12: Conclusion & Future Scope (FIXED) ───
(function() {
  const s = prs.addSlide();
  s.background = { color: C.dark };
  s.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.08, fill: { color: C.primary } });
  s.addText("Conclusion & Future Scope", { x: 0.7, y: 0.4, w: 8.6, h: 0.6, fontSize: 28, fontFace: "Georgia", color: C.white, bold: true });

  // Left column — Conclusion
  const conclusions = [
    "Full-stack habit tracker deployed & tested",
    "Mobile-first responsive design on all pages",
    "Real-time analytics with Recharts visualizations",
    "Calendar, Events, Badges, Groups all functional",
    "Supabase RLS for secure multi-tenant data",
  ];
  s.addText("Key Achievements", { x: 0.9, y: 1.2, w: 3.8, h: 0.4, fontSize: 16, fontFace: "Georgia", color: C.mint, bold: true });
  conclusions.forEach((c, i) => {
    const y = 1.7 + i * 0.55;
    s.addShape(prs.ShapeType.ellipse, { x: 0.9, y: y + 0.08, w: 0.2, h: 0.2, fill: { color: C.teal } });
    s.addText(String(i + 1), { x: 0.9, y: y + 0.08, w: 0.2, h: 0.2, fontSize: 9, fontFace: "Calibri", color: C.white, bold: true, align: "center", valign: "middle" });
    s.addText(c, { x: 1.2, y: y, w: 3.5, h: 0.4, fontSize: 12, fontFace: "Calibri", color: C.white, valign: "middle" });
  });

  // Right column — Future Scope
  s.addShape(prs.ShapeType.rect, { x: 5.3, y: 1.2, w: 4.2, h: 3.0, fill: { color: "2D3748" }, rectRadius: 0.1 });
  s.addText("Future Scope", { x: 5.5, y: 1.3, w: 3.8, h: 0.4, fontSize: 16, fontFace: "Georgia", color: C.mint, bold: true });
  const future = [
    "AI-powered habit recommendations (LLM)",
    "Social features: friend challenges, leaderboards",
    "Browser extension for site-blocking",
    "Wearable integration (Google Fit, Apple Health)",
    "Premium tier with advanced analytics",
  ];
  future.forEach((f, i) => {
    const y = 1.8 + i * 0.45;
    s.addText(`→  ${f}`, { x: 5.5, y: y, w: 3.8, h: 0.4, fontSize: 12, fontFace: "Calibri", color: "CBD5E0" });
  });

  // Thank you
  s.addText("Thank You  |  Q&A", { x: 1.0, y: 4.7, w: 8, h: 0.5, fontSize: 18, fontFace: "Georgia", color: C.mint, align: "center" });
})();

// ─── WRITE ───
const outPath = path.join(docsDir, "HabitForge_Presentation_v3.pptx");
prs.writeFile({ fileName: outPath }).then(() => {
  const size = fs.statSync(outPath).size;
  console.log(`✅ Saved: ${outPath} (${(size / 1024).toFixed(0)} KB)`);
}).catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});

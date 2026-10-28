// Shared design tokens + content normalisation for the PDF and DOCX exports.
// Content (what is printed) and presentation (how it looks) both live here,
// so the two exports cannot drift apart.

const tokens = {
  // A4
  page: { widthPt: 595.28, heightPt: 841.89, widthTw: 11906, heightTw: 16838 },
  // Margins in points (1pt = 20 twips). 50pt ≈ 0.69", 40pt ≈ 0.56"
  marginPt: { top: 40, bottom: 40, left: 50, right: 50 },

  fontPdf: {
    regular: "Times-Roman",
    bold: "Times-Bold",
    italic: "Times-Italic",
  },
  fontDocx: "Times New Roman",

  namePt: 25,
  // Try the largest first; drop only as far as the last entry to fit 1 page.
  bodySizesPt: [12, 11.5, 11, 10.5],
  // If the content cannot fit one page, flow onto page 2 at this size
  // instead of shrinking further.
  multiPageBodyPt: 11,

  lineHeightEm: 1.15, // same value used for PDF line gaps and DOCX exact spacing
  headingExtraPt: 1, // heading = body + 1pt
  contactMinusPt: 1, // contact = body - 1pt

  gapBeforeHeadingPt: 9,
  gapAfterRulePt: 4,
  ruleGapPt: 2, // distance between heading line box and its rule
  ruleWidthPt: 0.75,
  gapBetweenEntriesPt: 4,
  gapAfterBulletPt: 1,
  gapAfterContactPt: 2,
  gapAfterNamePt: 3,

  bulletXPt: 10, // bullet glyph offset from left margin
  bulletTextXPt: 22, // text offset (wrapped lines align here)
  skillsIndentPt: 10,

  color: "000000",
};

const contentWidthPt = () =>
  tokens.page.widthPt - tokens.marginPt.left - tokens.marginPt.right;
const contentWidthTw = () =>
  tokens.page.widthTw - (tokens.marginPt.left + tokens.marginPt.right) * 20;
const lineHeightPt = (size) => size * tokens.lineHeightEm;
const sizesFor = (body) => ({
  body,
  heading: body + tokens.headingExtraPt,
  contact: body - tokens.contactMinusPt,
  name: tokens.namePt,
});

function cleanText(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/[\u2010\u2011]/g, "-")
    .replace(/\u2192/g, "->")
    .replace(/\u2265/g, ">=")
    .replace(/\u2264/g, "<=")
    .replace(/\s+/g, " ")
    .trim();
}

const list = (v) => (Array.isArray(v) ? v : []);
const join = (arr, sep) => arr.map(cleanText).filter(Boolean).join(sep);
const itemText = (item) =>
  typeof item === "string"
    ? cleanText(item)
    : cleanText(item?.name || item?.title || item?.description || "");

// Split the contact line into atoms: plain words/spaces and links.
const CONTACT_PATTERN =
  /(?:https?:\/\/|www\.)[^\s|,]+|(?:github\.com|linkedin\.com)\/[^\s|,]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/gi;

function contactAtoms(value) {
  const text = cleanText(value);
  const atoms = [];
  const pushPlain = (s) => {
    s.split(/(\s+)/).forEach((w) => w && atoms.push({ text: w }));
  };
  let last = 0;
  let m;
  CONTACT_PATTERN.lastIndex = 0;
  while ((m = CONTACT_PATTERN.exec(text)) !== null) {
    if (m.index > last) pushPlain(text.slice(last, m.index));
    const label = m[0].replace(/[.)]+$/, "");
    let url = label;
    if (/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/i.test(label)) url = `mailto:${label}`;
    else if (!/^https?:\/\//i.test(label)) url = `https://${label}`;
    atoms.push({ text: label, link: url });
    last = m.index + label.length;
    CONTACT_PATTERN.lastIndex = last;
  }
  if (last < text.length) pushPlain(text.slice(last));
  return atoms;
}

// One normalised model, consumed by both renderers.
function normalize(resume) {
  const r = resume || {};

  const skills = list(r.technicalSkills)
    .map((s) => ({
      category: cleanText(s?.category),
      text: Array.isArray(s?.skills) ? join(s.skills, ", ") : cleanText(s?.skills),
    }))
    .filter((s) => s.text);

  const experience = list(r.experience)
    .filter(Boolean)
    .map((e) => {
      const org = cleanText(e.organization);
      const pos = cleanText(e.position);
      return {
        title: org || pos,
        sub: org ? pos : "",
        dates: cleanText(e.dates),
        bullets: list(e.bullets).map(cleanText).filter(Boolean),
      };
    })
    .filter((e) => e.title || e.bullets.length);

  const projects = list(r.projects)
    .filter(Boolean)
    .map((p) => ({
      name: cleanText(p.name) || "Project",
      tech: Array.isArray(p.technologies)
        ? join(p.technologies, ", ")
        : cleanText(p.technologies),
      bullets: list(p.bullets).map(cleanText).filter(Boolean),
    }));

  const education = list(r.education)
    .filter(Boolean)
    .map((e) => {
      const inst = cleanText(e.institution);
      const deg = cleanText(e.degree);
      return {
        title: inst || deg,
        sub: inst ? join([deg, e.grade], " \u2014 ") : cleanText(e.grade),
        dates: cleanText(e.dates),
      };
    })
    .filter((e) => e.title);

  const extras = [
    ["Certifications", r.certifications],
    ["Achievements", r.achievements],
  ]
    .map(([title, items]) => ({
      title,
      items: list(items).map(itemText).filter(Boolean),
    }))
    .filter((x) => x.items.length);

  return {
    name: cleanText(r.fullName) || "Candidate Name",
    contact: contactAtoms(r.contactLine),
    summary: cleanText(r.professionalSummary),
    skills,
    experience,
    projects,
    education,
    extras,
  };
}

module.exports = {
  tokens,
  contentWidthPt,
  contentWidthTw,
  lineHeightPt,
  sizesFor,
  cleanText,
  normalize,
};

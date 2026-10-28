const PDFDocument = require("pdfkit");
const {
  tokens: T,
  contentWidthPt,
  lineHeightPt,
  sizesFor,
  normalize,
} = require("./resumeLayout");

// Draws the whole resume at one body size. Every block is measured before it
// is drawn and y is always set explicitly, so nothing depends on PDFKit's
// moveDown()/doc.y bookkeeping (the cause of the old rule-through-text bug).
function renderPdf(resume, bodyPt) {
  return new Promise((resolve, reject) => {
    const m = normalize(resume);
    const S = sizesFor(bodyPt);
    const M = T.marginPt;
    const left = M.left;
    const width = contentWidthPt();
    const right = left + width;
    const bottom = T.page.heightPt - M.bottom;

    const doc = new PDFDocument({
      size: "A4",
      margins: { top: M.top, bottom: 0, left: M.left, right: M.right },
      info: { Title: `${m.name} - Resume` },
    });

    let pages = 1;
    const chunks = [];
    doc.on("pageAdded", () => (pages += 1));
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve({ buffer: Buffer.concat(chunks), pages }));
    doc.on("error", reject);

    let y = M.top;

    const setFont = (kind, size) => {
      doc.font(T.fontPdf[kind]).fontSize(size).fillColor("#" + T.color);
    };
    const opts = (size, extra = {}) => {
      // line step = size * lineHeightEm, same as the DOCX "exact" spacing
      const gap = lineHeightPt(size) - doc.currentLineHeight(true);
      return { lineGap: gap, ...extra };
    };
    const heightOf = (text, size, w, extra) =>
      doc.heightOfString(text, { width: w, ...opts(size, extra) });

    function ensure(h) {
      if (y + h > bottom) {
        doc.addPage({
          size: "A4",
          margins: { top: M.top, bottom: 0, left: M.left, right: M.right },
        });
        y = M.top;
      }
    }

    // one wrapped paragraph of a single style
    function paragraph(text, kind, size, { x = left, w = width, align = "left" } = {}) {
      if (!text) return;
      setFont(kind, size);
      const h = heightOf(text, size, w);
      ensure(h);
      doc.text(text, x, y, { width: w, align, ...opts(size) });
      y += h;
    }

    // bold lead-in + regular text on one wrapped paragraph
    function labelled(label, text, size, x = left, w = width) {
      const full = label ? `${label}: ${text}` : text;
      setFont("regular", size);
      const h = heightOf(full, size, w);
      ensure(h);
      if (label) {
        setFont("bold", size);
        doc.text(`${label}: `, x, y, { width: w, continued: true, ...opts(size) });
        setFont("regular", size);
        doc.text(text, { width: w, continued: false, ...opts(size) });
      } else {
        doc.text(text, x, y, { width: w, ...opts(size) });
      }
      y += h;
    }

    // title on the left, date flush right on the same line
    function titleRow(title, dates, size) {
      const lh = lineHeightPt(size);
      ensure(lh * 2);
      setFont("bold", size);
      let dateW = 0;
      if (dates) {
        dateW = doc.widthOfString(dates);
        doc.text(dates, right - dateW, y, { lineBreak: false });
      }
      const titleW = width - (dates ? dateW + 12 : 0);
      setFont("bold", size);
      const h = Math.max(heightOf(title, size, titleW), lh);
      doc.text(title, left, y, { width: titleW, ...opts(size) });
      y += h;
    }

    function bullet(text, size) {
      const x = left + T.bulletTextXPt;
      const w = width - T.bulletTextXPt;
      setFont("regular", size);
      const h = heightOf(text, size, w);
      ensure(h);
      doc.text("\u2022", left + T.bulletXPt, y, { lineBreak: false });
      doc.text(text, x, y, { width: w, ...opts(size) });
      y += h + T.gapAfterBulletPt;
    }

    function heading(title) {
      const size = S.heading;
      const lh = lineHeightPt(size);
      // keep heading together with at least the first lines of its content
      ensure(
        T.gapBeforeHeadingPt + lh + T.ruleGapPt + T.gapAfterRulePt + lineHeightPt(S.body) * 2
      );
      y += T.gapBeforeHeadingPt;
      setFont("bold", size);
      doc.text(title.toUpperCase(), left, y, { width, lineBreak: false });
      y += lh + T.ruleGapPt;
      doc
        .moveTo(left, y)
        .lineTo(right, y)
        .lineWidth(T.ruleWidthPt)
        .strokeColor("#" + T.color)
        .stroke();
      y += T.gapAfterRulePt;
    }

    // ---- Header --------------------------------------------------------
    setFont("bold", S.name);
    const nameH = lineHeightPt(S.name);
    doc.text(m.name, left, y, { width, align: "center", lineBreak: false });
    y += nameH + T.gapAfterNamePt;

    // contact line: manual wrap so links stay clickable and centred
    if (m.contact.length) {
      setFont("regular", S.contact);
      const lines = [[]];
      let lineW = 0;
      m.contact.forEach((a) => {
        const aw = doc.widthOfString(a.text);
        const isSpace = !a.link && /^\s+$/.test(a.text);
        if (!isSpace && lineW + aw > width && lines[lines.length - 1].length) {
          lines.push([]);
          lineW = 0;
        }
        const cur = lines[lines.length - 1];
        if (isSpace && !cur.length) return;
        cur.push({ ...a, w: aw });
        lineW += aw;
      });
      lines.forEach((ln) => {
        while (ln.length && !ln[ln.length - 1].link && /^\s+$/.test(ln[ln.length - 1].text)) ln.pop();
        const total = ln.reduce((s, a) => s + a.w, 0);
        ensure(lineHeightPt(S.contact));
        let x = left + (width - total) / 2;
        ln.forEach((a) => {
          const o = { lineBreak: false };
          if (a.link) {
            o.link = a.link;
            o.underline = true;
          }
          doc.text(a.text, x, y, o);
          x += a.w;
        });
        y += lineHeightPt(S.contact);
      });
      y += T.gapAfterContactPt;
    }

    // ---- Sections ------------------------------------------------------
    if (m.summary) {
      heading("Professional Summary");
      paragraph(m.summary, "regular", S.body);
    }

    if (m.skills.length) {
      heading("Technical Skills");
      m.skills.forEach((s) =>
        labelled(s.category, s.text, S.body, left + T.skillsIndentPt, width - T.skillsIndentPt)
      );
    }

    if (m.experience.length) {
      heading("Experience");
      m.experience.forEach((e, i) => {
        if (i) y += T.gapBetweenEntriesPt;
        titleRow(e.title, e.dates, S.body);
        if (e.sub) paragraph(e.sub, "italic", S.body);
        e.bullets.forEach((b) => bullet(b, S.body));
      });
    }

    if (m.projects.length) {
      heading("Projects");
      m.projects.forEach((p, i) => {
        if (i) y += T.gapBetweenEntriesPt;
        const full = p.tech ? `${p.name} \u2014 ${p.tech}` : p.name;
        setFont("regular", S.body);
        const h = heightOf(full, S.body, width);
        ensure(h + lineHeightPt(S.body));
        setFont("bold", S.body);
        if (p.tech) {
          doc.text(p.name, left, y, { width, continued: true, ...opts(S.body) });
          setFont("italic", S.body);
          doc.text(` \u2014 ${p.tech}`, { width, continued: false, ...opts(S.body) });
        } else {
          doc.text(p.name, left, y, { width, ...opts(S.body) });
        }
        y += h;
        p.bullets.forEach((b) => bullet(b, S.body));
      });
    }

    if (m.education.length) {
      heading("Education");
      m.education.forEach((e, i) => {
        if (i) y += T.gapBetweenEntriesPt;
        titleRow(e.title, e.dates, S.body);
        if (e.sub) paragraph(e.sub, "italic", S.body);
      });
    }

    m.extras.forEach((x) => {
      heading(x.title);
      x.items.forEach((t) => bullet(t, S.body));
    });

    doc.end();
  });
}

// Pick the largest body size that fits on one page; otherwise flow to a
// second page at a readable size rather than shrinking further.
async function fit(resume) {
  for (const size of T.bodySizesPt) {
    const out = await renderPdf(resume, size);
    if (out.pages === 1) return { ...out, bodyPt: size };
  }
  const out = await renderPdf(resume, T.multiPageBodyPt);
  return { ...out, bodyPt: T.multiPageBodyPt };
}

async function generateResumePdf(resume) {
  if (!resume || typeof resume !== "object" || Array.isArray(resume)) {
    throw new Error("Invalid resume data");
  }
  return (await fit(resume)).buffer;
}

module.exports = generateResumePdf;
module.exports.fit = fit;

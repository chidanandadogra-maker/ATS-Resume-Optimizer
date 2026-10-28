const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  ExternalHyperlink,
  LevelFormat,
  LineRuleType,
  TabStopType,
  BorderStyle,
} = require("docx");

const {
  tokens: T,
  contentWidthTw,
  lineHeightPt,
  sizesFor,
  normalize,
} = require("./resumeLayout");
const { fit } = require("./generateResumePdf");

const tw = (pt) => Math.round(pt * 20); // points -> twips
const hp = (pt) => Math.round(pt * 2); // points -> half-points
const FONT = T.fontDocx;

async function generateResumeDocx(resume) {
  if (!resume || typeof resume !== "object" || Array.isArray(resume)) {
    throw new Error("Invalid resume data");
  }

  // Use the exact body size the PDF settled on, so both files paginate alike.
  const { bodyPt } = await fit(resume);
  const S = sizesFor(bodyPt);
  const m = normalize(resume);

  // Exact line spacing = same line step the PDF uses.
  const exact = (size) => ({
    line: tw(lineHeightPt(size)),
    lineRule: LineRuleType.EXACT,
  });

  const run = (text, o = {}) =>
    new TextRun({
      text,
      font: FONT,
      size: hp(o.size || S.body),
      bold: !!o.bold,
      italics: !!o.italics,
      color: T.color,
    });

  const children = [];

  // ---- Header ----------------------------------------------------------
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      keepNext: true,
      spacing: { before: 0, after: tw(T.gapAfterNamePt), ...exact(S.name) },
      children: [run(m.name, { bold: true, size: S.name })],
    })
  );

  if (m.contact.length) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: tw(T.gapAfterContactPt), ...exact(S.contact) },
        children: m.contact.map((a) =>
          a.link
            ? new ExternalHyperlink({
                link: a.link,
                children: [
                  new TextRun({
                    text: a.text,
                    font: FONT,
                    size: hp(S.contact),
                    color: T.color,
                    underline: {},
                  }),
                ],
              })
            : run(a.text, { size: S.contact })
        ),
      })
    );
  }

  // ---- Paragraph builders ------------------------------------------------
  const heading = (title) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_2, // style overridden below
      keepNext: true,
      children: [run(title.toUpperCase(), { bold: true, size: S.heading })],
    });

  const body = (runs, { before = 0, keepNext = false, indent } = {}) =>
    new Paragraph({
      keepLines: true,
      keepNext,
      indent,
      spacing: { before: tw(before), after: 0, ...exact(S.body) },
      children: runs,
    });

  const row = (title, dates, before) =>
    new Paragraph({
      keepLines: true,
      keepNext: true,
      tabStops: [{ type: TabStopType.RIGHT, position: contentWidthTw() }],
      spacing: { before: tw(before), after: 0, ...exact(S.body) },
      children: [
        run(title, { bold: true }),
        ...(dates ? [new TextRun({ text: "\t", font: FONT, size: hp(S.body) }), run(dates, { bold: true })] : []),
      ],
    });

  const bullet = (text) =>
    new Paragraph({
      keepLines: true,
      numbering: { reference: "resume-bullets", level: 0 },
      spacing: { before: 0, after: tw(T.gapAfterBulletPt), ...exact(S.body) },
      children: [run(text)],
    });

  // ---- Sections (same order and content as the PDF) ----------------------
  if (m.summary) {
    children.push(heading("Professional Summary"), body([run(m.summary)]));
  }

  if (m.skills.length) {
    children.push(heading("Technical Skills"));
    m.skills.forEach((s) =>
      children.push(
        body(
          [
            ...(s.category ? [run(`${s.category}: `, { bold: true })] : []),
            run(s.text),
          ],
          { indent: { left: tw(T.skillsIndentPt) } }
        )
      )
    );
  }

  if (m.experience.length) {
    children.push(heading("Experience"));
    m.experience.forEach((e, i) => {
      children.push(row(e.title, e.dates, i ? T.gapBetweenEntriesPt : 0));
      if (e.sub) children.push(body([run(e.sub, { italics: true })], { keepNext: e.bullets.length > 0 }));
      e.bullets.forEach((b) => children.push(bullet(b)));
    });
  }

  if (m.projects.length) {
    children.push(heading("Projects"));
    m.projects.forEach((p, i) => {
      children.push(
        body(
          [
            run(p.name, { bold: true }),
            ...(p.tech ? [run(` \u2014 ${p.tech}`, { italics: true })] : []),
          ],
          { before: i ? T.gapBetweenEntriesPt : 0, keepNext: p.bullets.length > 0 }
        )
      );
      p.bullets.forEach((b) => children.push(bullet(b)));
    });
  }

  if (m.education.length) {
    children.push(heading("Education"));
    m.education.forEach((e, i) => {
      children.push(row(e.title, e.dates, i ? T.gapBetweenEntriesPt : 0));
      if (e.sub) children.push(body([run(e.sub, { italics: true })]));
    });
  }

  m.extras.forEach((x) => {
    children.push(heading(x.title));
    x.items.forEach((t) => children.push(bullet(t)));
  });

  const doc = new Document({
    creator: "ATS Resume Optimizer",
    title: `${m.name} - Resume`,
    styles: {
      default: {
        document: {
          run: { font: FONT, size: hp(S.body), color: T.color },
          paragraph: { spacing: { before: 0, after: 0 } },
        },
      },
      // Override Word's built-in "Heading 2": keeps real heading semantics
      // (navigation pane, ATS parsers) with our own look and a native border.
      paragraphStyles: [
        {
          id: "Heading2",
          name: "heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { font: FONT, size: hp(S.heading), bold: true, color: T.color },
          paragraph: {
            keepNext: true,
            outlineLevel: 1,
            spacing: {
              before: tw(T.gapBeforeHeadingPt),
              after: tw(T.gapAfterRulePt),
              ...exact(S.heading),
            },
            border: {
              bottom: {
                style: BorderStyle.SINGLE,
                color: T.color,
                size: 6, // eighths of a point (0.75pt)
                space: T.ruleGapPt,
              },
            },
          },
        },
      ],
    },
    numbering: {
      config: [
        {
          reference: "resume-bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "\u2022",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: {
                    left: tw(T.bulletTextXPt),
                    hanging: tw(T.bulletTextXPt - T.bulletXPt),
                  },
                },
                run: { font: FONT },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: T.page.widthTw, height: T.page.heightTw },
            margin: {
              top: tw(T.marginPt.top),
              bottom: tw(T.marginPt.bottom),
              left: tw(T.marginPt.left),
              right: tw(T.marginPt.right),
              header: 0,
              footer: 0,
            },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}

module.exports = generateResumeDocx;

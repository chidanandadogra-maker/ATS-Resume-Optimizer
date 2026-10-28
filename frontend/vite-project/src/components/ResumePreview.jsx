import React from "react";

// Mirrors the PDF/DOCX layout (backend/services/resumeLayout.js):
// A4, Times, centred header, uppercase headings with a rule, dates flush right.
// Sizes are in points so the preview scales exactly like the printed page.
const T = {
  marginTop: "40pt",
  marginSide: "50pt",
  body: 12, // exports step down to 10.5pt only when a page would overflow
  name: 25,
  lineHeight: 1.15,
};

const CONTACT_PATTERN =
  /((?:https?:\/\/|www\.)[^\s|,]+|(?:github\.com|linkedin\.com)\/[^\s|,]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/gi;

function hrefFor(value) {
  if (/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/i.test(value)) return `mailto:${value}`;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

const text = (v) => (v === null || v === undefined ? "" : String(v).trim());
const list = (v) => (Array.isArray(v) ? v : []);

function Section({ title, children }) {
  return (
    <section style={{ marginTop: "9pt" }}>
      <h2
        style={{
          margin: 0,
          fontSize: `${T.body + 1}pt`,
          fontWeight: 700,
          textTransform: "uppercase",
          lineHeight: T.lineHeight,
          paddingBottom: "2pt",
          borderBottom: "0.75pt solid #000",
          marginBottom: "4pt",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ title, dates }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "12pt" }}>
      <strong>{title}</strong>
      {dates && <strong style={{ whiteSpace: "nowrap" }}>{dates}</strong>}
    </div>
  );
}

function Bullets({ items }) {
  if (!items.length) return null;
  return (
    <ul style={{ margin: 0, paddingLeft: "22pt", listStyle: "disc" }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: "1pt" }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function ResumePreview({ resume: resumeProp }) {
  const resume = resumeProp?.optimizedResume || resumeProp;

  if (!resume || typeof resume !== "object") {
    return (
      <div className="bg-white border p-6 text-sm text-gray-500">
        Optimize a resume to see the preview.
      </div>
    );
  }

  const contactParts = text(resume.contactLine).split(CONTACT_PATTERN);

  const skills = list(resume.technicalSkills).filter(Boolean);
  const experience = list(resume.experience).filter(Boolean);
  const projects = list(resume.projects).filter(Boolean);
  const education = list(resume.education).filter(Boolean);
  const extras = [
    ["Certifications", resume.certifications],
    ["Achievements", resume.achievements],
  ]
    .map(([title, items]) => [
      title,
      list(items)
        .map((i) =>
          typeof i === "string" ? i : i?.name || i?.title || i?.description || ""
        )
        .map(text)
        .filter(Boolean),
    ])
    .filter(([, items]) => items.length);

  return (
    <div className="overflow-x-auto bg-gray-100 p-3 sm:p-6">
      <article
        className="mx-auto bg-white text-black shadow-md"
        style={{
          boxSizing: "border-box",
          width: "210mm",
          minHeight: "297mm",
          padding: `${T.marginTop} ${T.marginSide}`,
          fontFamily: '"Times New Roman", Times, "Liberation Serif", serif',
          fontSize: `${T.body}pt`,
          lineHeight: T.lineHeight,
        }}
      >
        <header style={{ textAlign: "center" }}>
          <h1
            style={{
              margin: 0,
              fontSize: `${T.name}pt`,
              fontWeight: 700,
              lineHeight: T.lineHeight,
            }}
          >
            {text(resume.fullName) || "Candidate Name"}
          </h1>
          {!!text(resume.contactLine) && (
            <p style={{ margin: "3pt 0 0", fontSize: `${T.body - 1}pt` }}>
              {contactParts.map((part, i) =>
                i % 2 === 1 ? (
                  <a
                    key={i}
                    href={hrefFor(part)}
                    target={part.includes("@") ? undefined : "_blank"}
                    rel="noreferrer"
                    style={{ color: "inherit", textDecoration: "underline" }}
                  >
                    {part}
                  </a>
                ) : (
                  <React.Fragment key={i}>{part}</React.Fragment>
                )
              )}
            </p>
          )}
        </header>

        {text(resume.professionalSummary) && (
          <Section title="Professional Summary">
            <p style={{ margin: 0 }}>{text(resume.professionalSummary)}</p>
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Technical Skills">
            {skills.map((s, i) => (
              <p key={i} style={{ margin: 0, paddingLeft: "10pt" }}>
                {text(s.category) && <strong>{text(s.category)}: </strong>}
                {Array.isArray(s.skills) ? s.skills.map(text).filter(Boolean).join(", ") : text(s.skills)}
              </p>
            ))}
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience">
            {experience.map((e, i) => {
              const org = text(e.organization);
              const pos = text(e.position);
              return (
                <div key={i} style={{ marginTop: i ? "4pt" : 0 }}>
                  <Row title={org || pos} dates={text(e.dates)} />
                  {org && pos && <div style={{ fontStyle: "italic" }}>{pos}</div>}
                  <Bullets items={list(e.bullets).map(text).filter(Boolean)} />
                </div>
              );
            })}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects">
            {projects.map((p, i) => {
              const tech = Array.isArray(p.technologies)
                ? p.technologies.map(text).filter(Boolean).join(", ")
                : text(p.technologies);
              return (
                <div key={i} style={{ marginTop: i ? "4pt" : 0 }}>
                  <div>
                    <strong>{text(p.name) || "Project"}</strong>
                    {tech && <em> {"\u2014"} {tech}</em>}
                  </div>
                  <Bullets items={list(p.bullets).map(text).filter(Boolean)} />
                </div>
              );
            })}
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education">
            {education.map((e, i) => {
              const inst = text(e.institution);
              const deg = text(e.degree);
              const sub = inst
                ? [deg, text(e.grade)].filter(Boolean).join(" \u2014 ")
                : text(e.grade);
              return (
                <div key={i} style={{ marginTop: i ? "4pt" : 0 }}>
                  <Row title={inst || deg} dates={text(e.dates)} />
                  {sub && <div style={{ fontStyle: "italic" }}>{sub}</div>}
                </div>
              );
            })}
          </Section>
        )}

        {extras.map(([title, items]) => (
          <Section key={title} title={title}>
            <Bullets items={items} />
          </Section>
        ))}
      </article>
    </div>
  );
}

export default ResumePreview;

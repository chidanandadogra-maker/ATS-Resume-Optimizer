
const mammoth = require("mammoth");
const { PDFParse } = require("pdf-parse");

async function parseResume(file) {
  const extension = file.originalname
    .split(".")
    .pop()
    .toLowerCase();

  // PDF file theke text extract
  if (extension === "pdf") {
    const parser = new PDFParse({
      data: file.buffer,
    });

    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      await parser.destroy();
    }
  }

  // DOCX file theke text extract
  if (extension === "docx") {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    return result.value;
  }

  throw new Error("Unsupported file type");
}

module.exports = parseResume;
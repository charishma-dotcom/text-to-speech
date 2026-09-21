import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  pdfWorker;

function FileUpload({
  onTextExtracted,
  setLoading
}) {
  const handleFile = async (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setLoading(true);

    try {
      const extension =
        file.name
          .split(".")
          .pop()
          .toLowerCase();

      let extractedText = "";

      if (extension === "txt") {
        extractedText =
          await file.text();
      }

      else if (extension === "pdf") {
        extractedText =
          await extractPdf(file);
      }

      else if (extension === "docx") {
        extractedText =
          await extractDocx(file);
      }

      else {
        throw new Error(
          "Only TXT, PDF and DOCX files are supported."
        );
      }

      if (!extractedText.trim()) {
        throw new Error(
          "No readable text was found in the file."
        );
      }

      onTextExtracted(
        extractedText.trim()
      );
    } catch (error) {
      alert(
        error.message ||
          "Unable to read the file."
      );
    } finally {
      setLoading(false);

      event.target.value = "";
    }
  };

  return (
    <div className="upload-box">
      <div className="upload-icon">
        📄
      </div>

      <h3>
        Upload a document
      </h3>

      <p>
        Supported formats:
        <br />
        TXT • PDF • DOCX
      </p>

      <label className="upload-button">
        Choose File

        <input
          type="file"
          accept=".txt,.pdf,.docx"
          onChange={handleFile}
          hidden
        />
      </label>
    </div>
  );
}

async function extractPdf(file) {
  const arrayBuffer =
    await file.arrayBuffer();

  const pdf =
    await pdfjsLib.getDocument({
      data: arrayBuffer
    }).promise;

  let text = "";

  for (
    let pageNumber = 1;
    pageNumber <= pdf.numPages;
    pageNumber++
  ) {
    const page =
      await pdf.getPage(
        pageNumber
      );

    const content =
      await page.getTextContent();

    const pageText =
      content.items
        .map(
          (item) =>
            item.str || ""
        )
        .join(" ");

    text += pageText + "\n";
  }

  return text;
}

async function extractDocx(file) {
  const arrayBuffer =
    await file.arrayBuffer();

  const result =
    await mammoth.extractRawText({
      arrayBuffer
    });

  return result.value;
}

export default FileUpload;
importScripts(
  "libs/jspdf/dist/jspdf.umd.min.js",
  "libs/jspdf-autotable/dist/jspdf.plugin.autotable.min.js",
  "libs/xlsx/dist/xlsx.full.min.js"
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.Students) {
    console.log("yes it works!");
    console.log("Received students data:", message.Students);

    const students = message.Students;
    const ws = XLSX.utils.json_to_sheet(students);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");

    let blob;
    let filename;

    if (message.format === "xls") {
      const wbout = XLSX.write(wb, { bookType: "xls", type: "array" });
      blob = new Blob([wbout], { type: "application/vnd.ms-excel" });
      filename = "Students.xls";
    } else if (message.format === "pdf") {
      const { jsPDF } = jspdf;
      const doc = new jsPDF();
      const columns = Object.keys(students[0]);
      const rows = students.map((student) =>
        columns.map((column) => student[column])
      );
      doc.autoTable({ head: [columns], body: rows });
      blob = doc.output("blob");
      filename = "Students.pdf";
    } else if (message.format === "xml") {
      const wbout = XLSX.write(wb, { bookType: "xml", type: "array" });
      blob = new Blob([wbout], { type: "application/xml" });
      filename = "Students.xml";
    } else {
      console.log("Unsupported format");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const url = e.target.result;

      chrome.downloads.download(
        {
          url: url,
          filename: filename,
          saveAs: true,
        },
        (downloadId) => {
          console.log(`Download started with ID: ${downloadId}`);
        }
      );
    };
    reader.readAsDataURL(blob);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.Students) {
    console.log("yes it works!");
    console.log("Received students data:", message.Students);

    const students = message.Students;
    const ws = XLSX.utils.json_to_sheet(students);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");

    let blob;
    let filename;

    if (message.format === "xls") {
      const wbout = XLSX.write(wb, { bookType: "xls", type: "array" });
      blob = new Blob([wbout], { type: "application/vnd.ms-excel" });
      filename = "Students.xls";
    } else if (message.format === "pdf") {
      // create pdf with jsPDF library and save it as blob with type application/pdf and data is Students
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const columns = Object.keys(students[0]);
      const rows = students.map((student) =>
        columns.map((column) => student[column])
      );
      doc.autoTable({ head: [columns], body: rows });
      blob = doc.output("blob");
      filename = "Students.pdf";
    } else if (message.format === "xml") {
      const wbout = XLSX.write(wb, { bookType: "xml", type: "array" });
      blob = new Blob([wbout], { type: "application/xml" });
      filename = "Students.xml";
    } else {
      console.log("Unsupported format");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const url = e.target.result;

      chrome.downloads.download(
        {
          url: url,
          filename: filename,
          saveAs: true,
        },
        (downloadId) => {
          console.log(`Download started with ID: ${downloadId}`);
        }
      );
    };
    reader.readAsDataURL(blob);
  }
});

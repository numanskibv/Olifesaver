importScripts("libs/xlsx.full.min.js");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.Students) {
    console.log("yes it works!");
    console.log("Received students data:", message.Students);

    // put the data in an excel file and download
    const students = message.Students;
    const ws = XLSX.utils.json_to_sheet(students);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");

    // Generate the file as a Blob
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });

    // Use FileReader to convert Blob to data URL
    const reader = new FileReader();
    reader.onload = function (e) {
      const url = e.target.result;

      // Use the chrome.downloads API to download the file
      chrome.downloads.download(
        {
          url: url,
          filename: "Students.xlsx",
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

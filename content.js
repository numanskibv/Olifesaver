// console loaded
() => {
  console.log("Scraping student data");
  // Select all the student rows
  const studentRows = document.querySelectorAll("div.af_listItem");

  studentRows.forEach((studentRow, index) => {
    // Use the index in the id to identify different elements related to each student
    const baseId = `shReg\\:1\\:saawLV\\:${index}\\:`;

    const studentName =
      document.querySelector(`#${baseId}toonStudent\\:\\:text`)?.innerText ||
      "N/A";
    const studentNumber =
      document.querySelector(`#${baseId}of3`)?.innerText || "N/A";
    const studentProgram =
      document.querySelector(`#${baseId}ot2`)?.innerText || "N/A";
    const studentEmail =
      document.querySelector(`#${baseId}ot4`)?.innerText || "N/A";

    const absenceReason =
      document.querySelector(`#${baseId}ot6`)?.innerText || "N/A";
    const absenceStatus =
      document.querySelector(`#${baseId}ot12`)?.innerText || "N/A";
    const absenceFrom =
      document.querySelector(`#${baseId}ot8`)?.innerText || "N/A";
    const absenceTo =
      document.querySelector(`#${baseId}ot10`)?.innerText || "N/A";
    const reportDetails =
      document.querySelector(`#${baseId}ot7`)?.innerText || "N/A";

    // Create an array to store all the student data
    const Students = [];
    // puss all data in allStudents array
    Students.push({
      $baseId: baseId,
      Name: studentName,
      Number: studentNumber,
      Program: studentProgram,
      Email: studentEmail,
      AbsenceReason: absenceReason,
      AbsenceStatus: absenceStatus,
      FromDate: absenceFrom,
      ToDate: absenceTo,
      ReportDetails: reportDetails,
    });
  });

  // Log the scraped data to the console
  console.log(Students);

  // Send the scraped data to the background script
  chrome.runtime.sendMessage({ Students });
};

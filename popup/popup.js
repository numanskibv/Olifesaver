document.addEventListener("DOMContentLoaded", () => {
  const startDate = localStorage.getItem("startDate");
  const className = localStorage.getItem("className");

  if (!startDate || !className) {
    // Redirect to settings page if either value is missing
    window.location.href = "/settings/settings.html";
  } else {
    // Use startDate and className as needed
    console.log(`Start Date: ${startDate}`);
    console.log(`Class Name: ${className}`);
  }

  document
    .getElementById("openSettings")
    .addEventListener("click", function () {
      window.location.href = "/settings/settings.html";
    });
});

document.getElementById("openSettings").addEventListener("click", function () {
  window.location.href = "/settings/settings.html";
});

document.getElementById("getListButton").addEventListener("click", function () {
  const startDate = localStorage.getItem("startDate");
  const className = localStorage.getItem("className");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Check if we are on the correct URL
    if (
      !tabs[0].url.includes(
        "https://mboutrecht.osiris-mbo.nl/osiris_docent/faces/Start"
      )
    ) {
      alert(
        "U bent niet ingelogd of op de juiste pagina. Ga naar de juiste pagina"
      );
      return;
    }

    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: getListAll,
        args: [startDate, className],
      },
      () => {
        console.log("Adding executed");
      }
    );
  });
});

document.getElementById("xlsDownloadButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.error("No active tab found");
      return;
    }
    // Check if we are on the correct URL
    if (
      !tabs[0].url.includes(
        "https://mboutrecht.osiris-mbo.nl/osiris_docent/faces/Start"
      )
    ) {
      alert(
        "U bent niet ingelogd of op de juiste pagina. Ga naar de juiste pagina"
      );
      return;
    }

    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: scrapeStudentData,
      },
      (results) => {
        if (results && results[0] && results[0].result) {
          const students = results[0].result;
          chrome.runtime.sendMessage({ Students: students, format: "xls" });
        } else {
          console.error("Failed to scrape student data");
        }
      }
    );
  });
});

document.getElementById("pdfDownloadButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.error("No active tab found");
      return;
    }
    // Check if we are on the correct URL
    if (
      !tabs[0].url.includes(
        "https://mboutrecht.osiris-mbo.nl/osiris_docent/faces/Start"
      )
    ) {
      alert(
        "U bent niet ingelogd of op de juiste pagina. Ga naar de juiste pagina"
      );
      return;
    }

    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: scrapeStudentData,
      },
      (results) => {
        if (results && results[0] && results[0].result) {
          const students = results[0].result;
          chrome.runtime.sendMessage({ Students: students, format: "pdf" });
        } else {
          console.error("Failed to scrape student data");
        }
      }
    );
  });
});

document.getElementById("infoButton").addEventListener("click", () => {
  window.location.href = "/info/info.html";
});

function getListAll(startDate, className) {
  console.log("Getting list of students");
  var inputDateFrom = document.querySelector("input[id*='input_datum_van']");
  if (inputDateFrom) {
    inputDateFrom.value = startDate;
  }
  var group = document.querySelector('input[placeholder="Studentgroep "]');
  if (group) {
    group.value = className;
  }
  var button = document.querySelector('[id*="zoek_knop"] .af_button_link');
  if (button) {
    button.click();
    setTimeout(function () {
      scrapeStudentData();
    }, 3000);
  }
}

function scrapeStudentData() {
  const Students = [];

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
    const totalPresent =
      document.querySelector(`#${baseId}percentageTotaalAanwezig`)?.innerText ||
      "0%";
    const totalAllowed =
      document.querySelector(`#${baseId}percentageTotaalGeoorloofd`)
        ?.innerText || "0%";
    const totalNotAllowed =
      document.querySelector(`#${baseId}percentageTotaalOngeoorloofd`)
        ?.innerText || "0%";

    // Collect the scraped data
    Students.push({
      //$baseId: baseId,
      Name: studentName,
      Number: studentNumber,
      // Program: studentProgram,
      Email: studentEmail,
      // AbsenceReason: absenceReason,
      // AbsenceStatus: absenceStatus,
      // FromDate: absenceFrom,
      // ToDate: absenceTo,
      // ReportDetails: reportDetails,
      TotalPresent: totalPresent + "%",
      TotalAllowed: totalAllowed + "%",
      TotalNotAllowed: totalNotAllowed + "%",
    });
  });

  return Students;
}

document.addEventListener("DOMContentLoaded", function () {
  // Load the settings when the page loads
  const savedStartDate = localStorage.getItem("startDate");
  const savedClassName = localStorage.getItem("className");

  if (savedStartDate) {
    document.getElementById("startDate").value = savedStartDate;
  }
  if (savedClassName) {
    document.getElementById("className").value = savedClassName;
  }

  document
    .getElementById("saveSettings")
    .addEventListener("click", function () {
      const startDate = document.getElementById("startDate").value;
      const className = document.getElementById("className").value;

      console.log(`Start Date: ${startDate}`);
      console.log(`Class Name: ${className}`);

      // Save the settings to localStorage
      localStorage.setItem("startDate", startDate);
      localStorage.setItem("className", className);

      // Redirect back to the popup
      window.location.href = "/popup/popup.html";
    });
});

document.getElementById("returnButton").addEventListener("click", function () {
  window.location.href = "/popup/popup.html";
});

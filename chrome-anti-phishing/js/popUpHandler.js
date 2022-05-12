$(document).ready(function () {
  updateNumOfDomains();
  updateTimeOfLastUpdate();
});

function updateTimeOfLastUpdate() {
  setLastUpdate();
  setInterval(function () {
    setLastUpdate();
  }, 1000);
}

function setLastUpdate() {
  let lastUpdate = localStorage.getItem("chrome_lastUpdate");
  lastUpdate = new Date(lastUpdate);
  lastUpdate = Date.parse(new Date()) - Date.parse(lastUpdate);
  const seconds = Math.floor((lastUpdate / 1000) % 60);
  const minutes = Math.floor((lastUpdate / 1000 / 60) % 60);
  let timeToDisplay =
    "Last update: " + minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
  timeToDisplay += minutes !== 0 ? " minutes ago" : " seconds ago";
  document.getElementById("small").innerText = timeToDisplay;
}

/*
    Get from localStorage list of malicious to display
 */
function updateNumOfDomains() {
  const blackDomainsList = JSON.parse(
    localStorage.getItem("chrome_blacklist_domains")
  );
  const blackUrlsList = JSON.parse(
    localStorage.getItem("chrome_blacklist_urls")
  );
  const numOfBlackDomains = blackDomainsList.domains.length;
  const numOfBlackUrls = blackUrlsList.urls.length;
  document.getElementById("blackListNum").innerText =
    numOfBlackUrls + " blocked site in total  ";
}

document.addEventListener("DOMContentLoaded", function () {
  const Icon = document.getElementById("chrome-icon");
  Icon.addEventListener("click", (event) => {
    trackButtonClick("Buttons", "click", event);
  });
  const Privacy = document.getElementById("chrome-privacyIcon");
  Privacy.addEventListener("click", (event) => {
    trackButtonClick("Buttons", "click", event);
  });
  const Support = document.getElementById("chrome-githubIcon");
  Support.addEventListener("click", (event) => {
    trackButtonClick("Buttons", "click", event);
  });
});

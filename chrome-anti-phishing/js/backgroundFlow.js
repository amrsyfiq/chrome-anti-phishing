const resourceDomain = "http://localhost/chrome-anti-phishing/phishing-urls.json";
const resourceUrl = "http://localhost/chrome-anti-phishing/phishing-urls.json";
const browser = getBrowser();
const updateTimeOfLocalStorage = 300000;
const tabs = {};
let allDomains = [];
let allUrls = [];
let localStorageTimer;
let ignoreRiskPressed = false;
let currentTabURL;

function updateDomainsAndUrlsLists() {
  const domainsPromise = isFeedUpdated("domain");
  domainsPromise.then((isUpdated) => {
    if (isUpdated) {
      getUpdateInfo("domain");
    }
  });

  const urlsPromise = isFeedUpdated("url");
  urlsPromise.then((isUpdated) => {
    if (isUpdated) {
      getUpdateInfo("url");
    }
  });
  setDomainUpdate();
}

function setDomainUpdate() {
  const lastUpdate = new Date();
  localStorage.setItem("chrome_lastUpdate", lastUpdate.toUTCString());
}

function isFeedUpdated(reqInfo) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", reqInfo === "domain" ? resourceDomain : resourceUrl, true);
    xhr.send();
    xhr.timeout = 4000;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status !== 0) {
        const localData =
          reqInfo === "domain"
            ? localStorage.getItem("chrome_blacklist_domains")
            : localStorage.getItem("chrome_blacklist_urls");
        //In case localStorage is empty (at the first time) or the feed was updated return true.
        !localData ||
        (localData &&
          new Date(JSON.parse(localData)["lastModified"]) <
            new Date(xhr.getResponseHeader("Last-Modified")))
          ? resolve(true)
          : resolve(false);
      }
    };
    xhr.ontimeout = () => {
      reject(false);
    };
  });
}

function getUpdateInfo(reqInfo) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", reqInfo === "domain" ? resourceDomain : resourceUrl, true);
  xhr.send();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status !== 0) {
      updateLocalStorage(xhr, reqInfo);
    }
  };
  return true;
}

function updateLocalStorage(xhr, reqInfo) {
  const arrBlackListedUrls = JSON.parse(xhr.responseText);
  const blacklistAndLastModified = {};
  blacklistAndLastModified.lastModified = xhr.getResponseHeader(
    "Last-Modified"
  );
  if (reqInfo === "domain") {
    blacklistAndLastModified.domains = arrBlackListedUrls;
    localStorage.setItem(
      "chrome_blacklist_domains",
      JSON.stringify(blacklistAndLastModified)
    );
    allDomains = blacklistAndLastModified.domains;
  } else {
    blacklistAndLastModified.urls = arrBlackListedUrls;
    localStorage.setItem(
      "chrome_blacklist_urls",
      JSON.stringify(blacklistAndLastModified)
    );
    allUrls = blacklistAndLastModified.urls;
  }
}

function getDomainFromFullURL(url_string) {
  const url = new URL(url_string);
  return url.hostname;
}

/*
    whitelist is for the check if the last domain was the error page
 */
function addDomainToWhiteList(whiteList, currentDomain) {
  if (ignoreRiskPressed) {
    whiteList.add(currentDomain);
  }
}

function isDomain() {
  const currentDomain = getDomainFromFullURL(currentTabURL);
  allDomains = JSON.parse(localStorage.getItem("chrome_blacklist_domains"))
    .domains;
  return allDomains.some(function (domain) {
    return currentDomain === domain || currentDomain.endsWith("." + domain);
  });
}

function isUrl() {
  allUrls = JSON.parse(localStorage.getItem("chrome_blacklist_urls")).urls;
  return allUrls.some(function (domain) {
    return currentTabURL.startsWith(domain);
  });
}

function updateTabDetails(requestDetails) {
  const tabId = requestDetails.tabId;
  tabs[tabId] = {
    curTab: requestDetails.url,
    whitelist: tabs[tabId] ? tabs[tabId].whitelist : new Set(),
    prevTab: tabs[tabId] ? tabs[tabId].curTab : "",
  };
  currentTabURL = tabs[tabId].curTab;
}

function isMaliciousTabUnderRisk(tabId) {
  const currentDomain = getDomainFromFullURL(currentTabURL);
  const tabWhiteList = tabs[tabId].whitelist;
  return tabWhiteList.has(currentDomain);
}

function continueToSite(tabId) {
  const currentDomain = getDomainFromFullURL(currentTabURL);
  addDomainToWhiteList(tabs[tabId].whitelist, currentDomain);
  ignoreRiskPressed = false;
  browser.browserAction.setIcon({
    path: "../icons/shield_green.png",
  });
}

browser.webRequest.onBeforeRequest.addListener(
  (requestDetails) => {
    if (requestDetails.tabId >= 0) {
      updateTabDetails(requestDetails);
      const tabId = requestDetails.tabId;

      // Validation if the path is in the whitelist of the tab
      if (isMaliciousTabUnderRisk(tabId)) {
        return;
      }

      if ((isDomain() || isUrl()) && !ignoreRiskPressed) {
        const tabDomain = tabs[tabId].prevTab;
        const lastUrl =
          browser.extension.getURL("../html/warning.html") +
          "?url=" +
          currentTabURL +
          "&ref=" +
          tabDomain;
        reportGA("refererUrl", "getInToPhishingSite", tabDomain);
        reportGA("blockedUrl", "getInToPhishingSite", currentTabURL);

        return {
          redirectUrl: lastUrl,
        };
      } else {
        continueToSite(tabId);
        return { cancel: false };
      }
    }
  },
  {
    urls: ["<all_urls>"],
    types: ["main_frame"],
  },
  ["blocking", "requestBody"]
);

browser.runtime.onMessage.addListener((request) => {
  if (request.ignoreRiskButton === true) {
    ignoreRiskPressed = true;
  }
});

function getBrowser() {
  return window.msBrowser || window.browser || window.chrome;
}

/*
 * This method change the icon by any event that fired from the tab
 * In case you ignored the risk, and pressed 'continue to site' the should be red.
 * In all other cases the icon should be green.
 */
function changeIcon() {
  browser.tabs.query({ active: true }, function (tab) {
    const whiteList = tabs[tab[0].id] ? tabs[tab[0].id].whitelist : new Set();
    const tabHost = new URL(tab[0].url).host;
    currentTabURL = tabHost;
    if (whiteList.has(tabHost)) {
      browser.browserAction.setIcon({ path: "../icons/shield_red.png" });
    } else {
      browser.browserAction.setIcon({ path: "../icons/shield_green.png" });
    }
  });
}

browser.tabs.onCreated.addListener(function () {
  changeIcon();
});

//listen for close tab and delete all his assets
browser.tabs.onRemoved.addListener(function (tabId) {
  delete tabs[tabId];
});

//listen for new tab to be activated
browser.tabs.onActivated.addListener(function () {
  changeIcon();
});

//listen for current tab to be changed
browser.tabs.onUpdated.addListener(function () {
  changeIcon();
});

(function () {
  localStorageTimer = window.setInterval(
    updateDomainsAndUrlsLists,
    updateTimeOfLocalStorage
  );
  updateDomainsAndUrlsLists();
})();

window.onbeforeunload = function () {
  window.clearTimeout(localStorageTimer);
  return null;
};

chrome.extension.onRequest.addListener(function (prediction) {
  if (prediction == 1) {
    alert("Warning: Phishing detected!");
  }
});

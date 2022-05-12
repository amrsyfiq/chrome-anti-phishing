var testdata;
var prediction;

function predict(data, weight) {
  var f = 0;
  weight = [
    3.33346292e-1,
    -1.11200396e-1,
    -7.77821806e-1,
    1.1105859e-1,
    3.89430647e-1,
    1.99992062,
    4.44366975e-1,
    -2.77951957e-1,
    -6.00531647e-5,
    3.33200243e-1,
    2.66644002,
    6.66735991e-1,
    5.55496098e-1,
    5.57022408e-2,
    2.22225591e-1,
    -1.66678858e-1,
  ];
  for (var j = 0; j < data.length; j++) {
    f += data[j] * weight[j];
  }
  return f > 0 ? 1 : -1;
}

function isIPInURL() {
  var reg = /\d{1,3}[\.]{1}\d{1,3}[\.]{1}\d{1,3}[\.]{1}\d{1,3}/;
  var url = window.location.href;
  if (reg.exec(url) == null) {
    // console.log("NP");
    return -1;
  } else {
    // console.log("P");
    console.log("isIPInURL(): Identify IP address presence in the URL");
    return 1;
  }
}

function isLongURL() {
  var url = window.location.href;
  if (url.length < 54) {
    // console.log("NP");
    return -1;
  } else if (url.length >= 54 && url.length <= 75) {
    // console.log("Maybe");
    return 0;
  } else {
    // console.log("P");
    console.log("isLongURL(): Check if the URL is more than 75 characters");
    return 1;
  }
}
function isTinyURL() {
  var url = window.location.href;
  if (url.length > 20) {
    // console.log("NP");
    return -1;
  } else {
    // console.log("P");
    console.log("isTinyURL(): Check if the URL is less than 20 characters");
    return 1;
  }
}
function isAlphaNumericURL() {
  var search = "@";
  var url = window.location.href;
  if (url.match(search) == null) {
    // console.log("NP");
    return -1;
  } else {
    // console.log("P");
    console.log("isAlphaNumericURL(): Search in URL for alphanumeric '@'");
    return 1;
  }
}
function isRedirectingURL() {
  var reg1 = /^http:/;
  var reg2 = /^https:/;
  var srch = "//";
  var url = window.location.href;
  if (
    url.search(srch) == 5 &&
    reg1.exec(url) != null &&
    url.substring(7).match(srch) == null
  ) {
    // console.log("NP");
    return -1;
  } else if (
    url.search(srch) == 6 &&
    reg2.exec(url) != null &&
    url.substring(8).match(srch) == null
  ) {
    // console.log("NP");
    return -1;
  } else {
    // console.log("P");
    console.log("isRedirectingURL(): Check if '//' exists more than once within the URL");
    return 1;
  }
}
function isHypenURL() {
  var reg = /[a-zA-Z]\//;
  var srch = "-";
  var url = window.location.href;
  if (url.substring(0, url.search(reg) + 1).match(srch) == null) {
    // console.log("NP");
    return -1;
  } else {
    // console.log("P");
    console.log("isHypenURL(): Search in URL for '-' adjacent to the domain name");
    return 1;
  }
}
function isMultiDomainURL() {
  var reg = /[a-zA-Z]\//;
  var srch = "-";
  var url = window.location.href;
  if (url.substring(0, url.search(reg) + 1).split(".").length < 5) {
    // console.log("NP");
    return -1;
  } else {
    // console.log("P");
    console.log("isMultiDomainURL(): The domain name need to be restricted to the top-level domain, the country code and the second-level domain");
    return 1;
  }
}
function isFaviconDomainUnidentical() {
  var reg = /[a-zA-Z]\//;
  var url = window.location.href;
  if (document.querySelectorAll("link[rel*='shortcut icon']").length > 0) {
    var faviconurl = document.querySelectorAll("link[rel*='shortcut icon']")[0]
      .href;
    if (
      url.substring(0, url.search(reg) + 1) ==
      faviconurl.substring(0, faviconurl.search(reg) + 1)
    ) {
      // console.log("NP");
      return -1;
    } else {
      // console.log("P");
      console.log("isFaviconDomainUnidentical(): Check if the links on the web page are from another domain");
      return 1;
    }
  } else {
    // console.log("NP");
    return -1;
  }
}

function isIllegalHttpsURL() {
  var srch1 = "//";
  var srch2 = "https";
  var url = window.location.href;
  if (url.substring(url.search(srch1)).match(srch2) == null) {
    // console.log("NP");
    return -1;
  } else {
    // console.log("P");
    console.log("isIllegalHttpsURL(): Identify multiple 'https' in a URL string");
    return 1;
  }
}
function isImgFromDifferentDomain() {
  var totalCount = document.querySelectorAll("img").length;
  var identicalCount = getIdenticalDomainCount("img");
  if ((totalCount - identicalCount) / totalCount < 0.22) {
    // console.log("NP");
    return -1;
  } else if (
    (totalCount - identicalCount) / totalCount >= 0.22 &&
    (totalCount - identicalCount) / totalCount <= 0.61
  ) {
    // console.log("Maybe");
    return 0;
  } else {
    // console.log("P");
    console.log("isImgFromDifferentDomain(): Verify whether photos are loaded from other domains on the specified web page");
    return 1;
  }
}
function isAnchorFromDifferentDomain() {
  var totalCount = document.querySelectorAll("a").length;
  var identicalCount = getIdenticalDomainCount("a");
  if ((totalCount - identicalCount) / totalCount < 0.31) {
    // console.log("NP");
    return -1;
  } else if (
    (totalCount - identicalCount) / totalCount >= 0.31 &&
    (totalCount - identicalCount) / totalCount <= 0.67
  ) {
    // console.log("Maybe");
    return 0;
  } else {
    // console.log("P");
    console.log("isAnchorFromDifferentDomain(): Check if the links on the web page are from another domain");
    return 1;
  }
}
function isScLnkFromDifferentDomain() {
  var totalCount =
    document.querySelectorAll("script").length +
    document.querySelectorAll("link").length;
  var identicalCount =
    getIdenticalDomainCount("script") + getIdenticalDomainCount("link");
  if ((totalCount - identicalCount) / totalCount < 0.17) {
    // console.log("NP");
    return -1;
  } else if (
    (totalCount - identicalCount) / totalCount >= 0.17 &&
    (totalCount - identicalCount) / totalCount <= 0.81
  ) {
    // console.log("Maybe");
    return 0;
  } else {
    // console.log("P");
    console.log("isScLnkFromDifferentDomain(): Verify if scripts are on the web-page are from another domain");
    return 1;
  }
}

function isFormActionInvalid() {
  var totalCount = document.querySelectorAll("form").length;
  var identicalCount = getIdenticalDomainCount("form");
  if (document.querySelectorAll("form[action]").length <= 0) {
    // console.log("NP");
    return -1;
  } else if (identicalCount != totalCount) {
    // console.log("Maybe");
    return 0;
  } else if (document.querySelectorAll('form[action*=""]').length > 0) {
    // console.log("P");
    console.log("isFormActionInvalid(): Search for submissions of invalid / blank form");
    return 1;
  } else {
    // console.log("NP");
    return -1;
  }
}

function isMailToAvailable() {
  if (document.querySelectorAll("a[href^=mailto]").length <= 0) {
    // console.log("NP");
    return -1;
  } else {
    // console.log("P");
    console.log("isMailToAvailable(): Search for anchor tag that incorporate mailto");
    return 1;
  }
}

function isStatusBarTampered() {
  if (
    document.querySelectorAll("a[onmouseover*='window.status']").length <= 0 ||
    document.querySelectorAll("a[onclick*='location.href']").length <= 0
  ) {
    // console.log("NP");
    return -1;
  } else {
    // console.log("P");
    console.log("isStatusBarTampered(): Check if onmouseover controls the status bar display ");
    return 1;
  }
}

function isIframePresent() {
  if (document.querySelectorAll("iframe").length <= 0) {
    // console.log("NP");
    return -1;
  } else {
    // console.log("P");
    console.log("isIframePresent(): Identify pages that display iframes in the DOM");
    return 1;
  }
}

function getIdenticalDomainCount(tag) {
  var i;
  var identicalCount = 0;
  var reg = /[a-zA-Z]\//;
  var url = window.location.href;
  var mainDomain = url.substring(0, url.search(reg) + 1);
  var nodeList = document.querySelectorAll(tag);
  if (tag == "img" || tag == "script") {
    nodeList.forEach(function (element, index) {
      i = nodeList[index].src;
      if (mainDomain == i.substring(0, i.search(reg) + 1)) {
        identicalCount++;
      }
    });
  } else if (tag == "form") {
    nodeList.forEach(function (element, index) {
      i = nodeList[index].action;
      if (mainDomain == i.substring(0, i.search(reg) + 1)) {
        identicalCount++;
      }
    });
  } else if (tag == "a") {
    nodeList.forEach(function (element, index) {
      i = nodeList[index].href;
      if (
        mainDomain == i.substring(0, i.search(reg) + 1) &&
        i.substring(0, i.search(reg) + 1) != null &&
        i.substring(0, i.search(reg) + 1) != ""
      ) {
        identicalCount++;
      }
    });
  } else {
    nodeList.forEach(function (element, index) {
      i = nodeList[index].href;
      if (mainDomain == i.substring(0, i.search(reg) + 1)) {
        identicalCount++;
      }
    });
  }
  return identicalCount;
}

testdata = [
  isIPInURL(),
  isLongURL(),
  isTinyURL(),
  isAlphaNumericURL(),
  isRedirectingURL(),
  isHypenURL(),
  isMultiDomainURL(),
  isFaviconDomainUnidentical(),
  isIllegalHttpsURL(),
  isImgFromDifferentDomain(),
  isAnchorFromDifferentDomain(),
  isScLnkFromDifferentDomain(),
  isFormActionInvalid(),
  isMailToAvailable(),
  isStatusBarTampered(),
  isIframePresent(),
];

prediction = predict(testdata);
chrome.extension.sendRequest(testdata);
chrome.extension.sendRequest(prediction);
 
//if (prediction == 1) {
 //console.log("\nTestdata: " + testdata + "\nPrediction: " + prediction);
//}


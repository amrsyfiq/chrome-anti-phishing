## chrome-anti-phishing
  In this project, a study will be conducted with three machine learning algorithms on a set of data representing the attributes usually associated with phishing pages. The best model will be selected based on performance and create a chrome browser plug-in that will be deploy to the end user. This chrome browser will help incautious user to detect and warn them about phishing websites in real-time. Here, the trained and evaluated supervised machine learning algorithms are used as training dataset. Random forest, Artificial Neural Networks and Support Vector Machines classifier were chosen based on their performance on classification problems. 

  One common approach is to make the classification in a server and then let the plugin to request the server for result. Unlike the old approach, this project aims to run the classification in the browser itself. The advantage of classification in the client-side browser is better privacy (the user’s browsing data do not need to leave their machine) and the detection also independent of network latency. 

  The main purpose of this project is to implement JavaScript for it to run as a browser plug-in. Since JavaScript does not have much machine learning libraries support and considering the processing power of the client machines, the approach needs to be made lightweight. The classifiers need to be trained on the phishing websites dataset using python scikit-learn and then the learned model parameters need to be exported into a portable format for using in JavaScript.

  There are two technique that will be combined for this project which are blacklist technique and machine learning technique. The dataset from PhishTank is used for the blacklist technique. The used dataset was split into two parts: phishing and non-phishing. The phishing dataset was obtained from PhishTank while the non-phish dataset was obtained manually. For the machine learning technique, the ‘Phishing Website Dataset’ from UCI Machine Learning repository is used to evaluate the machine learning technique.
      
## Setup
1.    Copy the `phishing-urls.json` file to the localhost directory for the black list technique
2.    To open up your extensions page, click the menu icon (three dots) at the top right of Chrome
3.    Point to `More Tools`, then click on `Extensions`
4.    Click the `Load unpacked` and select the Chrome-anti-phishing folder
5.    For the black list technique, copy the "phishing-urls.json" file to the localhost directory
6.    To update the `phishing-urls.json`, get the repository manually from https://www.phishtank.com/developer_info.php
7.    Reload the extensions in steps `2-4`


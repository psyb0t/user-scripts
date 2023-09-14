// ==UserScript==
// @id          private-info-cloaker@psyb0t
// @name        Private Info Cloaker
// @author      https://github.com/psyb0t/
// @version     0.1
// @license     WTFPL2
// @description Hide private info on the page and morph text inputs to password type
// @downloadURL TO_POPULATE_WITH_GITHUB_URL

// @match       http://*/*
// @match       https://*/*
// @run-at      document-start
// ==/UserScript==

(function () {
  "use strict";

  const cloakInterval = 50;
  const overlayInterval = 2500;

  const appendToHead = (element) => {
    let checkHeadInterval = setInterval(() => {
      if (document.head) {
        document.head.appendChild(element);
        clearInterval(checkHeadInterval);
      }
    }, 1);
  };

  const appendToBody = (element) => {
    let checkHeadInterval = setInterval(() => {
      if (document.body) {
        document.body.appendChild(element);
        clearInterval(checkHeadInterval);
      }
    }, 1);
  };

  const addStyle = () => {
    let style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = `
    @import url('https://fonts.googleapis.com/css?family=Fira+Code');

    @keyframes blink {
        50% { opacity: 0; }
    }

    @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    #cloakOverlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #000;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Fira Code', monospace !important;
        color: #20C20E !important;
        font-size: 24px;
        overflow: hidden;
    }

    #cloakOverlay::after {
        content: '_';
        animation: blink 1s infinite;
    }

    #circle {
        border: 5px solid transparent;
        border-top-color: #20C20E;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: rotate 1s linear infinite;
        margin-right: 15px;
    }
`;
    appendToHead(style);
  };

  const addPrecloak = () => {
    let preCloakStyle = document.createElement("style");
    preCloakStyle.type = "text/css";
    preCloakStyle.setAttribute("data-identity", "pre-cloak");
    preCloakStyle.innerHTML = `
      * {
          visibility: hidden !important;
      }

      #cloakOverlay, #cloakOverlay * {
          visibility: visible !important;
      }
  `;

    appendToHead(preCloakStyle);
  };

  const addOverlay = () => {
    let overlay = document.createElement("div");
    overlay.setAttribute("id", "cloakOverlay");

    let circle = document.createElement("div");
    circle.setAttribute("id", "circle");
    overlay.appendChild(circle);

    let textNode = document.createTextNode("CLOAKING IN PROGRESS...");
    overlay.appendChild(textNode);

    appendToBody(overlay);
  };

  const removeOverlay = () => {
    let overlay = document.getElementById("cloakOverlay");
    if (overlay) overlay.remove();

    let preCloak = document.querySelector('style[data-identity="pre-cloak"]');
    if (preCloak) preCloak.remove();
  };

  const cloakPrivateInfo = (node) => {
    const emailRegex =
      /[a-z0-9!#$%&'*+\/=?^_`{|.}~-]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;

    const phoneRegex =
      /((?:(?<![0-9-])(?:\+?[0-9]{1,3}[-.\s*]?)?(?:\(?[0-9]{1,3}\)?[-.\s*]?)?[0-9]{1,4}[-.\s*]?[0-9]{1,4}[-.\s*]?[0-9]{1,3}(?![0-9-]))|(?:(?<![0-9-])(?:(?:\(\+?[0-9]{1,3}\))|(?:\+?[0-9]{1,3}))\s*[0-9]{1,4}\s*[0-9]{1,4}\s*[0-9]{1,3}(?![0-9-])))/g;

    const phonesWithExtsRegex =
      /((?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*(?:[2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][0-9])\s*\)|(?:[2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][0-9]))\s*(?:[.-]\s*)?)?(?:[2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?[0-9]{1,4}(?:\s*(?:#|x\.?|ext\.?|extension)\s*(?:[0-9]+)?))/gi;

    const ipv4Regex =
      /(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g;

    const creditCardRegex =
      /((?:(?:[0-9]{4}[- ]?){3}[0-9]{4}|[0-9]{15,16}))(?![0-9])/g;

    // needs work but meh. it does some shit
    const ipv6Regex =
      /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|(64:ff9b::(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

    if (node.nodeType === 3) {
      let content = node.data;

      const patterns = [
        emailRegex,
        phoneRegex,
        phonesWithExtsRegex,
        ipv4Regex,
        creditCardRegex,
        ipv6Regex,
      ];

      patterns.forEach((pattern) => {
        content = content.replace(pattern, "obfuscated");
      });

      if (node.data !== content) {
        node.data = content;
      }
    } else if (
      node.nodeType === 1 &&
      node.nodeName !== "SCRIPT" &&
      node.nodeName !== "STYLE"
    ) {
      for (let i = 0; i < node.childNodes.length; i++) {
        cloakPrivateInfo(node.childNodes[i]);
      }
    }
  };

  const morphAllTextInputs = () => {
    let inputs = document.querySelectorAll('input[type="text"]');
    for (let input of inputs) {
      input.type = "password";
    }
  };

  const sweepAndCloak = () => {
    cloakPrivateInfo(document.body);
    morphAllTextInputs();
  };

  const run = () => {
    addStyle();
    addPrecloak();
    addOverlay();
    sweepAndCloak();
    setInterval(sweepAndCloak, cloakInterval);
    setTimeout(removeOverlay, overlayInterval);
  };

  if (document.body) {
    return run();
  }

  document.addEventListener("DOMContentLoaded", run);
})();

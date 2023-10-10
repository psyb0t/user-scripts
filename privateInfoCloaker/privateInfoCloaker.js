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
  const overlayTimeout = 5000;

  const appendTo = (target, element, maxRetries = 10000) => {
    console.debug(`appendTo start target: ${target}`);

    let retryNum = 0;
    let success = false;
    while (!success) {
      if (retryNum >= maxRetries) {
        break;
      }

      try {
        if (typeof element == "string") {
          target.insertAdjacentHTML("afterbegin", element);
        } else {
          target.appendChild(element);
        }

        success = true;
      } catch (e) {
        console.debug(`Could not appendChild: ${e}`);
        retryNum++;
      }
    }

    console.debug(`appendTo end target: ${target}`);
  };

  const addPrecloak = () => {
    console.debug(`addPrecloak start`);
    const style = `
        <style type="text/css" data-identity="pre-cloak">
            * {
                visibility: hidden !important;
            }

            #cloakOverlay, #cloakOverlay * {
                visibility: visible !important;
            }
        </style>
    `;

    appendTo(document.head, style);
    console.debug(`addPrecloak end`);
  };

  const removePrecloak = () => {
    console.debug(`removePrecloak start`);
    let preCloak = document.querySelector('[data-identity="pre-cloak"]');
    if (preCloak) {
      preCloak.remove();
    }
    console.debug(`removePrecloak end`);
  };

  const addCloakOverlay = () => {
    console.debug(`addCloakOverlay start`);

    const html = `
        <style type="text/css" data-identity="cloak">
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
        </style>

        <div id="cloakOverlay">
            <div id="circle"></div>
            CLOAKING IN PROGRESS...
        </div>
    `;

    appendTo(document.body, html);
    console.debug(`addCloakOverlay end`);
  };

  const removeCloakOverlay = () => {
    console.debug(`removeCloakOverlay start`);
    const overlayStyle = document.querySelector('[data-identity="cloak"]');
    if (overlayStyle) {
      overlayStyle.remove();
    }

    const overlay = document.getElementById("cloakOverlay");
    if (overlay) {
      overlay.remove();
    }
    console.debug(`removeCloakOverlay end`);
  };

  const showCloakedPage = () => {
    console.debug(`showCloakedPage start`);
    removePrecloak();
    removeCloakOverlay();
    console.debug(`showCloakedPage end`);
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
    // console.debug(`morphAllTextInputs start`);
    let inputs = document.querySelectorAll('input[type="text"]');
    for (let input of inputs) {
      input.type = "password";
    }
    // console.debug(`morphAllTextInputs end`);
  };

  const sweepAndCloak = () => {
    // console.debug(`sweepAndCloak start`);
    cloakPrivateInfo(document.body);
    morphAllTextInputs();
    // console.debug(`sweepAndCloak end`);
  };

  const run = () => {
    console.debug(`run start`);
    setInterval(sweepAndCloak, cloakInterval);
    setTimeout(showCloakedPage, overlayTimeout);
    console.debug(`run end`);
  };

  document.addEventListener("DOMContentLoaded", run);

  const observeElements = () => {
    let headFound = false;
    let bodyFound = false;

    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (!headFound && mutation.target.nodeName === "HEAD") {
          console.debug("Observer got head");
          addPrecloak();
          headFound = true;
        }

        if (!bodyFound && mutation.target.nodeName === "BODY") {
          console.debug("Observer got body");
          addCloakOverlay();
          bodyFound = true;
        }

        if (headFound && bodyFound) {
          observer.disconnect();
          break;
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  };

  observeElements();
})();

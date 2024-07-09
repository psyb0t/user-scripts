// ==UserScript==
// @id          huggingface-autofill-deletion-confirmation@psyb0t
// @name        Huggingface Auto-fill Model Deletion Confirmation
// @author      https://github.com/psyb0t/
// @version     0.1
// @license     WTFPL2
// @description Automatically and persistently fills in the confirmation text for deleting models on Hugging Face
// @downloadURL https://raw.githubusercontent.com/psyb0t/user-scripts/master/huggingfaceAutofillModelDeletionConfirmation/huggingfaceAutofillModelDeletionConfirmation.js


(function() {
    'use strict';

    let confirmationText = '';
    let inputField = null;

    function findAndFillConfirmationText() {
        // XPath to find the label that starts with "Please type"
        const labelXPath = "//label[starts-with(text(), 'Please type')]";
        const labelElement = document.evaluate(labelXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (labelElement) {
            // Find the strong element within the label
            const strongElement = labelElement.querySelector('strong');

            if (strongElement) {
                confirmationText = strongElement.textContent.trim();

                // Find the input field that is a child of this label
                inputField = labelElement.querySelector('input.form-input[type="text"]');

                if (inputField) {
                    fillInput();
                    // Start periodic checking
                    setInterval(checkAndRefill, 500);
                }
            }
        }
    }

    function fillInput() {
        if (inputField && confirmationText) {
            // Fill in the confirmation text
            inputField.value = confirmationText;

            // Dispatch an input event to trigger any listeners
            const event = new Event('input', { bubbles: true });
            inputField.dispatchEvent(event);

            console.log('Confirmation text filled:', confirmationText);
        }
    }

    function checkAndRefill() {
        if (inputField && inputField.value !== confirmationText) {
            fillInput();
            console.log('Refilled empty input');
        }
    }

    // Run the initial find and fill when the page has finished loading
    window.addEventListener('load', findAndFillConfirmationText);
})();

import { COMMANDS } from '../utils/constant';
import API from '../utils/api';
import storageManager from '../utils/storeManager';
import { initPopup } from './hoverTools';

// todo d
console.log(chrome);

async function loadHighlighs() {
    const highlights = (await storageManager.readAll()) || [];

    // todo d
    console.log('highlights', highlights);

    for (const highlightInfo of highlights) {
        await API.addHighlight(highlightInfo);
    }
}

function initMessageListeners() {
    chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
        // todo d
        console.log('received message from background', request);

        switch (request.type) {
            case COMMANDS.HIGHTLIGHT_TEXT:
                API.highlightCurrentText();
        }

        // Send an empty response
        // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
        sendResponse({});
    });
}

// TODO storage inspector chrome-extension://ID/manifest.json
const initalize = async () => {
    await loadHighlighs();
    initPopup();
    initMessageListeners();
};

export default initalize;

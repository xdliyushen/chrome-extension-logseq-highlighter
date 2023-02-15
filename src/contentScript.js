'use strict';

import { v4 as uuid } from 'uuid';
import API from './api';
import { EVENT } from './constant';

// todo d
console.log(chrome);

function initCursorPopups() {

}

// TODO 读取内存 添加高亮
function loadHighlighs() {

}

function normalizeSelection(selection) {
    // todo d
    console.log('selection object', selection);

    return Object.assign({
        id: uuid(),
        text: selection.toString(),
    }, selection);
}

function executeCapture() {
    const selection = window.getSelection();

    if(selection.type === 'Range') {
        const normalizedSelection = normalizeSelection(selection);
        API.addHightlight(normalizedSelection);
    }
}

function initMessageListeners() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.type) {
            case EVENT.CAPTURE:
                executeCapture();
        }

        // Send an empty response
        // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
        sendResponse({});
    });
}

// TODO storage inspector chrome-extension://ID/manifest.json
const initalize = () => {
    initCursorPopups();
    loadHighlighs();
    initMessageListeners();
};

initalize();

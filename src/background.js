'use strict';

const { EVENT } = require("./constant");

async function queryActiveTabId() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs?.[0]?.id;
}

async function executeCapture() {
    const currentTabId = await queryActiveTabId();

    if (currentTabId) {
        chrome.tabs.sendMessage(currentTabId, { type: EVENT.CAPTURE });
    }
}

function initCommandHandlers() {
    chrome.commands.onCommand.addListener((command) => {
        // todo d
        console.log('command',command);
        console.log('event',EVENT);

        switch (command) {
            case EVENT.CAPTURE:
                executeCapture();
        }
    });
}

function initialize() {
    initCommandHandlers();
}

initialize();

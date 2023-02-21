import { COMMANDS } from "../constant";
import { queryActiveTabId } from "../utils";

async function highlightTextHandler() {
    const currentTabId = await queryActiveTabId();

    // todo d
    console.log('currentTabId', currentTabId);

    if (currentTabId) {
        chrome.tabs.sendMessage(currentTabId, { type: COMMANDS.HIGHTLIGHT_TEXT });
    }
}

function initCommandHandlers() {
    chrome.commands.onCommand.addListener((command) => {
        // todo d
        console.log('command', command);

        switch (command) {
            case COMMANDS.HIGHTLIGHT_TEXT:
                highlightTextHandler();
        }
    });
}

function initialize() {
    initCommandHandlers();
}

export default initialize;

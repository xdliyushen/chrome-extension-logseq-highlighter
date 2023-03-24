import { COMMANDS } from "../utils/constant";
import { queryActiveTab } from "../utils";

async function highlightTextHandler() {
    const { id: currentTabId } = (await queryActiveTab()) || {};

    // todo d
    console.log('currentTabId', currentTabId);

    if (currentTabId) {
        const res = await chrome.tabs.sendMessage(currentTabId, { type: COMMANDS.HIGHTLIGHT_TEXT });
        // todo d
        console.log('res', res);
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

import { COMMANDS } from '../constant';
import API from '../api';

// todo d
console.log(chrome);

function initCursorPopups() {

}

// TODO 读取内存 添加高亮
function loadHighlighs() {

}

function initMessageListeners() {
    chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
        // todo d
        console.log('received message from background', request);

        switch (request.type) {
            case COMMANDS.HIGHTLIGHT_TEXT:
                await API.highlightText()
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

export default initalize;

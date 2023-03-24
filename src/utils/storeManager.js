import { v4 as uuid } from 'uuid';
import { getNodeSelector, normalizeUrl, queryActiveTab } from '.';

class StoreManager {
    async _getActiveTabUrl() {
        const url = await (async () => {
            if(window) {
                return window.location.href;
            }
            return ((await queryActiveTab()) || {}).url;
        })();
        // remove protocol and hashtag
        return normalizeUrl(url);
    }

    // TODO filter \n
    async create(selection, bgColor, textColor) {
        const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
        const url = await this._getActiveTabUrl();
        const selectionInfo = {
            container: getNodeSelector(selection.getRangeAt(0).commonAncestorContainer),
            anchorNode: getNodeSelector(anchorNode),
            anchorOffset,
            focusNode: getNodeSelector(focusNode),
            focusOffset,
            highlightId: uuid(),
            text: selection.toString(),
            url,
            bgColor,
            textColor,
        };

        const { logseqHighlights = {} } = (await chrome.storage.local.get('logseqHighlights')) || {};

        // TODO d
        console.log('create logseqHighlights', logseqHighlights);

        const prevHightlights = logseqHighlights[url] || [];

        await chrome.storage.local.set({
            logseqHighlights: {
                ...logseqHighlights,
                [url]: [...prevHightlights, selectionInfo],
            }
        });

        return selectionInfo;
    }

    async readAll() {
        const url = await this._getActiveTabUrl();
        const { logseqHighlights = {} } = (await chrome.storage.local.get('logseqHighlights')) || {};
        // todo d
        console.log('readAll highlights', logseqHighlights);

        return logseqHighlights[url];
    }

    async read(highlightId) {
        const { logseqHighlights = {} } = (await chrome.storage.local.get('logseqHighlights')) || {};
        const highlights = logseqHighlights[url] || [];
        const index = highlights.findIndex((highlight) => highlight.highlightId === highlightId);
        return highlights[index];
    }

    async update(highlightId, value = {}) {
        const url = await this._getActiveTabUrl();
        const { logseqHighlights = {} } = (await chrome.storage.local.get('logseqHighlights')) || {};
        const highlights = logseqHighlights[url] || [];
        const index = highlights.findIndex((highlight) => highlight.highlightId === highlightId);

        if (index === -1) return;

        highlights[index] = {
            ...highlights[index],
            ...value,
        };

        await chrome.storage.local.set({
            logseqHighlights: {
                ...storageInfo,
                [url]: highlights,
            }
        });

        return highlights[index];
    }

    async delete(highlightId) {
        const url = await this._getActiveTabUrl();
        const { logseqHighlights = {} } = (await chrome.storage.local.get('logseqHighlights')) || {};
        const highlights = logseqHighlights[url] || [];
        const index = highlights.findIndex((highlight) => highlight.highlightId === highlightId);

        if (index === -1) return;

        highlights.splice(index, 1);

        await chrome.storage.local.set({
            logseqHighlights: {
                ...logseqHighlights,
                [url]: highlights,
            }
        });
    }

    getNextColorPair(textColor, bgColor) {
        // TODO 待实现
        return {
            textColor,
            bgColor,
        };
    }
}

const storeManager = new StoreManager();

export default storeManager;

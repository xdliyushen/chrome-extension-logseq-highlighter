import { v4 as uuid } from 'uuid';
import { getNodeSelector } from '.';

class StoreManager {
    // TODO filter \n
    async create(selection, url, bgColor, textColor) {
        const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
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

        const highlights = (await chrome.storage.sync.get('logseqHightlights')) || {};
        const prevHightlights = highlights[url] || [];

        await chrome.storage.sync.set({
            'logseqHightlights': {
                ...highlights,
                [url]: [...prevHightlights, selectionInfo],
            },
        });

        return selectionInfo;
    }

    read() {

    }

    update() {

    }

    delete() {

    }
}

const storeManager = new StoreManager();

export default storeManager;

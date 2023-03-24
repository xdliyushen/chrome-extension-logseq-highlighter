import storeManager from './storeManager';
import { DEFAULT_BG_COLOR, DEFAULT_TEXT_COLOR } from './constant';
import { initializeHighlightEventListeners, removeHighlightEventListeners } from '../contentScripts/hoverTools';
import { isVisiable, querySelector } from '.';

// TODO 如果页面换行的时候会有问题
const _recursiveWrapper = (container, selectionInfo, startFound, highlightedLen) => {
    const { anchorNode: anchorNodeSelector, anchorOffset, focusNode: focusNodeSelector, focusOffset, text, highlightId, bgColor, textColor } = selectionInfo;
    const anchorNode = querySelector(anchorNodeSelector);
    const focusNode = querySelector(focusNodeSelector);

    // TODO 每个页面的内存有上限
    container.childNodes.forEach((node) => {
        if (highlightedLen >= text.length) return;

        if (node.nodeType !== Node.TEXT_NODE) {
            // filter invisible nodes
            if (isVisiable(node) && getComputedStyle(node).visibility !== 'hidden') {
                [startFound, highlightedLen] = _recursiveWrapper(node, selectionInfo, startFound, highlightedLen);
            }
            return;
        }

        let startIndex = 0;
        if (!startFound) {
            if (node === anchorNode || node === focusNode) {
                startFound = true;
                startIndex = node === anchorNode ? anchorOffset : focusOffset;
            } else {
                return;
            }
        }

        const nodeText = node.nodeValue;
        const newNode = startIndex ? node.splitText(startIndex) : node;
        const textEndIndex = startIndex + Math.min(nodeText.length, text.length - highlightedLen);

        if(textEndIndex < nodeText.length) {
            newNode.splitText(textEndIndex - startIndex);
        }

        const span = document.createElement('span');
        span.classList.add('logseq-highlight');
        span.setAttribute('data-logseq-highlight-id', highlightId);
        span.style.backgroundColor = bgColor;
        span.style.color = textColor;
        span.innerText = nodeText.slice(startIndex, textEndIndex);

        highlightedLen += textEndIndex - startIndex;
        container.insertBefore(span, newNode);
        container.removeChild(newNode);
    });

    return [startFound, highlightedLen];
};

async function highlightCurrentText() {
    const selection = window.getSelection();
    const text = selection.toString();

    if (!text) return;

    // TODO 验证这一行代码的正确性
    const {
        bgColor = DEFAULT_BG_COLOR,
        textColor = DEFAULT_TEXT_COLOR,
    } = await chrome.storage.sync.get(['bgColor', 'textColor']);

    // save to storage
    const selectionInfo = await storeManager.create(selection, bgColor, textColor);

    // step1: find selection start/end and insert span to wrap the selection
    // TODO rangeCount may be > 1
    let container = selection.getRangeAt(0).commonAncestorContainer;
    addHighlight(selectionInfo, container);

    // step3: deselect the selection
    if (selection.removeAllRanges) selection.removeAllRanges();
}

function addHighlight(selectionInfo, _container) {
    let container = _container || querySelector(selectionInfo.container);
    if(!container) return;
    while (!container.innerHTML) container = container.parentElement;
    _recursiveWrapper(container, selectionInfo, false, 0);

    // add mouse hover event listener to the span
    const highlightElementss = document.querySelectorAll(`.logseq-highlight[data-logseq-highlight-id="${selectionInfo.highlightId}"]`);
    highlightElementss.forEach(_ele => {
        initializeHighlightEventListeners(_ele);
    });
}

function removeHighlight(highlightId) {
    const highlightElements = document.querySelectorAll(`.logseq-highlight[data-logseq-highlight-id="${highlightId}"]`);
    highlightElements.forEach(async (ele) => {
        ele.style.color = 'inherit';
        removeHighlightEventListeners(ele);
        await storeManager.delete(highlightId);
    });
}

const API = {
    highlightCurrentText, 
    removeHighlight, 
    addHighlight,
}

export default API;
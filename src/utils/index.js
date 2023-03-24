import parseUrl from "parse-url";

export const isVisiable = (node) => {
    // from jquery
    return !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length);
}

export const getNodeSelector = (node) => {
    let currNode = node;
    let selector = '';

    while (currNode !== node.ownerDocument.body) {
        // why not classname? classname is unreliable and can be changed by theme or user
        if (currNode.id) {
            selector = `#${currNode.id}>${selector}`;
        } else {
            const isTextNode = currNode.nodeType === Node.TEXT_NODE;
            const filterFn = isTextNode 
                ? node => node.nodeType === Node.TEXT_NODE 
                : node => node.tagName === currNode.tagName;
            const tagName = isTextNode ? 'textNode' : currNode.tagName.toLowerCase();
            const index = Array.from(currNode.parentElement.childNodes)
                .filter(filterFn)
                .indexOf(currNode) + 1;
            selector = `${tagName}:nth-of-type(${index})>${selector}`;
        }

        currNode = currNode.parentElement;
    }

    // remove last >
    return selector.slice(0, -1);
}

// custom querySelector to get text node with 'textNode' selector
export const querySelector = (selector) => {
    const singleSeletors = selector.split('>');
    const elementSelector = singleSeletors.slice(0, -1).join('>');
    const textNodeSelector = singleSeletors.slice(-1)[0];
    const node = document.querySelector(elementSelector);

    if (!textNodeSelector) return node;

    const index = parseInt(textNodeSelector.match(/nth-of-type\((\d+)\)/)[1]);
    const textNode = Array.from(node?.childNodes || [])
        .filter(node => node.nodeType === Node.TEXT_NODE)[index - 1];

    return textNode;
}

export async function queryActiveTab() {
    const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    return tabs?.[0];
}

// todo 删除该方法 还是不要这么用了
export const normalizeUrl = url => {
    const { resource, pathname } = parseUrl(url);
    return `${resource}${pathname}`
}

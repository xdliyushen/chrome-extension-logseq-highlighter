
import storeManager from "../../utils/storeManager";
import API from '../../utils/api';
import Copy from './copy.svg';
import Colors from './colors.svg';
import Delete from './delete.svg'

const jsx = `
<div class='logseq-highlight-icon copy'><img src='${Copy}' /></div>
<div class='logseq-highlight-icon colors'><img src='${Colors}' /></div>
<div class='logseq-highlight-icon delete'><img src='${Delete}' /></div>
`;

let hoverTimer = null;
let popupShowed = false;
let highlightId = null;

export const initPopup = () => {
    const popup = document.createElement('div');
    popup.classList.add('logseq-highlight-hover-popup');
    popup.style.position = 'absolute';
    popup.style.display = 'none';
    popup.style.zIndex = 999;
    popup.style.transform = 'translate(-50%, -100%)';
    popup.innerHTML = jsx;

    // init event listeners
    popup.querySelector('.logseq-highlight-hover-popup .logseq-highlight-icon.copy')
        .addEventListener('click', async () => {
            const highlightInfo = await storeManager.read(highlightId);

            if(highlightInfo) {
                await navigator.clipboard.writeText(highlightInfo.text);
            }
        });
    popup.querySelector('.logseq-highlight-hover-popup .logseq-highlight-icon.colors', async () => {
        const { textColor, bgColor } = (await storeManager.read(highlightId)) || {};
        const nextColorPair = storeManager.getNextColorPair(textColor, bgColor);
        const highlightInfo = await storeManager.update(highlightId, nextColorPair);
        API.removeHighlight(highlightId);
        API.addHighlight(highlightId, highlightInfo);
    });
    popup.querySelector('.logseq-highlight-hover-popup .logseq-highlight-icon.delete', async () => {
        await storeManager.delete(highlightId);
        API.removeHighlight(highlightId);
    });

    document.body.appendChild(popup);
}

const showHoverPopup = (event) => {
    const element = event.target;
    // todo 验证
    highlightId = element.dataset['logseq-highlight-id'];

    const popup = document.querySelector('.logseq-highlight-hover-popup');
    // popup is not shown
    if (popup && !popup.offsetParent) {
        const { top } = element.getBoundingClientRect();
        popup.style.display = 'block';
        popup.style.top = `${top + window.scrollY}px`;
        popup.style.left = `${event.pageX}px`;
    }

    popupShowed = true;
}

const hideHoverPopup = () => {
    const popup = document.querySelector('.logseq-highlight-hover-popup');
    if (popup) {
        popup.style.display = 'none';
    }
    popupShowed = false;
    highlightId = null;
}

const onPopupMouseEnter = (e) => {
    clearTimeout(hoverTimer);
    showHoverPopup(e);
}

const onPopupMouseLeave = () => {
    if(!popupShowed) return;

    hoverTimer = setTimeout(() => {
        clearTimeout(hoverTimer);
        hideHoverPopup();
    }, 500);
}

export const initializeHighlightEventListeners = (element) => {
    element.addEventListener('click', onPopupMouseEnter);
    element.addEventListener('mouseenter', onPopupMouseEnter);
    element.addEventListener('mouseleave', onPopupMouseLeave);
}

export const removeHighlightEventListeners = (element) => {
    element.removeEventListener('click', onPopupMouseEnter);
    element.removeEventListener('mouseenter', onPopupMouseEnter);
    element.removeEventListener('mouseleave', onPopupMouseLeave);
}

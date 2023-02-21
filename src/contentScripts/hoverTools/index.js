const jsx = `
<div class='logseq-highlight-hover-popup'>
    <div class='logseq-highlight-icon copy'></div>
    <div class='logseq-highlight-icon color'></div>
    <div class='logseq-highlight-icon delete'></div>
</div>
`

const showHoverPopup = (event) => {
    const high
}

export const initHoverEvents = (element) => {
    element.addEventListener('click', showHoverPopup);
    element.addEventListener('mouseover', showHoverPopup);
    element.addEventListener('mouseleave', hideHoverPopup);
}
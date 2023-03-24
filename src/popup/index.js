import '../global.css';
import './index.css';
import { DEFAULT_TEMPLATE } from '../utils/constant';
import moment from 'moment';
import { normalizeUrl, queryActiveTab } from '../utils';

const extractContentFromHighlights = (highlights) => {
    return (highlights || []).reduce((text, curr) => {
        return `${text}* ${curr.text || ''}\n`;
    }, '\n');
}

// todo popup 里可以编辑内容, 并保存到 storage

const initalize = async () => {
    const { url: baseUrl, title } = (await queryActiveTab()) || {};
    const url = normalizeUrl(baseUrl);

    const exportButton = document.querySelector('.export-button');
    const targetPageInput = document.querySelector('.target-page-input');
    const contentInput = document.querySelector('.content-textarea');
    const optionsButton = document.querySelector('.options-button');

    let {
        logseqExportTemplate: templaet = DEFAULT_TEMPLATE,
        logseqHighlights: highlightInfos = {},
        logseqAppend: append = true,
    } = await chrome.storage.local.get(['logseqExportTemplate', 'logseqHighlights', 'logseqAppend']);

    // todo d
    console.log('popup init', templaet, highlightInfos, append, url);
    console.log(extractContentFromHighlights(highlightInfos[url]));

    // listen to storage change, update template and highlightInfos
    chrome.storage.local.onChanged.addListener((changes, namespace) => {
        // todo d
        console.log('storages changes', changes, namespace);

        for (const [key, { newValue }] in changes) {
            if (key === 'logseqExportTemplate') {
                templaet = newValue;
            } else if (key === 'logseqHighlights') {
                highlightInfos = newValue;
                contentInput.value = extractContentFromHighlights(highlightInfos[url]);
            } else if (key === 'logseqAppend') {
                append = newValue;
            }
        }
    });

    // init default values
    targetPageInput.value = 'TODAY';
    contentInput.value = extractContentFromHighlights(highlightInfos[url]);

    exportButton.addEventListener('click', async () => {
        const targetPage = targetPageInput.value || 'TODAY';
        const content = contentInput.value || '';
        const result = templaet
            .replace('{{pageTitle}}', title)
            .replace('{{pageUrl}}', baseUrl)
            .replace(/\{\{date\:?[yYmMdD\-]+\}\}/, (searchValue, replaceValue) => {
                const format = searchValue.replace('{{date:', '').replace('}}', '');
                return moment().format(format);
            })
            .replace('{{content}}', content);

        chrome.tabs.create({
            url: `logseq://x-callback-url/quickCapture?page=${targetPage}&append=${append}&title=${title}&content=${result ? result : ""}&url=${encodeURIComponent(url)}`,
        })
    });

    optionsButton.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });
};

export default initalize;

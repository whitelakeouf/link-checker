// import { urlRegex } from '../utils/helpers';

const aTags = document.getElementsByTagName('a');

const getAllLinksFromPage = (): string[] => {
    return Array.from(aTags).map((link) => link.href);
};

console.log(aTags);

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    console.log(msg);
    if (msg.action == 'send_link_list') {
        const linkList = getAllLinksFromPage();
        console.log(linkList);
        sendResponse(linkList);
        for (let i = 0; i < aTags.length; i++) {
            aTags[i].setAttribute('style', 'background-color: lightgray;');
        }
    }
    if (msg.action == 'send_checked_link_list') {
        console.log(msg.links);
        for (let i = 0; i < msg.links.length; i++) {
            if (msg.links[i] !== '*') {
                if (msg.links[i].ok) {
                    aTags[i].setAttribute('style', 'background-color: #5FDD9D;');
                } else {
                    aTags[i].setAttribute('style', 'background-color: #F28482;');
                }
            }
        }
    }
});

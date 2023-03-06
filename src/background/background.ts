// import { urlRegex } from '../utils/variables';

const openedTabs = new Set([]);

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.clear();
    chrome.storage.sync.set({ blockedDomains: ['google.com'] });
    chrome.storage.sync.set({ hashWarning: true });
    chrome.storage.sync.set({ emptyValueWarning: true });
});

chrome.tabs.onRemoved.addListener((tabId) => {
    if (openedTabs.has(tabId)) {
        chrome.storage.local.remove(`${tabId}`);
        openedTabs.delete(tabId);
    }
});

chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'send_request') {
        port.onMessage.addListener(() => {
            chrome.tabs.query({ currentWindow: true, active: true }, ([tab]) => {
                chrome.tabs.sendMessage(tab.id, { action: 'send_link_list' }, (linkList) => {
                    console.log(linkList);
                    chrome.storage.sync.get(['blockedDomains'], (res) => {
                        console.log(res);
                        Promise.all(
                            linkList.map(async (link: string) => {
                                let result: object;
                                if (res.blockedDomains.length > 0) {
                                    for (const domain of res.blockedDomains) {
                                        const myLink = 'https://' + domain;
                                        if (link.includes(myLink)) {
                                            console.log('blocked url');
                                            return '*';
                                        }
                                    }
                                }
                                const response = await fetch(link);
                                console.log(response);
                                link === ''
                                    ? (result = {
                                          url: '',
                                          ok: response.ok,
                                          status: response.status,
                                          redirect: response.redirected,
                                      })
                                    : (result = {
                                          url: response.url,
                                          ok: response.ok,
                                          status: response.status,
                                          redirect: response.redirected,
                                      });
                                return result;
                            }),
                        ).then((checkedLinks) => {
                            console.log(checkedLinks);
                            port.postMessage(checkedLinks);
                            openedTabs.add(tab.id);
                            chrome.storage.local.set({ [tab.id]: { links: checkedLinks, pageUrl: tab.url } });
                            chrome.tabs.sendMessage(tab.id, { action: 'send_checked_link_list', links: checkedLinks });
                        });
                    });
                });
            });
        });
    }
});

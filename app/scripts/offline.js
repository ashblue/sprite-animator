'use strict';

if (window.CONFIG.online) {
    Offline.options = {
        checks: {
            xhr: { url: './favicon.ico' }
        }
    };
}

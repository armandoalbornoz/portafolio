import { renderRainContent } from './content-renderers.js';

function startRainEntry() {
    renderRainContent();
    import('./rain.js');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startRainEntry, { once: true });
} else {
    startRainEntry();
}

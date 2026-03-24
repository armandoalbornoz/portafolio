import { renderDelaunayContent } from './content-renderers.js';

function startDelaunayEntry() {
    renderDelaunayContent();
    import('./delaunay.js');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startDelaunayEntry, { once: true });
} else {
    startDelaunayEntry();
}

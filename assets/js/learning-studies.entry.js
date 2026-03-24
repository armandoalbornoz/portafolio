import { renderLearningStudiesContent } from './content-renderers.js';

function startLearningStudiesEntry() {
    renderLearningStudiesContent();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startLearningStudiesEntry, { once: true });
} else {
    startLearningStudiesEntry();
}

import { renderPortfolioContent } from './content-renderers.js';

const loadPortfolioModule = () => import('./portfolio.js');
let assistantModulePromise;

function loadAssistantModule() {
    if (!assistantModulePromise) {
        assistantModulePromise = import('./portfolio-assistant.js').then((module) => {
            module.initPortfolioAssistant();
            return module;
        });
    }

    return assistantModulePromise;
}

function setupAssistantLazyLoading() {
    const assistantSection = document.getElementById('assistant');
    if (!assistantSection || typeof window === 'undefined') {
        loadAssistantModule();
        return;
    }

    const loadOnDemand = () => {
        loadAssistantModule();
        assistantSection.removeEventListener('focusin', loadOnDemand);
        assistantSection.removeEventListener('pointerenter', loadOnDemand);
        assistantSection.removeEventListener('click', loadOnDemand);
    };

    assistantSection.addEventListener('focusin', loadOnDemand, { once: true });
    assistantSection.addEventListener('pointerenter', loadOnDemand, { once: true });
    assistantSection.addEventListener('click', loadOnDemand, { once: true });

    if ('IntersectionObserver' in window) {
        const assistantObserver = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                loadOnDemand();
                assistantObserver.disconnect();
            }
        }, {
            rootMargin: '320px 0px'
        });

        assistantObserver.observe(assistantSection);
        return;
    }

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadOnDemand, { timeout: 1500 });
        return;
    }

    window.addEventListener('load', () => {
        window.setTimeout(loadOnDemand, 600);
    }, { once: true });
}

function startPortfolioEntry() {
    renderPortfolioContent();
    setupAssistantLazyLoading();

    if (typeof window !== 'undefined') {
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => {
                loadPortfolioModule();
            });
        } else {
            window.addEventListener('load', () => {
                window.setTimeout(loadPortfolioModule, 150);
            }, { once: true });
        }
    } else {
        loadPortfolioModule();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startPortfolioEntry, { once: true });
} else {
    startPortfolioEntry();
}

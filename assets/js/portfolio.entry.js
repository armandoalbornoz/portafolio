import('./base.js');

const loadPortfolioModule = () => import('./portfolio.js');

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

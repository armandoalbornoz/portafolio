const moduleCache = new Map();

function canResolveBareSpecifiers() {
    return typeof import.meta !== 'undefined'
        && typeof import.meta.env !== 'undefined';
}

/**
 * Dynamically imports an ES module and falls back to a CDN URL when the bare
 * specifier cannot be resolved in the current environment (e.g., GitHub Pages).
 * The loaded module is cached using the pair of specifier and fallback URL so
 * subsequent calls return the same promise.
 *
 * @param {string} specifier Native module specifier (e.g., 'three').
 * @param {string} [fallbackUrl] Absolute URL to an ESM-compatible build.
 * @returns {Promise<any>} Promise resolving to the imported module namespace.
 */
export async function loadWithFallback(specifier, fallbackUrl) {
    const cacheKey = `${specifier}::${fallbackUrl || ''}`;
    if (!moduleCache.has(cacheKey)) {
        moduleCache.set(
            cacheKey,
            (async () => {
                if (!canResolveBareSpecifiers()) {
                    if (!fallbackUrl) {
                        throw new TypeError(`Cannot resolve bare specifier "${specifier}" without a fallback URL.`);
                    }

                    return import(/* @vite-ignore */ fallbackUrl);
                }

                try {
                    return await import(/* @vite-ignore */ specifier);
                } catch (error) {
                    if (!fallbackUrl) {
                        throw error;
                    }
                    console.warn(`Falling back to CDN for ${specifier}`, error);
                    return import(/* @vite-ignore */ fallbackUrl);
                }
            })()
        );
    }
    return moduleCache.get(cacheKey);
}

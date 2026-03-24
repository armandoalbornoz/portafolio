import siteContent from '../content/site-content.json';

const overviewFigureMap = {
    profile: `
        <div class="overview-figure overview-figure--profile" aria-hidden="true">
            <div class="overview-avatar">
                <span class="overview-avatar__head"></span>
                <span class="overview-avatar__body"></span>
                <span class="overview-avatar__spark"></span>
            </div>
        </div>
    `,
    stack: `
        <div class="overview-figure overview-figure--stack" aria-hidden="true">
            <span class="logo-tile logo-tile--amber">EVAL</span>
            <span class="logo-tile logo-tile--coral">AUTO</span>
            <span class="logo-tile logo-tile--sage">RAIN</span>
            <span class="logo-tile logo-tile--violet">OPS</span>
        </div>
    `,
    compass: `
        <div class="overview-figure overview-figure--compass" aria-hidden="true">
            <div class="overview-device">
                <div class="overview-device__screen">
                    <span class="overview-device__bar overview-device__bar--one"></span>
                    <span class="overview-device__bar overview-device__bar--two"></span>
                    <span class="overview-device__bar overview-device__bar--three"></span>
                </div>
                <div class="overview-device__base"></div>
            </div>
        </div>
    `,
    send: `
        <div class="overview-figure overview-figure--send" aria-hidden="true">
            <span class="chat-bubble chat-bubble--blue">
                <i></i><i></i><i></i>
            </span>
            <span class="chat-bubble chat-bubble--green chat-bubble--top">
                <i></i><i></i><i></i>
            </span>
            <span class="chat-bubble chat-bubble--blue chat-bubble--low">
                <i></i><i></i><i></i>
            </span>
            <span class="chat-bubble chat-bubble--green chat-bubble--mid">
                <i></i><i></i><i></i>
            </span>
        </div>
    `
};

const projectFigureMap = {
    rain: `
        <div class="project-figure project-figure--rain" aria-hidden="true">
            <span class="project-rain__cloud"></span>
            <span class="project-rain__drop project-rain__drop--one"></span>
            <span class="project-rain__drop project-rain__drop--two"></span>
            <span class="project-rain__drop project-rain__drop--three"></span>
        </div>
    `,
    youtube: `
        <div class="project-figure project-figure--youtube" aria-hidden="true">
            <div class="project-youtube__screen">
                <span class="project-youtube__glow"></span>
                <span class="project-youtube__play"></span>
            </div>
            <div class="project-youtube__pipeline">
                <span class="project-youtube__chip">AI</span>
                <span class="project-youtube__chip">VO</span>
                <span class="project-youtube__chip">FX</span>
            </div>
            <span class="project-youtube__timeline"></span>
        </div>
    `,
    vision: `
        <div class="project-figure project-figure--vision" aria-hidden="true">
            <div class="project-vision__patches">
                <span class="project-vision__patch"></span>
                <span class="project-vision__patch"></span>
                <span class="project-vision__patch project-vision__patch--accent"></span>
                <span class="project-vision__patch"></span>
                <span class="project-vision__patch project-vision__patch--focus"></span>
                <span class="project-vision__patch"></span>
                <span class="project-vision__patch"></span>
                <span class="project-vision__patch"></span>
                <span class="project-vision__patch project-vision__patch--accent"></span>
            </div>
            <span class="project-vision__beam project-vision__beam--one"></span>
            <span class="project-vision__beam project-vision__beam--two"></span>
            <span class="project-vision__beam project-vision__beam--three"></span>
            <div class="project-vision__tokens">
                <span class="project-vision__token project-vision__token--cls">CLS</span>
                <span class="project-vision__token"></span>
                <span class="project-vision__token"></span>
                <span class="project-vision__token"></span>
            </div>
        </div>
    `,
    studies: `
        <div class="project-figure project-figure--studies" aria-hidden="true">
            <div class="project-studies__grid">
                <span class="project-studies__module project-studies__module--complete">SL</span>
                <span class="project-studies__module project-studies__module--complete project-studies__module--focus">OL</span>
                <span class="project-studies__module project-studies__module--upcoming">UL</span>
                <span class="project-studies__module project-studies__module--upcoming">RL</span>
            </div>
            <div class="project-studies__status">
                <span class="project-studies__status-line"></span>
                <span class="project-studies__status-text">2 / 4</span>
            </div>
        </div>
    `,
    delaunay: `
        <div class="project-figure project-figure--delaunay" aria-hidden="true">
            <svg class="project-delaunay__mesh" viewBox="0 0 180 180" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M24 136L62 48 108 88 154 42"></path>
                <path d="M24 136L108 88 144 136"></path>
                <path d="M62 48L84 24 154 42"></path>
                <path d="M62 48L44 98 24 136"></path>
                <path d="M44 98L108 88"></path>
                <path d="M84 24L108 88"></path>
                <circle cx="24" cy="136" r="4"></circle>
                <circle cx="44" cy="98" r="4"></circle>
                <circle cx="62" cy="48" r="4"></circle>
                <circle cx="84" cy="24" r="4"></circle>
                <circle cx="108" cy="88" r="4"></circle>
                <circle cx="144" cy="136" r="4"></circle>
                <circle cx="154" cy="42" r="4"></circle>
            </svg>
        </div>
    `
};

const experienceFigureMap = {
    delaunay: `
        <div class="experience-figure experience-figure--delaunay" aria-hidden="true">
            <svg class="experience-delaunay__mesh" viewBox="0 0 180 180" fill="none" stroke="currentColor" stroke-width="1.45">
                <path d="M28 136L66 48 108 86 150 42"></path>
                <path d="M28 136L108 86 144 136"></path>
                <path d="M66 48L90 24 150 42"></path>
                <path d="M48 94L108 86"></path>
                <path d="M66 48L48 94 28 136"></path>
                <path d="M90 24L108 86"></path>
                <circle cx="28" cy="136" r="4"></circle>
                <circle cx="48" cy="94" r="4"></circle>
                <circle cx="66" cy="48" r="4"></circle>
                <circle cx="90" cy="24" r="4"></circle>
                <circle cx="108" cy="86" r="4"></circle>
                <circle cx="144" cy="136" r="4"></circle>
                <circle cx="150" cy="42" r="4"></circle>
            </svg>
        </div>
    `,
    metric: `
        <div class="experience-figure experience-figure--metric" aria-hidden="true">
            <span class="experience-metric__space experience-metric__space--one"></span>
            <span class="experience-metric__space experience-metric__space--two"></span>
            <span class="experience-metric__point experience-metric__point--one"></span>
            <span class="experience-metric__point experience-metric__point--two"></span>
            <span class="experience-metric__point experience-metric__point--three"></span>
            <span class="experience-metric__point experience-metric__point--four"></span>
            <span class="experience-metric__bridge"></span>
            <span class="experience-metric__label">dH</span>
        </div>
    `
};

const skillIconMap = {
    languages: `
        <svg class="skill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
    `,
    ml: `
        <svg class="skill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
    `,
    frameworks: `
        <svg class="skill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
    `,
    tools: `
        <svg class="skill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
    `,
    core: `
        <svg class="skill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
        </svg>
    `,
    math: `
        <svg class="skill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
    `
};

const actionIconMap = {
    document: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
    `,
    status: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
    `,
    external: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
    `
};

const socialIconMap = {
    linkedin: `
        <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
        </svg>
    `,
    github: `
        <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"></path>
        </svg>
    `
};

function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = value;
    }
}

function setHtml(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.innerHTML = value;
    }
}

function setAttribute(selector, attributeName, value) {
    const element = document.querySelector(selector);
    if (element && value !== undefined) {
        if (attributeName === 'href') {
            element.setAttribute(attributeName, sanitizeHref(value));
            return;
        }

        if (attributeName === 'src') {
            element.setAttribute(attributeName, sanitizeSrc(value));
            return;
        }

        if (attributeName === 'target') {
            const safeTarget = sanitizeTarget(value);
            if (safeTarget) {
                element.setAttribute(attributeName, safeTarget);
            } else {
                element.removeAttribute(attributeName);
            }
            return;
        }

        element.setAttribute(attributeName, value);
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function sanitizeHref(value) {
    if (typeof value !== 'string') {
        return '#';
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return '#';
    }

    if (trimmed.startsWith('#')) {
        return trimmed;
    }

    if (trimmed.startsWith('//')) {
        return '#';
    }

    const hasExplicitScheme = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(trimmed);
    if (!hasExplicitScheme) {
        return trimmed;
    }

    try {
        const parsed = new URL(trimmed);
        if (['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
            return trimmed;
        }
    } catch {
        return '#';
    }

    return '#';
}

function sanitizeSrc(value) {
    if (typeof value !== 'string') {
        return 'about:blank';
    }

    const trimmed = value.trim();
    if (!trimmed || trimmed.startsWith('//')) {
        return 'about:blank';
    }

    const hasExplicitScheme = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(trimmed);
    if (!hasExplicitScheme) {
        return trimmed;
    }

    try {
        const parsed = new URL(trimmed);
        if (['http:', 'https:'].includes(parsed.protocol)) {
            return trimmed;
        }
    } catch {
        return 'about:blank';
    }

    return 'about:blank';
}

function sanitizeTarget(value) {
    return value === '_blank' ? '_blank' : '';
}

function renderTags(tags, className) {
    return tags
        .map((tag) => `<span class="${className}">${escapeHtml(tag)}</span>`)
        .join('');
}

function renderButtonLink(action, className) {
    const safeHref = escapeHtml(sanitizeHref(action.href));
    const safeTarget = sanitizeTarget(action.target);
    const target = safeTarget ? ` target="${safeTarget}"` : '';
    const rel = safeTarget === '_blank' ? ' rel="noopener noreferrer"' : '';

    return `
        <a href="${safeHref}" class="${className}"${target}${rel}>
            ${actionIconMap[action.icon] || ''}
            <span>${escapeHtml(action.label)}</span>
        </a>
    `;
}

function renderProjectAction(action, className = 'project-btn') {
    return renderButtonLink(action, className);
}

function renderAssistantChip(prompt, { openAssistant = false } = {}) {
    const openAttribute = openAssistant ? ' data-assistant-focus="true"' : '';
    return `
        <button type="button" class="assistant-chip" data-prompt="${escapeHtml(prompt)}"${openAttribute}>
            ${escapeHtml(prompt)}
        </button>
    `;
}

function renderPortfolioContent() {
    const { global, home } = siteContent;
    const heroKickerRow = document.querySelector('.hero-kicker-row');

    document.title = home.seo.title;
    setAttribute('meta[name="description"]', 'content', home.seo.description);
    setAttribute('meta[property="og:title"]', 'content', home.seo.title);
    setAttribute('meta[property="og:description"]', 'content', home.seo.description);
    setAttribute('meta[property="og:url"]', 'content', home.seo.url);
    setAttribute('meta[property="og:image"]', 'content', home.seo.image);
    setAttribute('meta[name="twitter:title"]', 'content', home.seo.title);
    setAttribute('meta[name="twitter:description"]', 'content', home.seo.description);
    setAttribute('meta[name="twitter:image"]', 'content', home.seo.image);
    setAttribute('link[rel="canonical"]', 'href', home.seo.url);

    setHtml(
        '#nav-actions',
        `
            <a href="${escapeHtml(sanitizeHref(global.resumePath))}" class="nav-cta" target="_blank" rel="noopener noreferrer">
                ${escapeHtml(home.nav.resumeLabel)}
            </a>
            <a href="${escapeHtml(sanitizeHref(global.linkedinUrl))}" class="nav-cta nav-cta--icon nav-cta--secondary" target="_blank"
                rel="noopener noreferrer" aria-label="${escapeHtml(home.nav.linkedinLabel)}">
                ${socialIconMap.linkedin}
                <span class="sr-only">${escapeHtml(home.nav.linkedinLabel)}</span>
            </a>
        `
    );

    setText('#hero-kicker', home.hero.kicker);
    if (heroKickerRow) {
        heroKickerRow.hidden = !home.hero.kicker;
    }
    setHtml('#hero-title', home.hero.titleHtml);
    setText('#hero-subtitle', home.hero.subtitle);
    setText('#hero-summary', home.hero.summary);
    setHtml('#hero-roles', renderTags(home.hero.roles, 'role'));
    setText('#assistant-badge', home.assistant.badge);
    setText('#assistant-title', home.assistant.title);
    setText('#assistant-description', home.assistant.description);
    setHtml(
        '#overview-grid',
        home.overviewCards
            .map(
                (card) => `
                    <a class="overview-card overview-card--${escapeHtml(card.tone)}" href="${escapeHtml(sanitizeHref(card.href))}">
                        <div class="overview-card__media overview-card__media--${escapeHtml(card.icon)}">
                            ${overviewFigureMap[card.icon] || ''}
                        </div>
                        <div class="overview-card__body">
                            <h3 class="overview-card__title">${escapeHtml(card.title)}</h3>
                            <p class="overview-card__description">${escapeHtml(card.description)}</p>
                        </div>
                    </a>
                `
            )
            .join('')
    );
    setText('#hero-primary-cta', home.hero.primaryCta.label);
    setAttribute('#hero-primary-cta', 'href', home.hero.primaryCta.href);
    setAttribute('#hero-primary-cta', 'target', '_blank');
    setAttribute('#hero-primary-cta', 'rel', 'noopener noreferrer');
    setText('#hero-secondary-cta', home.hero.secondaryCta.label);
    setAttribute('#hero-secondary-cta', 'href', home.hero.secondaryCta.href);

    setText('#about-label', home.about.label);
    setHtml('#about-heading', home.about.headingHtml);
    setText('#about-summary', home.about.summary);
    setHtml(
        '#about-descriptions',
        home.about.paragraphs
            .map((paragraph) => `<p class="about-paragraph">${escapeHtml(paragraph)}</p>`)
            .join('')
    );
    setHtml(
        '#education-grid',
        [
            ...home.about.education.map(
                (item) => `
                    <div class="education-card">
                        <span class="education-card__eyebrow">Education</span>
                        <h3>${escapeHtml(item.school)}</h3>
                        <p class="degree">${escapeHtml(item.degree)}</p>
                        <p class="date">${escapeHtml(item.date)}</p>
                    </div>
                `
            ),
            ...(home.about.certifications || []).map(
                (item) => `
                    <div class="education-card">
                        <span class="education-card__eyebrow">Certification</span>
                        <h3>${escapeHtml(item.issuer)}</h3>
                        <p class="degree">${escapeHtml(item.title)}</p>
                        <p class="date">${escapeHtml(item.date)}</p>
                    </div>
                `
            )
        ].join('')
    );

    setText('#projects-label', home.projects.label);
    setText('#projects-summary', home.projects.summary);
    setHtml(
        '#projects-grid',
        home.projects.items
            .map((item, index) => {
                const metricsMarkup = item.metrics.length
                    ? `
                        <div class="project-metrics">
                            ${item.metrics
                                .map(
                                    (metric) => `
                                        <span class="metric-chip"><strong>${escapeHtml(metric.value)}</strong> ${escapeHtml(metric.label)}</span>
                                    `
                                )
                                .join('')}
                        </div>
                    `
                    : '';

                return `
                    <article class="project-card project-card--tone-${(index % 3) + 1}">
                        <div class="project-card__media project-card__media--${escapeHtml(item.figure || 'rain')}">
                            ${projectFigureMap[item.figure] || projectFigureMap.rain}
                        </div>
                        <div class="project-card__content">
                            <div class="project-card__meta">
                                <p class="project-tags">${escapeHtml(item.tags)}</p>
                            </div>
                            <div class="project-card__body">
                                <h3 class="project-title">${escapeHtml(item.title)}</h3>
                                <p class="project-card__summary">${escapeHtml(item.summary)}</p>
                                <ul class="project-card__list">
                                    ${item.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}
                                </ul>
                                ${metricsMarkup}
                            </div>
                            <div class="project-actions">
                                ${renderProjectAction(item.action)}
                            </div>
                        </div>
                    </article>
                `;
            })
            .join('')
    );

    setText('#experience-label', home.experience.label);
    setText('#experience-summary', home.experience.summary);
    setHtml(
        '#experience-grid',
        home.experience.items
            .map(
                (item, index) => `
                    <article class="experience-card experience-card--${escapeHtml(item.figure || 'metric')}">
                        <div class="experience-card__media experience-card__media--${escapeHtml(item.figure || 'metric')}">
                            ${experienceFigureMap[item.figure] || experienceFigureMap.metric}
                        </div>
                        <div class="experience-card__content">
                            <div class="experience-card__rail">
                                <span class="experience-date">${escapeHtml(item.date)}</span>
                            </div>
                            <div class="experience-header">
                                <div>
                                    <h3 class="experience-title">${escapeHtml(item.title)}</h3>
                                    <p class="experience-company">${escapeHtml(item.company)}</p>
                                </div>
                            </div>
                            <div class="experience-description">
                                <p>${escapeHtml(item.summary)}</p>
                                <ul>
                                    ${item.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}
                                </ul>
                                <div class="project-actions">
                                    ${renderProjectAction(item.action)}
                                </div>
                            </div>
                        </div>
                    </article>
                `
            )
            .join('')
    );

    setText('#skills-label', home.skills.label);
    setText('#skills-summary', home.skills.summary);
    setHtml(
        '#skills-grid',
        home.skills.categories
            .map(
                (category) => `
                    <article class="skill-category">
                        <h3 class="skill-category-title">
                            ${skillIconMap[category.icon] || ''}
                            ${escapeHtml(category.title)}
                        </h3>
                        <div class="skill-tags">
                            ${renderTags(category.tags, 'skill-tag')}
                        </div>
                    </article>
                `
            )
            .join('')
    );

    setHtml('#contact-title', home.contact.titleHtml);
    setText('#contact-description', home.contact.description);
    setHtml(
        '#contact-links',
        `
            <div class="contact-row contact-email">
                <div class="contact-email-actions">
                    <a href="${escapeHtml(sanitizeHref(`mailto:${global.email}`))}" class="contact-link contact-email-link">
                        <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <span class="contact-email-text">${escapeHtml(global.email)}</span>
                    </a>
                    <button type="button" class="copy-email-btn copy-email-btn--icon" data-email="${escapeHtml(global.email)}"
                        aria-label="Copy email address">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span class="sr-only">${escapeHtml(home.contact.copyLabel)}</span>
                    </button>
                    ${home.contact.links
                        .map(
                            (link) => `
                                <a href="${escapeHtml(sanitizeHref(link.href))}" target="_blank" rel="noopener noreferrer"
                                    class="contact-link contact-link--social" aria-label="${escapeHtml(link.label)}">
                                    ${socialIconMap[link.icon] || ''}
                                    <span class="sr-only">${escapeHtml(link.label)}</span>
                                </a>
                            `
                        )
                        .join('')}
                </div>
                <span class="copy-feedback" aria-live="polite"></span>
            </div>
        `
    );

    setHtml(
        '#assistant-widget-prompts',
        home.assistant.starterPrompts.map((prompt) => renderAssistantChip(prompt, { openAssistant: true })).join('')
    );
    setText('#assistant-disclaimer', home.assistant.disclaimer);

    setText('#modal-title', home.modal.title);
    setText('#modal-description', home.modal.description);
    setText('#modal-button', home.modal.buttonLabel);
    setText('#footer-text', home.footer.text);
}

function renderRainContent() {
    const { global, rain } = siteContent;

    document.title = rain.title;
    setText('#rain-back-label', rain.backLabel);
    setAttribute('#rain-back-link', 'href', global.portfolioPath);
    setText('#rain-title', rain.header.title);
    setText('#rain-subtitle', rain.header.subtitle);
    setHtml('#rain-tech-tags', renderTags(rain.header.techTags, 'tech-tag'));
    setHtml(
        '#rain-info-sections',
        rain.infoSections
            .map((section) => {
                if (section.text) {
                    return `
                        <div class="info-section">
                            <h2 class="info-title">${escapeHtml(section.title)}</h2>
                            <p class="info-text">${escapeHtml(section.text)}</p>
                        </div>
                    `;
                }

                return `
                    <div class="info-section">
                        <h2 class="info-title">${escapeHtml(section.title)}</h2>
                        <ul class="info-list">
                            ${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
                        </ul>
                    </div>
                `;
            })
            .join('') +
            `
                <div class="info-section">
                    <h2 class="info-title">${escapeHtml(rain.metrics.title)}</h2>
                    <div class="metrics-grid">
                        ${rain.metrics.items
                            .map(
                                (metric) => `
                                    <div class="metric-card">
                                        <div class="metric-value">${escapeHtml(metric.value)}</div>
                                        <div class="metric-label">${escapeHtml(metric.label)}</div>
                                    </div>
                                `
                            )
                            .join('')}
                    </div>
                </div>
            `
    );
    setText('#rain-demo-title', rain.demo.title);
    setText('#rain-demo-description', rain.demo.description);
    setText('#rain-demo-link-label', rain.demo.externalLabel);
    setAttribute('#rain-demo-link', 'href', rain.demo.externalUrl);
    setText('#rain-fallback-title', rain.demo.fallbackTitle);
    setText('#rain-fallback-text', rain.demo.fallbackText);
    setText('#rain-fallback-button-label', rain.demo.fallbackButtonLabel);
    setAttribute('#rain-fallback-button', 'href', rain.demo.externalUrl);
    setAttribute('#demoIframe', 'src', rain.demo.iframeUrl);
    setAttribute('#demoIframe', 'title', rain.demo.iframeTitle);
}

function renderLearningStudiesContent() {
    const { global, learningStudies } = siteContent;

    document.title = learningStudies.title;
    setText('#studies-back-label', learningStudies.backLabel);
    setAttribute('#studies-back-link', 'href', global.portfolioPath);
    setText('#studies-title', learningStudies.header.title);
    setText('#studies-subtitle', learningStudies.header.subtitle);
    setHtml('#studies-tech-tags', renderTags(learningStudies.header.techTags, 'tech-tag'));
    setText('#studies-status-label', learningStudies.status.label);
    setText('#studies-status-text', learningStudies.status.text);
    setText('#studies-overview-eyebrow', learningStudies.overview.eyebrow);
    setText('#studies-overview-title', learningStudies.overview.title);
    setHtml(
        '#studies-overview-paragraphs',
        learningStudies.overview.paragraphs
            .map((paragraph) => `<p class="overview-paragraph">${escapeHtml(paragraph)}</p>`)
            .join('')
    );
    setHtml(
        '#studies-metrics',
        learningStudies.overview.metrics
            .map(
                (metric) => `
                    <div class="study-metric">
                        <div class="study-metric__value">${escapeHtml(metric.value)}</div>
                        <div class="study-metric__label">${escapeHtml(metric.label)}</div>
                    </div>
                `
            )
            .join('')
    );
    setHtml(
        '#studies-report-sections',
        learningStudies.reportSections
            .map((section) => {
                const secondaryReportMarkup = section.secondaryReport
                    ? `
                        <a href="${escapeHtml(sanitizeHref(section.secondaryReport.path))}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="study-button study-button--secondary">
                            ${escapeHtml(section.secondaryReport.label)}
                        </a>
                    `
                    : '';

                return `
                    <article class="study-report">
                        <div class="study-report__content">
                            <p class="section-eyebrow">${escapeHtml(section.eyebrow)}</p>
                            <h2 class="study-report__title">${escapeHtml(section.title)}</h2>
                            <p class="study-report__summary">${escapeHtml(section.summary)}</p>
                            <ul class="study-report__list">
                                ${section.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
                            </ul>
                            <div class="study-report__results">
                                ${section.resultCards
                                    .map(
                                        (card) => `
                                            <div class="study-result-card">
                                                <h3>${escapeHtml(card.title)}</h3>
                                                <p>${escapeHtml(card.text)}</p>
                                            </div>
                                        `
                                    )
                                    .join('')}
                            </div>
                            <div class="study-report__actions">
                                <a href="${escapeHtml(sanitizeHref(section.primaryReport.path))}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="study-button">
                                    ${escapeHtml(section.primaryReport.label)}
                                </a>
                                ${secondaryReportMarkup}
                            </div>
                        </div>
                        <div class="study-report__viewer">
                            <div class="study-frame-shell">
                                <iframe
                                    class="study-frame"
                                    src="${escapeHtml(sanitizeSrc(section.embedPath))}"
                                    title="${escapeHtml(section.title)} PDF"
                                    loading="lazy"
                                    referrerpolicy="no-referrer"
                                ></iframe>
                            </div>
                        </div>
                    </article>
                `;
            })
            .join('')
    );
    setText('#studies-takeaways-title', learningStudies.takeaways.title);
    setHtml(
        '#studies-takeaways-grid',
        learningStudies.takeaways.items
            .map(
                (item) => `
                    <div class="takeaway-card">
                        <h3>${escapeHtml(item.title)}</h3>
                        <p>${escapeHtml(item.text)}</p>
                    </div>
                `
            )
            .join('')
    );
    setText('#studies-roadmap-title', learningStudies.roadmap.title);
    setHtml(
        '#studies-roadmap-grid',
        learningStudies.roadmap.items
            .map(
                (item) => `
                    <div class="roadmap-card roadmap-card--${escapeHtml(item.state)}">
                        <div class="roadmap-card__top">
                            <span class="roadmap-card__state">${escapeHtml(item.badge)}</span>
                            <span class="roadmap-card__index">${escapeHtml(item.index)}</span>
                        </div>
                        <h3>${escapeHtml(item.title)}</h3>
                        <p>${escapeHtml(item.text)}</p>
                    </div>
                `
            )
            .join('')
    );
}

function renderResearchBlock(block) {
    if (block.type === 'paragraph') {
        return `<p class="research-text">${escapeHtml(block.text)}</p>`;
    }

    if (block.type === 'subtitle') {
        return `<h3 class="research-subtitle">${escapeHtml(block.text)}</h3>`;
    }

    if (block.type === 'highlight') {
        const style = block.variant === 'impact'
            ? ' style="margin-top: 60px;"'
            : '';
        const innerStyle = block.variant === 'impact'
            ? ' style="margin: 0; color: var(--text-primary); font-size: 1.1rem;"'
            : '';

        return `
            <div class="highlight-box"${style}>
                <p${innerStyle}>
                    <strong>${escapeHtml(block.title)}</strong> ${escapeHtml(block.text)}
                </p>
            </div>
        `;
    }

    if (block.type === 'algorithm') {
        return `
            <div class="algorithm-box">
                <h4 style="color: var(--accent-color); font-size: 1.5rem; margin-bottom: 20px;">${escapeHtml(block.title)}</h4>
                <p class="research-text" style="color: var(--text-primary);">
                    ${escapeHtml(block.intro)}
                </p>
                <div class="algorithm-steps">
                    ${block.steps
                        .map(
                            (step, index) => `
                                <div class="algorithm-step">
                                    <span class="step-number">${index + 1}</span>
                                    <strong style="color: var(--text-primary);">${escapeHtml(step.label)}</strong>
                                    <span style="color: var(--text-secondary);"> ${escapeHtml(step.text)}</span>
                                </div>
                            `
                        )
                        .join('')}
                </div>
                <div class="highlight-box" style="margin-top: 30px; background: rgba(6, 182, 212, 0.1); border-color: var(--accent-color);">
                    <strong style="color: var(--accent-color);">${escapeHtml(block.challengeTitle)}</strong>
                    <p style="margin-top: 15px; color: var(--text-secondary);">
                        ${escapeHtml(block.challengeText)}
                    </p>
                </div>
            </div>
        `;
    }

    if (block.type === 'findings') {
        return `
            <h3 class="research-subtitle">${escapeHtml(block.title)}</h3>
            <div class="key-findings">
                ${block.items
                    .map(
                        (item) => `
                            <div class="finding-card">
                                <div class="finding-number">${escapeHtml(item.number)}</div>
                                <div class="finding-title">${escapeHtml(item.title)}</div>
                                <div class="finding-text">${escapeHtml(item.text)}</div>
                            </div>
                        `
                    )
                    .join('')}
            </div>
        `;
    }

    if (block.type === 'bullets') {
        return `
            <ul class="research-text" style="margin-left: 30px;">
                ${block.items
                    .map((item) => `<li style="margin-bottom: 15px;">${escapeHtml(item)}</li>`)
                    .join('')}
            </ul>
        `;
    }

    if (block.type === 'cards') {
        return `
            <div class="key-findings">
                ${block.items
                    .map(
                        (item) => `
                            <div class="finding-card">
                                <div class="finding-title">${escapeHtml(item.title)}</div>
                                <div class="finding-text">${escapeHtml(item.text)}</div>
                            </div>
                        `
                    )
                    .join('')}
            </div>
        `;
    }

    return '';
}

function renderDelaunayContent() {
    const { global, delaunay } = siteContent;

    document.title = delaunay.title;
    setText('#delaunay-back-label', delaunay.backLabel);
    setAttribute('#delaunay-back-link', 'href', global.portfolioPath);
    setText('#delaunay-title', delaunay.header.title);
    setText('#delaunay-authors', delaunay.header.authors);
    setText('#delaunay-subtitle', delaunay.header.subtitle);
    setHtml('#delaunay-tech-tags', renderTags(delaunay.header.techTags, 'tech-tag'));
    setText('#delaunay-demo-title', delaunay.interactiveDemo.title);
    setHtml(
        '#delaunay-demo-texts',
        delaunay.interactiveDemo.paragraphs
            .map((paragraph) => `<p class="info-text">${escapeHtml(paragraph)}</p>`)
            .join('')
    );
    setText('#delaunay-research-title', delaunay.research.title);
    setHtml(
        '#delaunay-research-body',
        delaunay.research.blocks.map(renderResearchBlock).join('')
    );
    setText('#delaunay-pdf-title', delaunay.pdf.title);
    setText('#delaunay-pdf-description', delaunay.pdf.description);
    setText('#delaunay-pdf-button', delaunay.pdf.buttonLabel);
    setAttribute('#delaunay-pdf-link', 'href', delaunay.pdf.path);
    setAttribute('#delaunay-pdf-frame', 'src', delaunay.pdf.path);
}

export {
    renderDelaunayContent,
    renderLearningStudiesContent,
    renderPortfolioContent,
    renderRainContent
};

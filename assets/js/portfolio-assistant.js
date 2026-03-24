import siteContent from '../content/site-content.json';

const { global, home } = siteContent;

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function normalizeText(value) {
    return value.toLowerCase().replace(/\s+/g, ' ').trim();
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

function projectMatches(project, normalizedPrompt) {
    const title = normalizeText(project.title);
    const keywordGroups = {
        'rain prediction ml pipeline': ['rain', 'weather', 'streamlit', 'mlflow', 'dvc', 'rainfall'],
        'machine learning evaluation & optimization study': ['supervised learning', 'optimization', 'regularization', 'adult', 'wine', 'cs 7641', 'weight decay', 'adam', 'svm', 'knn', 'reinforcement learning', 'unsupervised learning', 'evaluation study', 'optimization study'],
        'autonomous youtube content engine': ['youtube', 'content engine', 'ffmpeg', 'gpt-5.2', 'voiceover', 'video pipeline', 'youtube data api']
    };

    if (title.includes(normalizedPrompt) || normalizedPrompt.includes(title)) {
        return true;
    }

    const matchedKeywords = keywordGroups[title] || [];
    return matchedKeywords.some((keyword) => normalizedPrompt.includes(keyword));
}

function experienceMatches(experience, normalizedPrompt) {
    const keywordGroups = {
        delaunay: ['delaunay', 'triangulation', 'computational geometry', 'rhomboid tiling', 'paraboloid', 'mesh refinement'],
        metric: ['metric geometry', 'gromov-hausdorff', 'quotient spaces', 'arxiv', 'uf math symposium', 'group actions']
    };

    const figureKey = experience.figure || '';
    return (keywordGroups[figureKey] || []).some((keyword) => normalizedPrompt.includes(keyword));
}

function buildProjectResponse(project) {
    const metrics = project.metrics.length
        ? `
            <p><strong>Signals:</strong> ${project.metrics
                .map((metric) => `${escapeHtml(metric.value)} ${escapeHtml(metric.label)}`)
                .join(' · ')}</p>
        `
        : '';

    return `
        <p><strong>${escapeHtml(project.title)}</strong> is framed as ${escapeHtml(project.summary.toLowerCase())}</p>
        <ul>
            ${project.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}
        </ul>
        ${metrics}
        <p><a href="${escapeHtml(sanitizeHref(project.action.href))}">Open related project</a></p>
    `;
}

function buildProjectsOverviewResponse() {
    return `
        <p>These are the three projects currently foregrounded on the site:</p>
        <ul>
            ${home.projects.items
                .map((project) => `<li><strong>${escapeHtml(project.title)}:</strong> ${escapeHtml(project.summary)}</li>`)
                .join('')}
        </ul>
    `;
}

function buildExperienceItemResponse(experience) {
    return `
        <p><strong>${escapeHtml(experience.title)}</strong> at ${escapeHtml(experience.company)} (${escapeHtml(experience.date)})</p>
        <p>${escapeHtml(experience.summary)}</p>
        <ul>
            ${experience.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}
        </ul>
        <p><a href="${escapeHtml(sanitizeHref(experience.action.href))}">Open related research</a></p>
    `;
}

function buildSkillsResponse(normalizedPrompt) {
    const category = home.skills.categories.find((item) => {
        const title = normalizeText(item.title);
        return normalizedPrompt.includes(title)
            || item.tags.some((tag) => normalizedPrompt.includes(normalizeText(tag)));
    });

    if (category) {
        return `
            <p><strong>${escapeHtml(category.title)}:</strong></p>
            <p>${category.tags.map((tag) => escapeHtml(tag)).join(' · ')}</p>
        `;
    }

    return `
        <p>Armando's stack covers machine learning, application engineering, and math-heavy problem solving.</p>
        <ul>
            ${home.skills.categories
                .map((item) => `<li><strong>${escapeHtml(item.title)}:</strong> ${item.tags.map((tag) => escapeHtml(tag)).join(', ')}</li>`)
                .join('')}
        </ul>
    `;
}

function buildEducationResponse() {
    return `
        <p>Armando studied <strong>Computer Science and Mathematics</strong> at the University of Florida and is pursuing an <strong>M.S. in Computer Science</strong> at Georgia Tech.</p>
        <ul>
            ${home.about.education
                .map(
                    (item) => `
                        <li><strong>${escapeHtml(item.school)}</strong> · ${escapeHtml(item.degree)} · ${escapeHtml(item.date)}</li>
                    `
                )
                .join('')}
        </ul>
    `;
}

function buildContactResponse() {
    return `
        <p>The fastest path is <a href="${escapeHtml(sanitizeHref(global.linkedinUrl))}" target="_blank" rel="noopener noreferrer">LinkedIn</a>.</p>
        <p>You can also email <a href="${escapeHtml(sanitizeHref(`mailto:${global.email}`))}">${escapeHtml(global.email)}</a>, browse <a href="${escapeHtml(sanitizeHref(global.githubUrl))}" target="_blank" rel="noopener noreferrer">GitHub</a>, or open the <a href="${escapeHtml(sanitizeHref(global.resumePath))}" target="_blank" rel="noopener noreferrer">resume</a>.</p>
    `;
}

function buildExperienceResponse() {
    return `
        <p>The portfolio currently highlights two research experiences at the University of Florida, spanning <strong>October 2023 to May 2025</strong>.</p>
        <ul>
            ${home.experience.items
                .map(
                    (item) => `
                        <li><strong>${escapeHtml(item.date)}:</strong> ${escapeHtml(item.summary)}</li>
                    `
                )
                .join('')}
        </ul>
        <p>The pattern is strong on algorithmic work, experimentation, visualization, and translating technical ideas into working systems.</p>
    `;
}

function buildAboutResponse() {
    return `
        <p>${escapeHtml(home.about.paragraphs[0])}</p>
        <p>${escapeHtml(home.about.paragraphs[1])}</p>
    `;
}

function buildRolesResponse() {
    return `
        <p>Based on the portfolio, Armando is targeting roles where machine learning, software engineering, and rigorous problem-solving all matter.</p>
        <p>${escapeHtml(home.contact.description)}</p>
    `;
}

function buildFallbackResponse() {
    return `
        <p>I can help with questions about Armando's machine learning projects, research experience, education, and contact details.</p>
        <p>Try one of the suggested prompts or ask directly about a project.</p>
    `;
}

function generateAssistantResponse(prompt) {
    const normalizedPrompt = normalizeText(prompt);

    if (
        normalizedPrompt.includes('project')
        || normalizedPrompt.includes('projects')
        || normalizedPrompt.includes('built')
    ) {
        const matchedProjectByProjectPrompt = home.projects.items.find((project) => projectMatches(project, normalizedPrompt));
        if (matchedProjectByProjectPrompt) {
            return buildProjectResponse(matchedProjectByProjectPrompt);
        }

        return buildProjectsOverviewResponse();
    }

    const matchedProject = home.projects.items.find((project) => projectMatches(project, normalizedPrompt));
    if (matchedProject) {
        return buildProjectResponse(matchedProject);
    }

    const matchedExperience = home.experience.items.find((experience) => experienceMatches(experience, normalizedPrompt));
    if (matchedExperience) {
        return buildExperienceItemResponse(matchedExperience);
    }

    if (
        normalizedPrompt.includes('contact')
        || normalizedPrompt.includes('email')
        || normalizedPrompt.includes('linkedin')
        || normalizedPrompt.includes('github')
        || normalizedPrompt.includes('resume')
        || normalizedPrompt.includes('reach')
    ) {
        return buildContactResponse();
    }

    if (
        normalizedPrompt.includes('who is')
        || normalizedPrompt.includes('about')
        || normalizedPrompt.includes('background')
        || normalizedPrompt.includes('30 seconds')
        || normalizedPrompt.includes('introduce')
    ) {
        return buildAboutResponse();
    }

    if (
        normalizedPrompt.includes('experience')
        || normalizedPrompt.includes('how much')
        || normalizedPrompt.includes('research')
        || normalizedPrompt.includes('worked on')
    ) {
        return buildExperienceResponse();
    }

    if (
        normalizedPrompt.includes('skill')
        || normalizedPrompt.includes('language')
        || normalizedPrompt.includes('framework')
        || normalizedPrompt.includes('stack')
        || normalizedPrompt.includes('python')
        || normalizedPrompt.includes('machine learning')
    ) {
        return buildSkillsResponse(normalizedPrompt);
    }

    if (
        normalizedPrompt.includes('study')
        || normalizedPrompt.includes('education')
        || normalizedPrompt.includes('georgia tech')
        || normalizedPrompt.includes('university of florida')
        || normalizedPrompt.includes('degree')
    ) {
        return buildEducationResponse();
    }

    if (
        normalizedPrompt.includes('role')
        || normalizedPrompt.includes('target')
        || normalizedPrompt.includes('looking for')
        || normalizedPrompt.includes('hire')
    ) {
        return buildRolesResponse();
    }

    return buildFallbackResponse();
}

function createMessageElement(role, content, { html = false, pending = false } = {}) {
    const message = document.createElement('div');
    message.className = `assistant-widget__message assistant-widget__message--${role}`;

    const row = document.createElement('div');
    row.className = 'assistant-widget__row';

    if (role === 'assistant') {
        const avatar = document.createElement('div');
        avatar.className = 'assistant-widget__avatar';
        avatar.setAttribute('aria-hidden', 'true');
        avatar.textContent = 'AA';
        row.appendChild(avatar);
    }

    const contentContainer = document.createElement('div');
    contentContainer.className = 'assistant-widget__content';

    const meta = document.createElement('div');
    meta.className = 'assistant-widget__meta';
    meta.textContent = role === 'assistant' ? 'ArmandoGPT' : 'You';

    const bubble = document.createElement('div');
    bubble.className = 'assistant-widget__bubble';
    if (pending) {
        bubble.classList.add('assistant-widget__bubble--pending');
    }

    if (html) {
        bubble.innerHTML = content;
    } else {
        bubble.textContent = content;
    }

    contentContainer.append(meta, bubble);
    row.appendChild(contentContainer);
    message.appendChild(row);
    return message;
}

export function initPortfolioAssistant() {
    const messages = document.getElementById('assistant-messages');
    const form = document.getElementById('assistant-form');
    const input = document.getElementById('assistant-input');

    if (!messages || !form || !input) {
        return;
    }

    const scrollMessagesToEnd = () => {
        messages.scrollTop = messages.scrollHeight;
    };

    const appendMessage = (role, content, options = {}) => {
        const messageElement = createMessageElement(role, content, options);
        messages.appendChild(messageElement);
        scrollMessagesToEnd();
        return messageElement;
    };

    const submitPrompt = (prompt) => {
        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt) {
            return;
        }

        appendMessage('user', trimmedPrompt);
        const pendingMessage = appendMessage('assistant', 'Thinking…', { pending: true });

        window.setTimeout(() => {
            pendingMessage.remove();
            appendMessage('assistant', generateAssistantResponse(trimmedPrompt), { html: true });
        }, 350);
    };

    document.addEventListener('click', (event) => {
        const promptButton = event.target.closest('[data-prompt]');
        if (promptButton) {
            const prompt = promptButton.getAttribute('data-prompt');
            if (prompt) {
                submitPrompt(prompt);
            }
            if (promptButton.hasAttribute('data-assistant-focus')) {
                window.setTimeout(() => {
                    input.focus();
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 80);
            }
        }
    });

    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            form.requestSubmit();
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const prompt = input.value;
        input.value = '';
        input.style.height = 'auto';
        submitPrompt(prompt);
    });
}

const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const storedTheme = localStorage.getItem('theme');
const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

let currentTheme = initialTheme;

function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

applyTheme(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function createElement(tagName, text, className) {
  const element = document.createElement(tagName);
  if (text) element.textContent = text;
  if (className) element.className = className;
  return element;
}

function getLinkPreview(url, previewText) {
  if (previewText) return previewText;

  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/^mailto:/, '').replace(/^tel:/, '').replace(/\/$/, '');
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function appendEmphasizedText(container, text, emphasis = []) {
  if (document.documentElement.getAttribute('data-mode') !== 'fun' || !emphasis.length) {
    container.append(document.createTextNode(text));
    return;
  }

  const phrases = [...new Set(emphasis.map((phrase) => phrase.trim()).filter(Boolean))]
    .sort((a, b) => b.length - a.length);

  if (!phrases.length) {
    container.append(document.createTextNode(text));
    return;
  }

  const pattern = new RegExp(`(${phrases.map(escapeRegExp).join('|')})`, 'gi');
  const parts = text.split(pattern);

  parts.forEach((part) => {
    const isMatch = phrases.some((phrase) => phrase.toLowerCase() === part.toLowerCase());
    if (isMatch && part) {
      const mark = document.createElement('mark');
      mark.textContent = part;
      container.append(mark);
    } else {
      container.append(document.createTextNode(part));
    }
  });
}

function renderHighlight(highlight) {
  const item = document.createElement('li');
  const payload = typeof highlight === 'string' ? { text: highlight } : highlight;
  if (!payload || !payload.text) return item;

  let remainingText = payload.text;
  (payload.links || []).forEach((link) => {
    const linkPosition = remainingText.indexOf(link.label);
    if (linkPosition === -1) return;

    item.append(document.createTextNode(remainingText.slice(0, linkPosition)));
    const anchor = createElement('a', link.label);
    anchor.href = link.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener';
    const previewText = getLinkPreview(link.url, link.previewText);
    anchor.dataset.preview = previewText;
    anchor.title = previewText;
    item.append(anchor);
    remainingText = remainingText.slice(linkPosition + link.label.length);
  });

  appendEmphasizedText(item, remainingText, payload.emphasis || []);
  return item;
}

function renderExperience(experience) {
  const container = document.getElementById('experience-list');
  experience.forEach((entry) => {
    entry.roles.forEach((role) => {
      const article = createElement('article', null, 'timeline-item');
      const header = createElement('div', null, 'timeline-header');
      const date = createElement('span', `${role.startDate} – ${role.endDate}`, 'timeline-date');
      if (role.duration) {
        date.title = role.duration;
        date.setAttribute('data-duration', role.duration);
      }
      header.append(
        createElement('h3', role.title),
        date
      );
      article.append(
        header,
        createElement('p', `${entry.company} · ${entry.location}`, 'timeline-org')
      );

      const highlights = createElement('ul', null, 'timeline-list');
      role.highlights.forEach((highlight) => highlights.append(renderHighlight(highlight)));
      article.append(highlights);
      container.append(article);
    });
  });
}

function renderSkills(skills) {
  const container = document.getElementById('skills-list');
  Object.entries(skills).forEach(([category, entries]) => {
    const group = createElement('div', null, 'skill-group');
    group.append(createElement('h3', category === 'technical' ? 'Technical' : 'Product'));
    const list = createElement('ul', null, 'tag-list');
    entries.forEach((skill) => list.append(createElement('li', skill)));
    group.append(list);
    container.append(group);
  });
}

function renderEducation(education) {
  const container = document.getElementById('education-list');
  education.forEach((entry) => {
    const article = createElement('article', null, 'timeline-item');
    const header = createElement('div', null, 'timeline-header');
    header.append(
      createElement('h3', entry.degree),
      createElement('span', entry.dates, 'timeline-date')
    );
    article.append(header, createElement('p', entry.institution, 'timeline-org'));
    if (entry.details?.length) {
      const details = createElement('ul', null, 'timeline-list');
      entry.details.forEach((detail) => details.append(createElement('li', detail)));
      article.append(details);
    }
    container.append(article);
  });
}

function renderContact(contact) {
  const container = document.getElementById('contact-list');
  const links = [
    { label: 'Email', href: `mailto:${contact.email}`, icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 7.2A2.7 2.7 0 0 1 6.2 4.5h11.6a2.7 2.7 0 0 1 2.7 2.7v9.6a2.7 2.7 0 0 1-2.7 2.7H6.2a2.7 2.7 0 0 1-2.7-2.7V7.2Zm2.2-.7 6.3 4.82 6.3-4.82H5.7Zm13.3 2.22-5.76 4.4a1.2 1.2 0 0 1-1.48 0L5.1 8.72v8.08c0 .66.54 1.2 1.2 1.2h11.4c.66 0 1.2-.54 1.2-1.2V8.72Z"/></svg>' },
    { label: 'LinkedIn', href: contact.linkedin.url, icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.1 8.7A1.7 1.7 0 1 1 7.1 5.3a1.7 1.7 0 0 1 0 3.4ZM5.5 10.2h3.2v9.3H5.5v-9.3Zm5.6 0h3.08v1.28h.04c.42-.82 1.46-1.67 3-1.67 3.2 0 3.79 2.11 3.79 4.85v5.84h-3.2v-5.48c0-1.3-.03-2.97-1.81-2.97-1.82 0-2.1 1.42-2.1 2.88v5.57H11.1v-9.3Z"/></svg>' }
  ];

  links.forEach(({ label, href, icon }) => {
    const item = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.setAttribute('aria-label', label);
    anchor.title = label;
    anchor.innerHTML = icon;
    anchor.className = 'icon-link';
    const previewText = getLinkPreview(href);
    anchor.dataset.preview = previewText;
    if (href.startsWith('http')) {
      anchor.target = '_blank';
      anchor.rel = 'noopener';
    }
    item.append(anchor);
    container.append(item);
  });
}

async function loadResume() {
  const response = await fetch(`content/resume.json?cacheBust=${Date.now()}`);
  if (!response.ok) throw new Error(`Unable to load resume data (${response.status})`);
  const resume = await response.json();

  document.title = `${resume.name} — Resume`;
  document.getElementById('hero-name').textContent = resume.name;
  const heroTitleEl = document.getElementById('hero-title');
  if (heroTitleEl) {
    heroTitleEl.textContent = resume.title;
  }
  document.querySelector('.site-footer p').innerHTML =
    `&copy; <span id="year">${new Date().getFullYear()}</span> ${resume.name}. Built with care.`;
  renderExperience(resume.experience);
  renderSkills(resume.skills);
  renderEducation(resume.education);
  renderContact(resume.contact);
}

loadResume().catch((error) => {
  console.error(error);
  const main = document.querySelector('main');
  const notice = createElement('p', 'Resume content could not be loaded. Please try again later.');
  notice.className = 'section-text';
  main.prepend(notice);
});

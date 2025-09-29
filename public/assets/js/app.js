document.addEventListener('DOMContentLoaded', () => {
  // Decide API base dynamically so it works whether the site is served from /, /public, or /frontend
  const metaApi = document.querySelector('meta[name="api-base"]')?.content;
  const API_BASE = metaApi || (() => {
    const path = window.location.pathname || '/';
    const m = path.match(/\/(public|frontend)\//);
    if (m) {
      const idx = path.indexOf(`/${m[1]}/`);
      const prefix = path.slice(0, idx + m[0].length);
      return prefix + 'api/index.php';
    }
    const lastSlash = path.lastIndexOf('/');
    const dir = lastSlash >= 0 ? path.slice(0, lastSlash + 1) : '/';
    return dir + 'api/index.php';
  })();
  // Cache DOM elements
  const yearSpan = document.querySelector('#year');
  const printBtn = document.querySelector('#printBtn');
  const menuButton = document.getElementById('menuButton');
  const menuContent = document.getElementById('menuContent');
  const librarySections = document.querySelectorAll('.library-section');

  // Set current year in footer
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Enable printing
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  // Initialize menu if elements exist
  if (menuButton && menuContent) {
    // Toggle menu
    menuButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      menuContent.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!menuContent.classList.contains('active')) {
        return;
      }
      if (!menuContent.contains(e.target) && !menuButton.contains(e.target)) {
        menuContent.classList.remove('active');
      }
    });

    // Handle menu items
    menuContent.addEventListener('click', function(e) {
      const menuItem = e.target.closest('.menu-item[data-library]');
      if (!menuItem) return;

      if (menuItem.getAttribute('href') === 'admin-login.html') {
        return;
      }

      e.preventDefault();
      const libraryType = menuItem.dataset.library;
      location.hash = '#' + new URLSearchParams({ type: libraryType }).toString();
      menuContent.classList.remove('active');
      
      // Add smooth scroll animation to content area
      setTimeout(() => {
        const contentArea = document.querySelector('.library-sections');
        if (contentArea) {
          contentArea.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100); // Small delay to ensure content is loaded
    });
  }

  // Show sections
  function showLibrary(type) {
    // Hide all sections
    librarySections.forEach(section => {
      section.style.display = 'none';
      section.classList.remove('active');
    });

    // Show selected section
    const current = document.getElementById(`${type}-library`);
    if (current) {
      current.style.display = 'block';
      setTimeout(() => current.classList.add('active'), 0);

      // Load content if needed
      // If a simple page content exists for this section, render it and skip structured loaders
      const simplePageTargets = ['journals', 'publications', 'career'];
      if (simplePageTargets.includes(type)) {
        renderSimplePage(type);
        return;
      }

      if (['books', 'questions', 'resources'].includes(type)) {
        const params = new URLSearchParams(location.hash.slice(1));
        const year = params.get('year');
        const subject = params.get('subject');
        if (subject) {
          loadResources(type, year, subject);
        } else if (year) {
          // Skip subjects for questions - load all resources for the year
          if (type === 'questions') {
            loadQuestionsByYear(type, year);
          } else {
            loadSubjects(type, year);
          }
        } else {
          loadYears(type);
        }
      }
      
      // Add smooth scroll animation to the active section
      setTimeout(() => {
        current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest' 
        });
      }, 50); // Small delay to ensure content is rendered
    }

    // Update menu states
    document.querySelectorAll('.menu-item[data-library]').forEach(item => {
      item.classList.toggle('active', item.dataset.library === type);
    });
  }

  // Render simple page content editable by admin (journals, career)
  async function renderSimplePage(slug) {
    const container = document.getElementById(`${slug}-content`);
    if (!container) return;
    container.innerHTML = `
      <div class="card" style="padding:1.25rem;">
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    `;
    try {
      const res = await fetch(`${API_BASE}?action=get_page_content&slug=${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      const data = await res.json();
      const html = (data && data.html) ? data.html : '<p class="muted">Content for this section will be displayed here.</p>';
      container.innerHTML = `<div class="card" style="padding:1.25rem;">${html}</div>`;
    } catch (e) {
      console.error('Simple page load error:', e);
      container.innerHTML = `<div class="card" style="padding:1.25rem;"><p class="error">Failed to load content.</p></div>`;
    }
  }

  function loadYears(type) {
    const content = document.getElementById(`${type}-content`);
    if (!content) return;

    content.innerHTML = `
      <div class="section-header">
        <h2>Select Year</h2>
        <p class="muted">Choose your Pharm D year to continue</p>
      </div>
      <div class="grid"></div>
    `;

    const grid = content.querySelector('.grid');
    if (!grid) return;

    // Create year buttons
    for (let i = 1; i <= 6; i++) {
      const btn = document.createElement('button');
      btn.className = 'year-btn';
      btn.dataset.yearId = i;
      btn.innerHTML = `
        <div class="year-icon">${i}</div>
        <div class="content">
          <div class="title">Pharm D - ${i}${
            i === 1 ? 'st' : 
            i === 2 ? 'nd' : 
            i === 3 ? 'rd' : 'th'
          } Year</div>
        </div>
        <div class="arrow">→</div>
      `;

      btn.addEventListener('click', () => {
        location.hash = '#' + new URLSearchParams({
          type: type,
          year: i
        }).toString();
      });
      grid.appendChild(btn);
    }
  }

  async function loadSubjects(type, year) {
    const content = document.getElementById(`${type}-content`);
    if (!content) return;

    // Show loading state
    content.innerHTML = `
      <div class="actions" style="margin-bottom:1rem;">
        <button class="btn ghost" id="backToYears">&larr; Back to Years</button>
      </div>
      <div class="section-header">
        <h2>Select Subject</h2>
        <p class="muted">Choose a subject to view ${type}</p>
      </div>
      <div class="grid">
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading subjects...</p>
        </div>
      </div>
    `;

    // Add back button handler
    content.querySelector('#backToYears').addEventListener('click', () => {
      location.hash = '#' + new URLSearchParams({ type }).toString();
    });

    const grid = content.querySelector('.grid');
    if (!grid) return;

    try {
      // Build URL using the dynamic API base
      const url = `${API_BASE}?action=list_subjects&year_id=${encodeURIComponent(year)}`;
      // Fetch subjects from API
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) {
        throw new Error(`Failed to fetch subjects (${response.status}) at ${url}`);
      }
      const subjects = await response.json();
      
      // Clear loading state
      grid.innerHTML = '';

      // Subject emoji mapping
      const emojiMap = {
        'Human Anatomy and Physiology': '❤️',
        'Medicinal Biochemistry': '🧪',
        'Pharmaceutical Inorganic Chemistry': '⚗️',
        'Pharmaceutics': '💊',
        'Pathophysiology': '🩺',
        'Pharmaceutical Microbiology': '🦠',
        'Pharmaceutical Organic Chemistry': '🧫',
        'Clinical Pharmacy': '🏥',
        'Pharmacology': '💉',
        'Pharmacy Practice': '🏪',
        'Pharmacognosy': '🌿',
        'Community Pharmacy': '🏬',
        'Hospital Pharmacy': '🏨',
        'Biostatistics': '📊',
        'Pharmaceutical Biotechnology': '🧬',
        'Pharmacotherapeutics': '💊',
        'Clinical Research': '🔬',
        'Pharmacovigilance': '🛡️',
        'Clinical Toxicology': '☠️',
        'Pharmaceutical Analysis': '📏'
      };

      if (subjects.length === 0) {
        grid.innerHTML = '<p class="muted">No subjects found for this year.</p>';
        return;
      }

      // Create subject buttons
      subjects.forEach(subject => {
        const btn = document.createElement('button');
        btn.className = 'subject-btn';
        btn.dataset.subjectId = subject.id;
        btn.innerHTML = `
          <div style="font-size:1.5rem;display:inline-block;margin-right:0.5rem;vertical-align:middle;">
            ${emojiMap[subject.name] || '📚'}
          </div>
          <span>${subject.name}</span>
        `;

        btn.addEventListener('click', () => {
          location.hash = '#' + new URLSearchParams({
            type,
            year,
            subject: subject.id
          }).toString();
        });

        grid.appendChild(btn);
      });

    } catch (error) {
      console.error('Error loading subjects:', error);
      grid.innerHTML = `
        <p class="error">Failed to load subjects. ${error?.message || ''}</p>
      `;
    }
  }

  function mapResourceType(type) {
    switch (type) {
      case 'books': return 'book';
      case 'journals': return 'journal';
      case 'publications': return 'publication';
      case 'questions': return 'question';
      case 'career': return 'career';
      case 'resources': return 'resource';
      default: return 'resource';
    }
  }

  async function loadResources(type, year, subjectId) {
    const content = document.getElementById(`${type}-content`);
    if (!content) return;

    // Show loading state with back controls
    content.innerHTML = `
      <div class="actions" style="margin-bottom:1rem;display:flex;gap:.5rem;flex-wrap:wrap;">
        <button class="btn ghost" id="backToSubjects">&larr; Back to Subjects</button>
        <button class="btn ghost" id="backToYears">&larr; Back to Years</button>
      </div>
      <div class="section-header">
        <h2>${type.charAt(0).toUpperCase() + type.slice(1)} Resources</h2>
        <p class="muted">Browse resources for the selected subject</p>
      </div>
      <div class="grid">
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading resources...</p>
        </div>
      </div>
    `;

    // Back button handlers
    content.querySelector('#backToSubjects').addEventListener('click', () => {
      location.hash = '#' + new URLSearchParams({ type, year }).toString();
    });
    content.querySelector('#backToYears').addEventListener('click', () => {
      location.hash = '#' + new URLSearchParams({ type }).toString();
    });

    const grid = content.querySelector('.grid');
    if (!grid) return;

    try {
      const resourceType = mapResourceType(type);
      const url = `${API_BASE}?action=list_resources&subject_id=${encodeURIComponent(subjectId)}&resource_type=${encodeURIComponent(resourceType)}`;
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) {
        throw new Error(`Failed to fetch resources (${response.status}) at ${url}`);
      }
      const resources = await response.json();

      grid.innerHTML = '';

      if (!resources || resources.length === 0) {
        grid.innerHTML = '<p class="muted">No resources found for this subject.</p>';
        return;
      }

      const resolveLink = (r) => {
        if (r.external_url) return r.external_url;
        if (r.file_path) {
          if (/^https?:\/\//i.test(r.file_path)) return r.file_path;
          return r.file_path.startsWith('/') ? r.file_path : '/' + r.file_path;
        }
        return null;
      };

      resources.forEach(r => {
        const link = resolveLink(r);
        const item = document.createElement('div');
        item.className = 'card';
        item.style.padding = '1rem';
        item.innerHTML = `
          <div class="title" style="font-weight:600;margin-bottom:.25rem;">${r.title}</div>
          <div class="muted" style="margin-bottom:.75rem;">${r.description || ''}</div>
          <div class="actions" style="display:flex;gap:.5rem;">
            ${link ? `<a class="btn" href="${link}" target="_blank" rel="noopener">View</a>` : '<span class="muted">No link</span>'}
          </div>
        `;
        grid.appendChild(item);
      });
    } catch (error) {
      console.error('Error loading resources:', error);
      grid.innerHTML = `<p class="error">Failed to load resources. ${error?.message || ''}</p>`;
    }
  }

  // Load questions directly by year (skip subjects)
  async function loadQuestionsByYear(type, year) {
    const content = document.getElementById(`${type}-content`);
    if (!content) return;

    // Show loading state with back controls
    content.innerHTML = `
      <div class="actions" style="margin-bottom:1rem;display:flex;gap:.5rem;flex-wrap:wrap;">
        <button class="btn ghost" id="backToYears">&larr; Back to Years</button>
      </div>
      <div class="section-header">
        <h2>Previous Year Questions</h2>
        <p class="muted">All question papers for the selected year</p>
      </div>
      <div class="grid">
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading questions...</p>
        </div>
      </div>
    `;

    // Back button handler
    content.querySelector('#backToYears').addEventListener('click', () => {
      location.hash = '#' + new URLSearchParams({ type }).toString();
    });

    const grid = content.querySelector('.grid');
    if (!grid) return;

    try {
      // Load questions directly by year
      const resourcesUrl = `${API_BASE}?action=list_resources_by_year&year_id=${year}&resource_type=question`;
      const resourcesResponse = await fetch(resourcesUrl, { credentials: 'include' });
      if (!resourcesResponse.ok) {
        throw new Error(`Failed to fetch resources (${resourcesResponse.status})`);
      }
      const questions = await resourcesResponse.json();

      grid.innerHTML = '';

      if (questions.length === 0) {
        grid.innerHTML = '<p class="muted">No question papers found for this year.</p>';
        return;
      }

      const resolveLink = (r) => {
        if (r.external_url) return r.external_url;
        if (r.file_path) {
          if (/^https?:\/\//i.test(r.file_path)) return r.file_path;
          return r.file_path.startsWith('/') ? r.file_path : '/' + r.file_path;
        }
        return null;
      };

      questions.forEach(r => {
        const link = resolveLink(r);
        const item = document.createElement('div');
        item.className = 'card';
        item.style.padding = '1rem';
        item.innerHTML = `
          <div class="title" style="font-weight:600;margin-bottom:.25rem;">${r.title}</div>
          ${r.subject_name ? `<div class="muted" style="margin-bottom:.25rem;font-size:0.875rem;">Subject: ${r.subject_name}</div>` : ''}
          <div class="muted" style="margin-bottom:.75rem;">${r.description || ''}</div>
          <div class="actions" style="display:flex;gap:.5rem;">
            ${link ? `<a class="btn" href="${link}" target="_blank" rel="noopener">View</a>` : '<span class="muted">No link</span>'}
          </div>
        `;
        grid.appendChild(item);
      });
    } catch (error) {
      console.error('Error loading questions:', error);
      grid.innerHTML = `<p class="error">Failed to load questions. ${error?.message || ''}</p>`;
    }
  }

  // Load career opportunities directly
  async function loadCareerOpportunities() {
    const content = document.getElementById('career-content');
    if (!content) return;

    content.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <div>Loading career opportunities...</div>
      </div>
    `;

    try {
      const response = await fetch(`${API_BASE}?action=list_resources&resource_type=career`);
      const careers = await response.json();

      const careerGrid = document.getElementById('careerGrid');
      if (!careerGrid) return;

      if (careers && careers.length > 0) {
        careerGrid.innerHTML = careers.map(career => `
          <div class="resource-card career-card">
            <div class="resource-header">
              <h3>${career.title}</h3>
              <div class="company">${career.company_name || 'Company'}</div>
            </div>
            <div class="resource-meta">
              <span class="location">📍 ${career.location || 'Location not specified'}</span>
              <span class="deadline">📅 Apply by: ${career.deadline_date || 'No deadline specified'}</span>
            </div>
            <div class="resource-content">
              <p class="job-description">${career.description || 'No description available'}</p>
              ${career.requirements ? `<div class="requirements"><strong>Requirements:</strong> ${career.requirements}</div>` : ''}
              ${career.salary_range ? `<div class="salary"><strong>Salary:</strong> ${career.salary_range}</div>` : ''}
            </div>
            <div class="resource-actions">
              ${career.application_link ? 
                `<a href="${career.application_link}" target="_blank" class="btn primary" rel="noopener noreferrer">Apply Now</a>` : 
                '<span class="btn disabled">Application link not available</span>'
              }
            </div>
          </div>
        `).join('');
      } else {
        careerGrid.innerHTML = `
          <div class="no-resources">
            <div class="icon">💼</div>
            <h3>No Career Opportunities Available</h3>
            <p>Check back later for new job openings and career opportunities.</p>
          </div>
        `;
      }

      content.innerHTML = `<div id="careerGrid" class="grid">${careerGrid.innerHTML}</div>`;
    } catch (error) {
      console.error('Error loading career opportunities:', error);
      content.innerHTML = `
        <div class="error-state">
          <div class="icon">⚠️</div>
          <h3>Failed to Load Career Opportunities</h3>
          <p>Please try again later or contact support if the problem persists.</p>
        </div>
      `;
    }
  }

  // Handle hash changes
  function handleHashChange() {
    const params = new URLSearchParams(location.hash.slice(1));
    showLibrary(params.get('type') || 'home');
  }

  // Set up hash change listener
  window.addEventListener('hashchange', handleHashChange);
  
  // Initial render
  handleHashChange();
});
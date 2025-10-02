document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const headerEl = document.querySelector('.header');
  const navToggle = document.querySelector('.header__toggle');
  const navEl = document.getElementById('primary-navigation');

  if (headerEl && navToggle && navEl) {
    const closeMenu = () => {
      headerEl.classList.remove('header--menu-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      headerEl.classList.toggle('header--menu-open', !isExpanded);
    });

    navEl.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 720px)').matches) {
          closeMenu();
        }
      });
    });

    const mobileQuery = window.matchMedia('(max-width: 720px)');
    const handleBreakpointChange = (event) => {
      if (!event.matches) {
        closeMenu();
      }
    };

    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', handleBreakpointChange);
    } else {
      mobileQuery.addListener(handleBreakpointChange);
    }
  }

  const breadcrumbEl = document.getElementById('breadcrumb');
  if (breadcrumbEl) {
    const HOME_LABEL = 'Home';
    const sections = [
      { id: 'about', label: 'About' },
      { id: 'team', label: 'Team' },
      { id: 'focus', label: 'Focus Areas' },
      { id: 'transparency', label: 'Transparency' },
      { id: 'connect', label: 'Connect' }
    ];

    const setBreadcrumb = (label) => {
      if (label === HOME_LABEL) {
        breadcrumbEl.textContent = HOME_LABEL;
        return;
      }

      breadcrumbEl.innerHTML = `${HOME_LABEL} <span class="breadcrumb__divider" aria-hidden="true">›</span> <span class="breadcrumb__current">${label}</span>`;
    };

    setBreadcrumb(HOME_LABEL);

    const observerTargets = sections
      .map(({ id, label }) => {
        const el = document.getElementById(id);
        if (el) {
          el.dataset.breadcrumbLabel = label;
        }
        return { el, label };
      })
      .filter(({ el }) => Boolean(el));

    if (observerTargets.length && 'IntersectionObserver' in window) {
      let currentLabel = HOME_LABEL;

      const observer = new IntersectionObserver(
        (entries) => {
          const visibleEntry = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

          if (!visibleEntry) {
            if (currentLabel !== HOME_LABEL && window.scrollY < 120) {
              currentLabel = HOME_LABEL;
              setBreadcrumb(HOME_LABEL);
            }
            return;
          }

          const { breadcrumbLabel } = visibleEntry.target.dataset;
          if (breadcrumbLabel && breadcrumbLabel !== currentLabel) {
            currentLabel = breadcrumbLabel;
            setBreadcrumb(breadcrumbLabel);
          }
        },
        {
          root: null,
          threshold: 0.45
        }
      );

      observerTargets.forEach(({ el }) => observer.observe(el));
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const headerEl = document.querySelector('.header');
  const navToggle = document.querySelector('.header__toggle');
  const navEl = document.getElementById('primary-navigation');
  const content = window.siteContent || null;

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el && typeof text === 'string') {
      el.textContent = text;
    }
  };

  const setHTML = (id, html) => {
    const el = document.getElementById(id);
    if (el && typeof html === 'string') {
      el.innerHTML = html;
    }
  };

  const renderBrand = (brand) => {
    if (!brand) return;
    setText('brand-name', brand.name || '');
    const logoEl = document.getElementById('brand-logo');
    if (logoEl) {
      if (brand.logoAlt) {
        logoEl.alt = brand.logoAlt;
      }
      if (brand.logoSrc) {
        logoEl.src = brand.logoSrc;
      }
    }
    const ctaEl = document.getElementById('header-cta');
    if (ctaEl) {
      ctaEl.textContent = brand.ctaLabel || '';
      ctaEl.type = 'button';
      if (brand.ctaHref) {
        ctaEl.onclick = (event) => {
          event.preventDefault();
          const targetId = brand.ctaHref.startsWith('#') ? brand.ctaHref.slice(1) : brand.ctaHref;
          const sectionEl = document.getElementById(targetId);
          if (sectionEl && typeof sectionEl.scrollIntoView === 'function') {
            sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else if (brand.ctaHref.startsWith('#')) {
            window.location.hash = brand.ctaHref;
          } else {
            window.location.href = brand.ctaHref;
          }
        };
      } else {
        ctaEl.onclick = null;
      }
    }
  };

  const renderNav = (navItems) => {
    if (!navEl || !Array.isArray(navItems)) return;
    navEl.innerHTML = '';
    navItems.forEach(({ href, label }) => {
      if (!href || !label) return;
      const linkEl = document.createElement('a');
      linkEl.href = href;
      linkEl.textContent = label;
      navEl.appendChild(linkEl);
    });
  };

  const renderHero = (hero) => {
    if (!hero) return;
    setText('hero-eyebrow', hero.eyebrow || '');
    setText('hero-title', hero.title || '');
    setText('hero-description', hero.description || '');

    const heroMetaEl = document.getElementById('hero-meta');
    if (heroMetaEl) {
      heroMetaEl.innerHTML = '';
      (hero.meta || []).forEach(({ label, value }) => {
        if (!label || !value) return;
        const metaBlock = document.createElement('div');
        const labelEl = document.createElement('span');
        labelEl.className = 'meta__label';
        labelEl.textContent = label;
        const valueEl = document.createElement('span');
        valueEl.className = 'meta__value';
        valueEl.textContent = value;
        metaBlock.appendChild(labelEl);
        metaBlock.appendChild(valueEl);
        heroMetaEl.appendChild(metaBlock);
      });
    }

    const heroActionsEl = document.getElementById('hero-actions');
    if (heroActionsEl) {
      heroActionsEl.innerHTML = '';
      const variantToClass = {
        primary: 'btn btn--primary',
        ghost: 'btn btn--ghost'
      };
      (hero.actions || []).forEach(({ href, label, variant }) => {
        if (!href || !label) return;
        const actionEl = document.createElement('a');
        actionEl.href = href;
        actionEl.className = variantToClass[variant] || 'btn';
        actionEl.textContent = label;
        heroActionsEl.appendChild(actionEl);
      });
    }

    const heroVisualEl = document.getElementById('hero-visual');
    if (heroVisualEl) {
      heroVisualEl.innerHTML = '';
      if (hero.video && hero.video.src) {
        const videoWrapper = document.createElement('div');
        videoWrapper.className = 'hero__video';
        const iframe = document.createElement('iframe');
        iframe.src = hero.video.src;
        iframe.title = hero.video.title || '';
        const allowValue = hero.video.allow || 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allow = allowValue;
        iframe.setAttribute('allow', allowValue);
        const referrerPolicyValue = hero.video.referrerPolicy || 'strict-origin-when-cross-origin';
        iframe.referrerPolicy = referrerPolicyValue;
        iframe.setAttribute('referrerpolicy', referrerPolicyValue);
        iframe.setAttribute('frameborder', '0');
        iframe.allowFullscreen = true;
        iframe.setAttribute('allowfullscreen', '');
        videoWrapper.appendChild(iframe);
        heroVisualEl.appendChild(videoWrapper);
      } else if (hero.imageSrc) {
        const imgEl = document.createElement('img');
        imgEl.src = hero.imageSrc;
        imgEl.alt = hero.imageAlt || '';
        heroVisualEl.appendChild(imgEl);
      }
    }
  };

  const renderStats = (stats) => {
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;
    statsSection.innerHTML = '';
    (stats || []).forEach(({ heading, body }) => {
      if (!heading || !body) return;
      const article = document.createElement('article');
      const headingEl = document.createElement('h3');
      headingEl.textContent = heading;
      const bodyEl = document.createElement('p');
      bodyEl.textContent = body;
      article.appendChild(headingEl);
      article.appendChild(bodyEl);
      statsSection.appendChild(article);
    });
  };

  const renderPrograms = (programs) => {
    if (!programs) return;
    setText('programs-heading', programs.heading || '');
    setText('programs-intro', programs.intro || '');

    const gridEl = document.getElementById('programs-grid');
    if (!gridEl) return;
    gridEl.innerHTML = '';
    (programs.items || []).forEach(({ icon, iconAlt, title, description, points }) => {
      if (!title || !description) return;
      const article = document.createElement('article');

      if (icon) {
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'grid__icon';
        const iconEl = document.createElement('img');
        iconEl.src = icon;
        iconEl.alt = iconAlt || '';
        iconWrapper.appendChild(iconEl);
        article.appendChild(iconWrapper);
      }

      const titleEl = document.createElement('h3');
      titleEl.textContent = title;
      const descriptionEl = document.createElement('p');
      descriptionEl.textContent = description;
      article.appendChild(titleEl);
      article.appendChild(descriptionEl);

      if (Array.isArray(points) && points.length) {
        const listEl = document.createElement('ul');
        points.forEach((point) => {
          if (!point) return;
          const listItem = document.createElement('li');
          listItem.textContent = point;
          listEl.appendChild(listItem);
        });
        article.appendChild(listEl);
      }

      gridEl.appendChild(article);
    });
  };

  const renderObjects = (objects) => {
    if (!objects) return;
    setText('objects-heading', objects.heading || '');
    setText('objects-intro', objects.intro || '');

    const listContainer = document.getElementById('objects-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';
    const items = Array.isArray(objects.items) ? objects.items : [];
    const midPoint = Math.ceil(items.length / 2) || 1;
    const columns = [items.slice(0, midPoint), items.slice(midPoint)];
    columns.forEach((columnItems) => {
      if (!columnItems.length) return;
      const ul = document.createElement('ul');
      columnItems.forEach((text) => {
        if (!text) return;
        const li = document.createElement('li');
        li.textContent = text;
        ul.appendChild(li);
      });
      listContainer.appendChild(ul);
    });
  };

  const renderTrustees = (trustees) => {
    if (!trustees) return;
    setText('trustees-heading', trustees.heading || '');
    setText('trustees-intro', trustees.intro || '');

    const gridEl = document.getElementById('trustees-grid');
    if (!gridEl) return;
    gridEl.innerHTML = '';
    const members = Array.isArray(trustees.members) ? trustees.members : [];
    const midPoint = Math.ceil(members.length / 2) || 1;
    const columns = [members.slice(0, midPoint), members.slice(midPoint)];
    columns.forEach((columnMembers) => {
      if (!columnMembers.length) return;
      const ul = document.createElement('ul');
      columnMembers.forEach((member) => {
        if (!member) return;
        const li = document.createElement('li');
        li.textContent = member;
        ul.appendChild(li);
      });
      gridEl.appendChild(ul);
    });
  };

  const renderTransparency = (transparency) => {
    if (!transparency) return;
    setText('transparency-heading', transparency.heading || '');
    setText('transparency-intro', transparency.intro || '');

    const gridEl = document.getElementById('transparency-grid');
    if (!gridEl) return;
    gridEl.innerHTML = '';
    (transparency.cards || []).forEach(({ title, body, list }) => {
      if (!title || (!body && !Array.isArray(list))) return;
      const card = document.createElement('div');
      card.className = 'reports__card';
      const titleEl = document.createElement('h3');
      titleEl.textContent = title;
      card.appendChild(titleEl);

      if (body) {
        const bodyEl = document.createElement('p');
        bodyEl.textContent = body;
        card.appendChild(bodyEl);
      }

      if (Array.isArray(list) && list.length) {
        const listEl = document.createElement('ul');
        list.forEach((item) => {
          if (!item) return;
          const li = document.createElement('li');
          li.textContent = item;
          listEl.appendChild(li);
        });
        card.appendChild(listEl);
      }
      gridEl.appendChild(card);
    });
  };

  const renderSupport = (support) => {
    if (!support) return;
    setText('support-heading', support.heading || '');
    setText('support-intro', support.intro || '');

    const gridEl = document.getElementById('support-grid');
    if (gridEl) {
      gridEl.innerHTML = '';
      (support.options || []).forEach(({ title, description }) => {
        if (!title && !description) return;
        const article = document.createElement('article');
        if (title) {
          const titleEl = document.createElement('h3');
          titleEl.textContent = title;
          article.appendChild(titleEl);
        }
        if (description) {
          const descriptionEl = document.createElement('p');
          descriptionEl.textContent = description;
          article.appendChild(descriptionEl);
        }
        gridEl.appendChild(article);
      });
    }

    const contactEl = document.getElementById('support-contact');
    if (contactEl) {
      contactEl.innerHTML = '';
      if (support.contactNote) {
        const noteEl = document.createElement('p');
        noteEl.textContent = support.contactNote;
        contactEl.appendChild(noteEl);
      }

      if (support.contactEmail || support.contactPhone) {
        const actionsEl = document.createElement('p');
        actionsEl.className = 'support__contact-actions';
        if (support.contactEmail) {
          const emailLink = document.createElement('a');
          emailLink.href = `mailto:${support.contactEmail}`;
          emailLink.textContent = support.contactEmail;
          actionsEl.appendChild(emailLink);
        }

        if (support.contactEmail && support.contactPhone) {
          const separator = document.createTextNode(' • ');
          actionsEl.appendChild(separator);
        }

        if (support.contactPhone) {
          const phoneLink = document.createElement('a');
          phoneLink.href = `tel:${support.contactPhone}`;
          phoneLink.textContent = support.contactPhone;
          actionsEl.appendChild(phoneLink);
        }

        contactEl.appendChild(actionsEl);
      }
    }
  };

  const renderFooter = (footer) => {
    if (!footer) return;
    setText('footer-office-heading', footer.officeHeading || '');
    setText('footer-involved-heading', footer.involvedHeading || '');
    setText('footer-contact-heading', footer.contactHeading || '');

    const officeLines = Array.isArray(footer.officeLines) ? footer.officeLines : [];
    if (officeLines.length) {
      setHTML('footer-office', officeLines.map((line) => line || '').join('<br>'));
    }

    setText('footer-involved', footer.involvedText || '');

    const contactEl = document.getElementById('footer-contact');
    if (contactEl) {
      contactEl.innerHTML = '';
      if (footer.contactText) {
        const textNode = document.createTextNode(footer.contactText);
        contactEl.appendChild(textNode);
        contactEl.appendChild(document.createElement('br'));
      }
      if (footer.contactPhoneLabel && footer.contactPhone) {
        const phoneWrapper = document.createElement('span');
        phoneWrapper.textContent = `${footer.contactPhoneLabel} ${footer.contactPhone}`;
        contactEl.appendChild(phoneWrapper);
        contactEl.appendChild(document.createElement('br'));
      }
      if (footer.contactEmail) {
        const linkEl = document.createElement('a');
        linkEl.href = `mailto:${footer.contactEmail}`;
        linkEl.textContent = footer.contactEmail;
        contactEl.appendChild(linkEl);
      }
    }

    setText('footer-copy-name', footer.copyName || '');
    setText('footer-copy-legal', footer.copyLegal || '');

    const maintainerEl = document.getElementById('footer-copy-maintainer');
    if (maintainerEl) {
      maintainerEl.innerHTML = '';
      const { copyMaintainerLabel, copyMaintainerName, copyMaintainerUrl } = footer;
      if (copyMaintainerLabel && copyMaintainerName && copyMaintainerUrl) {
        maintainerEl.appendChild(document.createTextNode(`${copyMaintainerLabel} `));
        const linkEl = document.createElement('a');
        linkEl.href = copyMaintainerUrl;
        linkEl.rel = 'noopener noreferrer';
        linkEl.target = '_blank';
        linkEl.textContent = copyMaintainerName;
        maintainerEl.appendChild(linkEl);
      } else if (copyMaintainerName) {
        maintainerEl.textContent = copyMaintainerName;
      }
    }
  };

  if (content) {
    renderBrand(content.brand);
    renderNav(content.nav);
    renderHero(content.hero);
    renderStats(content.stats);
    renderPrograms(content.programs);
    renderObjects(content.objects);
    renderTrustees(content.trustees);
    renderTransparency(content.transparency);
    renderSupport(content.support);
    renderFooter(content.footer);
  }

  const attachNavLinkHandlers = () => {
    if (!headerEl || !navToggle || !navEl) return;

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
  };

  attachNavLinkHandlers();

  const breadcrumbEl = document.getElementById('breadcrumb');
  if (breadcrumbEl) {
    const HOME_LABEL = 'Home';
    let sections = [];

    if (Array.isArray(content?.nav)) {
      sections = content.nav
        .map(({ href, label }) => {
          if (!href || !href.startsWith('#') || !label) return null;
          return { id: href.slice(1), label };
        })
        .filter(Boolean);
    }

    if (!sections.length) {
      sections = [
        { id: 'about', label: 'About' },
        { id: 'programs', label: 'Programs' },
        { id: 'objects', label: 'Trust Objects' },
        { id: 'trustees', label: 'Trustees' },
        { id: 'transparency', label: 'Transparency' },
        { id: 'connect', label: 'Connect' }
      ];
    }

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

// Renders every data-driven block from window.SITE (assets/data.js).
// Each container declares what it shows with data-render="<name>".
// English pages live in en/ with <html lang="en" data-root="../"> and also load
// assets/data.en.js, whose entries override the Korean base field by field.
(function () {
  const LANG = document.documentElement.lang === 'en' ? 'en' : 'ko';
  const ROOT = document.documentElement.dataset.root || '';
  if (!window.SITE) return;
  const S = LANG === 'en' && window.SITE_EN ? localize(window.SITE, window.SITE_EN) : window.SITE;

  // lists of records are matched on id (or no); other values are replaced
  function localize(base, over) {
    const out = { ...base };
    Object.keys(over).forEach(k => {
      const b = base[k], o = over[k];
      const key = Array.isArray(b) && b[0] && typeof b[0] === 'object' ? ('id' in b[0] ? 'id' : 'no' in b[0] ? 'no' : null) : null;
      if (key && Array.isArray(o)) out[k] = b.map(x => ({ ...x, ...(o.find(y => y[key] === x[key]) || {}) }));
      else if (b && o && typeof b === 'object' && !Array.isArray(b)) out[k] = { ...b, ...o };
      else out[k] = o;
    });
    return out;
  }

  const T = {
    ko: {
      center: '창발지능 Physical AI 연구단',
      photo: n => `${n} 사진`, homepage: '홈페이지', details: '자세히 보기', more: '자세히 보기 →',
      lead: '책임', sample: '예시', field: '연구 분야',
      sub: no => `${no}세부`, subLead: no => `${no}세부 책임`, count: n => `${n}명`,
      fellowEmpty: 'InnoCORE Fellow가 합류하면 이곳에 소개합니다.',
      director: '연구단장', directorMore: '약력 자세히 보기',
      goal: '최종 목표', examples: '적용 분야', members: '참여 교수진',
      notFound: '해당 연구자를 찾을 수 없습니다.', backPeople: '연구진 목록으로',
      labSite: '연구실 홈페이지', affiliation: '소속', degree: '학력',
      career: '약력', highlights: '주요 실적', activities: '학술 활동', awards: '수상',
      source: '출처: 연구단 발표자료(2026.05). 게재 전 본인 확인을 받습니다.',
      fellowNotFound: '해당 Fellow를 찾을 수 없습니다.', backFellows: '목록으로',
      cv: 'CV 보기', cvSoon: 'CV 준비 중', sampleNote: '화면 구성을 보여 주는 예시 프로필입니다. 실제 인물이 아닙니다.',
      mentor: '멘토', mentors: '멘토', fellowCareer: '경력', outputs: '연구 성과',
      infraMore: n => `인프라 사진 보기 (${n}) →`, equipment: '주요 장비', photosSoon: '사진을 준비하고 있습니다.',
      noticeEmpty: '등록된 공지가 없습니다.',
      upcoming: '예정된 세미나', past: '지난 세미나', speaker: '연사', place: '장소',
      seminarEmpty: '예정된 세미나가 없습니다. 일정이 정해지면 이곳에 안내합니다.',
      jobCount: '모집 인원', jobPeriod: '모집 기간', jobContact: '지원·문의', jobLink: '공고 보기', jobLinkSoon: '공식 모집 공고 링크는 확정 후 게시합니다.',
      careersEmpty: '현재 진행 중인 채용이 없습니다.', themes: '연구 테마',
    },
    en: {
      center: 'Emergent Intelligence Physical AI Research Center',
      photo: n => `Photo of ${n}`, homepage: 'Website', details: 'View profile', more: 'Learn more →',
      lead: 'Lead', sample: 'Sample', field: 'Research field',
      sub: no => `Subproject ${no}`, subLead: no => `Subproject ${no} Lead`, count: n => `${n}`,
      fellowEmpty: 'InnoCORE Fellows will be introduced here once they join.',
      director: 'Center Director', directorMore: 'Full biography',
      goal: 'Final goal', examples: 'Applications', members: 'Faculty and researchers',
      notFound: 'Researcher not found.', backPeople: 'Back to People',
      labSite: 'Lab website', affiliation: 'Affiliation', degree: 'Education',
      career: 'Career', highlights: 'Highlights', activities: 'Professional activities', awards: 'Awards',
      source: 'Source: Research center presentation (May 2026). Each entry is confirmed by the researcher before publication.',
      fellowNotFound: 'Fellow not found.', backFellows: 'Back to the list',
      cv: 'View CV', cvSoon: 'CV coming soon', sampleNote: 'This is a sample profile showing the page layout. It is not a real person.',
      mentor: 'Mentor', mentors: 'Mentors', fellowCareer: 'Career', outputs: 'Research outputs',
      infraMore: n => `View photos (${n}) →`, equipment: 'Key equipment', photosSoon: 'Photos are being prepared.',
      noticeEmpty: 'No notices yet.',
      upcoming: 'Upcoming seminars', past: 'Past seminars', speaker: 'Speaker', place: 'Venue',
      seminarEmpty: 'No seminars are scheduled yet. Dates will be announced here.',
      jobCount: 'Positions', jobPeriod: 'Application period', jobContact: 'Applications and inquiries', jobLink: 'View the official call', jobLinkSoon: 'The official call for applications will be linked here once it is published.',
      careersEmpty: 'There are no open positions at the moment.', themes: 'Research themes',
    },
  }[LANG];

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const asset = src => /^(https?:|\/|data:)/.test(src) ? src : ROOT + src;
  const qs = name => new URLSearchParams(location.search).get(name);
  const person = id => S.people.find(p => p.id === id);
  const group = id => S.groups.find(g => g.id === id);
  const peopleIn = gid => S.people.filter(p => p.group === gid);
  const membersOf = no => S.people.filter(p => (p.subs || []).includes(no));
  const fellowsOf = no => S.fellows.filter(f => (f.subs || []).includes(no));
  const isLead = (p, no) => (p.leads || []).includes(no);
  // Korean pages show the English name beside the Korean one; English pages show it alone
  const nameOf = p => LANG === 'en' ? (p.nameEn || p.name) : p.name;
  const altName = p => LANG === 'ko' && p.nameEn ? ` <span class="en">${esc(p.nameEn)}</span>` : '';

  // official high-res photo first, deck photo as fallback
  function avatar(p, cls) {
    const src = p.photoHi || p.photo;
    const fallback = p.photoHi && p.photo ? ` onerror="this.onerror=null;this.src='${esc(asset(p.photo))}'"` : '';
    if (src) return `<img class="${cls}" src="${esc(asset(src))}"${fallback} alt="${esc(T.photo(nameOf(p)))}" loading="lazy">`;
    return `<span class="${cls} avatar-blank" aria-hidden="true">${esc((nameOf(p) || '?').charAt(0))}</span>`;
  }
  const profileUrl = p => `professor.html?id=${encodeURIComponent(p.id)}`;
  const fellowUrl = f => `fellow.html?id=${encodeURIComponent(f.id)}`;
  const subLinks = p => (p.subs || []).map(no =>
    `<a class="chip" href="research.html#sub${no}">${isLead(p, no) ? T.subLead(no) : T.sub(no)}</a>`).join('');

  // compact row used on the home page
  function mini(p, no) {
    const lead = no && isLead(p, no) ? `<span class="badge">${T.lead}</span>` : '';
    return `<a class="person-mini" href="${profileUrl(p)}">
      ${avatar(p, 'avatar')}
      <span><b>${esc(nameOf(p))}</b> ${lead}<small>${esc(p.title)} · ${esc(p.unit || group(p.group).name)}</small></span>
    </a>`;
  }

  // department-site style card
  function card(p, no) {
    const home = p.homepage ? `<a class="btn-sm" href="${esc(p.homepage)}" target="_blank" rel="noopener">${T.homepage}</a>` : '';
    const lead = no && isLead(p, no) ? ` <span class="badge">${T.lead}</span>` : '';
    return `<article class="person-card">
      <a class="photo" href="${profileUrl(p)}">${avatar(p, 'photo-img')}</a>
      <div class="body">
        <h3>${esc(nameOf(p))}${altName(p)}${lead}</h3>
        <p class="meta">${esc(p.title)} · ${esc(p.unit || group(p.group).name)}</p>
        <p class="field-label">${T.field}</p>
        <p class="field">${esc(p.keyword)}</p>
        <div class="chips">${subLinks(p)}</div>
        <div class="actions">${home}<a class="btn-sm primary" href="${profileUrl(p)}">${T.details}</a></div>
      </div>
    </article>`;
  }

  function fellowCard(f) {
    const cv = f.cv ? `<a class="btn-sm" href="${esc(asset(f.cv))}" target="_blank" rel="noopener">CV</a>` : '';
    return `<article class="person-card">
      <a class="photo" href="${fellowUrl(f)}">${avatar(f, 'photo-img')}</a>
      <div class="body">
        <h3>${esc(f.name)}${f.sample ? ` <span class="badge sample">${T.sample}</span>` : ''}</h3>
        <p class="meta">InnoCORE Fellow · ${esc((f.subs || []).map(T.sub).join(', '))}</p>
        <p class="field-label">${T.field}</p>
        <p class="field">${esc(f.keyword)}</p>
        <div class="actions">${cv}<a class="btn-sm primary" href="${fellowUrl(f)}">${T.details}</a></div>
      </div>
    </article>`;
  }

  const fellowEmpty = `<div class="placeholder">${T.fellowEmpty}</div>`;
  const timeline = items => `<div class="timeline">${items.map(t => `
    <div class="timeline-item"><span class="year">${esc(t.period)}</span><h4>${esc(t.text)}</h4></div>`).join('')}</div>`;

  const R = {
    director(el) {
      const d = S.director, p = person(d.id);
      el.innerHTML = `
        <div class="director-text">
          <span class="subtitle">${T.director}</span>
          <h3>${esc(nameOf(p))}${altName(p)}</h3>
          <p class="meta">${esc(p.title)} · ${esc(p.unit)}</p>
          <p class="intro">${esc(d.intro)}</p>
          ${timeline(d.timeline)}
          <a class="btn secondary" href="${profileUrl(p)}">${T.directorMore}</a>
        </div>
        <div class="director-photo">${avatar(p, 'photo-img')}</div>`;
    },

    'people-groups'(el) {
      el.innerHTML = S.groups.map(g => {
        const list = peopleIn(g.id).filter(p => p.id !== S.director.id);
        return `
        <div class="group-block">
          <h3>${esc(g.name)} <span class="count">${T.count(list.length)}</span></h3>
          <p class="meta">${esc(g.desc)}</p>
          <div class="mini-grid">${list.map(p => mini(p)).join('')}</div>
        </div>`;
      }).join('');
    },

    'people-full'(el) {
      el.innerHTML = S.groups.map(g => `
        <h3 class="group-title">${esc(g.name)} <span class="count">${T.count(peopleIn(g.id).length)}</span></h3>
        <p class="group-desc">${esc(g.desc)}</p>
        <div class="person-grid">${peopleIn(g.id).map(p => card(p)).join('')}</div>`).join('');
    },

    'fellows-full'(el) {
      el.innerHTML = S.fellows.length ? `<div class="person-grid">${S.fellows.map(fellowCard).join('')}</div>` : fellowEmpty;
    },

    'research-cards'(el) {
      el.innerHTML = S.subprojects.map(s => `
        <a class="info-card research" href="research.html#sub${s.no}">
          <span class="tag">${T.sub(s.no)}</span>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.short)}</p>
          <span class="more">${T.more}</span>
        </a>`).join('') + `
        <a class="info-card research" href="research.html#cross">
          <span class="tag">Cross-domain</span>
          <h3>${esc(S.cross.title)}</h3>
          <p>${esc(S.cross.short)}</p>
          <span class="more">${T.more}</span>
        </a>`;
    },

    'research-nav'(el) {
      el.innerHTML = S.subprojects.map(s => `<a href="#sub${s.no}">${T.sub(s.no)}</a>`).join('') + '<a href="#cross">Cross-domain</a>';
    },

    'research-sections'(el) {
      el.innerHTML = S.subprojects.map((s, i) => `
        <section class="section ${i % 2 ? 'bg-light' : ''}" id="sub${s.no}">
          <div class="container">
            <span class="tag">${T.sub(s.no)}</span>
            <h2 class="sub-title">${esc(s.title)}</h2>
            ${s.goal ? `<p class="goal-box"><b>${T.goal}</b>${esc(s.goal)}</p>` : ''}
            ${(s.intro || []).length ? `<ul class="bullets">${s.intro.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
            ${(s.stages || []).length ? `<div class="stage-grid">${s.stages.map((st, k) => `
              <div class="stage"><span class="num">${k + 1}</span><h4>${esc(st.heading)}</h4>
                ${(st.items || []).length ? `<ul>${st.items.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}</div>`).join('')}</div>` : ''}
            ${(s.examples || []).length ? `<h3 class="block-title">${T.examples}</h3><div class="chips">${s.examples.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>` : ''}
            <h3 class="block-title">${T.members}</h3>
            <div class="person-grid">${membersOf(s.no).sort((a, b) => isLead(b, s.no) - isLead(a, s.no)).map(p => card(p, s.no)).join('')}</div>
            <h3 class="block-title">InnoCORE Fellow</h3>
            ${fellowsOf(s.no).length ? `<div class="person-grid">${fellowsOf(s.no).map(fellowCard).join('')}</div>` : fellowEmpty}
          </div>
        </section>`).join('') + `
        <section class="section ${S.subprojects.length % 2 ? 'bg-light' : ''}" id="cross">
          <div class="container">
            <span class="tag">Cross-domain</span>
            <h2 class="sub-title">${esc(S.cross.title)}</h2>
            <ul class="bullets">${S.cross.points.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
          </div>
        </section>`;
    },

    'professor-detail'(el) {
      const p = person(qs('id'));
      if (!p) { el.innerHTML = `<p class="placeholder">${T.notFound} <a href="people.html">${T.backPeople}</a></p>`; return; }
      document.title = `${nameOf(p)} | ${T.center}`;
      const d = p.id === S.director.id ? S.director : null;
      const home = p.homepage ? `<a class="btn secondary" href="${esc(p.homepage)}" target="_blank" rel="noopener">${T.labSite}</a>` : '';
      const rows = [
        [T.affiliation, `${p.unit || group(p.group).name}${p.lab ? ` · ${p.lab}` : ''}`],
        [T.degree, p.degree],
        [T.field, p.keyword],
      ].filter(r => r[1]);
      el.innerHTML = `
        <div class="profile">
          <div class="profile-photo">${avatar(p, 'photo-img')}</div>
          <div>
            <h1 class="profile-name">${esc(nameOf(p))}${altName(p)}</h1>
            <p class="meta">${esc(p.title)} · ${esc(group(p.group).name)}${d ? ` · ${T.director}` : ''}</p>
            <div class="chips">${subLinks(p)}</div>
            <dl class="dl">${rows.map(r => `<dt>${r[0]}</dt><dd>${esc(r[1])}</dd>`).join('')}</dl>
            ${home}
          </div>
        </div>
        ${d ? `<h2 class="block-title">${T.career}</h2>${timeline(d.timeline)}` : ''}
        ${(p.bullets || []).length ? `<h2 class="block-title">${T.highlights}</h2><dl class="dl">${p.bullets.map(b => `<dt>${esc(b.label)}</dt><dd>${esc(b.text)}</dd>`).join('')}</dl>` : ''}
        ${d && d.activities ? `<h2 class="block-title">${T.activities}</h2><ul class="bullets">${d.activities.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
        ${d && d.awards ? `<h2 class="block-title">${T.awards}</h2><ul class="bullets">${d.awards.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
        <p class="source-note">${esc(p.source || T.source)}</p>`;
    },

    'fellow-detail'(el) {
      const f = S.fellows.find(x => x.id === qs('id'));
      if (!f) { el.innerHTML = `<p class="placeholder">${T.fellowNotFound} <a href="people.html#fellows">${T.backFellows}</a></p>`; return; }
      document.title = `${f.name} | InnoCORE Fellow`;
      const cv = f.cv ? `<a class="btn primary" href="${esc(asset(f.cv))}" target="_blank" rel="noopener">${T.cv}</a>` : `<span class="placeholder-inline">${T.cvSoon}</span>`;
      const mentors = (f.mentors || []).map(id => person(id)).filter(Boolean);
      el.innerHTML = `
        ${f.sample ? `<p class="sample-note">${T.sampleNote}</p>` : ''}
        <div class="profile">
          <div class="profile-photo">${avatar(f, 'photo-img')}</div>
          <div>
            <h1 class="profile-name">${esc(f.name)}</h1>
            <p class="meta">InnoCORE Fellow · ${esc((f.subs || []).map(T.sub).join(', '))}</p>
            <dl class="dl">
              <dt>${T.field}</dt><dd>${esc(f.keyword)}</dd>
              ${mentors.length ? `<dt>${mentors.length > 1 ? T.mentors : T.mentor}</dt><dd>${mentors.map(m => `<a href="${profileUrl(m)}">${esc(nameOf(m))}</a>`).join(', ')}</dd>` : ''}
            </dl>
            ${cv}
          </div>
        </div>
        <h2 class="block-title">${T.fellowCareer}</h2>
        ${timeline(f.career || [])}
        ${(f.outputs || []).length ? `<h2 class="block-title">${T.outputs}</h2>
        <ul class="bullets">${f.outputs.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}`;
    },

    'infra-cards'(el) {
      el.innerHTML = S.infra.map(x => `
        <a class="info-card infra-card" href="infrastructure.html#${x.id}">
          ${x.photos.length ? `<img src="${esc(asset(x.photos[0].src))}" alt="${esc(x.photos[0].caption)}" loading="lazy">` : ''}
          <h3>${esc(x.name)} <span class="badge">${esc(x.region)}</span></h3>
          <p class="meta">${esc(x.summary)}</p>
          <span class="more">${T.infraMore(x.photos.length)}</span>
        </a>`).join('');
    },

    'infra-detail'(el) {
      el.innerHTML = S.infra.map((x, i) => `
        <section class="section ${i % 2 ? 'bg-light' : ''}" id="${x.id}">
          <div class="container">
            <h2 class="sub-title">${esc(x.name)} <span class="badge">${esc(x.region)}</span></h2>
            <p class="group-desc">${esc(x.summary)}</p>
            ${(x.lines || []).length ? `<ul class="bullets">${x.lines.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
            ${x.equipment ? `<p class="equip-line"><b>${T.equipment}</b> ${esc(x.equipment)}</p>` : ''}
            <div class="gallery">${x.photos.map(ph => `
              <figure><a href="${esc(asset(ph.src))}" target="_blank" rel="noopener"><img src="${esc(asset(ph.src))}" alt="${esc(ph.caption)}" loading="lazy"></a><figcaption>${esc(ph.caption)}</figcaption></figure>`).join('')}
            </div>
            ${x.photos.length ? '' : `<div class="placeholder">${T.photosSoon}</div>`}
          </div>
        </section>`).join('');
    },

    // data-limit shows only the latest entries (home page)
    'notice-list'(el) {
      const list = S.notices.slice(0, +el.dataset.limit || undefined);
      el.innerHTML = list.length ? list.map(x => `
        <li class="news-item"><span class="news-date">${esc(x.date)}</span><span>${x.link ? `<a href="${esc(x.link)}">${esc(x.title)}</a>` : esc(x.title)}</span></li>`).join('')
        : `<li class="placeholder">${T.noticeEmpty}</li>`;
    },

    'seminar-list'(el) {
      const d = new Date();
      const today = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('.');
      const upcoming = S.seminars.filter(s => s.date >= today).sort((a, b) => a.date.localeCompare(b.date));
      const past = S.seminars.filter(s => s.date < today).sort((a, b) => b.date.localeCompare(a.date));
      const item = s => {
        const who = s.speaker ? `${T.speaker} ${s.speaker}${s.affiliation ? ` (${s.affiliation})` : ''}` : '';
        const title = s.link ? `<a href="${esc(s.link)}" target="_blank" rel="noopener">${esc(s.title)}</a>` : esc(s.title);
        return `<li class="news-item"><span class="news-date">${esc(s.date)}${s.time ? `<small>${esc(s.time)}</small>` : ''}</span>
          <div><h4 class="seminar-title">${title}</h4><p class="meta">${esc([who, s.place && `${T.place} ${s.place}`].filter(Boolean).join(' · '))}</p></div></li>`;
      };
      const list = items => `<ul class="news-list">${items.map(item).join('')}</ul>`;
      const empty = `<div class="placeholder">${T.seminarEmpty}</div>`;
      if (el.dataset.limit) {
        const items = upcoming.concat(past).slice(0, +el.dataset.limit);
        el.innerHTML = items.length ? list(items) : empty;
        return;
      }
      el.innerHTML = `<h3 class="block-title">${T.upcoming}</h3>${upcoming.length ? list(upcoming) : empty}`
        + (past.length ? `<h3 class="block-title">${T.past}</h3>${list(past)}` : '');
    },

    'career-list'(el) {
      el.innerHTML = S.careers.length ? S.careers.map(j => `
        <article class="job">
          <div class="job-head"><span class="badge now">${esc(j.status)}</span><h3>${esc(j.title)}</h3></div>
          <dl class="job-meta"><dt>${T.jobCount}</dt><dd>${esc(j.count)}</dd><dt>${T.jobPeriod}</dt><dd>${esc(j.period)}</dd>
            ${j.contact ? `<dt>${T.jobContact}</dt><dd><a href="mailto:${esc(j.contact)}">${esc(j.contact)}</a></dd>` : ''}</dl>
          ${j.summary ? `<p class="meta">${esc(j.summary)}</p>` : ''}
          ${j.link ? `<a class="btn primary" href="${esc(j.link)}" target="_blank" rel="noopener">${T.jobLink}</a>` : `<p class="job-note">${T.jobLinkSoon}</p>`}
        </article>`).join('') : `<div class="placeholder">${T.careersEmpty}</div>`;
    },

    'career-info'(el) {
      const c = S.careerInfo;
      el.innerHTML = `
        <div class="card-grid">${c.cards.map(x => `
          <div class="info-card"><h3>${esc(x.title)}</h3><p class="meta">${esc(x.text)}</p></div>`).join('')}
        </div>
        <div class="themes">
          <h3>${T.themes}</h3>
          <ul class="theme-list">${c.themes.map(t => `<li><b>${esc(t.code)}</b>${esc(t.text)}</li>`).join('')}</ul>
        </div>`;
    },
  };

  document.querySelectorAll('[data-render]').forEach(el => {
    const fn = R[el.dataset.render];
    if (fn) fn(el);
  });

  const page = location.pathname.split('/').pop() || 'index.html';
  // sub pages light up the home-page menu item they belong to
  const navFor = { 'research.html': 'index.html#research', 'people.html': 'index.html#people', 'professor.html': 'index.html#people',
    'fellow.html': 'index.html#people', 'infrastructure.html': 'index.html#infrastructure' }[page] || page;
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === navFor) a.setAttribute('aria-current', 'page');
  });

  // the language switch opens the same page (with its query and anchor) in the other language
  document.querySelectorAll('.lang-switch a[hreflang]').forEach(a => {
    const here = a.getAttribute('aria-current');
    a.href = (here ? '' : LANG === 'en' ? '../' : 'en/') + page + location.search + location.hash;
  });

  // anchors to blocks that were just rendered need a manual jump
  if (location.hash) {
    const t = document.getElementById(location.hash.slice(1));
    if (t) t.scrollIntoView();
  }
})();

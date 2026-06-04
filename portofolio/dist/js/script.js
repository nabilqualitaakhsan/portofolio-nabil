

document.addEventListener('DOMContentLoaded', () => {

  /* ─── AOS Init ─────────────────────────── */
  AOS.init({
    duration: 700,
    once: true,
    offset: 80,
  });

  /* ─── Year ──────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─── Navbar Scroll Shadow ──────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ─── Dark Mode ─────────────────────────── */
  const darkToggle = document.getElementById('darkToggle');
  const darkIcon   = document.getElementById('darkIcon');
  const body       = document.body;

  // Restore preference
  if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    darkIcon.className = 'fa-solid fa-sun';
  }

  darkToggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-mode');
    darkIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    localStorage.setItem('darkMode', isDark);
  });

  /* ─── Hamburger Menu ────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ─── Active Nav Link on Scroll ─────────── */
  const sections  = document.querySelectorAll('section[id]');
  const allLinks  = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        allLinks.forEach(l => l.style.color = '');
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.style.color = '#6C5CE7';
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => observer.observe(s));

  /* ─── Support / Donate ──────────────────── */
  const amountBtns   = document.querySelectorAll('.amount-btn');
  const customAmount = document.getElementById('customAmount');
  const supportName  = document.getElementById('supportName');
  const supportMsg   = document.getElementById('supportMsg');
  const supportBtn   = document.getElementById('supportBtn');
  const supportSucc  = document.getElementById('supportSuccess');

  let selectedAmount = null;

  function updateSupportBtn() {
    const amt = customAmount.value || selectedAmount;
    const name = supportName.value.trim();
    const disabled = !name || !amt;
    supportBtn.disabled = disabled;

    if (!disabled) {
      const formatted = 'Rp ' + Number(amt).toLocaleString('id-ID');
      supportBtn.textContent = `Support ${formatted} ☕`;
    } else {
      supportBtn.textContent = 'Support ☕';
    }
  }

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedAmount = btn.dataset.amount;
      customAmount.value = '';
      updateSupportBtn();
    });
  });

  customAmount.addEventListener('input', () => {
    amountBtns.forEach(b => b.classList.remove('active'));
    selectedAmount = null;
    updateSupportBtn();
  });

  supportName.addEventListener('input', updateSupportBtn);
  updateSupportBtn();

  supportBtn.addEventListener('click', () => {
    if (supportBtn.disabled) return;

    supportBtn.textContent = '🎉 Makasih banyak!';
    supportSucc.classList.add('show');

    // Confetti
    launchConfetti();

    setTimeout(() => {
      supportBtn.textContent = 'Support ☕';
      supportSucc.classList.remove('show');
      amountBtns.forEach(b => b.classList.remove('active'));
      selectedAmount = null;
      customAmount.value = '';
      supportName.value = '';
      supportMsg.value  = '';
      updateSupportBtn();
    }, 4000);
  });

  /* ─── Contact Form ──────────────────────── */
  const contactBtn  = document.getElementById('contactBtn');
  const contactName  = document.getElementById('contactName');
  const contactEmail = document.getElementById('contactEmail');
  const contactMsg   = document.getElementById('contactMsg');
  const contactSucc  = document.getElementById('contactSuccess');

  contactBtn.addEventListener('click', () => {
    const name  = contactName.value.trim();
    const email = contactEmail.value.trim();
    const msg   = contactMsg.value.trim();

    if (!name || !email || !msg) {
      // Shake empty fields
      [contactName, contactEmail, contactMsg].forEach(el => {
        if (!el.value.trim()) shake(el);
      });
      return;
    }

    contactBtn.textContent = '✅ Terkirim!';
    contactBtn.disabled = true;
    contactSucc.classList.add('show');

    setTimeout(() => {
      contactBtn.textContent = 'Kirim Pesan 🚀';
      contactBtn.disabled = false;
      contactSucc.classList.remove('show');
      contactName.value  = '';
      contactEmail.value = '';
      contactMsg.value   = '';
    }, 3500);
  });

  /* ─── Shake helper ──────────────────────── */
  function shake(el) {
    el.style.animation = 'none';
    el.style.borderColor = '#FD79A8';
    el.style.transform = 'translateX(-6px)';
    setTimeout(() => el.style.transform = 'translateX(6px)', 80);
    setTimeout(() => el.style.transform = 'translateX(-4px)', 160);
    setTimeout(() => el.style.transform = 'translateX(4px)', 240);
    setTimeout(() => {
      el.style.transform = '';
      el.style.borderColor = '';
    }, 360);
  }

  /* ─── Confetti helper ───────────────────── */
  function launchConfetti() {
    const emojis = ['🎉','🎊','☕','💜','✨','🥳','💝','🌟'];
    emojis.forEach((e, i) => {
      const el = document.createElement('span');
      el.textContent = e;
      el.style.cssText = `
        position: fixed;
        font-size: 2rem;
        top: ${20 + Math.random() * 40}%;
        left: ${Math.random() * 100}%;
        z-index: 9999;
        pointer-events: none;
        animation: fadeInUp .8s ease forwards;
        animation-delay: ${i * 0.12}s;
        opacity: 0;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3000 + i * 120);
    });
  }

  /* ─── Smooth scroll for all anchors ─────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── Typing effect on hero heading ─────── */
  const roles = ['Web Developer', 'UI/UX Designer', 'Frontend Engineer', 'Creative Coder'];
  let roleIdx = 0, charIdx = 0, deleting = false;

  const typingEl = document.createElement('span');
  typingEl.id = 'typing-role';
  typingEl.style.cssText = `
    display: block;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-muted);
    margin-top: .5rem;
    min-height: 1.6em;
  `;

  const heading = document.querySelector('.hero-heading');
  if (heading) heading.after(typingEl);

  function type() {
    const current = roles[roleIdx];
    if (!deleting) {
      typingEl.textContent = current.slice(0, ++charIdx) + '|';
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 1400);
        return;
      }
    } else {
      typingEl.textContent = current.slice(0, --charIdx) + '|';
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(type, deleting ? 55 : 95);
  }
  type();

});

/* ── Global keyframe for confetti ─────────── */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(-40px); }
  }
`;
document.head.appendChild(style);

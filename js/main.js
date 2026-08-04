/* ZeynPack — main script */
(function () {
  'use strict';

  /* ---------- Header: scroll shadow ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const fmt = (n) => n.toLocaleString('en-US');
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const dur = 1400;
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { run(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => cio.observe(el));
  }

  /* ---------- Tabs (industries page) ---------- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  if (tabBtns.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === target));
      });
    });
  }

  /* ---------- Contact form → WhatsApp / mail ---------- */
  const form = document.getElementById('inquiry-form');
  if (form) {
    const isTR = document.documentElement.lang === 'tr';
    const L = isTR ? {
      alertMissing: 'Lütfen en az ad ve telefon numarası girin.',
      title: 'Teklif Talebi — ZeynPack',
      name: '👤 Ad:', company: '🏢 Firma:', email: '📧 E-posta:', phone: '📞 Telefon:',
      product: '🏷️ Ürün:', qty: '📦 Miktar:', size: '📐 Ebat:', material: '🧪 Malzeme:', msg: '📝 Detaylar:',
      confirm: 'WhatsApp üzerinden gönderilsin mi?\n("İptal" derseniz e-posta ile gönderilir)',
      noteDone: '✅ Talebiniz hazır — ',
      wa: 'WhatsApp', mail: 'e-posta',
      noteTail: ' penceresi açılacak. Verileriniz bu sitede saklanmaz.'
    } : {
      alertMissing: 'يرجى تعبئة الاسم ورقم الهاتف على الأقل لإرسال الطلب.',
      title: 'طلب عرض سعر — ZeynPack',
      name: '👤 الاسم:', company: '🏢 الشركة:', email: '📧 البريد:', phone: '📞 الهاتف:',
      product: '🏷️ المنتج:', qty: '📦 الكمية:', size: '📐 المقاس:', material: '🧪 المادة:', msg: '📝 التفاصيل:',
      confirm: 'إرسال الطلب عبر واتساب؟\n(اضغط "إلغاء" للإرسال عبر البريد الإلكتروني)',
      noteDone: '✅ تم تجهيز طلبك — سيتم فتح نافذة ',
      wa: 'واتساب', mail: 'البريد الإلكتروني',
      noteTail: ' لإتمام الإرسال.'
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = (id) => (form.querySelector('#' + id) || {}).value || '';
      const name = val('name').trim();
      const company = val('company').trim();
      const email = val('email').trim();
      const phone = val('phone').trim();
      const product = val('product');
      const qty = val('qty').trim();
      const size = val('size').trim();
      const material = val('material').trim();
      const msg = val('message').trim();

      if (!name || !phone) {
        alert(L.alertMissing);
        return;
      }

      const lines = [
        L.title,
        '──────────────',
        L.name + ' ' + name,
        company ? L.company + ' ' + company : null,
        email ? L.email + ' ' + email : null,
        L.phone + ' ' + phone,
        product ? L.product + ' ' + product : null,
        qty ? L.qty + ' ' + qty : null,
        size ? L.size + ' ' + size : null,
        material ? L.material + ' ' + material : null,
        msg ? L.msg + ' ' + msg : null
      ].filter(Boolean).join('\n');

      const wa = '902120000000';
      const waUrl = 'https://wa.me/' + wa + '?text=' + encodeURIComponent(lines);
      const mailUrl = 'mailto:info@zeynpack.com?subject=' + encodeURIComponent((isTR ? 'Teklif Talebi: ' : 'طلب عرض سعر من ') + (company || name)) + '&body=' + encodeURIComponent(lines);

      const chosen = confirm(L.confirm);
      window.open(chosen ? waUrl : mailUrl, '_blank');
      const note = document.getElementById('form-note');
      if (note) {
        note.textContent = L.noteDone + (chosen ? L.wa : L.mail) + L.noteTail;
        note.style.color = '#12b5a5';
      }
    });
  }
})();

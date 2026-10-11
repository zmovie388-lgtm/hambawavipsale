(function () {
  "use strict";

  /* =====================================================================
     SITE CONFIGURATION — the website owner edits these values directly.
     There is no admin panel, login or password. Save the file and re-upload.
     ===================================================================== */
  var ADMIN_URL = "https://t.me/HAMBAWAVIP2";
  var GROUP_URL = "https://t.me/+AsXq0i5bLE05YzRl";
  var VIP_MESSAGE = "Hi මට VIP එක BUY කරන්න ඕනි";

  /* ---------- OFFER CONFIGURATION ----------
     title           Offer name (used to build the Telegram message)
     originalPrice   Number, in Rs.
     discountedPrice Number, in Rs.
     description     Short text shown on the card
     active          true = show, false = hide
     expiry          Date/time after which the offer hides automatically
                     (ISO format, e.g. "2026-10-31T23:59:00"); "" = never expires
     buttonText      Text on the buy button
     badge           (optional) Badge text; defaults to "🔥 " + title
  */
  var offers = [
    {
      title: "WEEKEND OFFER",
      originalPrice: 2000,
      discountedPrice: 1000,
      description: "Special limited-time membership offer.",
      active: true,
      expiry: "2026-10-31T23:59:00",
      buttonText: "BUY NOW",
      badge: "🔥 WEEKEND OFFER"
    },
    {
      title: "SPECIAL DISCOUNT",
      originalPrice: 2000,
      discountedPrice: 1500,
      description: "Save on lifetime VIP access for a short time.",
      active: true,
      expiry: "2026-12-31T23:59:00",
      buttonText: "BUY NOW",
      badge: "⚡ SPECIAL DISCOUNT"
    },
    {
      title: "LIFETIME OFFER",
      originalPrice: 2000,
      discountedPrice: 1200,
      description: "Lifetime membership at a reduced price.",
      active: false,           // set to true to show this offer
      expiry: "2026-12-31T23:59:00",
      buttonText: "BUY NOW",
      badge: "💎 LIFETIME OFFER"
    }
  ];
  /* ===================== END OF CONFIGURATION ===================== */

  /* ---------- helpers ---------- */
  function telegramUrl(message) {
    return ADMIN_URL + "?text=" + encodeURIComponent(message);
  }
  function titleCase(str) {
    return String(str).toLowerCase().replace(/(^|\s)\S/g, function (c) { return c.toUpperCase(); });
  }
  function offerMessage(offerTitle) {
    // "WEEKEND OFFER" -> "Hi මට Weekend Offer එක ගන්න ආවෙ"
    var message = "Hi මට " + titleCase(offerTitle) + " එක ගන්න ආවෙ";
    return message;
  }
  function formatPrice(n) { return "Rs. " + Number(n).toLocaleString("en-US"); }
  function discountPercent(orig, disc) {
    if (!(orig > 0) || disc >= orig) return 0;
    return Math.round(((orig - disc) / orig) * 100);
  }
  function isLive(o) {
    if (!o || o.active !== true) return false;
    if (!o.expiry) return true;
    var t = new Date(o.expiry).getTime();
    return isNaN(t) ? true : t > Date.now();
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  /* ---------- Telegram links ---------- */
  document.querySelectorAll("[data-vip-buy]").forEach(function (a) {
    a.href = telegramUrl(VIP_MESSAGE);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });
  document.querySelectorAll("[data-group]").forEach(function (a) {
    a.href = GROUP_URL;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });

  /* ---------- render offers ---------- */
  var grid = document.getElementById("offersGrid");
  function renderOffers() {
    grid.textContent = "";
    var live = offers.filter(isLive);

    if (!live.length) {
      var empty = el("div", "glass empty");
      empty.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.600 13.400l-7.200 7.200a2 2 0 0 1-2.800 0L3 13V3h10l7.600 7.600a2 2 0 0 1 0 2.800z"/><circle cx="7.500" cy="7.500" r="1.200"/></svg>';
      empty.appendChild(el("p", "", "No active offers right now. Please check back later."));
      grid.appendChild(empty);
      return;
    }

    live.forEach(function (o) {
      var card = el("article", "glass offer reveal in");
      var top = el("div", "top");
      top.appendChild(el("span", "badge", o.badge || ("🔥 " + o.title)));
      var pct = discountPercent(o.originalPrice, o.discountedPrice);
      if (pct > 0) top.appendChild(el("span", "off-pct", pct + "% OFF"));
      card.appendChild(top);

      card.appendChild(el("h3", "", o.title));
      card.appendChild(el("p", "d", o.description || ""));

      var prices = el("div", "prices");
      var old = el("s", "old", formatPrice(o.originalPrice));
      old.setAttribute("aria-label", "Original price " + formatPrice(o.originalPrice));
      prices.appendChild(old);
      prices.appendChild(el("span", "new", formatPrice(o.discountedPrice)));
      card.appendChild(prices);

      card.appendChild(el("p", "save", pct > 0
        ? "Discount: " + pct + "% — you save " + formatPrice(o.originalPrice - o.discountedPrice)
        : ""));

      var btn = el("a", "btn btn-primary", o.buttonText || "BUY NOW");
      btn.href = telegramUrl(offerMessage(o.title));
      btn.target = "_blank";
      btn.rel = "noopener noreferrer";
      card.appendChild(btn);

      grid.appendChild(card);
    });
  }
  renderOffers();
  // Re-check expiry every minute so expired offers hide automatically.
  setInterval(renderOffers, 60000);

  /* ---------- footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- mobile nav ---------- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  function closeMenu() {
    menu.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }
  burger.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("click", function (e) {
    if (!menu.contains(e.target) && !burger.contains(e.target)) closeMenu();
  });

  /* ---------- nav links: smooth scroll + MAIN GROUP stays in-page ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      var target = id.length > 1 ? document.querySelector(id) : null;
      if (target) {
        e.preventDefault();
        var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
    });
  });

  /* ---------- active nav highlight ---------- */
  var links = Array.prototype.slice.call(menu.querySelectorAll("a"));
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) {
            l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["home", "about", "offers", "main-group"].forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });

    var rev = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); rev.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (n) { rev.observe(n); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (n) { n.classList.add("in"); });
  }

  /* ---------- pricing modal ---------- */
  var modal = document.getElementById("modal");
  var lastFocus = null;
  function openModal() {
    lastFocus = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.getElementById("modalClose").focus();
  }
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll("[data-open-modal]").forEach(function (b) {
    b.addEventListener("click", openModal);
  });
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalOffers").addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
})();

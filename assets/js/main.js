/* Tabs, project filters, the project dialog, the mobile contact toggle and the email form. */
(function () {
  "use strict";

  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  var panels = {};
  tabs.forEach(function (t) { panels[t.dataset.tab] = document.getElementById(t.getAttribute("aria-controls")); });

  /* ---------- Tabs ---------- */
  function showTab(name, opts) {
    if (!panels[name]) name = "about";
    tabs.forEach(function (t) {
      var on = t.dataset.tab === name;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      panels[t.dataset.tab].hidden = !on;
    });
    if (!opts || !opts.silent) {
      try { history.replaceState(null, "", "#" + name); } catch (e) {}
      /* On a phone the profile card sits above the panel, so scroll to the panel itself. */
      var top = window.innerWidth < 1024 ? document.getElementById("content").getBoundingClientRect().top + window.scrollY - 12 : 0;
      window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
    }
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { showTab(t.dataset.tab); });
    t.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") next = tabs[0];
      if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); next.focus(); showTab(next.dataset.tab); }
    });
  });
  document.querySelectorAll("[data-goto]").forEach(function (el) {
    el.addEventListener("click", function () { showTab(el.dataset.goto); });
  });
  showTab((location.hash || "").replace("#", ""), { silent: true });
  window.addEventListener("hashchange", function () { showTab((location.hash || "").replace("#", ""), { silent: true }); });

  /* ---------- Filters ---------- */
  var filters = document.querySelectorAll(".filter");
  var items = document.querySelectorAll(".projects > li");
  filters.forEach(function (f) {
    f.addEventListener("click", function () {
      filters.forEach(function (o) { o.classList.toggle("is-on", o === f); o.setAttribute("aria-pressed", o === f ? "true" : "false"); });
      var want = f.dataset.filter;
      items.forEach(function (li) { li.hidden = !(want === "all" || li.dataset.cats.split(" ").indexOf(want) !== -1); });
    });
  });

  /* ---------- Project dialog ---------- */
  var modal = document.getElementById("modal");
  var body = document.getElementById("modal-body");
  var lastOpener = null;
  function openProject(id, opener) {
    var tpl = document.getElementById("d-" + id);
    if (!tpl) return;
    body.replaceChildren(tpl.content.cloneNode(true));
    lastOpener = opener;
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
    modal.querySelector(".modal-inner").scrollTop = 0;
  }
  document.querySelectorAll("[data-open]").forEach(function (b) {
    b.addEventListener("click", function () { openProject(b.dataset.open, b); });
  });
  modal.querySelector(".modal-close").addEventListener("click", function () { modal.close(); });
  modal.addEventListener("click", function (e) { if (e.target === modal) modal.close(); });
  modal.addEventListener("close", function () { if (lastOpener) lastOpener.focus(); });

  /* ---------- Mobile contacts ---------- */
  var toggle = document.querySelector(".sb-toggle");
  var more = document.getElementById("sb-more");
  toggle.addEventListener("click", function () {
    var open = more.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.firstElementChild.textContent = open ? "Hide contacts" : "Show contacts";
  });

  /* ---------- Email form: opens the visitor's own email app ---------- */
  var form = document.getElementById("mail-form");
  var note = document.getElementById("form-note");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      var bad = !el.value.trim() || (el.type === "email" && !/^\S+@\S+\.\S+$/.test(el.value));
      el.setAttribute("aria-invalid", bad ? "true" : "false");
      if (bad) ok = false;
    });
    if (!ok) { note.textContent = "Please fill in your name, a valid email and a message."; return; }
    var name = form.elements.name.value.trim(), email = form.elements.email.value.trim(), msg = form.elements.message.value.trim();
    var subject = "Message from " + name + " via your portfolio";
    var text = msg + "\n\n" + name + "\n" + email;
    location.href = "mailto:phaneendrakumar2809@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text);
    note.textContent = "Your email app should open with the message ready to send. If it does not, write to phaneendrakumar2809@gmail.com.";
  });
})();

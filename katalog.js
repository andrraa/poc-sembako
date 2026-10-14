/* Katalog bersama untuk index.html (cuplikan 30 produk) dan products.html (daftar penuh).
   Berisi satu sumber kebenaran: kartu produk, chip kategori, pencarian, filter, pilihan, pick bar.
   Halaman hanya menentukan "produk mana yang tampil" lewat opsi.choose dan opsi.perPage. */
(function (global) {
  "use strict";
  var D = global.BJ;

  var LABEL_STOK = { semua: "Semua stok", ready: "Ready", low: "Stok terbatas", out: "Stok kosong" };
  var LABEL_URUT = { default: "Bawaan", murah: "Termurah", mahal: "Termahal", nama: "Nama A-Z", grosir: "Grosir termurah" };

  var state = {
    cat: "semua",
    query: "",
    picked: {},
    stock: "semua",   // semua | ready | low | out
    sort: "default",  // default | murah | mahal | nama | grosir
    page: 1
  };

  function svgIcon(id, cls) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon " + (cls || "size-[18px]"));
    svg.setAttribute("aria-hidden", "true");
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#" + id);
    svg.appendChild(use);
    return svg;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function openWa(text) { global.open(D.waUrl(text), "_blank", "noopener"); }

  /* ------------------------------ penyaringan --------------------------- */
  function cocok(p) {
    var q = state.query.trim().toLowerCase();
    if (state.cat !== "semua" && p.cat !== state.cat) return false;
    if (!q) return true;
    return (p.name + " " + p.unit).toLowerCase().indexOf(q) !== -1;
  }

  var SORTER = {
    default: null,
    murah: function (a, b) { return a.ecer - b.ecer; },
    mahal: function (a, b) { return b.ecer - a.ecer; },
    nama: function (a, b) { return a.name.localeCompare(b.name, "id"); },
    grosir: function (a, b) { return a.grosir - b.grosir; }
  };

  function select(extra) {
    var list = D.products.filter(function (p) { return p.aktif !== false && cocok(p); });
    if (state.stock !== "semua") {
      list = list.filter(function (p) { return D.stockState(p).key === state.stock; });
    }
    if (extra && extra.filter) list = list.filter(extra.filter);
    var s = SORTER[state.sort];
    if (s) list = list.slice().sort(s);
    return list;
  }

  function adaFilter() {
    return state.cat !== "semua" || state.query.trim() !== "" || state.stock !== "semua";
  }

  /* -------------------------------- kartu ------------------------------- */
  function productCard(p) {
    var st = D.stockState(p);
    var out = st.key === "out";
    var picked = !!state.picked[p.id];

    var card = el("article", "group reveal flex flex-col overflow-hidden rounded-[18px] border bg-surface transition-[border-color,box-shadow] duration-200 ease-swift hover:shadow-md "
      + (picked ? "border-brand shadow-[0_0_0_2px_var(--brandsoft),0_2px_6px_rgba(22,33,28,.06)]" : "border-line"));
    card.dataset.id = p.id;
    card.dataset.picked = String(picked);

    var media = el("div", "relative aspect-4/3 overflow-hidden bg-surface2");
    var img = el("img", "size-full object-cover transition-transform duration-450 ease-swift group-hover:scale-[1.035]");
    img.src = p.img;
    img.alt = p.alt;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 500;
    img.height = 375;
    // Wikimedia kadang membatasi permintaan; wsrv.nl jadi cadangan, lalu pola SVG.
    img.dataset.ph = D.fallbackSVG(p);
    img.dataset.alt2 = p.img.replace("https://thumb.wikimedia.org/wikipedia/commons/thumb/",
      "https://wsrv.nl/?url=thumb.wikimedia.org/wikipedia/commons/thumb/");
    img.onerror = function () { this.onerror = null; this.src = this.dataset.alt2 || this.dataset.ph; };
    media.appendChild(img);

    var body = el("div", "flex flex-1 flex-col gap-2 p-3 md:p-4");
    body.appendChild(el("p", "text-xs text-ink3", D.catLabel(p.cat)));
    body.appendChild(el("h3", "font-display text-[16px] leading-snug font-semibold tracking-[-.015em] md:text-[16.5px]", p.name));

    body.appendChild(el("span", "badge badge-" + st.key + " self-start", st.label));

    var price = el("div", "mt-auto pt-1");
    var row = el("div", "flex flex-wrap items-baseline gap-x-2");
    row.appendChild(el("span", "font-display text-[19px] font-bold tracking-[-.03em] tabular-nums md:text-[22px]", D.rupiah(p.ecer)));
    row.appendChild(el("span", "text-[13.5px] text-ink3", "/ " + p.unit));
    price.appendChild(row);

    var gross = el("p", "mt-1 flex flex-wrap items-center gap-x-1.5 text-[13px] text-ink2");
    gross.appendChild(document.createTextNode("Grosir"));
    gross.appendChild(el("b", "font-semibold tabular-nums text-brand", D.rupiah(p.grosir)));
    gross.appendChild(document.createTextNode("min. " + p.minGrosir + " " + p.unit));
    price.appendChild(gross);
    body.appendChild(price);

    var actions = el("div", "mt-auto flex items-stretch gap-2 pt-1");
    var pick = el("button", "grid min-h-11 min-w-11 shrink-0 place-items-center rounded-xl transition-colors duration-150 " + (picked
      ? "border border-brand bg-brand text-white"
      : "border border-line2 bg-surface hover:border-ink3 hover:bg-surface2"));
    pick.type = "button";
    pick.setAttribute("aria-pressed", String(picked));
    pick.setAttribute("aria-label", (picked ? "Batalkan pilihan " : "Tambah ") + p.name);
    pick.appendChild(picked
      ? svgIcon("i-check", "size-[18px] scale-110 transition-transform duration-200 ease-swift")
      : svgIcon("i-plus", "size-[18px] transition-transform duration-200 ease-swift"));
    pick.disabled = out;
    if (out) pick.classList.add("opacity-40", "cursor-not-allowed");
    pick.addEventListener("click", function () { togglePick(p.id); });
    actions.appendChild(pick);

    if (out) {
      var dead = el("button", "btn btn-primary btn-sm btn-block", "Stok Kosong");
      dead.type = "button";
      dead.disabled = true;
      actions.appendChild(dead);
    } else {
      var order = el("button", "btn btn-primary btn-sm btn-block");
      order.type = "button";
      order.appendChild(svgIcon("i-wa", "icon-filled size-[18px]"));
      order.appendChild(document.createTextNode("Pesan"));
      order.addEventListener("click", function () { openWa(D.waSingle(p)); });
      actions.appendChild(order);
    }
    body.appendChild(actions);

    card.appendChild(media);
    card.appendChild(body);
    return card;
  }

  /* ------------------------------- pilihan ------------------------------ */
  function itemsPicked() {
    return Object.keys(state.picked).map(function (id) {
      return D.products.find(function (p) { return p.id === id; });
    }).filter(Boolean);
  }

  function togglePick(id) {
    if (state.picked[id]) delete state.picked[id];
    else state.picked[id] = true;
    render();
    renderPickBar();
  }

  function clearPicked() {
    state.picked = {};
    render();
    renderPickBar();
  }

  /* --------------------------------- kisi ------------------------------- */
  var o = {};            // opsi dari mount()
  var io = null;
  var grid = null;

  function observeReveals(root) {
    if (!io) return;
    (root || document).querySelectorAll(".reveal:not(.is-in)").forEach(function (t) { io.observe(t); });
  }

  function render() {
    if (!grid) return;
    var list = select(o.extra);
    var count = list.length;
    var shown = o.choose ? o.choose(list) : list;
    var maxHal = 1;

    if (o.perPage) {
      maxHal = Math.max(1, Math.ceil(shown.length / o.perPage));
      if (state.page > maxHal) state.page = maxHal;
      var dari = (state.page - 1) * o.perPage;
      shown = shown.slice(dari, dari + o.perPage);
    }

    grid.innerHTML = "";
    if (!shown.length) grid.appendChild(kosong());
    else shown.forEach(function (p) { grid.appendChild(productCard(p)); });

    var c = o.count && document.querySelector(o.count);
    if (c) c.textContent = o.countFmt ? o.countFmt(count, shown.length) : count + " produk ditampilkan";

    gambarPager(maxHal);
    renderChips();
    renderLink();
    observeReveals(grid);
    if (o.after) o.after(count, maxHal, state.page);
  }

  function kosong() {
    var empty = el("div", "col-span-full rounded-[18px] border border-dashed border-line2 bg-surface px-6 py-14 text-center");
    empty.appendChild(el("h3", "mb-2 text-[19px]", "Barang tidak ditemukan"));
    empty.appendChild(el("p", "mb-4.5 text-[15px] text-ink2", o.kosongTeks
      || "Coba kata kunci lain, atau tanyakan langsung ke admin lewat WhatsApp."));
    if (adaFilter()) {
      var reset = el("button", "btn btn-ghost btn-sm mb-3", "Hapus semua filter");
      reset.type = "button";
      reset.addEventListener("click", function () { resetFilter(); });
      empty.appendChild(reset);
    }
    var ask = el("button", "btn btn-ghost btn-sm");
    ask.type = "button";
    ask.appendChild(svgIcon("i-wa", "icon-filled size-[18px]"));
    ask.appendChild(document.createTextNode("Tanya Admin"));
    ask.addEventListener("click", function () { openWa(D.waGeneral()); });
    empty.appendChild(ask);
    return empty;
  }

  /* ------------------------------- paginasi ----------------------------- */
  function gambarPager(maxHal) {
    if (!o.pager) return;
    var box = document.querySelector(o.pager);
    if (!box) return;
    box.innerHTML = "";
    if (maxHal <= 1) { box.hidden = true; return; }
    box.hidden = false;

    var buat = function (label, hal, opsi) {
      var b = el("button", "btn btn-sm " + ((opsi && opsi.aktif) ? "btn-primary" : "btn-ghost"), label);
      b.type = "button";
      if (opsi && opsi.aktif) b.setAttribute("aria-current", "page");
      if (opsi && opsi.mati) b.disabled = true;
      if (label === "\u2039") b.setAttribute("aria-label", "Halaman sebelumnya");
      if (label === "\u203a") b.setAttribute("aria-label", "Halaman berikutnya");
      if (hal) b.addEventListener("click", function () {
        state.page = hal;
        render();
        box.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return b;
    };

    box.appendChild(buat("\u2039", state.page - 1, { mati: state.page === 1 }));
    nomorHalaman(maxHal).forEach(function (n) {
      box.appendChild(n === "\u2026"
        ? el("span", "px-1.5 text-ink3", "\u2026")
        : buat(String(n), n, { aktif: n === state.page }));
    });
    box.appendChild(buat("\u203a", state.page + 1, { mati: state.page === maxHal }));
  }

  // Deret 1 … 4 5 6 … 20 supaya tombol tidak membanjiri layar ponsel.
  function nomorHalaman(total) {
    var out = [];
    for (var i = 1; i <= total; i++) {
      if (i === 1 || i === total || Math.abs(i - state.page) <= 1) out.push(i);
      else if (out[out.length - 1] !== "\u2026") out.push("\u2026");
    }
    return out;
  }

  /* ------------------------------ pick bar ------------------------------ */
  function renderPickBar() {
    var item = itemsPicked();
    var total = item.reduce(function (s, p) { return s + p.ecer; }, 0);
    var bar = document.querySelector(o.pickBar || "#pickBar");
    if (!bar) return;

    var cnt = document.querySelector("#pickCount");
    if (cnt) cnt.textContent = item.length + " produk dipilih";
    var tot = document.querySelector("#pickTotal");
    if (tot) tot.textContent = "Perkiraan total " + D.rupiah(total);

    var ada = item.length > 0;
    // translate-y hanya untuk menyembunyikan; saat tampil pakai translate-y-0
    // supaya tidak bergantung pada nilai 140% yang bisa berbeda antar peramban.
    bar.classList.toggle("translate-y-0", ada);
    bar.classList.toggle("translate-y-[140%]", !ada);
    bar.classList.toggle("opacity-0", !ada);
    bar.classList.toggle("pointer-events-none", !ada);
    var fab = document.querySelector("#fab");
    if (fab) fab.classList.toggle("bottom-28", ada);
  }

  /* --------------------------- chip + pencarian ------------------------- */
  function chipKategori(container) {
    var box = document.querySelector(container || o.cats || "#catList");
    if (!box) return;
    box.innerHTML = "";
    D.categories.forEach(function (c) {
      var b = el("button", "chip", c.label);
      b.type = "button";
      b.dataset.cat = c.id;
      b.setAttribute("aria-pressed", String(state.cat === c.id));
      b.addEventListener("click", function () { setCat(c.id); });
      box.appendChild(b);
    });
  }

  function setCat(id) {
    state.cat = id;
    state.page = 1;
    var box = document.querySelector(o.cats || "#catList");
    if (box) box.querySelectorAll(".chip").forEach(function (x) {
      x.setAttribute("aria-pressed", String(x.dataset.cat === id));
    });
    render();
  }

  function syncClear(input, clear) {
    if (!input || !clear) return;
    var ada = input.value.length > 0;
    clear.classList.toggle("grid", ada);
    clear.classList.toggle("hidden", !ada);
  }

  function pasangSearch(input, clear) {
    if (!input) return;
    input.addEventListener("input", function () {
      state.query = input.value;
      state.page = 1;
      syncClear(input, clear);
      render();
    });
    if (clear) clear.addEventListener("click", function () {
      input.value = "";
      state.query = "";
      state.page = 1;
      syncClear(input, clear);
      render();
      input.focus();
    });
  }

  function pasangFilter() {
    var st = o.stock && document.querySelector(o.stock);
    if (st) {
      st.value = state.stock;
      st.addEventListener("change", function () {
        state.stock = st.value;
        state.page = 1;
        render();
      });
    }
    var so = o.sort && document.querySelector(o.sort);
    if (so) {
      so.value = state.sort;
      so.addEventListener("change", function () {
        state.sort = so.value;
        state.page = 1;
        render();
      });
    }
  }

  function resetFilter() {
    state.cat = "semua";
    state.query = "";
    state.stock = "semua";
    state.sort = "default";
    state.page = 1;
    var input = o.search && document.querySelector(o.search);
    if (input) input.value = "";
    syncClear(input, o.clear && document.querySelector(o.clear));
    var st = o.stock && document.querySelector(o.stock);
    if (st) st.value = "semua";
    var so = o.sort && document.querySelector(o.sort);
    if (so) so.value = "default";
    chipKategori(o.cats);
    render();
  }

  function renderChips() {
    if (!o.chips) return;
    var box = document.querySelector(o.chips);
    if (!box) return;
    box.innerHTML = "";

    var tambah = function (label, hapus) {
      var b = el("button", "inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line2 bg-surface px-3 text-[13px] text-ink2 transition-colors duration-150 hover:border-ink3 hover:text-ink", label);
      b.type = "button";
      b.appendChild(svgIcon("i-close", "size-[14px]"));
      b.addEventListener("click", hapus);
      box.appendChild(b);
    };

    if (state.cat !== "semua") tambah("Kategori: " + D.catLabel(state.cat), function () { setCat("semua"); });
    if (state.query.trim()) tambah('Cari: "' + state.query.trim() + '"', function () {
      var input = document.querySelector(o.search);
      if (input) input.value = "";
      state.query = "";
      state.page = 1;
      syncClear(input, document.querySelector(o.clear));
      render();
    });
    if (state.stock !== "semua") tambah("Stok: " + LABEL_STOK[state.stock], function () {
      state.stock = "semua";
      var st = document.querySelector(o.stock);
      if (st) st.value = "semua";
      state.page = 1;
      render();
    });
    if (state.sort !== "default") tambah("Urutan: " + LABEL_URUT[state.sort], function () {
      state.sort = "default";
      var so = document.querySelector(o.sort);
      if (so) so.value = "default";
      state.page = 1;
      render();
    });

    if (box.children.length) {
      var bersih = el("button", "min-h-9 rounded-full px-3 text-[13px] font-semibold text-brand hover:underline", "Hapus semua");
      bersih.type = "button";
      bersih.addEventListener("click", resetFilter);
      box.appendChild(bersih);
    }
    box.hidden = box.children.length === 0;
  }

  /* ------------------------- tautan ke daftar penuh --------------------- */
  // Beranda hanya menampilkan sebagian produk; tautan "Lihat semua produk"
  // ikut membawa filter yang sedang aktif supaya tidak mengulang pilih.
  function renderLink() {
    if (!o.link) return;
    var a = document.querySelector(o.link);
    if (!a) return;
    var q = new URLSearchParams();
    if (state.cat !== "semua") q.set("kategori", state.cat);
    if (state.query.trim()) q.set("cari", state.query.trim());
    if (state.sort !== "default") q.set("urut", state.sort);
    var qs = q.toString();
    a.href = (o.linkHref || "products.html") + (qs ? "?" + qs : "");
  }

  /* -------------------------------- mount ------------------------------- */
  function mount(opts) {
    o = opts || {};
    grid = document.querySelector(o.grid || "#productGrid");
    var search = o.search ? document.querySelector(o.search) : document.querySelector("#searchInput");
    var clear = o.clear ? document.querySelector(o.clear) : document.querySelector("#searchClear");

    if ("IntersectionObserver" in global) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    }

    // Tautan dari beranda: products.html?kategori=beras
    var param = new URLSearchParams((global.location && global.location.search) || "").get("kategori");
    if (param && D.categories.some(function (c) { return c.id === param; })) state.cat = param;

    chipKategori(o.cats);
    pasangSearch(search, clear);
    syncClear(search, clear);
    pasangFilter();

    var pickClear = document.querySelector(o.clearPick || "#pickClear");
    if (pickClear) pickClear.addEventListener("click", clearPicked);
    var pickSend = document.querySelector(o.sendPick || "#pickSend");
    if (pickSend) pickSend.addEventListener("click", function () {
      var item = itemsPicked();
      if (item.length) openWa(D.waMulti(item));
    });

    render();
    renderPickBar();
    return api;
  }

  var api = {
    state: state,
    el: el,
    svgIcon: svgIcon,
    openWa: openWa,
    select: select,
    adaFilter: adaFilter,
    productCard: productCard,
    render: render,
    renderPickBar: renderPickBar,
    renderLink: renderLink,
    resetFilter: resetFilter,
    clearPicked: clearPicked,
    itemsPicked: itemsPicked,
    mount: mount
  };

  global.KATALOG = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);

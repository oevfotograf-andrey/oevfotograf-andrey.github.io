(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  // -----------------------------
  // Theme
  // -----------------------------
  const root = document.documentElement;
  const themeToggle = $("#themeToggle");
  const themeLabel = $("#themeLabel");
  const savedTheme = localStorage.getItem("fotografie-stuttgart-theme");

  function setTheme(theme) {
    root.dataset.theme = theme;
    themeLabel.textContent = theme === "dark" ? "Hell" : "Dunkel";
    localStorage.setItem("fotografie-stuttgart-theme", theme);
  }

  setTheme(savedTheme || "dark");

  themeToggle.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  // -----------------------------
  // Portfolio gallery
  // -----------------------------
  // Die Dateien können später einfach ersetzt/erweitert werden.
  // Aktuelle neue Serie: 8 Aufnahmen.
  const photos = [
    {
      id: 1,
      file: "s-bahn-423-839-01.jpg",
      category: "sbahn",
      location: "Stuttgart",
      date: "2026-08-18",
      kicker: "S-BAHN · SERIE 01",
      title: "423 839 am Bahnsteig",
      description: "Ein S-Bahn-Triebzug der Baureihe 423 unter der Bahnsteigüberdachung."
    },
    {
      id: 2,
      file: "s-bahn-423-839-02.jpg",
      category: "sbahn",
      location: "Stuttgart",
      date: "2026-08-18",
      kicker: "S-BAHN · SERIE 01",
      title: "Linie, Bahnsteig, Bewegung",
      description: "Die lange Fahrzeugflucht und die Bahnsteigkante führen den Blick tief in das Motiv."
    },
    {
      id: 3,
      file: "s-bahn-423-839-03.jpg",
      category: "sbahn",
      location: "Stuttgart",
      date: "2026-08-18",
      kicker: "S-BAHN · SERIE 01",
      title: "Frontansicht 423 839",
      description: "Eine nähere Perspektive auf die markante Front des S-Bahn-Triebzugs."
    },
    {
      id: 4,
      file: "s-bahn-423-839-04.jpg",
      category: "sbahn",
      location: "Stuttgart",
      date: "2026-08-18",
      kicker: "S-BAHN · SERIE 01",
      title: "Am Bahnsteig entlang",
      description: "Die Seitenansicht des Zuges verschwindet in der Perspektive der Bahnsteigkante."
    },
    {
      id: 5,
      file: "s-bahn-423-839-05.jpg",
      category: "sbahn",
      location: "Stuttgart",
      date: "2026-08-18",
      kicker: "S-BAHN · SERIE 01",
      title: "Nah dran",
      description: "Ein enger Ausschnitt der Front mit dem Fahrzeug 423 839."
    },
    {
      id: 6,
      file: "s-bahn-kupplung-01.jpg",
      category: "sbahn",
      location: "Stuttgart",
      date: "2026-08-18",
      kicker: "S-BAHN · DETAIL",
      title: "Zwischen zwei Triebzügen",
      description: "Ein ungewöhnlicher Blick genau in den Bereich zwischen zwei gekuppelten Fahrzeugen."
    },
    {
      id: 7,
      file: "s-bahn-kupplung-02.jpg",
      category: "sbahn",
      location: "Stuttgart",
      date: "2026-08-18",
      kicker: "S-BAHN · DETAIL",
      title: "Kupplung im Detail",
      description: "Die beiden Fahrzeugenden bilden einen schmalen Blickkorridor auf das Grün hinter dem Zug."
    },
    {
      id: 8,
      file: "s-bahn-kupplung-03.jpg",
      category: "sbahn",
      location: "Stuttgart",
      date: "2026-08-18",
      kicker: "S-BAHN · INTERIEUR",
      title: "Blick aus dem Zug",
      description: "Die gleiche ungewöhnliche Perspektive aus dem Inneren des Fahrzeugs."
    },

    // Ältere Archivkarten – von neuer nach älter sortiert.
    {
      id: 9,
      file: "calw-regional-warten-an-der-endstation.jpg",
      category: "regional",
      location: "Calw",
      date: "2026-08-17",
      kicker: "REGIONAL · CALW",
      title: "Calw/Regional/Warten an der Endstation",
      description: "Ein ruhiger Moment an der Endstation in Calw."
    },
    {
      id: 10,
      file: "regionalbahn-im-nordschwarzwald.jpg",
      category: "regional",
      location: "Nordschwarzwald",
      date: "2026-08-16",
      kicker: "REGIONAL · NORDSCHWARZWALD",
      title: "Regionalbahn im Nordschwarzwald",
      description: "Eine Regionalbahn unterwegs im Nordschwarzwald."
    },
    {
      id: 11,
      file: "letzte-fahrt-in-der-innenstadt.jpg",
      category: "bus",
      location: "Stuttgart",
      date: "2026-08-15",
      kicker: "BUS · STUTTGART",
      title: "Letzte Fahrt in der Innenstadt",
      description: "Ein Bus auf seiner letzten Fahrt durch die Stuttgarter Innenstadt."
    },
    {
      id: 12,
      file: "im-sonnenuntergang.jpg",
      category: "sbahn",
      location: "Stuttgart",
      date: "2026-08-14",
      kicker: "S-BAHN · STUTTGART",
      title: "Im Sonnenuntergang",
      description: "Ein ÖPNV-Moment im warmen Licht des Sonnenuntergangs."
    },
    {
      id: 13,
      file: "linien-treffen-sich.jpg",
      category: "tram",
      location: "Stuttgart",
      date: "2026-08-13",
      kicker: "TRAM · STUTTGART",
      title: "Linien treffen sich",
      description: "Zwei Linien treffen sich in einem gemeinsamen Moment im Stuttgarter Netz."
    },
    {
      id: 14,
      file: "tageslicht-an-der-stadtbahn.jpg",
      category: "tram",
      location: "Stuttgart",
      date: "2026-08-12",
      kicker: "TRAM · STUTTGART",
      title: "Tageslicht an der Stadtbahn",
      description: "Eine Stadtbahnaufnahme bei klarem Tageslicht."
    }
  ];

  const gallery = $("#gallery");
  const sortSelect = $("#sortSelect");
  let activeFilter = "all";
  let sortMode = "newest";
  let visiblePhotos = [];
  let currentLightboxIndex = 0;

  function dateValue(photo) {
    return new Date(`${photo.date}T12:00:00`).getTime();
  }

  function sortedPhotos(list) {
    return [...list].sort((a, b) => {
      const diff = dateValue(a) - dateValue(b);
      if (diff !== 0) return sortMode === "newest" ? -diff : diff;
      return sortMode === "newest" ? b.id - a.id : a.id - b.id;
    });
  }

  function filteredPhotos() {
    const filtered = photos.filter(
      photo => activeFilter === "all" || photo.category === activeFilter
    );
    return sortedPhotos(filtered);
  }

  function imagePath(photo) {
    return `images/gallery/${photo.file}`;
  }

  function renderGallery() {
    visiblePhotos = filteredPhotos();
    gallery.innerHTML = "";

    if (!visiblePhotos.length) {
      gallery.innerHTML = `<div class="gallery-empty">Keine Bilder in dieser Kategorie.</div>`;
      return;
    }

    visiblePhotos.forEach((photo, index) => {
      const card = document.createElement("article");
      card.className = "photo-card";
      card.dataset.category = photo.category;
      card.dataset.index = String(index);
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute(
        "aria-label",
        `${photo.title}, Großansicht öffnen`
      );

      const wrap = document.createElement("div");
      wrap.className = "photo-image-wrap";

      const img = document.createElement("img");
      img.className = "photo-image";

    if (photo.file === "letzte-fahrt-in-der-innenstadt.jpg") {
  img.classList.add("train-photo");
}
      
      img.loading = index < 3 ? "eager" : "lazy";
      img.decoding = "async";
      img.src = imagePath(photo);
      img.alt = photo.title;

      const fallback = document.createElement("div");
      fallback.className = "photo-fallback";
      fallback.innerHTML = `
        <div>
          <strong>${photo.title}</strong>
          <span>${photo.file}</span>
        </div>
      `;

      // Die CSS-Regel .photo-fallback verwendet display:grid.
      // Deshalb wird die Fallback-Anzeige hier ausdrücklich
      // ausgeblendet, solange das echte Foto geladen werden kann.
      fallback.hidden = true;
      fallback.style.display = "none";

      img.addEventListener("load", () => {
        img.hidden = false;
        img.style.display = "block";

        fallback.hidden = true;
        fallback.style.display = "none";
      });

      img.addEventListener("error", () => {
        img.hidden = true;
        img.style.display = "none";

        fallback.hidden = false;
        fallback.style.display = "grid";
      });

      const overlay = document.createElement("div");
      overlay.className = "card-overlay";
      overlay.textContent = "Klick für Großansicht";

      wrap.append(img, fallback, overlay);

      const meta = document.createElement("div");
      meta.className = "card-meta";
      meta.innerHTML = `
        <span>${photo.location}</span>
        <span>${categoryName(photo.category)}</span>
      `;

      const title = document.createElement("h3");
      title.textContent = photo.title;

      card.append(wrap, meta, title);

      card.addEventListener("click", () => openLightbox(index));

      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(index);
        }
      });

      gallery.appendChild(card);
    });
  }

  function categoryName(category) {
    return ({
      all: "ÖPNV",
      tram: "Tram",
      bus: "Bus",
      sbahn: "S-Bahn",
      regional: "Regional"
    })[category] || category;
  }

  $$(".filter").forEach(button => {
    button.addEventListener("click", () => {
      $$(".filter").forEach(b => b.classList.remove("active"));

      button.classList.add("active");
      activeFilter = button.dataset.filter;

      renderGallery();
      gallery.scrollTop = 0;
    });
  });

  sortSelect.addEventListener("change", () => {
    sortMode = sortSelect.value;

    renderGallery();
    gallery.scrollTop = 0;
  });

  // Desktop: Mausrad bewegt die Galerie vertikal.
  gallery.addEventListener(
    "wheel",
    (event) => {
      if (
        window.innerWidth > 900 &&
        Math.abs(event.deltaY) > Math.abs(event.deltaX)
      ) {
        event.preventDefault();

        gallery.scrollBy({
          top: event.deltaY * 1.15,
          behavior: "auto"
        });
      }
    },
    { passive: false }
  );

  // -----------------------------
  // Lightbox
  // -----------------------------
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxKicker = $("#lightboxKicker");
  const lightboxTitle = $("#lightboxTitle");
  const lightboxDescription = $("#lightboxDescription");
  const lightboxCounter = $("#lightboxCounter");

  function openLightbox(index) {
    if (!visiblePhotos.length) return;

    currentLightboxIndex = index;

    updateLightbox();

    lightbox.classList.remove("hidden");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("no-scroll");

    $("#lightboxClose").focus();
  }

  function closeLightbox() {
    lightbox.classList.add("hidden");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.classList.remove("no-scroll");
  }

  function updateLightbox() {
    const photo = visiblePhotos[currentLightboxIndex];

    lightboxImage.src = imagePath(photo);
    lightboxImage.alt = photo.title;

    lightboxKicker.textContent = photo.kicker;
    lightboxTitle.textContent = photo.title;
    lightboxDescription.textContent = photo.description;

    lightboxCounter.textContent =
      `${currentLightboxIndex + 1} / ${visiblePhotos.length}`;
  }

  function nextPhoto() {
    currentLightboxIndex =
      (currentLightboxIndex + 1) % visiblePhotos.length;

    updateLightbox();
  }

  function previousPhoto() {
    currentLightboxIndex =
      (currentLightboxIndex - 1 + visiblePhotos.length) %
      visiblePhotos.length;

    updateLightbox();
  }

  $("#lightboxClose").addEventListener("click", closeLightbox);
  $("#lightboxNext").addEventListener("click", nextPhoto);
  $("#lightboxPrev").addEventListener("click", previousPhoto);

  lightbox.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-lightbox]")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.classList.contains("hidden")) return;

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowRight") {
      nextPhoto();
    }

    if (event.key === "ArrowLeft") {
      previousPhoto();
    }
  });

  let touchStartX = 0;
  let touchStartY = 0;

  lightbox.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.changedTouches[0];

      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    },
    { passive: true }
  );

  lightbox.addEventListener(
    "touchend",
    (event) => {
      const touch = event.changedTouches[0];

      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;

      if (
        Math.abs(dx) > 55 &&
        Math.abs(dx) > Math.abs(dy)
      ) {
        dx < 0 ? nextPhoto() : previousPhoto();
      }
    },
    { passive: true }
  );

  // -----------------------------
  // EXIF / GPS
  // Lightweight JPEG EXIF parser
  // -----------------------------
  const input = $("#photoInput");
  const dropzone = $("#dropzone");
  const result = $("#exifResult");
  const preview = $("#previewImage");
  const mapButton = $("#mapButton");

  let currentGps = null;

  const TAGS = {
    0x010E: "ImageDescription",
    0x010F: "Make",
    0x0110: "Model",
    0x0112: "Orientation",
    0x0131: "Software",
    0x013B: "Artist",
    0x8298: "Copyright",
    0x8769: "ExifIFDPointer",
    0x8825: "GPSInfoIFDPointer",
    0x9003: "DateTimeOriginal",
    0x9004: "CreateDate",
    0x920A: "FocalLength",
    0x829A: "ExposureTime",
    0x829D: "FNumber",
    0x8827: "ISO",
    0xA001: "ColorSpace",
    0xA002: "PixelXDimension",
    0xA003: "PixelYDimension",
    0xA434: "LensModel",
    0xA435: "LensSerialNumber",
    0x0001: "GPSLatitudeRef",
    0x0002: "GPSLatitude",
    0x0003: "GPSLongitudeRef",
    0x0004: "GPSLongitude",
    0x0005: "GPSAltitudeRef",
    0x0006: "GPSAltitude",
    0x0007: "GPSTimeStamp",
    0x0010: "GPSImgDirectionRef",
    0x0011: "GPSImgDirection",
    0x001D: "GPSDateStamp"
  };

  function readU16(view, offset, little) {
    return view.getUint16(offset, little);
  }

  function readU32(view, offset, little) {
    return view.getUint32(offset, little);
  }

  function typeSize(type) {
    return ({
      1: 1,
      2: 1,
      3: 2,
      4: 4,
      5: 8,
      7: 1,
      9: 4,
      10: 8
    })[type] || 1;
  }

  function rational(view, offset, little, signed = false) {
    const num = signed
      ? view.getInt32(offset, little)
      : view.getUint32(offset, little);

    const den = signed
      ? view.getInt32(offset + 4, little)
      : view.getUint32(offset + 4, little);

    return den ? num / den : null;
  }

  function readValue(
    view,
    entryOffset,
    type,
    count,
    tiffStart,
    little
  ) {
    const size = typeSize(type) * count;

    const valueOffset =
      size <= 4
        ? entryOffset + 8
        : tiffStart + readU32(view, entryOffset + 8, little);

    if (
      valueOffset < 0 ||
      valueOffset >= view.byteLength
    ) {
      return null;
    }

    if (type === 2) {
      const chars = [];

      for (
        let i = 0;
        i < count && valueOffset + i < view.byteLength;
        i++
      ) {
        const c = view.getUint8(valueOffset + i);

        if (c === 0) break;

        chars.push(String.fromCharCode(c));
      }

      return chars.join("").trim();
    }

    if (type === 1 || type === 7) {
      return Array.from(
        { length: count },
        (_, i) => view.getUint8(valueOffset + i)
      );
    }

    if (type === 3) {
      const arr = [];

      for (let i = 0; i < count; i++) {
        arr.push(
          readU16(
            view,
            valueOffset + i * 2,
            little
          )
        );
      }

      return count === 1 ? arr[0] : arr;
    }

    if (type === 4) {
      const arr = [];

      for (let i = 0; i < count; i++) {
        arr.push(
          readU32(
            view,
            valueOffset + i * 4,
            little
          )
        );
      }

      return count === 1 ? arr[0] : arr;
    }

    if (type === 5) {
      const arr = [];

      for (let i = 0; i < count; i++) {
        arr.push(
          rational(
            view,
            valueOffset + i * 8,
            little
          )
        );
      }

      return count === 1 ? arr[0] : arr;
    }

    if (type === 9) {
      const arr = [];

      for (let i = 0; i < count; i++) {
        arr.push(
          view.getInt32(
            valueOffset + i * 4,
            little
          )
        );
      }

      return count === 1 ? arr[0] : arr;
    }

    if (type === 10) {
      const arr = [];

      for (let i = 0; i < count; i++) {
        arr.push(
          rational(
            view,
            valueOffset + i * 8,
            little,
            true
          )
        );
      }

      return count === 1 ? arr[0] : arr;
    }

    return null;
  }

  function parseIFD(
    view,
    tiffStart,
    ifdOffset,
    little,
    limit = 0
  ) {
    if (limit > 8) return {};

    const absolute = tiffStart + ifdOffset;

    if (
      absolute < 0 ||
      absolute + 2 > view.byteLength
    ) {
      return {};
    }

    const count = readU16(view, absolute, little);
    const out = {};

    for (let i = 0; i < count; i++) {
      const entry = absolute + 2 + i * 12;

      if (entry + 12 > view.byteLength) break;

      const tag = readU16(view, entry, little);
      const type = readU16(view, entry + 2, little);
      const n = readU32(view, entry + 4, little);

      const name =
        TAGS[tag] ||
        `Tag_0x${tag.toString(16)}`;

      try {
        out[name] = readValue(
          view,
          entry,
          type,
          n,
          tiffStart,
          little
        );
      } catch (_) {
        out[name] = null;
      }
    }

    return out;
  }

  function findExif(bytes) {
    if (
      bytes.length < 4 ||
      bytes[0] !== 0xFF ||
      bytes[1] !== 0xD8
    ) {
      return null;
    }

    let offset = 2;

    while (offset + 4 <= bytes.length) {
      if (bytes[offset] !== 0xFF) {
        offset++;
        continue;
      }

      const marker = bytes[offset + 1];
      offset += 2;

      if (
        marker === 0xDA ||
        marker === 0xD9
      ) {
        break;
      }

      if (offset + 2 > bytes.length) break;

      const length =
        (bytes[offset] << 8) |
        bytes[offset + 1];

      if (
        length < 2 ||
        offset + length > bytes.length
      ) {
        break;
      }

      if (marker === 0xE1) {
        const start = offset + 2;

        if (
          start + 6 <= bytes.length &&
          bytes[start] === 0x45 &&
          bytes[start + 1] === 0x78 &&
          bytes[start + 2] === 0x69 &&
          bytes[start + 3] === 0x66 &&
          bytes[start + 4] === 0 &&
          bytes[start + 5] === 0
        ) {
          return bytes.slice(
            start + 6,
            offset + length
          );
        }
      }

      offset += length;
    }

    return null;
  }

  function parseExif(buffer) {
    const bytes = new Uint8Array(buffer);
    const exif = findExif(bytes);

    if (!exif) return {};

    const view = new DataView(
      exif.buffer,
      exif.byteOffset,
      exif.byteLength
    );

    if (view.byteLength < 8) return {};

    const endian = String.fromCharCode(
      view.getUint8(0),
      view.getUint8(1)
    );

    const little = endian === "II";

    if (
      !little &&
      endian !== "MM"
    ) {
      return {};
    }

    if (
      readU16(view, 2, little) !== 42
    ) {
      return {};
    }

    const ifd0 = parseIFD(
      view,
      0,
      readU32(view, 4, little),
      little
    );

    const all = {
      ...ifd0
    };

    if (
      typeof ifd0.ExifIFDPointer === "number"
    ) {
      Object.assign(
        all,
        parseIFD(
          view,
          0,
          ifd0.ExifIFDPointer,
          little,
          1
        )
      );
    }

    if (
      typeof ifd0.GPSInfoIFDPointer === "number"
    ) {
      Object.assign(
        all,
        parseIFD(
          view,
          0,
          ifd0.GPSInfoIFDPointer,
          little,
          1
        )
      );
    }

    return all;
  }

  function formatNumber(value, digits = 2) {
    return typeof value === "number" &&
      Number.isFinite(value)
      ? value
          .toFixed(digits)
          .replace(/\.?0+$/, "")
      : "—";
  }

  function formatExposure(value) {
    if (
      !Number.isFinite(value) ||
      value <= 0
    ) {
      return "—";
    }

    if (value >= 1) {
      return `${formatNumber(value, 2)} s`;
    }

    return `1/${Math.round(1 / value)} s`;
  }

  function formatFocal(value) {
    return Number.isFinite(value)
      ? `${formatNumber(value, 1)} mm`
      : "—";
  }

  function formatAperture(value) {
    return Number.isFinite(value)
      ? `f/${formatNumber(value, 1)}`
      : "—";
  }

  function dmsToDecimal(dms, ref) {
    if (
      !Array.isArray(dms) ||
      dms.length < 3
    ) {
      return null;
    }

    const deg = Number(dms[0]);
    const min = Number(dms[1]);
    const sec = Number(dms[2]);

    if (
      ![
        deg,
        min,
        sec
      ].every(Number.isFinite)
    ) {
      return null;
    }

    let decimal =
      deg +
      min / 60 +
      sec / 3600;

    if (
      String(ref).toUpperCase() === "S" ||
      String(ref).toUpperCase() === "W"
    ) {
      decimal *= -1;
    }

    return decimal;
  }

  function directionName(degrees) {
    if (!Number.isFinite(degrees)) {
      return "—";
    }

    const dirs = [
      "Nord",
      "Nordost",
      "Ost",
      "Südost",
      "Süd",
      "Südwest",
      "West",
      "Nordwest"
    ];

    return dirs[
      Math.round(
        (((degrees % 360) + 360) % 360) / 45
      ) % 8
    ];
  }

  function setText(id, value) {
    const el = document.getElementById(id);

    if (el) {
      el.textContent = value || "—";
    }
  }

  async function reverseGeocode(lat, lon) {
    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?format=jsonv2` +
      `&lat=${encodeURIComponent(lat)}` +
      `&lon=${encodeURIComponent(lon)}` +
      `&zoom=18` +
      `&addressdetails=1`;

    try {
      const response = await fetch(
        url,
        {
          headers: {
            "Accept": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(
          "Geocoding fehlgeschlagen"
        );
      }

      const data = await response.json();

      return (
        data.display_name ||
        "Adresse nicht gefunden"
      );
    } catch (_) {
      return "Straßenname konnte nicht abgerufen werden";
    }
  }

  function buildMapUrl(lat, lon) {
    const delta = 0.004;

    const bbox = [
      lon - delta,
      lat - delta,
      lon + delta,
      lat + delta
    ].join("%2C");

    return (
      `https://www.openstreetmap.org/export/embed.html` +
      `?bbox=${bbox}` +
      `&layer=mapnik` +
      `&marker=${encodeURIComponent(lat)}` +
      `%2C${encodeURIComponent(lon)}`
    );
  }

  async function analyzeFile(file) {
    if (!file) return;

    if (
      !/^image\/(jpeg|jpg|tiff)$/i.test(file.type) &&
      !/\.(jpe?g|tiff?)$/i.test(file.name)
    ) {
      alert(
        "Bitte möglichst ein JPEG-Foto auswählen. " +
        "Dieses EXIF Lab liest EXIF aus JPEG-Dateien."
      );

      return;
    }

    const objectUrl =
      URL.createObjectURL(file);

    preview.src = objectUrl;

    $("#previewFile").textContent =
      file.name;

    result.classList.remove("hidden");

    $("#exifStatus").textContent =
      "Analyse…";

    try {
      const buffer =
        await file.arrayBuffer();

      const exif =
        parseExif(buffer);

      setText(
        "camera",
        [
          exif.Make || "",
          exif.Model || ""
        ]
          .filter(Boolean)
          .join(" ") ||
          "Nicht vorhanden"
      );

      setText(
        "lens",
        exif.LensModel ||
        "Nicht vorhanden"
      );

      setText(
        "shutter",
        formatExposure(
          Number(exif.ExposureTime)
        )
      );

      setText(
        "aperture",
        formatAperture(
          Number(exif.FNumber)
        )
      );

      setText(
        "iso",
        exif.ISO
          ? `ISO ${exif.ISO}`
          : "Nicht vorhanden"
      );

      setText(
        "focal",
        formatFocal(
          Number(exif.FocalLength)
        )
      );

      setText(
        "author",
        exif.Artist ||
        "Nicht vorhanden"
      );

      setText(
        "copyright",
        exif.Copyright ||
        "Nicht vorhanden"
      );

      setText(
        "dateTaken",
        exif.DateTimeOriginal ||
        exif.CreateDate ||
        "Nicht vorhanden"
      );

      const bearing =
        Number(exif.GPSImgDirection);

      setText(
        "direction",
        Number.isFinite(bearing)
          ? `${directionName(bearing)} (${formatNumber(bearing, 0)}°)`
          : "Nicht vorhanden"
      );

      const lat = dmsToDecimal(
        exif.GPSLatitude,
        exif.GPSLatitudeRef
      );

      const lon = dmsToDecimal(
        exif.GPSLongitude,
        exif.GPSLongitudeRef
      );

      currentGps =
        lat !== null &&
        lon !== null
          ? {
              lat,
              lon,
              bearing
            }
          : null;

      if (currentGps) {
        setText(
          "coordinates",
          `${lat.toFixed(6)}, ${lon.toFixed(6)}`
        );

        $("#locationName").textContent =
          "Adresse wird ermittelt…";

        mapButton.disabled = false;

        const address =
          await reverseGeocode(
            lat,
            lon
          );

        $("#locationName").textContent =
          address;

        $("#exifStatus").textContent =
          "EXIF + GPS gefunden";
      } else {
        setText(
          "coordinates",
          "Keine GPS-Koordinaten in der Datei"
        );

        $("#locationName").textContent =
          "Kein GPS gefunden";

        mapButton.disabled = true;

        $("#exifStatus").textContent =
          Object.keys(exif).length
            ? "EXIF gefunden"
            : "Keine EXIF-Daten";
      }
    } catch (error) {
      console.error(error);

      $("#exifStatus").textContent =
        "Analysefehler";

      alert(
        "Die Datei konnte nicht analysiert werden. " +
        "Bitte prüfe, ob es sich um ein gültiges JPEG handelt."
      );
    }
  }

  input.addEventListener(
    "change",
    (event) =>
      analyzeFile(
        event.target.files[0]
      )
  );

  ["dragenter", "dragover"].forEach(
    (type) => {
      dropzone.addEventListener(
        type,
        (event) => {
          event.preventDefault();

          dropzone.classList.add(
            "dragover"
          );
        }
      );
    }
  );

  ["dragleave", "drop"].forEach(
    (type) => {
      dropzone.addEventListener(
        type,
        (event) => {
          event.preventDefault();

          dropzone.classList.remove(
            "dragover"
          );
        }
      );
    }
  );

  dropzone.addEventListener(
    "drop",
    (event) =>
      analyzeFile(
        event.dataTransfer.files[0]
      )
  );

  dropzone.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        input.click();
      }
    }
  );

  mapButton.addEventListener(
    "click",
    () => {
      if (!currentGps) return;

      const url = buildMapUrl(
        currentGps.lat,
        currentGps.lon
      );

      const existing =
        document.getElementById(
          "mapFrame"
        );

      if (existing) {
        existing.remove();
      }

      const frame =
        document.createElement(
          "iframe"
        );

      frame.id = "mapFrame";
      frame.title =
        "Aufnahmeort auf OpenStreetMap";
      frame.loading = "lazy";

      frame.style.cssText =
        "width:100%;" +
        "height:360px;" +
        "border:0;" +
        "border-radius:16px;" +
        "margin-top:16px;" +
        "background:#ddd";

      frame.src = url;

      $(".gps-box").insertAdjacentElement(
        "afterend",
        frame
      );

      frame.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  );

  $("#year").textContent =
    new Date().getFullYear();

  renderGallery();
})();

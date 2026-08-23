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
  // Neue Archivserie: 10 Originalaufnahmen.
  const photos = [
    {
      id: 1,
      file: "IMG_0431.JPG",
      category: "tram",
      location: "Stuttgart",
      sortDate: "2026-08-20",
      kicker: "TRAM · STUTTGART",
      title: "Linien treffen sich",
      sortOrder: 13,
      description: "Zwei Stuttgarter Stadtbahnen treffen sich an einer Kreuzung im Stadtverkehr."
    },
    {
      id: 2,
      file: "IMG_1685(1).JPG",
      category: "bus",
      location: "Stuttgart",
      sortDate: "2026-08-20",
      featuredOrder: 4,
      kicker: "BUS · STUTTGART",
      title: "Letzte Fahrt in der Innenstadt",
      sortOrder: 11,
      description: "Ein roter Gelenkbus unterwegs im Stuttgarter Innenstadtverkehr."
    },
    {
      id: 3,
      file: "IMG_2247.JPG",
      category: "regional",
      location: "Nordschwarzwald",
      sortDate: "2026-08-20",
      featuredOrder: 2,
      kicker: "REGIONAL · NORDSCHWARZWALD",
      title: "Regionalbahn im Nordschwarzwald",
      sortOrder: 9,
      description: "Ein moderner Regionaltriebzug auf der Strecke durch den Nordschwarzwald."
    },
    {
      id: 4,
      file: "IMG_2263.JPG",
      category: "bus",
      location: "Calw",
      sortDate: "2026-08-20",
      kicker: "BUS · CALW",
      title: "Im tiefen Calwer ZOB",
      sortOrder: 8,
      description: "Ein weißer Mercedes-Benz-Bus im geschützten Bereich des Calwer ZOB."
    },
    {
      id: 5,
      file: "IMG_2244(1).JPG",
      category: "regional",
      location: "Nordschwarzwald",
      sortDate: "2026-08-20",
      kicker: "REGIONAL · NORDSCHWARZWALD",
      title: "Neue Eisenbahn im Hang",
      sortOrder: 7,
      description: "Der neue Regionaltriebzug folgt der Strecke am bewaldeten Hang entlang."
    },
    {
      id: 6,
      file: "IMG_2297.JPG",
      category: "bus",
      location: "Nordschwarzwald",
      sortDate: "2026-08-20",
      kicker: "BUS · NORDSCHWARZWALD",
      title: "Schnappschuss vom Zug",
      sortOrder: 6,
      description: "Ein farbenfroher Regionalbus im Vorbeifahren."
    },
    {
      id: 7,
      file: "IMG_2322.JPG",
      category: "sbahn",
      location: "Stuttgart",
      sortDate: "2026-08-20",
      kicker: "S-BAHN · STUTTGART",
      title: "Am Bahnsteig entlang",
      sortOrder: 5,
      description: "Ein S-Bahn-Zug zieht sich entlang des Bahnsteigs in die Tiefe des Motivs."
    },
    {
      id: 8,
      file: "IMG_2328.JPG",
      category: "sbahn",
      location: "Stuttgart",
      sortDate: "2026-08-20",
      kicker: "S-BAHN · STUTTGART",
      title: "Nah dran",
      sortOrder: 4,
      description: "Eine nahe Perspektive auf die Front des S-Bahn-Triebzugs."
    },
    {
      id: 9,
      file: "IMG_2330.JPG",
      category: "sbahn",
      location: "Stuttgart",
      sortDate: "2026-08-20",
      kicker: "S-BAHN · DETAIL",
      title: "Zwischen zwei Triebzügen",
      sortOrder: 3,
      description: "Ein ungewöhnlicher Blick genau in den schmalen Raum zwischen zwei Fahrzeugen."
    },
    {
      id: 10,
      file: "IMG_2329.JPG",
      category: "sbahn",
      location: "Stuttgart",
      sortDate: "2026-08-20",
      kicker: "S-BAHN · DETAIL",
      title: "Kupplung im Detail",
      sortOrder: 2,
      description: "Die beiden Fahrzeugenden und ihre Kupplungen aus unmittelbarer Nähe."
    },
    {
      id: 0,
      file: "s-bahn-kupplung-03.jpg",
      category: "sbahn",
      location: "Stuttgart",
      sortDate: "2026-08-20",
      featuredOrder: 1,
      kicker: "S-BAHN · INTERIEUR",
      title: "Blick aus dem Zug",
      sortOrder: 1,
      description: "Die gleiche ungewöhnliche Perspektive aus dem Inneren des Fahrzeugs."
    },
    {
      id: 12,
      file: "IMG_2288.JPG",
      category: "regional",
      location: "Calw",
      sortDate: "2026-08-20",
      featuredOrder: 3,
      kicker: "REGIONAL · CALW",
      title: "Warten an der Endstation",
      sortOrder: 10,
      description: "Ein ruhiger Moment an der Endstation in Calw."
    },
    {
      id: 13,
      file: "im-sonnenuntergang.jpg",
      category: "sbahn",
      location: "Stuttgart",
      date: "2026-08-14",
      kicker: "S-BAHN · STUTTGART",
      title: "Im Sonnenuntergang",
      sortOrder: 12,
      description: "Ein ÖPNV-Moment im warmen Licht des Sonnenuntergangs."
    },
    {
      id: 14,
      file: "TAGESLICHT-AN-DER-STADTBAHN.JPG",
      category: "tram",
      location: "Stuttgart",
      date: "2026-08-12",
      kicker: "TRAM · STUTTGART",
      title: "Tageslicht an der Stadtbahn",
      sortOrder: 14,
      description: "Eine Stadtbahnaufnahme bei klarem Tageslicht."
    }
  ];

  const gallery = $("#gallery");
  const sortSelect = $("#sortSelect");
  const galleryCount = $("#galleryCount");
  let activeFilter = "all";
  let sortMode = "newest";
  let visiblePhotos = [];
  let currentLightboxIndex = 0;
  const galleryFavoriteIds = new Set();
  let galleryFavoriteBusy = false;

  function galleryFavoriteId(photo) {
    return `gallery-photo-${photo.id}`;
  }

  function isGalleryFavorite(photo) {
    return galleryFavoriteIds.has(galleryFavoriteId(photo));
  }

  function updateLightboxFavoriteControl() {
    const button = $("#lightboxFavorite");
    const photo = visiblePhotos[currentLightboxIndex];
    if (!button) return;

    if (!photo) {
      button.hidden = true;
      return;
    }

    button.hidden = false;
    const saved = isGalleryFavorite(photo);
    button.classList.toggle("is-saved", saved);
    button.setAttribute("aria-pressed", String(saved));
    button.textContent = saved
      ? "★ Gespeichert"
      : "☆ Zu Favoriten";
    button.setAttribute(
      "aria-label",
      saved
        ? `${photo.title} aus Favoriten entfernen`
        : `${photo.title} zu Favoriten speichern`
    );
  }

  // Die Favoriten-Schaltfläche befindet sich bewusst nur in der Großansicht.
  // So bleiben die Fotokarten in der Galerie frei von überlagernden Bedienelementen.
  function syncGalleryFavoriteControls() {
    updateLightboxFavoriteControl();
  }

  function dateValue(photo) {
    const value = photo.sortDate || photo.date;
    return value ? new Date(`${value}T12:00:00`).getTime() : 0;
  }

  // Die feste Reihenfolge für „Neueste zuerst“ ist bewusst redaktionell
  // definiert. Sie darf nicht automatisch aus Dateinamen, Upload-Zeit oder
  // EXIF-Datum neu berechnet werden. „Älteste zuerst“ zeigt exakt dieselbe
  // Reihenfolge rückwärts.
  function sortedPhotos(list) {
    return [...list].sort((a, b) => {
      // Feste Standardreihenfolge für „Neueste zuerst“.
      // Diese Reihenfolge entspricht bewusst der gewünschten
      // Reihenfolge der Fotokarten und bleibt unabhängig von
      // Dateinamen oder Upload-Reihenfolge stabil.
      const aOrder = Number.isFinite(a.sortOrder)
        ? a.sortOrder
        : Number.POSITIVE_INFINITY;
      const bOrder = Number.isFinite(b.sortOrder)
        ? b.sortOrder
        : Number.POSITIVE_INFINITY;

      if (aOrder !== bOrder) {
        return sortMode === "newest"
          ? aOrder - bOrder
          : bOrder - aOrder;
      }

      const diff = dateValue(a) - dateValue(b);
      if (diff !== 0) {
        return sortMode === "newest" ? -diff : diff;
      }

      return sortMode === "newest"
        ? b.id - a.id
        : a.id - b.id;
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

  function updateGalleryCount() {
    if (!galleryCount) return;
    const total = visiblePhotos.length;
    galleryCount.textContent =
      activeFilter === "all"
        ? `${total} ${total === 1 ? "Foto" : "Fotos"}`
        : `${total} von ${photos.length} Fotos`;
  }

  function updateGalleryScrollState() {
    if (!gallery) return;

    const scrollable = gallery.scrollHeight > gallery.clientHeight + 2;
    const atTop = gallery.scrollTop <= 1;
    const atBottom =
      gallery.scrollTop + gallery.clientHeight >=
      gallery.scrollHeight - 2;

    gallery.classList.toggle("is-scrollable", scrollable);
    gallery.classList.toggle("at-top", atTop);
    gallery.classList.toggle("at-bottom", atBottom);
  }


  function renderGallery() {
    visiblePhotos = filteredPhotos();
    gallery.innerHTML = "";
    updateGalleryCount();

    if (!visiblePhotos.length) {
      gallery.innerHTML = `<div class="gallery-empty">Keine Bilder in dieser Kategorie.</div>`;
      return;
    }

    visiblePhotos.forEach((photo, index) => {
      const card = document.createElement("article");
      card.className = "photo-card";
      if (photo.title === "Tageslicht an der Stadtbahn") {
        card.classList.add("card-tageslicht");
      }
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
      img.loading = index < 6 ? "eager" : "lazy";
      img.decoding = "async";
      img.src = imagePath(photo);
      img.alt = photo.title;
      if (photo.id === 9) img.style.objectPosition = "31% center";

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

    requestAnimationFrame(updateGalleryScrollState);
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
      requestAnimationFrame(updateGalleryScrollState);
    });
  });

  sortSelect.value = sortMode;

  sortSelect.addEventListener("change", () => {
    sortMode = sortSelect.value;

    renderGallery();
    gallery.scrollTop = 0;
    requestAnimationFrame(updateGalleryScrollState);
  });

  gallery.addEventListener("scroll", updateGalleryScrollState, { passive: true });
  window.addEventListener("resize", updateGalleryScrollState);

  // Desktop: Das Mausrad steuert die Galerie nur solange sie in die
  // gewünschte Richtung noch weiter scrollen kann. Am oberen/unteren Ende
  // übernimmt wieder die normale Seitenscrollung.
  gallery.addEventListener(
    "wheel",
    (event) => {
      if (
        window.innerWidth <= 900 ||
        Math.abs(event.deltaY) <= Math.abs(event.deltaX)
      ) {
        return;
      }

      const atTop = gallery.scrollTop <= 0;
      const atBottom =
        gallery.scrollTop + gallery.clientHeight >=
        gallery.scrollHeight - 1;

      const wantsDown = event.deltaY > 0;
      const canScroll =
        (wantsDown && !atBottom) || (!wantsDown && !atTop);

      if (!canScroll) return;

      event.preventDefault();
      gallery.scrollBy({
        top: event.deltaY * 1.15,
        behavior: "auto"
      });
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

    updateLightboxFavoriteControl();

    // Das nächste und vorherige Bild werden vorsichtig vorgeladen,
    // damit die Navigation in der Großansicht möglichst direkt reagiert.
    if (visiblePhotos.length > 1) {
      const nextIndex =
        (currentLightboxIndex + 1) % visiblePhotos.length;
      const prevIndex =
        (currentLightboxIndex - 1 + visiblePhotos.length) %
        visiblePhotos.length;

      [nextIndex, prevIndex].forEach(index => {
        const preload = new Image();
        preload.src = imagePath(visiblePhotos[index]);
      });
    }

    const dialog = document.querySelector(".lightbox-dialog");
    if (dialog && window.innerWidth <= 600) {
      dialog.scrollTop = 0;
    }
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

  const lightboxFavorite = $("#lightboxFavorite");
  if (lightboxFavorite) {
    lightboxFavorite.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const photo = visiblePhotos[currentLightboxIndex];
      if (!photo) return;
      await toggleGalleryFavorite(photo, lightboxFavorite);
    });
  }

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
  let lightboxSwipeAllowed = false;

  lightbox.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.changedTouches[0];
      const target = event.target;

      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      lightboxSwipeAllowed = !target.closest(
        ".lightbox-close, .lightbox-arrow, .lightbox-favorite"
      );
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
        lightboxSwipeAllowed &&
        Math.abs(dx) > 62 &&
        Math.abs(dx) > Math.abs(dy) * 1.35
      ) {
        dx < 0 ? nextPhoto() : previousPhoto();
      }

      lightboxSwipeAllowed = false;
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
  const favoriteButton = $("#favoriteButton");
  const favoriteHint = $("#favoriteHint");

  let currentGps = null;
  let currentAnalyzedFile = null;
  let currentFavoriteId = null;
  let currentLocationName = "";
  let previewObjectUrl = null;
  let analysisToken = 0;

  function clearInlineMap() {
    const existing = document.getElementById("mapFrame");
    if (existing) existing.remove();
  }

  function setMapButtonState(button, hasGps, labels = {}) {
    if (!button) return;

    const availableLabel =
      labels.available || "Auf Karte zeigen";
    const unavailableLabel =
      labels.unavailable || "Keine GPS-Daten vorhanden";

    button.hidden = false;
    button.disabled = !hasGps;
    button.setAttribute(
      "aria-disabled",
      String(!hasGps)
    );
    button.textContent = hasGps
      ? availableLabel
      : unavailableLabel;
  }

  function formatExifDate(value) {
    const raw = String(value || "").trim();
    const match = raw.match(
      /^(\d{4}):(\d{2}):(\d{2})(?:\s+(\d{2}:\d{2}:\d{2}))?$/
    );

    if (!match) return raw || "Nicht vorhanden";

    return match[4]
      ? `${match[3]}.${match[2]}.${match[1]} · ${match[4]}`
      : `${match[3]}.${match[2]}.${match[1]}`;
  }

  const FAVORITES_DB = "fotografie-stuttgart-favorites";
  const FAVORITES_STORE = "photos";
  const FAVORITES_VERSION = 1;
  // Version 4 repariert zusätzlich gespeicherte EXIF-Lab-Favoriten mit
  // einer bereits bekannten Adresse, aber ohne GPS-Objekt. Falls die Bilddatei
  // selbst nicht erneut auslesbar ist, wird die konkrete gespeicherte Adresse
  // einmal zur Wiederherstellung der Koordinaten verwendet.
  const FAVORITES_METADATA_VERSION = 4;
  // Die Initialreparatur darf nicht parallel mit einem Löschvorgang laufen.
  // Sonst kann ein bereits gelöschter Datensatz aus einer zuvor gelesenen,
  // veralteten Reparaturkopie erneut in IndexedDB zurückgeschrieben werden.
  let favoritesInitializationPromise = null;
  const favoriteDeleteLocks = new Set();

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

    const controller =
      typeof AbortController !== "undefined"
        ? new AbortController()
        : null;

    const timeout = controller
      ? setTimeout(() => controller.abort(), 8000)
      : null;

    try {
      const response = await fetch(
        url,
        {
          headers: {
            "Accept": "application/json"
          },
          signal: controller ? controller.signal : undefined
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
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }

  async function geocodeStoredLocation(locationName) {
    const query = String(locationName || "").trim();
    if (!query || shouldRefreshLocationName(query)) return null;

    const url =
      `https://nominatim.openstreetmap.org/search` +
      `?format=jsonv2` +
      `&limit=1` +
      `&q=${encodeURIComponent(query)}`;

    const controller =
      typeof AbortController !== "undefined"
        ? new AbortController()
        : null;

    const timeout = controller
      ? setTimeout(() => controller.abort(), 8000)
      : null;

    try {
      const response = await fetch(url, {
        headers: { "Accept": "application/json" },
        signal: controller ? controller.signal : undefined
      });

      if (!response.ok) return null;
      const results = await response.json();
      const first = Array.isArray(results) ? results[0] : null;
      const lat = Number(first && first.lat);
      const lon = Number(first && first.lon);

      return Number.isFinite(lat) && Number.isFinite(lon)
        ? { lat, lon, bearing: null }
        : null;
    } finally {
      if (timeout) clearTimeout(timeout);
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


  // -----------------------------
  // Lokale Favoriten / IndexedDB
  // -----------------------------
  function favoriteIdFor(file) {
    return [file.name, file.size, file.lastModified].join("__");
  }

  function openFavoritesDb() {
    return new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) {
        reject(new Error("IndexedDB nicht verfügbar"));
        return;
      }

      const request = indexedDB.open(FAVORITES_DB, FAVORITES_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(FAVORITES_STORE)) {
          db.createObjectStore(FAVORITES_STORE, { keyPath: "id" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function favoriteDbGet(id) {
    const db = await openFavoritesDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(FAVORITES_STORE, "readonly");
      const request = tx.objectStore(FAVORITES_STORE).get(id);
      let result = null;

      request.onsuccess = () => {
        result = request.result || null;
      };
      request.onerror = () => reject(request.error || tx.error);
      tx.onabort = () => reject(tx.error || new Error("Favorit konnte nicht geladen werden"));
      tx.onerror = () => reject(tx.error || new Error("Favorit konnte nicht geladen werden"));
      tx.oncomplete = () => {
        try { db.close(); } catch (_) {}
        resolve(result);
      };
    });
  }

  async function favoriteDbGetAll() {
    const db = await openFavoritesDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(FAVORITES_STORE, "readonly");
      const request = tx.objectStore(FAVORITES_STORE).getAll();
      let result = [];

      request.onsuccess = () => {
        result = request.result || [];
      };
      request.onerror = () => reject(request.error || tx.error);
      tx.onabort = () => reject(tx.error || new Error("Favoriten konnten nicht geladen werden"));
      tx.onerror = () => reject(tx.error || new Error("Favoriten konnten nicht geladen werden"));
      tx.oncomplete = () => {
        try { db.close(); } catch (_) {}
        resolve(result);
      };
    });
  }

  async function favoriteDbPut(record) {
    const db = await openFavoritesDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(FAVORITES_STORE, "readwrite");
      tx.objectStore(FAVORITES_STORE).put(record);
      tx.oncomplete = () => { try { db.close(); } catch (_) {} resolve(); };
      tx.onerror = () => { try { db.close(); } catch (_) {} reject(tx.error); };
      tx.onabort = () => { try { db.close(); } catch (_) {} reject(tx.error || new Error("Favorit konnte nicht gespeichert werden")); };
    });
  }

  async function favoriteDbDelete(id) {
    if (id === null || id === undefined || id === "") {
      throw new Error("Ungültige Favoriten-ID");
    }

    const db = await openFavoritesDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(FAVORITES_STORE, "readwrite");
      const store = tx.objectStore(FAVORITES_STORE);
      store.delete(id);

      tx.oncomplete = () => {
        try { db.close(); } catch (_) {}
        resolve();
      };
      tx.onabort = () => {
        const error = tx.error || new Error("Favorit konnte nicht entfernt werden");
        try { db.close(); } catch (_) {}
        reject(error);
      };
      tx.onerror = () => {
        const error = tx.error || new Error("Favorit konnte nicht entfernt werden");
        try { db.close(); } catch (_) {}
        reject(error);
      };
    });
  }

  async function deleteFavoriteRecord(id) {
    if (id === null || id === undefined || id === "") {
      throw new Error("Ungültige Favoriten-ID");
    }

    // Warten, bis eine beim Seitenstart laufende Reparatur vollständig beendet ist.
    // Dadurch kann sie keinen gelöschten Datensatz mehr aus einer alten Kopie
    // zurückschreiben.
    if (favoritesInitializationPromise) {
      try {
        await favoritesInitializationPromise;
      } catch (_) {
        // Ein Reparaturfehler darf das gezielte Löschen nicht blockieren.
      }
    }

    const key = String(id);
    if (favoriteDeleteLocks.has(key)) return;
    favoriteDeleteLocks.add(key);

    try {
      await favoriteDbDelete(id);

      // Exakte Kontrolle nur für diesen einen Schlüssel.
      const remaining = await favoriteDbGet(id);
      if (remaining) {
        await favoriteDbDelete(id);
        const retryRemaining = await favoriteDbGet(id);
        if (retryRemaining) {
          throw new Error("Favorit wurde nach dem Löschen weiterhin gefunden");
        }
      }
    } finally {
      favoriteDeleteLocks.delete(key);
    }
  }

  async function refreshGalleryFavoriteState() {
    try {
      const items = await favoriteDbGetAll();
      galleryFavoriteIds.clear();
      items.forEach((item) => {
        if (
          typeof item.id === "string" &&
          item.id.startsWith("gallery-photo-")
        ) {
          galleryFavoriteIds.add(item.id);
        }
      });
    } catch (error) {
      console.warn("Galerie-Favoriten konnten nicht geladen werden", error);
      galleryFavoriteIds.clear();
    }

    syncGalleryFavoriteControls();
  }

  async function refreshFavoriteViews(selectedId = null, locationSelectedId = null) {
    const results = await Promise.allSettled([
      renderFavoriteLibrary(selectedId),
      renderFavoriteLocations(locationSelectedId)
    ]);

    results.forEach((result) => {
      if (result.status === "rejected") {
        console.warn("Favoritenansicht konnte nicht aktualisiert werden", result.reason);
      }
    });
  }

  function galleryFavoriteMetadata(photo, exif) {
    const dateTaken =
      exif.DateTimeOriginal ||
      exif.CreateDate ||
      photo.sortDate ||
      photo.date ||
      "Nicht vorhanden";

    const bearing = Number(exif.GPSImgDirection);

    return {
      camera:
        [exif.Make || "", exif.Model || ""]
          .filter(Boolean)
          .join(" ") || "Nicht vorhanden",
      lens: exif.LensModel || "Nicht vorhanden",
      shutter: formatExposure(Number(exif.ExposureTime)) || "Nicht vorhanden",
      aperture: formatAperture(Number(exif.FNumber)) || "Nicht vorhanden",
      iso: Number.isFinite(Number(exif.ISO))
        ? String(exif.ISO)
        : "Nicht vorhanden",
      focal: formatFocal(Number(exif.FocalLength)) || "Nicht vorhanden",
      author: exif.Artist || "Nicht vorhanden",
      copyright: exif.Copyright || "Nicht vorhanden",
      dateTaken,
      direction: Number.isFinite(bearing)
        ? `${directionName(bearing)} · ${formatNumber(bearing, 0)}°`
        : "Nicht vorhanden"
    };
  }

  function favoriteMetadataFromExif(exif, fallback = {}) {
    const dateValue =
      exif.DateTimeOriginal ||
      exif.CreateDate ||
      fallback.dateTaken ||
      "";

    const bearing = Number(exif.GPSImgDirection);

    return {
      camera:
        [exif.Make || "", exif.Model || ""]
          .filter(Boolean)
          .join(" ") ||
        fallback.camera ||
        "Nicht vorhanden",
      lens: exif.LensModel || fallback.lens || "Nicht vorhanden",
      shutter:
        formatExposure(Number(exif.ExposureTime)) !== "—"
          ? formatExposure(Number(exif.ExposureTime))
          : fallback.shutter || "Nicht vorhanden",
      aperture:
        formatAperture(Number(exif.FNumber)) !== "—"
          ? formatAperture(Number(exif.FNumber))
          : fallback.aperture || "Nicht vorhanden",
      iso: Number.isFinite(Number(exif.ISO))
        ? `ISO ${exif.ISO}`
        : fallback.iso || "Nicht vorhanden",
      focal:
        formatFocal(Number(exif.FocalLength)) !== "—"
          ? formatFocal(Number(exif.FocalLength))
          : fallback.focal || "Nicht vorhanden",
      author: exif.Artist || fallback.author || "Nicht vorhanden",
      copyright: exif.Copyright || fallback.copyright || "Nicht vorhanden",
      dateTaken: dateValue
        ? formatExifDate(dateValue)
        : fallback.dateTaken || "Nicht vorhanden",
      direction: Number.isFinite(bearing)
        ? `${directionName(bearing)} · ${formatNumber(bearing, 0)}°`
        : fallback.direction || "Nicht vorhanden"
    };
  }

  function gpsFromExif(exif) {
    const lat = dmsToDecimal(
      exif.GPSLatitude,
      exif.GPSLatitudeRef
    );
    const lon = dmsToDecimal(
      exif.GPSLongitude,
      exif.GPSLongitudeRef
    );
    const bearing = Number(exif.GPSImgDirection);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return null;
    }

    return {
      lat: Number(lat),
      lon: Number(lon),
      bearing: Number.isFinite(bearing) ? bearing : null
    };
  }

  function hasValidFavoriteGps(item) {
    return Boolean(
      item &&
      item.gps &&
      Number.isFinite(Number(item.gps.lat)) &&
      Number.isFinite(Number(item.gps.lon))
    );
  }

  function needsFavoriteRepair(item) {
    if (!item) return false;

    // Version 3 wird bewusst auch für bereits reparierte V2-Favoriten ausgeführt.
    // Damit werden Fälle korrigiert, in denen eine Adresse gespeichert war,
    // die GPS-Koordinaten im Favoriten aber fehlten oder unvollständig waren.
    if (Number(item.metadataVersion) < FAVORITES_METADATA_VERSION) {
      return true;
    }

    return Boolean(
      String(item.locationName || "").trim() &&
      !hasValidFavoriteGps(item)
    );
  }

  async function exifFromFavoriteRecord(item) {
    if (item && item.imageBlob && typeof item.imageBlob.arrayBuffer === "function") {
      const buffer = await item.imageBlob.arrayBuffer();
      const exif = parseExif(buffer);
      if (Object.keys(exif).length) {
        return { exif, imageBlob: item.imageBlob };
      }
    }

    // Fallback für ältere Galeriefavoriten: das aktuelle Original erneut laden.
    if (item && item.source === "gallery") {
      const photo = photos.find((entry) => entry.id === item.photoId);
      if (photo) {
        const response = await fetch(imagePath(photo), { cache: "no-store" });
        if (response.ok) {
          const imageBlob = await response.blob();
          const exif = parseExif(await imageBlob.arrayBuffer());
          if (Object.keys(exif).length) {
            return { exif, imageBlob };
          }
        }
      }
    }

    return { exif: {}, imageBlob: item && item.imageBlob };
  }

  function shouldRefreshLocationName(value) {
    const text = String(value || "").trim();
    return !text ||
      text === "Kein GPS gespeichert" ||
      text === "Keine GPS-Daten vorhanden" ||
      text === "Kein Ort verfügbar" ||
      /^[-+]?\d+(?:\.\d+)?,\s*[-+]?\d+(?:\.\d+)?$/.test(text);
  }

  async function repairFavoriteRecord(item) {
    if (!item || !needsFavoriteRepair(item)) {
      return item;
    }

    let source;
    try {
      source = await exifFromFavoriteRecord(item);
    } catch (error) {
      console.warn("Favoriten-EXIF konnte nicht erneut gelesen werden", error);
      return { ...item, metadataVersion: FAVORITES_METADATA_VERSION };
    }

    const exif = source.exif || {};
    const repaired = {
      ...item,
      imageBlob: source.imageBlob || item.imageBlob,
      metadataVersion: FAVORITES_METADATA_VERSION
    };

    if (Object.keys(exif).length) {
      repaired.metadata = favoriteMetadataFromExif(exif, item.metadata || {});

      const gps = gpsFromExif(exif);
      if (gps) {
        repaired.gps = gps;
      }

      // Eine bereits vorhandene, gültige GPS-Position bleibt erhalten, falls
      // die erneute EXIF-Auswertung ausnahmsweise keine GPS-Daten liefern sollte.
      if (hasValidFavoriteGps(item) && !hasValidFavoriteGps(repaired)) {
        repaired.gps = item.gps;
      }

      if (
        hasValidFavoriteGps(repaired) &&
        shouldRefreshLocationName(repaired.locationName)
      ) {
        try {
          repaired.locationName = await reverseGeocode(
            Number(repaired.gps.lat),
            Number(repaired.gps.lon)
          );
        } catch (error) {
          console.warn("Adresse für reparierten Favoriten konnte nicht ermittelt werden", error);
        }
      }
    }

    // EXIF-Lab-Favoriten können aus einer früheren Version bereits eine
    // konkrete Straßenadresse besitzen, obwohl die Koordinaten damals nicht
    // mitgespeichert wurden. Diese Adresse ist ausreichend, um die Position
    // einmal wiederherzustellen. Für reine Galeriefavoriten wird bewusst kein
    // generischer Ortsname wie „Stuttgart“ in GPS umgewandelt.
    if (
      !hasValidFavoriteGps(repaired) &&
      repaired.source !== "gallery" &&
      String(repaired.locationName || "").trim() &&
      !shouldRefreshLocationName(repaired.locationName)
    ) {
      try {
        const restoredGps = await geocodeStoredLocation(repaired.locationName);
        if (restoredGps) repaired.gps = restoredGps;
      } catch (error) {
        console.warn("Koordinaten aus gespeichertem Aufnahmeort konnten nicht wiederhergestellt werden", error);
      }
    }

    // Generische Galeriekategorien sind kein echter GPS-Aufnahmeort.
    if (repaired.source === "gallery" && !hasValidFavoriteGps(repaired)) {
      repaired.locationName = "";
    }

    return repaired;
  }

  async function repairStoredFavorites() {
    let items = [];
    try {
      items = await favoriteDbGetAll();
    } catch (error) {
      console.warn("Lokale Favoriten konnten nicht für EXIF-Reparatur geladen werden", error);
      return;
    }

    for (const item of items) {
      if (!needsFavoriteRepair(item)) continue;

      const repaired = await repairFavoriteRecord(item);
      try {
        await favoriteDbPut(repaired);
      } catch (error) {
        console.warn("Reparierter Favorit konnte nicht gespeichert werden", error);
      }
    }
  }

  async function buildGalleryFavoriteRecord(photo) {
    const response = await fetch(imagePath(photo), {
      cache: "force-cache"
    });

    if (!response.ok) {
      throw new Error(`Bild konnte nicht geladen werden (${response.status})`);
    }

    const imageBlob = await response.blob();
    const buffer = await imageBlob.arrayBuffer();
    const exif = parseExif(buffer);

    const lat = dmsToDecimal(
      exif.GPSLatitude,
      exif.GPSLatitudeRef
    );
    const lon = dmsToDecimal(
      exif.GPSLongitude,
      exif.GPSLongitudeRef
    );
    const bearing = Number(exif.GPSImgDirection);

    const hasGps =
      Number.isFinite(lat) &&
      Number.isFinite(lon);

    const gps = hasGps
      ? {
          lat: Number(lat),
          lon: Number(lon),
          bearing: Number.isFinite(bearing) ? bearing : null
        }
      : null;

    let locationName = "";
    if (hasGps) {
      try {
        locationName = await reverseGeocode(gps.lat, gps.lon);
      } catch (error) {
        console.warn("Adresse für Galerie-Favorit konnte nicht ermittelt werden", error);
      }
    }

    return {
      id: galleryFavoriteId(photo),
      fileName: photo.title,
      originalFileName: photo.file,
      source: "gallery",
      photoId: photo.id,
      imageBlob,
      mime: imageBlob.type || "image/jpeg",
      savedAt: Date.now(),
      metadata: favoriteMetadataFromExif(
        exif,
        galleryFavoriteMetadata(photo, exif)
      ),
      metadataVersion: FAVORITES_METADATA_VERSION,
      locationName,
      gps
    };
  }

  async function toggleGalleryFavorite(photo, control = null) {
    if (!photo || galleryFavoriteBusy) return;

    const id = galleryFavoriteId(photo);
    const button = control || $("#lightboxFavorite");
    galleryFavoriteBusy = true;

    if (button) {
      button.disabled = true;
      button.textContent = isGalleryFavorite(photo)
        ? "Entfernen…"
        : "Speichern…";
    }

    try {
      if (isGalleryFavorite(photo)) {
        await deleteFavoriteRecord(id);
        galleryFavoriteIds.delete(id);
        await refreshFavoriteViews(null, null);
      } else {
        const record = await buildGalleryFavoriteRecord(photo);
        await favoriteDbPut(record);
        galleryFavoriteIds.add(id);
        await refreshFavoriteViews(id, record.gps ? id : null);
      }

      syncGalleryFavoriteControls();
    } catch (error) {
      console.error("Galerie-Favorit konnte nicht geändert werden", error);
      alert(
        "Dieses Galeriefoto konnte nicht lokal gespeichert werden. " +
        "Prüfe den verfügbaren Speicher und lade die Seite anschließend neu."
      );
      await refreshGalleryFavoriteState();
    } finally {
      galleryFavoriteBusy = false;
      if (button) button.disabled = false;
      syncGalleryFavoriteControls();
    }
  }

  function updateFavoriteButton(saved) {
    if (!favoriteButton) return;
    favoriteButton.disabled = !currentAnalyzedFile;
    favoriteButton.textContent = saved
      ? "Aus Favoriten entfernen"
      : "☆ Zu Favoriten speichern";
    favoriteButton.classList.toggle("is-saved", Boolean(saved));
    favoriteButton.setAttribute("aria-pressed", String(Boolean(saved)));

    if (favoriteHint) {
      favoriteHint.textContent = !currentAnalyzedFile
        ? "Analysiere ein Foto, um es lokal auf diesem Gerät zu speichern."
        : saved
          ? "Dieses Foto ist lokal auf diesem Gerät gespeichert."
          : currentGps
            ? "Das Foto kann lokal gespeichert und mit seinem GPS-Ort unter „Aufnahmeorte“ angezeigt werden."
            : "Das Foto kann lokal gespeichert werden. Ohne GPS erscheint es nicht auf der Karte.";
    }
  }

  function favoriteAddressText(item) {
    if (item.locationName) return item.locationName;
    if (item.gps) return `${Number(item.gps.lat).toFixed(6)}, ${Number(item.gps.lon).toFixed(6)}`;
    return "Kein GPS gespeichert";
  }

  function favoriteDirectionText(item) {
    const bearing = Number(item.gps && item.gps.bearing);
    return Number.isFinite(bearing)
      ? `${directionName(bearing)} · ${formatNumber(bearing, 0)}°`
      : "Blickrichtung nicht vorhanden";
  }

  function setLocationMap(item) {
    const frame = $("#locationMapFrame");
    const empty = $("#locationMapEmpty");
    const caption = $("#locationMapCaption");
    if (!frame || !empty || !caption) return;

    if (!item || !item.gps) {
      frame.classList.add("hidden");
      frame.removeAttribute("src");
      empty.classList.remove("hidden");
      caption.classList.add("hidden");
      return;
    }

    frame.src = buildMapUrl(Number(item.gps.lat), Number(item.gps.lon));
    empty.classList.add("hidden");
    frame.classList.remove("hidden");
    caption.classList.remove("hidden");
    $("#locationMapTitle").textContent = item.fileName;
    $("#locationMapMeta").textContent = `${favoriteAddressText(item)} · ${favoriteDirectionText(item)}`;
  }

  async function renderFavoriteLocations(selectedId = null) {
    const container = $("#favoriteLocations");
    if (!container) return;

    let items = [];
    try {
      items = await favoriteDbGetAll();
    } catch (error) {
      console.warn("Favoriten konnten nicht geladen werden", error);
      container.innerHTML = '<p class="favorite-empty">Lokaler Favoritenspeicher ist in diesem Browser nicht verfügbar.</p>';
      setLocationMap(null);
      return;
    }

    items = items.filter((item) =>
      hasValidFavoriteGps(item) ||
      Boolean(String(item.locationName || "").trim())
    ).sort((a, b) => Number(b.savedAt || 0) - Number(a.savedAt || 0));

    container.innerHTML = "";

    if (!items.length) {
      container.innerHTML = '<p class="favorite-empty">Noch keine Fotos mit gespeichertem Aufnahmeort in den lokalen Favoriten vorhanden.</p>';
      setLocationMap(null);
      return;
    }

    const selected = items.find((item) => item.id === selectedId) || items[0];

    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "favorite-location-card" + (item.id === selected.id ? " active" : "");
      row.tabIndex = 0;
      row.setAttribute("role", "button");

      const image = document.createElement("img");
      image.alt = "";
      image.loading = "lazy";
      if (item.imageBlob) {
        const url = URL.createObjectURL(item.imageBlob);
        image.src = url;
        image.addEventListener("load", () => setTimeout(() => URL.revokeObjectURL(url), 0), { once: true });
      }

      const info = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = item.fileName;
      const meta = document.createElement("span");
      meta.textContent = favoriteAddressText(item);
      info.append(title, meta);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "favorite-remove";
      remove.setAttribute("aria-label", `${item.fileName} aus Favoriten entfernen`);
      remove.textContent = "×";

      const choose = () => {
        setLocationMap(item);
        container.querySelectorAll(".favorite-location-card").forEach((card) => card.classList.remove("active"));
        row.classList.add("active");
        renderFavoriteLibrary(item.id);
      };

      row.addEventListener("click", choose);
      row.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          choose();
        }
      });

      remove.addEventListener("click", async (event) => {
        event.stopPropagation();
        const targetId = item.id;
        remove.disabled = true;
        try {
          await deleteFavoriteRecord(targetId);
          if (typeof targetId === "string" && targetId.startsWith("gallery-photo-")) {
            galleryFavoriteIds.delete(targetId);
            syncGalleryFavoriteControls();
          }
          if (currentFavoriteId === targetId) {
            currentFavoriteId = null;
            updateFavoriteButton(false);
          }
          await Promise.all([
            renderFavoriteLocations(null),
            renderFavoriteLibrary(null)
          ]);
        } catch (error) {
          console.error(error);
          alert("Der Favorit konnte nicht entfernt werden.");
          remove.disabled = false;
        }
      });

      row.append(image, info, remove);
      container.appendChild(row);
    });

    setLocationMap(selected);
  }

  const FAVORITE_METADATA_LABELS = [
    ["camera", "KAMERA"],
    ["lens", "OBJEKTIV"],
    ["shutter", "BELICHTUNGSZEIT"],
    ["aperture", "BLENDE"],
    ["iso", "ISO"],
    ["focal", "BRENNWEITE"],
    ["author", "AUTOR"],
    ["copyright", "COPYRIGHT"],
    ["dateTaken", "AUFNAHMEDATUM"],
    ["direction", "BLICKRICHTUNG"]
  ];

  function favoriteObjectUrl(blob, image) {
    if (!blob || !image) return;
    const url = URL.createObjectURL(blob);
    image.src = url;
    image.addEventListener(
      "load",
      () => setTimeout(() => URL.revokeObjectURL(url), 0),
      { once: true }
    );
  }

  function favoriteDateText(item) {
    const value = Number(item.savedAt || 0);
    if (!value) return "Lokal gespeichert";
    try {
      return new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).format(new Date(value));
    } catch (_) {
      return "Lokal gespeichert";
    }
  }

  async function renderFavoriteLibrary(selectedId = null) {
    const strip = $("#favoriteLibrary");
    const count = $("#favoriteLibraryCount");
    const detail = $("#favoriteDetail");
    if (!strip || !count || !detail) return;

    let items = [];
    try {
      items = await favoriteDbGetAll();
    } catch (error) {
      console.warn("Favoriten konnten nicht geladen werden", error);
      strip.innerHTML = '<p class="favorite-empty">Lokaler Favoritenspeicher ist in diesem Browser nicht verfügbar.</p>';
      count.textContent = "0 Fotos";
      detail.classList.add("hidden");
      return;
    }

    items = items.sort((a, b) => Number(b.savedAt || 0) - Number(a.savedAt || 0));
    count.textContent = `${items.length} ${items.length === 1 ? "Foto" : "Fotos"}`;
    strip.innerHTML = "";

    if (!items.length) {
      strip.innerHTML = '<p class="favorite-empty">Noch keine Fotos in den lokalen Favoriten gespeichert.</p>';
      detail.classList.add("hidden");
      return;
    }

    const selected = items.find((item) => item.id === selectedId) || items[0];

    items.forEach((item) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "favorite-library-card" + (item.id === selected.id ? " active" : "");
      card.setAttribute("aria-label", `${item.fileName} öffnen`);

      const image = document.createElement("img");
      image.alt = "";
      image.loading = "lazy";
      favoriteObjectUrl(item.imageBlob, image);

      const title = document.createElement("strong");
      title.textContent = item.fileName;

      const meta = document.createElement("span");
      meta.textContent = hasValidFavoriteGps(item)
        ? favoriteAddressText(item)
        : `Ohne GPS · ${favoriteDateText(item)}`;

      card.append(image, title, meta);
      card.addEventListener("click", () => {
        renderFavoriteLibrary(item.id);
        if (hasValidFavoriteGps(item)) {
          renderFavoriteLocations(item.id);
        }
      });
      strip.appendChild(card);
    });

    detail.classList.remove("hidden");
    $("#favoriteDetailTitle").textContent = selected.fileName;
    const detailImage = $("#favoriteDetailImage");
    detailImage.alt = selected.fileName;
    detailImage.removeAttribute("src");
    favoriteObjectUrl(selected.imageBlob, detailImage);

    const metadataContainer = $("#favoriteDetailMetadata");
    metadataContainer.innerHTML = "";
    FAVORITE_METADATA_LABELS.forEach(([key, label]) => {
      const row = document.createElement("div");
      row.className = "favorite-detail-meta";
      const name = document.createElement("span");
      name.textContent = label;
      const value = document.createElement("strong");
      value.textContent = (selected.metadata && selected.metadata[key]) || "Nicht vorhanden";
      row.append(name, value);
      metadataContainer.appendChild(row);
    });

    const selectedHasGps = hasValidFavoriteGps(selected);

    $("#favoriteDetailLocation").textContent = selectedHasGps
      ? favoriteAddressText(selected)
      : "Kein GPS gespeichert";

    const coordinates = $("#favoriteDetailCoordinates");
    if (coordinates) {
      if (selectedHasGps) {
        coordinates.hidden = false;
        coordinates.textContent = `${favoriteCoordinatesText(selected)} · ${favoriteDirectionText(selected)}`;
      } else {
        // Kein zusätzlicher Hinweistext für Fotos ohne GPS anzeigen.
        coordinates.textContent = "";
        coordinates.hidden = true;
      }
    }

    const locationHint = $("#favoriteDetailLocationHint");
    if (locationHint) {
      locationHint.hidden = !selectedHasGps;
      locationHint.textContent = "Sie können den Standort des Fotos in der Kategorie „03 / Aufnahmeorte“ nachsehen.";
    }

    const removeButton = $("#favoriteDetailRemove");
    removeButton.disabled = false;
    removeButton.onclick = async () => {
      const targetId = selected.id;
      removeButton.disabled = true;
      removeButton.textContent = "Entfernen…";

      try {
        await deleteFavoriteRecord(targetId);

        // Nur genau diesen Favoriten aus dem Galerie-Zwischenspeicher entfernen.
        if (typeof targetId === "string" && targetId.startsWith("gallery-photo-")) {
          galleryFavoriteIds.delete(targetId);
          syncGalleryFavoriteControls();
        }
        if (currentFavoriteId === targetId) {
          currentFavoriteId = null;
          updateFavoriteButton(false);
        }

        await Promise.all([
          renderFavoriteLibrary(null),
          renderFavoriteLocations(null)
        ]);
      } catch (error) {
        console.error(error);
        alert("Der Favorit konnte nicht entfernt werden.");
      } finally {
        removeButton.disabled = false;
        removeButton.textContent = "Aus Favoriten entfernen";
      }
    };
  }

  async function saveCurrentFavorite() {
    if (!currentAnalyzedFile || !favoriteButton) return;

    const id = favoriteIdFor(currentAnalyzedFile);
    let alreadySaved = false;

    try {
      alreadySaved = Boolean(await favoriteDbGet(id));
    } catch (error) {
      console.error("Favoritenstatus konnte nicht geprüft werden", error);
      updateFavoriteButton(false);
      alert("Der lokale Favoritenspeicher ist in diesem Browser nicht verfügbar.");
      return;
    }

    favoriteButton.disabled = true;
    favoriteButton.textContent = alreadySaved ? "Entfernen…" : "Speichern…";

    try {
      if (alreadySaved) {
        await deleteFavoriteRecord(id);
        const stillSaved = await favoriteDbGet(id);
        if (stillSaved) {
          throw new Error("Favorit wurde nicht entfernt");
        }

        currentFavoriteId = id;
        updateFavoriteButton(false);
        await refreshFavoriteViews(null, null);
        return;
      }

      const metadata = {
        camera: $("#camera").textContent,
        lens: $("#lens").textContent,
        shutter: $("#shutter").textContent,
        aperture: $("#aperture").textContent,
        iso: $("#iso").textContent,
        focal: $("#focal").textContent,
        author: $("#author").textContent,
        copyright: $("#copyright").textContent,
        dateTaken: $("#dateTaken").textContent,
        direction: $("#direction").textContent
      };

      const record = {
        id,
        fileName: currentAnalyzedFile.name,
        imageBlob: currentAnalyzedFile,
        mime: currentAnalyzedFile.type,
        savedAt: Date.now(),
        metadata,
        metadataVersion: FAVORITES_METADATA_VERSION,
        locationName: currentLocationName || "",
        gps: currentGps ? {
          lat: Number(currentGps.lat),
          lon: Number(currentGps.lon),
          bearing: Number.isFinite(Number(currentGps.bearing)) ? Number(currentGps.bearing) : null
        } : null
      };

      await favoriteDbPut(record);

      // Erst nach erfolgreicher Verifikation gilt der Speichervorgang als erfolgreich.
      const savedRecord = await favoriteDbGet(id);
      if (!savedRecord) {
        throw new Error("Favorit wurde nach dem Speichern nicht gefunden");
      }

      currentFavoriteId = id;
      updateFavoriteButton(true);

      // Fehler beim Neuzeichnen der Ansichten dürfen keinen falschen Speicherfehler auslösen.
      await refreshFavoriteViews(id, currentGps ? id : null);
    } catch (error) {
      console.error("Favorit konnte nicht geändert werden", error);
      let actuallySaved = false;
      try {
        actuallySaved = Boolean(await favoriteDbGet(id));
      } catch (_) {}
      updateFavoriteButton(actuallySaved);

      if (!actuallySaved) {
        alert("Das Foto konnte nicht lokal gespeichert werden. Prüfe den verfügbaren Speicher des Browsers.");
      }
    } finally {
      if (favoriteButton) {
        favoriteButton.disabled = !currentAnalyzedFile;
      }
    }
  }

  async function analyzeFile(file) {
    if (!file) return;

    const currentAnalysis = ++analysisToken;
    clearInlineMap();

    if (
      !/^image\/(jpeg|jpg)$/i.test(file.type) &&
      !/\.jpe?g$/i.test(file.name)
    ) {
      alert(
        "Bitte möglichst ein JPEG-Foto auswählen. " +
        "Dieses EXIF Lab liest EXIF aus JPEG-Dateien."
      );

      return;
    }

    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl);
    }

    currentAnalyzedFile = file;
    currentFavoriteId = favoriteIdFor(file);
    currentLocationName = "";
    currentGps = null;

    previewObjectUrl = URL.createObjectURL(file);
    preview.src = previewObjectUrl;

    $("#previewFile").textContent = file.name;
    result.classList.remove("hidden");
    $("#exifStatus").textContent = "Analyse…";

    setMapButtonState(
      mapButton,
      false,
      {
        available: "Auf Karte zeigen",
        unavailable: "Keine GPS-Daten vorhanden"
      }
    );

    if (favoriteButton) {
      favoriteButton.disabled = true;
      favoriteButton.textContent = "☆ Zu Favoriten speichern";
      favoriteButton.classList.remove("is-saved");
      favoriteButton.setAttribute("aria-pressed", "false");
    }

    if (favoriteHint) {
      favoriteHint.textContent = "Prüfe EXIF und GPS. Danach kannst du das Foto lokal auf diesem Gerät speichern.";
    }

    try {
      const buffer =
        await file.arrayBuffer();

      if (currentAnalysis !== analysisToken) return;

      const exif =
        parseExif(buffer);

      let alreadySaved = false;
      try {
        alreadySaved = Boolean(await favoriteDbGet(currentFavoriteId));
      } catch (_) {
        alreadySaved = false;
      }

      if (currentAnalysis !== analysisToken) return;

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
        formatExifDate(
          exif.DateTimeOriginal ||
          exif.CreateDate ||
          ""
        )
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

        setMapButtonState(
          mapButton,
          true,
          {
            available: "Auf Karte zeigen",
            unavailable: "Keine GPS-Daten vorhanden"
          }
        );

        let address = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
        try {
          address = await reverseGeocode(lat, lon);
        } catch (error) {
          console.warn("Adresse konnte nicht ermittelt werden", error);
        }

        if (currentAnalysis !== analysisToken) return;

        currentLocationName = address;

        $("#locationName").textContent = address;

        $("#exifStatus").textContent =
          "EXIF + GPS gefunden";

        updateFavoriteButton(alreadySaved);
      } else {
        setText(
          "coordinates",
          "Keine GPS-Koordinaten in der Datei"
        );

        $("#locationName").textContent =
          "Kein GPS gespeichert";

        clearInlineMap();
        setMapButtonState(
          mapButton,
          false,
          {
            available: "Auf Karte zeigen",
            unavailable: "Keine GPS-Daten vorhanden"
          }
        );

        $("#exifStatus").textContent =
          Object.keys(exif).length
            ? "EXIF gefunden"
            : "Keine EXIF-Daten";

        updateFavoriteButton(alreadySaved);
      }
    } catch (error) {
      if (currentAnalysis !== analysisToken) return;

      console.error(error);

      clearInlineMap();
      setMapButtonState(
        mapButton,
        false,
        {
          available: "Auf Karte zeigen",
          unavailable: "Keine GPS-Daten vorhanden"
        }
      );

      $("#exifStatus").textContent =
        "Analysefehler";

      currentAnalyzedFile = null;
      currentFavoriteId = null;
      currentGps = null;
      updateFavoriteButton(false);

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
      if (!currentGps || mapButton.disabled) return;

      const url = buildMapUrl(
        currentGps.lat,
        currentGps.lon
      );

      clearInlineMap();

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

  if (favoriteButton) {
    favoriteButton.addEventListener("click", saveCurrentFavorite);
  }

  updateFavoriteButton(false);

  async function initializeLocalFavorites() {
    // Ältere Favoriten können aus einer früheren Version stammen, in der
    // Metadaten oder GPS noch nicht mitgespeichert wurden. Diese werden
    // einmal direkt aus der lokal gespeicherten Bilddatei rekonstruiert.
    await repairStoredFavorites();
    await refreshFavoriteViews();
  }

  favoritesInitializationPromise = initializeLocalFavorites();

  window.addEventListener(
    "pagehide",
    () => {
      analysisToken += 1;
      clearInlineMap();
      if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
        previewObjectUrl = null;
      }
    },
    { once: true }
  );

  $("#year").textContent =
    new Date().getFullYear();

  refreshGalleryFavoriteState().finally(renderGallery);
})();
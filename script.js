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
  // Portfolio filters
  // -----------------------------
  $$(".filter").forEach(button => {
    button.addEventListener("click", () => {
      $$(".filter").forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.filter;
      $$(".photo-card").forEach(card => {
        card.style.display = filter === "all" || card.dataset.category === filter ? "" : "none";
      });
    });
  });

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
  let currentAnalysis = null;

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
    0xA431: "BodySerialNumber",
    0xA430: "CameraOwnerName",
    0x9204: "ExposureCompensation",
    0x9207: "MeteringMode",
    0x9209: "Flash",
    0x8822: "ExposureProgram",
    0xA402: "ExposureMode",
    0xA403: "WhiteBalance",
    0xA406: "SceneCaptureType",
    0xA401: "CustomRendered",
    0xA404: "DigitalZoomRatio",
    0x9208: "LightSource",
    0xA40C: "SubjectDistanceRange",
    0xA410: "FileSource",
    0xA411: "SceneType",
    0xA412: "CFAPattern",
    0xA500: "Gamma",
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
    return ({1:1, 2:1, 3:2, 4:4, 5:8, 7:1, 9:4, 10:8})[type] || 1;
  }
  function rational(view, offset, little, signed = false) {
    const num = signed ? view.getInt32(offset, little) : view.getUint32(offset, little);
    const den = signed ? view.getInt32(offset + 4, little) : view.getUint32(offset + 4, little);
    return den ? num / den : null;
  }

  function readValue(view, entryOffset, type, count, tiffStart, little) {
    const size = typeSize(type) * count;
    const valueOffset = size <= 4
      ? entryOffset + 8
      : tiffStart + readU32(view, entryOffset + 8, little);

    if (valueOffset < 0 || valueOffset >= view.byteLength) return null;

    if (type === 2) {
      const chars = [];
      for (let i = 0; i < count && valueOffset + i < view.byteLength; i++) {
        const c = view.getUint8(valueOffset + i);
        if (c === 0) break;
        chars.push(String.fromCharCode(c));
      }
      return chars.join("").trim();
    }

    if (type === 1 || type === 7) {
      return Array.from({length: count}, (_, i) => view.getUint8(valueOffset + i));
    }

    if (type === 3) {
      const arr = [];
      for (let i = 0; i < count; i++) arr.push(readU16(view, valueOffset + i * 2, little));
      return count === 1 ? arr[0] : arr;
    }

    if (type === 4) {
      const arr = [];
      for (let i = 0; i < count; i++) arr.push(readU32(view, valueOffset + i * 4, little));
      return count === 1 ? arr[0] : arr;
    }

    if (type === 5) {
      const arr = [];
      for (let i = 0; i < count; i++) arr.push(rational(view, valueOffset + i * 8, little));
      return count === 1 ? arr[0] : arr;
    }

    if (type === 9) {
      const arr = [];
      for (let i = 0; i < count; i++) arr.push(view.getInt32(valueOffset + i * 4, little));
      return count === 1 ? arr[0] : arr;
    }

    if (type === 10) {
      const arr = [];
      for (let i = 0; i < count; i++) arr.push(rational(view, valueOffset + i * 8, little, true));
      return count === 1 ? arr[0] : arr;
    }

    return null;
  }

  function parseIFD(view, tiffStart, ifdOffset, little, limit = 0) {
    if (limit > 8) return {};
    const absolute = tiffStart + ifdOffset;
    if (absolute < 0 || absolute + 2 > view.byteLength) return {};

    const count = readU16(view, absolute, little);
    const out = {};

    for (let i = 0; i < count; i++) {
      const entry = absolute + 2 + i * 12;
      if (entry + 12 > view.byteLength) break;

      const tag = readU16(view, entry, little);
      const type = readU16(view, entry + 2, little);
      const n = readU32(view, entry + 4, little);
      const name = TAGS[tag] || `Tag_0x${tag.toString(16)}`;

      try {
        out[name] = readValue(view, entry, type, n, tiffStart, little);
      } catch (_) {
        out[name] = null;
      }
    }

    return out;
  }

  function findExif(bytes) {
    // JPEG marker scan
    if (bytes.length < 4 || bytes[0] !== 0xFF || bytes[1] !== 0xD8) return null;

    let offset = 2;
    while (offset + 4 <= bytes.length) {
      if (bytes[offset] !== 0xFF) { offset++; continue; }
      const marker = bytes[offset + 1];
      offset += 2;

      if (marker === 0xDA || marker === 0xD9) break; // SOS / EOI
      if (offset + 2 > bytes.length) break;

      const length = (bytes[offset] << 8) | bytes[offset + 1];
      if (length < 2 || offset + length > bytes.length) break;

      if (marker === 0xE1) {
        const start = offset + 2;
        if (start + 6 <= bytes.length &&
            bytes[start] === 0x45 && bytes[start + 1] === 0x78 &&
            bytes[start + 2] === 0x69 && bytes[start + 3] === 0x66 &&
            bytes[start + 4] === 0x00 && bytes[start + 5] === 0x00) {
          return bytes.slice(start + 6, offset + length);
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

    const view = new DataView(exif.buffer, exif.byteOffset, exif.byteLength);
    if (view.byteLength < 8) return {};

    const endian = String.fromCharCode(view.getUint8(0), view.getUint8(1));
    const little = endian === "II";
    if (!little && endian !== "MM") return {};

    if (readU16(view, 2, little) !== 42) return {};

    const ifd0Offset = readU32(view, 4, little);
    const ifd0 = parseIFD(view, 0, ifd0Offset, little);
    const all = {...ifd0};

    if (typeof ifd0.ExifIFDPointer === "number") {
      Object.assign(all, parseIFD(view, 0, ifd0.ExifIFDPointer, little, 1));
    }
    if (typeof ifd0.GPSInfoIFDPointer === "number") {
      Object.assign(all, parseIFD(view, 0, ifd0.GPSInfoIFDPointer, little, 1));
    }
    return all;
  }

  function formatNumber(value, digits = 2) {
    return typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits).replace(/\.?0+$/, "") : "—";
  }

  function formatExposure(value) {
    if (!Number.isFinite(value) || value <= 0) return "—";
    if (value >= 1) return `${formatNumber(value, 2)} s`;
    const denominator = Math.round(1 / value);
    return `1/${denominator} s`;
  }

  function formatFocal(value) {
    return Number.isFinite(value) ? `${formatNumber(value, 1)} mm` : "—";
  }

  function formatAperture(value) {
    return Number.isFinite(value) ? `f/${formatNumber(value, 1)}` : "—";
  }

  function formatEV(value) {
    return Number.isFinite(value) ? `${value > 0 ? "+" : ""}${formatNumber(value, 1)} EV` : "—";
  }

  function meteringName(value) {
    return ({
      0:"Unbekannt", 1:"Durchschnitt", 2:"Mittenbetont", 3:"Spot",
      4:"Mehrfeld", 5:"Muster", 6:"Partiell", 255:"Andere"
    })[Number(value)] || "—";
  }

  function exposureProgramName(value) {
    return ({
      0:"Nicht definiert", 1:"Manuell", 2:"Programmautomatik",
      3:"Zeitautomatik", 4:"Blendenautomatik", 5:"Kreativ", 6:"Action",
      7:"Portrait", 8:"Landschaft"
    })[Number(value)] || "—";
  }

  function whiteBalanceName(value) {
    return ({0:"Automatisch", 1:"Manuell"})[Number(value)] || "—";
  }

  function flashName(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "—";
    return (n & 1) ? "Blitz ausgelöst" : "Kein Blitz";
  }

  function formatAltitude(value, ref) {
    if (!Number.isFinite(value)) return "—";
    return `${formatNumber(value, 1)} m${Number(ref) === 1 ? " unter NN" : " über NN"}`;
  }

  function dmsToDecimal(dms, ref) {
    if (!Array.isArray(dms) || dms.length < 3) return null;
    const deg = Number(dms[0]), min = Number(dms[1]), sec = Number(dms[2]);
    if (![deg, min, sec].every(Number.isFinite)) return null;
    let decimal = deg + min / 60 + sec / 3600;
    if (String(ref).toUpperCase() === "S" || String(ref).toUpperCase() === "W") decimal *= -1;
    return decimal;
  }

  function directionName(degrees) {
    if (!Number.isFinite(degrees)) return "—";
    const dirs = ["Nord", "Nordost", "Ost", "Südost", "Süd", "Südwest", "West", "Nordwest"];
    return dirs[Math.round((((degrees % 360) + 360) % 360) / 45) % 8];
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || "—";
  }

  async function reverseGeocode(lat, lon) {
    // Nominatim is used only after the user has loaded a photo containing GPS.
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&zoom=18&addressdetails=1`;
    try {
      const response = await fetch(url, {
        headers: { "Accept": "application/json" }
      });
      if (!response.ok) throw new Error("Geocoding fehlgeschlagen");
      const data = await response.json();
      return data.display_name || "Adresse nicht gefunden";
    } catch (_) {
      return "Straßenname konnte nicht abgerufen werden";
    }
  }

  function buildMapUrl(lat, lon) {
    const delta = 0.004;
    const bbox = [
      lon - delta, lat - delta,
      lon + delta, lat + delta
    ].join("%2C");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${encodeURIComponent(lat)}%2C${encodeURIComponent(lon)}`;
  }

  function renderOsmTileMap(container, lat, lon, zoom = 16) {
    if (!container) return;
    container.replaceChildren();

    const size = 256;
    const grid = 3;
    const n = 2 ** zoom;
    const latRad = lat * Math.PI / 180;
    const worldX = ((lon + 180) / 360) * n;
    const worldY = ((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2) * n;
    const centerTileX = Math.floor(worldX);
    const centerTileY = Math.floor(worldY);
    const offsetX = (worldX - centerTileX) * size;
    const offsetY = (worldY - centerTileY) * size;

    container.style.setProperty("--map-offset-x", `${-(offsetX + size)}px`);
    container.style.setProperty("--map-offset-y", `${-(offsetY + size)}px`);

    const tiles = document.createDocumentFragment();
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        const x = ((centerTileX + dx) % n + n) % n;
        const y = centerTileY + dy;
        if (y < 0 || y >= n) continue;
        const img = document.createElement("img");
        img.className = "osm-map-tile";
        img.alt = "";
        img.draggable = false;
        img.loading = "eager";
        img.decoding = "async";
        img.src = `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
        img.style.left = `${(dx + 1) * size}px`;
        img.style.top = `${(dy + 1) * size}px`;
        tiles.appendChild(img);
      }
    }
    container.appendChild(tiles);

    const marker = document.createElement("div");
    marker.className = "osm-map-marker";
    marker.setAttribute("aria-hidden", "true");
    marker.innerHTML = '<span></span>';
    marker.style.left = `${size + offsetX}px`;
    marker.style.top = `${size + offsetY}px`;
    container.appendChild(marker);

    const attribution = document.createElement("div");
    attribution.className = "osm-map-attribution";
    attribution.innerHTML = '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';
    container.appendChild(attribution);
  }

  async function analyzeFile(file) {
    if (!file) return;
    if (!/^image\/(jpeg|jpg|tiff|png)$/i.test(file.type) && !/\.(jpe?g|tiff?|png)$/i.test(file.name)) {
      alert("Bitte eine Bilddatei (JPEG, TIFF oder PNG) auswählen.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    preview.src = objectUrl;
    $("#previewFile").textContent = file.name;
    result.classList.remove("hidden");
    $("#exifStatus").textContent = "Analyse…";

    try {
      const buffer = await file.arrayBuffer();
      const exif = parseExif(buffer);

      const make = exif.Make || "";
      const model = exif.Model || "";
      setText("camera", [make, model].filter(Boolean).join(" ") || "Nicht vorhanden");
      setText("lens", exif.LensModel || "Nicht vorhanden");
      const shutter = Number(exif.ExposureTime);
      const aperture = Number(exif.FNumber);
      const iso = Number(exif.ISO);
      const focal = Number(exif.FocalLength);
      const exposureText = formatExposure(shutter);
      const apertureText = formatAperture(aperture);
      const isoText = Number.isFinite(iso) && iso > 0 ? `ISO ${iso}` : "ISO —";
      setText("shutter", exposureText);
      setText("aperture", apertureText);
      setText("iso", Number.isFinite(iso) && iso > 0 ? `ISO ${iso}` : "Nicht vorhanden");
      setText("focal", formatFocal(focal));
      setText("exposureSummary", [exposureText, apertureText, isoText].filter(v => v !== "—").join(" · ") || "Keine Belichtungsdaten");
      setText("exposureComp", `Belichtungskorrektur ${formatEV(Number(exif.ExposureCompensation))}`);
      setText("author", exif.Artist || exif.CameraOwnerName || "Nicht vorhanden");
      setText("copyright", exif.Copyright || "Nicht vorhanden");
      setText("dateTaken", exif.DateTimeOriginal || exif.CreateDate || "Nicht vorhanden");
      setText("dimensions", exif.PixelXDimension && exif.PixelYDimension ? `${exif.PixelXDimension} × ${exif.PixelYDimension} px` : "Nicht vorhanden");
      setText("metering", meteringName(exif.MeteringMode));
      setText("whiteBalance", whiteBalanceName(exif.WhiteBalance));
      setText("flash", flashName(exif.Flash));
      setText("exposureProgram", exposureProgramName(exif.ExposureProgram));
      setText("software", exif.Software || "Nicht vorhanden");
      setText("cameraSerial", exif.BodySerialNumber || "Nicht vorhanden");
      setText("lensSerial", exif.LensSerialNumber || "Nicht vorhanden");
      setText("altitude", formatAltitude(Number(exif.GPSAltitude), exif.GPSAltitudeRef));

      const bearing = Number(exif.GPSImgDirection);
      setText("direction", Number.isFinite(bearing) ? directionName(bearing) : "Nicht vorhanden");
      setText("directionDegrees", Number.isFinite(bearing) ? `${formatNumber(bearing, 0)}°` : "Kein Kompasswert");

      const lat = dmsToDecimal(exif.GPSLatitude, exif.GPSLatitudeRef);
      const lon = dmsToDecimal(exif.GPSLongitude, exif.GPSLongitudeRef);

      currentGps = (lat !== null && lon !== null) ? {lat, lon, bearing} : null;

      if (saveExifButton) saveExifButton.disabled = false;

      currentAnalysis = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
        name: file.name,
        camera: [make, model].filter(Boolean).join(" ") || "Nicht vorhanden",
        lens: exif.LensModel || "Nicht vorhanden",
        shutter: exposureText,
        aperture: apertureText,
        iso: Number.isFinite(iso) && iso > 0 ? `ISO ${iso}` : "Nicht vorhanden",
        focal: formatFocal(focal),
        dimensions: exif.PixelXDimension && exif.PixelYDimension ? `${exif.PixelXDimension} × ${exif.PixelYDimension} px` : "Nicht vorhanden",
        date: exif.DateTimeOriginal || exif.CreateDate || "Nicht vorhanden",
        author: exif.Artist || exif.CameraOwnerName || "Nicht vorhanden",
        copyright: exif.Copyright || "Nicht vorhanden",
        metering: meteringName(exif.MeteringMode),
        whiteBalance: whiteBalanceName(exif.WhiteBalance),
        flash: flashName(exif.Flash),
        exposureProgram: exposureProgramName(exif.ExposureProgram),
        software: exif.Software || "Nicht vorhanden",
        altitude: formatAltitude(Number(exif.GPSAltitude), exif.GPSAltitudeRef),
        bearing: Number.isFinite(bearing) ? bearing : null,
        lat, lon,
        address: "",
        hasExif: Object.keys(exif).length > 0,
        imageBlob: file
      };

      if (currentGps) {
        setText("coordinates", `${lat.toFixed(6)}, ${lon.toFixed(6)}`);
        setText("locationShort", "GPS vorhanden");
        $("#locationName").textContent = "Adresse wird ermittelt…";
        $("#locationDetails").textContent = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
        mapButton.disabled = false;
        const address = await reverseGeocode(lat, lon);
        currentAnalysis.address = address;
        $("#locationName").textContent = address;
        $("#locationDetails").textContent = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
        $("#exifStatus").textContent = "EXIF + GPS gefunden";
      } else {
        setText("coordinates", "Keine GPS-Koordinaten");
        setText("locationShort", "Kein GPS");
        $("#locationName").textContent = "Kein GPS gefunden";
        $("#locationDetails").textContent = "Diese Datei enthält keine eingebetteten GPS-Koordinaten.";
        mapButton.disabled = true;
        $("#exifStatus").textContent = Object.keys(exif).length ? "EXIF gefunden · GPS fehlt" : "Keine EXIF-Daten";
      }
    } catch (error) {
      if (saveExifButton) saveExifButton.disabled = true;
      console.error(error);
      $("#exifStatus").textContent = "Analysefehler";
      alert("Die Datei konnte nicht analysiert werden. Bitte prüfe, ob es sich um ein gültiges JPEG handelt.");
    }
  }

  const saveExifButton = $("#saveExifButton");
  if (saveExifButton) saveExifButton.disabled = true;

  input.addEventListener("change", (event) => analyzeFile(event.target.files[0]));

  ["dragenter", "dragover"].forEach(type => {
    dropzone.addEventListener(type, (event) => {
      event.preventDefault();
      dropzone.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach(type => {
    dropzone.addEventListener(type, (event) => {
      event.preventDefault();
      dropzone.classList.remove("dragover");
    });
  });

  dropzone.addEventListener("drop", (event) => {
    const file = event.dataTransfer.files[0];
    analyzeFile(file);
  });

  dropzone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      input.click();
    }
  });

  mapButton.addEventListener("click", () => {
    if (!currentGps) return;

    // Use the same map in "Aufnahmeorte" that saved GPS entries use.
    // This keeps the workflow consistent and avoids creating a second
    // temporary map inside the EXIF result.
    const item = {
      id: "current-analysis",
      name: currentAnalysis?.name || $("#previewFile")?.textContent || "Aufnahme",
      camera: currentAnalysis?.camera || "",
      address: currentAnalysis?.address || currentAnalysis?.location || "",
      lat: currentGps.lat,
      lon: currentGps.lon
    };

    showLocationOnMap(item, {scroll: true});
  });


  // -----------------------------
  // Local photo archive (IndexedDB)
  // -----------------------------
  const STORAGE_KEY = "fotografie-stuttgart-analyses-v2";
  const DB_NAME = "fotografie-stuttgart-local";
  const DB_VERSION = 1;
  const STORE_NAME = "analyses";
  let archiveDbPromise = null;
  let savedObjectUrls = [];

  function openArchiveDb() {
    if (archiveDbPromise) return archiveDbPromise;
    archiveDbPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error("IndexedDB wird von diesem Browser nicht unterstützt."));
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, {keyPath: "id"});
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Archiv konnte nicht geöffnet werden."));
    });
    return archiveDbPromise;
  }

  function getLegacyAnalyses() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  async function getSavedAnalyses() {
    try {
      const db = await openArchiveDb();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const request = tx.objectStore(STORE_NAME).getAll();
        request.onsuccess = () => {
          const items = Array.isArray(request.result) ? request.result : [];
          items.sort((a, b) => Number(b.savedAt || 0) - Number(a.savedAt || 0));
          resolve(items);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (_) {
      return getLegacyAnalyses();
    }
  }

  async function putSavedAnalysis(item) {
    const db = await openArchiveDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(item);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error("Speichern abgebrochen."));
    });
  }

  async function deleteSavedAnalysis(id) {
    try {
      const db = await openArchiveDb();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).delete(id);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    } catch (_) {
      const items = getLegacyAnalyses().filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }

  async function clearSavedAnalyses() {
    try {
      const db = await openArchiveDb();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).clear();
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    } catch (_) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  async function migrateLegacyArchive() {
    const legacy = getLegacyAnalyses();
    if (!legacy.length) return;
    try {
      const db = await openArchiveDb();
      const existing = await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const request = tx.objectStore(STORE_NAME).count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      if (existing === 0) {
        for (const item of legacy.slice(0, 30)) {
          await putSavedAnalysis({...item, savedAt: item.savedAt || Date.now()});
        }
      }
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {
      // Keep the legacy archive as a fallback when IndexedDB is unavailable.
    }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
    }[char]));
  }

  function revokeSavedObjectUrls() {
    savedObjectUrls.forEach(url => URL.revokeObjectURL(url));
    savedObjectUrls = [];
  }

  async function renderSavedPortfolio() {
    const wrap = $("#savedPortfolio");
    const grid = $("#savedPortfolioGrid");
    if (!wrap || !grid) return;

    const items = await getSavedAnalyses();
    wrap.classList.toggle("hidden", items.length === 0);
    revokeSavedObjectUrls();
    grid.innerHTML = "";

    items.forEach(item => {
      const card = document.createElement("article");
      card.className = "saved-card";
      let imageMarkup = "";
      if (item.imageBlob instanceof Blob) {
        const url = URL.createObjectURL(item.imageBlob);
        savedObjectUrls.push(url);
        imageMarkup = `<img class="saved-card-image" src="${url}" alt="${escapeHtml(item.name)}" loading="lazy">`;
      }
      card.innerHTML = `
        ${imageMarkup}
        <div class="saved-card-top">
          <span class="saved-type">${item.lat !== null && item.lon !== null ? "GPS" : "EXIF"}</span>
          <button type="button" class="saved-remove" aria-label="Eintrag löschen" data-remove-id="${escapeHtml(item.id)}">×</button>
        </div>
        <strong>${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(item.camera)}</span>
        <small>${escapeHtml(item.date)}${item.address ? " · " + escapeHtml(item.address) : ""}</small>
        <div class="saved-card-actions">
          <button type="button" class="saved-open saved-details" data-detail-id="${escapeHtml(item.id)}">Details →</button>
          ${item.lat !== null && item.lon !== null ? `<button type="button" class="saved-open" data-open-id="${escapeHtml(item.id)}">Auf Karte zeigen →</button>` : ""}
        </div>
      `;
      grid.appendChild(card);
    });

    grid.querySelectorAll("[data-remove-id]").forEach(button => {
      button.addEventListener("click", async () => {
        button.disabled = true;
        await deleteSavedAnalysis(button.dataset.removeId);
        await renderSavedPortfolio();
        await renderLocations();
      });
    });

    grid.querySelectorAll("[data-open-id]").forEach(button => {
      button.addEventListener("click", async () => {
        const item = (await getSavedAnalyses()).find(entry => entry.id === button.dataset.openId);
        if (item && item.lat !== null && item.lon !== null) {
          showLocationOnMap(item);
          document.querySelector("#orte")?.scrollIntoView({behavior:"smooth", block:"start"});
        }
      });
    });

    grid.querySelectorAll("[data-detail-id]").forEach(button => {
      button.addEventListener("click", async () => {
        const item = (await getSavedAnalyses()).find(entry => entry.id === button.dataset.detailId);
        if (item) openSavedDetail(item);
      });
    });
  }

  // Saved-analysis detail view. The image stays local: IndexedDB stores the
  // original Blob and the modal creates only a temporary object URL.
  let savedDetailObjectUrl = null;

  function closeSavedDetail() {
    const modal = $("#savedDetailModal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (savedDetailObjectUrl) {
      URL.revokeObjectURL(savedDetailObjectUrl);
      savedDetailObjectUrl = null;
    }
  }

  function detailRows(item) {
    const rows = [
      ["Kamera", item.camera], ["Objektiv", item.lens],
      ["Aufnahmedatum", item.date], ["Verschlusszeit", item.shutter],
      ["Blende", item.aperture], ["ISO", item.iso],
      ["Brennweite", item.focal], ["Bildgröße", item.dimensions],
      ["Autor", item.author], ["Urheberrecht", item.copyright],
      ["Messmethode", item.metering], ["Weißabgleich", item.whiteBalance],
      ["Blitz", item.flash], ["Aufnahmeprogramm", item.exposureProgram],
      ["Software", item.software], ["Seriennummer Kamera", item.cameraSerial],
      ["Seriennummer Objektiv", item.lensSerial], ["GPS-Höhe", item.altitude]
    ];
    if (item.lat !== null && item.lon !== null && Number.isFinite(Number(item.lat)) && Number.isFinite(Number(item.lon))) {
      rows.push(["Koordinaten", `${Number(item.lat).toFixed(6)}, ${Number(item.lon).toFixed(6)}`]);
      rows.push(["Aufnahmeort", item.address || "GPS vorhanden"]);
      if (Number.isFinite(Number(item.bearing))) rows.push(["Richtung", `${directionName(Number(item.bearing))} · ${formatNumber(Number(item.bearing), 0)}°`]);
    }
    return rows.filter(([,value]) => value !== undefined && value !== null && String(value) !== "");
  }

  function openSavedDetail(item) {
    const modal = $("#savedDetailModal");
    const image = $("#savedDetailImage");
    const title = $("#savedDetailTitle");
    const kicker = $("#savedDetailKicker");
    const meta = $("#savedDetailMeta");
    const location = $("#savedDetailLocation");
    const mapLink = $("#savedDetailMapLink");
    if (!modal || !image || !title || !meta) return;

    if (savedDetailObjectUrl) URL.revokeObjectURL(savedDetailObjectUrl);
    savedDetailObjectUrl = null;
    if (item.imageBlob instanceof Blob) {
      savedDetailObjectUrl = URL.createObjectURL(item.imageBlob);
      image.src = savedDetailObjectUrl;
      image.alt = item.name || "Gespeicherte Aufnahme";
      image.classList.remove("hidden");
    } else {
      image.removeAttribute("src");
      image.alt = "Keine Bilddatei im lokalen Archiv";
      image.classList.add("hidden");
    }

    title.textContent = item.name || "Gespeicherte Aufnahme";
    kicker.textContent = item.lat !== null && item.lon !== null ? "GPS · LOKALES ARCHIV" : "EXIF · LOKALES ARCHIV";
    meta.innerHTML = detailRows(item).map(([label,value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");

    const hasGps = Number.isFinite(Number(item.lat)) && Number.isFinite(Number(item.lon)) && !(Number(item.lat) === 0 && Number(item.lon) === 0);
    if (location) {
      location.classList.toggle("hidden", !hasGps);
      if (hasGps) location.textContent = item.address || `${Number(item.lat).toFixed(6)}, ${Number(item.lon).toFixed(6)}`;
    }
    if (mapLink) {
      if (hasGps) {
        const lat = Number(item.lat), lon = Number(item.lon);
        mapLink.href = `https://www.openstreetmap.org/?mlat=${encodeURIComponent(lat)}&mlon=${encodeURIComponent(lon)}#map=17/${encodeURIComponent(lat)}/${encodeURIComponent(lon)}`;
        mapLink.classList.remove("hidden");
      } else {
        mapLink.classList.add("hidden");
        mapLink.removeAttribute("href");
      }
    }

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  $("#savedDetailClose")?.addEventListener("click", closeSavedDetail);
  $("#savedDetailModal")?.addEventListener("click", event => {
    if (event.target.id === "savedDetailModal") closeSavedDetail();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !$("#savedDetailModal")?.classList.contains("hidden")) closeSavedDetail();
  });

  saveExifButton?.addEventListener("click", async () => {
    if (!currentAnalysis) return;
    saveExifButton.disabled = true;
    try {
      const items = await getSavedAnalyses();
      const duplicate = items.find(item => item.name === currentAnalysis.name && item.date === currentAnalysis.date && item.camera === currentAnalysis.camera);
      if (!duplicate) {
        await putSavedAnalysis({
          ...currentAnalysis,
          savedAt: Date.now(),
          imageBlob: currentAnalysis.imageBlob || null
        });
      }
      await renderSavedPortfolio();
      await renderLocations();
      saveExifButton.textContent = duplicate ? "✓ Bereits gespeichert" : "✓ Aufnahme gespeichert";
      setTimeout(() => {
        saveExifButton.textContent = "Aufnahme merken";
      }, 1800);
    } catch (error) {
      console.error(error);
      alert("Die Aufnahme konnte lokal nicht gespeichert werden.");
    } finally {
      saveExifButton.disabled = false;
    }
  });

  $("#clearSavedPhotos")?.addEventListener("click", async () => {
    if (!(await getSavedAnalyses()).length) return;
    if (!confirm("Das lokale Archiv wirklich vollständig löschen?")) return;
    await clearSavedAnalyses();
    await renderSavedPortfolio();
    await renderLocations();
  });

  // -----------------------------
  // Aufnahmeorte explorer
  // -----------------------------
  // OpenStreetMap is embedded directly in an iframe. This avoids a dependency
  // on a third-party JavaScript map CDN, which can be blocked on some browsers,
  // privacy extensions or GitHub Pages deployments.
  function showLocationOnMap(item, options = {}) {
    const canvas = $("#locationMapCanvas");
    const content = $("#locationMapContent");
    const empty = $("#locationMapEmpty");
    const fallback = $("#locationMapFallback");
    const label = $("#locationMapLabel");
    const panel = document.querySelector(".location-map-panel");

    if (!canvas || !content || !empty || !item) return false;

    const lat = Number(item.lat);
    const lon = Number(item.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || (lat === 0 && lon === 0)) {
      console.warn("Ungültige GPS-Daten für Aufnahme:", item);
      return false;
    }

    // Make the map state visible first. This is intentional: if an external
    // map resource is slow or unavailable, the user still gets the map panel
    // and the OpenStreetMap link instead of being left on the empty state.
    empty.classList.add("hidden");
    content.classList.remove("hidden");

    const directMapUrl =
      `https://www.openstreetmap.org/?mlat=${encodeURIComponent(lat)}` +
      `&mlon=${encodeURIComponent(lon)}` +
      `#map=17/${encodeURIComponent(lat)}/${encodeURIComponent(lon)}`;

    const delta = 0.004;
    const bbox = [
      lon - delta, lat - delta,
      lon + delta, lat + delta
    ].join("%2C");
    const embedUrl =
      `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}` +
      `&layer=mapnik&marker=${encodeURIComponent(lat)}%2C${encodeURIComponent(lon)}`;

    // Use OSM's own embeddable map instead of manually loading map tiles.
    // This is more reliable on GitHub Pages and does not require a JS map CDN.
    canvas.replaceChildren();
    const frame = document.createElement("iframe");
    frame.className = "osm-map-frame";
    frame.title = `OpenStreetMap-Aufnahmeort ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
    frame.loading = "eager";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.src = embedUrl;
    canvas.appendChild(frame);

    if (fallback) {
      fallback.href = directMapUrl;
      fallback.setAttribute(
        "aria-label",
        `OpenStreetMap mit ${lat.toFixed(5)}, ${lon.toFixed(5)} öffnen`
      );
    }

    if (label) {
      label.textContent = item.address
        ? item.address
        : `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
    }

    document.querySelectorAll(".location-item").forEach(button => {
      button.classList.toggle("is-selected", button.dataset.locationId === item.id);
    });

    if (options.scroll !== false) {
      panel?.scrollIntoView({behavior:"smooth", block:"center"});
    }

    return true;
  }

  async function renderLocations() {
    const list = $("#locationList");
    const count = $("#locationCount");
    if (!list || !count) return;

    const items = (await getSavedAnalyses()).filter(
      item => Number.isFinite(Number(item.lat)) && Number.isFinite(Number(item.lon))
    );
    count.textContent = `${items.length} ${items.length === 1 ? "Aufnahme" : "Aufnahmen"}`;

    if (!items.length) {
      list.innerHTML = `
        <div class="empty-state">
          <span>◎</span>
          <strong>Noch keine GPS-Aufnahmen</strong>
          <p>Analysiere ein JPEG mit GPS im EXIF Lab und klicke anschließend auf „Aufnahme merken“.</p>
          <a class="button ghost" href="#exif">Zum EXIF Lab</a>
        </div>`;

      $("#locationMapContent")?.classList.add("hidden");
      $("#locationMapEmpty")?.classList.remove("hidden");
      return;
    }

    list.innerHTML = items.map((item, index) => `
      <button class="location-item" type="button" data-location-id="${escapeHtml(item.id)}">
        <span class="location-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="location-item-copy">
          <strong>${escapeHtml(item.address || "GPS-Aufnahme")}</strong>
          <small>${escapeHtml(item.name)} · ${escapeHtml(item.camera)}</small>
          <small>${Number(item.lat).toFixed(5)}, ${Number(item.lon).toFixed(5)}</small>
        </span>
        <span class="location-arrow">→</span>
      </button>
    `).join("");

    list.querySelectorAll("[data-location-id]").forEach(button => {
      button.addEventListener("click", async () => {
        const currentItems = await getSavedAnalyses();
        const item = currentItems.find(entry => entry.id === button.dataset.locationId);
        if (item) showLocationOnMap(item, {scroll: true});
      });
    });
  }

  $("#refreshLocations")?.addEventListener("click", async () => {
    await renderSavedPortfolio();
    await renderLocations();
  });

  migrateLegacyArchive().finally(async () => {
    await renderSavedPortfolio();
    await renderLocations();
  });

  // -----------------------------
  // Portfolio lightbox
  // -----------------------------
  const modal = $("#photoModal");
  const modalImage = $("#modalImage");
  const modalTitle = $("#modalTitle");
  const modalDescription = $("#modalDescription");
  const modalMeta = $("#modalMeta");
  let modalItems = [];
  let modalIndex = 0;

  function openPortfolioModal(index) {
    const item = modalItems[index];
    if (!item || !modal) return;

    modalIndex = index;
    modal.classList.remove("hidden");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    const image = item.querySelector("img");
    const title = item.querySelector("h3");
    const meta = [...item.querySelectorAll(".card-meta span")].map(el => el.textContent.trim());

    if (image) {
      modalImage.src = image.currentSrc || image.src;
      modalImage.alt = image.alt || title?.textContent || "Portfolio-Foto";
      modalImage.classList.remove("modal-placeholder");
      modalImage.style.background = "";
    } else {
      modalImage.removeAttribute("src");
      modalImage.alt = "";
      modalImage.classList.add("modal-placeholder");
      modalImage.style.background = getComputedStyle(item.querySelector(".photo-placeholder")).background;
    }

    modalTitle.textContent = title?.textContent || "Aufnahme";
    modalDescription.textContent = image?.alt || "Aufnahme aus dem Fotografie-Stuttgart-Archiv.";
    modalMeta.innerHTML = meta.map(value => `<span>${escapeHtml(value)}</span>`).join("");

    // Focus the close button so the lightbox is immediately keyboard accessible.
    $("#modalClose")?.focus({ preventScroll: true });
  }

  function closePortfolioModal() {
    modal?.classList.add("hidden");
    modal?.classList.remove("is-open");
    modal?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function refreshModalItems() {
    modalItems = $$(".photo-card").filter(card => getComputedStyle(card).display !== "none");
  }

  // Important: the portfolio opens only on an intentional click/tap.
  // There is deliberately no hover/pointerenter opening anymore.
  $$(".photo-card").forEach(card => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");

    card.addEventListener("click", () => {
      refreshModalItems();
      const index = modalItems.indexOf(card);
      if (index >= 0) openPortfolioModal(index);
    });

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        refreshModalItems();
        const index = modalItems.indexOf(card);
        if (index >= 0) openPortfolioModal(index);
      }
    });
  });

  // The lightbox starts closed on every page load. This also prevents
  // mobile browsers from restoring an accidentally open dialog state.
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    // Remove any legacy Back/Zurück control that may survive from an older
    // cached HTML version. The current lightbox uses only the × close button.
    modal.querySelectorAll("a, button").forEach(control => {
      const label = (control.textContent || control.getAttribute("aria-label") || "").trim().toLowerCase();
      if (label.includes("zurück") || label.includes("zuruck")) control.remove();
    });
  }

  $("#modalClose")?.addEventListener("click", closePortfolioModal);

  $("#modalPrev")?.addEventListener("click", () => {
    if (modalItems.length) {
      openPortfolioModal((modalIndex - 1 + modalItems.length) % modalItems.length);
    }
  });

  $("#modalNext")?.addEventListener("click", () => {
    if (modalItems.length) {
      openPortfolioModal((modalIndex + 1) % modalItems.length);
    }
  });

  document.addEventListener("keydown", event => {
    if (modal?.classList.contains("hidden")) return;
    if (event.key === "Escape") closePortfolioModal();
    if (event.key === "ArrowLeft") $("#modalPrev")?.click();
    if (event.key === "ArrowRight") $("#modalNext")?.click();
  });

  modal?.addEventListener("click", event => {
    if (event.target === modal) closePortfolioModal();
  });

  // Some mobile browsers can restore the previous visual state from BFCache.
  // Always start the portfolio page with the lightbox closed unless the user
  // explicitly opens a photo.
  window.addEventListener("pageshow", () => {
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    }
  });

  // -----------------------------
  // Mobile navigation
  // -----------------------------
  const mobileToggle = $("#mobileMenuToggle");
  const mobileMenu = $("#mobileMenu");

  function closeMobileMenu() {
    if (!mobileToggle || !mobileMenu) return;
    mobileToggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    mobileMenu.classList.remove("open");
  }

  mobileToggle?.addEventListener("click", () => {
    const open = mobileToggle.getAttribute("aria-expanded") === "true";
    mobileToggle.setAttribute("aria-expanded", String(!open));
    mobileMenu?.setAttribute("aria-hidden", String(open));
    mobileMenu?.classList.toggle("open", !open);
  });

  mobileMenu?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMobileMenu));

  renderSavedPortfolio();
  renderLocations();

  $("#year").textContent = new Date().getFullYear();
})();

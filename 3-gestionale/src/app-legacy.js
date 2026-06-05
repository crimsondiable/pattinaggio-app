var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var _a, _b;
(function() {
  if (!Array.prototype.flatMap) {
    Object.defineProperty(Array.prototype, "flatMap", {
      configurable: true,
      writable: true,
      value: function(callback, thisArg) {
        return Array.prototype.concat.apply([], this.map(callback, thisArg));
      }
    });
  }
  if (!Object.fromEntries) {
    Object.fromEntries = function(entries) {
      var result = {};
      for (var i = 0; i < entries.length; i++) result[entries[i][0]] = entries[i][1];
      return result;
    };
  }
  if (!String.prototype.padStart) {
    String.prototype.padStart = function(targetLength, padString) {
      targetLength = targetLength >> 0;
      padString = String(padString || " ");
      if (this.length >= targetLength) return String(this);
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) padString += padString.repeat(targetLength / padString.length);
      return padString.slice(0, targetLength) + String(this);
    };
  }
  if (!Array.prototype.includes) {
    Array.prototype.includes = function(search, fromIndex) {
      return this.indexOf(search, fromIndex || 0) !== -1;
    };
  }
  if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
      return this.indexOf(search, start || 0) !== -1;
    };
  }
  if (!Array.prototype.find) {
    Array.prototype.find = function(predicate, thisArg) {
      for (var i = 0; i < this.length; i++) if (predicate.call(thisArg, this[i], i, this)) return this[i];
    };
  }
  if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(predicate, thisArg) {
      for (var i = 0; i < this.length; i++) if (predicate.call(thisArg, this[i], i, this)) return i;
      return -1;
    };
  }
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
  if (window.Element && !Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }
  if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest = function(selector) {
      var node = this;
      while (node) {
        if (node.matches && node.matches(selector)) return node;
        node = node.parentElement;
      }
      return null;
    };
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      return setTimeout(callback, 16);
    };
  }
})();
(() => {
  const nodes = [
    ["Caduta controllata", "stance", 1, true, "", "avanti, laterale, recupero in ginocchio", "sicurezza prima della tecnica"],
    ["Posizione base", "stance", 1, true, "", "neutral stance, ginocchia morbide, braccia libere", "punto zero del sistema"],
    ["Peso laterale", "stance", 1, true, "Posizione base", "statico, dinamico, dx/sx", "primo trasferimento del carico"],
    ["Papera statica", "stance", 1, false, "Posizione base", "apertura punte, chiusura talloni", "prepara limone e transizioni"],
    ["Forbice base", "stance", 2, true, "Peso laterale", "dx avanti, sx avanti", "staggered stance stabile"],
    ["Affondo base", "stance", 2, true, "Forbice base", "affondo alto, affondo basso", "prepara T-stop, runner stop, slide"],
    ["Telemark tacco", "stance", 2, true, "Forbice base", "dx/sx, statico, in glide", "primo assetto longitudinale"],
    ["Telemark punta", "stance", 3, true, "Telemark tacco", "dx/sx, in glide", "assetto chiave per T-stop e curve"],
    ["Tacco-punta base", "stance", 3, false, "Telemark punta", "heel-toe, toe-heel", "ponte verso manual e transizioni sulle punte"],
    ["Monopedale assistito", "stance", 3, true, "Glide, Peso laterale", "dx/sx, 1-3 secondi", "primo appoggio singolo"],
    ["Closed stance base", "stance", 3, false, "Telemark punta", "chiusura controllata", "prepara curve strette e rotazioni"],
    ["Monopedale glide", "stance", 4, true, "Monopedale assistito", "dx/sx, 5-8 secondi", "appoggio singolo in movimento"],
    ["Affondo dinamico", "stance", 4, false, "Affondo base, Glide", "ingresso/uscita, dx/sx", "prepara runner stop e slide"],
    ["Eagle glide", "stance", 4, false, "Papera statica, Glide", "apertura breve, uscita neutra", "non ancora eagle tecnico"],
    ["Closed stance glide", "stance", 4, false, "Closed stance base, Glide", "ingresso/uscita", "assetto chiuso in movimento"],
    ["Edge interno / esterno base", "stance", 5, true, "Monopedale glide, Curva compasso", "interno, esterno, dx/sx", "sensibilita agli spigoli"],
    ["Monopedale in curva", "stance", 5, true, "Edge interno / esterno base", "curva larga, entrambi i lati", "prerequisito di carrellata e double push"],
    ["Tacco-punta glide", "stance", 5, false, "Tacco-punta base, Monopedale glide", "heel-toe, toe-heel", "controllo longitudinale ruote"],
    ["Forbice dinamica", "stance", 5, false, "Forbice base, Stride", "cambio piede avanti", "base per sprint e frenate"],
    ["Eagle tecnico", "stance", 6, false, "Eagle glide, Edge interno / esterno base", "tenuta, curva ampia", "apertura anche + controllo edge"],
    ["One-foot edge dinamico", "stance", 6, true, "Monopedale in curva", "interno/esterno, dx/sx", "monopedale non solo dritto"],
    ["Compressione / estensione", "stance", 6, false, "Affondo dinamico, Stride", "basso-alto, alto-basso", "prepara salti, slide, double push"],
    ["Toe manual glide", "stance", 7, false, "Tacco-punta glide, Monopedale glide", "dx/sx, breve", "una ruota anteriore in scorrimento"],
    ["Heel manual glide", "stance", 7, false, "Tacco-punta glide, Monopedale glide", "dx/sx, breve", "una ruota posteriore in scorrimento"],
    ["Manual bilaterale", "stance", 7, true, "Toe manual glide, Heel manual glide", "switch naturale, dx/sx", "controllo simmetrico"],
    ["Edge profondo", "stance", 7, true, "One-foot edge dinamico", "interno/esterno, curva stretta", "prepara slide e double push"],
    ["Manual in curva", "stance", 8, false, "Manual bilaterale, Edge profondo", "heel/toe, dx/sx", "manual con traiettoria"],
    ["Toe-heel switch", "stance", 8, false, "Manual bilaterale", "cambio ruota senza appoggio pieno", "ponte verso combo manual"],
    ["Eagle / closed transition", "stance", 8, false, "Eagle tecnico, Closed stance glide", "open -> closed, closed -> open", "controllo anche e assi"],
    ["Manual combo", "stance", 9, true, "Toe-heel switch, Manual in curva", "toe->heel, heel->toe", "continuita senza appoggio pieno"],
    ["Single wheel control", "stance", 9, true, "Manual combo, Monopedale glide", "glide lento, curve larghe", "pre-master per heelwheel"],
    ["Edge transition monopedale", "stance", 9, false, "Edge profondo", "interno<->esterno, dx/sx", "cambio edge su un piede"],
    ["Single heelwheel manual (glide)", "stance", 10, true, "Single wheel control, Manual combo, Edge transition monopedale", "dx/sx, switch, curva larga", "skill master di equilibrio e glide"],
    ["Primi passi", "gait", 1, true, "Posizione base", "V-walk, passi corti", "ingresso al movimento"],
    ["Glide", "gait", 1, true, "Primi passi", "due piedi", "scorrimento base non saltabile"],
    ["Limone base", "gait", 1, true, "Papera statica, Glide", "apertura/chiusura, lento", "propulsione senza stacco"],
    ["Mezzo limone", "gait", 2, true, "Limone base, Peso laterale", "dx/sx", "una gamba guida, una stabilizza"],
    ["Mono spinta", "gait", 2, true, "Mezzo limone", "dx/sx, spinta breve", "prima spinta laterale"],
    ["Stroke", "gait", 2, true, "Mono spinta, Glide", "spinta singola, recupero neutro", "gesto di pattinata elementare"],
    ["Stride", "gait", 3, true, "Stroke, Monopedale assistito", "ciclo alternato", "base della pattinata completa"],
    ["Monopattino", "gait", 3, false, "Stroke, Forbice base", "dx/sx", "spinta ripetuta con gamba libera"],
    ["Glide monopedale", "gait", 3, true, "Monopedale assistito, Glide", "dx/sx", "ponte tra stance e gait"],
    ["Slalom base", "gait", 4, false, "Limone base, Curva compasso", "piedi paralleli, ritmo lento", "propulsione + traiettoria"],
    ["Switch stance in andatura", "gait", 4, false, "Forbice base, Stride", "piede opposto avanti", "prima dimensione switch"],
    ["Pump / serpentina", "gait", 5, false, "Slalom base, Edge interno / esterno base", "interno/esterno", "genera velocita senza passo"],
    ["Sprint start", "gait", 5, false, "Forbice dinamica, Stroke", "partenza breve", "forza iniziale"],
    ["Speed control", "gait", 6, true, "Stride, T-stop", "accelerazione, decelerazione", "controllo velocita senza panico"],
    ["One-foot push", "gait", 7, false, "Stride, One-foot edge dinamico", "dx/sx", "spinta con forte appoggio singolo"],
    ["Inside-edge push", "gait", 7, true, "Pump / serpentina, Monopedale in curva, Edge profondo", "spinta interna", "primo pezzo del double push"],
    ["Switch stride", "gait", 8, false, "Switch stance in andatura, Stride", "piede opposto dominante", "dimensione switch reale"],
    ["High speed glide", "gait", 8, false, "Speed control, Edge profondo", "posizione bassa, rilascio", "controllo a velocita alta"],
    ["Double push segmentato", "gait", 9, true, "Inside-edge push, Stride, Monopedale in curva", "2-3 cicli", "pre-master a velocita ridotta"],
    ["Double push bilaterale", "gait", 9, true, "Double push segmentato, Switch stride", "entrambi i lati", "simmetria del gesto"],
    ["Double push", "gait", 10, true, "Double push bilaterale, Stride, Edge transition monopedale", "continuo, veloce, applicabile", "skill master di propulsione"],
    ["Frenata limone", "break", 1, true, "Glide, Limone base", "chiusura progressiva", "prima gestione velocita"],
    ["Spazzaneve", "break", 2, true, "Frenata limone, Peso laterale", "dx/sx carico, lento", "attrito simmetrico"],
    ["T-stop", "break", 3, true, "Telemark punta, Glide, Spazzaneve", "dx/sx", "nodo chiave base"],
    ["Plow turn stop", "break", 3, false, "Spazzaneve, Curva compasso", "curva + riduzione velocita", "ponte verso runner stop"],
    ["Runner stop", "break", 4, true, "Affondo dinamico, Plow turn stop", "dx/sx", "stop direzionale dinamico"],
    ["Powerstop", "break", 4, true, "T-stop, Curva spinta", "ingresso curvo", "frenata rapida ma non slide piena"],
    ["Hockey stop base", "break", 5, false, "Powerstop, Edge interno / esterno base", "parallelo parziale", "ponte verso parallel"],
    ["Powerslide", "break", 6, true, "Powerstop, Runner stop", "dx/sx, ingresso controllato", "prima slide riconoscibile"],
    ["Soul slide", "break", 6, false, "Affondo dinamico, Edge interno / esterno base, Curva carrellata avanzata", "dx/sx", "slide asimmetrica"],
    ["Magic slide", "break", 7, true, "Powerslide, Curva carrellata avanzata, Soul slide", "dx/sx", "controllo avanzato della pressione"],
    ["Slide exit control", "break", 7, true, "Powerslide, Soul slide", "uscita in glide, uscita in curva", "evita blocchi e cadute"],
    ["Switch powerslide", "break", 7, false, "Powerslide, Switch stance in andatura", "lato debole", "dimensione switch"],
    ["Slide bilaterale", "break", 8, true, "Magic slide, Switch powerslide", "dx/sx, naturale/switch", "controllo reale su entrambi i lati"],
    ["Slide combo base", "break", 8, false, "Slide exit control", "powerslide->glide, soul->glide", "continuita"],
    ["Parallel slide segmentata", "break", 9, true, "Hockey stop base, Magic slide, Slide bilaterale", "ingresso, tenuta, uscita separati", "pre-master"],
    ["Parallel slide", "break", 10, true, "Parallel slide segmentata, Speed control, Magic slide, Edge profondo", "dx/sx, switch, uscita pulita", "skill master di frenata"],
    ["Curva compasso", "rotation", 1, true, "Peso laterale, Glide", "curva ampia dx/sx", "sterzo base senza torsione"],
    ["Cambio direzione a passi", "rotation", 1, false, "Primi passi", "piccoli passi, V-turn", "cambio direzione sicuro"],
    ["Curva spinta", "rotation", 2, true, "Curva compasso, Stroke", "dx/sx", "spinta dentro traiettoria"],
    ["Transizione in papera", "rotation", 2, false, "Papera statica, Glide", "frontale<->retromarcia lenta", "primo cambio orientamento"],
    ["Mezzo giro su due piedi", "rotation", 2, false, "Curva compasso", "dx/sx", "rotazione a bassa velocita"],
    ["Curva carrellata base", "rotation", 3, true, "Curva spinta, Peso laterale", "due piedi, edge larghi", "curva senza passo"],
    ["Salto base / distacco", "air", 3, false, "Posizione base, Glide", "stacco, atterraggio", "dimensione distacco"],
    ["Curva carrellata", "rotation", 4, true, "Curva carrellata base, Monopedale glide", "curve medie", "edge + traiettoria"],
    ["Revert base", "rotation", 4, false, "Transizione in papera, Glide", "cambio orientamento", "cambio direzione senza salto"],
    ["Incrocio statico", "rotation", 4, false, "Forbice base, Curva compasso", "passo sopra senza velocita", "base tecnica del passo incrociato"],
    ["Transizione sulle punte", "rotation", 5, false, "Tacco-punta base, Tacco-punta glide", "dx/sx", "rotazione su asse stretto"],
    ["Carving base", "rotation", 5, true, "Curva carrellata, Edge interno / esterno base", "interno/esterno", "curva con edge consapevole"],
    ["Incrocio in curva assistito", "rotation", 5, true, "Incrocio statico, Curva carrellata", "mano/ritmo assistito", "primo incrocio reale ma non ancora skill finale"],
    ["Curva carrellata avanzata", "rotation", 6, true, "Carving base, Speed control", "velocita, raggio stretto", "prerequisito slide e double push"],
    ["Jump 180", "air", 6, false, "Salto base / distacco, Revert base", "dx/sx", "rotazione aerea base"],
    ["Cross step rhythm", "rotation", 7, true, "Incrocio in curva assistito, Monopedale in curva, Stride", "2-3 incroci lenti", "ritmo senza velocita alta"],
    ["Cross step bilaterale", "rotation", 8, true, "Cross step rhythm, Switch stride", "senso orario/antiorario", "entrambi i versi di curva"],
    ["Carving veloce", "rotation", 8, false, "Curva carrellata avanzata, Stride", "velocita + edge", "ponte verso crossover master"],
    ["Passo incrociato segmentato", "rotation", 9, true, "Cross step bilaterale, Carving veloce", "ingresso, incrocio, spinta, uscita", "pre-master"],
    ["Jump 360 segmentato", "air", 9, true, "Jump 180, Transizione sulle punte, Compressione / estensione, Edge transition monopedale", "stacco, rotazione, landing", "pre-master"],
    ["Passo incrociato", "rotation", 10, true, "Passo incrociato segmentato, Double push segmentato", "continuo, veloce, entrambi i versi", "skill master di curva propulsiva"],
    ["Jump 360", "air", 10, true, "Jump 360 segmentato, Speed control", "dx/sx, atterraggio in glide", "skill master di distacco e rotazione"]
  ].map(([name, branch, level, key, prereq, variants, note]) => ({
    name,
    branch,
    level,
    key,
    note,
    variants: variants ? variants.split(",").map((v) => v.trim()).filter(Boolean) : [],
    prereq: prereq ? prereq.split(",").map((v) => v.trim()).filter((v) => v && v !== "-") : []
  }));
  window.SKILLTREE_NODES = nodes;
})();
;
(function() {
  "use strict";
  const ROUTE_ELEMENT_TYPES = [
    { type: "cone", label: "Conetto", category: "Base", defaultWidth: 28, defaultHeight: 28, defaultVariant: "orange", variants: ["orange", "yellow", "blue", "green", "white"] },
    { type: "flat_marker", label: "Cinesino", category: "Base", defaultWidth: 36, defaultHeight: 16, defaultVariant: "yellow", variants: ["yellow", "orange", "blue", "green", "white"] },
    { type: "ground_stick", label: "Asta / bastone a terra", category: "Ostacoli", defaultWidth: 112, defaultHeight: 12, defaultVariant: "wood", variants: ["wood", "blue", "red", "white"] },
    { type: "high_bar", label: "Asta alta sotto cui passare", category: "Ostacoli", defaultWidth: 132, defaultHeight: 44, defaultVariant: "blue", variants: ["blue", "green", "red", "white"] },
    { type: "low_hurdle", label: "Piccolo rialzo da scavalcare", category: "Ostacoli", defaultWidth: 76, defaultHeight: 34, defaultVariant: "green", variants: ["green", "yellow", "blue", "red"] },
    { type: "bank_ramp", label: "Rampa bank to bank", category: "Ostacoli", defaultWidth: 136, defaultHeight: 58, defaultVariant: "steel", variants: ["steel", "blue", "orange"] },
    { type: "crash_mat", label: "Materassone", category: "Sicurezza", defaultWidth: 156, defaultHeight: 86, defaultVariant: "blue", variants: ["blue", "green", "red"] },
    { type: "start_line", label: "Linea di partenza", category: "Percorso", defaultWidth: 148, defaultHeight: 16, defaultVariant: "white", variants: ["white", "green", "blue"] },
    { type: "finish_line", label: "Linea di arrivo", category: "Percorso", defaultWidth: 148, defaultHeight: 16, defaultVariant: "white", variants: ["white", "red", "blue"] },
    { type: "free_area", label: "Area libera / zona delimitata", category: "Percorso", defaultWidth: 180, defaultHeight: 112, defaultVariant: "cyan", variants: ["cyan", "green", "yellow", "red"] },
    { type: "direction_arrow", label: "Freccia direzionale", category: "Percorso", defaultWidth: 92, defaultHeight: 40, defaultVariant: "blue", variants: ["blue", "green", "orange", "white"] },
    { type: "stop_point", label: "Punto di stop", category: "Percorso", defaultWidth: 42, defaultHeight: 42, defaultVariant: "red", variants: ["red", "orange", "blue"] },
    { type: "forced_curve", label: "Curva obbligata", category: "Percorso", defaultWidth: 112, defaultHeight: 78, defaultVariant: "violet", variants: ["violet", "blue", "green"] },
    { type: "slalom", label: "Slalom", category: "Pattern", defaultWidth: 148, defaultHeight: 58, defaultVariant: "orange", variants: ["orange", "yellow", "blue", "green"] },
    { type: "custom", label: "Elemento personalizzato", category: "Altro", defaultWidth: 82, defaultHeight: 52, defaultVariant: "gray", variants: ["gray", "blue", "green", "orange", "red"] }
  ];
  const ROUTE_CANVAS_SIZES = [
    { key: "small", label: "Piccolo", width: 520, height: 340 },
    { key: "medium", label: "Medio", width: 760, height: 480 },
    { key: "large", label: "Grande", width: 1040, height: 640 },
    { key: "custom", label: "Personalizzato", width: 760, height: 480 }
  ];
  const ROUTE_VARIANT_COLORS = {
    orange: "#f97316",
    yellow: "#facc15",
    blue: "#38bdf8",
    green: "#34d399",
    red: "#fb7185",
    white: "#e5edf2",
    gray: "#94a3b8",
    cyan: "#67e8f9",
    violet: "#a78bfa",
    wood: "#b7793e",
    steel: "#8fa4ad"
  };
  const DEFAULT_ROUTE_CANVAS = Object.freeze({
    size: "medium",
    width: 760,
    height: 480,
    showGrid: true,
    gridSize: 24,
    zoom: 1,
    panX: 18,
    panY: 18
  });
  function uid(prefix) {
    const chunk = Math.random().toString(36).slice(2, 8);
    return `${prefix}_${Date.now().toString(36)}_${chunk}`;
  }
  function numberOr(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  function clampNumber(value, min, max, fallback) {
    return Math.min(max, Math.max(min, numberOr(value, fallback)));
  }
  function getElementType(type) {
    return ROUTE_ELEMENT_TYPES.find((item) => item.type === type) || ROUTE_ELEMENT_TYPES[0];
  }
  function hasElementType(type) {
    return ROUTE_ELEMENT_TYPES.some((item) => item.type === type);
  }
  function getCanvasSize(size) {
    return ROUTE_CANVAS_SIZES.find((item) => item.key === size) || ROUTE_CANVAS_SIZES[1];
  }
  function parseList(value) {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
  }
  function createElement(type, position = {}, overrides = {}) {
    const def = getElementType(type);
    const x = clampNumber(position.x, 0, 4e3, 120);
    const y = clampNumber(position.y, 0, 4e3, 120);
    return normalizeElement(__spreadValues({
      id: uid("el"),
      type: def.type,
      label: def.label,
      x,
      y,
      rotation: 0,
      width: def.defaultWidth,
      height: def.defaultHeight,
      variant: def.defaultVariant,
      required: true,
      order: null,
      notes: "",
      difficulty: 1,
      skill: ""
    }, overrides));
  }
  function createRoute(overrides = {}) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    return normalizeRoute2(__spreadValues({
      id: uid("route"),
      title: "Nuovo percorso",
      description: "",
      objective: "",
      level: 1,
      skills: [],
      estimatedDurationMinutes: 10,
      recommendedStudents: "1-4",
      materials: "",
      safetyNotes: "",
      canvas: __spreadValues({}, DEFAULT_ROUTE_CANVAS),
      elements: [],
      executionSequence: [],
      createdAt: now,
      updatedAt: now
    }, overrides));
  }
  function normalizeElement(element = {}) {
    const def = getElementType(element.type);
    return {
      id: String(element.id || uid("el")),
      type: def.type,
      label: String(element.label || element.name || def.label),
      x: clampNumber(element.x, 0, 4e3, 0),
      y: clampNumber(element.y, 0, 4e3, 0),
      rotation: numberOr(element.rotation, 0),
      width: clampNumber(element.width, 8, 2e3, def.defaultWidth),
      height: clampNumber(element.height, 8, 2e3, def.defaultHeight),
      variant: String(element.variant || element.color || def.defaultVariant),
      required: element.required !== false,
      order: element.order === "" || element.order == null ? null : numberOr(element.order, null),
      notes: String(element.notes || ""),
      difficulty: clampNumber(element.difficulty, 1, 10, 1),
      skill: String(element.skill || element.linkedSkill || "")
    };
  }
  function normalizeCanvas(canvas = {}) {
    const sizeDef = getCanvasSize(canvas.size || DEFAULT_ROUTE_CANVAS.size);
    const isCustom = (canvas.size || sizeDef.key) === "custom";
    return {
      size: isCustom ? "custom" : sizeDef.key,
      width: clampNumber(canvas.width, 240, 4e3, sizeDef.width),
      height: clampNumber(canvas.height, 180, 4e3, sizeDef.height),
      showGrid: canvas.showGrid !== false,
      gridSize: clampNumber(canvas.gridSize, 8, 96, DEFAULT_ROUTE_CANVAS.gridSize),
      zoom: clampNumber(canvas.zoom, 0.35, 2.5, DEFAULT_ROUTE_CANVAS.zoom),
      panX: numberOr(canvas.panX, DEFAULT_ROUTE_CANVAS.panX),
      panY: numberOr(canvas.panY, DEFAULT_ROUTE_CANVAS.panY)
    };
  }
  function normalizeRoute2(route = {}) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const elements = Array.isArray(route.elements) ? route.elements.map(normalizeElement) : [];
    return {
      id: String(route.id || uid("route")),
      title: String(route.title || "Nuovo percorso"),
      description: String(route.description || ""),
      objective: String(route.objective || route.teachingObjective || ""),
      level: clampNumber(route.level, 1, 10, 1),
      skills: parseList(route.skills),
      estimatedDurationMinutes: clampNumber(route.estimatedDurationMinutes, 0, 600, 10),
      recommendedStudents: String(route.recommendedStudents || ""),
      materials: String(route.materials || ""),
      safetyNotes: String(route.safetyNotes || ""),
      canvas: normalizeCanvas(route.canvas || {}),
      elements,
      executionSequence: Array.isArray(route.executionSequence) ? route.executionSequence.map((item) => String(item)).filter(Boolean) : elements.filter((element) => element.order != null).sort((a, b) => Number(a.order) - Number(b.order)).map((element) => element.id),
      createdAt: String(route.createdAt || now),
      updatedAt: String(route.updatedAt || now)
    };
  }
  function applyCanvasSize(route, sizeKey) {
    const size = getCanvasSize(sizeKey);
    const canvas = __spreadProps(__spreadValues({}, route.canvas), {
      size: size.key,
      width: size.key === "custom" ? route.canvas.width : size.width,
      height: size.key === "custom" ? route.canvas.height : size.height
    });
    return normalizeRoute2(__spreadProps(__spreadValues({}, route), { canvas }));
  }
  window.RouteModels = {
    ROUTE_ELEMENT_TYPES,
    ROUTE_CANVAS_SIZES,
    ROUTE_VARIANT_COLORS,
    DEFAULT_ROUTE_CANVAS,
    getElementType,
    hasElementType,
    getCanvasSize,
    createElement,
    createRoute,
    normalizeElement,
    normalizeRoute: normalizeRoute2,
    parseList,
    applyCanvasSize,
    uid
  };
  window.ROUTE_ELEMENT_TYPES = ROUTE_ELEMENT_TYPES;
})();
(function() {
  "use strict";
  const STORAGE_KEY = "bladingManagerRoutes:v1";
  const meta = { backend: "localStorage", version: 1 };
  const memory = /* @__PURE__ */ new Map();
  function storage() {
    try {
      const key = "__route_storage_test__";
      window.localStorage.setItem(key, "1");
      window.localStorage.removeItem(key);
      return window.localStorage;
    } catch (e) {
      return {
        getItem: (key) => memory.get(key) || null,
        setItem: (key, value) => {
          memory.set(key, String(value));
        },
        removeItem: (key) => {
          memory.delete(key);
        }
      };
    }
  }
  function readRawList() {
    try {
      const parsed = JSON.parse(storage().getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  function persist(list2) {
    storage().setItem(STORAGE_KEY, JSON.stringify(list2, null, 2));
  }
  function list() {
    return readRawList().map((route) => window.RouteModels.normalizeRoute(route)).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  }
  function get(id) {
    return list().find((route) => String(route.id) === String(id)) || null;
  }
  function save(route) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const normalized = window.RouteModels.normalizeRoute(__spreadProps(__spreadValues({}, route), { updatedAt: now }));
    const routes = readRawList().filter((item) => String(item.id) !== String(normalized.id));
    routes.unshift(normalized);
    persist(routes);
    return normalized;
  }
  function remove(id) {
    const routes = readRawList().filter((item) => String(item.id) !== String(id));
    persist(routes);
    return routes.length;
  }
  function exists(id) {
    return readRawList().some((item) => String(item.id) === String(id));
  }
  window.RouteStorage = { meta, list, get, save, remove, exists };
})();
(function() {
  "use strict";
  function routeToJson(route) {
    return JSON.stringify(window.RouteModels.normalizeRoute(route), null, 2);
  }
  function parseRouteJson(text) {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      throw new Error("File JSON non valido.");
    }
    if (!parsed || typeof parsed !== "object") throw new Error("Il JSON non contiene un percorso.");
    if (!Array.isArray(parsed.elements)) throw new Error("Il percorso deve contenere una lista elements.");
    return window.RouteModels.normalizeRoute(parsed);
  }
  function safeFilename(value) {
    return String(value || "percorso").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9_-]/g, "").slice(0, 64) || "percorso";
  }
  function downloadRouteJson(route) {
    const normalized = window.RouteModels.normalizeRoute(route);
    const blob = new Blob([routeToJson(normalized)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${safeFilename(normalized.title)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  function parseRouteFile(file) {
    return __async(this, null, function* () {
      if (!file) throw new Error("Scegli un file JSON da importare.");
      return parseRouteJson(yield file.text());
    });
  }
  window.RouteJsonUtils = {
    routeToJson,
    parseRouteJson,
    downloadRouteJson,
    parseRouteFile
  };
})();
(function() {
  "use strict";
  class ElementPalette {
    constructor(root, options = {}) {
      this.root = root;
      this.onAdd = options.onAdd || function() {
      };
    }
    render() {
      const groups = window.ROUTE_ELEMENT_TYPES.reduce((acc, item) => {
        const key = item.category || "Altro";
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});
      this.root.innerHTML = `
        <div class="route-panel-head">
          <h3>Palette</h3>
          <span>${window.ROUTE_ELEMENT_TYPES.length}</span>
        </div>
        <div class="route-palette-groups">
          ${Object.entries(groups).map(([category, items]) => `
            <div class="route-palette-group">
              <div class="route-palette-category">${category}</div>
              ${items.map((item) => this.renderItem(item)).join("")}
            </div>
          `).join("")}
        </div>
      `;
      this.root.querySelectorAll("[data-route-element-type]").forEach((button) => {
        button.addEventListener("click", () => this.onAdd(button.dataset.routeElementType));
        button.addEventListener("dragstart", (event) => {
          event.dataTransfer.effectAllowed = "copy";
          event.dataTransfer.setData("application/x-route-element-type", button.dataset.routeElementType);
          event.dataTransfer.setData("text/plain", button.dataset.routeElementType);
        });
      });
    }
    renderItem(item) {
      const color = window.RouteModels.ROUTE_VARIANT_COLORS[item.defaultVariant] || window.RouteModels.ROUTE_VARIANT_COLORS.gray;
      return `
        <button type="button" class="route-palette-item" draggable="true" data-route-element-type="${item.type}">
          <span class="route-palette-swatch route-swatch-${item.type}" style="--route-swatch:${color}"></span>
          <span class="route-palette-label">${item.label}</span>
        </button>
      `;
    }
  }
  window.ElementPalette = ElementPalette;
})();
(function() {
  "use strict";
  class CanvasArea {
    constructor(root, options = {}) {
      this.root = root;
      this.onAddElement = options.onAddElement || function() {
      };
      this.onSelect = options.onSelect || function() {
      };
      this.onChangeElement = options.onChangeElement || function() {
      };
      this.onCanvasChange = options.onCanvasChange || function() {
      };
      this.route = null;
      this.selectedId = null;
      this.panMode = false;
      this.dragState = null;
      this.root.innerHTML = `
        <div class="route-canvas-shell">
          <div class="route-canvas-ruler" id="route-canvas-ruler"></div>
          <div class="route-canvas-viewport" id="route-canvas-viewport">
            <div class="route-canvas-content" id="route-canvas-content">
              <div class="route-canvas-stage" id="route-canvas-stage"></div>
            </div>
          </div>
        </div>
      `;
      this.viewport = this.root.querySelector("#route-canvas-viewport");
      this.content = this.root.querySelector("#route-canvas-content");
      this.stage = this.root.querySelector("#route-canvas-stage");
      this.ruler = this.root.querySelector("#route-canvas-ruler");
      this.bind();
    }
    bind() {
      this.viewport.addEventListener("dragover", (event) => {
        if (event.dataTransfer.types.includes("application/x-route-element-type") || event.dataTransfer.types.includes("text/plain")) {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
        }
      });
      this.viewport.addEventListener("drop", (event) => {
        const type = event.dataTransfer.getData("application/x-route-element-type") || event.dataTransfer.getData("text/plain");
        if (!type || !window.RouteModels.hasElementType(type)) return;
        event.preventDefault();
        const point = this.stagePoint(event.clientX, event.clientY);
        this.onAddElement(type, point);
      });
      this.viewport.addEventListener("pointerdown", (event) => {
        const item = event.target.closest(".route-canvas-element");
        if (item) {
          event.preventDefault();
          const element = this.route.elements.find((candidate) => candidate.id === item.dataset.elementId);
          if (!element) return;
          this.onSelect(element.id);
          this.dragState = {
            mode: "element",
            id: element.id,
            startX: event.clientX,
            startY: event.clientY,
            originalX: element.x,
            originalY: element.y
          };
          this.viewport.setPointerCapture(event.pointerId);
          return;
        }
        if (this.panMode || event.shiftKey || event.button === 1) {
          event.preventDefault();
          this.dragState = {
            mode: "pan",
            startX: event.clientX,
            startY: event.clientY,
            panX: this.route.canvas.panX,
            panY: this.route.canvas.panY
          };
          this.viewport.classList.add("is-panning");
          this.viewport.setPointerCapture(event.pointerId);
          return;
        }
        this.onSelect(null);
      });
      this.viewport.addEventListener("pointermove", (event) => {
        if (!this.dragState || !this.route) return;
        if (this.dragState.mode === "element") {
          const zoom = this.route.canvas.zoom || 1;
          const dx = (event.clientX - this.dragState.startX) / zoom;
          const dy = (event.clientY - this.dragState.startY) / zoom;
          const element = this.route.elements.find((candidate) => candidate.id === this.dragState.id);
          if (!element) return;
          const nextX = Math.round(Math.max(0, Math.min(this.route.canvas.width - element.width, this.dragState.originalX + dx)));
          const nextY = Math.round(Math.max(0, Math.min(this.route.canvas.height - element.height, this.dragState.originalY + dy)));
          this.onChangeElement(this.dragState.id, { x: nextX, y: nextY });
          return;
        }
        if (this.dragState.mode === "pan") {
          this.onCanvasChange({
            panX: Math.round(this.dragState.panX + event.clientX - this.dragState.startX),
            panY: Math.round(this.dragState.panY + event.clientY - this.dragState.startY)
          });
        }
      });
      const stopPointer = (event) => {
        if (!this.dragState) return;
        this.dragState = null;
        this.viewport.classList.remove("is-panning");
        try {
          this.viewport.releasePointerCapture(event.pointerId);
        } catch (e) {
        }
      };
      this.viewport.addEventListener("pointerup", stopPointer);
      this.viewport.addEventListener("pointercancel", stopPointer);
      this.viewport.addEventListener("wheel", (event) => {
        if (!this.route || !event.ctrlKey && !event.metaKey && !event.altKey) return;
        event.preventDefault();
        const current = this.route.canvas.zoom || 1;
        const direction = event.deltaY > 0 ? -1 : 1;
        const next = Math.min(2.5, Math.max(0.35, Math.round((current + direction * 0.1) * 100) / 100));
        this.onCanvasChange({ zoom: next });
      }, { passive: false });
    }
    stagePoint(clientX, clientY) {
      var _a2, _b2;
      const rect = this.stage.getBoundingClientRect();
      const zoom = ((_b2 = (_a2 = this.route) == null ? void 0 : _a2.canvas) == null ? void 0 : _b2.zoom) || 1;
      return {
        x: Math.round(Math.max(0, Math.min(this.route.canvas.width, (clientX - rect.left) / zoom))),
        y: Math.round(Math.max(0, Math.min(this.route.canvas.height, (clientY - rect.top) / zoom)))
      };
    }
    setState(route, selectedId, options = {}) {
      this.route = route;
      this.selectedId = selectedId;
      this.panMode = !!options.panMode;
      this.render();
    }
    render() {
      if (!this.route) return;
      const canvas = this.route.canvas;
      this.viewport.classList.toggle("is-pan-mode", this.panMode);
      this.ruler.textContent = `${canvas.width} x ${canvas.height} px`;
      this.content.style.transform = `translate(${canvas.panX}px, ${canvas.panY}px) scale(${canvas.zoom})`;
      this.stage.style.width = `${canvas.width}px`;
      this.stage.style.height = `${canvas.height}px`;
      this.stage.style.setProperty("--route-grid-size", `${canvas.gridSize || 24}px`);
      this.stage.classList.toggle("show-grid", !!canvas.showGrid);
      this.stage.innerHTML = this.route.elements.map((element) => this.renderElement(element)).join("");
    }
    renderElement(element) {
      const def = window.RouteModels.getElementType(element.type);
      const color = window.RouteModels.ROUTE_VARIANT_COLORS[element.variant] || window.RouteModels.ROUTE_VARIANT_COLORS.gray;
      const isSelected = this.selectedId === element.id ? " is-selected" : "";
      const required = element.required ? " required" : " optional";
      const order = element.order == null ? "" : `<span class="route-order-badge">${element.order}</span>`;
      return `
        <div
          class="route-canvas-element route-element-${element.type}${isSelected}${required}"
          data-element-id="${element.id}"
          title="${escapeHtml(element.label)}"
          style="left:${element.x}px;top:${element.y}px;width:${element.width}px;height:${element.height}px;--route-rotation:${element.rotation}deg;--route-element-color:${color}"
        >
          <div class="route-element-visual">
            ${order}
            <span class="route-element-text">${escapeHtml(shortLabel(def.label, element.label))}</span>
          </div>
        </div>
      `;
    }
  }
  function shortLabel(typeLabel, elementLabel) {
    const label = elementLabel || typeLabel;
    if (label.length <= 12) return label;
    return label.split(/\s+/).map((part) => part[0]).join("").slice(0, 5).toUpperCase();
  }
  function escapeHtml(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  window.CanvasArea = CanvasArea;
})();
(function() {
  "use strict";
  class ElementPropertiesPanel {
    constructor(root, options = {}) {
      this.root = root;
      this.onChange = options.onChange || function() {
      };
      this.onDuplicate = options.onDuplicate || function() {
      };
      this.onDelete = options.onDelete || function() {
      };
      this.onRotate = options.onRotate || function() {
      };
      this.route = null;
      this.selectedId = null;
      this.skillOptions = [];
    }
    setState(route, selectedId, skillOptions = []) {
      this.route = route;
      this.selectedId = selectedId;
      this.skillOptions = skillOptions;
      this.render();
    }
    render() {
      var _a2, _b2, _c, _d;
      const element = (_a2 = this.route) == null ? void 0 : _a2.elements.find((item) => item.id === this.selectedId);
      if (!element) {
        this.root.innerHTML = `
          <div class="route-panel-head">
            <h3>Proprieta</h3>
            <span>${((_b2 = this.route) == null ? void 0 : _b2.elements.length) || 0}</span>
          </div>
          <div class="route-empty-panel">
            <strong>Nessun elemento selezionato</strong>
            <span>${((_c = this.route) == null ? void 0 : _c.elements.length) || 0} elementi nel percorso</span>
          </div>
        `;
        return;
      }
      const def = window.RouteModels.getElementType(element.type);
      const variants = (def.variants || [def.defaultVariant]).map((variant) => `
        <option value="${variant}" ${variant === element.variant ? "selected" : ""}>${variant}</option>
      `).join("");
      const types = window.ROUTE_ELEMENT_TYPES.map((item) => `
        <option value="${item.type}" ${item.type === element.type ? "selected" : ""}>${item.label}</option>
      `).join("");
      this.root.innerHTML = `
        <div class="route-panel-head">
          <h3>Proprieta</h3>
          <span>${escapeHtml(def.label)}</span>
        </div>
        <div class="route-props-actions">
          <button type="button" class="btn btn-outline btn-sm" data-action="rotate-left">Ruota -15</button>
          <button type="button" class="btn btn-outline btn-sm" data-action="rotate-right">Ruota +15</button>
          <button type="button" class="btn btn-outline btn-sm" data-action="duplicate">Duplica</button>
          <button type="button" class="btn btn-delete-soft btn-sm" data-action="delete">Elimina</button>
        </div>
        <div class="route-props-grid">
          ${field("label", "Nome", element.label)}
          <label class="field"><span>Tipo</span><select data-field="type">${types}</select></label>
          ${numberField("x", "X", element.x, 0)}
          ${numberField("y", "Y", element.y, 0)}
          ${numberField("rotation", "Rotazione", element.rotation)}
          ${numberField("width", "Larghezza", element.width, 8)}
          ${numberField("height", "Altezza", element.height, 8)}
          <label class="field"><span>Variante</span><select data-field="variant">${variants}</select></label>
          ${numberField("difficulty", "Difficolta", element.difficulty, 1, 10)}
          ${numberField("order", "Ordine", (_d = element.order) != null ? _d : "", 1)}
          <label class="field route-wide-field"><span>Skill collegata</span><input data-field="skill" list="route-skill-options" value="${escapeAttr(element.skill)}" placeholder="Nome skill"></label>
          <label class="route-check-field"><input type="checkbox" data-field="required" ${element.required ? "checked" : ""}> Obbligatorio</label>
          <label class="field route-wide-field"><span>Note didattiche</span><textarea data-field="notes" rows="5">${escapeHtml(element.notes)}</textarea></label>
        </div>
        <datalist id="route-skill-options">
          ${this.skillOptions.map((name) => `<option value="${escapeAttr(name)}"></option>`).join("")}
        </datalist>
      `;
      this.root.querySelectorAll("[data-field]").forEach((input) => {
        input.addEventListener("input", () => this.emitChange(input, element));
        input.addEventListener("change", () => this.emitChange(input, element));
      });
      this.root.querySelectorAll("[data-action]").forEach((button) => {
        button.addEventListener("click", () => {
          const action = button.dataset.action;
          if (action === "duplicate") this.onDuplicate(element.id);
          if (action === "delete") this.onDelete(element.id);
          if (action === "rotate-left") this.onRotate(element.id, -15);
          if (action === "rotate-right") this.onRotate(element.id, 15);
        });
      });
    }
    emitChange(input, element) {
      const fieldName = input.dataset.field;
      let value = input.type === "checkbox" ? input.checked : input.value;
      if (["x", "y", "rotation", "width", "height", "difficulty", "order"].includes(fieldName)) {
        value = value === "" && fieldName === "order" ? null : Number(value);
      }
      const patch = { [fieldName]: value };
      if (fieldName === "type") {
        const nextDef = window.RouteModels.getElementType(value);
        const previousDef = window.RouteModels.getElementType(element.type);
        patch.variant = nextDef.defaultVariant;
        if (!element.label || element.label === previousDef.label) patch.label = nextDef.label;
      }
      this.onChange(element.id, patch);
    }
  }
  function field(name, label, value) {
    return `<label class="field route-wide-field"><span>${label}</span><input data-field="${name}" value="${escapeAttr(value)}"></label>`;
  }
  function numberField(name, label, value, min = null, max = null) {
    return `<label class="field"><span>${label}</span><input type="number" data-field="${name}" value="${escapeAttr(value)}" ${min == null ? "" : `min="${min}"`} ${max == null ? "" : `max="${max}"`}></label>`;
  }
  function escapeHtml(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function escapeAttr(value) {
    return escapeHtml(value).replace(/"/g, "&quot;");
  }
  window.ElementPropertiesPanel = ElementPropertiesPanel;
})();
(function() {
  "use strict";
  class RouteToolbar {
    constructor(root, options = {}) {
      this.root = root;
      this.handlers = options;
      this.route = null;
      this.savedRoutes = [];
      this.status = null;
      this.panMode = false;
    }
    setState(route, savedRoutes, status, panMode) {
      this.route = route;
      this.savedRoutes = savedRoutes || [];
      this.status = status || null;
      this.panMode = !!panMode;
      this.render();
    }
    render() {
      var _a2, _b2;
      const route = this.route;
      const canvas = route.canvas;
      const sizes = window.RouteModels.ROUTE_CANVAS_SIZES.map((size) => `
        <option value="${size.key}" ${size.key === canvas.size ? "selected" : ""}>${size.label}</option>
      `).join("");
      const savedOptions = this.savedRoutes.map((item) => `
        <option value="${item.id}" ${item.id === route.id ? "selected" : ""}>${escapeHtml(item.title)}</option>
      `).join("");
      const statusClass = ((_a2 = this.status) == null ? void 0 : _a2.type) ? ` ${this.status.type}` : "";
      this.root.innerHTML = `
        <div class="route-toolbar">
          <div class="route-title-row">
            <label class="field route-title-field"><span>Titolo percorso</span><input data-route-field="title" value="${escapeAttr(route.title)}"></label>
            <div class="route-toolbar-actions">
              <button type="button" class="btn btn-outline btn-sm" data-action="new">Nuovo</button>
              <button type="button" class="btn btn-primary btn-sm" data-action="save">Salva</button>
              <button type="button" class="btn btn-outline btn-sm" data-action="export">Esporta JSON</button>
              <label class="btn btn-outline btn-sm route-file-label">Importa JSON<input type="file" accept=".json,application/json" data-action="import" hidden></label>
              <button type="button" class="btn btn-delete-soft btn-sm" data-action="reset">Reset canvas</button>
            </div>
          </div>

          <div class="route-load-row">
            <label class="field"><span>Carica percorso</span><select data-action="load">
              <option value="">Percorsi salvati</option>
              ${savedOptions}
            </select></label>
            <label class="field"><span>Spazio</span><select data-canvas-field="size">${sizes}</select></label>
            <label class="field route-dimension-field"><span>Larghezza</span><input type="number" min="240" data-canvas-field="width" value="${canvas.width}" ${canvas.size !== "custom" ? "readonly" : ""}></label>
            <label class="field route-dimension-field"><span>Altezza</span><input type="number" min="180" data-canvas-field="height" value="${canvas.height}" ${canvas.size !== "custom" ? "readonly" : ""}></label>
            <label class="route-check-field"><input type="checkbox" data-canvas-field="showGrid" ${canvas.showGrid ? "checked" : ""}> Griglia</label>
            <div class="route-zoom-controls">
              <button type="button" class="btn btn-outline btn-sm" data-action="zoom-out">-</button>
              <span>${Math.round(canvas.zoom * 100)}%</span>
              <button type="button" class="btn btn-outline btn-sm" data-action="zoom-in">+</button>
              <button type="button" class="btn btn-outline btn-sm ${this.panMode ? "is-on" : ""}" data-action="pan">Pan</button>
            </div>
          </div>

          <div class="route-meta-grid">
            <label class="field route-wide-field"><span>Descrizione</span><textarea rows="2" data-route-field="description">${escapeHtml(route.description)}</textarea></label>
            <label class="field route-wide-field"><span>Obiettivo didattico</span><textarea rows="2" data-route-field="objective">${escapeHtml(route.objective)}</textarea></label>
            <label class="field"><span>Livello consigliato</span><input type="number" min="1" max="10" data-route-field="level" value="${route.level}"></label>
            <label class="field"><span>Durata stimata min</span><input type="number" min="0" data-route-field="estimatedDurationMinutes" value="${route.estimatedDurationMinutes}"></label>
            <label class="field"><span>Allievi consigliati</span><input data-route-field="recommendedStudents" value="${escapeAttr(route.recommendedStudents)}"></label>
            <label class="field route-wide-field"><span>Skill coinvolte</span><input data-route-field="skills" value="${escapeAttr(route.skills.join(", "))}" placeholder="slalom, frenata_limone"></label>
            <label class="field route-wide-field"><span>Materiali necessari</span><textarea rows="2" data-route-field="materials">${escapeHtml(route.materials)}</textarea></label>
            <label class="field route-wide-field"><span>Note sicurezza</span><textarea rows="2" data-route-field="safetyNotes">${escapeHtml(route.safetyNotes)}</textarea></label>
          </div>

          <div class="route-status${statusClass}" ${this.status ? "" : "hidden"}>${escapeHtml(((_b2 = this.status) == null ? void 0 : _b2.message) || "")}</div>
        </div>
      `;
      this.bind();
    }
    bind() {
      this.root.querySelectorAll("[data-route-field]").forEach((input) => {
        input.addEventListener("input", () => {
          var _a2, _b2;
          const field = input.dataset.routeField;
          let value = input.value;
          if (["level", "estimatedDurationMinutes"].includes(field)) value = Number(value);
          (_b2 = (_a2 = this.handlers).onRouteChange) == null ? void 0 : _b2.call(_a2, field, value);
        });
      });
      this.root.querySelectorAll("[data-canvas-field]").forEach((input) => {
        input.addEventListener("input", () => this.emitCanvasChange(input));
        input.addEventListener("change", () => this.emitCanvasChange(input));
      });
      this.root.querySelectorAll("[data-action]").forEach((control) => {
        const action = control.dataset.action;
        if (action === "import") {
          control.addEventListener("change", () => {
            var _a2, _b2, _c;
            (_c = (_b2 = this.handlers).onImport) == null ? void 0 : _c.call(_b2, (_a2 = control.files) == null ? void 0 : _a2[0]);
            control.value = "";
          });
          return;
        }
        if (action === "load") {
          control.addEventListener("change", () => {
            var _a2, _b2;
            if (control.value) (_b2 = (_a2 = this.handlers).onLoad) == null ? void 0 : _b2.call(_a2, control.value);
          });
          return;
        }
        control.addEventListener("click", () => this.dispatchAction(action));
      });
    }
    emitCanvasChange(input) {
      var _a2, _b2;
      const field = input.dataset.canvasField;
      let value = input.type === "checkbox" ? input.checked : input.value;
      if (["width", "height"].includes(field)) value = Number(value);
      (_b2 = (_a2 = this.handlers).onCanvasChange) == null ? void 0 : _b2.call(_a2, { [field]: value });
    }
    dispatchAction(action) {
      var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
      if (action === "new") (_b2 = (_a2 = this.handlers).onNew) == null ? void 0 : _b2.call(_a2);
      if (action === "save") (_d = (_c = this.handlers).onSave) == null ? void 0 : _d.call(_c);
      if (action === "export") (_f = (_e = this.handlers).onExport) == null ? void 0 : _f.call(_e);
      if (action === "reset") (_h = (_g = this.handlers).onResetCanvas) == null ? void 0 : _h.call(_g);
      if (action === "zoom-in") (_j = (_i = this.handlers).onZoom) == null ? void 0 : _j.call(_i, 0.1);
      if (action === "zoom-out") (_l = (_k = this.handlers).onZoom) == null ? void 0 : _l.call(_k, -0.1);
      if (action === "pan") (_n = (_m = this.handlers).onTogglePan) == null ? void 0 : _n.call(_m);
    }
  }
  function escapeHtml(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function escapeAttr(value) {
    return escapeHtml(value).replace(/"/g, "&quot;");
  }
  window.RouteToolbar = RouteToolbar;
})();
(function() {
  "use strict";
  class RouteBuilderPage {
    constructor(root) {
      this.root = root;
      this.route = window.RouteModels.createRoute();
      this.savedRoutes = [];
      this.selectedId = null;
      this.status = null;
      this.panMode = false;
      this.mounted = false;
      this.toolbar = null;
      this.palette = null;
      this.canvas = null;
      this.properties = null;
    }
    init() {
      if (!this.mounted) this.mount();
      this.savedRoutes = window.RouteStorage.list();
      if (!this.savedRoutes.length && !this.route.elements.length) {
        this.route = this.createStarterRoute();
      }
      this.render();
    }
    mount() {
      this.root.innerHTML = `
        <div class="route-builder-page">
          <div class="section-header route-builder-heading">
            <div>
              <h2>Percorsi / Campo esercizi</h2>
              <p class="route-builder-subtitle">Editor operativo per percorsi didattici, materiali e sequenze.</p>
            </div>
          </div>
          <div id="route-toolbar-root"></div>
          <div class="route-builder-layout">
            <aside class="route-side-panel" id="route-palette-root"></aside>
            <section class="route-canvas-panel" id="route-canvas-root"></section>
            <aside class="route-side-panel route-props-panel" id="route-properties-root"></aside>
          </div>
        </div>
      `;
      this.toolbar = new window.RouteToolbar(this.root.querySelector("#route-toolbar-root"), {
        onRouteChange: (field, value) => this.updateRouteField(field, value),
        onCanvasChange: (patch) => this.updateCanvas(patch),
        onSave: () => this.save(),
        onLoad: (id) => this.load(id),
        onExport: () => this.exportJson(),
        onImport: (file) => this.importJson(file),
        onResetCanvas: () => this.resetCanvas(),
        onNew: () => this.newRoute(),
        onZoom: (delta) => this.zoom(delta),
        onTogglePan: () => this.togglePan()
      });
      this.palette = new window.ElementPalette(this.root.querySelector("#route-palette-root"), {
        onAdd: (type) => this.addElement(type)
      });
      this.canvas = new window.CanvasArea(this.root.querySelector("#route-canvas-root"), {
        onAddElement: (type, point) => this.addElement(type, point),
        onSelect: (id) => this.selectElement(id),
        onChangeElement: (id, patch) => this.updateElement(id, patch, { quiet: true }),
        onCanvasChange: (patch) => this.updateCanvas(patch, { quiet: true })
      });
      this.properties = new window.ElementPropertiesPanel(this.root.querySelector("#route-properties-root"), {
        onChange: (id, patch) => this.updateElement(id, patch),
        onDuplicate: (id) => this.duplicateElement(id),
        onDelete: (id) => this.deleteElement(id),
        onRotate: (id, delta) => this.rotateElement(id, delta)
      });
      this.mounted = true;
    }
    createStarterRoute() {
      const route = window.RouteModels.createRoute({
        title: "Slalom base con frenata finale",
        description: "Sequenza introduttiva con slalom regolare e stop controllato.",
        objective: "Controllo traiettoria, ritmo e frenata in uscita.",
        level: 1,
        skills: ["slalom", "frenata_limone", "posizione_base"],
        estimatedDurationMinutes: 10,
        recommendedStudents: "1-4",
        materials: "6 conetti, linea di partenza, punto di stop",
        safetyNotes: "Lasciare spazio libero dopo lo stop e ridurre velocita al primo giro."
      });
      const items = [
        window.RouteModels.createElement("start_line", { x: 70, y: 220 }, { label: "Partenza", order: 1 }),
        window.RouteModels.createElement("slalom", { x: 250, y: 198 }, { label: "Slalom base", order: 2, skill: "Slalom base" }),
        window.RouteModels.createElement("stop_point", { x: 530, y: 210 }, { label: "Stop finale", order: 3, skill: "Frenata limone" }),
        window.RouteModels.createElement("finish_line", { x: 630, y: 220 }, { label: "Arrivo", order: 4 })
      ];
      return window.RouteModels.normalizeRoute(__spreadProps(__spreadValues({}, route), { elements: items }));
    }
    render() {
      this.savedRoutes = window.RouteStorage.list();
      this.toolbar.setState(this.route, this.savedRoutes, this.status, this.panMode);
      this.palette.render();
      this.canvas.setState(this.route, this.selectedId, { panMode: this.panMode });
      this.properties.setState(this.route, this.selectedId, this.skillOptions());
    }
    setStatus(message, type = "msg-info") {
      this.status = message ? { message, type } : null;
      window.clearTimeout(this.statusTimer);
      if (message) {
        this.statusTimer = window.setTimeout(() => {
          this.status = null;
          if (this.mounted) this.render();
        }, 3200);
      }
    }
    markUpdated(route) {
      this.route = window.RouteModels.normalizeRoute(__spreadProps(__spreadValues({}, route), { updatedAt: (/* @__PURE__ */ new Date()).toISOString() }));
    }
    updateRouteField(field, value) {
      const next = __spreadProps(__spreadValues({}, this.route), { [field]: field === "skills" ? window.RouteModels.parseList(value) : value });
      this.markUpdated(next);
      this.render();
    }
    updateCanvas(patch, options = {}) {
      let nextRoute = __spreadProps(__spreadValues({}, this.route), { canvas: __spreadValues(__spreadValues({}, this.route.canvas), patch) });
      if (Object.prototype.hasOwnProperty.call(patch, "size")) {
        nextRoute = window.RouteModels.applyCanvasSize(nextRoute, patch.size);
      } else {
        nextRoute = window.RouteModels.normalizeRoute(nextRoute);
      }
      this.markUpdated(nextRoute);
      if (!options.quiet) this.setStatus("Canvas aggiornato.", "msg-info");
      this.render();
    }
    addElement(type, point = null) {
      const def = window.RouteModels.getElementType(type);
      const center = point || {
        x: Math.max(20, Math.round(this.route.canvas.width / 2 - def.defaultWidth / 2)),
        y: Math.max(20, Math.round(this.route.canvas.height / 2 - def.defaultHeight / 2))
      };
      const maxOrder = this.route.elements.reduce((max, item) => Math.max(max, Number(item.order) || 0), 0);
      const element = window.RouteModels.createElement(type, center, { order: maxOrder + 1 });
      this.markUpdated(__spreadProps(__spreadValues({}, this.route), { elements: [...this.route.elements, element] }));
      this.selectedId = element.id;
      this.setStatus(`${def.label} aggiunto.`, "msg-ok");
      this.render();
    }
    selectElement(id) {
      this.selectedId = id;
      this.render();
    }
    updateElement(id, patch, options = {}) {
      const elements = this.route.elements.map((element) => {
        if (element.id !== id) return element;
        return window.RouteModels.normalizeElement(__spreadValues(__spreadValues({}, element), patch));
      });
      this.markUpdated(__spreadProps(__spreadValues({}, this.route), { elements }));
      if (!options.quiet) this.setStatus("Elemento aggiornato.", "msg-info");
      this.render();
    }
    duplicateElement(id) {
      const source = this.route.elements.find((element) => element.id === id);
      if (!source) return;
      const maxOrder = this.route.elements.reduce((max, item) => Math.max(max, Number(item.order) || 0), 0);
      const clone = window.RouteModels.normalizeElement(__spreadProps(__spreadValues({}, source), {
        id: window.RouteModels.uid("el"),
        x: Math.max(0, Math.min(source.x + 24, this.route.canvas.width - source.width)),
        y: Math.max(0, Math.min(source.y + 24, this.route.canvas.height - source.height)),
        label: `${source.label} copia`,
        order: maxOrder + 1
      }));
      this.markUpdated(__spreadProps(__spreadValues({}, this.route), { elements: [...this.route.elements, clone] }));
      this.selectedId = clone.id;
      this.setStatus("Elemento duplicato.", "msg-ok");
      this.render();
    }
    deleteElement(id) {
      const source = this.route.elements.find((element) => element.id === id);
      if (!source) return;
      if (!window.confirm(`Eliminare "${source.label}" dal percorso?`)) return;
      this.markUpdated(__spreadProps(__spreadValues({}, this.route), { elements: this.route.elements.filter((element) => element.id !== id) }));
      this.selectedId = null;
      this.setStatus("Elemento eliminato.", "msg-info");
      this.render();
    }
    rotateElement(id, delta) {
      const source = this.route.elements.find((element) => element.id === id);
      if (!source) return;
      const rotation = Math.round((Number(source.rotation) + delta + 360) % 360);
      this.updateElement(id, { rotation });
    }
    resetCanvas() {
      if (this.route.elements.length && !window.confirm("Svuotare il canvas di questo percorso?")) return;
      this.markUpdated(__spreadProps(__spreadValues({}, this.route), {
        elements: [],
        executionSequence: [],
        canvas: __spreadProps(__spreadValues({}, this.route.canvas), { zoom: 1, panX: 18, panY: 18 })
      }));
      this.selectedId = null;
      this.setStatus("Canvas svuotato.", "msg-info");
      this.render();
    }
    newRoute() {
      if (this.route.elements.length && !window.confirm("Creare un nuovo percorso non salvato?")) return;
      this.route = window.RouteModels.createRoute();
      this.selectedId = null;
      this.panMode = false;
      this.setStatus("Nuovo percorso pronto.", "msg-info");
      this.render();
    }
    save() {
      this.route = window.RouteStorage.save(this.route);
      this.setStatus("Percorso salvato in locale.", "msg-ok");
      this.render();
    }
    load(id) {
      const route = window.RouteStorage.get(id);
      if (!route) {
        this.setStatus("Percorso salvato non trovato.", "msg-err");
        this.render();
        return;
      }
      this.route = route;
      this.selectedId = null;
      this.panMode = false;
      this.setStatus("Percorso caricato.", "msg-ok");
      this.render();
    }
    exportJson() {
      window.RouteJsonUtils.downloadRouteJson(this.route);
      this.setStatus("JSON esportato.", "msg-ok");
      this.render();
    }
    importJson(file) {
      return __async(this, null, function* () {
        try {
          let route = yield window.RouteJsonUtils.parseRouteFile(file);
          if (window.RouteStorage.exists(route.id)) {
            route = window.RouteModels.normalizeRoute(__spreadProps(__spreadValues({}, route), {
              id: window.RouteModels.uid("route"),
              title: `${route.title} importato`,
              createdAt: (/* @__PURE__ */ new Date()).toISOString()
            }));
          }
          this.route = route;
          this.selectedId = null;
          this.panMode = false;
          this.setStatus("JSON importato. Premi Salva per conservarlo.", "msg-ok");
        } catch (error) {
          this.setStatus(error.message || "Importazione non riuscita.", "msg-err");
        }
        this.render();
      });
    }
    zoom(delta) {
      const next = Math.min(2.5, Math.max(0.35, Math.round((this.route.canvas.zoom + delta) * 100) / 100));
      this.updateCanvas({ zoom: next }, { quiet: true });
    }
    togglePan() {
      this.panMode = !this.panMode;
      this.setStatus(this.panMode ? "Pan attivo." : "Pan disattivato.", "msg-info");
      this.render();
    }
    skillOptions() {
      const names = /* @__PURE__ */ new Set();
      if (Array.isArray(window.SKILLTREE_NODES)) {
        window.SKILLTREE_NODES.forEach((skill) => {
          if (skill == null ? void 0 : skill.name) names.add(skill.name);
        });
      }
      try {
        if (Array.isArray(allSkills)) {
          allSkills.forEach((skill) => {
            if (skill == null ? void 0 : skill.nome) names.add(skill.nome);
            if (skill == null ? void 0 : skill.name) names.add(skill.name);
          });
        }
      } catch (e) {
      }
      return Array.from(names).sort((a, b) => a.localeCompare(b, "it"));
    }
  }
  let routeBuilderPage = null;
  window.initRouteBuilderPage = function initRouteBuilderPage2() {
    const root = document.getElementById("route-builder-root");
    if (!root) return;
    if (!routeBuilderPage) routeBuilderPage = new RouteBuilderPage(root);
    routeBuilderPage.init();
  };
  window.RouteBuilderPage = RouteBuilderPage;
})();
const SUPA_URL = "https://mhioneawefsvagbccsum.supabase.co";
const SUPA_KEY = "sb_publishable_SGGdSVxCEAXLgMGAjRksMQ_PbIvMIuH";
let sb, allAllievi = [], allSkills = [], allPrereqs = [], allProgressi = [], skillDefinitions = [], appInited = false, editingAllieviId = null, editingGruppoNome = null, currentUid = null, currentEmail = "", currentUserMetadata = {}, mostraArchiviati = false, filtroGruppo = null, filtroLezioni = "all", filtroLezioniAperte = false, lezioniCache = null, lezioniDettagliEspansi = false, lezionePresetAllievoId = null, editingLezioneId = null, editingLezioneAllieviIds = [], editingLezioneSkillRows = {}, gruppiEspansi = /* @__PURE__ */ new Set(), lezioniAnniEspansi = /* @__PURE__ */ new Set(), schedaLezioniAnniEspansi = /* @__PURE__ */ new Set(), lezioniAnniDefaultAperto = false, schedaLezioniAnniDefaultAperti = /* @__PURE__ */ new Set(), lezioneBackAllievoId = null, lezioneBackGruppoNome = null, currentSchedaId = null, currentGruppoNome = null, currentLezioneId = null, editReturnTarget = null, skillTreeEditMode = false, catalogSkillEditMode = false, pendingSpecialGuestId = null, skillCatalogContext = null, skillDetailContext = null, appHistoryStarted = false, appHistoryApplying = false;
let luoghiLezioneCache = /* @__PURE__ */ new Map(), luogoSuggestTimer = null, allLocations = [], locationsLoaded = false, globalSearchTimer = null, lezioneFormMode = "standard";
let mappaTipoFiltro = "all", mappaSelectedLocationName = null;
const lezioniColumnState = { data: false, luogo: false, note: false };
const LEZIONE_DRAFT_KEY = "lezioneDraftInCorso";
const GROUP_SKILL_ROWS_KEY = "__group__";
const APP_NOTES_KEY = "bladingManagerAppNotes";
const APP_NOTES_REMOTE_KEY = "gestionale";
const LOCATION_MAP_COORDS_KEY = "bladingManagerLocationMapCoords";
const MILANO_MAP_BOUNDS = Object.freeze({ north: 45.56, south: 45.36, west: 9.05, east: 9.32 });
const MILANO_MAP_VIEWBOX = Object.freeze({ width: 1114, height: 993 });
const MILANO_MAP_IMAGE = "./mappa-milano-quartieri-dark@2x.png";
const LOCATION_CATEGORIES = ["Location", "Parco", "Ciclabile", "Piazza", "Pista di pattinaggio", "Skatepark", "Strada", "Campi da basket", "Palestra", "Casa allievo", "Altro"];
const MILANO_COORD_HINTS = [
  { match: ["centro"], x: 675, y: 478, label: "Centro" },
  { match: ["arco della pace", "arena", "pagano"], x: 599, y: 431, label: "Arco della Pace / Arena" },
  { match: ["garibaldi", "moscova", "porta nuova"], x: 680, y: 392, label: "Garibaldi / Porta Nuova" },
  { match: ["cenisio", "sarpi", "isola"], x: 638, y: 326, label: "Isola" },
  { match: ["porta genova", "ticinese"], x: 632, y: 522, label: "Ticinese" },
  { match: ["quadronno", "palestro", "guastalla"], x: 733, y: 490, label: "Guastalla" },
  { match: ["fiera", "city life", "sempione", "portello"], x: 523, y: 381, label: "City Life / Portello" },
  { match: ["centrale", "repubblica"], x: 760, y: 368, label: "Centrale" },
  { match: ["porta venezia", "indipendenza"], x: 778, y: 452, label: "Porta Venezia" },
  { match: ["porta romana", "p romana", "p. romana", "cadore", "montenero", "viale emilio caldara", "emilio caldara"], x: 768, y: 547, label: "Porta Romana" },
  { match: ["sant agostino", "s agostino", "s.agostino", "piazza sant agostino"], x: 596, y: 520, label: "Sant Agostino" },
  { match: ["romolo", "area pozzi", "via argelati", "parco di via argelati", "segantini"], x: 596, y: 594, label: "Romolo" },
  { match: ["naviglio pavese", "ciclabile naviglio"], x: 616, y: 640, label: "Naviglio Pavese" },
  { match: ["navigli"], x: 629, y: 579, label: "Navigli" },
  { match: ["solari", "washington", "giardini di via tolstoj", "tolstoj savona", "via tolstoj", "savona"], x: 549, y: 508, label: "Solari" },
  { match: ["napoli", "soderini"], x: 507, y: 547, label: "Soderini" },
  { match: ["bande nere", "inganni"], x: 429, y: 524, label: "Inganni" },
  { match: ["san siro", "trenno"], x: 325, y: 343, label: "San Siro" },
  { match: ["certosa", "cascina merlata"], x: 396, y: 216, label: "Certosa" },
  { match: ["maggiolina", "istria"], x: 745, y: 275, label: "Maggiolina" },
  { match: ["pasteur", "rovereto"], x: 820, y: 306, label: "Pasteur" },
  { match: ["citta studi", "citt\xE0 studi", "susa"], x: 854, y: 411, label: "Citta Studi" },
  { match: ["porta vittoria", "p vittoria", "p. vittoria", "lodi"], x: 840, y: 566, label: "Porta Vittoria" },
  { match: ["affori", "bovisa"], x: 540, y: 184, label: "Bovisa" },
  { match: ["bicocca", "niguarda"], x: 711, y: 141, label: "Bicocca" },
  { match: ["precotto", "turro"], x: 843, y: 196, label: "Precotto" },
  { match: ["cimiano", "crescenzago", "adriano"], x: 945, y: 202, label: "Cimiano" },
  { match: ["udine", "lambrate", "parco lambro"], x: 950, y: 354, label: "Lambrate" },
  { match: ["forlanini"], x: 965, y: 539, label: "Forlanini" },
  { match: ["corvetto", "rogoredo"], x: 852, y: 685, label: "Corvetto" },
  { match: ["ponte lambro", "santa giulia"], x: 968, y: 660, label: "Santa Giulia" },
  { match: ["ripamonti", "vigentino"], x: 791, y: 759, label: "Ripamonti" },
  { match: ["abbiategrasso", "chiesa rossa"], x: 659, y: 797, label: "Chiesa Rossa" },
  { match: ["famagosta", "barona", "barrio", "via felice venosta", "felice venosta"], x: 501, y: 677, label: "Famagosta / Barona" },
  { match: ["bisceglie", "baggio", "olmi"], x: 211, y: 508, label: "Bisceglie" },
  { match: ["istituto leopardi", "leopardi"], x: 599, y: 431, label: "Centro ovest" }
];
const MAESTRO_AVAILABILITY_METADATA_KEY = "disponibilita_maestro_slots";
const MAESTRO_AVAILABILITY_STORAGE_PREFIX = "bladingManagerMaestroAvailability";
const AVAILABILITY_DAYS = [
  { value: 1, label: "Lunedi", short: "Lun" },
  { value: 2, label: "Martedi", short: "Mar" },
  { value: 3, label: "Mercoledi", short: "Mer" },
  { value: 4, label: "Giovedi", short: "Gio" },
  { value: 5, label: "Venerdi", short: "Ven" },
  { value: 6, label: "Sabato", short: "Sab" },
  { value: 0, label: "Domenica", short: "Dom" }
];
const AVAILABILITY_START_MIN = 7 * 60;
const AVAILABILITY_END_MIN = 23 * 60;
const AVAILABILITY_STEP_MIN = 15;
const AVAILABILITY_HOUR_PX = 44;
const APPOINTMENT_BUFFER_MIN = 15;
const APPOINTMENT_MIN_LESSON_MIN = 60;
let maestroAvailabilitySlots = [], appuntamentiSelectedAllievoId = null, appuntamentiAllieviQuery = "", appuntamentiGruppoFiltro = "all";
let availabilityDragState = null;
let godMode = false, godScope = "all", shareContext = null;
let appNotesTimer = null, appNotesRemoteAvailable = null;
let appNotesReturnView = null;
const SUPER_MAESTRO_EMAIL = "francesco.grinovero@gmail.com";
const APP_BOOT_HASH = window.location.hash;
let appBootRouteConsumed = false;
const safeStorage = (() => {
  try {
    const storage = window.localStorage;
    const testKey = "__blading_manager_storage_test__";
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return storage;
  } catch (e) {
    const memory = /* @__PURE__ */ new Map();
    return {
      getItem: (key) => memory.has(key) ? memory.get(key) : null,
      setItem: (key, value) => {
        memory.set(key, String(value));
      },
      removeItem: (key) => {
        memory.delete(key);
      }
    };
  }
})();
function localDateIso(date = /* @__PURE__ */ new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 6e4);
  return local.toISOString().slice(0, 10);
}
function isSuperMaestro() {
  return currentEmail === SUPER_MAESTRO_EMAIL;
}
let tuningMode = "parametri", tuningCard = null, tuningCount = 0, tuningAlertCount = 0, tuningLocal = [], tuningRecentSkillIds = [];
function supabaseClientIsV2(client = sb) {
  return !!(client && client.auth && typeof client.auth.getSession === "function");
}
function createSupabaseClientCompat() {
  const client = supabase.createClient(SUPA_URL, SUPA_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: "blading-manager-auth",
      storage: safeStorage
    }
  });
  if (supabaseClientIsV2(client)) return client;
  return supabase.createClient(SUPA_URL, SUPA_KEY, {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    localStorage: safeStorage,
    multiTab: true
  });
}
function getCurrentAuthSession() {
  return __async(this, null, function* () {
    if (!(sb == null ? void 0 : sb.auth)) return null;
    if (supabaseClientIsV2()) {
      const { data: { session } } = yield sb.auth.getSession();
      return session || null;
    }
    if (typeof sb.auth.session === "function") return sb.auth.session();
    return null;
  });
}
function getCurrentAuthUser() {
  return __async(this, null, function* () {
    if (!(sb == null ? void 0 : sb.auth)) return null;
    if (typeof sb.auth.getUser === "function") {
      const { data: { user } } = yield sb.auth.getUser();
      return user || null;
    }
    if (typeof sb.auth.user === "function") return sb.auth.user();
    const session = yield getCurrentAuthSession();
    return (session == null ? void 0 : session.user) || null;
  });
}
function signInWithPasswordCompat(email, password) {
  return __async(this, null, function* () {
    var _a2;
    if (supabaseClientIsV2()) {
      return sb.auth.signInWithPassword({ email, password });
    }
    if (typeof ((_a2 = sb == null ? void 0 : sb.auth) == null ? void 0 : _a2.signIn) === "function") {
      const result = yield sb.auth.signIn({ email, password });
      return { data: { session: result.session || null, user: result.user || null }, error: result.error || null };
    }
    throw new Error("Client login non disponibile.");
  });
}
function signOutCompat() {
  return __async(this, null, function* () {
    var _a2;
    if (!((_a2 = sb == null ? void 0 : sb.auth) == null ? void 0 : _a2.signOut)) return;
    yield sb.auth.signOut();
  });
}
function updateCurrentUserMetadata(payload) {
  return __async(this, null, function* () {
    if (!(sb == null ? void 0 : sb.auth)) return { user: null, error: new Error("Client auth non disponibile.") };
    if (supabaseClientIsV2() && typeof sb.auth.updateUser === "function") {
      const { data, error } = yield sb.auth.updateUser({ data: payload });
      return { user: (data == null ? void 0 : data.user) || null, error };
    }
    if (typeof sb.auth.update === "function") {
      const result = yield sb.auth.update({ data: payload });
      return { user: (result == null ? void 0 : result.user) || (result == null ? void 0 : result.data) || null, error: (result == null ? void 0 : result.error) || null };
    }
    return { user: null, error: new Error("Aggiornamento utente non disponibile.") };
  });
}
try {
  sb = createSupabaseClientCompat();
  window.sb = sb;
} catch (e) {
  document.getElementById("login-err").textContent = "Errore SDK: " + e.message + " \u2014 apri il file direttamente nel browser (non nel preview).";
  document.getElementById("login-err").classList.add("show");
}
const motion = (() => {
  var _a2;
  const lib = window.anime;
  const reduce = (_a2 = window.matchMedia) == null ? void 0 : _a2.call(window, "(prefers-reduced-motion: reduce)").matches;
  document.body.classList.toggle("motion-ready", !!lib && !reduce);
  function run(targets, params) {
    if (!lib || reduce) return;
    lib.animate(targets, params);
  }
  function visibleView() {
    return document.querySelector("#screen-app main > section:not([hidden])");
  }
  function view(name) {
    const root = document.getElementById(`view-${name}`) || visibleView();
    if (!root) return;
    run(root, {
      opacity: [0, 1],
      y: [10, 0],
      duration: 260,
      ease: "outCubic"
    });
    cards(root);
    tableRows(root);
  }
  function cards(root = document) {
    if (!lib || reduce) return;
    const items = root.querySelectorAll(".section-header, .card, .table-wrap");
    if (!items.length) return;
    run(items, {
      opacity: [0, 1],
      y: [12, 0],
      duration: 420,
      delay: lib.stagger(35),
      ease: "outCubic"
    });
  }
  function tableRows(root = document) {
    if (!lib || reduce) return;
    const rows = root.querySelectorAll("tbody tr");
    if (!rows.length) return;
    run(rows, {
      opacity: [0, 1],
      x: [-6, 0],
      duration: 300,
      delay: lib.stagger(18),
      ease: "outCubic"
    });
  }
  function softFocus(target) {
    if (!lib || reduce) return;
    if (!target || target.dataset.motionFocus === "1") return;
    target.dataset.motionFocus = "1";
    run(target.querySelectorAll("td"), {
      backgroundColor: [
        "rgba(110,231,249,.16)",
        "rgba(110,231,249,.08)"
      ],
      duration: 260,
      ease: "outCubic",
      complete: () => {
        target.dataset.motionFocus = "0";
      }
    });
  }
  function press(target) {
    if (!target) return;
    run(target, {
      scale: [1, 0.97, 1],
      duration: 180,
      ease: "outCubic"
    });
  }
  return { view, cards, tableRows, softFocus, press };
})();
document.addEventListener("pointerdown", (e) => {
  const target = e.target.closest(".btn, .chip, nav button, .scheda-tab");
  motion.press(target);
});
function handleAuthSession(session) {
  return __async(this, null, function* () {
    if (session) {
      document.getElementById("screen-login").hidden = true;
      document.getElementById("screen-app").hidden = false;
      if (!appInited) {
        appInited = true;
        initApp();
      }
    } else {
      appInited = false;
      appHistoryStarted = false;
      document.getElementById("screen-login").hidden = false;
      document.getElementById("screen-app").hidden = true;
    }
  });
}
(_b = (_a = sb == null ? void 0 : sb.auth) == null ? void 0 : _a.onAuthStateChange) == null ? void 0 : _b.call(_a, (_e, session) => {
  handleAuthSession(session);
});
function bootstrapAuth() {
  return __async(this, null, function* () {
    if (!sb) return;
    const session = yield getCurrentAuthSession();
    yield handleAuthSession(session);
  });
}
bootstrapAuth();
function doLogin() {
  return __async(this, null, function* () {
    const email = document.getElementById("login-email").value.trim();
    const pw = document.getElementById("login-pw").value;
    const errEl = document.getElementById("login-err");
    errEl.classList.remove("show");
    try {
      const { error } = yield signInWithPasswordCompat(email, pw);
      if (error) throw error;
    } catch (e) {
      if (window.legacyPasswordLogin) {
        window.legacyPasswordLogin(email, pw, errEl, e);
        return;
      }
      errEl.textContent = e.message || "Errore di connessione. Controlla la console.";
      errEl.classList.add("show");
    }
  });
}
function doLogout() {
  return __async(this, null, function* () {
    yield signOutCompat();
  });
}
function initialRouteFromHash(hashValue = window.location.hash) {
  const raw = String(hashValue || "").replace(/^#/, "");
  if (!raw) return { name: "allievi", id: null };
  const [encodedName, ...encodedRest] = raw.split("/");
  let name = "";
  let id = null;
  try {
    name = decodeURIComponent(encodedName || "");
    id = encodedRest.length ? decodeURIComponent(encodedRest.join("/")) : null;
  } catch (e) {
    return { name: "allievi", id: null };
  }
  const allowed = ["allievi", "scheda", "gruppo", "lezioni", "percorsi", "appuntamenti", "location", "mappa", "lezione", "nuova-lezione", "nuovo-allievo", "nuovo-gruppo", "skills", "tuning", "app-notes"];
  if (!allowed.includes(name)) return { name: "allievi", id: null };
  if (routeNeedsId(name) && !id) return { name: "allievi", id: null };
  return { name, id };
}
function consumeInitialRoute() {
  if (appBootRouteConsumed) return { name: "allievi", id: null };
  appBootRouteConsumed = true;
  return initialRouteFromHash(APP_BOOT_HASH);
}
function initApp() {
  return __async(this, null, function* () {
    const user = yield getCurrentAuthUser();
    currentUid = (user == null ? void 0 : user.id) || null;
    currentEmail = ((user == null ? void 0 : user.email) || "").toLowerCase();
    currentUserMetadata = (user == null ? void 0 : user.user_metadata) || {};
    maestroAvailabilitySlots = loadMaestroAvailabilitySlots(currentUserMetadata);
    const [{ data: a }, { data: s }, { data: p }, { data: pr }] = yield Promise.all([
      sb.from("allievi").select("*").eq("stato", "attivo").order("nome"),
      sb.from("skills").select("*").order("livello"),
      sb.from("prerequisiti_skill").select("*"),
      sb.from("progressi_allievo").select("allievo_id, skill_id, stadio")
    ]);
    allAllievi = a || [];
    allSkills = visibleCatalogSkills(s || []);
    allPrereqs = p || [];
    allProgressi = pr || [];
    skillDefinitions = yield loadSkillDefinitions();
    yield loadLocations();
    renderGodPanel();
    renderAllievi();
    const initialRoute = consumeInitialRoute();
    showView(initialRoute.name, initialRoute.id || void 0);
    refreshDashboardData();
  });
}
function loadSkillDefinitions() {
  return __async(this, null, function* () {
    const { data, error } = yield sb.from("skill_definizioni").select("*");
    if (error) {
      const text = `${error.message || ""} ${error.details || ""} ${error.hint || ""}`;
      if (!/skill_definizioni|schema cache|could not find the table|does not exist/i.test(text)) console.warn("skill_definizioni non caricata", error);
      return [];
    }
    return visibleCatalogSkills(data || []);
  });
}
function isOwnedByCurrentMaestro(record = {}) {
  return !(record == null ? void 0 : record.maestro_id) || String(record.maestro_id) === String(currentUid || "") || godMode && isSuperMaestro();
}
function canEditAllievoAddress(allievo = null) {
  return !allievo || isOwnedByCurrentMaestro(allievo);
}
function canViewAllievoAddress(allievo = null) {
  var _a2;
  if (!allievo) return true;
  if (canEditAllievoAddress(allievo)) return true;
  return !!((_a2 = allievo.profilo) == null ? void 0 : _a2.indirizzo_condiviso);
}
function visibleAllievoAddress(allievo = {}) {
  const profilo = (allievo == null ? void 0 : allievo.profilo) || {};
  if (!canViewAllievoAddress(allievo)) return { indirizzo: "", casa: "" };
  return {
    indirizzo: profilo.indirizzo || "",
    casa: profilo.casa || ""
  };
}
function locationCategoryOptions(selected = "Location") {
  const value = selected && LOCATION_CATEGORIES.includes(selected) ? selected : selected || "Location";
  const options = LOCATION_CATEGORIES.includes(value) ? LOCATION_CATEGORIES : [...LOCATION_CATEGORIES, value];
  return options.map((t) => `<option value="${esc(t)}" ${t === value ? "selected" : ""}>${esc(t)}</option>`).join("");
}
function canEditLocation(record = null) {
  if (!record) return true;
  if (record.source === "allievo-casa") return canEditAllievoAddress(allievoById(record.allievo_id));
  return isOwnedByCurrentMaestro(record);
}
function canViewLocation(record = null) {
  if (!record) return true;
  return canEditLocation(record) || !!record.condivisa;
}
function locationMapStorageKey(nome) {
  return normalizeText(nome || "");
}
function loadLocationMapCoordsLocal() {
  try {
    return JSON.parse(safeStorage.getItem(LOCATION_MAP_COORDS_KEY) || "{}") || {};
  } catch (e) {
    return {};
  }
}
function saveLocationMapCoordsLocal(nome, latitudine, longitudine, originalName = null) {
  const key = locationMapStorageKey(nome);
  if (!key) return;
  const lat = parseMapCoordinate(latitudine);
  const lng = parseMapCoordinate(longitudine);
  const stored = loadLocationMapCoordsLocal();
  const originalKey = locationMapStorageKey(originalName);
  if (originalKey && originalKey !== key) delete stored[originalKey];
  if (lat === null || lng === null) delete stored[key];
  else stored[key] = { nome, latitudine: lat, longitudine: lng, updated_at: (/* @__PURE__ */ new Date()).toISOString() };
  safeStorage.setItem(LOCATION_MAP_COORDS_KEY, JSON.stringify(stored));
}
function parseMapCoordinate(value) {
  if (value === null || value === void 0 || value === "") return null;
  const n = Number(String(value).replace(",", ".").trim());
  return Number.isFinite(n) ? n : null;
}
function locationCoordinatesFromRecord(record = {}) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  const nested = record.coordinate || record.coordinates || record.mappa || {};
  const lat = parseMapCoordinate((_e = (_d = (_c = (_b2 = (_a2 = record.latitudine) != null ? _a2 : record.latitude) != null ? _b2 : record.lat) != null ? _c : nested.latitudine) != null ? _d : nested.latitude) != null ? _e : nested.lat);
  const lng = parseMapCoordinate((_l = (_k = (_j = (_i = (_h = (_g = (_f = record.longitudine) != null ? _f : record.longitude) != null ? _g : record.lng) != null ? _h : record.lon) != null ? _i : nested.longitudine) != null ? _j : nested.longitude) != null ? _k : nested.lng) != null ? _l : nested.lon);
  return lat === null || lng === null ? null : { lat, lng };
}
function normalizeMapMatchText(value) {
  return normalizeText(value).replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}
function inferLocationCoordinates(record = {}) {
  var _a2, _b2;
  const haystack = normalizeMapMatchText([record.nome, record.indirizzo, record.note, record.tipologia].filter(Boolean).join(" "));
  if (!haystack) return null;
  const found = MILANO_COORD_HINTS.find((hint) => hint.match.some((term) => haystack.includes(normalizeMapMatchText(term))));
  if (!found) return null;
  const mapCoords = found.x !== void 0 && found.y !== void 0 ? mappaCoordFromPoint(found.x, found.y) : null;
  return {
    lat: (_a2 = found.lat) != null ? _a2 : mapCoords == null ? void 0 : mapCoords.lat,
    lng: (_b2 = found.lng) != null ? _b2 : mapCoords == null ? void 0 : mapCoords.lng,
    x: found.x,
    y: found.y,
    source: "stimato",
    label: found.label
  };
}
function locationMapCoords(record = {}) {
  const saved = locationCoordinatesFromRecord(record);
  if (saved) return __spreadProps(__spreadValues({}, saved), { source: "salvato" });
  return inferLocationCoordinates(record);
}
function locationWithLocalMapCoords(record = {}) {
  const remoteCoords = locationCoordinatesFromRecord(record);
  if (remoteCoords) return record;
  const local = loadLocationMapCoordsLocal()[locationMapStorageKey(record.nome)];
  return local ? __spreadProps(__spreadValues({}, record), { latitudine: local.latitudine, longitudine: local.longitudine }) : record;
}
function isMissingLocationTableError(error) {
  const text = `${(error == null ? void 0 : error.message) || ""} ${(error == null ? void 0 : error.details) || ""} ${(error == null ? void 0 : error.hint) || ""}`;
  if (isMissingLocationMapColumnsError(error)) return false;
  return /locations.*(schema cache|does not exist|could not find|not found)|relation .*locations.*does not exist|table .*locations.*does not exist/i.test(text);
}
function isMissingLocationMapColumnsError(error) {
  const text = `${(error == null ? void 0 : error.message) || ""} ${(error == null ? void 0 : error.details) || ""} ${(error == null ? void 0 : error.hint) || ""}`;
  return /(latitudine|longitudine|latitude|longitude).*(schema cache|column|not found|could not find)|(schema cache|column|not found|could not find).*(latitudine|longitudine|latitude|longitude)/i.test(text);
}
function readCoordinateInputs(latId, lngId) {
  var _a2, _b2;
  const latRaw = ((_a2 = document.getElementById(latId)) == null ? void 0 : _a2.value.trim()) || "";
  const lngRaw = ((_b2 = document.getElementById(lngId)) == null ? void 0 : _b2.value.trim()) || "";
  if (!latRaw && !lngRaw) return { lat: null, lng: null };
  const lat = parseMapCoordinate(latRaw);
  const lng = parseMapCoordinate(lngRaw);
  if (lat === null || lng === null) return { error: "Inserisci sia latitudine sia longitudine in formato numerico." };
  return { lat, lng };
}
function buildLocationPayload({ nome, tipologia, indirizzo, note, latitudine = null, longitudine = null, allievo_id = null, condivisa = false }) {
  const payload = {
    nome,
    tipologia: tipologia || "Location",
    indirizzo: indirizzo || null,
    note: note || null,
    condivisa: !!condivisa,
    maestro_id: currentUid || null,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (allievo_id) payload.allievo_id = allievo_id;
  const lat = parseMapCoordinate(latitudine);
  const lng = parseMapCoordinate(longitudine);
  if (lat !== null && lng !== null) {
    payload.latitudine = lat;
    payload.longitudine = lng;
  }
  return payload;
}
function isMissingLocationPrivacyColumnsError(error) {
  const text = `${(error == null ? void 0 : error.message) || ""} ${(error == null ? void 0 : error.details) || ""} ${(error == null ? void 0 : error.hint) || ""}`;
  return /\b(condivisa|shared)\b/i.test(text);
}
function isMissingLocationCompositeConflictError(error) {
  const text = `${(error == null ? void 0 : error.message) || ""} ${(error == null ? void 0 : error.details) || ""} ${(error == null ? void 0 : error.hint) || ""}`;
  return /maestro_id.*nome|nome.*maestro_id|unique|exclusion|constraint|on conflict/i.test(text);
}
function localLocationMatches(row, payload, originalName = null) {
  const sameOriginal = originalName && normalizeText(row.nome) === normalizeText(originalName);
  const sameName = normalizeText(row.nome) === normalizeText(payload.nome);
  const sameOwner = String(row.maestro_id || "") === String(payload.maestro_id || "");
  return (sameOriginal || sameName) && sameOwner;
}
function writeLocationPayload(_0) {
  return __async(this, arguments, function* (payload, originalName = null, { withoutCoords = false, withoutPrivacy = false, legacyConflict = false } = {}) {
    const cleanPayload = __spreadValues({}, payload);
    if (withoutCoords) {
      delete cleanPayload.latitudine;
      delete cleanPayload.longitudine;
    }
    if (withoutPrivacy) delete cleanPayload.condivisa;
    const existing = originalName ? locationRecordByName(originalName) : locationRecordByName(payload.nome);
    if (!legacyConflict && (existing == null ? void 0 : existing.id) && canEditLocation(existing)) {
      return sb.from("locations").update(cleanPayload).eq("id", existing.id);
    }
    let result = yield sb.from("locations").upsert(cleanPayload, { onConflict: legacyConflict ? "nome" : "maestro_id,nome" });
    if (result.error && !legacyConflict && isMissingLocationCompositeConflictError(result.error)) {
      result = yield sb.from("locations").upsert(cleanPayload, { onConflict: "nome" });
    }
    return result;
  });
}
function persistLocationPayload(payload, originalName = null) {
  return __async(this, null, function* () {
    const hasCoords = parseMapCoordinate(payload.latitudine) !== null && parseMapCoordinate(payload.longitudine) !== null;
    let strippedLocationPrivacy = false;
    let { error } = yield writeLocationPayload(payload, originalName);
    if (error && isMissingLocationPrivacyColumnsError(error) && !isMissingLocationTableError(error)) {
      strippedLocationPrivacy = true;
      const retry = yield writeLocationPayload(payload, originalName, { withoutPrivacy: true });
      error = retry.error;
    }
    if (error && hasCoords && isMissingLocationMapColumnsError(error) && !isMissingLocationTableError(error)) {
      const retry = yield writeLocationPayload(payload, originalName, {
        withoutCoords: true,
        withoutPrivacy: strippedLocationPrivacy || isMissingLocationPrivacyColumnsError(error)
      });
      error = retry.error;
      if (!error) {
        saveLocationMapCoordsLocal(payload.nome, payload.latitudine, payload.longitudine, originalName);
        yield loadLocations(true);
        return { ok: true, mapCoordsLocal: true };
      }
    }
    if (error) {
      if (isMissingLocationTableError(error)) {
        const local = JSON.parse(safeStorage.getItem("locationsLocal") || "[]").filter((l) => !localLocationMatches(l, payload, originalName));
        local.push(payload);
        safeStorage.setItem("locationsLocal", JSON.stringify(local));
        allLocations = local.map(locationWithLocalMapCoords);
        locationsLoaded = true;
        return { ok: true, localOnly: true };
      }
      return { ok: false, error };
    }
    yield loadLocations(true);
    return { ok: true };
  });
}
function ricaricaAllievi() {
  return __async(this, null, function* () {
    let q = sb.from("allievi").select("*").order("nome");
    q = mostraArchiviati ? q.eq("stato", "archiviato") : q.eq("stato", "attivo");
    const { data } = yield q;
    allAllievi = data || [];
    renderGodPanel();
    renderAllievi();
    refreshDashboardData();
  });
}
function loadLocations(force = false) {
  return __async(this, null, function* () {
    if (locationsLoaded && !force) return allLocations;
    const { data, error } = yield sb.from("locations").select("*").order("nome");
    if (error) {
      const text = `${error.message || ""} ${error.details || ""} ${error.hint || ""}`;
      if (!/locations|schema cache|could not find the table|does not exist/i.test(text)) console.warn("locations non caricate", error);
      try {
        allLocations = (JSON.parse(safeStorage.getItem("locationsLocal") || "[]") || []).map(locationWithLocalMapCoords).filter(canViewLocation);
      } catch (e) {
        allLocations = [];
      }
      locationsLoaded = true;
      return allLocations;
    }
    allLocations = (data || []).map(locationWithLocalMapCoords).filter(canViewLocation);
    locationsLoaded = true;
    return allLocations;
  });
}
function locationRecordByName(nome) {
  const key = normalizeText(nome || "");
  const matches = allLocations.filter((l) => normalizeText(l.nome || "") === key);
  return matches.find((l) => String(l.maestro_id || "") === String(currentUid || "")) || matches.find((l) => !!l.condivisa) || matches[0] || null;
}
function locationNamesFromLessons() {
  const map = /* @__PURE__ */ new Map();
  (lezioniCache || []).forEach((l) => {
    const nome = String(l.luogo || "").trim();
    if (!nome) return;
    const key = normalizeText(nome);
    if (!map.has(key)) map.set(key, nome);
  });
  allLocations.forEach((l) => {
    const nome = String(l.nome || "").trim();
    if (nome && !map.has(normalizeText(nome))) map.set(normalizeText(nome), nome);
  });
  return [...map.values()].sort((a, b) => a.localeCompare(b, "it", { sensitivity: "base" }));
}
function renderDashboard() {
  const el = document.getElementById("dashboard-content");
  if (!el) return;
  const allieviDashboard = allieviVisibiliGod().filter((a) => mostraArchiviati ? a.stato === "archiviato" : a.stato !== "archiviato");
  const allieviLabel = mostraArchiviati ? "Allievi archiviati" : "Allievi attivi";
  const allieviAction = mostraArchiviati ? "setArchivio(true)" : "showView('allievi')";
  const lezioni = lezioniCache || [];
  const oggi = localDateIso();
  const todayLessons = lezioni.filter((l) => String(l.data || "").slice(0, 10) === oggi);
  const aperte = lezioni.filter((l) => lessonStatus(l) === "aperta");
  const locations = locationNamesFromLessons();
  el.innerHTML = `
    <div class="dashboard-grid">
      <div class="dashboard-tile" onclick="${allieviAction}"><strong>${allieviDashboard.length}</strong><span>${allieviLabel}</span></div>
      <div class="dashboard-tile" onclick="showView('lezioni'); openDayLessonsWidget('${oggi}')"><strong>${todayLessons.length}</strong><span>Lezioni oggi</span></div>
      <div class="dashboard-tile" onclick="showView('lezioni'); setFiltroLezioniAperte(true)"><strong>${aperte.length}</strong><span>Lezioni aperte</span></div>
      <div class="dashboard-tile" onclick="showLocationsIndex()"><strong>${locations.length}</strong><span>Location</span></div>
    </div>`;
}
function refreshDashboardData() {
  return __async(this, null, function* () {
    if (!lezioniCache) yield loadLezioni(true);
    yield loadLocations();
    renderDashboard();
  });
}
const APP_HISTORY_KEY = "blading-manager-view";
function routeNeedsId(name) {
  return ["scheda", "gruppo", "location", "lezione"].includes(name);
}
function normalizeRoute(name = "allievi", id = null) {
  const cleanName = name || "allievi";
  return { app: APP_HISTORY_KEY, name: cleanName, id: id || null };
}
function homeBoundaryRoute() {
  return __spreadProps(__spreadValues({}, normalizeRoute("allievi")), { boundary: true });
}
function routeHash(route) {
  const base = route.name || "allievi";
  return route.id ? `#${encodeURIComponent(base)}/${encodeURIComponent(route.id)}` : `#${encodeURIComponent(base)}`;
}
function sameRoute(a, b) {
  return !!a && !!b && a.app === APP_HISTORY_KEY && a.name === b.name && String(a.id || "") === String(b.id || "");
}
function recordAppHistory(name, id = null) {
  var _a2, _b2;
  if (appHistoryApplying) return;
  if ((_a2 = document.getElementById("screen-app")) == null ? void 0 : _a2.hidden) return;
  if (routeNeedsId(name) && !id) return;
  const route = normalizeRoute(name, id);
  if (!((_b2 = window.history) == null ? void 0 : _b2.pushState)) return;
  if (!appHistoryStarted) {
    const boundary = homeBoundaryRoute();
    history.replaceState(boundary, "", routeHash(boundary));
    history.pushState(route, "", routeHash(route));
    appHistoryStarted = true;
    return;
  }
  if (sameRoute(history.state, route)) return;
  history.pushState(route, "", routeHash(route));
}
function showHomeFromHistoryBoundary() {
  appHistoryApplying = true;
  showView("allievi");
  appHistoryApplying = false;
  const home = normalizeRoute("allievi");
  history.pushState(home, "", routeHash(home));
}
window.addEventListener("popstate", (event) => {
  var _a2;
  if ((_a2 = document.getElementById("screen-app")) == null ? void 0 : _a2.hidden) return;
  const route = event.state;
  if (!route || route.app !== APP_HISTORY_KEY) {
    showHomeFromHistoryBoundary();
    return;
  }
  if (route.boundary) {
    showHomeFromHistoryBoundary();
    return;
  }
  appHistoryApplying = true;
  showView(route.name || "allievi", route.id || null);
  appHistoryApplying = false;
});
function visibleViewName() {
  return ["allievi", "scheda", "gruppo", "lezioni", "percorsi", "appuntamenti", "location", "mappa", "lezione", "nuova-lezione", "nuovo-allievo", "nuovo-gruppo", "skills", "tuning", "app-notes"].find((v) => {
    var _a2;
    return !((_a2 = document.getElementById(`view-${v}`)) == null ? void 0 : _a2.hidden);
  }) || null;
}
function syncNavActive(name) {
  document.getElementById("nav-allievi").classList.toggle("active", ["allievi", "scheda", "gruppo", "nuovo-allievo", "nuovo-gruppo"].includes(name));
  document.getElementById("nav-lezioni").classList.toggle("active", ["lezioni", "location", "lezione", "nuova-lezione"].includes(name));
  document.getElementById("nav-percorsi").classList.toggle("active", name === "percorsi");
  document.getElementById("nav-calendar").classList.toggle("active", name === "appuntamenti");
  document.getElementById("nav-mappa").classList.toggle("active", name === "mappa");
  document.getElementById("nav-skills").classList.toggle("active", name === "skills");
  document.getElementById("nav-tuning").classList.toggle("active", name === "tuning");
  document.getElementById("nav-app-notes").classList.toggle("active", name === "app-notes");
}
function currentReturnTarget() {
  const view = visibleViewName();
  if (view === "scheda" && currentSchedaId) return { name: "scheda", id: currentSchedaId };
  if (view === "gruppo" && currentGruppoNome) return { name: "gruppo", id: currentGruppoNome };
  if (view === "lezione" && currentLezioneId) return { name: "lezione", id: currentLezioneId };
  if (view === "location") return { name: "lezioni", id: null };
  if (view === "allievi" || view === "lezioni" || view === "percorsi" || view === "appuntamenti" || view === "mappa" || view === "skills" || view === "tuning" || view === "app-notes") return { name: view, id: null };
  return null;
}
function goToReturnTarget(target, fallback) {
  return __async(this, null, function* () {
    const destination = target || fallback;
    if (!destination) return;
    if (destination.name === "scheda" && destination.id) {
      yield loadScheda(destination.id);
      return;
    }
    if (destination.name === "gruppo" && destination.id) {
      showView("gruppo", destination.id);
      return;
    }
    if (destination.name === "lezione" && destination.id) {
      showView("lezione", destination.id);
      return;
    }
    showView(destination.name, destination.id || void 0);
  });
}
function showView(name, id) {
  if ((name === "tuning" || name === "app-notes") && !godMode) name = "allievi";
  document.body.classList.toggle("route-builder-active", name === "percorsi");
  if (["nuovo-allievo", "nuovo-gruppo", "nuova-lezione"].includes(name)) {
    const returnTarget = currentReturnTarget();
    if (returnTarget) editReturnTarget = returnTarget;
  }
  ["allievi", "scheda", "gruppo", "lezioni", "percorsi", "appuntamenti", "location", "mappa", "lezione", "nuova-lezione", "nuovo-allievo", "nuovo-gruppo", "skills", "tuning", "app-notes"].forEach((v) => {
    document.getElementById(`view-${v}`).hidden = v !== name;
  });
  syncNavActive(name);
  if (name === "lezioni" && id) filtroLezioni = `allievo:${id}`;
  if (name === "lezioni") loadLezioni();
  if (name === "percorsi") ensureRouteBuilderMounted();
  if (name === "appuntamenti") renderAppuntamenti();
  if (name === "mappa") renderMappa(id || null);
  if (name === "location" && id) loadLocation(id);
  if (name === "lezione" && id) loadLezione(id);
  if (name === "nuova-lezione") initNuovaLezione(id || null);
  if (name === "nuovo-allievo") initNuovoAllievo(id || null);
  if (name === "nuovo-gruppo") initNuovoGruppo(id || null);
  if (name === "gruppo" && id) loadGruppo(id);
  if (name === "scheda" && id) loadScheda(id);
  if (name === "skills") renderSkillsCatalog();
  if (name === "tuning") initTuning();
  if (name === "app-notes") initAppNotes();
  requestAnimationFrame(() => motion.view(name));
  recordAppHistory(name, id || null);
}
function ensureRouteBuilderMounted() {
  const view = document.getElementById("view-percorsi");
  const root = document.getElementById("route-builder-root");
  if (!view || view.hidden || !root) return;
  if (typeof initRouteBuilderPage === "function") {
    try {
      initRouteBuilderPage();
    } catch (error) {
      console.error("Errore inizializzazione editor percorsi", error);
      root.innerHTML = routeBuilderLoadErrorHtml((error == null ? void 0 : error.message) || "Errore JavaScript durante il caricamento.");
    }
    return;
  }
  root.innerHTML = routeBuilderLoadErrorHtml("Script route-builder non caricati.");
}
function routeBuilderLoadErrorHtml(detail) {
  return `
    <div class="card">
      <div class="msg msg-err show" style="display:block;margin-bottom:.7rem">
        Editor percorsi non caricato.
      </div>
      <div style="color:var(--muted);font-size:.86rem;line-height:1.45">
        ${esc(detail || "Errore non specificato.")}<br>
        Apri il gestionale tramite server locale:
        <a href="http://localhost:8027/#percorsi" style="color:var(--blu);font-weight:800">http://localhost:8027/#percorsi</a>
      </div>
    </div>`;
}
function openAppNotes() {
  if (!godMode) return;
  const current = visibleViewName();
  if (current && current !== "app-notes") appNotesReturnView = current;
  showView("app-notes");
}
function closeAppNotes() {
  const target = appNotesReturnView || "allievi";
  appNotesReturnView = null;
  const targetEl = document.getElementById(`view-${target}`);
  if (!targetEl) {
    showView("allievi");
    return;
  }
  document.querySelectorAll("#screen-app main > section").forEach((section) => {
    section.hidden = true;
  });
  targetEl.hidden = false;
  syncNavActive(target);
  requestAnimationFrame(() => motion.view(target));
}
function showCalendarFromHeader() {
  showView("appuntamenti");
}
function maestroAvailabilityStorageKey() {
  return `${MAESTRO_AVAILABILITY_STORAGE_PREFIX}:${currentUid || currentEmail || "local"}`;
}
function availabilityDayOrder(day) {
  return (Number(day) + 6) % 7;
}
function availabilityDayLabel(day, short = false) {
  const found = AVAILABILITY_DAYS.find((d) => Number(d.value) === Number(day));
  return found ? short ? found.short : found.label : "";
}
function availabilityDayIndex(day) {
  return AVAILABILITY_DAYS.findIndex((d) => Number(d.value) === Number(day));
}
function availabilityDayRange(startDay, endDay) {
  const startIndex = availabilityDayIndex(startDay);
  const endIndex = availabilityDayIndex(endDay);
  if (startIndex < 0 || endIndex < 0) return [];
  const from = Math.min(startIndex, endIndex);
  const to = Math.max(startIndex, endIndex);
  return AVAILABILITY_DAYS.slice(from, to + 1).map((day) => day.value);
}
function timeToMinutes(value) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}
function minutesToTime(value) {
  const minutes = Math.max(0, Math.min(24 * 60, Number(value) || 0));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function newAvailabilityId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
function mergeAvailabilityNotes(...notes) {
  const seen = /* @__PURE__ */ new Set();
  return notes.flatMap((note) => String(note || "").split(/\s+\|\s+|\n+/)).map((note) => note.trim()).filter((note) => {
    if (!note) return false;
    const key = note.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).join(" | ");
}
function normalizeAvailabilitySlots(slots = []) {
  if (!Array.isArray(slots)) return [];
  const clean = slots.map((slot) => {
    var _a2, _b2;
    const day = Number((_b2 = (_a2 = slot.day) != null ? _a2 : slot.giorno) != null ? _b2 : slot.weekday);
    const start = String(slot.start || slot.inizio || "").slice(0, 5);
    const end = String(slot.end || slot.fine || "").slice(0, 5);
    const startMin = timeToMinutes(start);
    const endMin = timeToMinutes(end);
    if (!AVAILABILITY_DAYS.some((d) => d.value === day) || startMin === null || endMin === null || endMin <= startMin) return null;
    return {
      id: String(slot.id || newAvailabilityId()),
      day,
      start,
      end,
      note: String(slot.note || slot.luogo || "").trim()
    };
  }).filter(Boolean).sort((a, b) => availabilityDayOrder(a.day) - availabilityDayOrder(b.day) || timeToMinutes(a.start) - timeToMinutes(b.start) || timeToMinutes(a.end) - timeToMinutes(b.end));
  const merged = [];
  clean.forEach((slot) => {
    const previous = merged[merged.length - 1];
    if (!previous || Number(previous.day) !== Number(slot.day) || timeToMinutes(slot.start) >= timeToMinutes(previous.end)) {
      merged.push(__spreadValues({}, slot));
      return;
    }
    const previousEnd = timeToMinutes(previous.end);
    const slotEnd = timeToMinutes(slot.end);
    previous.end = minutesToTime(Math.max(previousEnd, slotEnd));
    previous.note = mergeAvailabilityNotes(previous.note, slot.note);
  });
  return merged;
}
function loadMaestroAvailabilitySlots(metadata = {}) {
  var _a2;
  let local = [];
  try {
    local = JSON.parse(safeStorage.getItem(maestroAvailabilityStorageKey()) || "[]") || [];
  } catch (e) {
    local = [];
  }
  const remote = normalizeAvailabilitySlots((metadata == null ? void 0 : metadata[MAESTRO_AVAILABILITY_METADATA_KEY]) || ((_a2 = metadata == null ? void 0 : metadata.disponibilita_maestro) == null ? void 0 : _a2.slots) || []);
  const slots = remote.length ? remote : normalizeAvailabilitySlots(local);
  safeStorage.setItem(maestroAvailabilityStorageKey(), JSON.stringify(slots));
  return slots;
}
function setAvailabilityStatus(owner, text, cls = "") {
  const el = document.getElementById(`${owner}-availability-status`);
  if (!el) return;
  el.textContent = text || "";
  el.style.color = cls === "err" ? "var(--danger)" : cls === "ok" ? "var(--success)" : "var(--muted)";
}
function activeAppointmentAllievi() {
  return ordinaAllieviLista(allieviVisibiliGod().filter((a) => a.stato !== "archiviato"));
}
function availabilityAllievoOptions(selected = "") {
  const attivi = activeAppointmentAllievi();
  const gruppi = [...new Set(attivi.map((a) => a.gruppo).filter(Boolean))].sort();
  return `
    <option value="">\u2014 Scegli allievo \u2014</option>
    ${gruppi.map((gruppo) => `
      <optgroup label="${esc(gruppo)}">
        ${attivi.filter((a) => a.gruppo === gruppo).map((a) => `<option value="${esc(a.id)}" ${String(a.id) === String(selected) ? "selected" : ""}>${esc(lezioneTargetLabelAllievo(a))}</option>`).join("")}
      </optgroup>`).join("")}
    ${attivi.some((a) => !a.gruppo) ? `
      <optgroup label="Senza gruppo">
        ${attivi.filter((a) => !a.gruppo).map((a) => `<option value="${esc(a.id)}" ${String(a.id) === String(selected) ? "selected" : ""}>${esc(lezioneTargetLabelAllievo(a))}</option>`).join("")}
      </optgroup>` : ""}`;
}
function selectedAppointmentAllievo() {
  return appuntamentiSelectedAllievoId ? allievoById(appuntamentiSelectedAllievoId) : null;
}
function availabilitySlotsForAllievo(allievo) {
  var _a2, _b2;
  return normalizeAvailabilitySlots(((_a2 = allievo == null ? void 0 : allievo.profilo) == null ? void 0 : _a2.disponibilita_slots) || ((_b2 = allievo == null ? void 0 : allievo.profilo) == null ? void 0 : _b2.availability_slots) || []);
}
function availabilitySlotsForOwner(owner) {
  if (owner === "maestro") return normalizeAvailabilitySlots(maestroAvailabilitySlots);
  return availabilitySlotsForAllievo(selectedAppointmentAllievo());
}
function availabilityGridHeight() {
  return (AVAILABILITY_END_MIN - AVAILABILITY_START_MIN) / 60 * AVAILABILITY_HOUR_PX;
}
function availabilityHourLabels() {
  const labels = [];
  for (let min = AVAILABILITY_START_MIN; min <= AVAILABILITY_END_MIN; min += 60) labels.push(min);
  return labels;
}
function availabilityClampStart(value, duration = AVAILABILITY_STEP_MIN) {
  return Math.max(AVAILABILITY_START_MIN, Math.min(AVAILABILITY_END_MIN - duration, value));
}
function availabilityClampEnd(value, startMin) {
  return Math.max(startMin + AVAILABILITY_STEP_MIN, Math.min(AVAILABILITY_END_MIN, value));
}
function availabilitySnap(value) {
  return Math.round(value / AVAILABILITY_STEP_MIN) * AVAILABILITY_STEP_MIN;
}
function availabilityMinutesFromEvent(event, col) {
  const rect = col.getBoundingClientRect();
  const raw = AVAILABILITY_START_MIN + (event.clientY - rect.top) / AVAILABILITY_HOUR_PX * 60;
  return Math.max(AVAILABILITY_START_MIN, Math.min(AVAILABILITY_END_MIN, availabilitySnap(raw)));
}
function availabilitySlotStyle(slot) {
  const startMin = timeToMinutes(slot.start);
  const endMin = timeToMinutes(slot.end);
  const top = (startMin - AVAILABILITY_START_MIN) / 60 * AVAILABILITY_HOUR_PX;
  const height = Math.max(18, (endMin - startMin) / 60 * AVAILABILITY_HOUR_PX);
  return `top:${top}px;height:${height}px`;
}
function availabilitySlotBlockHtml(owner, slot, preview = false) {
  const cls = preview ? "availability-drag-preview" : "availability-slot-block";
  const title = `${availabilityDayLabel(slot.day)} ${slot.start}-${slot.end}${slot.note ? ` \xB7 ${slot.note}` : ""}`;
  const handlers = preview ? "" : `onpointerdown="startAvailabilityMove(event,'${owner}',${jsArg(slot.id)})" ondblclick="editAvailabilitySlotNote('${owner}',${jsArg(slot.id)})"`;
  return `
    <div class="${cls}" style="${availabilitySlotStyle(slot)}" title="${esc(title)}" ${handlers}>
      <span class="availability-slot-time">${esc(slot.start)}-${esc(slot.end)}</span>
      ${slot.note ? `<span class="availability-slot-note">${esc(slot.note)}</span>` : ""}
      ${preview ? "" : `<button type="button" class="availability-slot-delete" onclick="event.stopPropagation(); removeAvailabilitySlot('${owner}',${jsArg(slot.id)})" title="Elimina fascia">\xD7</button><div class="availability-slot-resize" onpointerdown="startAvailabilityResize(event,'${owner}',${jsArg(slot.id)})"></div>`}
    </div>`;
}
function availabilityPlannerHtml(owner, slots) {
  const normalized = normalizeAvailabilitySlots(slots);
  const byDay = new Map(AVAILABILITY_DAYS.map((day) => [day.value, []]));
  normalized.forEach((slot) => {
    var _a2;
    return (_a2 = byDay.get(Number(slot.day))) == null ? void 0 : _a2.push(slot);
  });
  const style = `--availability-hour-px:${AVAILABILITY_HOUR_PX}px;--availability-grid-height:${availabilityGridHeight()}px`;
  return `
    <div class="availability-planner" id="${owner}-availability-planner" data-owner="${owner}" style="${style}">
      <div class="availability-planner-help">Trascina in verticale per scegliere l orario e in orizzontale per coprire piu giorni. Trascina un blocco per spostarlo, usa il bordo basso per allungarlo o accorciarlo, doppio click per aggiungere una nota.</div>
      <div class="availability-grid-wrap">
        <div class="availability-week-head">
          <div></div>
          ${AVAILABILITY_DAYS.map((day) => `<div>${esc(day.short)}</div>`).join("")}
        </div>
        <div class="availability-week-body">
          <div class="availability-time-axis">
            ${availabilityHourLabels().map((min) => `<div class="availability-time-label" style="top:${(min - AVAILABILITY_START_MIN) / 60 * AVAILABILITY_HOUR_PX}px">${minutesToTime(min)}</div>`).join("")}
          </div>
          ${AVAILABILITY_DAYS.map((day) => `
            <div class="availability-day-col" data-owner="${owner}" data-day="${day.value}" onpointerdown="startAvailabilityCreate(event,'${owner}',${day.value})">
              ${(byDay.get(day.value) || []).map((slot) => availabilitySlotBlockHtml(owner, slot)).join("")}
            </div>`).join("")}
        </div>
      </div>
      ${normalized.length ? `<div class="appointments-status">${normalized.length} fasc${normalized.length === 1 ? "ia" : "e"} inserit${normalized.length === 1 ? "a" : "e"}.</div>` : '<div class="availability-empty">Nessuna fascia inserita: trascina dentro la griglia per crearne una.</div>'}
    </div>`;
}
function renderAppuntamenti() {
  var _a2;
  const el = document.getElementById("appuntamenti-content");
  if (!el) return;
  const attivi = activeAppointmentAllievi();
  if (appuntamentiSelectedAllievoId && !attivi.some((a) => String(a.id) === String(appuntamentiSelectedAllievoId))) appuntamentiSelectedAllievoId = null;
  if (!appuntamentiSelectedAllievoId && attivi.length) appuntamentiSelectedAllievoId = attivi[0].id;
  const selectedAllievo = selectedAppointmentAllievo();
  const selectedSlots = availabilitySlotsForAllievo(selectedAllievo);
  const selectedNote = ((_a2 = selectedAllievo == null ? void 0 : selectedAllievo.profilo) == null ? void 0 : _a2.disponibilita) || "";
  const gruppi = [...new Set(attivi.map((a) => a.gruppo).filter(Boolean))].sort();
  const filteredAllievi = filteredAppointmentAllievi();
  el.innerHTML = `
    <div class="appointments-grid">
      <div class="card">
        <div class="appointments-card-head">
          <div class="appointments-card-title">
            <h3>Disponibilita maestro</h3>
            <span>Fasce settimanali ricorrenti. Salvate localmente e, se possibile, nei dati utente.</span>
          </div>
        </div>
        ${availabilityPlannerHtml("maestro", maestroAvailabilitySlots)}
        <div class="appointments-status" id="maestro-availability-status"></div>
      </div>

      <div class="card">
        <div class="appointments-card-head">
          <div class="appointments-card-title">
            <h3>Disponibilita allievo</h3>
            <span>Le fasce vengono salvate nel profilo dell allievo selezionato.</span>
          </div>
        </div>
        <div class="field">
          <label>Allievo</label>
          <select id="appointments-allievo-select" onchange="setAppuntamentiAllievo(this.value)">
            ${availabilityAllievoOptions(appuntamentiSelectedAllievoId)}
          </select>
        </div>
        ${selectedAllievo ? `
          ${availabilityPlannerHtml("allievo", selectedSlots)}
          <div class="field" style="margin-top:.75rem">
            <label>Note disponibilita</label>
            <textarea id="appointments-allievo-note" placeholder="Testo libero, vincoli dei genitori, preferenze...">${esc(selectedNote)}</textarea>
          </div>
          <button type="button" class="btn btn-outline btn-sm" onclick="saveSelectedAllievoAvailabilityNote()">Salva note</button>
        ` : '<div class="availability-empty">Nessun allievo attivo disponibile.</div>'}
        <div class="appointments-status" id="allievo-availability-status"></div>
      </div>

      <div class="card appointments-full">
        <div class="appointments-card-head">
          <div class="appointments-card-title">
            <h3>Incroci maestro-allievo</h3>
            <span>Mostra le finestre in cui tu e ogni allievo filtrato siete entrambi disponibili.</span>
          </div>
        </div>
        <div class="appointments-toolbar">
          <div class="field">
            <label>Cerca allievo</label>
            <input type="search" id="appointments-search" value="${esc(appuntamentiAllieviQuery)}" placeholder="Nome, nickname, gruppo" oninput="setAppuntamentiQuery(this.value)">
          </div>
          <div class="field">
            <label>Gruppo</label>
            <select id="appointments-group-filter" onchange="setAppuntamentiGroupFilter(this.value)">
              <option value="all">Tutti</option>
              ${gruppi.map((g) => `<option value="${esc(g)}" ${appuntamentiGruppoFiltro === g ? "selected" : ""}>${esc(g)}</option>`).join("")}
              <option value="__no_group__" ${appuntamentiGruppoFiltro === "__no_group__" ? "selected" : ""}>Senza gruppo</option>
            </select>
          </div>
          <div class="field">
            <label>Durata lezione min.</label>
            <input type="number" id="appointments-min-duration" min="${APPOINTMENT_MIN_LESSON_MIN}" step="5" value="${APPOINTMENT_MIN_LESSON_MIN}" oninput="renderAppointmentIntersections()">
          </div>
        </div>
        <div class="appointments-status">${filteredAllievi.length} alliev${filteredAllievi.length === 1 ? "o" : "i"} nel filtro corrente.</div>
        <div id="appointments-intersections"></div>
      </div>
    </div>`;
  renderAppointmentIntersections();
  requestAnimationFrame(() => motion.cards(el));
}
function setAppuntamentiAllievo(id) {
  appuntamentiSelectedAllievoId = id || null;
  renderAppuntamenti();
}
function setAppuntamentiQuery(value) {
  var _a2;
  appuntamentiAllieviQuery = value || "";
  renderAppuntamenti();
  (_a2 = document.getElementById("appointments-search")) == null ? void 0 : _a2.focus();
}
function setAppuntamentiGroupFilter(value) {
  appuntamentiGruppoFiltro = value || "all";
  renderAppuntamenti();
}
function filteredAppointmentAllievi() {
  const query = normalizeText(appuntamentiAllieviQuery);
  return activeAppointmentAllievi().filter((a) => {
    var _a2;
    if (appuntamentiGruppoFiltro !== "all") {
      if (appuntamentiGruppoFiltro === "__no_group__" && a.gruppo) return false;
      if (appuntamentiGruppoFiltro !== "__no_group__" && a.gruppo !== appuntamentiGruppoFiltro) return false;
    }
    if (!query) return true;
    const haystack = normalizeText([a.nome, a.cognome, a.nickname, a.gruppo, (_a2 = a.profilo) == null ? void 0 : _a2.disponibilita].filter(Boolean).join(" "));
    return haystack.includes(query);
  });
}
function saveAvailabilitySlotsForOwner(owner, slots, message = "Disponibilita salvata.") {
  return __async(this, null, function* () {
    if (owner === "maestro") {
      const saved = yield saveMaestroAvailabilitySlots(slots);
      renderAppuntamenti();
      setAvailabilityStatus("maestro", saved.remote ? message : "Salvata localmente. Sync online non disponibile.", saved.remote ? "ok" : "");
      return;
    }
    const allievo = selectedAppointmentAllievo();
    if (!allievo) return;
    yield saveAllievoAvailability(allievo.id, slots);
    renderAppuntamenti();
    setAvailabilityStatus("allievo", message, "ok");
  });
}
function availabilityDayColumn(owner, day) {
  return document.querySelector(`.availability-day-col[data-owner="${owner}"][data-day="${day}"]`);
}
function availabilityDayFromPointer(owner, event) {
  const cols = [...document.querySelectorAll(`.availability-day-col[data-owner="${owner}"]`)];
  return cols.find((col) => {
    const rect = col.getBoundingClientRect();
    return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  }) || null;
}
function availabilityCurrentDragSlots() {
  if (!availabilityDragState) return [];
  return availabilityCurrentDragSlotsFromState(availabilityDragState);
}
function renderAvailabilityDragPreview() {
  document.querySelectorAll(".availability-drag-preview").forEach((el) => el.remove());
  const slots = availabilityCurrentDragSlots();
  if (!slots.length || !availabilityDragState) return;
  slots.forEach((slot) => {
    const col = availabilityDayColumn(availabilityDragState.owner, slot.day);
    if (col) col.insertAdjacentHTML("beforeend", availabilitySlotBlockHtml(availabilityDragState.owner, slot, true));
  });
}
function bindAvailabilityDragEnd() {
  document.addEventListener("pointermove", handleAvailabilityPointerMove);
  document.addEventListener("pointerup", finishAvailabilityPointerDrag, { once: true });
  document.body.classList.add("availability-dragging");
}
function startAvailabilityCreate(event, owner, day) {
  if (event.button !== void 0 && event.button !== 0) return;
  if (event.target.closest(".availability-slot-block")) return;
  const col = event.currentTarget;
  const startMin = availabilityClampStart(availabilityMinutesFromEvent(event, col), AVAILABILITY_STEP_MIN);
  availabilityDragState = {
    mode: "create",
    owner,
    startDay: day,
    endDay: day,
    startMin,
    endMin: startMin + AVAILABILITY_STEP_MIN
  };
  event.preventDefault();
  bindAvailabilityDragEnd();
  renderAvailabilityDragPreview();
}
function startAvailabilityMove(event, owner, slotId) {
  if (event.button !== void 0 && event.button !== 0) return;
  if (event.target.closest(".availability-slot-delete, .availability-slot-resize")) return;
  const slot = availabilitySlotsForOwner(owner).find((item) => String(item.id) === String(slotId));
  const col = event.currentTarget.closest(".availability-day-col");
  if (!slot || !col) return;
  availabilityDragState = {
    mode: "move",
    owner,
    slotId,
    originalSlot: slot,
    pointerStartMin: availabilityMinutesFromEvent(event, col),
    currentSlot: slot
  };
  event.preventDefault();
  event.stopPropagation();
  bindAvailabilityDragEnd();
}
function startAvailabilityResize(event, owner, slotId) {
  if (event.button !== void 0 && event.button !== 0) return;
  const slot = availabilitySlotsForOwner(owner).find((item) => String(item.id) === String(slotId));
  if (!slot) return;
  availabilityDragState = {
    mode: "resize",
    owner,
    slotId,
    originalSlot: slot,
    currentSlot: slot
  };
  event.preventDefault();
  event.stopPropagation();
  bindAvailabilityDragEnd();
  renderAvailabilityDragPreview();
}
function handleAvailabilityPointerMove(event) {
  if (!availabilityDragState) return;
  const state = availabilityDragState;
  if (state.mode === "create") {
    const col = availabilityDayFromPointer(state.owner, event) || availabilityDayColumn(state.owner, state.endDay || state.startDay);
    if (!col) return;
    state.endDay = Number(col.dataset.day);
    state.endMin = availabilityMinutesFromEvent(event, col);
  } else if (state.mode === "move") {
    const col = availabilityDayFromPointer(state.owner, event) || availabilityDayColumn(state.owner, state.originalSlot.day);
    if (!col) return;
    const duration = timeToMinutes(state.originalSlot.end) - timeToMinutes(state.originalSlot.start);
    const pointerMin = availabilityMinutesFromEvent(event, col);
    const delta = availabilitySnap(pointerMin - state.pointerStartMin);
    const startMin = availabilityClampStart(timeToMinutes(state.originalSlot.start) + delta, duration);
    state.currentSlot = __spreadProps(__spreadValues({}, state.originalSlot), {
      day: Number(col.dataset.day),
      start: minutesToTime(startMin),
      end: minutesToTime(startMin + duration)
    });
  } else if (state.mode === "resize") {
    const col = availabilityDayColumn(state.owner, state.originalSlot.day);
    if (!col) return;
    const startMin = timeToMinutes(state.originalSlot.start);
    const endMin = availabilityClampEnd(availabilityMinutesFromEvent(event, col), startMin);
    state.currentSlot = __spreadProps(__spreadValues({}, state.originalSlot), {
      end: minutesToTime(endMin)
    });
  }
  renderAvailabilityDragPreview();
}
function finishAvailabilityPointerDrag() {
  return __async(this, null, function* () {
    document.removeEventListener("pointermove", handleAvailabilityPointerMove);
    document.body.classList.remove("availability-dragging");
    const state = availabilityDragState;
    availabilityDragState = null;
    document.querySelectorAll(".availability-drag-preview").forEach((el) => el.remove());
    if (!state) return;
    const dragSlots = availabilityCurrentDragSlotsFromState(state);
    if (!dragSlots.length) return;
    const slots = availabilitySlotsForOwner(state.owner);
    const next = state.mode === "create" ? [...slots, ...dragSlots.map((slot) => __spreadProps(__spreadValues({}, slot), { id: newAvailabilityId() }))] : slots.map((item) => String(item.id) === String(state.slotId) ? __spreadProps(__spreadValues({}, dragSlots[0]), { id: item.id }) : item);
    try {
      yield saveAvailabilitySlotsForOwner(state.owner, next, state.mode === "create" ? dragSlots.length > 1 ? "Fasce create." : "Fascia creata." : "Fascia aggiornata.");
    } catch (e) {
      setAvailabilityStatus(state.owner, e.message || "Errore salvataggio fascia.", "err");
    }
  });
}
function availabilityCurrentDragSlotsFromState(state) {
  if (state.mode === "create") {
    const startMin = Math.min(state.startMin, state.endMin);
    const endMin = Math.max(state.startMin, state.endMin);
    if (endMin - startMin < AVAILABILITY_STEP_MIN) return [];
    return availabilityDayRange(state.startDay, state.endDay || state.startDay).map((day) => ({
      id: "__new__",
      day,
      start: minutesToTime(startMin),
      end: minutesToTime(endMin),
      note: ""
    }));
  }
  return state.currentSlot ? [state.currentSlot] : [];
}
function editAvailabilitySlotNote(owner, slotId) {
  return __async(this, null, function* () {
    const slots = availabilitySlotsForOwner(owner);
    const slot = slots.find((item) => String(item.id) === String(slotId));
    if (!slot) return;
    const note = prompt("Nota per questa fascia", slot.note || "");
    if (note === null) return;
    const next = slots.map((item) => String(item.id) === String(slotId) ? __spreadProps(__spreadValues({}, item), { note: note.trim() }) : item);
    try {
      yield saveAvailabilitySlotsForOwner(owner, next, "Nota fascia salvata.");
    } catch (e) {
      setAvailabilityStatus(owner, e.message || "Errore salvataggio nota.", "err");
    }
  });
}
function removeAvailabilitySlot(owner, slotId) {
  return __async(this, null, function* () {
    try {
      if (owner === "maestro") {
        const saved = yield saveMaestroAvailabilitySlots(maestroAvailabilitySlots.filter((slot) => String(slot.id) !== String(slotId)));
        renderAppuntamenti();
        setAvailabilityStatus("maestro", saved.remote ? "Fascia rimossa." : "Fascia rimossa localmente.", saved.remote ? "ok" : "");
        return;
      }
      const allievo = selectedAppointmentAllievo();
      if (!allievo) return;
      yield saveAllievoAvailability(allievo.id, availabilitySlotsForAllievo(allievo).filter((slot) => String(slot.id) !== String(slotId)));
      renderAppuntamenti();
      setAvailabilityStatus("allievo", "Fascia rimossa.", "ok");
    } catch (e) {
      setAvailabilityStatus(owner, e.message || "Errore rimozione fascia.", "err");
    }
  });
}
function saveMaestroAvailabilitySlots(slots) {
  return __async(this, null, function* () {
    maestroAvailabilitySlots = normalizeAvailabilitySlots(slots);
    safeStorage.setItem(maestroAvailabilityStorageKey(), JSON.stringify(maestroAvailabilitySlots));
    if (!(sb == null ? void 0 : sb.auth)) return { remote: false };
    const payload = __spreadProps(__spreadValues({}, currentUserMetadata), {
      [MAESTRO_AVAILABILITY_METADATA_KEY]: maestroAvailabilitySlots,
      disponibilita_maestro_updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    const { user, error } = yield updateCurrentUserMetadata(payload);
    if (error) return { remote: false, error };
    currentUserMetadata = (user == null ? void 0 : user.user_metadata) || payload;
    return { remote: true };
  });
}
function saveAllievoAvailability(allievoId, slots, noteValue = void 0) {
  return __async(this, null, function* () {
    const allievo = allievoById(allievoId);
    if (!allievo) throw new Error("Allievo non trovato.");
    const profilo = __spreadProps(__spreadValues({}, allievo.profilo || {}), {
      disponibilita_slots: normalizeAvailabilitySlots(slots),
      disponibilita_updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (noteValue !== void 0) profilo.disponibilita = noteValue.trim() || null;
    let payload = { profilo, aggiornato_il: (/* @__PURE__ */ new Date()).toISOString() };
    let { data, error } = yield sb.from("allievi").update(payload).eq("id", allievoId).select().single();
    if (error && /aggiornato_il|updated_at|schema cache|column/i.test(error.message || error.details || error.hint || "")) {
      payload = { profilo };
      ({ data, error } = yield sb.from("allievi").update(payload).eq("id", allievoId).select().single());
    }
    if (error) throw error;
    allAllievi = allAllievi.map((a) => String(a.id) === String(allievoId) ? data || __spreadValues(__spreadValues({}, a), payload) : a);
    logModificaLocale("allievo", allievoId, "Aggiornate disponibilita");
  });
}
function saveSelectedAllievoAvailabilityNote() {
  return __async(this, null, function* () {
    var _a2;
    const allievo = selectedAppointmentAllievo();
    if (!allievo) return;
    const note = ((_a2 = document.getElementById("appointments-allievo-note")) == null ? void 0 : _a2.value) || "";
    try {
      yield saveAllievoAvailability(allievo.id, availabilitySlotsForAllievo(allievo), note);
      renderAppuntamenti();
      setAvailabilityStatus("allievo", "Note disponibilita salvate.", "ok");
    } catch (e) {
      setAvailabilityStatus("allievo", e.message || "Errore salvataggio note.", "err");
    }
  });
}
function slotsForDay(slots, day) {
  return normalizeAvailabilitySlots(slots).filter((slot) => Number(slot.day) === Number(day)).map((slot) => __spreadProps(__spreadValues({}, slot), { startMin: timeToMinutes(slot.start), endMin: timeToMinutes(slot.end) }));
}
function computeAvailabilityIntersections(allievoIds, minDuration = APPOINTMENT_MIN_LESSON_MIN, bufferMin = APPOINTMENT_BUFFER_MIN) {
  const ids = (allievoIds || []).filter(Boolean);
  if (!ids.length) return [];
  const requiredDuration = minDuration + bufferMin;
  const sources = [
    { id: "maestro", label: "Maestro", slots: maestroAvailabilitySlots },
    ...ids.map((id) => {
      const allievo = allievoById(id);
      return { id, label: allievo ? lezioneTargetLabelAllievo(allievo) : id, slots: availabilitySlotsForAllievo(allievo) };
    })
  ];
  if (sources.some((source) => !normalizeAvailabilitySlots(source.slots).length)) return [];
  const results = [];
  AVAILABILITY_DAYS.forEach((day) => {
    let windows = slotsForDay(sources[0].slots, day.value).map((slot) => ({
      day: day.value,
      startMin: slot.startMin,
      endMin: slot.endMin,
      labels: [sources[0].label]
    }));
    for (const source of sources.slice(1)) {
      const nextSlots = slotsForDay(source.slots, day.value);
      const nextWindows = [];
      windows.forEach((window2) => {
        nextSlots.forEach((slot) => {
          const startMin = Math.max(window2.startMin, slot.startMin);
          const endMin = Math.min(window2.endMin, slot.endMin);
          if (endMin - startMin >= requiredDuration) {
            nextWindows.push({
              day: day.value,
              startMin,
              endMin,
              labels: [...window2.labels, source.label]
            });
          }
        });
      });
      const deduped = /* @__PURE__ */ new Map();
      nextWindows.forEach((window2) => deduped.set(`${window2.day}-${window2.startMin}-${window2.endMin}`, window2));
      windows = [...deduped.values()];
      if (!windows.length) break;
    }
    results.push(...windows);
  });
  return results.map((window2) => __spreadProps(__spreadValues({}, window2), {
    start: minutesToTime(window2.startMin),
    end: minutesToTime(window2.endMin),
    duration: window2.endMin - window2.startMin,
    lessonDuration: Math.max(0, window2.endMin - window2.startMin - bufferMin),
    bufferMin
  })).sort((a, b) => availabilityDayOrder(a.day) - availabilityDayOrder(b.day) || a.startMin - b.startMin || a.endMin - b.endMin);
}
function computePairwiseAvailabilityIntersections(allievoIds, minDuration = APPOINTMENT_MIN_LESSON_MIN, bufferMin = APPOINTMENT_BUFFER_MIN) {
  return (allievoIds || []).flatMap((id) => {
    const allievo = allievoById(id);
    return computeAvailabilityIntersections([id], minDuration, bufferMin).map((window2) => __spreadProps(__spreadValues({}, window2), {
      allievoId: id,
      allievoName: allievo ? lezioneTargetLabelAllievo(allievo) : id
    }));
  }).sort((a, b) => availabilityDayOrder(a.day) - availabilityDayOrder(b.day) || a.startMin - b.startMin || String(a.allievoName).localeCompare(String(b.allievoName), "it", { sensitivity: "base" }));
}
function appointmentResultHtml(window2, detail = "") {
  var _a2;
  const tail = detail ? "" : ((_a2 = window2.labels) == null ? void 0 : _a2.slice(1).join(", ")) || "";
  const bufferText = window2.bufferMin ? ` \xB7 max lezione ${window2.lessonDuration} min + pausa ${window2.bufferMin} min` : "";
  return `
    <div class="appointment-result">
      <strong>${availabilityDayLabel(window2.day)}</strong>
      <span>${esc(window2.start)} - ${esc(window2.end)}<small>${window2.duration} min totali${bufferText}${detail ? ` \xB7 ${esc(detail)}` : ""}</small></span>
      <small>${esc(tail)}</small>
    </div>`;
}
function renderAppointmentIntersections() {
  const el = document.getElementById("appointments-intersections");
  if (!el) return;
  const durationInput = document.getElementById("appointments-min-duration");
  const rawDuration = Number((durationInput == null ? void 0 : durationInput.value) || APPOINTMENT_MIN_LESSON_MIN);
  const minDuration = Number.isFinite(rawDuration) ? Math.max(APPOINTMENT_MIN_LESSON_MIN, rawDuration) : APPOINTMENT_MIN_LESSON_MIN;
  if (durationInput && Number(durationInput.value) !== minDuration) durationInput.value = String(minDuration);
  const filtered = filteredAppointmentAllievi();
  const filteredIds = filtered.map((a) => a.id);
  const missing = [];
  if (!normalizeAvailabilitySlots(maestroAvailabilitySlots).length) missing.push("Maestro");
  const withoutSlots = filtered.filter((a) => !availabilitySlotsForAllievo(a).length);
  if (withoutSlots.length) {
    const preview = withoutSlots.slice(0, 4).map((a) => lezioneTargetLabelAllievo(a)).join(", ");
    missing.push(`${withoutSlots.length} alliev${withoutSlots.length === 1 ? "o" : "i"} senza fasce${preview ? ` (${preview}${withoutSlots.length > 4 ? ", ..." : ""})` : ""}`);
  }
  const pairwise = computePairwiseAvailabilityIntersections(filteredIds, minDuration, APPOINTMENT_BUFFER_MIN);
  el.innerHTML = `
    ${missing.length ? `<div class="appointments-warning">Disponibilita mancanti o incomplete: ${esc(missing.join(", "))}.</div>` : ""}
    <div class="appointments-results">
      <div class="appointments-card-title">
        <h3>Incroci disponibili</h3>
        <span>${filtered.length} alliev${filtered.length === 1 ? "o" : "i"} nel filtro corrente \xB7 durata lezione minima ${minDuration} min \xB7 pausa ${APPOINTMENT_BUFFER_MIN} min</span>
      </div>
      ${pairwise.length ? pairwise.slice(0, 80).map((window2) => appointmentResultHtml(window2, window2.allievoName)).join("") : `<div class="availability-empty">Nessun incrocio maestro-allievo trovato con ${minDuration} min di lezione e ${APPOINTMENT_BUFFER_MIN} min di pausa.</div>`}
      ${pairwise.length > 80 ? `<div class="appointments-status">Mostro i primi 80 incroci su ${pairwise.length}. Restringi il filtro per vedere meno risultati.</div>` : ""}
    </div>`;
}
function openLezione(id, fromAllievoId = null, fromGruppoNome = null) {
  lezioneBackAllievoId = fromAllievoId || null;
  lezioneBackGruppoNome = fromGruppoNome || null;
  showView("lezione", id);
}
function chiudiLezioneGuidata(id) {
  showView("nuova-lezione", `lezione:${id}`);
  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    const check = document.getElementById("lz-check-bene");
    if (check || tries > 20) {
      clearInterval(timer);
      setLessonStatus("chiusa");
      document.getElementById("lz-title").textContent = "Chiudi lezione";
      check == null ? void 0 : check.focus();
      check == null ? void 0 : check.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 120);
}
function openLocation(luogo) {
  if (!luogo) return;
  showView("location", luogo);
}
function loadLocation(luogo) {
  return __async(this, null, function* () {
    const el = document.getElementById("location-content");
    const nome = String(luogo || "").trim();
    el.innerHTML = '<div class="loading">Caricamento\u2026</div>';
    recordAppHistory("location", nome);
    if (!lezioniCache) yield loadLezioni(true);
    yield loadLocations();
    if (nome === "__index__") {
      const names = locationNamesFromLessons();
      el.innerHTML = `
      <button class="back-btn" onclick="showView('allievi')">\u2190 Dashboard</button>
      <div class="section-header"><h2>Location</h2><button class="btn btn-primary btn-sm" onclick="openLocation('Nuova location')">+ Nuova location</button></div>
      <div class="card">
        ${names.length ? names.map((name) => {
        const rec = locationRecordByName(name);
        const count = (lezioniCache || []).filter((l) => normalizeText(l.luogo || "") === normalizeText(name)).length;
        return `<div class="lezione-read-person clickable" onclick="openLocation(${jsArg(name)})"><strong>${esc(name)}</strong><span> \xB7 ${esc((rec == null ? void 0 : rec.tipologia) || "Location")} \xB7 ${count} lezion${count === 1 ? "e" : "i"}</span>${(rec == null ? void 0 : rec.indirizzo) ? `<span> \xB7 ${esc(rec.indirizzo)}</span>` : ""}${(rec == null ? void 0 : rec.condivisa) ? "<span> \xB7 condivisa</span>" : ""}</div>`;
      }).join("") : '<div class="empty">Nessuna location registrata.</div>'}
      </div>`;
      return;
    }
    const stored = locationRecordByName(nome) || {};
    const lezioni = (lezioniCache || []).filter((l) => normalizeText(l.luogo || "") === normalizeText(nome));
    const allieviIds = [...new Set(lezioni.flatMap((l) => (l.lezioni_allievi || []).map((la) => {
      var _a2;
      return (_a2 = la.allievi) == null ? void 0 : _a2.id;
    }).filter(Boolean)))];
    const allievi = allieviIds.map((id) => allAllievi.find((a) => a.id === id)).filter(Boolean);
    const casaDi = allievi.length === 1 ? `Casa di ${allievoDisplayName(allievi[0].id)}` : "";
    const tipologia = stored.tipologia || (/casa|home|abitazione/i.test(nome) || casaDi ? "Casa allievo" : "Location");
    const indirizzo = stored.indirizzo || allievi.map((a) => visibleAllievoAddress(a).indirizzo).find(Boolean) || "";
    const coords = locationCoordinatesFromRecord(stored);
    const displayNome = stored.nome || casaDi || nome;
    const editable = canEditLocation(stored);
    const disabledAttr = editable ? "" : " disabled";
    el.innerHTML = `
    <button class="back-btn" onclick="showView('lezioni')">\u2190 Lezioni</button>
    <div class="card">
      <div class="lezione-read-title">${esc(displayNome)}</div>
      <div class="scheda-meta">${esc(tipologia)}${indirizzo ? ` \xB7 ${esc(indirizzo)}` : ""}${coords ? ` \xB7 ${esc(formatMapCoordinate(coords.lat))}, ${esc(formatMapCoordinate(coords.lng))}` : ""}${stored.condivisa ? " \xB7 condivisa" : ""}</div>
    </div>
    <p class="sec-title">Dati location</p>
    <div class="card">
      <div id="location-status" class="msg"></div>
      <div class="location-form-grid">
        <div class="field"><label>Nome</label><input id="loc-nome" value="${esc(stored.nome || nome)}"${disabledAttr}></div>
        <div class="field">
          <label>Categoria</label>
          <select id="loc-tipologia"${disabledAttr}>
            ${locationCategoryOptions(tipologia)}
          </select>
        </div>
      </div>
      <div class="field"><label>Indirizzo</label><input id="loc-indirizzo" value="${esc(indirizzo)}" placeholder="Via, civico, zona"${disabledAttr}></div>
      <div class="location-form-grid location-map-grid">
        <div class="field"><label>Latitudine</label><input id="loc-latitudine" value="${coords ? esc(formatMapCoordinate(coords.lat)) : ""}" placeholder="45.46420" inputmode="decimal"${disabledAttr}></div>
        <div class="field"><label>Longitudine</label><input id="loc-longitudine" value="${coords ? esc(formatMapCoordinate(coords.lng)) : ""}" placeholder="9.19000" inputmode="decimal"${disabledAttr}></div>
      </div>
      <div class="field"><label>Note</label><textarea id="loc-note" placeholder="Dettagli accesso, pavimentazione, criticita..."${disabledAttr}>${esc(stored.note || "")}</textarea></div>
      <label style="display:flex;align-items:center;gap:.5rem;margin-bottom:.8rem;color:var(--muted);font-size:.86rem;font-weight:700">
        <input type="checkbox" id="loc-condivisa" ${stored.condivisa ? "checked" : ""}${disabledAttr}>
        Condivisa con altri maestri
      </label>
      <div style="display:flex;gap:.45rem;flex-wrap:wrap">
        ${editable ? `<button class="btn btn-primary btn-sm" onclick="salvaLocation(${jsArg(nome)})">Salva location</button>` : ""}
        <button class="btn btn-outline btn-sm" onclick="showView('mappa',${jsArg(displayNome)})">Apri in mappa</button>
      </div>
    </div>
    <p class="sec-title">Allievi collegati</p>
    <div class="card">
      ${allievi.length ? allievi.map((a) => {
      const address = visibleAllievoAddress(a);
      return `<div class="lezione-read-person clickable" onclick="loadScheda('${a.id}')"><strong>${esc(allievoDisplayName(a.id))}</strong>${address.indirizzo ? `<span> \xB7 ${esc(address.indirizzo)}</span>` : ""}</div>`;
    }).join("") : '<div class="empty">Nessun allievo collegato.</div>'}
    </div>
    <p class="sec-title">Lezioni in questa location</p>
    <div class="card">${lezioni.length ? renderLezioniTable(lezioni, { showYearGroups: false }) : '<div class="empty">Nessuna lezione registrata.</div>'}</div>
  `;
  });
}
function showLocationsIndex() {
  showView("location", "__index__");
}
function formatMapCoordinate(value) {
  const n = parseMapCoordinate(value);
  return n === null ? "" : n.toFixed(5);
}
function mappaAllievoHomeName(allievo) {
  return [allievo == null ? void 0 : allievo.nome, allievo == null ? void 0 : allievo.cognome].filter(Boolean).join(" ") || (allievo == null ? void 0 : allievo.nickname) || allievoDisplayName(allievo == null ? void 0 : allievo.id);
}
function mappaHomeRecordsFromAllievi() {
  return allieviVisibiliGod().filter((allievo) => (allievo == null ? void 0 : allievo.stato) !== "archiviato").map((allievo) => {
    const profilo = allievo.profilo || {};
    const visibleAddress = visibleAllievoAddress(allievo);
    const casa = String(visibleAddress.casa || "").trim();
    const zona = String(visibleAddress.indirizzo || "").trim();
    const indirizzo = casa || zona;
    if (!indirizzo) return null;
    const nome = `Casa di ${mappaAllievoHomeName(allievo)}`;
    const record = locationWithLocalMapCoords({
      nome,
      tipologia: "Casa allievo",
      indirizzo,
      note: casa && zona && normalizeText(casa) !== normalizeText(zona) ? `Zona: ${zona}` : "",
      condivisa: !!profilo.indirizzo_condiviso,
      source: "allievo-casa",
      allievo_id: allievo.id
    });
    return __spreadProps(__spreadValues({}, record), {
      lessonCount: 0,
      coords: locationMapCoords(record)
    });
  }).filter(Boolean);
}
function mappaLocationRecords() {
  const locationRecords = locationNamesFromLessons().map((nome) => {
    const rec = locationRecordByName(nome) || { nome };
    const displayName = rec.nome || nome;
    const lessonCount = (lezioniCache || []).filter((l) => normalizeText(l.luogo || "") === normalizeText(nome)).length;
    const coords = locationMapCoords(__spreadProps(__spreadValues({}, rec), { nome: displayName }));
    return __spreadProps(__spreadValues({}, rec), {
      nome: displayName,
      tipologia: rec.tipologia || "Location",
      lessonCount,
      coords
    });
  });
  const byKey = /* @__PURE__ */ new Map();
  [...locationRecords, ...mappaHomeRecordsFromAllievi()].forEach((record) => {
    const key = record.source === "allievo-casa" ? `home:${record.allievo_id}` : `location:${normalizeText(record.nome)}`;
    if (!byKey.has(key)) byKey.set(key, record);
  });
  return [...byKey.values()].sort((a, b) => {
    var _a2, _b2, _c;
    if (!!b.coords !== !!a.coords) return b.coords ? 1 : -1;
    if (((_a2 = a.coords) == null ? void 0 : _a2.source) === "stimato" !== (((_b2 = b.coords) == null ? void 0 : _b2.source) === "stimato")) return ((_c = a.coords) == null ? void 0 : _c.source) === "stimato" ? 1 : -1;
    return String(a.nome || "").localeCompare(String(b.nome || ""), "it", { sensitivity: "base" });
  });
}
function mappaTipoClass(tipologia = "") {
  const key = normalizeText(tipologia);
  if (/casa|home|abitazione|allievo/.test(key)) return "type-home";
  if (/pista/.test(key)) return "type-pista";
  if (/skate/.test(key)) return "type-skatepark";
  if (/palestra|gym/.test(key)) return "type-gym";
  if (/parco/.test(key)) return "type-park";
  if (/strada|ciclabile/.test(key)) return "type-road";
  if (/piazza/.test(key)) return "type-square";
  if (/basket/.test(key)) return "type-basket";
  return "type-location";
}
function mappaProjectCoord(coordsOrLat, longitudine) {
  var _a2, _b2;
  const directX = parseMapCoordinate(coordsOrLat == null ? void 0 : coordsOrLat.x);
  const directY = parseMapCoordinate(coordsOrLat == null ? void 0 : coordsOrLat.y);
  if (directX !== null && directY !== null) {
    return {
      x: Math.max(30, Math.min(MILANO_MAP_VIEWBOX.width - 30, directX)),
      y: Math.max(30, Math.min(MILANO_MAP_VIEWBOX.height - 30, directY))
    };
  }
  const lat = parseMapCoordinate((_a2 = coordsOrLat == null ? void 0 : coordsOrLat.lat) != null ? _a2 : coordsOrLat);
  const lng = parseMapCoordinate((_b2 = coordsOrLat == null ? void 0 : coordsOrLat.lng) != null ? _b2 : longitudine);
  if (lat === null || lng === null) return null;
  const rawX = (lng - MILANO_MAP_BOUNDS.west) / (MILANO_MAP_BOUNDS.east - MILANO_MAP_BOUNDS.west) * MILANO_MAP_VIEWBOX.width;
  const rawY = (MILANO_MAP_BOUNDS.north - lat) / (MILANO_MAP_BOUNDS.north - MILANO_MAP_BOUNDS.south) * MILANO_MAP_VIEWBOX.height;
  return {
    x: Math.max(30, Math.min(MILANO_MAP_VIEWBOX.width - 30, rawX)),
    y: Math.max(30, Math.min(MILANO_MAP_VIEWBOX.height - 30, rawY))
  };
}
function mappaCoordFromPoint(x, y) {
  const lng = MILANO_MAP_BOUNDS.west + x / MILANO_MAP_VIEWBOX.width * (MILANO_MAP_BOUNDS.east - MILANO_MAP_BOUNDS.west);
  const lat = MILANO_MAP_BOUNDS.north - y / MILANO_MAP_VIEWBOX.height * (MILANO_MAP_BOUNDS.north - MILANO_MAP_BOUNDS.south);
  return { lat, lng };
}
function mappaShortName(name) {
  const clean = String(name || "Location").replace(/\s+/g, " ").trim();
  return clean.length > 18 ? clean.slice(0, 16) + "..." : clean;
}
function renderMilanoMapSvg(records, selectedName) {
  const nearbyLabelCounts = /* @__PURE__ */ new Map();
  const projectedRecords = records.filter((record) => record.coords).map((record) => ({ record, point: mappaProjectCoord(record.coords) })).filter((item) => item.point);
  const points = projectedRecords.map(({ record, point }) => {
    var _a2;
    const bucket = `${Math.round(point.x / 62)}:${Math.round(point.y / 62)}`;
    const nearbyIndex = nearbyLabelCounts.get(bucket) || 0;
    nearbyLabelCounts.set(bucket, nearbyIndex + 1);
    const selected = normalizeText(record.nome) === normalizeText(selectedName);
    const labelLeft = point.x > 720;
    const labelLow = point.y < 100;
    const stackSide = nearbyIndex % 2 === 0 ? 1 : -1;
    const stackRow = Math.floor(nearbyIndex / 2);
    const stackOffsetX = nearbyIndex ? stackSide * (18 + stackRow * 6) : 0;
    const stackOffsetY = nearbyIndex ? 12 + stackRow * 13 : 0;
    const labelX = (labelLeft ? -12 : 12) + stackOffsetX;
    const labelY = (labelLow ? 28 : -12) + stackOffsetY;
    const anchor = labelLeft ? "end" : "start";
    const radius = Math.min(18, 9 + Math.max(0, Number(record.lessonCount || 0)) * 1.2);
    const inferred = ((_a2 = record.coords) == null ? void 0 : _a2.source) === "stimato";
    const meta = [record.tipologia || "Location", record.indirizzo || "", record.lessonCount ? `${record.lessonCount} lezioni` : "", inferred ? "posizione stimata" : ""].filter(Boolean).join(" \xB7 ");
    return `
        <g class="map-location-point ${mappaTipoClass(record.tipologia)}${selected ? " is-selected" : ""}${inferred ? " is-inferred" : ""}" tabindex="0" role="button" aria-label="${esc(record.nome)}"
          transform="translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})"
          onclick="event.stopPropagation(); selectMappaLocation(${jsArg(record.nome)})"
          onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); selectMappaLocation(${jsArg(record.nome)})}">
          <title>${esc(record.nome)}${meta ? ` \xB7 ${esc(meta)}` : ""}</title>
          <circle class="map-point-hit" r="${Math.max(radius + 16, 28)}"></circle>
          <circle class="map-point-halo" r="${radius + 9}"></circle>
          <circle class="map-point-core" r="${radius}"></circle>
          <text class="map-location-label" x="${labelX}" y="${labelY}" text-anchor="${anchor}">${esc(mappaShortName(record.nome))}</text>
        </g>`;
  }).join("");
  return `
    <div class="map-image-stage">
      <img class="map-base-image" src="${MILANO_MAP_IMAGE}" alt="Mappa di Milano divisa per quartieri">
      <svg id="milano-map-svg" class="map-overlay-svg" viewBox="0 0 ${MILANO_MAP_VIEWBOX.width} ${MILANO_MAP_VIEWBOX.height}" role="img" aria-label="Mappa di Milano con punti location" onclick="handleMappaClick(event)">
        ${points || '<text class="map-location-label" x="557" y="520" text-anchor="middle" style="opacity:1">Nessun punto posizionato</text>'}
      </svg>
    </div>`;
}
function mappaVisibleRecords(records) {
  if (mappaTipoFiltro === "all") return records;
  const target = normalizeText(mappaTipoFiltro);
  return records.filter((record) => normalizeText(record.tipologia || "Location") === target);
}
function renderMappa(_0) {
  return __async(this, arguments, function* (selectedName) {
    const el = document.getElementById("mappa-content");
    if (!el) return;
    if (arguments.length) mappaSelectedLocationName = selectedName || null;
    el.innerHTML = '<div class="loading">Caricamento\u2026</div>';
    if (!lezioniCache) yield loadLezioni(true);
    yield loadLocations();
    const records = mappaLocationRecords();
    const types = ["all", ...new Set(records.map((record) => record.tipologia || "Location"))];
    if (mappaTipoFiltro !== "all" && !types.some((t) => normalizeText(t) === normalizeText(mappaTipoFiltro))) mappaTipoFiltro = "all";
    const visibleRecords = mappaVisibleRecords(records);
    const selected = records.find((record) => normalizeText(record.nome) === normalizeText(mappaSelectedLocationName)) || null;
    const selectedCoords = (selected == null ? void 0 : selected.coords) || null;
    const placedCount = records.filter((record) => record.coords).length;
    const inferredCount = records.filter((record) => {
      var _a2;
      return ((_a2 = record.coords) == null ? void 0 : _a2.source) === "stimato";
    }).length;
    const pendingCount = Math.max(0, records.length - placedCount);
    const formTipologia = (selected == null ? void 0 : selected.tipologia) || "Location";
    const selectedEditable = !selected || canEditLocation(selected);
    const selectedDisabledAttr = selectedEditable ? "" : " disabled";
    el.innerHTML = `
    <div class="map-shell">
      <div class="map-canvas-panel">
        <div class="map-canvas-head">
          <div class="map-canvas-title">
            <strong>Milano operativa</strong>
            <span>Mappa quartieri ricolorata con la palette del gestionale. Clicca sulla mappa per impostare il punto.</span>
          </div>
          <div class="map-filter-row">
            ${types.map((type) => `<button type="button" class="chip${normalizeText(type) === normalizeText(mappaTipoFiltro) ? " chip-on" : ""}" onclick="setMappaFiltro(${jsArg(type)})">${esc(type === "all" ? "Tutte" : type)}</button>`).join("")}
          </div>
        </div>
        <div class="map-canvas-wrap">${renderMilanoMapSvg(visibleRecords, mappaSelectedLocationName)}</div>
      </div>

      <div class="map-side">
        <div class="map-panel">
          <h3>${selected ? "Modifica punto" : "Nuovo punto"}</h3>
          <div class="map-stat-row">
            <div class="map-stat"><strong>${records.length}</strong><span>Punti</span></div>
            <div class="map-stat"><strong>${placedCount}</strong><span>In mappa</span></div>
            <div class="map-stat"><strong>${inferredCount}</strong><span>Stimate</span></div>
          </div>
          <div id="map-status" class="msg"></div>
          <input type="hidden" id="map-loc-original" value="${esc((selected == null ? void 0 : selected.nome) || "")}">
          <div class="map-form-grid">
            <div class="field map-form-full"><label>Nome</label><input id="map-loc-nome" value="${esc((selected == null ? void 0 : selected.nome) || "")}" placeholder="Es. Pista Portello"${selectedDisabledAttr}></div>
            <div class="field">
              <label>Categoria</label>
              <select id="map-loc-tipologia"${selectedDisabledAttr}>
                ${locationCategoryOptions(formTipologia)}
              </select>
            </div>
            <div class="field"><label>Indirizzo / zona</label><input id="map-loc-indirizzo" value="${esc((selected == null ? void 0 : selected.indirizzo) || "")}" placeholder="Via, quartiere, comune"${selectedDisabledAttr}></div>
            <div class="field"><label>Latitudine</label><input id="map-loc-latitudine" value="${selectedCoords ? esc(formatMapCoordinate(selectedCoords.lat)) : ""}" placeholder="45.46420" inputmode="decimal"${selectedDisabledAttr}></div>
            <div class="field"><label>Longitudine</label><input id="map-loc-longitudine" value="${selectedCoords ? esc(formatMapCoordinate(selectedCoords.lng)) : ""}" placeholder="9.19000" inputmode="decimal"${selectedDisabledAttr}></div>
            <div class="field map-form-full"><label>Note</label><textarea id="map-loc-note" placeholder="Accesso, superficie, riferimenti..."${selectedDisabledAttr}>${esc((selected == null ? void 0 : selected.note) || "")}</textarea></div>
          </div>
          <label style="display:flex;align-items:center;gap:.5rem;margin:.2rem 0 .75rem;color:var(--muted);font-size:.86rem;font-weight:700">
            <input type="checkbox" id="map-loc-condivisa" ${(selected == null ? void 0 : selected.condivisa) ? "checked" : ""}${selectedDisabledAttr}>
            Condivisa con altri maestri
          </label>
          <div class="map-panel-meta">${(selectedCoords == null ? void 0 : selectedCoords.source) === "stimato" ? "Coordinate stimate dal nome/indirizzo: salva il punto se la posizione e corretta." : "Per aggiungere o spostare un punto: seleziona la location, clicca sulla mappa e salva."}</div>
          <div class="map-form-actions">
            ${selectedEditable ? '<button class="btn btn-primary btn-sm" onclick="salvaMappaLocation()">Salva punto</button>' : ""}
            <button class="btn btn-outline btn-sm" onclick="preparaNuovaMappaLocation()">Nuovo</button>
            ${selected ? selected.source === "allievo-casa" ? `<button class="btn btn-outline btn-sm" onclick="loadScheda(${jsArg(selected.allievo_id)})">Allievo</button>` : `<button class="btn btn-outline btn-sm" onclick="showView('location',${jsArg(selected.nome)})">Scheda</button>` : ""}
          </div>
        </div>

        <div class="map-panel">
          <h3>Punti</h3>
          <div class="map-list">
            ${visibleRecords.length ? visibleRecords.map((record) => {
      var _a2;
      const selectedRow = normalizeText(record.nome) === normalizeText(mappaSelectedLocationName);
      const meta = [record.tipologia || "Location", record.indirizzo || "", record.condivisa ? "condivisa" : "", record.lessonCount ? `${record.lessonCount} lezion${record.lessonCount === 1 ? "e" : "i"}` : ""].filter(Boolean).join(" \xB7 ");
      const coordLabel = ((_a2 = record.coords) == null ? void 0 : _a2.source) === "stimato" ? "Stimato" : record.coords ? "Salvato" : "Da posizionare";
      return `<button type="button" class="map-location-row${selectedRow ? " is-selected" : ""}" onclick="selectMappaLocation(${jsArg(record.nome)})">
                <span><strong>${esc(record.nome)}</strong><br><span>${esc(meta || "Nessun dettaglio")}</span></span>
                <span class="${record.coords && record.coords.source !== "stimato" ? "" : "map-missing"}">${esc(coordLabel)}</span>
              </button>`;
    }).join("") : '<div class="map-empty-inline">Nessuna location per questo filtro.</div>'}
          </div>
        </div>
      </div>
    </div>`;
  });
}
function setMappaStatus(message, className = "msg-info") {
  const status = document.getElementById("map-status");
  if (!status) return;
  status.textContent = message;
  status.className = `msg ${className} show`;
}
function setMappaFiltro(tipologia) {
  mappaTipoFiltro = tipologia || "all";
  renderMappa();
}
function selectMappaLocation(nome) {
  mappaSelectedLocationName = nome || null;
  renderMappa(mappaSelectedLocationName);
}
function preparaNuovaMappaLocation() {
  mappaSelectedLocationName = null;
  if (visibleViewName() !== "mappa") showView("mappa");
  else renderMappa(null);
  setTimeout(() => {
    var _a2;
    return (_a2 = document.getElementById("map-loc-nome")) == null ? void 0 : _a2.focus();
  }, 80);
}
function handleMappaClick(event) {
  var _a2, _b2;
  if ((_b2 = (_a2 = event.target).closest) == null ? void 0 : _b2.call(_a2, ".map-location-point")) return;
  const svg = event.currentTarget;
  if (!(svg == null ? void 0 : svg.createSVGPoint)) return;
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return;
  const local = point.matrixTransform(ctm.inverse());
  const x = Math.max(0, Math.min(MILANO_MAP_VIEWBOX.width, local.x));
  const y = Math.max(0, Math.min(MILANO_MAP_VIEWBOX.height, local.y));
  const coords = mappaCoordFromPoint(x, y);
  const latInput = document.getElementById("map-loc-latitudine");
  const lngInput = document.getElementById("map-loc-longitudine");
  if (latInput) latInput.value = formatMapCoordinate(coords.lat);
  if (lngInput) lngInput.value = formatMapCoordinate(coords.lng);
  setMappaStatus("Coordinate impostate. Salva il punto per renderlo visibile nella mappa.", "msg-info");
}
function salvaMappaLocation() {
  return __async(this, null, function* () {
    var _a2, _b2, _c, _d, _e, _f, _g;
    const nome = (_a2 = document.getElementById("map-loc-nome")) == null ? void 0 : _a2.value.trim();
    const originalName = ((_b2 = document.getElementById("map-loc-original")) == null ? void 0 : _b2.value.trim()) || nome;
    if (!nome) {
      setMappaStatus("Inserisci il nome della location.", "msg-err");
      return;
    }
    const coords = readCoordinateInputs("map-loc-latitudine", "map-loc-longitudine");
    if (coords.error) {
      setMappaStatus(coords.error, "msg-err");
      return;
    }
    const payload = buildLocationPayload({
      nome,
      tipologia: ((_c = document.getElementById("map-loc-tipologia")) == null ? void 0 : _c.value) || "Location",
      indirizzo: ((_d = document.getElementById("map-loc-indirizzo")) == null ? void 0 : _d.value.trim()) || null,
      note: ((_e = document.getElementById("map-loc-note")) == null ? void 0 : _e.value.trim()) || null,
      latitudine: coords.lat,
      longitudine: coords.lng,
      condivisa: ((_f = document.getElementById("map-loc-condivisa")) == null ? void 0 : _f.checked) || false
    });
    setMappaStatus("Salvataggio...", "msg-info");
    const result = yield persistLocationPayload(payload, originalName);
    if (!result.ok) {
      setMappaStatus(((_g = result.error) == null ? void 0 : _g.message) || "Errore salvataggio location.", "msg-err");
      return;
    }
    luoghiLezioneCache.clear();
    logModificaLocale("location", nome, "Aggiornato punto mappa");
    renderDashboard();
    yield renderMappa(nome);
    setMappaStatus(
      result.localOnly ? "Punto salvato localmente. Per salvarlo nel DB applica la migrazione locations." : result.mapCoordsLocal ? "Punto salvato. Coordinate salvate localmente: applica la migrazione mappa per condividerle." : "Punto salvato in mappa.",
      result.localOnly || result.mapCoordsLocal ? "msg-info" : "msg-ok"
    );
  });
}
function salvaLocation(originalName) {
  return __async(this, null, function* () {
    var _a2, _b2, _c, _d, _e, _f;
    const status = document.getElementById("location-status");
    const nome = (_a2 = document.getElementById("loc-nome")) == null ? void 0 : _a2.value.trim();
    if (!nome) {
      if (status) {
        status.textContent = "Inserisci il nome della location.";
        status.className = "msg msg-err show";
      }
      return;
    }
    const coords = readCoordinateInputs("loc-latitudine", "loc-longitudine");
    if (coords.error) {
      if (status) {
        status.textContent = coords.error;
        status.className = "msg msg-err show";
      }
      return;
    }
    const payload = buildLocationPayload({
      nome,
      tipologia: ((_b2 = document.getElementById("loc-tipologia")) == null ? void 0 : _b2.value) || "Location",
      indirizzo: ((_c = document.getElementById("loc-indirizzo")) == null ? void 0 : _c.value.trim()) || null,
      note: ((_d = document.getElementById("loc-note")) == null ? void 0 : _d.value.trim()) || null,
      latitudine: coords.lat,
      longitudine: coords.lng,
      condivisa: ((_e = document.getElementById("loc-condivisa")) == null ? void 0 : _e.checked) || false
    });
    if (status) {
      status.textContent = "Salvataggio...";
      status.className = "msg msg-info show";
    }
    const result = yield persistLocationPayload(payload, originalName);
    if (!result.ok) {
      if (status) {
        status.textContent = ((_f = result.error) == null ? void 0 : _f.message) || "Errore salvataggio location.";
        status.className = "msg msg-err show";
      }
      return;
    }
    luoghiLezioneCache.clear();
    logModificaLocale("location", nome, "Aggiornata location");
    if (status) {
      status.textContent = result.localOnly ? "Salvata localmente. Per salvarla nel DB applica la migrazione locations." : result.mapCoordsLocal ? "Location salvata. Coordinate salvate localmente: applica la migrazione mappa per renderle condivise." : "Location salvata.";
      status.className = result.localOnly || result.mapCoordsLocal ? "msg msg-info show" : "msg msg-ok show";
    }
    renderDashboard();
  });
}
function ensureLocationDaLezione(_0) {
  return __async(this, arguments, function* (luogo, allieviIds = []) {
    const nome = String(luogo || "").trim();
    if (!nome || locationRecordByName(nome)) return;
    const linked = allieviIds.length === 1 ? allAllievi.find((a) => a.id === allieviIds[0]) : null;
    const payload = {
      nome,
      tipologia: linked && /casa|home|abitazione/i.test(nome) ? "Casa allievo" : "Location",
      indirizzo: linked ? visibleAllievoAddress(linked).indirizzo || null : null,
      allievo_id: (linked == null ? void 0 : linked.id) || null,
      maestro_id: currentUid || null,
      condivisa: false,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const result = yield persistLocationPayload(payload);
    const error = result.ok ? null : result.error;
    if (error) {
      const text = `${error.message || ""} ${error.details || ""} ${error.hint || ""}`;
      if (/locations|schema cache|does not exist|could not find/i.test(text)) {
        const local = JSON.parse(safeStorage.getItem("locationsLocal") || "[]").filter((l) => !localLocationMatches(l, payload, nome));
        local.push(payload);
        safeStorage.setItem("locationsLocal", JSON.stringify(local));
        allLocations = local;
        locationsLoaded = true;
      }
      return;
    }
    yield loadLocations(true);
  });
}
function apriSchedaAllievoDaLezione(allievoId) {
  return __async(this, null, function* () {
    lezioneBackAllievoId = allievoId || null;
    lezioneBackGruppoNome = null;
    yield loadScheda(allievoId);
    switchSchedaTab("lezioni");
  });
}
function tornaDaLezione() {
  return __async(this, null, function* () {
    if (lezioneBackAllievoId) {
      const id = lezioneBackAllievoId;
      yield loadScheda(id);
      switchSchedaTab("lezioni");
      return;
    }
    if (lezioneBackGruppoNome) {
      showView("gruppo", lezioneBackGruppoNome);
      return;
    }
    showView("lezioni");
  });
}
function lezioneBackLabel() {
  if (lezioneBackAllievoId) return "\u2190 Scheda allievo";
  if (lezioneBackGruppoNome) return "\u2190 Scheda gruppo";
  return "\u2190 Lezioni";
}
function allieviAttivi() {
  return allAllievi.filter((a) => a.stato !== "archiviato");
}
function gruppiEsistenti() {
  return [...new Set(allieviAttivi().map((a) => a.gruppo).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}
function maestroLabel(id) {
  if (!id) return "Non assegnati";
  if (id === currentUid) return "Il mio account";
  return "Account " + id.slice(0, 8);
}
function allieviVisibiliGod() {
  if (!isSuperMaestro() || !godMode || godScope === "all") return allAllievi;
  if (godScope === "mine") return allAllievi.filter((a) => a.maestro_id === currentUid);
  if (godScope === "unassigned") return allAllievi.filter((a) => !a.maestro_id);
  if (godScope.startsWith("maestro:")) {
    const id = godScope.slice("maestro:".length);
    return allAllievi.filter((a) => a.maestro_id === id);
  }
  return allAllievi;
}
function ordinaAllieviLista(lista) {
  return [...lista].sort((a, b) => {
    if (!!a.vip !== !!b.vip) return a.vip ? -1 : 1;
    return String(a.nome || "").localeCompare(String(b.nome || ""), "it", { sensitivity: "base" }) || String(a.cognome || "").localeCompare(String(b.cognome || ""), "it", { sensitivity: "base" }) || String(a.nickname || "").localeCompare(String(b.nickname || ""), "it", { sensitivity: "base" });
  });
}
function jsArg(value) {
  return esc(JSON.stringify(value));
}
function scheduleGlobalSearch() {
  clearTimeout(globalSearchTimer);
  globalSearchTimer = setTimeout(renderGlobalSearch, 120);
}
function renderGlobalSearch() {
  return __async(this, null, function* () {
    const input = document.getElementById("global-search-input");
    const panel = document.getElementById("global-search-panel");
    if (!input || !panel) return;
    const query = normalizeText(input.value || "");
    if (!query) {
      panel.hidden = true;
      panel.innerHTML = "";
      return;
    }
    if (!lezioniCache) yield loadLezioni(true);
    yield loadLocations();
    const results = [];
    allieviVisibiliGod().forEach((a) => {
      var _a2, _b2, _c;
      const name = allievoDisplayName(a.id);
      const address = visibleAllievoAddress(a);
      const haystack = normalizeText([name, a.nome, a.cognome, a.nickname, a.gruppo, a.email, a.telefono, a.note_generali, (_a2 = a.profilo) == null ? void 0 : _a2.note_salute, address.indirizzo, address.casa, (_b2 = a.profilo) == null ? void 0 : _b2.luogo_incontro].filter(Boolean).join(" "));
      if (haystack.includes(query)) results.push({ type: "Allievo", title: name, detail: a.gruppo || ((_c = a.profilo) == null ? void 0 : _c.luogo_incontro) || "", action: `loadScheda('${a.id}')` });
    });
    gruppiEsistenti().forEach((gruppo) => {
      if (normalizeText(gruppo).includes(query)) results.push({ type: "Gruppo", title: gruppo, detail: `${gruppoMembri(gruppo).length} allievi`, action: `showView('gruppo',${jsArg(gruppo)})` });
    });
    allSkills.forEach((skill) => {
      const haystack = normalizeText([skill.nome, skill.ramo, skill.blocco, skill.descrizione].filter(Boolean).join(" "));
      if (haystack.includes(query)) results.push({ type: "Skill", title: skill.nome, detail: skillMetaLabel(skill), action: `openSkillDetailModal('${skill.id}')` });
    });
    locationNamesFromLessons().forEach((nome) => {
      const rec = locationRecordByName(nome);
      const haystack = normalizeText([nome, rec == null ? void 0 : rec.indirizzo, rec == null ? void 0 : rec.tipologia, rec == null ? void 0 : rec.note].filter(Boolean).join(" "));
      if (haystack.includes(query)) results.push({ type: "Location", title: nome, detail: [rec == null ? void 0 : rec.tipologia, rec == null ? void 0 : rec.indirizzo].filter(Boolean).join(" \xB7 "), action: `openLocation(${jsArg(nome)})` });
    });
    (lezioniCache || []).forEach((l) => {
      const parsed = lessonParsedNotes(l);
      const haystack = normalizeText([formatDate(l.data), labelPartecipantiLezione(l), l.luogo, parsed.meteo, lessonSpecialNotes(l), parsed.bene, parsed.nonFatto, parsed.note].filter(Boolean).join(" "));
      if (haystack.includes(query)) results.push({ type: lessonStatus(l) === "aperta" ? "Lezione aperta" : "Lezione", title: `${formatDate(l.data)} \xB7 ${labelPartecipantiLezione(l)}`, detail: l.luogo || parsed.note || "", action: `openLezione(${jsArg(l.id)})` });
    });
    const limited = results.slice(0, 12);
    panel.innerHTML = limited.length ? limited.map((r) => `<button type="button" class="search-result" onclick="closeGlobalSearch(); ${r.action}"><strong>${esc(r.title)}</strong><span>${esc(r.type)}${r.detail ? ` \xB7 ${esc(r.detail)}` : ""}</span></button>`).join("") : '<div class="place-suggest-empty">Nessun risultato.</div>';
    panel.hidden = false;
  });
}
function closeGlobalSearch() {
  const panel = document.getElementById("global-search-panel");
  if (panel) panel.hidden = true;
}
function toggleActionMenu(id, event) {
  var _a2, _b2;
  event == null ? void 0 : event.stopPropagation();
  document.querySelectorAll(".inline-action-panel").forEach((panel2) => {
    if (panel2.id !== id) panel2.hidden = true;
  });
  document.querySelectorAll(".inline-action-menu.action-menu-open, .card.action-menu-open").forEach((el) => el.classList.remove("action-menu-open"));
  const panel = document.getElementById(id);
  if (panel) {
    panel.hidden = !panel.hidden;
    if (!panel.hidden) {
      (_a2 = panel.closest(".inline-action-menu")) == null ? void 0 : _a2.classList.add("action-menu-open");
      (_b2 = panel.closest(".card")) == null ? void 0 : _b2.classList.add("action-menu-open");
    }
  }
}
document.addEventListener("click", () => {
  document.querySelectorAll(".inline-action-panel").forEach((panel) => {
    panel.hidden = true;
  });
  document.querySelectorAll(".inline-action-menu.action-menu-open, .card.action-menu-open").forEach((el) => el.classList.remove("action-menu-open"));
  closeGlobalSearch();
});
function formatDateTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return formatDate(String(value).slice(0, 10));
  return d.toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" });
}
function allievoUpdatedAt(allievo) {
  return (allievo == null ? void 0 : allievo.aggiornato_il) || (allievo == null ? void 0 : allievo.updated_at) || (allievo == null ? void 0 : allievo.modified_at) || (allievo == null ? void 0 : allievo.creato_il) || "";
}
function modificaKey() {
  return "bladingManagerModifiche";
}
function logModificaLocale(tipo, id, descrizione) {
  var _a2, _b2, _c;
  if (!id) return;
  let rows = [];
  try {
    rows = JSON.parse(safeStorage.getItem(modificaKey()) || "[]") || [];
  } catch (e) {
    rows = [];
  }
  rows.unshift({ tipo, id, descrizione, quando: (/* @__PURE__ */ new Date()).toISOString(), utente: currentEmail || "" });
  safeStorage.setItem(modificaKey(), JSON.stringify(rows.slice(0, 200)));
  (_c = (_b2 = (_a2 = sb == null ? void 0 : sb.from) == null ? void 0 : _a2.call(sb, "modifiche_storico")) == null ? void 0 : _b2.insert) == null ? void 0 : _c.call(_b2, { tipo, entity_id: String(id), descrizione, maestro_id: currentUid || null }).then(({ error }) => {
    if (error && !/modifiche_storico|schema cache|does not exist|could not find/i.test(error.message || error.details || error.hint || "")) console.warn("Storico modifica non salvato nel DB", error);
  });
}
function modificheLocali(tipo, id) {
  try {
    return (JSON.parse(safeStorage.getItem(modificaKey()) || "[]") || []).filter((row) => row.tipo === tipo && String(row.id) === String(id));
  } catch (e) {
    return [];
  }
}
function valueForHistory(value) {
  if (value === null || value === void 0 || value === "") return "";
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
function historyChangedFields(previous = {}, next = {}, labels = {}) {
  return Object.entries(labels).flatMap(([key, label]) => {
    return valueForHistory(previous == null ? void 0 : previous[key]) === valueForHistory(next == null ? void 0 : next[key]) ? [] : [label];
  });
}
function historyDescription(base, changes = [], fallback = "dettagli") {
  return changes.length ? `${base}: ${changes.join(", ")}` : `${base}: ${fallback}`;
}
function openHistoryModal(tipo, id, title = "Storico modifiche") {
  const rows = modificheLocali(tipo, id);
  const existing = document.getElementById("modal-history");
  if (existing) existing.remove();
  const overlay = document.createElement("div");
  overlay.id = "modal-history";
  overlay.className = "overlay";
  overlay.onclick = (event) => {
    if (event.target === overlay) overlay.remove();
  };
  overlay.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()">
      <h3>${esc(title)}</h3>
      <div style="display:grid;gap:.45rem">
        ${rows.length ? rows.map((row) => `<div class="skill-detail-item"><strong>${esc(row.descrizione || "Modifica")}</strong><span>${esc(formatDateTime(row.quando))}${row.utente ? ` \xB7 ${esc(row.utente)}` : ""}</span></div>`).join("") : '<div class="empty">Nessuna modifica registrata in locale.</div>'}
      </div>
      <div class="modal-footer"><button class="btn btn-outline" onclick="var modal=document.getElementById('modal-history'); if(modal) modal.remove()">Chiudi</button></div>
    </div>`;
  document.body.appendChild(overlay);
}
function setLessonStatus(status) {
  var _a2, _b2;
  const value = status === "chiusa" ? "chiusa" : "aperta";
  const input = document.getElementById("lz-stato");
  if (input) input.value = value;
  (_a2 = document.getElementById("lz-status-open")) == null ? void 0 : _a2.classList.toggle("is-on", value === "aperta");
  (_b2 = document.getElementById("lz-status-done")) == null ? void 0 : _b2.classList.toggle("is-on", value === "chiusa");
  syncLessonFeedbackVisibility();
}
function lessonStatus(lezione) {
  const explicit = String((lezione == null ? void 0 : lezione.stato) || (lezione == null ? void 0 : lezione.status) || splitLessonNotes((lezione == null ? void 0 : lezione.note) || "").stato || "").toLowerCase();
  if (explicit === "aperta") return "aperta";
  return "chiusa";
}
const LESSON_CHECK_MARKERS = {
  stato: "[[stato]]",
  meteo: "[[meteo]]",
  speciali: "[[note_speciali]]",
  bene: "[[check_bene]]",
  nonFatto: "[[check_non_fatto]]",
  note: "[[note]]"
};
function splitLessonNotes(raw = "") {
  const text = String(raw || "");
  const hasMarkers = Object.values(LESSON_CHECK_MARKERS).some((marker) => text.includes(marker));
  if (!hasMarkers) return { bene: "", nonFatto: "", note: text };
  const markerEntries = Object.entries(LESSON_CHECK_MARKERS);
  const read = (key) => {
    const start = LESSON_CHECK_MARKERS[key];
    const from = text.indexOf(start);
    if (from < 0) return "";
    const after = from + start.length;
    const nextMarkerIndex = markerEntries.filter(([nextKey]) => nextKey !== key).map(([, marker]) => text.indexOf(marker, after)).filter((index) => index >= 0).sort((a, b) => a - b)[0];
    return text.slice(after, nextMarkerIndex != null ? nextMarkerIndex : text.length).trim();
  };
  return {
    stato: read("stato"),
    meteo: read("meteo"),
    speciali: read("speciali"),
    bene: read("bene"),
    nonFatto: read("nonFatto"),
    note: read("note")
  };
}
function composeLessonNotes(note, bene, nonFatto, speciali = "", stato = "", meteo = "") {
  if (!bene && !nonFatto && !speciali && !stato && !meteo) return note || null;
  return [
    LESSON_CHECK_MARKERS.stato,
    stato || "",
    LESSON_CHECK_MARKERS.meteo,
    meteo || "",
    LESSON_CHECK_MARKERS.speciali,
    speciali || "",
    LESSON_CHECK_MARKERS.bene,
    bene || "",
    LESSON_CHECK_MARKERS.nonFatto,
    nonFatto || "",
    LESSON_CHECK_MARKERS.note,
    note || ""
  ].join("\n").trim();
}
function renderLessonCheckBlocks(lezione) {
  const parsed = lessonParsedNotes(lezione);
  return [
    parsed.bene ? `<p class="sec-title">Cosa e andato bene</p><div class="card"><div class="lezione-read-note">${esc(parsed.bene)}</div></div>` : "",
    parsed.nonFatto ? `<p class="sec-title">Non fatto / da riprendere</p><div class="card"><div class="lezione-read-note">${esc(parsed.nonFatto)}</div></div>` : ""
  ].join("");
}
function lessonParsedNotes(lezione) {
  const parsed = splitLessonNotes((lezione == null ? void 0 : lezione.note) || "");
  return __spreadProps(__spreadValues({}, parsed), {
    meteo: (lezione == null ? void 0 : lezione.meteo) || parsed.meteo || "",
    bene: (lezione == null ? void 0 : lezione.check_bene) || parsed.bene || "",
    nonFatto: (lezione == null ? void 0 : lezione.check_non_fatto) || parsed.nonFatto || ""
  });
}
function lessonSpecialNotes(lezione) {
  const parsed = lessonParsedNotes(lezione);
  return (lezione == null ? void 0 : lezione.note_speciali) || parsed.speciali || (lezione == null ? void 0 : lezione.nota_speciale) || (lezione == null ? void 0 : lezione.nota) || "";
}
function renderGodPanel() {
  const panel = document.getElementById("god-panel");
  const toggle = document.getElementById("god-toggle");
  const sel = document.getElementById("god-account-select");
  const canUseGodMode = isSuperMaestro();
  if (toggle) toggle.hidden = !canUseGodMode;
  if (!canUseGodMode) {
    godMode = false;
    godScope = "all";
  }
  syncGodOnlyNav();
  panel.classList.toggle("show", godMode);
  toggle.classList.toggle("on", godMode);
  if (!godMode || !sel) return;
  const ids = [...new Set(allAllievi.map((a) => a.maestro_id).filter(Boolean))].sort();
  sel.innerHTML = `
    <option value="all">Tutti leggibili (${allAllievi.length})</option>
    <option value="mine">Il mio account (${allAllievi.filter((a) => a.maestro_id === currentUid).length})</option>
    <option value="unassigned">Non assegnati (${allAllievi.filter((a) => !a.maestro_id).length})</option>
    ${ids.filter((id) => id !== currentUid).map((id) => `<option value="maestro:${id}">${maestroLabel(id)} (${allAllievi.filter((a) => a.maestro_id === id).length})</option>`).join("")}`;
  sel.value = [...sel.options].some((o) => o.value === godScope) ? godScope : "all";
  godScope = sel.value;
}
function syncGodOnlyNav() {
  document.querySelectorAll(".god-only-nav").forEach((el) => {
    el.hidden = true;
  });
}
function toggleGodMode() {
  if (!isSuperMaestro()) return;
  godMode = !godMode;
  if (!godMode) godScope = "all";
  renderGodPanel();
  if (!godMode && ["tuning", "app-notes"].includes(visibleViewName())) showView("allievi");
  renderAllievi();
  if (!document.getElementById("view-lezioni").hidden) loadLezioni();
}
function isMissingAppNotesTableError(error) {
  const text = `${(error == null ? void 0 : error.message) || ""} ${(error == null ? void 0 : error.details) || ""} ${(error == null ? void 0 : error.hint) || ""} ${(error == null ? void 0 : error.code) || ""}`;
  return /app_notes|schema cache|could not find|does not exist|PGRST205|42P01/i.test(text);
}
function appNotesMissingTableMessage() {
  return "Note salvate solo su questo dispositivo: manca la tabella online app_notes in Supabase.";
}
function initAppNotes() {
  return __async(this, null, function* () {
    const textarea = document.getElementById("app-notes-text");
    const status = document.getElementById("app-notes-status");
    if (!textarea) return;
    const localValue = safeStorage.getItem(APP_NOTES_KEY) || "";
    textarea.value = localValue;
    if (status) {
      status.className = "msg";
      status.textContent = "";
    }
    if (!sb) return;
    setAppNotesStatus("Carico note online...", "msg-info");
    const { data, error } = yield sb.from("app_notes").select("content, updated_at, updated_by").eq("key", APP_NOTES_REMOTE_KEY).maybeSingle();
    if (error) {
      appNotesRemoteAvailable = false;
      if (isMissingAppNotesTableError(error)) {
        setAppNotesStatus(appNotesMissingTableMessage(), "msg-info");
      } else {
        setAppNotesStatus(`Note locali caricate. Errore lettura online: ${error.message || "sconosciuto"}`, "msg-err");
      }
      return;
    }
    appNotesRemoteAvailable = true;
    if ((data == null ? void 0 : data.content) !== void 0 && (data == null ? void 0 : data.content) !== null) {
      textarea.value = data.content;
      safeStorage.setItem(APP_NOTES_KEY, data.content);
      const updated = data.updated_at ? ` Aggiornate: ${formatDateWithWeekday(data.updated_at)}` : "";
      setAppNotesStatus(`Note online caricate.${updated}`, "msg-ok");
    } else if (localValue) {
      setAppNotesStatus("Nessuna nota online: resta pronta la copia locale. Premi Salva note per pubblicarla.", "msg-info");
    } else {
      setAppNotesStatus("", "msg-ok");
    }
  });
}
function setAppNotesStatus(text, cls = "msg-ok") {
  const status = document.getElementById("app-notes-status");
  if (!status) return;
  status.className = `msg ${cls}${text ? " show" : ""}`;
  status.textContent = text;
}
function saveAppNotes() {
  return __async(this, null, function* () {
    const textarea = document.getElementById("app-notes-text");
    if (!textarea) return;
    const content = textarea.value || "";
    safeStorage.setItem(APP_NOTES_KEY, content);
    if (!sb) {
      setAppNotesStatus("Note salvate localmente. Supabase non disponibile.", "msg-info");
      return;
    }
    setAppNotesStatus("Salvataggio note online...", "msg-info");
    const payload = {
      key: APP_NOTES_REMOTE_KEY,
      content,
      updated_by: currentUid || null,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const { error } = yield sb.from("app_notes").upsert(payload, { onConflict: "key" });
    if (error) {
      appNotesRemoteAvailable = false;
      if (isMissingAppNotesTableError(error)) {
        setAppNotesStatus(appNotesMissingTableMessage(), "msg-info");
      } else {
        setAppNotesStatus(`Note salvate localmente. Errore online: ${error.message || "sconosciuto"}`, "msg-err");
      }
      return;
    }
    appNotesRemoteAvailable = true;
    setAppNotesStatus("Note salvate online.", "msg-ok");
  });
}
function scheduleAppNotesSave() {
  clearTimeout(appNotesTimer);
  appNotesTimer = setTimeout(saveAppNotes, 450);
}
function setGodScope(scope) {
  godScope = scope;
  renderAllievi();
  if (!document.getElementById("view-lezioni").hidden) loadLezioni();
}
function renderAllievi() {
  const el = document.getElementById("allievi-content");
  renderDashboard();
  const baseLista = allieviVisibiliGod();
  if (!baseLista.length) {
    el.innerHTML = mostraArchiviati ? '<div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.85rem;justify-content:flex-end"><button type="button" onclick="mostraTuttiAllievi()" class="chip">Tutti</button><button type="button" onclick="setArchivio(true)" class="chip chip-on">Archivio</button></div><div class="empty">Nessun allievo archiviato.</div>' : '<div class="empty">Nessun allievo ancora.<br>Premi "+ Nuovo allievo" per iniziare.</div>';
    return;
  }
  const gruppi = [...new Set(baseLista.map((a) => a.gruppo).filter(Boolean))].sort();
  const mostraToggleGruppi = !mostraArchiviati && filtroGruppo === null && gruppi.length > 0;
  const tuttiGruppiEspansi = mostraToggleGruppi && gruppi.every((g) => gruppiEspansi.has(g));
  const chipsHtml = `
    <div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.85rem;align-items:center">
      <button type="button" onclick="mostraTuttiAllievi()" class="chip${!mostraArchiviati && filtroGruppo === null ? " chip-on" : ""}">Tutti</button>
      ${gruppi.map((g) => `<button type="button" onclick="setFiltroGruppo('${g.replace(/'/g, "\\'")}')" class="chip${filtroGruppo === g ? " chip-on" : ""}">${esc(g)}</button>`).join("")}
      ${mostraToggleGruppi ? `<button type="button" onclick="toggleTuttiGruppi()" class="chip" title="${tuttiGruppiEspansi ? "Raggruppa tutti i gruppi" : "Espandi tutti i gruppi"}">${tuttiGruppiEspansi ? "\u25B4 Raggruppa" : "\u25BE Espandi"}</button>` : ""}
      <button type="button" onclick="setArchivio(true)" class="chip${mostraArchiviati ? " chip-on" : ""}" style="margin-left:auto">Archivio</button>
    </div>`;
  const lista = ordinaAllieviLista(filtroGruppo ? baseLista.filter((a) => a.gruppo === filtroGruppo) : baseLista);
  const allieviColgroup = `
    <colgroup>
      <col style="width:32px">
      <col style="width:28%">
      <col style="width:19%">
      <col style="width:14%">
      <col style="width:6%">
      <col>
      <col style="width:52px">
    </colgroup>`;
  const renderAllievoRow = (a, extraClass = "") => `
    <tr class="${extraClass}" onclick="loadScheda('${a.id}')" style="${a.stato === "archiviato" ? "opacity:.55" : ""};cursor:pointer">
      <td style="width:28px;text-align:center">${a.vip ? '<span class="vip-star">\u2605</span>' : ""}</td>
      <td>
        <strong>${esc(a.nome)}</strong>
        ${a.tipo === "associazione" ? '<span style="font-size:.7rem;font-weight:700;background:var(--blu-chiaro);color:var(--blu);padding:1px 5px;border-radius:10px;margin-left:4px">ass.</span>' : ""}
        ${a.stato === "archiviato" ? '<span style="font-size:.7rem;font-weight:700;background:rgba(148,163,184,.14);color:var(--muted);padding:1px 5px;border-radius:10px;margin-left:4px">arch.</span>' : ""}
      </td>
      <td>${a.tipo === "associazione" ? "" : esc(a.cognome)}</td>
      <td style="color:var(--muted);font-size:.85rem">${a.nickname ? esc(a.nickname) : ""}</td>
      <td>${a.livello_attuale}</td>
      <td>${esc(a.blocco_attuale)}</td>
      <td style="width:40px;text-align:center">
        <div style="display:flex;justify-content:flex-end;gap:.25rem;flex-wrap:wrap">
          ${godMode && !a.maestro_id ? `<button class="btn btn-ghost btn-sm" title="Assegna a me" onclick="event.stopPropagation(); assegnaAllievoAMe('${a.id}')" style="padding:.2rem .45rem;font-size:.82rem">Assegna</button>` : ""}
          ${godMode ? `<button class="btn btn-ghost btn-sm" title="Condividi" onclick="event.stopPropagation(); apriCondividiAllievo('${a.id}')" style="padding:.2rem .45rem;font-size:.82rem">Condividi</button>` : ""}
          ${godMode && a.gruppo ? `<button class="btn btn-ghost btn-sm" title="Condividi gruppo" onclick="event.stopPropagation(); apriCondividiGruppo('${a.gruppo.replace(/'/g, "\\'")}')" style="padding:.2rem .45rem;font-size:.82rem">Gruppo</button>` : ""}
          ${a.stato !== "archiviato" ? `<button class="btn btn-ghost btn-sm" title="Modifica" onclick="event.stopPropagation(); showView('nuovo-allievo','${a.id}')" style="padding:.2rem .45rem;font-size:1rem">${editIcon()}</button>` : ""}
        </div>
      </td>
    </tr>`;
  if (!filtroGruppo) {
    const senzaGruppo = lista.filter((a) => !a.gruppo);
    const gruppiRows = gruppi.map((gruppo) => {
      const membri = ordinaAllieviLista(lista.filter((a) => a.gruppo === gruppo));
      const expanded = gruppiEspansi.has(gruppo);
      const blocchi = [...new Set(membri.map((a) => a.blocco_attuale).filter(Boolean))].join(", ") || "\u2014";
      return `
        <tr onclick="showView('gruppo',${jsArg(gruppo)})" style="cursor:pointer">
          <td style="width:28px;text-align:center"><span class="group-count">[${membri.length}]</span></td>
          <td><strong>${esc(gruppo)}</strong></td>
          <td></td>
          <td></td>
          <td></td>
          <td>${esc(blocchi)}</td>
          <td style="width:40px;text-align:center">
            <div style="display:flex;justify-content:flex-end;gap:.25rem">
              <button class="btn btn-ghost btn-sm" title="${expanded ? "Compatta membri" : "Espandi membri"}" onclick="event.stopPropagation(); toggleGruppoLista(${jsArg(gruppo)})" style="padding:.2rem .45rem;font-size:.95rem">${expanded ? "\u25B4" : "\u25BE"}</button>
              <button class="btn btn-ghost btn-sm" title="Scheda gruppo" onclick="event.stopPropagation(); showView('gruppo',${jsArg(gruppo)})" style="padding:.2rem .45rem;font-size:1rem">${editIcon()}</button>
            </div>
          </td>
        </tr>
        ${expanded ? membri.map((m, i) => renderAllievoRow(m, [
        "group-member-row",
        i === 0 ? "group-member-first" : "",
        i === membri.length - 1 ? "group-member-last" : ""
      ].filter(Boolean).join(" "))).join("") : ""}`;
    }).join("");
    el.innerHTML = chipsHtml + `
      <div class="table-wrap">
        <table>
          ${allieviColgroup}
          <thead><tr><th></th><th>Nome / gruppo</th><th>Cognome</th><th>Nick</th><th>Lv.</th><th>Blocco</th><th></th></tr></thead>
          <tbody>
            ${senzaGruppo.map(renderAllievoRow).join("")}
            ${gruppiRows}
          </tbody>
        </table>
      </div>`;
    requestAnimationFrame(() => motion.tableRows(el));
    return;
  }
  el.innerHTML = chipsHtml + `
    <div class="table-wrap">
      <table>
        ${allieviColgroup}
        <thead><tr><th></th><th>Nome</th><th>Cognome</th><th>Nick</th><th>Lv.</th><th>Blocco</th><th></th></tr></thead>
        <tbody>
          ${lista.map(renderAllievoRow).join("")}
        </tbody>
      </table>
    </div>`;
  requestAnimationFrame(() => motion.tableRows(el));
}
function setFiltroGruppo(g) {
  filtroGruppo = g;
  if (g === null) gruppiEspansi.clear();
  renderAllievi();
}
function mostraTuttiAllievi() {
  return __async(this, null, function* () {
    const serveRicarica = mostraArchiviati;
    mostraArchiviati = false;
    filtroGruppo = null;
    gruppiEspansi.clear();
    if (serveRicarica) yield ricaricaAllievi();
    else renderAllievi();
  });
}
function toggleGruppoLista(gruppo) {
  if (gruppiEspansi.has(gruppo)) gruppiEspansi.delete(gruppo);
  else gruppiEspansi.add(gruppo);
  renderAllievi();
}
function toggleTuttiGruppi() {
  const gruppi = [...new Set(allieviVisibiliGod().map((a) => a.gruppo).filter(Boolean))].sort();
  const tuttiEspansi = gruppi.length > 0 && gruppi.every((g) => gruppiEspansi.has(g));
  gruppiEspansi.clear();
  if (!tuttiEspansi) gruppi.forEach((g) => gruppiEspansi.add(g));
  renderAllievi();
}
function setArchivio(on) {
  return __async(this, null, function* () {
    if (mostraArchiviati === on) {
      filtroGruppo = null;
      gruppiEspansi.clear();
      renderAllievi();
      return;
    }
    mostraArchiviati = on;
    filtroGruppo = null;
    gruppiEspansi.clear();
    yield ricaricaAllievi();
  });
}
function toggleVip() {
  const btn = document.getElementById("na-vip-btn");
  const inp = document.getElementById("na-vip");
  const isOn = inp.value === "true";
  inp.value = String(!isOn);
  btn.classList.toggle("on", !isOn);
}
function setDot(groupId, val) {
  const g = document.getElementById(groupId);
  if (!g) return;
  g.dataset.val = val;
  g.querySelectorAll(".dot").forEach((d) => d.classList.toggle("filled", parseInt(d.dataset.v) <= val));
}
function initNuovoAllievo(id) {
  var _a2, _b2, _c, _d, _e, _f, _g;
  editingAllieviId = id || null;
  const allievo = id ? allAllievi.find((a) => a.id === id) : null;
  const p = (allievo == null ? void 0 : allievo.profilo) || {};
  const hasGruppo = !!(allievo == null ? void 0 : allievo.gruppo);
  const logisticaIndividuale = logisticaIndividualeProfilo(p, hasGruppo);
  const addressVisible = canViewAllievoAddress(allievo);
  const addressEditable = canEditAllievoAddress(allievo);
  document.getElementById("na-titolo").textContent = allievo ? `Modifica allievo \u2014 ${allievo.nome} ${allievo.cognome}` : "Nuovo allievo";
  const backBtn = document.getElementById("na-back-btn");
  backBtn.onclick = allievo ? () => loadScheda(id) : () => showView("allievi");
  backBtn.textContent = allievo ? "\u2190 Scheda" : "\u2190 Allievi";
  const label = allievo ? "Aggiorna allievo" : "Salva allievo";
  document.getElementById("btn-salva-al").textContent = label;
  document.getElementById("btn-salva-al-top").textContent = label;
  document.getElementById("na-delete-actions").hidden = !allievo;
  document.getElementById("btn-cancella-gruppo-da-allievo").hidden = !(allievo == null ? void 0 : allievo.gruppo);
  document.getElementById("na-err").classList.remove("show");
  setTipoForm("individuale");
  document.getElementById("na-nickname").value = (allievo == null ? void 0 : allievo.nickname) || "";
  document.getElementById("na-nome").value = (allievo == null ? void 0 : allievo.nome) || "";
  document.getElementById("na-cognome").value = (allievo == null ? void 0 : allievo.cognome) || "";
  document.getElementById("na-nascita").value = dateIsoToInput(allievo == null ? void 0 : allievo.data_nascita);
  document.getElementById("na-iscrizione").value = dateIsoToInput(allievo == null ? void 0 : allievo.data_iscrizione);
  document.getElementById("na-email").value = (allievo == null ? void 0 : allievo.email) || "";
  document.getElementById("na-tel").value = (allievo == null ? void 0 : allievo.telefono) || "";
  document.getElementById("na-note").value = (allievo == null ? void 0 : allievo.note_generali) || "";
  document.getElementById("na-blocco").value = (allievo == null ? void 0 : allievo.blocco_attuale) || "Base";
  calcolaEtaForm();
  const vipVal = (allievo == null ? void 0 : allievo.vip) === true;
  document.getElementById("na-vip").value = String(vipVal);
  document.getElementById("na-vip-btn").classList.toggle("on", vipVal);
  const indirizzoInput = document.getElementById("na-indirizzo");
  const casaInput = document.getElementById("na-casa");
  const indirizzoCondivisoInput = document.getElementById("na-indirizzo-condiviso");
  indirizzoInput.value = addressVisible ? p.indirizzo || "" : "";
  casaInput.value = addressVisible ? p.casa || "" : "";
  indirizzoInput.disabled = !addressEditable;
  casaInput.disabled = !addressEditable;
  indirizzoInput.placeholder = addressVisible ? "Es. Milano Nord" : "Privato del maestro proprietario";
  casaInput.placeholder = addressVisible ? "Es. via e civico casa" : "Privato del maestro proprietario";
  indirizzoCondivisoInput.checked = !!p.indirizzo_condiviso;
  indirizzoCondivisoInput.disabled = !addressEditable;
  document.getElementById("na-cultura").value = p.cultura || "";
  document.getElementById("na-note-salute").value = p.note_salute || "";
  document.getElementById("na-cert").value = dateIsoToInput(p.scadenza_cert);
  document.getElementById("na-durata").value = logisticaIndividuale.durata_lezione || "";
  document.getElementById("na-compenso").value = logisticaIndividuale.compenso || "";
  document.getElementById("na-appuntamento").value = logisticaIndividuale.appuntamento || "";
  document.getElementById("na-luogo-incontro").value = logisticaIndividuale.luogo_incontro || "";
  document.getElementById("na-disponibilita").value = p.disponibilita || "";
  document.getElementById("na-competenze").value = p.competenze || "";
  document.getElementById("na-obiettivi").value = p.obiettivi || "";
  document.getElementById("na-talenti").value = p.talenti || "";
  document.getElementById("na-paure").value = p.paure || "";
  document.getElementById("na-sport").value = p.sport || "";
  document.getElementById("na-equip").value = p.equipaggiamento || "";
  const lato = document.getElementById("na-lato");
  if (lato) lato.value = p.lato_dominante || "";
  document.getElementById("ass-gruppo").value = (allievo == null ? void 0 : allievo.gruppo) || "";
  document.getElementById("ass-appuntamento").value = p.appuntamento || "";
  document.getElementById("ass-durata").value = p.durata_lezione || "";
  document.getElementById("ass-luogo").value = p.luogo_incontro || "";
  document.getElementById("ass-nome").value = (allievo == null ? void 0 : allievo.nome) || "";
  document.getElementById("ass-cognome").value = (allievo == null ? void 0 : allievo.cognome) || "";
  document.getElementById("ass-nick").value = (allievo == null ? void 0 : allievo.nickname) || "";
  document.getElementById("ass-note").value = (allievo == null ? void 0 : allievo.note_generali) || "";
  document.getElementById("na-gruppo-cb").checked = hasGruppo;
  document.getElementById("na-gruppo-panel").hidden = !hasGruppo;
  document.getElementById("na-gruppo").value = (allievo == null ? void 0 : allievo.gruppo) || "";
  renderGruppiNuovoAllievo((allievo == null ? void 0 : allievo.gruppo) || "");
  document.getElementById("na-compagni").textContent = "";
  if (hasGruppo) cercaCompagni();
  else renderLogisticaGruppoAllievo();
  const famContainer = document.getElementById("na-familiari");
  famContainer.innerHTML = "";
  (p.familiari || []).forEach((f) => {
    famContainer.appendChild(creaFamiliareRow(f));
  });
  setDot("dot-coord", ((_a2 = p.capacita) == null ? void 0 : _a2.coordinazione) || 0);
  setDot("dot-prop", ((_b2 = p.capacita) == null ? void 0 : _b2.propriocezione) || 0);
  setDot("dot-vel", ((_c = p.capacita) == null ? void 0 : _c.velocita_apprendimento) || 0);
  setDot("dot-bil", ((_d = p.capacita) == null ? void 0 : _d.bilateralita) || 0);
  setDot("dot-visivo", ((_e = p.apprendimento) == null ? void 0 : _e.visivo) || 0);
  setDot("dot-teorico", ((_f = p.apprendimento) == null ? void 0 : _f.teorico) || 0);
  setDot("dot-pratico", ((_g = p.apprendimento) == null ? void 0 : _g.pratico) || 0);
  if (!document.getElementById("view-nuovo-allievo").dataset.dotsInit) {
    document.querySelectorAll("#view-nuovo-allievo .dots-group").forEach((g) => {
      g.querySelectorAll(".dot").forEach((dot) => {
        dot.addEventListener("click", () => {
          const v = parseInt(dot.dataset.v);
          const nv = v === parseInt(g.dataset.val) ? 0 : v;
          g.dataset.val = nv;
          g.querySelectorAll(".dot").forEach((d) => d.classList.toggle("filled", parseInt(d.dataset.v) <= nv));
        });
      });
    });
    document.getElementById("view-nuovo-allievo").dataset.dotsInit = "1";
  }
}
function setTipoForm(tipo) {
  document.getElementById("na-tipo").value = tipo;
  const isAss = tipo === "associazione";
  document.getElementById("form-individuale").hidden = isAss;
  document.getElementById("form-associazione").hidden = !isAss;
}
function toggleGruppo(cb) {
  document.getElementById("na-gruppo-panel").hidden = !cb.checked;
  if (cb.checked) renderGruppiNuovoAllievo(document.getElementById("na-gruppo").value.trim());
  if (!cb.checked) {
    document.getElementById("na-gruppo").value = "";
    document.getElementById("na-compagni").textContent = "";
  }
  renderLogisticaGruppoAllievo();
}
function renderGruppiNuovoAllievo(selected = "") {
  const sel = document.getElementById("na-gruppo-select");
  if (!sel) return;
  const gruppi = gruppiEsistenti();
  const hasSelected = selected && !gruppi.includes(selected);
  sel.innerHTML = `
    <option value="">\u2014 Scegli gruppo \u2014</option>
    ${gruppi.map((g) => `<option value="${esc(g)}">${esc(g)}</option>`).join("")}
    ${hasSelected ? `<option value="${esc(selected)}">${esc(selected)}</option>` : ""}
    <option value="__new__">+ Aggiungi nuovo gruppo</option>`;
  sel.value = selected || "";
}
function setGruppoDaSelect(value) {
  const input = document.getElementById("na-gruppo");
  if (value === "__new__") {
    input.value = "";
    input.focus();
  } else {
    input.value = value;
  }
  cercaCompagni();
  renderLogisticaGruppoAllievo();
}
function cercaCompagni() {
  const gruppo = document.getElementById("na-gruppo").value.trim();
  const el = document.getElementById("na-compagni");
  if (!gruppo) {
    el.textContent = "";
    renderLogisticaGruppoAllievo();
    return;
  }
  const compagni = allAllievi.filter((a) => a.gruppo === gruppo);
  el.textContent = compagni.length ? "Gruppo esistente: " + compagni.map((a) => a.nome + " " + a.cognome).join(", ") : "Nuovo gruppo \u2014 nessun allievo con questo nome ancora.";
  renderLogisticaGruppoAllievo();
}
function renderLogisticaGruppoAllievo() {
  var _a2, _b2;
  const panel = document.getElementById("na-logistica-gruppo-panel");
  if (!panel) return;
  const checked = (_a2 = document.getElementById("na-gruppo-cb")) == null ? void 0 : _a2.checked;
  const gruppo = (_b2 = document.getElementById("na-gruppo")) == null ? void 0 : _b2.value.trim();
  const membri = checked && gruppo ? gruppoMembri(gruppo, { includeArchived: true }) : [];
  const profilo = membri.length ? profiloComuneGruppo(membri) : {};
  const hasLogistica = !!(profilo.appuntamento || profilo.luogo_incontro || profilo.durata_lezione || profilo.compenso || profilo.pagamento_metodo || profilo.pagamento_stato || profilo.pagamento_note);
  if (!checked || !gruppo || !membri.length || !hasLogistica) {
    panel.hidden = true;
    panel.innerHTML = "";
    return;
  }
  const item = (label, value) => value ? `<div class="group-logistics-item"><span>${esc(label)}</span>${esc(String(value))}</div>` : "";
  const pagamento = [profilo.pagamento_metodo, profilo.pagamento_stato].filter(Boolean).join(" \xB7 ");
  panel.hidden = false;
  panel.innerHTML = `
    <div class="group-logistics-title">${esc(gruppo)}</div>
    <div class="group-logistics-grid">
      ${item("Appuntamento", profilo.appuntamento)}
      ${item("Durata", profilo.durata_lezione ? profilo.durata_lezione + " min" : "")}
      ${item("Luogo", profilo.luogo_incontro)}
      ${item("Compenso", profilo.compenso ? "\u20AC " + Number(profilo.compenso).toFixed(2) : "")}
      ${item("Pagamento", pagamento)}
      ${item("Note pagamento", profilo.pagamento_note)}
    </div>`;
}
function aggiungiFamiliare() {
  const container = document.getElementById("na-familiari");
  container.appendChild(creaFamiliareRow());
}
function normalizzaFamiliare(f = {}) {
  let nome = f.nome || "";
  let cognome = f.cognome || "";
  if (nome && !cognome && nome.trim().includes(" ")) {
    const parts = nome.trim().split(/\s+/);
    cognome = parts.pop();
    nome = parts.join(" ");
  }
  return { nome, cognome, relazione: f.relazione || "", telefono: f.telefono || "" };
}
function creaFamiliareRow(f = {}) {
  const container = document.getElementById("na-familiari");
  const data = normalizzaFamiliare(f);
  const n = container.children.length + 1;
  const row = document.createElement("div");
  row.className = "familiare-row familiare-row-contatto";
  row.style.cssText = "align-items:end;position:relative";
  row.innerHTML = `
    <div class="field" style="margin:0"><label>Familiare ${n} \u2014 Nome</label><input type="text" class="fam-nome" placeholder="Nome" value="${esc(data.nome)}"></div>
    <div class="field" style="margin:0"><label>Cognome</label><input type="text" class="fam-cognome" placeholder="Cognome" value="${esc(data.cognome)}"></div>
    <div class="field" style="margin:0"><label>Relazione</label><input type="text" class="fam-relazione" placeholder="Madre, padre..." value="${esc(data.relazione)}"></div>
    <div class="field" style="margin:0;display:grid;grid-template-columns:1fr auto;gap:.3rem;align-items:end">
      <div><label>Telefono</label><input type="tel" class="fam-telefono" placeholder="+39 \u2026" value="${esc(data.telefono)}"></div>
      <button type="button" class="btn btn-ghost btn-sm" style="padding:.4rem .5rem;color:var(--danger)" onclick="this.closest('.familiare-row').remove()">\u2715</button>
    </div>`;
  return row;
}
function cercaLogisticaAssoc() {
  const gruppo = document.getElementById("ass-gruppo").value.trim();
  const hint = document.getElementById("ass-logistica-hint");
  const gruppiHint = document.getElementById("ass-gruppi-hint");
  if (!gruppo) {
    hint.style.display = "none";
    gruppiHint.textContent = "";
    return;
  }
  const esistenti = allAllievi.filter((a) => a.gruppo === gruppo);
  gruppiHint.textContent = esistenti.length ? "Gruppo esistente: " + esistenti.map((a) => `${a.nome} ${a.cognome || ""}`.trim()).join(", ") : "Nuovo gruppo / associazione.";
  const primo = esistenti.find((a) => a.profilo);
  if (!primo) {
    hint.style.display = "none";
    return;
  }
  const p = logisticaGruppoProfilo(primo.profilo || {});
  const assAppuntamento = document.getElementById("ass-appuntamento");
  const assDurata = document.getElementById("ass-durata");
  const assLuogo = document.getElementById("ass-luogo");
  if (!assAppuntamento.value) assAppuntamento.value = p.appuntamento || "";
  if (!assDurata.value) assDurata.value = p.durata_lezione || "";
  if (!assLuogo.value) assLuogo.value = p.luogo_incontro || "";
  hint.style.display = p.appuntamento || p.durata_lezione || p.luogo_incontro ? "block" : "none";
}
function aggiungiAccompagnatore() {
  const container = document.getElementById("ass-accompagnatori");
  const row = document.createElement("div");
  row.className = "familiare-row";
  row.innerHTML = `
    <div class="field" style="margin:0"><label>Nome</label><input type="text" placeholder="Nome e cognome"></div>
    <div class="field" style="margin:0"><label>Relazione</label><input type="text" placeholder="Referente, coach, tutor\u2026"></div>
    <div class="field" style="margin:0;display:grid;grid-template-columns:1fr auto;gap:.3rem;align-items:end">
      <div><label>Telefono</label><input type="tel" placeholder="+39 \u2026"></div>
      <button type="button" class="btn btn-ghost btn-sm" style="padding:.4rem .5rem;color:var(--danger)" onclick="this.closest('.familiare-row').remove()">\u2715</button>
    </div>`;
  container.appendChild(row);
}
function calcolaEtaForm() {
  const dn = dateInputToIso(document.getElementById("na-nascita").value);
  const el = document.getElementById("na-eta");
  if (!dn) {
    el.value = "";
    return;
  }
  const [y, m, d] = dn.split("-").map(Number);
  const oggi = /* @__PURE__ */ new Date(), nascita = new Date(y, m - 1, d);
  let anni = oggi.getFullYear() - nascita.getFullYear();
  if (oggi.getMonth() < nascita.getMonth() || oggi.getMonth() === nascita.getMonth() && oggi.getDate() < nascita.getDate()) anni--;
  const mesi = Math.round((oggi - nascita) / (1e3 * 60 * 60 * 24 * 30.44));
  el.value = anni >= 2 ? anni + " anni" : mesi + " mesi";
}
function formatDateField(input) {
  const digits = input.value.replace(/\D/g, "").slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  input.value = parts.join("/");
}
function getDot(id) {
  var _a2;
  return parseInt(((_a2 = document.getElementById(id)) == null ? void 0 : _a2.dataset.val) || "0");
}
const LOGISTICA_KEYS = ["appuntamento", "luogo_incontro", "durata_lezione", "compenso", "pagamento_metodo", "pagamento_stato", "pagamento_note"];
function estraiLogistica(profilo = {}) {
  return Object.fromEntries(LOGISTICA_KEYS.map((key) => {
    var _a2;
    return [key, (_a2 = profilo[key]) != null ? _a2 : null];
  }));
}
function logisticaHaValori(logistica = {}) {
  return LOGISTICA_KEYS.some((key) => logistica[key] !== void 0 && logistica[key] !== null && logistica[key] !== "");
}
function profiloSenzaLogisticaTopLevel(profilo = {}) {
  const clean = __spreadValues({}, profilo);
  LOGISTICA_KEYS.forEach((key) => delete clean[key]);
  return clean;
}
function logisticaGruppoProfilo(profilo = {}) {
  const dedicata = profilo.logistica_gruppo || {};
  return logisticaHaValori(dedicata) ? dedicata : estraiLogistica(profilo);
}
function logisticaIndividualeProfilo(profilo = {}, inGruppo = false) {
  if (!inGruppo) return estraiLogistica(profilo);
  const dedicata = profilo.logistica_individuale || {};
  return logisticaHaValori(dedicata) ? dedicata : {};
}
function salvaAllievo() {
  return __async(this, null, function* () {
    var _a2;
    const tipo = document.getElementById("na-tipo").value;
    const isAss = tipo === "associazione";
    const nome = isAss ? document.getElementById("ass-nome").value.trim() : document.getElementById("na-nome").value.trim();
    const cognome = isAss ? document.getElementById("ass-cognome").value.trim() : document.getElementById("na-cognome").value.trim();
    const errEl = document.getElementById("na-err");
    errEl.classList.remove("show");
    if (!nome || !isAss && !cognome) {
      errEl.textContent = isAss ? "Il nome \xE8 obbligatorio." : "Nome e cognome sono obbligatori.";
      errEl.classList.add("show");
      return;
    }
    const gruppoAttivo = !isAss && document.getElementById("na-gruppo-cb").checked;
    const allievoOriginale = editingAllieviId ? allAllievi.find((a) => a.id === editingAllieviId) || null : null;
    const profiloOriginale = (allievoOriginale == null ? void 0 : allievoOriginale.profilo) || {};
    const addressEditable = canEditAllievoAddress(allievoOriginale);
    let profilo;
    if (isAss) {
      profilo = {
        appuntamento: document.getElementById("ass-appuntamento").value.trim() || null,
        durata_lezione: parseInt(document.getElementById("ass-durata").value) || null,
        luogo_incontro: document.getElementById("ass-luogo").value.trim() || null
      };
    } else {
      const famRows = document.querySelectorAll("#na-familiari .familiare-row");
      const familiari = [...famRows].map((row) => {
        var _a3, _b3, _c2, _d;
        return {
          nome: ((_a3 = row.querySelector(".fam-nome")) == null ? void 0 : _a3.value.trim()) || "",
          cognome: ((_b3 = row.querySelector(".fam-cognome")) == null ? void 0 : _b3.value.trim()) || "",
          relazione: ((_c2 = row.querySelector(".fam-relazione")) == null ? void 0 : _c2.value.trim()) || "",
          telefono: ((_d = row.querySelector(".fam-telefono")) == null ? void 0 : _d.value.trim()) || ""
        };
      }).filter((f) => f.nome || f.cognome || f.telefono);
      const logisticaIndividuale = {
        durata_lezione: parseInt(document.getElementById("na-durata").value) || null,
        compenso: parseFloat(document.getElementById("na-compenso").value) || null,
        appuntamento: document.getElementById("na-appuntamento").value.trim() || null,
        luogo_incontro: document.getElementById("na-luogo-incontro").value.trim() || null
      };
      const baseProfilo = __spreadProps(__spreadValues({}, profiloSenzaLogisticaTopLevel(profiloOriginale)), {
        indirizzo: addressEditable ? document.getElementById("na-indirizzo").value.trim() || null : profiloOriginale.indirizzo || null,
        casa: addressEditable ? document.getElementById("na-casa").value.trim() || null : profiloOriginale.casa || null,
        indirizzo_condiviso: addressEditable ? !!((_a2 = document.getElementById("na-indirizzo-condiviso")) == null ? void 0 : _a2.checked) : !!profiloOriginale.indirizzo_condiviso,
        cultura: document.getElementById("na-cultura").value.trim() || null,
        note_salute: document.getElementById("na-note-salute").value.trim() || null,
        scadenza_cert: dateInputToIso(document.getElementById("na-cert").value) || null,
        disponibilita: document.getElementById("na-disponibilita").value.trim() || null,
        competenze: document.getElementById("na-competenze").value.trim() || null,
        obiettivi: document.getElementById("na-obiettivi").value.trim() || null,
        talenti: document.getElementById("na-talenti").value.trim() || null,
        paure: document.getElementById("na-paure").value.trim() || null,
        sport: document.getElementById("na-sport").value.trim() || null,
        equipaggiamento: document.getElementById("na-equip").value.trim() || null,
        lato_dominante: document.getElementById("na-lato").value || null,
        familiari,
        capacita: {
          coordinazione: getDot("dot-coord"),
          propriocezione: getDot("dot-prop"),
          velocita_apprendimento: getDot("dot-vel"),
          bilateralita: getDot("dot-bil")
        },
        apprendimento: {
          visivo: getDot("dot-visivo"),
          teorico: getDot("dot-teorico"),
          pratico: getDot("dot-pratico")
        }
      });
      if (gruppoAttivo) {
        const logisticaGruppo = profiloOriginale.logistica_gruppo || {};
        profilo = __spreadValues(__spreadValues(__spreadValues({}, baseProfilo), logisticaHaValori(logisticaGruppo) ? { logistica_gruppo: logisticaGruppo } : {}), logisticaHaValori(logisticaIndividuale) ? { logistica_individuale: logisticaIndividuale } : {});
      } else {
        profilo = __spreadValues(__spreadValues({}, baseProfilo), logisticaIndividuale);
        delete profilo.logistica_gruppo;
        delete profilo.logistica_individuale;
      }
    }
    const btn = document.getElementById("btn-salva-al");
    const btnTop = document.getElementById("btn-salva-al-top");
    const labelOrig = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Salvataggio\u2026";
    btnTop.disabled = true;
    btnTop.textContent = "Salvataggio\u2026";
    const payload = __spreadValues({
      nome,
      cognome,
      tipo,
      nickname: isAss ? document.getElementById("ass-nick").value.trim() || null : document.getElementById("na-nickname").value.trim() || null,
      vip: isAss ? false : document.getElementById("na-vip").value === "true",
      blocco_attuale: isAss ? "Base" : document.getElementById("na-blocco").value,
      gruppo: isAss ? document.getElementById("ass-gruppo").value.trim() || null : gruppoAttivo ? document.getElementById("na-gruppo").value.trim() || null : null,
      data_nascita: isAss ? null : dateInputToIso(document.getElementById("na-nascita").value) || null,
      data_iscrizione: isAss ? null : dateInputToIso(document.getElementById("na-iscrizione").value) || null,
      email: isAss ? null : document.getElementById("na-email").value.trim() || null,
      telefono: isAss ? null : document.getElementById("na-tel").value.trim() || null,
      note_generali: isAss ? document.getElementById("ass-note").value.trim() || null : document.getElementById("na-note").value.trim() || null,
      profilo,
      aggiornato_il: (/* @__PURE__ */ new Date()).toISOString()
    }, editingAllieviId ? {} : { maestro_id: currentUid });
    const savedId = editingAllieviId;
    const originalAllievo = savedId ? allAllievi.find((a) => String(a.id) === String(savedId)) || {} : {};
    try {
      let data, error;
      if (savedId) {
        ;
        ({ data, error } = yield sb.from("allievi").update(payload).eq("id", savedId).select().single());
        if (error && /aggiornato_il|updated_at|schema cache|column/i.test(error.message || error.details || error.hint || "")) {
          const _b2 = payload, { aggiornato_il } = _b2, compatPayload = __objRest(_b2, ["aggiornato_il"]);
          ({ data, error } = yield sb.from("allievi").update(compatPayload).eq("id", savedId).select().single());
        }
      } else {
        ;
        ({ data, error } = yield sb.from("allievi").insert(payload).select().single());
        if (error && /aggiornato_il|updated_at|schema cache|column/i.test(error.message || error.details || error.hint || "")) {
          const _c = payload, { aggiornato_il } = _c, compatPayload = __objRest(_c, ["aggiornato_il"]);
          ({ data, error } = yield sb.from("allievi").insert(compatPayload).select().single());
        }
      }
      if (error) throw error;
      const changedFields = savedId ? historyChangedFields(originalAllievo, payload, {
        nome: "nome",
        cognome: "cognome",
        nickname: "nickname",
        vip: "VIP",
        blocco_attuale: "blocco",
        gruppo: "gruppo",
        data_nascita: "data nascita",
        data_iscrizione: "data iscrizione",
        email: "email",
        telefono: "telefono",
        note_generali: "note",
        profilo: "profilo tecnico"
      }) : [];
      logModificaLocale("allievo", (data == null ? void 0 : data.id) || savedId, savedId ? historyDescription("Aggiornata scheda allievo", changedFields) : "Creata scheda allievo");
      const { data: fresh } = yield sb.from("allievi").select("*").order("nome");
      allAllievi = fresh || [];
      renderAllievi();
      const lessonDraft = loadLezioneDraft();
      if (!savedId && lessonDraft) {
        pendingSpecialGuestId = (data == null ? void 0 : data.id) || null;
        showView("nuova-lezione");
        return;
      }
      if (savedId) {
        const destination = editReturnTarget;
        editReturnTarget = null;
        yield goToReturnTarget(destination, { name: "scheda", id: savedId });
      } else {
        editReturnTarget = null;
        showView("allievi");
      }
    } catch (e) {
      errEl.textContent = e.message || "Errore di rete. Riprova.";
      errEl.classList.add("show");
      btn.disabled = false;
      btn.textContent = labelOrig;
      btnTop.disabled = false;
      btnTop.textContent = labelOrig;
    } finally {
      if (!btn.disabled) return;
      btn.disabled = false;
      btn.textContent = labelOrig;
      btnTop.disabled = false;
      btnTop.textContent = labelOrig;
    }
  });
}
function initNuovoGruppo(nomeGruppo = null) {
  editingGruppoNome = nomeGruppo || null;
  const membri = editingGruppoNome ? gruppoMembri(editingGruppoNome) : [];
  const profilo = profiloComuneGruppo(membri);
  document.getElementById("gr-title").textContent = editingGruppoNome ? `Modifica gruppo \u2014 ${editingGruppoNome}` : "Nuovo gruppo";
  document.getElementById("btn-salva-gr").textContent = editingGruppoNome ? "Aggiorna gruppo" : "Salva gruppo";
  document.getElementById("btn-salva-gr-top").textContent = editingGruppoNome ? "Aggiorna gruppo" : "Salva gruppo";
  document.getElementById("btn-cancella-gr").hidden = !editingGruppoNome;
  document.getElementById("gr-nome").value = editingGruppoNome || "";
  document.getElementById("gr-orario").value = profilo.appuntamento || "";
  document.getElementById("gr-luogo").value = profilo.luogo_incontro || "";
  document.getElementById("gr-durata").value = profilo.durata_lezione || "";
  document.getElementById("gr-compenso").value = profilo.compenso || "";
  document.getElementById("gr-pagamento-metodo").value = profilo.pagamento_metodo || "";
  document.getElementById("gr-pagamento-stato").value = profilo.pagamento_stato || "";
  document.getElementById("gr-pagamento-note").value = profilo.pagamento_note || "";
  document.getElementById("gr-err").classList.remove("show");
  document.getElementById("gr-allievi").innerHTML = "";
  if (membri.length) membri.forEach((a) => aggiungiAllievoGruppo(false, a));
  if (!membri.length) aggiungiAllievoGruppo();
  toggleAggiungiAllievoGruppoPanel(false);
  renderExistingAllieviGruppoPicker();
}
function aggiornaNumeriAllieviGruppo() {
  document.querySelectorAll("#gr-allievi .group-student").forEach((card, i) => {
    card.dataset.index = String(i + 1);
    aggiornaTitoloAllievoGruppo(card);
  });
}
function aggiungiAllievoGruppo(open = false, data = null) {
  const container = document.getElementById("gr-allievi");
  const card = document.createElement("div");
  card.className = `group-student${open ? " is-open" : ""}`;
  card.dataset.saved = data ? "1" : "0";
  if (data == null ? void 0 : data.id) card.dataset.allievoId = data.id;
  const profilo = (data == null ? void 0 : data.profilo) || {};
  card.innerHTML = `
    <button type="button" class="group-student-head" onclick="toggleAllievoGruppo(this)">
      <span class="group-student-title">Allievo</span>
      <span class="group-student-actions">
        <span class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="event.stopPropagation(); this.closest('.group-student').remove(); aggiornaNumeriAllieviGruppo(); renderExistingAllieviGruppoPicker()">\u2715</span>
      </span>
    </button>
    <div class="group-student-body">
      <div class="form-grid3">
        <div class="field"><label>Nome *</label><input type="text" class="gr-al-nome" placeholder="Nome" value="${esc((data == null ? void 0 : data.nome) || "")}" oninput="segnaAllievoGruppoDaSalvare(this)"></div>
        <div class="field"><label>Cognome *</label><input type="text" class="gr-al-cognome" placeholder="Cognome" value="${esc((data == null ? void 0 : data.cognome) || "")}" oninput="segnaAllievoGruppoDaSalvare(this)"></div>
        <div class="field"><label>Nick</label><input type="text" class="gr-al-nick" placeholder="Nickname" value="${esc((data == null ? void 0 : data.nickname) || "")}" oninput="segnaAllievoGruppoDaSalvare(this)"></div>
      </div>
      <div class="referenti-head">
        <div style="font-size:.78rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em">Referenti</div>
        <button class="btn btn-outline btn-sm" onclick="aggiungiReferenteGruppo(this, true)" type="button">+ Aggiungi referente</button>
      </div>
      <div class="referenti-list"></div>
      <div class="field" style="margin-top:.85rem;margin-bottom:0">
        <label>Note allievo</label>
        <textarea class="gr-al-note" placeholder="Note specifiche per questo allievo\u2026" oninput="segnaAllievoGruppoDaSalvare(this)">${esc((data == null ? void 0 : data.note_generali) || "")}</textarea>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:.85rem">
        <button class="btn btn-primary btn-sm" onclick="salvaTabAllievoGruppo(this)" type="button">Salva</button>
      </div>
    </div>`;
  container.appendChild(card);
  const familiari = Array.isArray(profilo.familiari) ? profilo.familiari : [];
  if (familiari.length) familiari.forEach((ref) => aggiungiReferenteGruppo(card.querySelector(".referenti-head .btn-outline"), false, ref));
  else aggiungiReferenteGruppo(card.querySelector(".referenti-head .btn-outline"), false);
  if (data) card.classList.add("is-saved");
  aggiornaNumeriAllieviGruppo();
  renderExistingAllieviGruppoPicker();
}
function allieviIdsGiaNelFormGruppo() {
  return new Set([...document.querySelectorAll("#gr-allievi .group-student")].map((row) => row.dataset.allievoId).filter(Boolean));
}
function toggleAggiungiAllievoGruppoPanel(force = null) {
  const panel = document.getElementById("gr-add-panel");
  if (!panel) return;
  panel.hidden = force === null ? !panel.hidden : !force;
  if (!panel.hidden) renderExistingAllieviGruppoPicker();
}
function aggiungiNuovoAllievoGruppoDaPanel() {
  aggiungiAllievoGruppo(true);
  toggleAggiungiAllievoGruppoPanel(false);
}
function renderExistingAllieviGruppoPicker() {
  const sel = document.getElementById("gr-existing-allievo");
  if (!sel) return;
  const selected = allieviIdsGiaNelFormGruppo();
  const candidates = ordinaAllieviLista(allieviVisibiliGod().filter((a) => a.stato !== "archiviato").filter((a) => !selected.has(String(a.id))));
  sel.innerHTML = `
    <option value="">\u2014 Scegli allievo \u2014</option>
    ${candidates.map((a) => {
    const meta = [a.cognome, a.nickname ? `(${a.nickname})` : "", a.gruppo ? `\xB7 ${a.gruppo}` : ""].filter(Boolean).join(" ");
    return `<option value="${esc(a.id)}">${esc(a.nome)}${meta ? ` ${esc(meta)}` : ""}</option>`;
  }).join("")}`;
  sel.disabled = !candidates.length;
}
function aggiungiAllievoEsistenteGruppo() {
  const sel = document.getElementById("gr-existing-allievo");
  const errEl = document.getElementById("gr-err");
  const id = (sel == null ? void 0 : sel.value) || "";
  if (!id) {
    if (errEl) {
      errEl.textContent = "Scegli un allievo gi\xE0 registrato da aggiungere al gruppo.";
      errEl.classList.add("show");
    }
    return;
  }
  const allievo = allAllievi.find((a) => String(a.id) === String(id));
  if (!allievo) return;
  if (errEl) errEl.classList.remove("show");
  aggiungiAllievoGruppo(false, allievo);
  if (sel) sel.value = "";
  renderExistingAllieviGruppoPicker();
  toggleAggiungiAllievoGruppoPanel(false);
}
function toggleAllievoGruppo(head) {
  head.closest(".group-student").classList.toggle("is-open");
}
function segnaAllievoGruppoDaSalvare(el) {
  const card = el.closest(".group-student");
  card.dataset.saved = "0";
  card.classList.remove("is-saved");
  aggiornaTitoloAllievoGruppo(card);
}
function aggiornaTitoloAllievoGruppo(card) {
  var _a2, _b2, _c;
  const title = card.querySelector(".group-student-title");
  const nome = ((_a2 = card.querySelector(".gr-al-nome")) == null ? void 0 : _a2.value.trim()) || "";
  const cognome = ((_b2 = card.querySelector(".gr-al-cognome")) == null ? void 0 : _b2.value.trim()) || "";
  const nick = ((_c = card.querySelector(".gr-al-nick")) == null ? void 0 : _c.value.trim()) || "";
  const n = card.dataset.index || "1";
  const fullName = [nome, cognome].filter(Boolean).join(" ");
  title.textContent = card.dataset.saved === "1" && fullName ? `${fullName}${nick ? ` (${nick})` : ""}` : `Allievo ${n}`;
}
function salvaTabAllievoGruppo(btn) {
  const card = btn.closest(".group-student");
  const errEl = document.getElementById("gr-err");
  const nome = card.querySelector(".gr-al-nome").value.trim();
  const cognome = card.querySelector(".gr-al-cognome").value.trim();
  errEl.classList.remove("show");
  if (!nome || !cognome) {
    errEl.textContent = "Per salvare la riga allievo inserisci nome e cognome.";
    errEl.classList.add("show");
    card.classList.add("is-open");
    return;
  }
  card.dataset.saved = "1";
  card.classList.add("is-saved");
  card.classList.remove("is-open");
  aggiornaTitoloAllievoGruppo(card);
  const hasEmptyDraft = [...document.querySelectorAll("#gr-allievi .group-student")].some((row) => row !== card && row.dataset.saved !== "1" && !leggiAllievoGruppo(row).hasData);
  if (!hasEmptyDraft) aggiungiAllievoGruppo(false);
  aggiornaNumeriAllieviGruppo();
}
function aggiungiReferenteGruppo(btn, open = false, data = null) {
  const student = btn.closest(".group-student");
  const list = student.querySelector(".referenti-list");
  const row = document.createElement("div");
  row.className = `referente-row${open ? " is-open" : ""}`;
  row.dataset.saved = data ? "1" : "0";
  row.innerHTML = `
    <button type="button" class="referente-head" onclick="toggleReferenteGruppo(this)">
      <span class="referente-title">Referente</span>
      <span class="group-student-actions">
        <span class="btn btn-ghost btn-sm" style="padding:.25rem .45rem;color:var(--danger)" onclick="event.stopPropagation(); this.closest('.referente-row').remove()">\u2715</span>
      </span>
    </button>
    <div class="referente-body">
      <div class="field" style="margin:0"><label>Nome</label><input type="text" class="gr-ref-nome" placeholder="Nome" value="${esc((data == null ? void 0 : data.nome) || "")}" oninput="segnaReferenteGruppoDaSalvare(this)"></div>
      <div class="field" style="margin:0"><label>Cognome</label><input type="text" class="gr-ref-cognome" placeholder="Cognome" value="${esc((data == null ? void 0 : data.cognome) || "")}" oninput="segnaReferenteGruppoDaSalvare(this)"></div>
      <div class="field" style="margin:0"><label>Relazione</label><input type="text" class="gr-ref-relazione" placeholder="Padre, tata\u2026" value="${esc((data == null ? void 0 : data.relazione) || "")}" oninput="segnaReferenteGruppoDaSalvare(this)"></div>
      <div class="field" style="margin:0"><label>Telefono</label><input type="tel" class="gr-ref-telefono" placeholder="+39 \u2026" value="${esc((data == null ? void 0 : data.telefono) || "")}" oninput="segnaReferenteGruppoDaSalvare(this)"></div>
      <button type="button" class="btn btn-primary btn-sm" onclick="salvaTabReferenteGruppo(this)">Salva</button>
    </div>`;
  list.appendChild(row);
  if (data) row.classList.add("is-saved");
  aggiornaTitoloReferenteGruppo(row);
}
function toggleReferenteGruppo(head) {
  head.closest(".referente-row").classList.toggle("is-open");
}
function segnaReferenteGruppoDaSalvare(el) {
  const row = el.closest(".referente-row");
  row.dataset.saved = "0";
  row.classList.remove("is-saved");
  aggiornaTitoloReferenteGruppo(row);
}
function aggiornaTitoloReferenteGruppo(row) {
  var _a2, _b2, _c, _d;
  const title = row.querySelector(".referente-title");
  const nome = ((_a2 = row.querySelector(".gr-ref-nome")) == null ? void 0 : _a2.value.trim()) || "";
  const cognome = ((_b2 = row.querySelector(".gr-ref-cognome")) == null ? void 0 : _b2.value.trim()) || "";
  const relazione = ((_c = row.querySelector(".gr-ref-relazione")) == null ? void 0 : _c.value.trim()) || "";
  const telefono = ((_d = row.querySelector(".gr-ref-telefono")) == null ? void 0 : _d.value.trim()) || "";
  const fullName = [nome, cognome].filter(Boolean).join(" ");
  title.textContent = row.dataset.saved === "1" && (fullName || relazione || telefono) ? [fullName, relazione, telefono].filter(Boolean).join(" \xB7 ") : "Referente";
}
function salvaTabReferenteGruppo(btn) {
  const row = btn.closest(".referente-row");
  const student = row.closest(".group-student");
  row.dataset.saved = "1";
  row.classList.add("is-saved");
  row.classList.remove("is-open");
  aggiornaTitoloReferenteGruppo(row);
  const hasEmptyDraft = [...student.querySelectorAll(".referente-row")].some((ref) => ref !== row && ref.dataset.saved !== "1" && !leggiReferenteGruppo(ref).hasData);
  if (!hasEmptyDraft) aggiungiReferenteGruppo(student.querySelector(".referenti-head .btn-outline"), false);
}
function leggiReferenteGruppo(ref) {
  const referente = {
    nome: ref.querySelector(".gr-ref-nome").value.trim(),
    cognome: ref.querySelector(".gr-ref-cognome").value.trim(),
    relazione: ref.querySelector(".gr-ref-relazione").value.trim(),
    telefono: ref.querySelector(".gr-ref-telefono").value.trim()
  };
  return {
    referente,
    hasData: referente.nome || referente.cognome || referente.relazione || referente.telefono
  };
}
function leggiAllievoGruppo(row) {
  const referenti = [...row.querySelectorAll(".referente-row")].map((ref) => leggiReferenteGruppo(ref)).filter((item) => item.hasData).map((item) => item.referente);
  const allievo = {
    id: row.dataset.allievoId || null,
    nome: row.querySelector(".gr-al-nome").value.trim(),
    cognome: row.querySelector(".gr-al-cognome").value.trim(),
    nickname: row.querySelector(".gr-al-nick").value.trim(),
    note: row.querySelector(".gr-al-note").value.trim(),
    referenti
  };
  return {
    allievo,
    hasData: allievo.nome || allievo.cognome || allievo.nickname || allievo.note || allievo.referenti.length
  };
}
function salvaGruppo() {
  return __async(this, null, function* () {
    const nomeGruppo = document.getElementById("gr-nome").value.trim();
    const orario = document.getElementById("gr-orario").value.trim();
    const luogo = document.getElementById("gr-luogo").value.trim();
    const durata = parseInt(document.getElementById("gr-durata").value) || null;
    const compenso = parseFloat(document.getElementById("gr-compenso").value) || null;
    const pagamentoMetodo = document.getElementById("gr-pagamento-metodo").value || null;
    const pagamentoStato = document.getElementById("gr-pagamento-stato").value || null;
    const pagamentoNote = document.getElementById("gr-pagamento-note").value.trim() || null;
    const errEl = document.getElementById("gr-err");
    errEl.classList.remove("show");
    if (!nomeGruppo) {
      errEl.textContent = "Inserisci il nome del gruppo.";
      errEl.classList.add("show");
      return;
    }
    const rows = [...document.querySelectorAll("#gr-allievi .group-student")];
    const allievi = rows.map((row) => leggiAllievoGruppo(row)).filter((item) => item.hasData).map((item) => item.allievo);
    if (!editingGruppoNome && !allievi.length) {
      errEl.textContent = "Aggiungi almeno un allievo al gruppo.";
      errEl.classList.add("show");
      return;
    }
    if (allievi.some((a) => !a.nome || !a.cognome)) {
      errEl.textContent = "Per ogni allievo inserisci nome e cognome.";
      errEl.classList.add("show");
      return;
    }
    const btn = document.getElementById("btn-salva-gr");
    const btnTop = document.getElementById("btn-salva-gr-top");
    btn.disabled = true;
    btn.textContent = "Salvataggio\u2026";
    btnTop.disabled = true;
    btnTop.textContent = "Salvataggio\u2026";
    const oggi = localDateIso();
    const commonLogistica = {
      appuntamento: orario || null,
      luogo_incontro: luogo || null,
      durata_lezione: durata,
      compenso,
      pagamento_metodo: pagamentoMetodo,
      pagamento_stato: pagamentoStato,
      pagamento_note: pagamentoNote
    };
    const commonProfile = __spreadProps(__spreadValues({}, commonLogistica), {
      logistica_gruppo: commonLogistica
    });
    if (editingGruppoNome) {
      try {
        const membriOriginali = gruppoMembri(editingGruppoNome);
        const keptIds = new Set(allievi.map((a) => a.id).filter(Boolean));
        const removedIds = membriOriginali.map((a) => a.id).filter((id) => !keptIds.has(id));
        if (removedIds.length) {
          const { error: removeError } = yield sb.from("allievi").update({ gruppo: null }).in("id", removedIds);
          if (removeError) throw removeError;
        }
        for (const a of allievi) {
          if (a.id) {
            const original = allAllievi.find((item) => item.id === a.id) || {};
            const payloadUpdate = {
              nome: a.nome,
              cognome: a.cognome,
              nickname: a.nickname || null,
              gruppo: nomeGruppo,
              note_generali: a.note || null,
              profilo: __spreadProps(__spreadValues(__spreadValues({}, original.profilo || {}), commonProfile), { familiari: a.referenti })
            };
            const { error } = yield sb.from("allievi").update(payloadUpdate).eq("id", a.id);
            if (error) throw error;
          } else {
            const { error } = yield sb.from("allievi").insert({
              nome: a.nome,
              cognome: a.cognome,
              tipo: "individuale",
              nickname: a.nickname || null,
              vip: false,
              blocco_attuale: "Base",
              gruppo: nomeGruppo,
              data_iscrizione: oggi,
              note_generali: a.note || null,
              profilo: __spreadProps(__spreadValues({}, commonProfile), { familiari: a.referenti }),
              maestro_id: currentUid
            });
            if (error) throw error;
          }
        }
        filtroGruppo = nomeGruppo;
        const nextGroup = nomeGruppo;
        const destination = editReturnTarget;
        editReturnTarget = null;
        editingGruppoNome = null;
        yield ricaricaAllievi();
        yield goToReturnTarget(destination, { name: "gruppo", id: nextGroup });
      } catch (e) {
        errEl.textContent = e.message || "Errore di rete. Riprova.";
        errEl.classList.add("show");
      } finally {
        btn.disabled = false;
        btn.textContent = "Salva gruppo";
        btnTop.disabled = false;
        btnTop.textContent = "Salva gruppo";
      }
      return;
    }
    try {
      const nuovi = [];
      for (const a of allievi) {
        if (a.id) {
          const original = allAllievi.find((item) => item.id === a.id) || {};
          const payloadUpdate = {
            nome: a.nome,
            cognome: a.cognome,
            nickname: a.nickname || null,
            gruppo: nomeGruppo,
            note_generali: a.note || null,
            profilo: __spreadProps(__spreadValues(__spreadValues({}, original.profilo || {}), commonProfile), { familiari: a.referenti })
          };
          const { error } = yield sb.from("allievi").update(payloadUpdate).eq("id", a.id);
          if (error) throw error;
        } else {
          nuovi.push({
            nome: a.nome,
            cognome: a.cognome,
            tipo: "individuale",
            nickname: a.nickname || null,
            vip: false,
            blocco_attuale: "Base",
            gruppo: nomeGruppo,
            data_iscrizione: oggi,
            note_generali: a.note || null,
            profilo: __spreadProps(__spreadValues({}, commonProfile), { familiari: a.referenti }),
            maestro_id: currentUid
          });
        }
      }
      if (nuovi.length) {
        const { error } = yield sb.from("allievi").insert(nuovi);
        if (error) throw error;
      }
      filtroGruppo = nomeGruppo;
      editReturnTarget = null;
      yield ricaricaAllievi();
      showView("gruppo", nomeGruppo);
    } catch (e) {
      errEl.textContent = e.message || "Errore di rete. Riprova.";
      errEl.classList.add("show");
    } finally {
      btn.disabled = false;
      btn.textContent = "Salva gruppo";
      btnTop.disabled = false;
      btnTop.textContent = "Salva gruppo";
    }
  });
}
function gruppoMembri(nomeGruppo, { includeArchived = false } = {}) {
  return ordinaAllieviLista(allieviVisibiliGod().filter((a) => {
    if (a.gruppo !== nomeGruppo) return false;
    return includeArchived || a.stato !== "archiviato";
  }));
}
function profiloComuneGruppo(membri) {
  const profili = membri.map((a) => logisticaGruppoProfilo(a.profilo || {}));
  const firstValue = (key) => {
    var _a2;
    return ((_a2 = profili.find((p) => p[key] !== void 0 && p[key] !== null && p[key] !== "")) == null ? void 0 : _a2[key]) || "";
  };
  return {
    appuntamento: firstValue("appuntamento"),
    luogo_incontro: firstValue("luogo_incontro"),
    durata_lezione: firstValue("durata_lezione"),
    compenso: firstValue("compenso"),
    pagamento_metodo: firstValue("pagamento_metodo"),
    pagamento_stato: firstValue("pagamento_stato"),
    pagamento_note: firstValue("pagamento_note")
  };
}
function loadGruppo(nomeGruppo) {
  return __async(this, null, function* () {
    showView("gruppo");
    currentGruppoNome = nomeGruppo;
    recordAppHistory("gruppo", nomeGruppo);
    const el = document.getElementById("gruppo-content");
    el.innerHTML = '<div class="loading">Caricamento\u2026</div>';
    const membri = gruppoMembri(nomeGruppo);
    if (!membri.length) {
      el.innerHTML = `<button class="back-btn" onclick="showView('allievi')">\u2190 Allievi</button><div class="card"><div class="empty">Gruppo non trovato.</div></div>`;
      return;
    }
    const profilo = profiloComuneGruppo(membri);
    const ids = membri.map((a) => a.id);
    let { data: laRows, error: lzErr } = yield sb.from("lezioni_allievi").select("lezione_id, lezioni(id, data, tipo, durata_min, luogo, meteo, note, note_speciali, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, dimensioni, skills(nome)))").in("allievo_id", ids);
    if (isMissingLessonMeteoError(lzErr)) {
      ;
      ({ data: laRows, error: lzErr } = yield sb.from("lezioni_allievi").select("lezione_id, lezioni(id, data, tipo, durata_min, luogo, note, note_speciali, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, dimensioni, skills(nome)))").in("allievo_id", ids));
    }
    if (isMissingDimensioniError(lzErr)) {
      ;
      ({ data: laRows, error: lzErr } = yield sb.from("lezioni_allievi").select("lezione_id, lezioni(id, data, tipo, durata_min, luogo, note, note_speciali, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, skills(nome)))").in("allievo_id", ids));
    }
    if (isMissingNoteSpecialiError(lzErr)) {
      ;
      ({ data: laRows, error: lzErr } = yield sb.from("lezioni_allievi").select("lezione_id, lezioni(id, data, tipo, durata_min, luogo, note, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, skills(nome)))").in("allievo_id", ids));
      laRows = (laRows || []).map((row) => __spreadProps(__spreadValues({}, row), {
        lezioni: row.lezioni ? __spreadProps(__spreadValues({}, row.lezioni), { note_speciali: null }) : row.lezioni
      }));
    }
    const viste = /* @__PURE__ */ new Set();
    const lezioniGruppo = (laRows || []).map((row) => row.lezioni).filter(Boolean).filter((l) => {
      if (viste.has(l.id)) return false;
      viste.add(l.id);
      return true;
    }).sort((a, b) => String(b.data || "").localeCompare(String(a.data || "")));
    const membriHtml = membri.map((a) => `
    <div class="gruppo-member-card" onclick="loadScheda('${a.id}')">
      <div>
        <div class="gruppo-member-name">${esc([a.nome, a.cognome].filter(Boolean).join(" "))}${a.nickname ? ` \xB7 ${esc(a.nickname)}` : ""}</div>
        <div class="gruppo-member-meta">Lv ${a.livello_attuale || "\u2014"} \xB7 ${esc(a.blocco_attuale || "\u2014")}</div>
      </div>
      <button type="button" class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); showView('nuovo-allievo','${a.id}')">${editIcon()}</button>
    </div>`).join("");
    const lezioniHtml = lezioniGruppo.length ? renderLezioniTable(lezioniGruppo, { variant: "lista", gruppoNome: nomeGruppo }) : `<div class="empty">${lzErr ? esc(lzErr.message || "Errore nel caricamento lezioni gruppo.") : "Nessuna lezione registrata per questo gruppo."}</div>`;
    const info = (label, val) => val ? `<div><div class="info-label">${esc(label)}</div><div>${esc(String(val))}</div></div>` : "";
    const compenso = profilo.compenso ? `\u20AC ${Number(profilo.compenso).toFixed(2)}` : "";
    el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1rem;flex-wrap:wrap">
      <button class="back-btn" onclick="showView('allievi')" style="margin-bottom:0">\u2190 Allievi</button>
      <div style="display:flex;gap:.45rem;flex-wrap:wrap">
        <button class="btn btn-outline btn-sm" onclick="showView('nuovo-gruppo',${jsArg(nomeGruppo)})">${editIcon()} Modifica gruppo</button>
        <button class="btn btn-primary btn-sm" onclick="showView('nuova-lezione',${jsArg("gruppo:" + nomeGruppo)})">+ Lezione gruppo</button>
      </div>
    </div>

    <div class="card">
      <div class="lezione-read-head">
        <div>
          <div class="lezione-read-title">${esc(nomeGruppo)}</div>
          <div class="scheda-meta">${membri.length} alliev${membri.length === 1 ? "o" : "i"} attiv${membri.length === 1 ? "o" : "i"}</div>
        </div>
        <div class="lezione-read-when">
          ${profilo.appuntamento ? `<div class="lezione-read-date">${esc(profilo.appuntamento)}</div>` : "<span>Orario non indicato</span>"}
          ${profilo.luogo_incontro ? `<br>${esc(profilo.luogo_incontro)}` : ""}
        </div>
      </div>
    </div>

    <div class="lezione-read-grid">
      <div>
        <p class="sec-title">Membri</p>
        <div class="card"><div class="gruppo-member-list">${membriHtml}</div></div>
      </div>
      <div>
        <p class="sec-title">Logistica gruppo</p>
        <div class="card">
          <div class="info-grid">
            ${info("Appuntamento", profilo.appuntamento)}
            ${info("Durata lezione", profilo.durata_lezione ? profilo.durata_lezione + " min" : null)}
            ${info("Luogo", profilo.luogo_incontro)}
            ${info("Compenso", compenso)}
            ${info("Pagamento", [profilo.pagamento_metodo, profilo.pagamento_stato].filter(Boolean).join(" \xB7 "))}
            ${info("Note pagamento", profilo.pagamento_note)}
          </div>
        </div>
      </div>
    </div>

    <p class="sec-title">Lezioni gruppo${lezioniGruppo.length ? ` (${lezioniGruppo.length})` : ""}</p>
    <div class="card">${lezioniHtml}</div>
  `;
    requestAnimationFrame(() => motion.cards(el));
  });
}
function loadScheda(id) {
  return __async(this, null, function* () {
    var _a2, _b2, _c, _d, _e, _f, _g;
    showView("scheda");
    currentSchedaId = id;
    recordAppHistory("scheda", id);
    const shortcut = document.getElementById("scheda-nuova-lezione");
    const prepShortcut = document.getElementById("scheda-prepara-lezione");
    const postumaShortcut = document.getElementById("scheda-lezione-postuma");
    shortcut.hidden = false;
    shortcut.onclick = () => showView("nuova-lezione", id);
    prepShortcut.hidden = false;
    prepShortcut.onclick = () => showView("nuova-lezione", `modo:prep:${id}`);
    postumaShortcut.hidden = false;
    postumaShortcut.onclick = () => showView("nuova-lezione", `modo:postuma:${id}`);
    document.getElementById("scheda-content").innerHTML = '<div class="loading">Caricamento\u2026</div>';
    const allievo = allAllievi.find((a) => a.id === id);
    const [{ data: progressiRaw }, { data: laRows }] = yield Promise.all([
      sb.from("progressi_allievo").select("skill_id, stadio, data_inizio, data_acquisizione, data_perfezionamento, note_maestro, skills(nome, ramo, livello, blocco)").eq("allievo_id", id),
      sb.from("lezioni_allievi").select("lezione_id").eq("allievo_id", id)
    ]);
    const progressiRawVisible = (progressiRaw || []).filter((p2) => {
      var _a3;
      return !isFakieSkillName((_a3 = p2.skills) == null ? void 0 : _a3.nome);
    });
    const progressi = progressiRawVisible.filter((p2) => p2.stadio > 0);
    const progressiMap = Object.fromEntries(progressiRawVisible.map((p2) => [p2.skill_id, p2.stadio]));
    const fakieProgressMap = fakieProgressMapForAllievo(allievo);
    let lezioniHtml = '<div class="empty">Nessuna lezione registrata.</div>';
    let lezioniCount = 0;
    let lezioniScheda = [];
    if (laRows == null ? void 0 : laRows.length) {
      let { data: lzRows, error: lzErr } = yield sb.from("lezioni_allievi").select("lezione_id, lezioni(id, data, tipo, durata_min, luogo, meteo, note, note_speciali, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(allievo_id, stadio_raggiunto, dimensioni, skills(nome)))").eq("allievo_id", id);
      if (isMissingLessonMeteoError(lzErr)) {
        ;
        ({ data: lzRows, error: lzErr } = yield sb.from("lezioni_allievi").select("lezione_id, lezioni(id, data, tipo, durata_min, luogo, note, note_speciali, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(allievo_id, stadio_raggiunto, dimensioni, skills(nome)))").eq("allievo_id", id));
      }
      if (isMissingDimensioniError(lzErr)) {
        ;
        ({ data: lzRows, error: lzErr } = yield sb.from("lezioni_allievi").select("lezione_id, lezioni(id, data, tipo, durata_min, luogo, note, note_speciali, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(allievo_id, stadio_raggiunto, skills(nome)))").eq("allievo_id", id));
      }
      if (isMissingNoteSpecialiError(lzErr)) {
        ;
        ({ data: lzRows, error: lzErr } = yield sb.from("lezioni_allievi").select("lezione_id, lezioni(id, data, tipo, durata_min, luogo, note, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(allievo_id, stadio_raggiunto, skills(nome)))").eq("allievo_id", id));
        lzRows = (lzRows || []).map((row) => __spreadProps(__spreadValues({}, row), {
          lezioni: row.lezioni ? __spreadProps(__spreadValues({}, row.lezioni), { note_speciali: null }) : row.lezioni
        }));
      }
      if (lzErr) {
        lezioniHtml = `<div class="empty">${esc(lzErr.message || "Errore nel caricamento lezioni.")}</div>`;
      } else {
        const lz = (lzRows || []).map((row) => row.lezioni).filter(Boolean).sort((a, b) => String(b.data || "").localeCompare(String(a.data || "")));
        lezioniScheda = lz;
        lezioniCount = lz.length;
        lezioniHtml = renderLezioniTable(lz, { variant: "scheda", schedaId: id });
      }
    }
    const byRamo = {};
    (progressi || []).forEach((p2) => {
      var _a3;
      const r = ((_a3 = p2.skills) == null ? void 0 : _a3.ramo) || "Altro";
      if (!byRamo[r]) byRamo[r] = [];
      byRamo[r].push(p2);
    });
    const progressiHtml = Object.keys(byRamo).length ? Object.entries(byRamo).map(([ramo, rows]) => `
        <p class="ramo" style="margin-bottom:.5rem">${esc(ramo)}</p>
        <div class="table-wrap" style="margin-bottom:1rem">
          <table>
            <thead><tr><th>Skill</th><th>Lv.</th><th>Stadio</th><th>Acquisita</th></tr></thead>
            <tbody>
              ${rows.sort((a, b) => a.skills.livello - b.skills.livello).map((p2) => {
      var _a3, _b3;
      return `
                <tr>
                  <td>${esc((_a3 = p2.skills) == null ? void 0 : _a3.nome)}</td>
                  <td>${(_b3 = p2.skills) == null ? void 0 : _b3.livello}</td>
                  <td><span class="st st${p2.stadio}">${stadioLabel(p2.stadio)}</span></td>
                  <td>${p2.data_acquisizione ? formatDate(p2.data_acquisizione) : "\u2014"}</td>
                </tr>`;
    }).join("")}
            </tbody>
          </table>
        </div>`).join("") : '<div class="empty">Nessuna skill registrata ancora.</div>';
    const p = allievo.profilo || {};
    const logisticaScheda = logisticaIndividualeProfilo(p, !!allievo.gruppo);
    const addressScheda = visibleAllievoAddress(allievo);
    function dotsRo(val) {
      return [1, 2, 3].map((i) => `<span class="dot-ro${i <= val ? " filled" : ""}"></span>`).join("");
    }
    function infoRow(label, val, allowHtml = false) {
      if (!val) return "";
      return `<div><div class="info-label">${label}</div><div>${allowHtml ? val : esc(String(val))}</div></div>`;
    }
    const famHtml = (p.familiari || []).length ? p.familiari.map((f) => `<div style="font-size:.87rem;padding:.3rem 0;border-bottom:1px solid var(--bordo)">
        <strong>${esc([f.nome, f.cognome].filter(Boolean).join(" "))}</strong>${f.relazione ? ` \u2014 ${esc(f.relazione)}` : ""}${f.telefono ? ` \xB7 <a href="tel:${esc(f.telefono)}" style="color:var(--blu)">${esc(f.telefono)}</a>` : ""}
      </div>`).join("") : '<span style="color:var(--muted);font-size:.87rem">Nessun familiare registrato.</span>';
    const compenso = logisticaScheda.compenso ? "\u20AC " + Number(logisticaScheda.compenso).toFixed(2) : null;
    const hasPagamento = !!(compenso || logisticaScheda.pagamento_metodo || logisticaScheda.pagamento_stato || logisticaScheda.pagamento_note);
    const isAss = allievo.tipo === "associazione";
    const headerExtra = isAss ? `<div class="scheda-meta" style="margin-top:.3rem">
         <span style="background:var(--blu-chiaro);color:var(--blu);font-size:.75rem;font-weight:700;padding:.15rem .5rem;border-radius:4px;text-transform:uppercase">Associazione</span>
         ${p.categoria_accompagnatori ? `<span style="margin-left:.5rem;color:var(--muted);font-size:.87rem">${esc(p.categoria_accompagnatori)}</span>` : ""}
       </div>` : `<div class="scheda-meta">
         Livello ${allievo.livello_attuale} \xB7 ${esc(allievo.blocco_attuale)}
         ${allievo.data_nascita ? ` \xB7 Nato il ${formatDate(allievo.data_nascita)}` : ""}
       </div>`;
    document.getElementById("scheda-content").innerHTML = `
    <div class="card">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;flex-wrap:wrap">
        <div>
          <div class="scheda-nome">
            ${esc(allievo.nome)}${!isAss && allievo.cognome ? " " + esc(allievo.cognome) : ""}${allievo.nickname ? ` <span style="font-size:1rem;color:var(--muted);font-weight:400">"${esc(allievo.nickname)}"</span>` : ""}${allievo.vip ? ' <span class="vip-star">\u2605</span>' : ""}
          </div>
          ${headerExtra}
       </div>
        <div style="display:flex;gap:.4rem;flex-wrap:wrap">
          <div class="inline-action-menu">
            <button class="btn btn-outline btn-sm" onclick="toggleActionMenu('scheda-actions-${id}', event)" type="button">Azioni</button>
            <div class="inline-action-panel" id="scheda-actions-${id}" hidden>
              <button class="btn btn-ghost btn-sm" onclick="showView('nuovo-allievo','${id}')">${editIcon()} Modifica</button>
              <button class="btn btn-ghost btn-sm" onclick="eliminaAllievo('${id}')">${allievo.stato === "archiviato" ? "Elimina definitivamente" : "Archivia"}</button>
              <button class="btn btn-ghost btn-sm" onclick="esportaAllievo('${id}')">JSON</button>
              <button class="btn btn-ghost btn-sm" onclick="stampaScheda('${id}')">Stampa</button>
              <button class="btn btn-ghost btn-sm" onclick="openHistoryModal('allievo','${id}',${jsArg(`Storico ${allievoDisplayName(id)}`)})">Storico</button>
              ${allievoUpdatedAt(allievo) ? `<div class="inline-action-meta">Ultima modifica<br><strong>${esc(formatDateTime(allievoUpdatedAt(allievo)))}</strong></div>` : '<div class="inline-action-meta">Ultima modifica non disponibile</div>'}
            </div>
          </div>
        </div>
      </div>
      ${!isAss && allievo.note_generali ? `<p style="font-size:.88rem;color:var(--muted);margin-top:.6rem">${esc(allievo.note_generali)}</p>` : ""}
    </div>

    ${!isAss ? `
    <div class="scheda-tabs">
      <button class="scheda-tab active" data-tab="profilo" onclick="switchSchedaTab('profilo')">Profilo</button>
      <button class="scheda-tab" data-tab="skill-tree" onclick="switchSchedaTab('skill-tree')">Skill Tree</button>
      <button class="scheda-tab" data-tab="lezioni" onclick="switchSchedaTab('lezioni')">Lezioni</button>
    </div>

    <div id="scheda-panel-profilo" class="scheda-panel active">
      <p class="sec-title">Contatti</p>
      <div class="card">
        ${(p.familiari || []).length ? `<div style="margin-bottom:.75rem"><div class="info-label" style="margin-bottom:.3rem">Familiari / Tutori</div>${famHtml}</div>` : ""}
        <div class="info-grid">
          ${infoRow("Email", allievo.email ? `<a href="mailto:${esc(allievo.email)}" style="color:var(--blu)">${esc(allievo.email)}</a>` : null, true)}
          ${infoRow("Telefono", allievo.telefono ? `<a href="tel:${esc(allievo.telefono)}" style="color:var(--blu)">${esc(allievo.telefono)}</a>` : null, true)}
          ${infoRow("Iscritto il", allievo.data_iscrizione ? formatDate(allievo.data_iscrizione) : null)}
          ${infoRow("Indirizzo", addressScheda.indirizzo)}
          ${infoRow("Casa", addressScheda.casa)}
          ${p.indirizzo_condiviso ? infoRow("Privacy indirizzo", "Condiviso con altri maestri") : ""}
          ${infoRow("Cultura / lingua", p.cultura)}
          ${infoRow("Gruppo", allievo.gruppo)}
        </div>
      </div>

      ${p.note_salute ? `
      <p class="sec-title">Salute e attenzioni</p>
      <div class="card"><div class="lezione-read-note">${esc(p.note_salute)}</div></div>` : ""}

      ${logisticaScheda.appuntamento || logisticaScheda.luogo_incontro || logisticaScheda.durata_lezione || hasPagamento ? `
      <p class="sec-title">Logistica</p>
      <div class="card">
        <div class="info-grid">
          ${infoRow("Appuntamento", logisticaScheda.appuntamento)}
          ${infoRow("Durata lezione", logisticaScheda.durata_lezione ? logisticaScheda.durata_lezione + " min" : null)}
          ${infoRow("Luogo", logisticaScheda.luogo_incontro)}
          ${infoRow("Compenso lezione", compenso)}
          ${infoRow("Metodo pagamento", logisticaScheda.pagamento_metodo)}
          ${infoRow("Stato pagamento", logisticaScheda.pagamento_stato)}
          ${infoRow("Note pagamento", logisticaScheda.pagamento_note)}
        </div>
      </div>` : ""}

      <p class="sec-title">Profilo psicomotorio</p>
      <div class="card">
        <div class="psy-grid">
          <div>
            <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:.6rem">Capacit\xE0 motorie</div>
            <div class="psy-col">
              <div class="psy-row"><div class="info-label">Coordinazione</div><div class="psy-dots">${dotsRo(((_a2 = p.capacita) == null ? void 0 : _a2.coordinazione) || 0)}</div></div>
              <div class="psy-row"><div class="info-label">Propriocezione</div><div class="psy-dots">${dotsRo(((_b2 = p.capacita) == null ? void 0 : _b2.propriocezione) || 0)}</div></div>
              <div class="psy-row"><div class="info-label">Vel. apprendimento</div><div class="psy-dots">${dotsRo(((_c = p.capacita) == null ? void 0 : _c.velocita_apprendimento) || 0)}</div></div>
              <div class="psy-row"><div class="info-label">Bilateralit\xE0</div><div class="psy-dots">${dotsRo(((_d = p.capacita) == null ? void 0 : _d.bilateralita) || 0)}</div></div>
            </div>
          </div>
          <div>
            <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:.6rem">Canale di apprendimento</div>
            <div class="psy-col">
              <div class="psy-row"><div class="info-label">Visivo</div><div class="psy-dots">${dotsRo(((_e = p.apprendimento) == null ? void 0 : _e.visivo) || 0)}</div></div>
              <div class="psy-row"><div class="info-label">Teorico</div><div class="psy-dots">${dotsRo(((_f = p.apprendimento) == null ? void 0 : _f.teorico) || 0)}</div></div>
              <div class="psy-row"><div class="info-label">Pratico</div><div class="psy-dots">${dotsRo(((_g = p.apprendimento) == null ? void 0 : _g.pratico) || 0)}</div></div>
            </div>
          </div>
        </div>
        <div style="border-top:1px solid var(--bordo);margin-top:1rem;padding-top:1rem">
          <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:.6rem">Profilo tecnico</div>
          <div class="info-grid">
            ${infoRow("Lato dominante", p.lato_dominante)}
            ${infoRow("Competenze iniziali", p.competenze)}
            ${infoRow("Sport praticati", p.sport)}
            ${infoRow("Talenti / Punti di forza", p.talenti)}
            ${infoRow("Paure / Blocchi", p.paure)}
            ${infoRow("Equipaggiamento", p.equipaggiamento)}
            ${infoRow("Obiettivi", p.obiettivi)}
          </div>
        </div>
      </div>

      <p class="sec-title">Progressi skill</p>
      ${progressiHtml}
    </div>

    <div id="scheda-panel-skill-tree" class="scheda-panel">
      <div class="card">
        ${renderSkillTree(allSkills, progressiMap, id, fakieProgressMap)}
      </div>
    </div>

    <div id="scheda-panel-lezioni" class="scheda-panel">
      <div class="lesson-years-tools">
        <p class="sec-title" style="margin:0">Lezioni registrate${lezioniCount ? ` (${lezioniCount})` : ""}</p>
      </div>
      <div class="card">${lezioniHtml}</div>
    </div>` : ""}
  `;
    requestAnimationFrame(() => motion.cards(document.getElementById("scheda-content")));
  });
}
function switchSchedaTab(name) {
  document.querySelectorAll(".scheda-tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  document.querySelectorAll(".scheda-panel").forEach((p) => p.classList.toggle("active", p.id === "scheda-panel-" + name));
  requestAnimationFrame(() => motion.cards(document.getElementById("scheda-panel-" + name)));
}
function renderSkillsCatalog() {
  const el = document.getElementById("skills-catalog-content");
  if (!el) return;
  const total = (allSkills == null ? void 0 : allSkills.length) || 0;
  const required = (allSkills || []).filter((skill) => skill.obbligatoria).length;
  el.innerHTML = `
    <div class="skill-tree-head">
      <div class="skill-tree-legend">
        <span style="font-weight:700;color:var(--testo)">${total} skill catalogo</span>
        <span>${required} nodi chiave</span>
        <span>${(allPrereqs == null ? void 0 : allPrereqs.length) || 0} prerequisiti</span>
      </div>
      <div class="skill-tree-actions">
        ${catalogSkillEditMode ? `<button type="button" class="btn btn-outline btn-sm" onclick="setCatalogSkillEditMode(false)">Fine modifica</button>
             <button type="button" class="btn btn-outline btn-sm" onclick="openSkillCatalogModal('catalog')">+ Skill</button>` : `<button type="button" class="btn btn-outline btn-sm" onclick="setCatalogSkillEditMode(true)">${editIcon()} Modifica catalogo</button>`}
      </div>
    </div>
    <div id="skills-catalog-status" class="msg" style="display:none"></div>
    ${renderCatalogSkillTree()}`;
  const btn = document.getElementById("skills-edit-toggle");
  if (btn) {
    btn.textContent = catalogSkillEditMode ? "Fine modifica" : "Modifica";
    btn.classList.toggle("btn-primary", catalogSkillEditMode);
    btn.classList.toggle("btn-outline", !catalogSkillEditMode);
  }
  requestAnimationFrame(() => motion.cards(el));
}
function setCatalogSkillEditMode(on) {
  catalogSkillEditMode = !!on;
  renderSkillsCatalog();
}
function renderCatalogSkillTree() {
  const RAMI = ["Equilibrio", "Andatura", "Frenata", "Rotazione", "Air"];
  const byRamo = { Equilibrio: [], Andatura: [], Frenata: [], Rotazione: [], Air: [], Altro: [] };
  (allSkills || []).forEach((skill) => {
    const ramo = RAMI.includes(skill.ramo) ? skill.ramo : "Altro";
    byRamo[ramo].push(skill);
  });
  const cols = [...RAMI, "Altro"].filter((ramo) => byRamo[ramo].length);
  if (!cols.length) return '<div class="empty">Nessuna skill nel catalogo.</div>';
  const colsHtml = cols.map((ramo) => {
    const nodes = byRamo[ramo].sort((a, b) => Number(a.livello || 0) - Number(b.livello || 0) || String(a.nome || "").localeCompare(String(b.nome || ""), "it", { sensitivity: "base" })).map((skill) => {
      var _a2;
      const reqCount = allPrereqs.filter((row) => row.skill_id === skill.id).length;
      const unlockCount = allPrereqs.filter((row) => row.richiede_skill_id === skill.id).length;
      const variantInfo = variantParentInfoForSkill(skill);
      const nodeClass = [skill.obbligatoria ? "sn2" : "sn0", variantInfo ? "variant" : ""].filter(Boolean).join(" ");
      return `<div class="skill-node ${nodeClass}" data-skill-id="${skill.id}" onclick="openSkillDetailModal('${skill.id}')">
          <div class="skill-node-main">
            <span class="sn-icon" style="${skill.obbligatoria ? "color:var(--blu)" : "color:var(--muted)"}">${skill.obbligatoria ? "\u25CF" : "\u25CB"}</span>
            <span class="sn-name">${esc(skill.nome)}</span>
            <span class="sn-lv">Lv ${esc(skill.livello || "-")}</span>
          </div>
          <div class="skill-node-tracks">
            <span class="skill-track-btn">${esc(openClosedLabel(skill.open_closed) || "Open/Closed n.d.")}</span>
            ${variantInfo ? `<span class="skill-track-btn">Variante di ${esc(((_a2 = variantInfo.parentSkill) == null ? void 0 : _a2.nome) || variantInfo.parentName || "-")}</span>` : ""}
            <span class="skill-track-btn">Req ${reqCount}</span>
            <span class="skill-track-btn">Sblocca ${unlockCount}</span>
          </div>
          ${catalogSkillEditMode ? `<button type="button" class="skill-delete-btn" title="Cancella skill" onclick="event.stopPropagation(); openSkillCatalogModal('catalog', null, '${skill.id}')">\xD7</button>` : ""}
        </div>`;
    }).join("");
    return `<div><div class="skill-col-header">${esc(ramo)}</div>${nodes}</div>`;
  }).join("");
  return `<div class="skill-tree-wrap${catalogSkillEditMode ? " is-editing" : ""}">${colsHtml}</div>`;
}
function renderSkillTree(allSkills2, progressiMap, allievoId, fakieProgressMap = {}) {
  var _a2;
  const RAMI = ["Equilibrio", "Andatura", "Frenata", "Rotazione", "Air"];
  const ICONS = ["\u25CB", "\u25D0", "\u25CF", "\u2605"];
  const ICON_COLORS = ["color:var(--muted)", "color:#facc15", "color:var(--blu)", "color:var(--success)"];
  const byRamo = { Equilibrio: [], Andatura: [], Frenata: [], Rotazione: [], Air: [], Altro: [] };
  (allSkills2 || []).forEach((s) => {
    const r = RAMI.includes(s.ramo) ? s.ramo : "Altro";
    byRamo[r].push(s);
  });
  const cols = [...RAMI, "Altro"].filter((r) => byRamo[r].length);
  const acquired = (allSkills2 || []).filter((s) => {
    var _a3;
    return ((_a3 = progressiMap[s.id]) != null ? _a3 : 0) >= 2;
  }).length;
  const total = (_a2 = allSkills2 == null ? void 0 : allSkills2.length) != null ? _a2 : 0;
  const pct = total ? Math.round(acquired / total * 100) : 0;
  const head = `
    <div class="skill-tree-head">
      <div class="skill-tree-legend">
        <span><span style="color:var(--muted)">\u25CB</span> Non iniziata</span>
        <span><span style="color:#facc15">\u25D0</span> In corso</span>
        <span><span style="color:var(--blu)">\u25CF</span> Raffinamento</span>
        <span><span style="color:var(--success)">\u2605</span> Completata</span>
        <span style="font-weight:700;color:var(--testo)">${acquired}/${total} acquisite \xB7 ${pct}%</span>
      </div>
      <div class="skill-tree-actions">
        ${skillTreeEditMode ? `<button type="button" class="btn btn-outline btn-sm" onclick="setSkillTreeEditMode('${allievoId}',false)">Annulla</button>
             <button type="button" class="btn btn-outline btn-sm" onclick="openSkillCatalogModal('tree')">+ Skill</button>
             <button type="button" class="btn btn-primary btn-sm" onclick="salvaSkillTreeManuale('${allievoId}')">Salva skill tree</button>` : `<button type="button" class="btn btn-outline btn-sm" onclick="setSkillTreeEditMode('${allievoId}',true)">${editIcon()} Modifica manualmente</button>`}
      </div>
    </div>`;
  const colsHtml = cols.map((ramo) => {
    const nodes = byRamo[ramo].map((s) => {
      var _a3, _b2;
      const stadio = (_a3 = progressiMap[s.id]) != null ? _a3 : 0;
      const fakieStadio = Number(((_b2 = fakieProgressMap[s.id]) == null ? void 0 : _b2.stadio) || 0);
      const nodeStadio = Math.max(stadio, fakieStadio);
      const variantInfo = variantParentInfoForSkill(s);
      return `<div class="skill-node sn${nodeStadio}${variantInfo ? " variant" : ""}" data-skill-id="${s.id}" data-current-stadio="${stadio}" data-stadio="${stadio}" data-current-fakie-stadio="${fakieStadio}" data-fakie-stadio="${fakieStadio}" onclick="openSkillDetailFromNode(this)">
        <div class="skill-node-main">
          <span class="sn-icon" style="${ICON_COLORS[nodeStadio]}">${ICONS[nodeStadio]}</span>
          <span class="sn-name">${esc(s.nome)}</span>
          <span class="sn-lv">Lv ${s.livello}</span>
        </div>
        <div class="skill-node-tracks">
          ${renderSkillTrackButton("frontale", stadio, skillTreeEditMode)}
          ${renderSkillTrackButton("fakie", fakieStadio, skillTreeEditMode)}
          ${variantInfo ? `<span class="skill-track-btn">Variante</span>` : ""}
        </div>
        ${skillTreeEditMode ? `<button type="button" class="skill-delete-btn" title="Cancella skill" onclick="event.stopPropagation(); openSkillCatalogModal('tree', null, '${s.id}')">\xD7</button>` : ""}
      </div>`;
    }).join("");
    return `<div><div class="skill-col-header">${esc(ramo)}</div>${nodes}</div>`;
  }).join("");
  return `
    ${head}
    <div id="skill-tree-status" class="msg" style="display:none"></div>
    <div class="skill-tree-wrap${skillTreeEditMode ? " is-editing" : ""}">
      ${colsHtml}
    </div>`;
}
function renderSkillTrackButton(track, stadio, editable) {
  const label = track === "fakie" ? "Fakie" : "Frontale";
  const text = `${label} ${stadio ? stadio : "-"}`;
  return `<button type="button" class="skill-track-btn sn${stadio}" data-track="${track}" ${editable ? 'onclick="event.stopPropagation(); toggleSkillTreeTrack(this)"' : "disabled"}>${text}</button>`;
}
function toggleSkillTreeTrack(btn) {
  const node = btn.closest(".skill-node");
  const track = btn.dataset.track || "frontale";
  const key = track === "fakie" ? "fakieStadio" : "stadio";
  const next = ((parseInt(node.dataset[key] || "0", 10) || 0) + 1) % 4;
  node.dataset[key] = String(next);
  btn.textContent = `${track === "fakie" ? "Fakie" : "Frontale"} ${next ? next : "-"}`;
  btn.classList.remove("sn0", "sn1", "sn2", "sn3");
  btn.classList.add(`sn${next}`);
  updateSkillTreeNodeVisual(node);
}
function updateSkillTreeNodeVisual(node) {
  const icons = ["\u25CB", "\u25D0", "\u25CF", "\u2605"];
  const iconColors = ["color:var(--muted)", "color:#facc15", "color:var(--blu)", "color:var(--success)"];
  const next = Math.max(parseInt(node.dataset.stadio || "0", 10) || 0, parseInt(node.dataset.fakieStadio || "0", 10) || 0);
  node.classList.remove("sn0", "sn1", "sn2", "sn3");
  node.classList.add(`sn${next}`);
  const icon = node.querySelector(".sn-icon");
  if (icon) {
    icon.textContent = icons[next];
    icon.setAttribute("style", iconColors[next]);
  }
}
function stageLabelShort(stadio) {
  return stadio ? stadioLabel(stadio) : "Non iniziata";
}
function skillDetailMeta(skill) {
  return [
    skill.ramo || "Altro",
    skill.blocco,
    skill.livello ? `Livello ${skill.livello}` : "",
    openClosedLabel(skill.open_closed),
    skill.obbligatoria ? "Obbligatoria" : "",
    isVariantSkill(skill) ? "Variante" : ""
  ].filter(Boolean);
}
function openClosedLabel(value) {
  const raw = String(value || "").toUpperCase();
  if (raw === "CLOSED") return "Closed: gesto definito";
  if (raw === "OPEN") return "Open: adattiva";
  return value || "";
}
function openClosedHelp(value) {
  const raw = String(value || "").toUpperCase();
  if (raw === "CLOSED") return "Closed significa che la skill ha una forma abbastanza precisa: partenza, gesto e criterio di riuscita sono chiari.";
  if (raw === "OPEN") return "Open significa che la skill si adatta molto al contesto: velocita, spazio, traiettoria o lettura della situazione contano piu di una forma unica.";
  return "";
}
function skillCharacteristicTags(skill) {
  const tags = [];
  const nature = openClosedLabel(skill.open_closed);
  if (nature) tags.push(nature);
  if (skill.obbligatoria) tags.push("Nodo chiave");
  if (skill.lato_sx_nome || skill.lato_dx_nome) tags.push("Lavoro per lato");
  const params = declaredParamSnapshot(skill);
  params.filter(([, value, , declared]) => declared && value !== "Non dichiarato").forEach(([label, value]) => tags.push(`${label}: ${value}`));
  const hasAsimmetria = params.some(([, value, key, declared]) => key === "asimmetria" && declared && value !== "Non dichiarato");
  if (!hasAsimmetria && skill.e_bilaterale) tags.push("Asimmetria: Bilateralita richiesta");
  return [...new Set(tags)];
}
function renderSkillCharacteristicTags(skill) {
  const tags = skillCharacteristicTags(skill);
  if (!tags.length) return '<div class="empty">Nessuna caratteristica registrata.</div>';
  return `<div class="skill-characteristics">${tags.map((tag) => `<span class="skill-characteristic">${esc(tag)}</span>`).join("")}</div>`;
}
function splitVariantText(value) {
  return String(value || "").split(/\n|,/).map((item) => item.trim()).filter(Boolean);
}
function skillVariants(skill) {
  const explicit = Array.isArray(skill.varianti) ? skill.varianti : [];
  const fromDescription = String(skill.descrizione || "").match(/Varianti:\s*([^.\n]+)/i);
  return [...new Set([
    ...explicit,
    ...fromDescription ? splitVariantText(fromDescription[1]) : []
  ].map((item) => String(item).trim()).filter(Boolean))];
}
function renderSkillVariants(skill) {
  const variants = skillVariants(skill);
  if (!variants.length) return '<div class="empty">Nessuna variante registrata.</div>';
  return `<div class="skill-characteristics">${variants.map((variant) => `<span class="skill-characteristic">${esc(variant)}</span>`).join("")}</div>`;
}
function skillDefinitionForSkill(skill) {
  if (!skill) return null;
  const skillName = normalizeText(skill.nome);
  return (skillDefinitions || []).find(
    (def) => def.skill_id && String(def.skill_id) === String(skill.id) || normalizeText(def.skill_nome) === skillName
  ) || null;
}
function variantMotherName(def) {
  var _a2;
  return ((_a2 = def == null ? void 0 : def.variante_match) == null ? void 0 : _a2.skill_nome) || (def == null ? void 0 : def.variante_di) || "";
}
function variantMotherSkillId(def) {
  var _a2;
  return ((_a2 = def == null ? void 0 : def.variante_match) == null ? void 0 : _a2.skill_id) || null;
}
function findSkillByDefinition(def) {
  if (!def) return null;
  if (def.skill_id) {
    const byId = allSkills.find((skill) => String(skill.id) === String(def.skill_id));
    if (byId) return byId;
  }
  const name = normalizeText(def.skill_nome);
  return allSkills.find((skill) => normalizeText(skill.nome) === name) || null;
}
function variantParentInfoForSkill(skill) {
  const def = skillDefinitionForSkill(skill);
  if (!(def == null ? void 0 : def.e_variante)) return null;
  const parentId = variantMotherSkillId(def);
  const parentName = variantMotherName(def);
  const parentSkill = parentId ? allSkills.find((row) => String(row.id) === String(parentId)) : allSkills.find((row) => normalizeText(row.nome) === normalizeText(parentName));
  return { def, parentSkill, parentName };
}
function variantChildrenForSkill(skill) {
  if (!skill) return [];
  const targetId = String(skill.id);
  const targetName = normalizeText(skill.nome);
  return (skillDefinitions || []).filter((def) => def.e_variante).filter((def) => {
    const parentId = variantMotherSkillId(def);
    const parentName = variantMotherName(def);
    return parentId && String(parentId) === targetId || normalizeText(parentName) === targetName;
  }).map((def) => ({ def, skill: findSkillByDefinition(def) })).filter((row) => {
    var _a2;
    return ((_a2 = row.skill) == null ? void 0 : _a2.id) !== skill.id;
  }).sort((a, b) => {
    var _a2, _b2;
    return String(((_a2 = a.skill) == null ? void 0 : _a2.nome) || a.def.skill_nome || "").localeCompare(String(((_b2 = b.skill) == null ? void 0 : _b2.nome) || b.def.skill_nome || ""), "it", { sensitivity: "base" });
  });
}
function isVariantSkill(skill) {
  return !!variantParentInfoForSkill(skill);
}
function renderVariantSkillList(rows) {
  if (!rows.length) return '<div class="empty">Nessuna skill variante collegata.</div>';
  return `<div class="skill-detail-list">${rows.map((row) => {
    var _a2;
    const name = ((_a2 = row.skill) == null ? void 0 : _a2.nome) || row.def.skill_nome || "Variante senza nome";
    const meta = row.skill ? skillMetaLabel(row.skill) : "Definita nel questionario, non ancora nel catalogo skill";
    const click = row.skill ? ` onclick="openSkillDetailModal('${row.skill.id}')"` : "";
    return `<div class="skill-detail-item"${click}>
      <strong>${esc(name)}</strong>
      <span>${esc(meta)}</span>
    </div>`;
  }).join("")}</div>`;
}
function relatedSkillRows(skillId, direction) {
  const rows = direction === "requires" ? allPrereqs.filter((row) => row.skill_id === skillId).map((row) => __spreadProps(__spreadValues({}, row), { skill: allSkills.find((skill) => skill.id === row.richiede_skill_id) })) : allPrereqs.filter((row) => row.richiede_skill_id === skillId).map((row) => __spreadProps(__spreadValues({}, row), { skill: allSkills.find((skill) => skill.id === row.skill_id) }));
  return rows.filter((row) => row.skill).sort((a, b) => Number(a.skill.livello || 0) - Number(b.skill.livello || 0) || String(a.skill.nome || "").localeCompare(String(b.skill.nome || ""), "it", { sensitivity: "base" }));
}
function renderSkillDetailList(rows, emptyText) {
  if (!rows.length) return `<div class="empty">${esc(emptyText)}</div>`;
  return `<div class="skill-detail-list">${rows.map((row) => `
    <div class="skill-detail-item">
      <strong>${esc(row.skill.nome)}</strong>
      <span>${esc(skillMetaLabel(row.skill))}${row.stadio_minimo ? ` \xB7 stadio minimo ${esc(row.stadio_minimo)}` : ""}${row.note ? ` \xB7 ${esc(row.note)}` : ""}</span>
    </div>`).join("")}</div>`;
}
function renderSkillDetailInfoRow(label, value) {
  if (value === void 0 || value === null || value === "") return "";
  return `<div><div class="info-label">${esc(label)}</div><div>${esc(String(value))}</div></div>`;
}
function openSkillDetailFromNode(node) {
  if (!(node == null ? void 0 : node.dataset.skillId)) return;
  openSkillDetailModal(node.dataset.skillId, {
    allievoId: currentSchedaId,
    stadio: parseInt(node.dataset.stadio || "0", 10) || 0,
    fakieStadio: parseInt(node.dataset.fakieStadio || "0", 10) || 0
  });
}
function openSkillDetailModal(skillId, context = {}) {
  var _a2, _b2, _c, _d, _e, _f;
  const skill = allSkills.find((s) => s.id === skillId);
  const content = document.getElementById("skill-detail-content");
  if (!skill || !content) return;
  const requires = relatedSkillRows(skillId, "requires");
  const unlocks = relatedSkillRows(skillId, "unlocks");
  const variantParent = variantParentInfoForSkill(skill);
  const variantChildren = variantChildrenForSkill(skill);
  const stadio = Number((_b2 = (_a2 = context.stadio) != null ? _a2 : context.allievoId ? progressMapForAllievo(context.allievoId).get(skillId) : 0) != null ? _b2 : 0);
  const fakieStadio = Number((_e = (_d = context.fakieStadio) != null ? _d : context.allievoId ? (_c = fakieProgressMapForAllievo(context.allievoId)[skillId]) == null ? void 0 : _c.stadio : 0) != null ? _e : 0);
  const sideNames = [skill.lato_sx_nome && `sx: ${skill.lato_sx_nome}`, skill.lato_dx_nome && `dx: ${skill.lato_dx_nome}`].filter(Boolean).join(" \xB7 ");
  skillDetailContext = { skillId };
  content.innerHTML = `
    <div class="skill-detail-head">
      <div>
        <div class="skill-detail-title">${esc(skill.nome)}</div>
        <div class="skill-detail-meta">
          ${skillDetailMeta(skill).map((item) => `<span class="skill-detail-chip">${esc(item)}</span>`).join("")}
        </div>
      </div>
      <div class="skill-detail-stage">
        <span class="st st${stadio}">Frontale: ${esc(stageLabelShort(stadio))}</span>
        <span class="st st${fakieStadio}">Fakie: ${esc(stageLabelShort(fakieStadio))}</span>
      </div>
    </div>

    <div class="skill-detail-section">
      <h4>Descrizione</h4>
      <div class="skill-detail-text">${skill.descrizione ? esc(skill.descrizione) : '<span class="empty">Nessuna descrizione registrata.</span>'}</div>
      ${openClosedHelp(skill.open_closed) ? `<div class="skill-detail-help">${esc(openClosedHelp(skill.open_closed))}</div>` : ""}
    </div>

    <div class="skill-detail-section">
      <h4>Caratteristiche</h4>
      ${renderSkillCharacteristicTags(skill)}
    </div>

    <div class="skill-detail-section">
      <h4>Varianti</h4>
      ${renderSkillVariants(skill)}
      <div class="skill-detail-help">Le varianti descrivono modi di eseguire la stessa skill. Se una variante richiede prerequisiti o progressione diversa, conviene crearla come skill autonoma e collegarla nei requisiti.</div>
    </div>

    ${variantParent ? `
      <div class="skill-detail-section">
        <h4>Variante di</h4>
        <div class="skill-detail-list">
          <div class="skill-detail-item"${variantParent.parentSkill ? ` onclick="openSkillDetailModal('${variantParent.parentSkill.id}')"` : ""}>
            <strong>${esc(((_f = variantParent.parentSkill) == null ? void 0 : _f.nome) || variantParent.parentName || "Skill madre non agganciata")}</strong>
            <span>${esc(variantParent.parentSkill ? skillMetaLabel(variantParent.parentSkill) : "Definita nel questionario")}</span>
          </div>
        </div>
      </div>` : ""}

    <div class="skill-detail-section">
      <h4>Skill varianti</h4>
      ${renderVariantSkillList(variantChildren)}
    </div>

    <div class="skill-detail-section">
      <h4>Requisiti</h4>
      ${renderSkillDetailList(requires, "Nessun prerequisito registrato.")}
    </div>

    <div class="skill-detail-section">
      <h4>Sblocca</h4>
      ${renderSkillDetailList(unlocks, "Nessuna skill dipendente registrata.")}
    </div>

    <div class="skill-detail-section">
      <h4>Dettagli tecnici</h4>
      <div class="info-grid">
        ${renderSkillDetailInfoRow("Tipo", skill.tipo)}
        ${renderSkillDetailInfoRow("Ramo", skill.ramo)}
        ${renderSkillDetailInfoRow("Blocco", skill.blocco)}
        ${renderSkillDetailInfoRow("Livello", skill.livello)}
        ${renderSkillDetailInfoRow("Open / closed", openClosedLabel(skill.open_closed))}
        ${renderSkillDetailInfoRow("Lati", sideNames)}
      </div>
    </div>`;
  document.getElementById("modal-skill-detail").hidden = false;
}
function chiudiSkillDetailModal() {
  document.getElementById("modal-skill-detail").hidden = true;
  skillDetailContext = null;
}
function openSkillCatalogFromDetail() {
  const skillId = (skillDetailContext == null ? void 0 : skillDetailContext.skillId) || "";
  chiudiSkillDetailModal();
  openSkillCatalogModal("tree", null, skillId);
}
function setSkillTreeEditMode(allievoId, on) {
  return __async(this, null, function* () {
    skillTreeEditMode = !!on;
    yield loadScheda(allievoId);
    switchSchedaTab("skill-tree");
  });
}
function setSkillTreeStatus(text, kind = "") {
  const el = document.getElementById("skill-tree-status");
  if (!el) return;
  el.className = `msg ${kind}`.trim();
  el.style.display = text ? "block" : "none";
  el.textContent = text || "";
}
function salvaSkillTreeManuale(allievoId) {
  return __async(this, null, function* () {
    const nodes = [...document.querySelectorAll(".skill-tree-wrap.is-editing .skill-node[data-skill-id]")];
    if (!nodes.length) return;
    const btn = document.querySelector(".skill-tree-actions .btn-primary");
    const oldText = btn == null ? void 0 : btn.textContent;
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Salvataggio...";
    }
    setSkillTreeStatus("", "");
    try {
      const oggi = localDateIso();
      const changed = nodes.map((node) => ({
        skill_id: node.dataset.skillId,
        stadio: parseInt(node.dataset.stadio || "0", 10) || 0,
        previous: parseInt(node.dataset.currentStadio || "0", 10) || 0,
        fakieStadio: parseInt(node.dataset.fakieStadio || "0", 10) || 0,
        previousFakie: parseInt(node.dataset.currentFakieStadio || "0", 10) || 0
      })).filter((row) => row.stadio !== row.previous || row.fakieStadio !== row.previousFakie);
      for (const row of changed) {
        if (row.stadio !== row.previous) {
          const { error: deleteError } = yield sb.from("progressi_allievo").delete().eq("allievo_id", allievoId).eq("skill_id", row.skill_id);
          if (deleteError) throw deleteError;
          if (row.stadio > 0) {
            const payload = {
              allievo_id: allievoId,
              skill_id: row.skill_id,
              stadio: row.stadio,
              data_inizio: oggi,
              data_acquisizione: row.stadio >= 2 ? oggi : null,
              data_perfezionamento: row.stadio >= 3 ? oggi : null
            };
            const { error } = yield sb.from("progressi_allievo").insert(payload);
            if (error) throw error;
          }
        }
      }
      if (changed.some((row) => row.fakieStadio !== row.previousFakie)) {
        yield salvaFakieProgressiAllievo(allievoId, Object.fromEntries(changed.filter((row) => row.fakieStadio !== row.previousFakie).map((row) => [row.skill_id, row.fakieStadio])));
      }
      const changedIds = new Set(changed.filter((row) => row.stadio !== row.previous).map((row) => row.skill_id));
      allProgressi = allProgressi.filter((row) => !(row.allievo_id === allievoId && changedIds.has(row.skill_id))).concat(changed.filter((row) => row.stadio !== row.previous && row.stadio > 0).map((row) => ({ allievo_id: allievoId, skill_id: row.skill_id, stadio: row.stadio })));
      skillTreeEditMode = false;
      yield loadScheda(allievoId);
      switchSchedaTab("skill-tree");
    } catch (e) {
      setSkillTreeStatus(e.message || "Errore nel salvataggio della skill tree.", "msg-err");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = oldText;
      }
    }
  });
}
function skillCatalogBranchOptions(selected = "") {
  const preferred = ["Equilibrio", "Andatura", "Frenata", "Rotazione", "Air", "Altro"];
  const found = [...new Set((allSkills || []).map((skill) => skill.ramo || "Altro").filter(Boolean))];
  const branches = [...preferred, ...found.filter((branch) => !preferred.includes(branch)).sort((a, b) => a.localeCompare(b, "it", { sensitivity: "base" }))];
  return branches.map((branch) => `<option value="${esc(branch)}" ${branch === selected ? "selected" : ""}>${esc(branch)}</option>`).join("");
}
function setSkillCatalogStatus(text, kind = "") {
  const el = document.getElementById("skill-catalog-status");
  if (!el) return;
  el.className = `msg ${kind}`.trim();
  el.style.display = text ? "block" : "none";
  el.textContent = text || "";
}
function setSkillDeleteWarning(html = "") {
  const el = document.getElementById("skill-delete-warning");
  if (!el) return;
  el.innerHTML = html || "";
  el.classList.toggle("show", !!html);
}
function refreshSkillDeleteOptions(selectedSkillId = "") {
  const select = document.getElementById("skill-delete-select");
  if (!select) return;
  const skills = sortedSkillsForLesson();
  select.innerHTML = `<option value="">\u2014 Scegli skill \u2014</option>${skills.map((skill) => `<option value="${skill.id}" ${skill.id === selectedSkillId ? "selected" : ""}>${esc(skill.nome)} \xB7 ${esc(skillMetaLabel(skill))}</option>`).join("")}`;
  if (selectedSkillId && [...select.options].some((option) => option.value === selectedSkillId)) select.value = selectedSkillId;
  select.onchange = () => setSkillDeleteWarning("");
}
function refreshSkillVariantParentOptions(selectedSkillId = "") {
  const select = document.getElementById("skill-new-variant-parent");
  if (!select) return;
  const skills = sortedSkillsForLesson();
  select.innerHTML = `<option value="">\u2014 Scegli skill madre \u2014</option>${skills.map((skill) => `<option value="${skill.id}" ${skill.id === selectedSkillId ? "selected" : ""}>${esc(skill.nome)} \xB7 ${esc(skillMetaLabel(skill))}</option>`).join("")}`;
}
function toggleNewSkillVariantParent() {
  var _a2, _b2;
  const checked = !!((_a2 = document.getElementById("skill-new-is-variant")) == null ? void 0 : _a2.checked);
  const field = document.getElementById("skill-new-variant-parent-field");
  if (field) field.hidden = !checked;
  if (checked) refreshSkillVariantParentOptions(((_b2 = document.getElementById("skill-new-variant-parent")) == null ? void 0 : _b2.value) || "");
}
function renderSkillParamControls() {
  const el = document.getElementById("skill-new-params");
  if (!el) return;
  el.innerHTML = TUNING_PARAMS.map((param) => `
    <div class="field">
      <label>${esc(param.label)}</label>
      <select class="skill-new-param" data-param="${esc(param.key)}">
        <option value="">\u2014 Non dichiarato \u2014</option>
        ${param.scale.map((label, index) => `<option value="${index + 1}">${index + 1} \xB7 ${esc(label)}</option>`).join("")}
      </select>
    </div>`).join("");
}
function collectSkillParamValues() {
  const values = {};
  document.querySelectorAll(".skill-new-param[data-param]").forEach((select) => {
    if (select.value) values[`param_${select.dataset.param}`] = Number(select.value);
  });
  return values;
}
function resetSkillParamControls() {
  document.querySelectorAll(".skill-new-param[data-param]").forEach((select) => {
    select.value = "";
  });
}
function openSkillCatalogModal(source = "generic", ownerId = null, deleteSkillId = "") {
  skillCatalogContext = { source, ownerId };
  document.getElementById("skill-new-name").value = "";
  document.getElementById("skill-new-level").value = "1";
  document.getElementById("skill-new-description").value = "";
  document.getElementById("skill-new-variants").value = "";
  document.getElementById("skill-new-branch").innerHTML = skillCatalogBranchOptions("Equilibrio");
  document.getElementById("skill-new-block").value = "Base";
  document.getElementById("skill-new-open-closed").value = "OPEN";
  document.getElementById("skill-new-required").checked = false;
  document.getElementById("skill-new-is-variant").checked = false;
  refreshSkillVariantParentOptions();
  toggleNewSkillVariantParent();
  renderSkillParamControls();
  resetSkillParamControls();
  refreshSkillDeleteOptions(deleteSkillId);
  setSkillDeleteWarning("");
  setSkillCatalogStatus("", "");
  document.getElementById("modal-skill-catalog").hidden = false;
  requestAnimationFrame(() => {
    var _a2;
    return (_a2 = document.getElementById(deleteSkillId ? "skill-delete-select" : "skill-new-name")) == null ? void 0 : _a2.focus();
  });
}
function chiudiSkillCatalogModal() {
  document.getElementById("modal-skill-catalog").hidden = true;
  skillCatalogContext = null;
}
function openSelectedSkillDetailFromCatalog() {
  var _a2;
  const skillId = (_a2 = document.getElementById("skill-delete-select")) == null ? void 0 : _a2.value;
  if (!skillId) {
    setSkillCatalogStatus("Scegli una skill da vedere.", "msg-info");
    return;
  }
  document.getElementById("modal-skill-catalog").hidden = true;
  openSkillDetailModal(skillId, { allievoId: currentSchedaId });
}
function collectSkillTreeEditState() {
  return [...document.querySelectorAll(".skill-tree-wrap.is-editing .skill-node[data-skill-id]")].map((node) => [node.dataset.skillId, {
    stadio: parseInt(node.dataset.stadio || "0", 10) || 0,
    fakieStadio: parseInt(node.dataset.fakieStadio || "0", 10) || 0
  }]);
}
function applySkillTreeEditState(entries) {
  const state = new Map(entries || []);
  document.querySelectorAll(".skill-tree-wrap.is-editing .skill-node[data-skill-id]").forEach((node) => {
    const saved = state.get(node.dataset.skillId);
    if (!saved) return;
    node.dataset.stadio = String(saved.stadio || 0);
    node.dataset.fakieStadio = String(saved.fakieStadio || 0);
    node.querySelectorAll(".skill-track-btn[data-track]").forEach((btn) => {
      const value = btn.dataset.track === "fakie" ? saved.fakieStadio || 0 : saved.stadio || 0;
      btn.textContent = `${btn.dataset.track === "fakie" ? "Fakie" : "Frontale"} ${value ? value : "-"}`;
      btn.classList.remove("sn0", "sn1", "sn2", "sn3");
      btn.classList.add(`sn${value}`);
    });
    updateSkillTreeNodeVisual(node);
  });
}
function refreshSkillCatalogConsumers(newSkillId = "") {
  return __async(this, null, function* () {
    var _a2, _b2;
    refreshLessonSkillRows(newSkillId);
    refreshSkillDeleteOptions();
    refreshSkillVariantParentOptions();
    renderTuningStats();
    if (!((_a2 = document.getElementById("view-skills")) == null ? void 0 : _a2.hidden)) renderSkillsCatalog();
    if (currentSchedaId && !((_b2 = document.getElementById("view-scheda")) == null ? void 0 : _b2.hidden) && skillTreeEditMode) {
      const state = collectSkillTreeEditState();
      yield loadScheda(currentSchedaId);
      switchSchedaTab("skill-tree");
      applySkillTreeEditState(state);
    }
  });
}
function refreshLessonSkillRows(newSkillId = "") {
  const rows = [...document.querySelectorAll(".skill-row")];
  rows.forEach((row) => {
    const branchSelect = row.querySelector(".skill-branch");
    const skillSelect = row.querySelector(".skill-select");
    if (!branchSelect || !skillSelect) return;
    const selected = skillSelect.value;
    const selectedSkill = allSkills.find((skill) => skill.id === selected);
    const branch = (selectedSkill == null ? void 0 : selectedSkill.ramo) || branchSelect.value || "";
    branchSelect.innerHTML = renderLessonBranchOptions(branch);
    branchSelect.value = [...branchSelect.options].some((option) => option.value === branch) ? branch : "";
    skillSelect.innerHTML = `<option value="">\u2014 Skill \u2014</option>${renderLessonSkillOptions(selected, "", branchSelect.value)}`;
    if ([...skillSelect.options].some((option) => option.value === selected)) skillSelect.value = selected;
  });
  const ownerId = (skillCatalogContext == null ? void 0 : skillCatalogContext.source) === "lesson" ? skillCatalogContext.ownerId : null;
  if (newSkillId && ownerId) selectNewSkillInLessonOwner(ownerId, newSkillId);
}
function selectNewSkillInLessonOwner(ownerId, skillId) {
  const skill = allSkills.find((s) => s.id === skillId);
  const container = document.getElementById(`skill-rows-${ownerId}`);
  if (!skill || !container) return;
  let row = [...container.querySelectorAll(".skill-row")].find((item) => {
    var _a2;
    return !((_a2 = item.querySelector(".skill-select")) == null ? void 0 : _a2.value);
  });
  if (!row) {
    aggiungiSkillRow(ownerId);
    row = [...container.querySelectorAll(".skill-row")].at(-1);
  }
  const branchSelect = row == null ? void 0 : row.querySelector(".skill-branch");
  const skillSelect = row == null ? void 0 : row.querySelector(".skill-select");
  if (!branchSelect || !skillSelect) return;
  branchSelect.value = skill.ramo || "";
  filterSkillRow(branchSelect);
  skillSelect.value = skillId;
  onLessonSkillSelected(skillSelect);
}
function creaSkillCatalogo() {
  return __async(this, null, function* () {
    var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j;
    const btn = document.getElementById("btn-create-skill");
    const oldText = btn == null ? void 0 : btn.textContent;
    const nome = (_a2 = document.getElementById("skill-new-name")) == null ? void 0 : _a2.value.trim();
    const ramo = ((_b2 = document.getElementById("skill-new-branch")) == null ? void 0 : _b2.value) || "Altro";
    const livello = parseInt(((_c = document.getElementById("skill-new-level")) == null ? void 0 : _c.value) || "1", 10) || 1;
    const blocco = ((_d = document.getElementById("skill-new-block")) == null ? void 0 : _d.value) || "Base";
    const openClosed = ((_e = document.getElementById("skill-new-open-closed")) == null ? void 0 : _e.value) || "OPEN";
    const obbligatoria = !!((_f = document.getElementById("skill-new-required")) == null ? void 0 : _f.checked);
    const descrizione = ((_g = document.getElementById("skill-new-description")) == null ? void 0 : _g.value.trim()) || null;
    const varianti = splitVariantText(((_h = document.getElementById("skill-new-variants")) == null ? void 0 : _h.value) || "");
    const isVariant = !!((_i = document.getElementById("skill-new-is-variant")) == null ? void 0 : _i.checked);
    const parentSkillId = ((_j = document.getElementById("skill-new-variant-parent")) == null ? void 0 : _j.value) || "";
    const parentSkill = allSkills.find((skill) => skill.id === parentSkillId);
    const paramValues = collectSkillParamValues();
    if (!nome) {
      setSkillCatalogStatus("Inserisci il nome della skill.", "msg-err");
      return;
    }
    if (allSkills.some((skill) => normalizeText(skill.nome) === normalizeText(nome))) {
      setSkillCatalogStatus("Esiste gia una skill con questo nome.", "msg-err");
      return;
    }
    if (isVariant && !parentSkill) {
      setSkillCatalogStatus("Scegli la skill madre della variante.", "msg-err");
      return;
    }
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Creo...";
    }
    setSkillCatalogStatus("", "");
    try {
      const descrizioneFinale = [
        descrizione,
        varianti.length ? `Varianti: ${varianti.join(", ")}.` : ""
      ].filter(Boolean).join("\n");
      let payload = __spreadValues({
        nome,
        ramo,
        livello,
        blocco,
        descrizione: descrizioneFinale || null,
        tipo: "RAMO",
        open_closed: openClosed,
        obbligatoria,
        e_bilaterale: false,
        lato_sx_nome: null,
        lato_dx_nome: null
      }, paramValues);
      let { data, error } = yield sb.from("skills").insert(payload).select("*").single();
      if (error && Object.keys(paramValues).some((key) => (error.message || error.details || error.hint || "").includes(key))) {
        Object.keys(paramValues).forEach((key) => delete payload[key]);
        ({ data, error } = yield sb.from("skills").insert(payload).select("*").single());
      }
      if (error) throw error;
      allSkills = [...allSkills, data].sort((a, b) => Number(a.livello || 0) - Number(b.livello || 0) || String(a.nome || "").localeCompare(String(b.nome || ""), "it", { sensitivity: "base" }));
      const variantDefinitionSaved = isVariant ? yield salvaDefinizioneVarianteSkill(data, parentSkill, varianti) : true;
      document.getElementById("skill-new-name").value = "";
      document.getElementById("skill-new-description").value = "";
      document.getElementById("skill-new-variants").value = "";
      document.getElementById("skill-new-is-variant").checked = false;
      toggleNewSkillVariantParent();
      resetSkillParamControls();
      yield refreshSkillCatalogConsumers(data.id);
      setSkillCatalogStatus(`Skill "${data.nome}" creata.${variantDefinitionSaved ? "" : " La relazione variante resta da salvare nel questionario."}`, "msg-ok");
    } catch (e) {
      setSkillCatalogStatus(e.message || "Errore durante la creazione della skill.", "msg-err");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = oldText;
      }
    }
  });
}
function optionalDelete(table, column, value) {
  return __async(this, null, function* () {
    const { error } = yield sb.from(table).delete().eq(column, value);
    if (error && !/does not exist|schema cache|column/i.test(error.message || "")) throw error;
  });
}
function optionalUpdate(table, column, value, payload) {
  return __async(this, null, function* () {
    const { error } = yield sb.from(table).update(payload).eq(column, value);
    if (error && !/does not exist|schema cache|column/i.test(error.message || "")) throw error;
  });
}
function fetchSkillDeleteUsage(skillId) {
  return __async(this, null, function* () {
    const [{ data: progressi, error: progressiError }, { data: lezioniSkills, error: lezioniError }] = yield Promise.all([
      sb.from("progressi_allievo").select("id, allievo_id, skill_id, stadio, stadio_lato_sx, stadio_lato_dx, data_inizio, data_acquisizione, data_perfezionamento, note_maestro").eq("skill_id", skillId),
      sb.from("lezioni_skills").select("id, allievo_id, lezione_id, skill_id, stadio_raggiunto, note, fakie, dimensioni").eq("skill_id", skillId)
    ]);
    if (progressiError) throw progressiError;
    if (lezioniError) throw lezioniError;
    const rowsProgressi = progressi || [];
    const rowsLezioni = lezioniSkills || [];
    const allievoIds = [...new Set([...rowsProgressi, ...rowsLezioni].map((row) => row.allievo_id).filter(Boolean))];
    const localAllievi = new Map((allAllievi || []).map((a) => [a.id, a]));
    const missingIds = allievoIds.filter((id) => !localAllievi.has(id));
    if (missingIds.length) {
      const { data, error } = yield sb.from("allievi").select("id, nome, cognome, nickname, stato").in("id", missingIds);
      if (!error) (data || []).forEach((a) => localAllievi.set(a.id, a));
    }
    const perAllievo = allievoIds.map((id) => {
      const a = localAllievi.get(id);
      const progressiAllievo = rowsProgressi.filter((row) => row.allievo_id === id);
      const lezioniAllievo = rowsLezioni.filter((row) => row.allievo_id === id);
      const nome = a ? [a.cognome, a.nome].filter(Boolean).join(" ") || a.nickname || id : id;
      return {
        id,
        nome,
        progressi: progressiAllievo.length,
        lezioni: new Set(lezioniAllievo.map((row) => row.lezione_id).filter(Boolean)).size || lezioniAllievo.length
      };
    }).sort((a, b) => a.nome.localeCompare(b.nome, "it", { sensitivity: "base" }));
    return {
      progressi: rowsProgressi,
      lezioniSkills: rowsLezioni,
      allievi: perAllievo,
      total: rowsProgressi.length + rowsLezioni.length
    };
  });
}
function renderSkillDeleteUsageWarning(skill, usage) {
  const progressiCount = usage.progressi.length;
  const lezioniCount = new Set(usage.lezioniSkills.map((row) => row.lezione_id).filter(Boolean)).size || usage.lezioniSkills.length;
  const shown = usage.allievi.slice(0, 10);
  const extra = usage.allievi.length - shown.length;
  const righeAllievi = shown.map((a) => {
    const parti = [];
    if (a.progressi) parti.push(`${a.progressi} progresso/i`);
    if (a.lezioni) parti.push(`${a.lezioni} lezione/i`);
    return `<li><strong>${esc(a.nome)}</strong>${parti.length ? ` \xB7 ${esc(parti.join(", "))}` : ""}</li>`;
  }).join("");
  return `
    <strong>Fermo: "${esc(skill.nome)}" risulta gia lavorata.</strong>
    <div style="margin-top:.36rem">Non la cancello secca perche e collegata a ${progressiCount} progresso/i e ${lezioniCount} lezione/i. Se va rimossa dal catalogo, sostituiscila con una skill corretta: lo storico verra spostato e nelle lezioni restera traccia del nome originale.</div>
    ${righeAllievi ? `<ul>${righeAllievi}${extra > 0 ? `<li><strong>+${extra}</strong> altri allievi</li>` : ""}</ul>` : ""}
    <div class="skill-delete-replace">
      <label for="skill-replace-select">Sostituisci con</label>
      <select id="skill-replace-select">${renderSkillReplacementOptions(skill.id)}</select>
      <button type="button" id="skill-replace-btn" class="btn btn-delete-soft btn-full" onclick="sostituisciSkillUsataDaCatalogo(${jsArg(skill.id)})">Sostituisci nello storico e rimuovi dal catalogo</button>
    </div>
    <div class="skill-delete-warning-note">Avviso rosso di compensazione: questa skill non viene persa, viene accorpata a quella scelta qui sopra.</div>`;
}
function renderSkillReplacementOptions(oldSkillId) {
  return `<option value="">\u2014 Scegli skill sostitutiva \u2014</option>${sortedSkillsForLesson().filter((skill) => String(skill.id) !== String(oldSkillId)).map((skill) => `<option value="${skill.id}">${esc(skill.nome)} \xB7 ${esc(skillMetaLabel(skill))}</option>`).join("")}`;
}
function mergeTextNotes(...values) {
  const parts = values.map((value) => String(value || "").trim()).filter(Boolean);
  return [...new Set(parts)].join(" / ") || null;
}
function mergeSkillReplacementTrail(dimensioni = {}, oldSkill, replacementSkill) {
  const clean = __spreadValues({}, dimensioni || {});
  const previous = Array.isArray(clean.skill_sostituzioni) ? clean.skill_sostituzioni : [];
  delete clean.skill_sostituzioni;
  return __spreadProps(__spreadValues({}, clean), {
    skill_sostituzioni: [
      ...previous,
      {
        da_id: oldSkill.id,
        da_nome: oldSkill.nome,
        a_id: replacementSkill.id,
        a_nome: replacementSkill.nome,
        sostituita_il: (/* @__PURE__ */ new Date()).toISOString()
      }
    ]
  });
}
function mergeLessonDimensionsForReplacement(existing = {}, incoming = {}, oldSkill, replacementSkill) {
  const existingTrail = Array.isArray(existing == null ? void 0 : existing.skill_sostituzioni) ? existing.skill_sostituzioni : [];
  const incomingTrail = Array.isArray(incoming == null ? void 0 : incoming.skill_sostituzioni) ? incoming.skill_sostituzioni : [];
  const cleanExisting = __spreadValues({}, existing || {});
  const cleanIncoming = __spreadValues({}, incoming || {});
  delete cleanExisting.skill_sostituzioni;
  delete cleanIncoming.skill_sostituzioni;
  const merged = mergeLessonDimensions(cleanExisting, cleanIncoming);
  merged.skill_sostituzioni = [
    ...existingTrail,
    ...incomingTrail,
    {
      da_id: oldSkill.id,
      da_nome: oldSkill.nome,
      a_id: replacementSkill.id,
      a_nome: replacementSkill.nome,
      sostituita_il: (/* @__PURE__ */ new Date()).toISOString()
    }
  ];
  return merged;
}
function latestSkillReplacementName(dimensioni = {}) {
  var _a2;
  const trail = Array.isArray(dimensioni == null ? void 0 : dimensioni.skill_sostituzioni) ? dimensioni.skill_sostituzioni : [];
  return trail.length ? (_a2 = trail[trail.length - 1]) == null ? void 0 : _a2.da_nome : "";
}
function maxNullableNumber(a, b) {
  const values = [a, b].map((value) => Number(value || 0)).filter((value) => value > 0);
  return values.length ? Math.max(...values) : null;
}
function earliestDate(...values) {
  const dates = values.map((value) => String(value || "").trim()).filter(Boolean).sort();
  return dates[0] || null;
}
function firstDate(...values) {
  return values.map((value) => String(value || "").trim()).find(Boolean) || null;
}
function progressReplacementPayload(oldRow, existingRow, replacementSkillId, oldSkill) {
  const marker = `Skill sostituita da "${oldSkill.nome}" il ${localDateIso()}.`;
  return {
    allievo_id: oldRow.allievo_id,
    skill_id: replacementSkillId,
    stadio: Math.max(Number((existingRow == null ? void 0 : existingRow.stadio) || 0), Number(oldRow.stadio || 0)),
    stadio_lato_sx: maxNullableNumber(existingRow == null ? void 0 : existingRow.stadio_lato_sx, oldRow.stadio_lato_sx),
    stadio_lato_dx: maxNullableNumber(existingRow == null ? void 0 : existingRow.stadio_lato_dx, oldRow.stadio_lato_dx),
    data_inizio: earliestDate(existingRow == null ? void 0 : existingRow.data_inizio, oldRow.data_inizio),
    data_acquisizione: firstDate(existingRow == null ? void 0 : existingRow.data_acquisizione, oldRow.data_acquisizione),
    data_perfezionamento: firstDate(existingRow == null ? void 0 : existingRow.data_perfezionamento, oldRow.data_perfezionamento),
    note_maestro: mergeTextNotes(existingRow == null ? void 0 : existingRow.note_maestro, oldRow.note_maestro, marker)
  };
}
function mergeSkillProgressi(oldSkill, replacementSkill, usage) {
  return __async(this, null, function* () {
    if (!usage.progressi.length) return;
    const allievoIds = [...new Set(usage.progressi.map((row) => row.allievo_id).filter(Boolean))];
    const { data: existingRows, error: existingError } = yield sb.from("progressi_allievo").select("id, allievo_id, skill_id, stadio, stadio_lato_sx, stadio_lato_dx, data_inizio, data_acquisizione, data_perfezionamento, note_maestro").eq("skill_id", replacementSkill.id).in("allievo_id", allievoIds);
    if (existingError) throw existingError;
    const existingByAllievo = new Map((existingRows || []).map((row) => [row.allievo_id, row]));
    const payload = usage.progressi.map((row) => progressReplacementPayload(row, existingByAllievo.get(row.allievo_id), replacementSkill.id, oldSkill));
    const { error: upsertError } = yield sb.from("progressi_allievo").upsert(payload, { onConflict: "allievo_id,skill_id" });
    if (upsertError) throw upsertError;
    const { error: deleteError } = yield sb.from("progressi_allievo").delete().eq("skill_id", oldSkill.id);
    if (deleteError) throw deleteError;
  });
}
function mergeSkillLessonRows(oldSkill, replacementSkill, usage) {
  return __async(this, null, function* () {
    if (!usage.lezioniSkills.length) return;
    const lezioneIds = [...new Set(usage.lezioniSkills.map((row) => row.lezione_id).filter(Boolean))];
    const { data: existingRows, error: existingError } = yield sb.from("lezioni_skills").select("id, lezione_id, allievo_id, skill_id, stadio_raggiunto, note, fakie, dimensioni").eq("skill_id", replacementSkill.id).in("lezione_id", lezioneIds);
    if (existingError) throw existingError;
    const existingByLessonStudent = new Map((existingRows || []).map((row) => [`${row.lezione_id}:${row.allievo_id}`, row]));
    const oldIdsToDelete = [];
    for (const oldRow of usage.lezioniSkills) {
      const key = `${oldRow.lezione_id}:${oldRow.allievo_id}`;
      const existing = existingByLessonStudent.get(key);
      if (existing) {
        const { error: updateError } = yield sb.from("lezioni_skills").update({
          stadio_raggiunto: Math.max(Number(existing.stadio_raggiunto || 0), Number(oldRow.stadio_raggiunto || 0)),
          note: mergeTextNotes(existing.note, oldRow.note),
          fakie: !!(existing.fakie || oldRow.fakie),
          dimensioni: mergeLessonDimensionsForReplacement(existing.dimensioni || {}, oldRow.dimensioni || {}, oldSkill, replacementSkill)
        }).eq("id", existing.id);
        if (updateError) throw updateError;
        oldIdsToDelete.push(oldRow.id);
      } else {
        const { error: updateError } = yield sb.from("lezioni_skills").update({
          skill_id: replacementSkill.id,
          dimensioni: mergeSkillReplacementTrail(oldRow.dimensioni || {}, oldSkill, replacementSkill)
        }).eq("id", oldRow.id);
        if (updateError) throw updateError;
      }
    }
    if (oldIdsToDelete.length) {
      const { error: deleteError } = yield sb.from("lezioni_skills").delete().in("id", oldIdsToDelete);
      if (deleteError) throw deleteError;
    }
  });
}
function rewriteSkillPrerequisites(oldSkillId, replacementSkillId) {
  return __async(this, null, function* () {
    const { data: rows, error } = yield sb.from("prerequisiti_skill").select("*").or(`skill_id.eq.${oldSkillId},richiede_skill_id.eq.${oldSkillId}`);
    if (error) throw error;
    const rewrittenByKey = /* @__PURE__ */ new Map();
    (rows || []).map((row) => ({
      skill_id: row.skill_id === oldSkillId ? replacementSkillId : row.skill_id,
      richiede_skill_id: row.richiede_skill_id === oldSkillId ? replacementSkillId : row.richiede_skill_id,
      stadio_minimo: row.stadio_minimo,
      note: row.note
    })).filter((row) => row.skill_id !== row.richiede_skill_id).forEach((row) => {
      const key = `${row.skill_id}:${row.richiede_skill_id}`;
      const current = rewrittenByKey.get(key);
      rewrittenByKey.set(key, current ? __spreadProps(__spreadValues({}, row), {
        stadio_minimo: Math.min(Number(current.stadio_minimo || 2), Number(row.stadio_minimo || 2)),
        note: mergeTextNotes(current.note, row.note)
      }) : row);
    });
    const rewritten = [...rewrittenByKey.values()];
    if (rewritten.length) {
      const { error: upsertError } = yield sb.from("prerequisiti_skill").upsert(rewritten, { onConflict: "skill_id,richiede_skill_id" });
      if (upsertError) throw upsertError;
    }
    yield optionalDelete("prerequisiti_skill", "skill_id", oldSkillId);
    yield optionalDelete("prerequisiti_skill", "richiede_skill_id", oldSkillId);
  });
}
function sostituisciSkillUsataDaCatalogo(oldSkillId) {
  return __async(this, null, function* () {
    var _a2;
    const oldSkill = allSkills.find((skill) => String(skill.id) === String(oldSkillId));
    const replacementId = (_a2 = document.getElementById("skill-replace-select")) == null ? void 0 : _a2.value;
    const replacementSkill = allSkills.find((skill) => String(skill.id) === String(replacementId));
    if (!oldSkill) {
      setSkillCatalogStatus("Skill da sostituire non trovata.", "msg-err");
      return;
    }
    if (!replacementSkill) {
      setSkillCatalogStatus("Scegli una skill sostitutiva.", "msg-err");
      return;
    }
    if (oldSkill.id === replacementSkill.id) {
      setSkillCatalogStatus("La skill sostitutiva deve essere diversa.", "msg-err");
      return;
    }
    if (!confirm(`Sostituire "${oldSkill.nome}" con "${replacementSkill.nome}" in progressi e lezioni, poi rimuovere "${oldSkill.nome}" dal catalogo?`)) return;
    const btn = document.getElementById("skill-replace-btn");
    const oldText = btn == null ? void 0 : btn.textContent;
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Sostituzione in corso...";
    }
    setSkillCatalogStatus("Sostituzione nello storico in corso...", "msg-info");
    try {
      const usage = yield fetchSkillDeleteUsage(oldSkill.id);
      yield mergeSkillProgressi(oldSkill, replacementSkill, usage);
      yield mergeSkillLessonRows(oldSkill, replacementSkill, usage);
      yield rewriteSkillPrerequisites(oldSkill.id, replacementSkill.id);
      yield optionalDelete("skill_definizioni", "skill_id", oldSkill.id);
      yield optionalUpdate("tuning_risposte", "skill_id", oldSkill.id, { skill_id: replacementSkill.id });
      yield optionalUpdate("tuning_risposte", "skill_ref_id", oldSkill.id, { skill_ref_id: replacementSkill.id });
      const { error } = yield sb.from("skills").delete().eq("id", oldSkill.id);
      if (error) throw error;
      allSkills = allSkills.filter((skill) => String(skill.id) !== String(oldSkill.id));
      skillDefinitions = skillDefinitions.filter((def) => String(def.skill_id || "") !== String(oldSkill.id) && normalizeText(def.skill_nome) !== normalizeText(oldSkill.nome));
      const [{ data: freshPrereqs }, { data: freshProgressi }] = yield Promise.all([
        sb.from("prerequisiti_skill").select("*"),
        sb.from("progressi_allievo").select("allievo_id, skill_id, stadio")
      ]);
      if (freshPrereqs) allPrereqs = freshPrereqs;
      if (freshProgressi) allProgressi = freshProgressi;
      yield refreshSkillCatalogConsumers();
      setSkillDeleteWarning("");
      setSkillCatalogStatus(`"${oldSkill.nome}" sostituita con "${replacementSkill.nome}". Storico conservato.`, "msg-ok");
    } catch (e) {
      setSkillCatalogStatus(e.message || "Errore durante la sostituzione della skill.", "msg-err");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = oldText;
      }
    }
  });
}
function salvaDefinizioneVarianteSkill(_0, _1) {
  return __async(this, arguments, function* (skill, parentSkill, variants = []) {
    if (!skill || !parentSkill) return true;
    const payload = {
      skill_id: skill.id,
      skill_nome: skill.nome,
      ramo: skill.ramo || "Altro",
      fascia_livello: skill.blocco || "",
      livello_num: Number(skill.livello || 0) || null,
      prerequisiti: [],
      prerequisiti_match: [],
      sblocca: [],
      sblocca_match: [],
      e_variante: true,
      variante_di: parentSkill.nome,
      variante_match: { skill_id: parentSkill.id, skill_nome: parentSkill.nome },
      cosa_fa: skill.descrizione || "",
      come_si_fa: "",
      varianti: variants,
      alias_nomi: [],
      catalog_note: "",
      note_revisione: null,
      stato: "bozza",
      maestro_id: currentUid || null,
      aggiornato_il: (/* @__PURE__ */ new Date()).toISOString()
    };
    const { error } = yield sb.from("skill_definizioni").upsert(payload, { onConflict: "skill_nome" });
    if (error) {
      const text = `${error.message || ""} ${error.details || ""} ${error.hint || ""}`;
      if (/skill_definizioni|schema cache|could not find the table|does not exist/i.test(text)) return false;
      throw error;
    }
    skillDefinitions = yield loadSkillDefinitions();
    return true;
  });
}
function cancellaSkillCatalogo() {
  return __async(this, null, function* () {
    const select = document.getElementById("skill-delete-select");
    const skillId = select == null ? void 0 : select.value;
    const skill = allSkills.find((s) => s.id === skillId);
    if (!skill) {
      setSkillCatalogStatus("Scegli una skill da cancellare.", "msg-err");
      return;
    }
    setSkillDeleteWarning("");
    setSkillCatalogStatus("Controllo utilizzi della skill...", "msg-info");
    try {
      const usage = yield fetchSkillDeleteUsage(skillId);
      if (usage.total > 0) {
        setSkillCatalogStatus("Skill non cancellata: prima serve compensarla.", "msg-err");
        setSkillDeleteWarning(renderSkillDeleteUsageWarning(skill, usage));
        return;
      }
      if (!confirm(`Cancellare "${skill.nome}" dal catalogo? Non risultano lezioni o progressi collegati.`)) {
        setSkillCatalogStatus("", "");
        return;
      }
      setSkillCatalogStatus("Cancellazione in corso...", "msg-info");
      yield optionalDelete("prerequisiti_skill", "skill_id", skillId);
      yield optionalDelete("prerequisiti_skill", "richiede_skill_id", skillId);
      yield optionalDelete("skill_definizioni", "skill_id", skillId);
      yield optionalDelete("tuning_risposte", "skill_id", skillId);
      yield optionalDelete("tuning_risposte", "skill_ref_id", skillId);
      const { error } = yield sb.from("skills").delete().eq("id", skillId);
      if (error) throw error;
      allSkills = allSkills.filter((s) => s.id !== skillId);
      skillDefinitions = skillDefinitions.filter((def) => String(def.skill_id || "") !== String(skillId) && normalizeText(def.skill_nome) !== normalizeText(skill.nome));
      allPrereqs = allPrereqs.filter((row) => row.skill_id !== skillId && row.richiede_skill_id !== skillId);
      allProgressi = allProgressi.filter((row) => row.skill_id !== skillId);
      yield refreshSkillCatalogConsumers();
      setSkillDeleteWarning("");
      setSkillCatalogStatus(`Skill "${skill.nome}" cancellata.`, "msg-ok");
    } catch (e) {
      setSkillCatalogStatus(e.message || "Errore durante la cancellazione della skill.", "msg-err");
    }
  });
}
function chiudiCondividi() {
  document.getElementById("modal-condividi").hidden = true;
  shareContext = null;
}
function apriCondividiAllievo(id) {
  const allievo = allAllievi.find((a) => a.id === id);
  if (!allievo) return;
  shareContext = { type: "allievo", ids: [id], label: [allievo.nome, allievo.cognome].filter(Boolean).join(" ") };
  document.getElementById("condividi-title").textContent = "Condividi allievo";
  document.getElementById("condividi-help").textContent = `Condividi ${shareContext.label} con un altro maestro. Potra vedere e modificare la scheda.`;
  document.getElementById("condividi-email").value = "";
  document.getElementById("condividi-err").classList.remove("show");
  document.getElementById("condividi-ok").classList.remove("show");
  document.getElementById("modal-condividi").hidden = false;
}
function apriCondividiGruppo(gruppo) {
  const membri = allAllievi.filter((a) => a.gruppo === gruppo).map((a) => a.id);
  if (!membri.length) return;
  shareContext = { type: "gruppo", ids: membri, label: gruppo };
  document.getElementById("condividi-title").textContent = "Condividi gruppo";
  document.getElementById("condividi-help").textContent = `Condividi il gruppo "${gruppo}" (${membri.length} allievi) con un altro maestro.`;
  document.getElementById("condividi-email").value = "";
  document.getElementById("condividi-err").classList.remove("show");
  document.getElementById("condividi-ok").classList.remove("show");
  document.getElementById("modal-condividi").hidden = false;
}
function confermaCondividi() {
  return __async(this, null, function* () {
    const err = document.getElementById("condividi-err");
    const ok = document.getElementById("condividi-ok");
    err.classList.remove("show");
    ok.classList.remove("show");
    const email = document.getElementById("condividi-email").value.trim().toLowerCase();
    if (!shareContext) {
      err.textContent = "Nessun elemento selezionato per la condivisione.";
      err.classList.add("show");
      return;
    }
    if (!email) {
      err.textContent = "Inserisci l'email del maestro.";
      err.classList.add("show");
      return;
    }
    try {
      const { data: maestroId, error: rpcError } = yield sb.rpc("find_maestro_by_email", { email_input: email });
      if (rpcError) throw rpcError;
      if (!maestroId) throw new Error("Maestro non trovato con questa email.");
      const payload = shareContext.ids.map((allievoId) => ({
        allievo_id: allievoId,
        maestro_id: maestroId,
        condiviso_da: currentUid
      }));
      const { error } = yield sb.from("allievi_condivisi").upsert(payload, { onConflict: "allievo_id,maestro_id" });
      if (error) throw error;
      ok.textContent = shareContext.type === "gruppo" ? `Gruppo condiviso con ${email}.` : `Allievo condiviso con ${email}.`;
      ok.classList.add("show");
    } catch (e) {
      err.textContent = e.message || "Errore nella condivisione.";
      err.classList.add("show");
    }
  });
}
function assegnaAllievoAMe(id) {
  return __async(this, null, function* () {
    if (!currentUid) return;
    if (!confirm("Assegnare questo allievo non ancora assegnato al tuo account?")) return;
    try {
      const { error } = yield sb.from("allievi").update({ maestro_id: currentUid }).eq("id", id).is("maestro_id", null);
      if (error) throw error;
      yield ricaricaAllievi();
    } catch (e) {
      alert("Errore nell'assegnazione: " + e.message);
    }
  });
}
function esportaAllievo(id) {
  return __async(this, null, function* () {
    const allievo = allAllievi.find((a2) => a2.id === id);
    if (!allievo) return;
    const { data: progressi } = yield sb.from("progressi_allievo").select("stadio, data_inizio, data_acquisizione, data_perfezionamento, note_maestro, skills(id, nome, ramo, livello, blocco)").eq("allievo_id", id);
    const blob = new Blob([JSON.stringify({ allievo, progressi: progressi || [] }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${allievo.nome}_${allievo.cognome}_backup.json`.replace(/\s+/g, "_");
    a.click();
    URL.revokeObjectURL(a.href);
  });
}
function esportaAllievi() {
  return __async(this, null, function* () {
    const baseLista = allieviVisibiliGod();
    const allievi = ordinaAllieviLista(filtroGruppo ? baseLista.filter((a2) => a2.gruppo === filtroGruppo) : baseLista);
    if (!allievi.length) {
      alert("Nessun allievo da esportare.");
      return;
    }
    const ids = allievi.map((a2) => a2.id).filter(Boolean);
    const { data: progressi, error } = yield sb.from("progressi_allievo").select("allievo_id, stadio, data_inizio, data_acquisizione, data_perfezionamento, note_maestro, skills(id, nome, ramo, livello, blocco)").in("allievo_id", ids);
    if (error) {
      alert("Errore esportazione: " + error.message);
      return;
    }
    const stato = mostraArchiviati ? "archivio" : "attivi";
    const gruppo = filtroGruppo ? filtroGruppo.replace(/\s+/g, "_").replace(/[^\w-]/g, "") : "tutti";
    const oggi = localDateIso();
    const blob = new Blob([JSON.stringify({
      tipo: "allievi_backup",
      esportato_il: (/* @__PURE__ */ new Date()).toISOString(),
      filtro: { stato, gruppo: filtroGruppo },
      allievi,
      progressi: progressi || []
    }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `allievi_${stato}_${gruppo}_${oggi}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
}
function salvaBackupLocale(tipo, payload) {
  const key = "bladingManagerBackups";
  let backups = [];
  try {
    backups = JSON.parse(safeStorage.getItem(key) || "[]");
    if (!Array.isArray(backups)) backups = [];
  } catch (e) {
    backups = [];
  }
  backups.unshift({
    tipo,
    salvato_il: (/* @__PURE__ */ new Date()).toISOString(),
    payload
  });
  safeStorage.setItem(key, JSON.stringify(backups.slice(0, 50)));
}
function backupAllievoCompleto(id) {
  return __async(this, null, function* () {
    const allievo = allAllievi.find((a) => a.id === id) || null;
    const [{ data: progressi }, { data: lezioniAllievi }, { data: lezioniSkills }] = yield Promise.all([
      sb.from("progressi_allievo").select("*").eq("allievo_id", id),
      sb.from("lezioni_allievi").select("*, lezioni(*)").eq("allievo_id", id),
      sb.from("lezioni_skills").select("*, skills(*)").eq("allievo_id", id)
    ]);
    return { allievo, progressi: progressi || [], lezioniAllievi: lezioniAllievi || [], lezioniSkills: lezioniSkills || [] };
  });
}
function eliminaAllievo(id) {
  return __async(this, null, function* () {
    const allievo = allAllievi.find((a) => a.id === id);
    const isArchiviato = (allievo == null ? void 0 : allievo.stato) === "archiviato";
    if (!isArchiviato) {
      if (!confirm("Archiviare questo allievo? Potrai ritrovarlo dalla lista Archivio.")) return;
      try {
        const { error } = yield sb.from("allievi").update({ stato: "archiviato" }).eq("id", id);
        if (error) throw error;
        yield ricaricaAllievi();
        showView("allievi");
      } catch (e) {
        alert("Errore nell'archiviazione: " + e.message);
      }
      return;
    }
    if (!confirm("Eliminare definitivamente questo allievo archiviato dal database? I file di backup esportati non vengono toccati.")) return;
    try {
      yield sb.from("lezioni_skills").delete().eq("allievo_id", id);
      yield sb.from("lezioni_allievi").delete().eq("allievo_id", id);
      yield sb.from("progressi_allievo").delete().eq("allievo_id", id);
      const { error } = yield sb.from("allievi").delete().eq("id", id);
      if (error) throw error;
      yield ricaricaAllievi();
      showView("allievi");
    } catch (e) {
      alert("Errore nell'eliminazione definitiva: " + e.message);
    }
  });
}
function cancellaAllievoInModifica() {
  return __async(this, null, function* () {
    if (!editingAllieviId) return;
    const allievo = allAllievi.find((a) => a.id === editingAllieviId);
    const nome = allievo ? [allievo.nome, allievo.cognome].filter(Boolean).join(" ") : "questa scheda";
    if (!confirm(`Cancellare la scheda di ${nome}? Prima verra salvata una copia nel backup locale.`)) return;
    const errEl = document.getElementById("na-err");
    errEl.classList.remove("show");
    try {
      const backup = yield backupAllievoCompleto(editingAllieviId);
      salvaBackupLocale("allievo_cancellato", backup);
      yield sb.from("lezioni_skills").delete().eq("allievo_id", editingAllieviId);
      yield sb.from("lezioni_allievi").delete().eq("allievo_id", editingAllieviId);
      yield sb.from("progressi_allievo").delete().eq("allievo_id", editingAllieviId);
      const { error } = yield sb.from("allievi").delete().eq("id", editingAllieviId);
      if (error) throw error;
      editingAllieviId = null;
      yield ricaricaAllievi();
      showView("allievi");
    } catch (e) {
      errEl.textContent = e.message || "Errore nella cancellazione della scheda.";
      errEl.classList.add("show");
    }
  });
}
function cancellaGruppoInModifica() {
  return __async(this, null, function* () {
    if (!editingAllieviId) return;
    const current = allAllievi.find((a) => a.id === editingAllieviId);
    const gruppo = current == null ? void 0 : current.gruppo;
    if (!gruppo) return;
    yield cancellaGruppoConBackup(gruppo, document.getElementById("na-err"), () => {
      editingAllieviId = null;
      showView("allievi");
    });
  });
}
function cancellaGruppoDaScheda() {
  return __async(this, null, function* () {
    if (!editingGruppoNome) return;
    yield cancellaGruppoConBackup(editingGruppoNome, document.getElementById("gr-err"), () => {
      editingGruppoNome = null;
      showView("allievi");
    });
  });
}
function cancellaGruppoConBackup(gruppo, errEl, afterDelete) {
  return __async(this, null, function* () {
    const membri = allAllievi.filter((a) => a.gruppo === gruppo);
    if (!membri.length) return;
    if (!confirm(`Cancellare il gruppo "${gruppo}" e le ${membri.length} schede collegate? Prima verra salvata una copia nel backup locale.`)) return;
    errEl.classList.remove("show");
    try {
      const backups = yield Promise.all(membri.map((a) => backupAllievoCompleto(a.id)));
      salvaBackupLocale("gruppo_cancellato", { gruppo, membri: backups });
      const ids = membri.map((a) => a.id);
      yield sb.from("lezioni_skills").delete().in("allievo_id", ids);
      yield sb.from("lezioni_allievi").delete().in("allievo_id", ids);
      yield sb.from("progressi_allievo").delete().in("allievo_id", ids);
      const { error } = yield sb.from("allievi").delete().in("id", ids);
      if (error) throw error;
      filtroGruppo = null;
      yield ricaricaAllievi();
      afterDelete == null ? void 0 : afterDelete();
    } catch (e) {
      errEl.textContent = e.message || "Errore nella cancellazione del gruppo.";
      errEl.classList.add("show");
    }
  });
}
function importaAllievo(input) {
  return __async(this, null, function* () {
    const file = input.files[0];
    if (!file) return;
    input.value = "";
    let parsed;
    try {
      parsed = JSON.parse(yield file.text());
    } catch (e) {
      alert("File JSON non valido.");
      return;
    }
    const src = parsed.allievo;
    if (!(src == null ? void 0 : src.nome) || !(src == null ? void 0 : src.cognome)) {
      alert("Dati allievo mancanti nel file.");
      return;
    }
    const _a2 = src, { id: _old, creato_il, aggiornato_il, maestro_id: _mid } = _a2, rest = __objRest(_a2, ["id", "creato_il", "aggiornato_il", "maestro_id"]);
    const payload = __spreadProps(__spreadValues({}, rest), { maestro_id: currentUid, stato: rest.stato || "attivo" });
    const { data, error } = yield sb.from("allievi").insert(payload).select().single();
    if (error) {
      alert("Errore importazione: " + error.message);
      return;
    }
    allAllievi.push(data);
    allAllievi.sort((a, b) => a.nome.localeCompare(b.nome));
    renderAllievi();
    alert(`\u2705 "${data.nome} ${data.cognome}" importato correttamente.`);
  });
}
function stampaScheda(id) {
  var _a2, _b2, _c, _d, _e, _f, _g;
  const allievo = allAllievi.find((a) => a.id === id);
  if (!allievo) return;
  const p = allievo.profilo || {};
  function dr(val) {
    return [1, 2, 3].map(
      (i) => `<span style="display:inline-block;width:9px;height:9px;border-radius:50%;border:1.5px solid #0891b2;background:${i <= val ? "#0891b2" : "transparent"};margin-right:4px;vertical-align:middle"></span>`
    ).join("");
  }
  function row(label, val) {
    if (!val) return "";
    return `<tr><td style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;padding:3px 10px 3px 0;white-space:nowrap;vertical-align:top;width:36%">${label}</td><td style="font-size:11px;padding:3px 0;color:#1a1a2e;vertical-align:top">${val}</td></tr>`;
  }
  function fmtDate(d) {
    if (!d) return "";
    const [y, m, g] = d.slice(0, 10).split("-");
    return `${g}/${m}/${y}`;
  }
  const famRows = (p.familiari || []).map(
    (f) => row(f.relazione || "Familiare", [f.nome, f.cognome].filter(Boolean).join(" ") + (f.telefono ? " \xB7 " + f.telefono : ""))
  ).join("");
  const address = visibleAllievoAddress(allievo);
  const html = `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8">
<title>${allievo.nome} ${allievo.cognome} \u2014 Scheda</title>
<style>
  @page { size: A4 portrait; margin: 16mm 15mm 14mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 12px; color: #1a1a2e; line-height: 1.45; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  .header { padding-bottom: 9px; margin-bottom: 12px; border-bottom: 2px solid #0891b2; display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
  .header h1 { font-size: 19px; font-weight: 700; color: #0f172a; }
  .header .badge-lv { font-size: 10px; font-weight: 700; color: #0891b2; border: 1.5px solid #0891b2; border-radius: 4px; padding: 2px 7px; white-space: nowrap; }
  .header .meta { font-size: 10px; color: #64748b; margin-top: 3px; }

  .box { border: 1px solid #dde3ef; border-radius: 6px; padding: 9px 11px; margin-bottom: 10px; page-break-inside: avoid; }

  .sec-title { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #6b7280; padding-bottom: 5px; margin-bottom: 7px; border-bottom: 1px solid #e5e7eb; }
  .sub-title { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; margin-bottom: 5px; margin-top: 8px; }
  .sub-title:first-child { margin-top: 0; }

  table { width: 100%; border-collapse: collapse; }

  .prog-table th { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #6b7280; padding: 3px 6px 3px 0; border-bottom: 1px solid #e5e7eb; }
  .prog-table td { padding: 4px 6px 4px 0; border-bottom: 1px solid #f3f4f6; font-size: 11px; color: #1a1a2e; }
  .ramo-lbl { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #0891b2; margin: 9px 0 4px; }

  .badge { display: inline-block; padding: 1px 6px; border-radius: 20px; font-size: 9px; font-weight: 700; }
  .st1 { background: #fef3c7; color: #92400e; }
  .st2 { background: #cffafe; color: #0e7490; }
  .st3 { background: #dcfce7; color: #166534; }

  .footer { margin-top: 14px; padding-top: 6px; border-top: 1px solid #e5e7eb; font-size: 9px; color: #94a3b8; text-align: right; }
</style></head><body>

<div class="header">
  <div>
    <h1>${allievo.nome} ${allievo.cognome}${allievo.nickname ? ` <span style="font-size:13px;color:#64748b;font-weight:400">"${allievo.nickname}"</span>` : ""}${allievo.vip ? ' <span style="color:#22b8cf">\u2605</span>' : ""}</h1>
    <div class="meta">
      Iscritto il ${fmtDate(allievo.data_iscrizione)}${allievo.data_nascita ? ` \xB7 Nato il ${fmtDate(allievo.data_nascita)}` : ""}${allievo.gruppo ? ` \xB7 Gruppo: ${allievo.gruppo}` : ""}
    </div>
  </div>
  <div class="badge-lv">Lv. ${allievo.livello_attuale} \xB7 ${allievo.blocco_attuale}</div>
</div>

<div class="box">
  <div class="sec-title">Contatti</div>
  <table>${row("Email", allievo.email)}${row("Telefono", allievo.telefono)}${row("Indirizzo", address.indirizzo)}${row("Casa", address.casa)}${row("Cultura / lingua", p.cultura)}${famRows}</table>
</div>

${p.note_salute ? `<div class="box"><div class="sec-title">Salute e attenzioni</div><table>${row("Note", p.note_salute)}</table></div>` : ""}

<div class="box">
  <div class="sec-title">Logistica</div>
  <table>${row("Appuntamento", p.appuntamento)}${row("Durata lezione", p.durata_lezione ? p.durata_lezione + " min" : null)}${row("Luogo", p.luogo_incontro)}${row("Compenso", p.compenso ? "\u20AC " + Number(p.compenso).toFixed(2) : null)}</table>
</div>

<div class="box">
  <div class="sec-title">Capacit\xE0 motorie</div>
  <table>
    ${row("Coordinazione", dr(((_a2 = p.capacita) == null ? void 0 : _a2.coordinazione) || 0))}
    ${row("Propriocezione", dr(((_b2 = p.capacita) == null ? void 0 : _b2.propriocezione) || 0))}
    ${row("Vel. apprendimento", dr(((_c = p.capacita) == null ? void 0 : _c.velocita_apprendimento) || 0))}
    ${row("Bilateralit\xE0", dr(((_d = p.capacita) == null ? void 0 : _d.bilateralita) || 0))}
  </table>
</div>

<div class="box">
  <div class="sec-title">Canale di apprendimento</div>
  <table>
    ${row("Visivo", dr(((_e = p.apprendimento) == null ? void 0 : _e.visivo) || 0))}
    ${row("Teorico", dr(((_f = p.apprendimento) == null ? void 0 : _f.teorico) || 0))}
    ${row("Pratico", dr(((_g = p.apprendimento) == null ? void 0 : _g.pratico) || 0))}
  </table>
</div>

${p.lato_dominante || p.competenze || p.sport || p.talenti || p.paure || p.obiettivi || p.equipaggiamento ? `
<div class="box">
  <div class="sec-title">Profilo tecnico</div>
  <table>
    ${row("Lato dominante", p.lato_dominante)}${row("Competenze iniziali", p.competenze)}
    ${row("Sport praticati", p.sport)}${row("Talenti", p.talenti)}
    ${row("Paure / blocchi", p.paure)}${row("Obiettivi", p.obiettivi)}
    ${row("Equipaggiamento", p.equipaggiamento)}
  </table>
</div>` : ""}

${allievo.note_generali ? `<div class="box-full"><div class="sec-title">Note generali</div><p style="font-size:11px;color:#374151;line-height:1.5">${allievo.note_generali}</p></div>` : ""}

<div id="prog-placeholder" class="box-full">
  <div class="sec-title">Progressi skill</div>
  <p style="color:#94a3b8;font-size:11px">Caricamento\u2026</p>
</div>

<div class="footer">Blading Manager Big Ball of Mud \xB7 Stampato il ${(/* @__PURE__ */ new Date()).toLocaleDateString("it-IT")}</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@1/dist/umd/supabase.min.js"><\/script>
<script>
(async () => {
  const placeholder = document.getElementById('prog-placeholder')
  const sb = supabase.createClient('${SUPA_URL}','${SUPA_KEY}')
  const { data: progressi } = await sb.from('progressi_allievo')
    .select('stadio, data_acquisizione, skills(nome, ramo, livello)')
    .eq('allievo_id', '${id}')
    .gt('stadio', 0)
    .order('skills(livello)')

  if (!progressi || !progressi.length) {
    placeholder.innerHTML = '<div class="sec-title">Progressi skill</div><p style="color:#94a3b8;font-size:11px">Nessuna skill registrata.</p>'
    window.print(); return
  }

  const byRamo = {}
  progressi.forEach(p => {
    const skill = p.skills || {}
    const r = skill.ramo || 'Altro'
    if (!byRamo[r]) byRamo[r] = []
    byRamo[r].push(p)
  })

  const html = Object.entries(byRamo).map(([ramo, rows]) => \`
    <div class="ramo-lbl">\${ramo}</div>
    <table class="prog-table" style="margin-bottom:6px;page-break-inside:avoid">
      <thead><tr><th style="width:46%">Skill</th><th style="width:8%">Lv.</th><th style="width:26%">Stadio</th><th style="width:20%">Acquisita</th></tr></thead>
      <tbody>\${rows.sort((a,b)=>(a.skills || {}).livello-(b.skills || {}).livello).map(p => {
        const labels = ['','In lavorazione','Raffinamento','Completato']
        const cls = ['','st1','st2','st3']
        const d = p.data_acquisizione
        const fmt = d ? d.slice(8,10)+'/'+d.slice(5,7)+'/'+d.slice(0,4) : '\u2014'
        const skill = p.skills || {}
        return \`<tr><td>\${skill.nome||''}</td><td>\${skill.livello||''}</td><td><span class="badge \${cls[p.stadio]}">\${labels[p.stadio]}</span></td><td style="color:#64748b">\${fmt}</td></tr>\`
      }).join('')}</tbody>
    </table>
  \`).join('')

  placeholder.innerHTML = '<div class="sec-title">Progressi skill</div>' + html
  window.print()
})()
<\/script>
</body></html>`;
  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
}
function isMissingNoteSpecialiError(error) {
  return !!error && /note_speciali/i.test(error.message || error.details || error.hint || "");
}
function isMissingFakieError(error) {
  return !!error && /fakie/i.test(error.message || error.details || error.hint || "");
}
function isMissingDimensioniError(error) {
  return !!error && /dimensioni/i.test(error.message || error.details || error.hint || "");
}
function isMissingLessonStatusError(error) {
  return !!error && /\b(stato|status|updated_at)\b/i.test(error.message || error.details || error.hint || "");
}
function isMissingLessonCheckError(error) {
  return !!error && /\b(check_bene|check_non_fatto)\b/i.test(error.message || error.details || error.hint || "");
}
function isMissingLessonMeteoError(error) {
  return !!error && /\b(meteo|weather)\b/i.test(error.message || error.details || error.hint || "");
}
function hasLessonSkillMetadata(payload = {}) {
  return !!(payload == null ? void 0 : payload.dimensioni) && Object.keys(payload.dimensioni).length > 0;
}
function missingLessonSkillColumnError(column) {
  const details = column === "dimensioni" ? "Dimensioni ed esercizi sono salvati in lezioni_skills.dimensioni." : "Il flag Fakie e salvato in lezioni_skills.fakie.";
  return new Error(`${details} La colonna manca nel database: applica la migrazione lezioni_skills_meta e riprova.`);
}
function loadLezioni(force = false) {
  return __async(this, null, function* () {
    if (lezioniCache && !force) {
      renderLezioni();
      return;
    }
    const el = document.getElementById("lezioni-content");
    el.innerHTML = '<div class="loading">Caricamento\u2026</div>';
    let { data, error } = yield sb.from("lezioni").select("id, data, tipo, durata_min, luogo, meteo, note, note_speciali, stato, check_bene, check_non_fatto, updated_at, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, dimensioni, skills(nome))").order("data", { ascending: false });
    if (isMissingLessonMeteoError(error)) {
      ;
      ({ data, error } = yield sb.from("lezioni").select("id, data, tipo, durata_min, luogo, note, note_speciali, stato, check_bene, check_non_fatto, updated_at, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, dimensioni, skills(nome))").order("data", { ascending: false }));
    }
    if (isMissingLessonCheckError(error)) {
      ;
      ({ data, error } = yield sb.from("lezioni").select("id, data, tipo, durata_min, luogo, note, note_speciali, stato, updated_at, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, dimensioni, skills(nome))").order("data", { ascending: false }));
    }
    if (isMissingLessonStatusError(error)) {
      ;
      ({ data, error } = yield sb.from("lezioni").select("id, data, tipo, durata_min, luogo, note, note_speciali, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, dimensioni, skills(nome))").order("data", { ascending: false }));
    }
    if (isMissingDimensioniError(error)) {
      ;
      ({ data, error } = yield sb.from("lezioni").select("id, data, tipo, durata_min, luogo, note, note_speciali, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, skills(nome))").order("data", { ascending: false }));
    }
    if (isMissingNoteSpecialiError(error)) {
      ;
      ({ data, error } = yield sb.from("lezioni").select("id, data, tipo, durata_min, luogo, note, lezioni_allievi(allievi(id, nome, cognome, gruppo, maestro_id)), lezioni_skills(stadio_raggiunto, skills(nome))").order("data", { ascending: false }));
      data = (data || []).map((l) => __spreadProps(__spreadValues({}, l), { note_speciali: null }));
    }
    if (error) {
      lezioniCache = null;
      el.innerHTML = `<div class="empty">${esc(error.message || "Errore nel caricamento lezioni.")}</div>`;
      return;
    }
    lezioniCache = data || [];
    renderLezioni({ animate: true });
    renderDashboard();
  });
}
function renderLezioni({ animate = false } = {}) {
  const el = document.getElementById("lezioni-content");
  aggiornaFiltroLezioni();
  aggiornaToggleDettagliLezioni();
  if (!(lezioniCache == null ? void 0 : lezioniCache.length)) {
    el.innerHTML = '<div class="empty">Nessuna lezione ancora.</div>';
    return;
  }
  const scopeIds = new Set(allieviVisibiliGod().map((a) => a.id));
  const lezioni = godMode && godScope !== "all" ? lezioniCache.filter((l) => {
    var _a2;
    return (_a2 = l.lezioni_allievi) == null ? void 0 : _a2.some((la) => {
      var _a3;
      return scopeIds.has((_a3 = la.allievi) == null ? void 0 : _a3.id);
    });
  }) : lezioniCache;
  const lezioniFiltrate = filtraLezioniPerSelezione(lezioni).filter((l) => !filtroLezioniAperte || lessonStatus(l) === "aperta");
  if (!lezioniFiltrate.length) {
    el.innerHTML = `<div class="empty">${filtroLezioniAperte ? "Nessuna lezione aperta per questa selezione." : filtroLezioni === "all" ? "Nessuna lezione per questo account." : "Nessuna lezione per questa selezione."}</div>`;
    return;
  }
  el.innerHTML = renderLezioniTable(lezioniFiltrate);
  if (animate) requestAnimationFrame(() => motion.tableRows(el));
}
function renderLezioniTable(lezioni, { showYearGroups = true, variant = "lista", schedaId = null, gruppoNome = null } = {}) {
  const isScheda = variant === "scheda";
  const html = `
    <div class="table-wrap">
      <table class="lesson-table ${lessonTableStateClasses()}">
        <thead><tr>${isScheda ? `${lessonColumnHeader("data", "Data e orario")}<th>Skill lavorate</th>${lessonColumnHeader("note", "Note speciali")}${lessonColumnHeader("luogo", "Location")}` : `${lessonColumnHeader("data", "Data e orario")}<th>Allievi</th>${lessonColumnHeader("note", "Note speciali")}${lessonColumnHeader("luogo", "Location")}`}</tr></thead>
        <tbody>
          ${renderRowsLezioni(lezioni, { showYearGroups, variant, schedaId, gruppoNome })}
        </tbody>
      </table>
    </div>`;
  return html;
}
function lessonTableStateClasses() {
  return Object.entries(lezioniColumnState).map(([key, open]) => `lesson-col-${key}-${open ? "open" : "closed"}`).join(" ");
}
function lessonColumnHeader(key, label) {
  const pressed = !!lezioniColumnState[key];
  return `<th class="lesson-toggle-th lesson-col-${key}">
    <button type="button" class="lesson-col-toggle" data-column="${esc(key)}" aria-label="${pressed ? "Nascondi" : "Mostra"} ${esc(label)}" aria-pressed="${pressed ? "true" : "false"}" title="${pressed ? "Nascondi" : "Mostra"} ${esc(label)}" onclick="event.stopPropagation(); toggleLezioniColumn('${esc(key)}')">${lessonColumnIcon(key)}</button>
  </th>`;
}
function lessonColumnCell(key, content) {
  return `<td class="lesson-toggle-cell lesson-col-${key}"><span class="lesson-col-content">${content}</span></td>`;
}
function lessonColumnIcon(key) {
  const icons = {
    data: '<svg class="lesson-col-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 2v4M16 2v4M3 10h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    luogo: '<svg class="lesson-col-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    note: '<svg class="lesson-col-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h8l4 4v14H7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M15 3v5h5M10 13h7M10 17h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  return icons[key] || "";
}
function toggleLezioniColumn(key) {
  if (!(key in lezioniColumnState)) return;
  lezioniColumnState[key] = !lezioniColumnState[key];
  refreshLessonColumnState();
}
function refreshLessonColumnState() {
  document.querySelectorAll(".lesson-table").forEach((table) => {
    Object.entries(lezioniColumnState).forEach(([key, open]) => {
      table.classList.toggle(`lesson-col-${key}-open`, open);
      table.classList.toggle(`lesson-col-${key}-closed`, !open);
      const btn = table.querySelector(`.lesson-col-toggle[data-column="${key}"]`);
      if (btn) {
        const label = btn.getAttribute("data-label") || btn.title.replace(/^(Mostra|Nascondi)\s+/, "");
        btn.setAttribute("aria-pressed", open ? "true" : "false");
        btn.setAttribute("aria-label", `${open ? "Nascondi" : "Mostra"} ${label}`);
        btn.title = `${open ? "Nascondi" : "Mostra"} ${label}`;
      }
    });
  });
}
function pastYearsForLezioni(lezioni) {
  const annoCorrente = (/* @__PURE__ */ new Date()).getFullYear();
  return [...new Set((lezioni || []).map((l) => Number(String(l.data || "").slice(0, 4))).filter((anno) => anno && anno < annoCorrente))].sort((a, b) => b - a);
}
function setAnniLezioni(expanded, variant = "lista", schedaId = null) {
  return __async(this, null, function* () {
    const target = variant === "scheda" ? schedaLezioniAnniEspansi : lezioniAnniEspansi;
    target.clear();
    if (expanded) {
      const lezioni = variant === "scheda" ? yield lezioniPerScheda(schedaId) : lezioniCache || [];
      pastYearsForLezioni(lezioni).forEach((anno) => target.add(anno));
    }
    if (variant === "scheda" && schedaId) {
      yield loadScheda(schedaId);
      switchSchedaTab("lezioni");
      return;
    }
    renderLezioni();
  });
}
function lezioniPerScheda(allievoId) {
  return __async(this, null, function* () {
    if (!allievoId) return [];
    const { data } = yield sb.from("lezioni_allievi").select("lezioni(id, data)").eq("allievo_id", allievoId);
    return (data || []).map((row) => row.lezioni).filter(Boolean);
  });
}
function renderRowsLezioni(lezioni, { showYearGroups = true, variant = "lista", schedaId = null, gruppoNome = null } = {}) {
  const annoCorrente = (/* @__PURE__ */ new Date()).getFullYear();
  const passate = /* @__PURE__ */ new Map();
  const rows = [];
  lezioni.forEach((l) => {
    const anno = Number(String(l.data || "").slice(0, 4)) || annoCorrente;
    if (showYearGroups && anno < annoCorrente) {
      if (!passate.has(anno)) passate.set(anno, []);
      passate.get(anno).push(l);
    } else {
      rows.push(renderLezioneListaRow(l, { variant, schedaId, gruppoNome }));
    }
  });
  const anniPassati = [...passate.keys()].sort((a, b) => b - a);
  ensureUltimoAnnoLezioniAperto(anniPassati, variant, schedaId);
  anniPassati.forEach((anno) => {
    const lezioniAnno = passate.get(anno);
    const expanded = variant === "scheda" ? schedaLezioniAnniEspansi.has(anno) : lezioniAnniEspansi.has(anno);
    const toggle = variant === "scheda" ? `toggleAnnoLezioniScheda(${anno},'${schedaId}')` : `toggleAnnoLezioni(${anno})`;
    const emptyLuogo = lessonColumnCell("luogo", "");
    const emptyNote = lessonColumnCell("note", "");
    rows.push(`
      <tr class="lezioni-year-row" onclick="${toggle}" style="cursor:pointer">
        ${lessonColumnCell("data", `${expanded ? "\u25BE" : "\u25B8"} ${anno}`)}
        <td><span class="year-count">${lezioniAnno.length} lezion${lezioniAnno.length === 1 ? "e" : "i"}</span></td>
        ${emptyNote}${emptyLuogo}
      </tr>`);
    if (expanded) rows.push(...lezioniAnno.map((l) => renderLezioneListaRow(l, { variant, schedaId, gruppoNome })));
  });
  return rows.join("");
}
function ensureUltimoAnnoLezioniAperto(anni, variant = "lista", schedaId = null) {
  if (!anni.length) return;
  if (variant === "scheda") {
    if (!schedaId || schedaLezioniAnniDefaultAperti.has(schedaId)) return;
    schedaLezioniAnniEspansi.add(anni[0]);
    schedaLezioniAnniDefaultAperti.add(schedaId);
    return;
  }
  if (lezioniAnniDefaultAperto) return;
  lezioniAnniEspansi.add(anni[0]);
  lezioniAnniDefaultAperto = true;
}
function renderLezioneListaRow(l, { variant = "lista", schedaId = null, gruppoNome = null } = {}) {
  const nomi = labelPartecipantiLezione(l);
  const detail = lezioniDettagliEspansi ? renderDettaglioLezione(l, { gruppoNome }) : "";
  const status = lessonStatus(l) === "aperta" ? '<span class="lesson-status-badge">Aperta</span>' : "";
  const dataLink = `<span class="linkish" onclick="event.stopPropagation(); openDayLessonsWidget('${esc(String(l.data || "").slice(0, 10))}')">${formatDate(l.data)}</span>`;
  const luogoLink = l.luogo ? `<span class="linkish" onclick="event.stopPropagation(); openLocation(${jsArg(l.luogo)})">${esc(l.luogo)}</span>` : "\u2014";
  const noteSpeciali = lessonSpecialNotes(l);
  if (variant === "scheda") {
    return `<tr onclick="openLezione('${l.id}','${schedaId}')" style="cursor:pointer">
      ${lessonColumnCell("data", `<strong>${dataLink}</strong> ${status}`)}
      <td style="font-size:.84rem">${renderSkillChipsLezione(l, schedaId)}</td>
      ${lessonColumnCell("note", `<div class="lezione-note-cell">${noteSpeciali ? esc(noteSpeciali) : "\u2014"}</div>`)}
      ${lessonColumnCell("luogo", luogoLink)}
    </tr>`;
  }
  return `<tr onclick="openLezione(${jsArg(l.id)},null,${jsArg(gruppoNome)})" style="cursor:pointer">
    ${lessonColumnCell("data", `<strong>${dataLink}</strong> ${status}`)}
    <td style="font-size:.84rem"><span class="linkish" onclick="event.stopPropagation(); openLessonParticipantTarget(${jsArg(l.id)})">${esc(nomi)}</span></td>
    ${lessonColumnCell("note", `<div class="lezione-note-cell">${noteSpeciali ? esc(noteSpeciali) : "\u2014"}</div>`)}
    ${lessonColumnCell("luogo", luogoLink)}
  </tr>${detail}`;
}
function openLessonParticipantTarget(lezioneId) {
  const l = (lezioniCache || []).find((item) => String(item.id) === String(lezioneId));
  const partecipanti = ((l == null ? void 0 : l.lezioni_allievi) || []).map((la) => la.allievi).filter(Boolean);
  if (partecipanti.length === 1) {
    loadScheda(partecipanti[0].id);
    return;
  }
  const gruppi = [...new Set(partecipanti.map((a) => a.gruppo).filter(Boolean))];
  if ((l == null ? void 0 : l.tipo) === "gruppo" && gruppi.length === 1) {
    showView("gruppo", gruppi[0]);
    return;
  }
  openLezione(lezioneId);
}
function openDayLessonsWidget(date) {
  const day = String(date || "").slice(0, 10);
  const lessons = (lezioniCache || []).filter((l) => String(l.data || "").slice(0, 10) === day);
  const existing = document.getElementById("modal-day-lessons");
  if (existing) existing.remove();
  const overlay = document.createElement("div");
  overlay.id = "modal-day-lessons";
  overlay.className = "overlay";
  overlay.onclick = (event) => {
    if (event.target === overlay) overlay.remove();
  };
  overlay.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()">
      <h3>${esc(formatDateWithWeekday(day))}</h3>
      <div style="display:grid;gap:.45rem">
        ${lessons.length ? lessons.map((l) => `
          <button type="button" class="btn btn-outline" style="justify-content:space-between;text-align:left" onclick="var modal=document.getElementById('modal-day-lessons'); if(modal) modal.remove(); openLezione(${jsArg(l.id)})">
            <span>${esc(labelPartecipantiLezione(l))}</span>
            <span style="color:var(--muted)">${l.luogo ? esc(l.luogo) : "\u2014"}</span>
          </button>`).join("") : '<div class="empty">Nessuna lezione in questo giorno.</div>'}
      </div>
      <div class="modal-footer"><button class="btn btn-outline" onclick="var modal=document.getElementById('modal-day-lessons'); if(modal) modal.remove()">Chiudi</button></div>
    </div>`;
  document.body.appendChild(overlay);
}
function lessonResultCompactLabel(value) {
  const result = normalizedLessonResult(value);
  return result === "bene" ? "" : lessonResultLabel(result);
}
function lessonSideFeedbackCompactLabel(value) {
  const side = normalizedLessonSideFeedback(value);
  return side === "bilaterale" ? "" : lessonSideFeedbackLabel(side);
}
function renderSkillChipsLezione(lezione, allievoId = null) {
  const viste = /* @__PURE__ */ new Set();
  const skills = (lezione.lezioni_skills || []).filter((ls) => !allievoId || !ls.allievo_id || String(ls.allievo_id) === String(allievoId)).map((ls) => {
    var _a2, _b2, _c;
    return { nome: (_a2 = ls.skills) == null ? void 0 : _a2.nome, stadio: ls.stadio_raggiunto || 0, esito: (_b2 = ls.dimensioni) == null ? void 0 : _b2.esito, latoFeedback: (_c = ls.dimensioni) == null ? void 0 : _c.lato_feedback, originale: latestSkillReplacementName(ls.dimensioni) };
  }).filter((s) => !isFakieSkillName(s.nome)).filter((s) => {
    const key = `${s.nome || ""}-${s.stadio}-${normalizedLessonResult(s.esito)}-${normalizedLessonSideFeedback(s.latoFeedback)}-${s.originale || ""}`;
    if (!s.nome || viste.has(key)) return false;
    viste.add(key);
    return true;
  });
  return skills.length ? skills.map((s) => {
    const feedback = [lessonResultCompactLabel(s.esito), lessonSideFeedbackCompactLabel(s.latoFeedback)].filter(Boolean).join(" \xB7 ");
    return `<span class="st st${s.stadio}">${esc(s.nome)}${s.originale ? ` <span class="skill-origin-note">prima: ${esc(s.originale)}</span>` : ""}${feedback ? ` \xB7 ${esc(feedback)}` : ""}</span>`;
  }).join(" ") : "\u2014";
}
function toggleAnnoLezioni(anno) {
  if (lezioniAnniEspansi.has(anno)) lezioniAnniEspansi.delete(anno);
  else lezioniAnniEspansi.add(anno);
  renderLezioni();
}
function toggleAnnoLezioniScheda(anno, allievoId) {
  return __async(this, null, function* () {
    if (schedaLezioniAnniEspansi.has(anno)) schedaLezioniAnniEspansi.delete(anno);
    else schedaLezioniAnniEspansi.add(anno);
    yield loadScheda(allievoId);
    switchSchedaTab("lezioni");
  });
}
function labelPartecipantiLezione(lezione) {
  const allievi = (lezione.lezioni_allievi || []).map((la) => la.allievi).filter(Boolean);
  if (!allievi.length) return "\u2014";
  const gruppi = [...new Set(allievi.map((a) => a.gruppo).filter(Boolean))];
  if (lezione.tipo === "gruppo" && gruppi.length === 1) return gruppi[0];
  return allievi.map((a) => [a.nome, a.cognome].filter(Boolean).join(" ")).join(", ");
}
function toggleDettagliLezioni() {
  lezioniDettagliEspansi = !lezioniDettagliEspansi;
  renderLezioni();
}
function aggiornaToggleDettagliLezioni() {
  const btn = document.getElementById("lezioni-dettagli-btn");
  if (!btn) return;
  btn.textContent = lezioniDettagliEspansi ? "Compatta" : "Espandi";
  btn.classList.toggle("btn-primary", lezioniDettagliEspansi);
  btn.classList.toggle("btn-outline", !lezioniDettagliEspansi);
  const openBtn = document.getElementById("lezioni-aperte-btn");
  if (openBtn) {
    openBtn.classList.toggle("btn-primary", filtroLezioniAperte);
    openBtn.classList.toggle("btn-outline", !filtroLezioniAperte);
    openBtn.textContent = filtroLezioniAperte ? "Solo aperte" : "Aperte";
  }
}
function setFiltroLezioniAperte(value) {
  filtroLezioniAperte = !!value;
  renderLezioni();
}
function toggleFiltroLezioniAperte() {
  setFiltroLezioniAperte(!filtroLezioniAperte);
}
function renderDettaglioLezione(lezione, { gruppoNome = null } = {}) {
  const skillRows = lezione.lezioni_skills || [];
  const viste = /* @__PURE__ */ new Set();
  const skills = skillRows.map((ls) => {
    var _a2, _b2, _c, _d;
    return { nome: (_a2 = ls.skills) == null ? void 0 : _a2.nome, stadio: ls.stadio_raggiunto || 0, esercizi: normalizeExerciseList((_b2 = ls.dimensioni) == null ? void 0 : _b2.esercizi), esito: (_c = ls.dimensioni) == null ? void 0 : _c.esito, latoFeedback: (_d = ls.dimensioni) == null ? void 0 : _d.lato_feedback, originale: latestSkillReplacementName(ls.dimensioni) };
  }).filter((s) => !isFakieSkillName(s.nome)).filter((s) => {
    const key = `${s.nome || ""}-${s.stadio}-${s.esercizi.join("|")}-${s.esito || ""}-${s.latoFeedback || ""}-${s.originale || ""}`;
    if (!s.nome || viste.has(key)) return false;
    viste.add(key);
    return true;
  });
  const skillsHtml = skills.length ? skills.map((s) => {
    const feedback = [s.esito ? lessonResultLabel(s.esito) : "", s.latoFeedback ? lessonSideFeedbackLabel(s.latoFeedback) : ""].filter(Boolean).join(" \xB7 ");
    return `<span class="st st${s.stadio}">${esc(s.nome)}${s.originale ? ` <span class="skill-origin-note">prima: ${esc(s.originale)}</span>` : ""}${feedback ? ` \xB7 ${esc(feedback)}` : ""}${s.esercizi.length ? ` \xB7 ${esc(s.esercizi.join(", "))}` : ""}</span>`;
  }).join("") : '<span class="lezione-empty-detail">Nessuna skill registrata.</span>';
  const parsedNotes = lessonParsedNotes(lezione);
  const notePreview = [parsedNotes.meteo ? `Meteo: ${parsedNotes.meteo}` : "", parsedNotes.bene ? `Bene: ${parsedNotes.bene}` : "", parsedNotes.nonFatto ? `Da riprendere: ${parsedNotes.nonFatto}` : "", parsedNotes.note].filter(Boolean).join("\n");
  const noteHtml = notePreview ? `<div class="lezione-note-preview">${esc(notePreview)}</div>` : '<span class="lezione-empty-detail">Nessuna nota.</span>';
  return `
    <tr class="lezione-detail-row" onclick="openLezione(${jsArg(lezione.id)},null,${jsArg(gruppoNome)})" style="cursor:pointer">
      <td colspan="4" class="lezione-detail-cell">
        <div class="lezione-detail-grid">
          <div>
            <div class="lezione-detail-title">Skill lavorate</div>
            <div class="lezione-skill-list">${skillsHtml}</div>
          </div>
          <div>
            <div class="lezione-detail-title">Note</div>
            ${noteHtml}
          </div>
        </div>
      </td>
    </tr>`;
}
function aggiornaFiltroLezioni() {
  const sel = document.getElementById("lezioni-filtro");
  if (!sel) return;
  const attivi = ordinaAllieviLista(allieviVisibiliGod().filter((a) => a.stato !== "archiviato"));
  const gruppi = [...new Set(attivi.map((a) => a.gruppo).filter(Boolean))].sort();
  const valoriValidi = /* @__PURE__ */ new Set(["all", ...gruppi.map((g) => `gruppo:${g}`), ...attivi.map((a) => `allievo:${a.id}`)]);
  if (!valoriValidi.has(filtroLezioni)) filtroLezioni = "all";
  sel.innerHTML = `
    <option value="all">Tutte le lezioni</option>
    ${gruppi.length ? `<optgroup label="Gruppi">${gruppi.map((g) => `<option value="gruppo:${esc(g)}">${esc(g)}</option>`).join("")}</optgroup>` : ""}
    ${attivi.length ? `<optgroup label="Allievi">${attivi.map((a) => `<option value="allievo:${a.id}">${esc([a.nome, a.cognome].filter(Boolean).join(" "))}</option>`).join("")}</optgroup>` : ""}
  `;
  sel.value = filtroLezioni;
}
function setFiltroLezioni(value) {
  filtroLezioni = value || "all";
  renderLezioni();
}
function filtraLezioniPerSelezione(lezioni) {
  if (filtroLezioni === "all") return lezioni;
  if (filtroLezioni.startsWith("allievo:")) {
    const id = filtroLezioni.slice("allievo:".length);
    return lezioni.filter((l) => {
      var _a2;
      return (_a2 = l.lezioni_allievi) == null ? void 0 : _a2.some((la) => {
        var _a3;
        return ((_a3 = la.allievi) == null ? void 0 : _a3.id) === id;
      });
    });
  }
  if (filtroLezioni.startsWith("gruppo:")) {
    const gruppo = filtroLezioni.slice("gruppo:".length);
    return lezioni.filter((l) => {
      var _a2;
      return (_a2 = l.lezioni_allievi) == null ? void 0 : _a2.some((la) => {
        var _a3;
        return ((_a3 = la.allievi) == null ? void 0 : _a3.gruppo) === gruppo;
      });
    });
  }
  return lezioni;
}
function fetchLezioneCompleta(id) {
  return __async(this, null, function* () {
    let { data: lezione, error } = yield sb.from("lezioni").select("*, lezioni_allievi(allievo_id, allievi(id, nome, cognome, nickname, gruppo, profilo)), lezioni_skills(allievo_id, stadio_raggiunto, fakie, dimensioni, skills(nome, ramo, livello))").eq("id", id).single();
    if (isMissingDimensioniError(error)) {
      ;
      ({ data: lezione, error } = yield sb.from("lezioni").select("*, lezioni_allievi(allievo_id, allievi(id, nome, cognome, nickname, gruppo)), lezioni_skills(allievo_id, stadio_raggiunto, fakie, skills(nome, ramo, livello))").eq("id", id).single());
    }
    if (isMissingFakieError(error)) {
      ;
      ({ data: lezione, error } = yield sb.from("lezioni").select("*, lezioni_allievi(allievo_id, allievi(id, nome, cognome, nickname, gruppo)), lezioni_skills(allievo_id, stadio_raggiunto, skills(nome, ramo, livello))").eq("id", id).single());
    }
    if (isMissingNoteSpecialiError(error)) {
      ;
      ({ data: lezione, error } = yield sb.from("lezioni").select("*, lezioni_allievi(allievo_id, allievi(id, nome, cognome, nickname, gruppo)), lezioni_skills(allievo_id, stadio_raggiunto, skills(nome, ramo, livello))").eq("id", id).single());
      if (lezione) lezione.note_speciali = null;
    }
    return { lezione, error };
  });
}
function lezioneNavStessoAllievo(lezione, partecipanti) {
  return __async(this, null, function* () {
    const contextAllievoId = lezioneBackAllievoId && partecipanti.some((a) => a.id === lezioneBackAllievoId) ? lezioneBackAllievoId : partecipanti.length === 1 ? partecipanti[0].id : null;
    const gruppiLezione = [...new Set(partecipanti.map((a) => a.gruppo).filter(Boolean))];
    const contextGruppoNome = contextAllievoId ? null : lezioneBackGruppoNome && partecipanti.some((a) => a.gruppo === lezioneBackGruppoNome) ? lezioneBackGruppoNome : lezione.tipo === "gruppo" && gruppiLezione.length === 1 ? gruppiLezione[0] : null;
    if (!contextAllievoId && !contextGruppoNome) return { allievoId: null, gruppoNome: null, prev: null, next: null };
    const query = sb.from("lezioni_allievi").select("lezione_id, lezioni(id, data)");
    const membriGruppo = contextGruppoNome ? gruppoMembri(contextGruppoNome, { includeArchived: true }) : [];
    const { data, error } = contextAllievoId ? yield query.eq("allievo_id", contextAllievoId) : yield query.in("allievo_id", membriGruppo.map((a) => a.id));
    if (error) return { allievoId: contextAllievoId, gruppoNome: contextGruppoNome, prev: null, next: null };
    const byId = /* @__PURE__ */ new Map();
    (data || []).forEach((row) => {
      const l = row.lezioni;
      if (l == null ? void 0 : l.id) byId.set(l.id, l);
    });
    const lezioni = [...byId.values()].sort((a, b) => String(a.data || "").localeCompare(String(b.data || "")) || String(a.id).localeCompare(String(b.id)));
    const index = lezioni.findIndex((l) => l.id === lezione.id);
    return {
      allievoId: contextAllievoId,
      gruppoNome: contextGruppoNome,
      prev: index > 0 ? lezioni[index - 1] : null,
      next: index >= 0 && index < lezioni.length - 1 ? lezioni[index + 1] : null
    };
  });
}
function cancellaLezioneInModifica() {
  return __async(this, null, function* () {
    if (!editingLezioneId) return;
    if (!confirm("Cancellare questa lezione? Prima verra salvata una copia nel backup locale.")) return;
    const errEl = document.getElementById("lz-err");
    errEl.classList.remove("show");
    const buttons = [document.getElementById("btn-cancella-lz"), document.getElementById("btn-salva-lz"), document.getElementById("btn-salva-lz-top")].filter(Boolean);
    buttons.forEach((btn) => {
      btn.disabled = true;
    });
    try {
      const { lezione, error } = yield fetchLezioneCompleta(editingLezioneId);
      if (error) throw error;
      salvaBackupLocale("lezione_cancellata", lezione);
      yield sb.from("lezioni_skills").delete().eq("lezione_id", editingLezioneId);
      yield sb.from("lezioni_allievi").delete().eq("lezione_id", editingLezioneId);
      const { error: deleteError } = yield sb.from("lezioni").delete().eq("id", editingLezioneId);
      if (deleteError) throw deleteError;
      const backId = lezioneBackAllievoId;
      editingLezioneId = null;
      editingLezioneAllieviIds = [];
      editingLezioneSkillRows = {};
      lezioniCache = null;
      if (backId) {
        yield loadScheda(backId);
        switchSchedaTab("lezioni");
      } else {
        showView("lezioni");
      }
    } catch (e) {
      errEl.textContent = e.message || "Errore nella cancellazione della lezione.";
      errEl.classList.add("show");
      buttons.forEach((btn) => {
        btn.disabled = false;
      });
    }
  });
}
function loadLezione(id) {
  return __async(this, null, function* () {
    currentLezioneId = id;
    recordAppHistory("lezione", id);
    const el = document.getElementById("lezione-content");
    el.innerHTML = '<div class="loading">Caricamento\u2026</div>';
    const { lezione, error } = yield fetchLezioneCompleta(id);
    if (error || !lezione) {
      el.innerHTML = `<button class="back-btn" onclick="tornaDaLezione()">${lezioneBackLabel()}</button><div class="card"><div class="empty">${esc((error == null ? void 0 : error.message) || "Lezione non trovata.")}</div></div>`;
      return;
    }
    const partecipanti = (lezione.lezioni_allievi || []).map((la) => la.allievi).filter(Boolean);
    const gruppiLezione = [...new Set(partecipanti.map((a) => a.gruppo).filter(Boolean))];
    const titoloLezione = lezione.tipo === "gruppo" && gruppiLezione.length === 1 ? gruppiLezione[0] : labelPartecipantiLezione(lezione);
    const dettagliQuando = [
      lezione.durata_min ? `${lezione.durata_min} min` : "",
      lezione.luogo ? esc(lezione.luogo) : ""
    ].filter(Boolean).join("<br>");
    const navStessoAllievo = yield lezioneNavStessoAllievo(lezione, partecipanti);
    const navArrow = (target, direction) => {
      const isPrev = direction === "prev";
      const label = isPrev ? "Lezione precedente" : "Lezione successiva";
      const arrow = isPrev ? "\u2039" : "\u203A";
      if (!target) return `<button type="button" class="lezione-nav-arrow" disabled aria-label="${label}">${arrow}</button>`;
      return `<button type="button" class="lezione-nav-arrow" onclick="openLezione(${jsArg(target.id)},${jsArg(navStessoAllievo.allievoId)},${jsArg(navStessoAllievo.gruppoNome)})" title="${label}: ${esc(formatDateWithWeekday(target.data))}" aria-label="${label}">${arrow}</button>`;
    };
    const partecipantiHtml = partecipanti.length ? partecipanti.map((a) => {
      const nomeCompleto = [a.nome, a.cognome].filter(Boolean).join(" ");
      return `
          <div class="lezione-read-person clickable" onclick="apriSchedaAllievoDaLezione('${a.id}')" title="Apri scheda allievo">
            ${a.nickname ? `<strong>${esc(a.nickname)}</strong>` : ""}
            ${nomeCompleto ? `<span>${a.nickname ? "\xB7 " : ""}${esc(nomeCompleto)}</span>` : ""}
            ${a.gruppo ? `<span>\xB7 ${esc(a.gruppo)}</span>` : ""}
          </div>`;
    }).join("") : '<div class="empty">Nessun allievo collegato.</div>';
    const skillsByAllievo = {};
    (lezione.lezioni_skills || []).forEach((row) => {
      var _a2;
      if (isFakieSkillName((_a2 = row.skills) == null ? void 0 : _a2.nome)) return;
      const key = row.allievo_id || "generale";
      if (!skillsByAllievo[key]) skillsByAllievo[key] = [];
      skillsByAllievo[key].push(row);
    });
    const skillsHtml = Object.keys(skillsByAllievo).length ? Object.entries(skillsByAllievo).map(([allievoId, rows]) => {
      const allievo = partecipanti.find((a) => a.id === allievoId);
      const titolo = allievo ? [allievo.nome, allievo.cognome].filter(Boolean).join(" ") : "Skill lavorate";
      const chips = rows.filter((r) => {
        var _a2;
        return (_a2 = r.skills) == null ? void 0 : _a2.nome;
      }).map((r) => {
        var _a2, _b2, _c, _d;
        const direzione = ((_a2 = r.dimensioni) == null ? void 0 : _a2.direzione) || (r.fakie ? "fakie" : "");
        const esercizi = normalizeExerciseList((_b2 = r.dimensioni) == null ? void 0 : _b2.esercizi);
        const feedback = [((_c = r.dimensioni) == null ? void 0 : _c.esito) ? lessonResultLabel(r.dimensioni.esito) : "", ((_d = r.dimensioni) == null ? void 0 : _d.lato_feedback) ? lessonSideFeedbackLabel(r.dimensioni.lato_feedback) : ""].filter(Boolean);
        const dimensionLabels = ["lato", "superficie", "piano", "velocita", "assistenza", "stress"].map((key) => {
          var _a3;
          return dimensionValueLabel((_a3 = r.dimensioni) == null ? void 0 : _a3[key]);
        }).filter(Boolean);
        const extra = [...feedback, direzione, ...dimensionLabels, esercizi.length ? `esercizi: ${esercizi.join(", ")}` : ""].filter(Boolean).join(" \xB7 ");
        return `<span class="st st${r.stadio_raggiunto || 0}">${esc(r.skills.nome)}${extra ? ` \xB7 ${esc(extra)}` : ""}${r.skills.livello ? ` \xB7 Lv.${r.skills.livello}` : ""}</span>`;
      }).join("");
      return `<div class="lezione-read-block">
          <h4>${esc(titolo)}</h4>
          <div class="lezione-skill-list">${chips || '<span class="lezione-empty-detail">Nessuna skill registrata.</span>'}</div>
        </div>`;
    }).join("") : '<div class="empty">Nessuna skill registrata.</div>';
    const pickLessonField = (keys) => {
      for (const key of keys) {
        const value = lezione[key];
        if (value === null || value === void 0 || value === "") continue;
        if (Array.isArray(value) && !value.length) continue;
        return Array.isArray(value) ? value.join("\n") : String(value);
      }
      return "";
    };
    const pianoLezione = [
      ["Teoria", pickLessonField(["teoria"])],
      ["Riscaldamento", pickLessonField(["riscaldamento"])],
      ["Lezione", pickLessonField(["lezione", "struttura_lezione", "programma_lezione"])],
      ["Gioco", pickLessonField(["gioco"])]
    ].filter(([, value]) => value);
    const pianoLezioneHtml = `<p class="sec-title">Lezione</p>
    <div class="card">
      ${pianoLezione.length ? `
        <table class="lezione-plan-table">
          <tbody>
            ${pianoLezione.map(([label, value]) => `<tr><th>${esc(label)}</th><td>${esc(value)}</td></tr>`).join("")}
          </tbody>
        </table>` : '<div class="empty">Nessuna struttura lezione registrata.</div>'}
    </div>`;
    const parsedNotes = lessonParsedNotes(lezione);
    const noteSpecialiRead = lessonSpecialNotes(lezione);
    el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1rem;flex-wrap:wrap">
      <button class="back-btn" onclick="tornaDaLezione()" style="margin-bottom:0">${lezioneBackLabel()}</button>
      <div style="display:flex;gap:.45rem;flex-wrap:wrap">
        ${lessonStatus(lezione) === "aperta" ? `<button class="btn btn-primary btn-sm" onclick="chiudiLezioneGuidata(${jsArg(lezione.id)})">Chiudi lezione</button>` : ""}
        <button class="btn btn-outline btn-sm" onclick="openHistoryModal('lezione',${jsArg(lezione.id)},'Storico lezione')">Storico</button>
        <button class="btn btn-outline btn-sm" onclick="showView('nuova-lezione','lezione:${lezione.id}')">${editIcon()} Modifica</button>
      </div>
    </div>

    <div class="card">
      <div class="lezione-read-head">
        <div>
          <div class="lezione-read-title">${esc(titoloLezione)}</div>
          ${lessonStatus(lezione) === "aperta" ? '<div style="margin-top:.4rem"><span class="lesson-status-badge">Aperta</span></div>' : ""}
        </div>
        <div class="lezione-read-when">
          <div class="lezione-when-nav">
            ${navArrow(navStessoAllievo.prev, "prev")}
            <div class="lezione-when-main">
              <div class="lezione-read-date">${formatDateWithWeekday(lezione.data)}</div>
              ${dettagliQuando || "<span>Orario e luogo non indicati</span>"}
            </div>
            ${navArrow(navStessoAllievo.next, "next")}
          </div>
        </div>
      </div>
      ${lezione.updated_at || lezione.aggiornato_il ? `<div style="color:var(--muted);font-size:.78rem;margin-top:.55rem">Ultima modifica: ${esc(formatDateTime(lezione.updated_at || lezione.aggiornato_il))}</div>` : ""}
    </div>

    ${noteSpecialiRead ? `
      <p class="sec-title">Note speciali</p>
      <div class="card"><div class="lezione-read-note">${esc(noteSpecialiRead)}</div></div>
    ` : ""}

    ${parsedNotes.meteo ? `
      <p class="sec-title">Meteo</p>
      <div class="card"><div class="lezione-read-note">${esc(parsedNotes.meteo)}</div></div>
    ` : ""}

    <div class="lezione-read-grid">
      <div>
        <p class="sec-title">Allievi presenti</p>
        <div class="card"><div class="lezione-read-list">${partecipantiHtml}</div></div>
      </div>
      <div>
        ${pianoLezioneHtml}
        <p class="sec-title">Skill lavorate</p>
        <div class="card">${skillsHtml}</div>
      </div>
    </div>

    ${renderLessonCheckBlocks(lezione)}

    <p class="sec-title">Note</p>
    <div class="card">
      ${parsedNotes.note ? `<div class="lezione-read-note">${esc(parsedNotes.note)}</div>` : '<div class="empty">Nessuna nota registrata.</div>'}
    </div>
  `;
    requestAnimationFrame(() => motion.cards(el));
  });
}
function lezioneFormTitle(isEdit = false) {
  if (isEdit) return "Modifica lezione";
  if (lezioneFormMode === "prep") return "Prepara lezione";
  if (lezioneFormMode === "postuma") return "Lezione postuma";
  return "Nuova lezione";
}
function lezioneFormSaveLabel(isEdit = false) {
  if (isEdit) return "Salva modifiche";
  if (lezioneFormMode === "prep") return "Salva aperta";
  if (lezioneFormMode === "postuma") return "Salva lezione fatta";
  return "Salva lezione";
}
function syncLezioneFormLabels(isEdit = !!editingLezioneId) {
  document.getElementById("lz-title").textContent = lezioneFormTitle(isEdit);
  document.getElementById("btn-salva-lz").textContent = lezioneFormSaveLabel(isEdit);
  document.getElementById("btn-salva-lz-top").textContent = lezioneFormSaveLabel(isEdit);
  const prep = lezioneFormMode === "prep" && !isEdit;
  document.getElementById("lz-check-title").hidden = prep;
  document.getElementById("lz-check-grid").hidden = prep;
  document.getElementById("lz-note-field").hidden = prep;
}
function initNuovaLezione(presetAllievoId = null) {
  return __async(this, null, function* () {
    editingLezioneId = null;
    editingLezioneAllieviIds = [];
    editingLezioneSkillRows = {};
    lezioneFormMode = "standard";
    let explicitLezioneMode = false;
    if (typeof presetAllievoId === "string" && presetAllievoId.startsWith("modo:prep")) {
      lezioneFormMode = "prep";
      explicitLezioneMode = true;
      presetAllievoId = presetAllievoId.startsWith("modo:prep:") ? presetAllievoId.slice("modo:prep:".length) : null;
    } else if (typeof presetAllievoId === "string" && presetAllievoId.startsWith("modo:postuma")) {
      lezioneFormMode = "postuma";
      explicitLezioneMode = true;
      presetAllievoId = presetAllievoId.startsWith("modo:postuma:") ? presetAllievoId.slice("modo:postuma:".length) : null;
    }
    const editId = typeof presetAllievoId === "string" && presetAllievoId.startsWith("lezione:") ? presetAllievoId.slice("lezione:".length) : null;
    const groupPreset = typeof presetAllievoId === "string" && presetAllievoId.startsWith("gruppo:") ? presetAllievoId.slice("gruppo:".length) : null;
    lezionePresetAllievoId = editId || groupPreset ? null : presetAllievoId;
    if (!editId) {
      lezioneBackAllievoId = groupPreset ? null : presetAllievoId || null;
      lezioneBackGruppoNome = groupPreset || null;
    }
    document.getElementById("lz-data").value = localDateIso();
    document.getElementById("lz-durata").value = "";
    document.getElementById("lz-luogo").value = "";
    document.getElementById("lz-meteo").value = "";
    setLessonStatus(lezioneFormMode === "postuma" ? "chiusa" : "aperta");
    document.getElementById("lz-luogo-suggest").hidden = true;
    document.getElementById("lz-luogo-suggest").innerHTML = "";
    document.getElementById("lz-note-speciali").value = "";
    document.getElementById("lz-check-bene").value = "";
    document.getElementById("lz-check-non-fatto").value = "";
    document.getElementById("lz-note").value = "";
    document.getElementById("lz-err").classList.remove("show");
    document.getElementById("lz-prep-board").hidden = true;
    document.getElementById("lz-prep-board").innerHTML = "";
    document.getElementById("lz-skills-container").innerHTML = "";
    document.getElementById("lz-gruppo-panel").hidden = true;
    document.getElementById("lz-gruppo-panel").innerHTML = "";
    document.getElementById("lz-allievi-list").innerHTML = "";
    document.getElementById("lz-hidden-checks").innerHTML = "";
    document.getElementById("lz-special-guest-panel").hidden = true;
    document.getElementById("lz-special-guest-panel").innerHTML = "";
    syncLezioneFormLabels(!!editId);
    document.getElementById("btn-cancella-lz").hidden = !editId;
    document.getElementById("lz-back-btn").textContent = lezioneBackLabel();
    if (editId) {
      let { data: lezione, error } = yield sb.from("lezioni").select("id, data, tipo, durata_min, luogo, meteo, note, note_speciali, stato, check_bene, check_non_fatto, lezioni_allievi(allievo_id), lezioni_skills(allievo_id, skill_id, stadio_raggiunto, fakie, dimensioni)").eq("id", editId).single();
      if (isMissingLessonMeteoError(error)) {
        ;
        ({ data: lezione, error } = yield sb.from("lezioni").select("id, data, tipo, durata_min, luogo, note, note_speciali, stato, check_bene, check_non_fatto, lezioni_allievi(allievo_id), lezioni_skills(allievo_id, skill_id, stadio_raggiunto, fakie, dimensioni)").eq("id", editId).single());
      }
      if (isMissingLessonCheckError(error)) {
        ;
        ({ data: lezione, error } = yield sb.from("lezioni").select("id, data, tipo, durata_min, luogo, note, note_speciali, stato, lezioni_allievi(allievo_id), lezioni_skills(allievo_id, skill_id, stadio_raggiunto, fakie, dimensioni)").eq("id", editId).single());
      }
      if (isMissingLessonStatusError(error)) {
        ;
        ({ data: lezione, error } = yield sb.from("lezioni").select("id, data, tipo, durata_min, luogo, note, note_speciali, lezioni_allievi(allievo_id), lezioni_skills(allievo_id, skill_id, stadio_raggiunto, fakie, dimensioni)").eq("id", editId).single());
      }
      if (isMissingDimensioniError(error)) {
        ;
        ({ data: lezione, error } = yield sb.from("lezioni").select("id, data, tipo, durata_min, luogo, note, note_speciali, lezioni_allievi(allievo_id), lezioni_skills(allievo_id, skill_id, stadio_raggiunto, fakie)").eq("id", editId).single());
      }
      if (isMissingFakieError(error)) {
        ;
        ({ data: lezione, error } = yield sb.from("lezioni").select("id, data, tipo, durata_min, luogo, note, note_speciali, lezioni_allievi(allievo_id), lezioni_skills(allievo_id, skill_id, stadio_raggiunto)").eq("id", editId).single());
      }
      if (isMissingNoteSpecialiError(error)) {
        ;
        ({ data: lezione, error } = yield sb.from("lezioni").select("id, data, tipo, durata_min, luogo, note, lezioni_allievi(allievo_id), lezioni_skills(allievo_id, skill_id, stadio_raggiunto)").eq("id", editId).single());
        if (lezione) lezione.note_speciali = null;
      }
      if (error || !lezione) {
        const errEl = document.getElementById("lz-err");
        errEl.textContent = (error == null ? void 0 : error.message) || "Lezione non trovata.";
        errEl.classList.add("show");
        renderLezionePartecipanti();
        return;
      }
      editingLezioneId = editId;
      editingLezioneAllieviIds = (lezione.lezioni_allievi || []).map((r) => r.allievo_id).filter(Boolean);
      (lezione.lezioni_skills || []).forEach((r) => {
        if (!r.allievo_id) return;
        if (!editingLezioneSkillRows[r.allievo_id]) editingLezioneSkillRows[r.allievo_id] = [];
        editingLezioneSkillRows[r.allievo_id].push({
          skillId: r.skill_id,
          stadio: r.stadio_raggiunto || 1,
          fakie: !!r.fakie,
          dimensioni: r.dimensioni || null
        });
      });
      document.getElementById("lz-data").value = lezione.data || "";
      document.getElementById("lz-durata").value = lezione.durata_min || "";
      document.getElementById("lz-luogo").value = lezione.luogo || "";
      setLessonStatus(lessonStatus(lezione));
      const parsedNotes = lessonParsedNotes(lezione);
      document.getElementById("lz-meteo").value = parsedNotes.meteo || "";
      document.getElementById("lz-note-speciali").value = lezione.note_speciali || parsedNotes.speciali || "";
      document.getElementById("lz-check-bene").value = parsedNotes.bene || "";
      document.getElementById("lz-check-non-fatto").value = parsedNotes.nonFatto || "";
      document.getElementById("lz-note").value = parsedNotes.note || "";
    }
    renderLezioneTargetOptions();
    if (editId) setLezioneTargetFromEditing();
    else if (groupPreset) document.getElementById("lz-tipo").value = `gruppo:${groupPreset}`;
    else if (lezionePresetAllievoId) document.getElementById("lz-tipo").value = `allievo:${lezionePresetAllievoId}`;
    else document.getElementById("lz-tipo").value = "";
    if (editId && currentLessonTargetIsGroup()) collapseCommonGroupSkillRows(editingLezioneAllieviIds);
    const draft = !editId && !explicitLezioneMode ? loadLezioneDraft() : null;
    const draftSelectedIds = draft ? restoreLezioneDraft(draft) : [];
    if (draft == null ? void 0 : draft.formMode) lezioneFormMode = draft.formMode;
    syncLezioneFormLabels(!!editId);
    renderLezionePartecipanti();
    if (editId) {
      editingLezioneAllieviIds.filter((id) => !selectedLezioneAllieviIds().includes(id)).forEach((id) => addSpecialGuestToLesson(id));
    }
    draftSelectedIds.filter((id) => !selectedLezioneAllieviIds().includes(id)).forEach((id) => addSpecialGuestToLesson(id));
    if (pendingSpecialGuestId) {
      addSpecialGuestToLesson(pendingSpecialGuestId);
      pendingSpecialGuestId = null;
      saveLezioneDraft({ keep: true });
    }
  });
}
function renderLezionePartecipanti() {
  const target = document.getElementById("lz-tipo").value;
  const listEl = document.getElementById("lz-allievi-list");
  const groupPanel = document.getElementById("lz-gruppo-panel");
  const hiddenChecks = document.getElementById("lz-hidden-checks");
  const errEl = document.getElementById("lz-err");
  document.getElementById("lz-skills-container").innerHTML = "";
  groupPanel.hidden = true;
  groupPanel.innerHTML = "";
  listEl.innerHTML = "";
  hiddenChecks.innerHTML = "";
  if (target && (errEl == null ? void 0 : errEl.textContent) === "Seleziona allievo, gruppo o campo libero.") {
    errEl.classList.remove("show");
  }
  const attivi = allieviSelezionabiliLezione();
  if (!attivi.length) {
    renderSpecialGuestPanel();
    return;
  }
  if (target.startsWith("allievo:")) {
    setLezioneAllievi([target.slice("allievo:".length)]);
  } else if (target.startsWith("gruppo:")) {
    const gruppo = target.slice("gruppo:".length);
    const ids = allieviSelezionabiliLezione().filter((a) => a.gruppo === gruppo).map((a) => a.id);
    setLezioneAllievi(ids);
    renderGroupLessonPanel(gruppo);
    renderGroupSkillWorkspace();
  }
  lezionePresetAllievoId = null;
  renderSpecialGuestPanel();
  renderPrepBoard();
  refreshSuggerimentiLuogoSeAperti();
}
function currentLessonTargetIsGroup() {
  var _a2, _b2;
  return (_b2 = (_a2 = document.getElementById("lz-tipo")) == null ? void 0 : _a2.value) == null ? void 0 : _b2.startsWith("gruppo:");
}
function allievoById(id) {
  return allAllievi.find((a) => a.id === id) || null;
}
function allievoDisplayName(id) {
  const a = allievoById(id);
  if (!a) return id;
  return [a.cognome, a.nome].filter(Boolean).join(" ") || a.nickname || id;
}
function allieviSelezionabiliLezione({ includeArchived = false } = {}) {
  const visibili = allieviVisibiliGod();
  return includeArchived ? visibili : visibili.filter((a) => a.stato !== "archiviato");
}
function lezioneTargetLabelAllievo(a) {
  return `${[a.cognome, a.nome].filter(Boolean).join(" ")}${a.nickname ? " \xB7 " + a.nickname : ""}`;
}
function renderLezioneTargetOptions(selected = "") {
  const sel = document.getElementById("lz-tipo");
  if (!sel) return;
  const attivi = ordinaAllieviLista(allieviSelezionabiliLezione());
  const gruppi = gruppiSelezionabiliLezione();
  sel.innerHTML = `
    <option value="">\u2014 Seleziona allievo o gruppo \u2014</option>
    ${attivi.length ? `<optgroup label="Allievi">${attivi.map((a) => `<option value="allievo:${a.id}">${esc(lezioneTargetLabelAllievo(a))}</option>`).join("")}</optgroup>` : ""}
    ${gruppi.length ? `<optgroup label="Gruppi">${gruppi.map((g) => `<option value="gruppo:${esc(g)}">${esc(g)}</option>`).join("")}</optgroup>` : ""}
    <option value="campo_libero">Campo libero</option>`;
  sel.value = [...sel.options].some((option) => option.value === selected) ? selected : "";
}
function setLezioneTargetFromEditing() {
  const sel = document.getElementById("lz-tipo");
  if (!sel) return;
  if (!editingLezioneAllieviIds.length) {
    sel.value = "campo_libero";
    return;
  }
  const gruppo = gruppoDaAllieviLezione(editingLezioneAllieviIds);
  const membriGruppo = gruppo ? allieviSelezionabiliLezione().filter((a) => a.gruppo === gruppo).map((a) => a.id).sort() : [];
  const editingIds = [...editingLezioneAllieviIds].sort();
  if (gruppo && membriGruppo.length && membriGruppo.every((id) => editingIds.includes(id))) {
    sel.value = `gruppo:${gruppo}`;
    return;
  }
  if (editingLezioneAllieviIds.length === 1) {
    sel.value = `allievo:${editingLezioneAllieviIds[0]}`;
    return;
  }
  sel.value = "campo_libero";
}
function gruppiSelezionabiliLezione({ includeArchived = false } = {}) {
  return [...new Set(allieviSelezionabiliLezione({ includeArchived }).map((a) => a.gruppo).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}
function gruppoDaAllieviLezione(ids) {
  if (!(ids == null ? void 0 : ids.length)) return "";
  const idSet = new Set(ids);
  const gruppiDisponibili = gruppiSelezionabiliLezione({ includeArchived: true });
  const gruppoCompleto = gruppiDisponibili.find((gruppo) => {
    const membri = allieviSelezionabiliLezione({ includeArchived: true }).filter((a) => a.gruppo === gruppo).map((a) => a.id);
    return membri.length && membri.every((id) => idSet.has(id));
  });
  if (gruppoCompleto) return gruppoCompleto;
  const gruppi = [...new Set(allAllievi.filter((a) => ids.includes(a.id)).map((a) => a.gruppo).filter(Boolean))];
  return gruppi.length === 1 ? gruppi[0] : "";
}
function renderAllieviGruppoLezione(gruppo, presentiSet = null) {
  const listEl = document.getElementById("lz-allievi-list");
  document.getElementById("lz-skills-container").innerHTML = "";
  if (!gruppo) {
    listEl.innerHTML = '<div class="empty">Seleziona un gruppo per vedere gli allievi.</div>';
    return;
  }
  const membri = allieviSelezionabiliLezione().filter((a) => a.gruppo === gruppo);
  if (!membri.length) {
    listEl.innerHTML = '<div class="empty">Nessun allievo attivo in questo gruppo.</div>';
    return;
  }
  listEl.innerHTML = membri.map((a) => `
    <label style="display:flex;align-items:center;gap:.6rem;padding:.4rem 0;font-size:.9rem">
      <input type="checkbox" value="${a.id}" ${presentiSet && !presentiSet.has(a.id) ? "" : "checked"} onchange="toggleAllievo(this,'${esc([a.nome, a.cognome].filter(Boolean).join(" "))}')">
      ${esc([a.cognome, a.nome].filter(Boolean).join(" "))}
    </label>`).join("");
  [...listEl.querySelectorAll("input[type=checkbox]:checked")].forEach((cb) => {
    const a = membri.find((m) => m.id === cb.value);
    if (a) toggleAllievo(cb, [a.nome, a.cognome].filter(Boolean).join(" "));
  });
}
function renderGroupLessonPanel(gruppo) {
  const panel = document.getElementById("lz-gruppo-panel");
  const selected = new Set(selectedLezioneAllieviIds());
  const membri = allieviSelezionabiliLezione().filter((a) => a.gruppo === gruppo);
  const guests = selectedLezioneAllieviIds().map((id) => allievoById(id)).filter((a) => a && a.gruppo !== gruppo);
  panel.hidden = false;
  panel.innerHTML = `
    <div class="card">
      <p class="form-sec" style="margin-top:0">Presenti</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:.35rem .8rem">
        ${membri.map((a) => `
          <label style="display:flex;align-items:center;gap:.55rem;font-size:.9rem">
            <input type="checkbox" value="${a.id}" ${selected.has(a.id) ? "checked" : ""} onchange="togglePresenzaGruppoLezione(this)">
            ${esc(allievoDisplayName(a.id))}
          </label>`).join("")}
      </div>
      ${guests.length ? `<div style="margin-top:.75rem;color:var(--muted);font-size:.86rem">Guest: ${guests.map((a) => esc(allievoDisplayName(a.id))).join(", ")}</div>` : ""}
    </div>`;
}
function togglePresenzaGruppoLezione(cb) {
  const hidden = [...document.querySelectorAll("#lz-hidden-checks input")].find((input) => input.value === cb.value);
  if (hidden) hidden.checked = cb.checked;
  else if (cb.checked) document.getElementById("lz-hidden-checks").insertAdjacentHTML("beforeend", `<input type="checkbox" value="${cb.value}" checked>`);
  refreshGroupExclusionControls();
  renderGroupIndividualControls();
  renderSpecialGuestPanel();
  renderPrepBoard();
  refreshSuggerimentiLuogoSeAperti();
  suggerisciDurataDaUltimaLezione();
}
function setLezioneAllievi(ids) {
  const holder = document.getElementById("lz-hidden-checks");
  document.getElementById("lz-skills-container").innerHTML = "";
  holder.innerHTML = ids.map((id) => `<input type="checkbox" value="${id}" checked>`).join("");
  if (currentLessonTargetIsGroup()) {
    refreshSuggerimentiLuogoSeAperti();
    suggerisciDurataDaUltimaLezione();
    return;
  }
  ids.forEach((id) => {
    const a = allieviSelezionabiliLezione().find((x) => x.id === id);
    if (a) toggleAllievo({ checked: true, value: id }, [a.nome, a.cognome].filter(Boolean).join(" "));
  });
  refreshSuggerimentiLuogoSeAperti();
  renderPrepBoard();
  suggerisciDurataDaUltimaLezione();
}
function selectedLezioneAllieviIds() {
  return [...document.querySelectorAll("#lz-hidden-checks input[type=checkbox]:checked")].map((input) => input.value);
}
function luoghiCacheKey(ids) {
  return [...new Set(ids || [])].sort().join("|");
}
function luoghiFrequentatiAllievi(ids) {
  return __async(this, null, function* () {
    const cleanIds = [...new Set((ids || []).filter(Boolean))];
    if (!cleanIds.length) return [];
    const key = luoghiCacheKey(cleanIds);
    if (luoghiLezioneCache.has(key)) return luoghiLezioneCache.get(key);
    const { data } = yield sb.from("lezioni_allievi").select("lezioni(luogo, data)").in("allievo_id", cleanIds);
    const stats = /* @__PURE__ */ new Map();
    (data || []).forEach((row) => {
      var _a2, _b2, _c, _d;
      const luogo = (_b2 = (_a2 = row.lezioni) == null ? void 0 : _a2.luogo) == null ? void 0 : _b2.trim();
      if (!luogo) return;
      const k = normalizeText(luogo);
      const prev = stats.get(k) || { luogo, count: 0, latest: "" };
      prev.count += 1;
      if (String(((_c = row.lezioni) == null ? void 0 : _c.data) || "") > prev.latest) prev.latest = String(((_d = row.lezioni) == null ? void 0 : _d.data) || "");
      stats.set(k, prev);
    });
    (yield loadLocations()).forEach((loc) => {
      const luogo = String(loc.nome || "").trim();
      if (!luogo) return;
      const k = normalizeText(luogo);
      const prev = stats.get(k) || { luogo, count: 0, latest: "" };
      prev.count += loc.tipologia === "Casa allievo" ? 2 : 1;
      stats.set(k, prev);
    });
    const luoghi = [...stats.values()].sort((a, b) => b.count - a.count || b.latest.localeCompare(a.latest) || a.luogo.localeCompare(b.luogo, "it", { sensitivity: "base" })).map((item) => item.luogo);
    luoghiLezioneCache.set(key, luoghi);
    return luoghi;
  });
}
function suggerisciDurataDaUltimaLezione() {
  return __async(this, null, function* () {
    if (editingLezioneId) return;
    const input = document.getElementById("lz-durata");
    if (!input || input.value) return;
    const ids = selectedLezioneAllieviIds();
    if (!ids.length) return;
    const { data } = yield sb.from("lezioni_allievi").select("lezioni(durata_min, data)").in("allievo_id", ids);
    const latest = (data || []).map((row) => row.lezioni).filter((l) => l == null ? void 0 : l.durata_min).sort((a, b) => String(b.data || "").localeCompare(String(a.data || "")))[0];
    if ((latest == null ? void 0 : latest.durata_min) && !input.value) input.value = latest.durata_min;
  });
}
function mostraSuggerimentiLuogo() {
  return __async(this, null, function* () {
    clearTimeout(luogoSuggestTimer);
    const panel = document.getElementById("lz-luogo-suggest");
    const input = document.getElementById("lz-luogo");
    if (!panel || !input) return;
    const ids = selectedLezioneAllieviIds();
    if (!ids.length) {
      panel.hidden = true;
      panel.innerHTML = "";
      return;
    }
    const query = normalizeText(input.value);
    const luoghi = (yield luoghiFrequentatiAllievi(ids)).filter((luogo) => !query || normalizeText(luogo).includes(query)).slice(0, 8);
    if (!luoghi.length) {
      panel.innerHTML = '<div class="place-suggest-empty">Nessun luogo gi\xE0 registrato per i presenti.</div>';
      panel.hidden = false;
      return;
    }
    panel.innerHTML = luoghi.map((luogo) => `
    <button type="button" class="place-suggest-btn" onmousedown="scegliLuogoSuggerito(${jsArg(luogo)})">${esc(luogo)}</button>
  `).join("");
    panel.hidden = false;
  });
}
function scegliLuogoSuggerito(luogo) {
  document.getElementById("lz-luogo").value = luogo;
  const panel = document.getElementById("lz-luogo-suggest");
  if (panel) panel.hidden = true;
}
function nascondiSuggerimentiLuogoSoon() {
  clearTimeout(luogoSuggestTimer);
  luogoSuggestTimer = setTimeout(() => {
    const panel = document.getElementById("lz-luogo-suggest");
    if (panel) panel.hidden = true;
  }, 160);
}
function refreshSuggerimentiLuogoSeAperti() {
  const panel = document.getElementById("lz-luogo-suggest");
  if (panel && !panel.hidden) mostraSuggerimentiLuogo();
}
function skillWorkKey(row) {
  return JSON.stringify({
    skillId: row.skillId || "",
    stadio: Number(row.stadio || 1),
    fakie: !!row.fakie,
    dimensioni: row.dimensioni || {}
  });
}
function collapseCommonGroupSkillRows(ids) {
  const presentIds = (ids || []).filter((id) => {
    var _a2;
    return (_a2 = editingLezioneSkillRows[id]) == null ? void 0 : _a2.length;
  });
  if (presentIds.length < 2) return;
  const counts = /* @__PURE__ */ new Map();
  const rowByKey = /* @__PURE__ */ new Map();
  presentIds.forEach((id) => {
    const seen = /* @__PURE__ */ new Set();
    (editingLezioneSkillRows[id] || []).forEach((row) => {
      const key = skillWorkKey(row);
      if (seen.has(key)) return;
      seen.add(key);
      counts.set(key, (counts.get(key) || 0) + 1);
      rowByKey.set(key, row);
    });
  });
  const commonKeys = [...counts.entries()].filter(([, count]) => count === presentIds.length).map(([key]) => key);
  if (!commonKeys.length) return;
  const common = new Set(commonKeys);
  editingLezioneSkillRows[GROUP_SKILL_ROWS_KEY] = commonKeys.map((key) => __spreadProps(__spreadValues({}, rowByKey.get(key)), { excludeIds: [] }));
  presentIds.forEach((id) => {
    editingLezioneSkillRows[id] = (editingLezioneSkillRows[id] || []).filter((row) => !common.has(skillWorkKey(row)));
  });
}
function renderGroupSkillWorkspace() {
  const container = document.getElementById("lz-skills-container");
  const savedGroupRows = editingLezioneSkillRows[GROUP_SKILL_ROWS_KEY] || [];
  const groupActions = renderLessonWorkButtons(GROUP_SKILL_ROWS_KEY);
  container.innerHTML = `
    <div class="allievo-block">
      <h4>Lavoro di gruppo</h4>
      <div class="lesson-skill-tools">
        <div class="lesson-skill-hint">Inserisci una volta sola le skill o gli esercizi comuni. Per ogni riga puoi escludere chi non li ha fatti.</div>
        ${groupActions}
      </div>
      <div class="ripasso-panel" id="${ripassoPanelId(GROUP_SKILL_ROWS_KEY)}" hidden></div>
      <div id="skill-rows-${GROUP_SKILL_ROWS_KEY}"></div>
    </div>
    <div class="allievo-block">
      <h4>Lavori individuali</h4>
      <div class="lesson-skill-hint">Aggiungi qui esercizi o skill fatti solo da un allievo, incluso un guest.</div>
      <div id="lz-individual-tools"></div>
      <div id="lz-individual-skill-blocks"></div>
    </div>`;
  if (savedGroupRows.length) savedGroupRows.forEach((row) => aggiungiSkillRow(GROUP_SKILL_ROWS_KEY, row.skillId, row.stadio, row.dimensioni || {}, !!row.fakie, row.excludeIds || [], { collapseExisting: false }));
  Object.entries(editingLezioneSkillRows).filter(([id, rows]) => id !== GROUP_SKILL_ROWS_KEY && (rows == null ? void 0 : rows.length) && selectedLezioneAllieviIds().includes(id)).forEach(([id, rows]) => addIndividualSkillWork(id, rows));
  renderGroupIndividualControls();
}
function renderGroupIndividualControls() {
  const tools = document.getElementById("lz-individual-tools");
  if (!tools) return;
  const existing = new Set([...document.querySelectorAll("#lz-individual-skill-blocks [data-individual-id]")].map((el) => el.dataset.individualId));
  const options = selectedLezioneAllieviIds().filter((id) => !existing.has(id)).map((id) => `<option value="${id}">${esc(allievoDisplayName(id))}</option>`).join("");
  tools.innerHTML = `
    <div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.5rem;align-items:end;margin-bottom:.65rem">
      <div class="field" style="margin:0">
        <label>Allievo</label>
        <select id="lz-individual-skill-select">
          <option value="">\u2014 Aggiungi lavoro individuale \u2014</option>
          ${options}
        </select>
      </div>
      <button type="button" class="btn btn-outline btn-sm" onclick="addIndividualSkillWorkFromSelect()">+ Aggiungi</button>
    </div>`;
}
function addIndividualSkillWorkFromSelect() {
  const select = document.getElementById("lz-individual-skill-select");
  const id = select == null ? void 0 : select.value;
  if (!id) return;
  addIndividualSkillWork(id);
  renderGroupIndividualControls();
}
function addIndividualSkillWork(id, rows = null) {
  const container = document.getElementById("lz-individual-skill-blocks");
  if (!container || document.getElementById(`individual-block-${id}`)) return;
  const div = document.createElement("div");
  div.className = "allievo-block";
  div.id = `individual-block-${id}`;
  div.dataset.individualId = id;
  div.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:.75rem">
      <h4>${esc(allievoDisplayName(id))}</h4>
      <button type="button" class="btn btn-ghost btn-sm" onclick="this.closest('[data-individual-id]').remove(); renderGroupIndividualControls()">\u2715</button>
    </div>
    <div style="margin:.25rem 0 .55rem">${renderLessonWorkButtons(id)}</div>
    <div class="ripasso-panel" id="${ripassoPanelId(id)}" hidden></div>
    <div id="skill-rows-${id}"></div>`;
  container.appendChild(div);
  const savedRows = rows || editingLezioneSkillRows[id] || [];
  if (savedRows.length) savedRows.forEach((row) => aggiungiSkillRow(id, row.skillId, row.stadio, row.dimensioni || {}, !!row.fakie, [], { collapseExisting: false }));
}
function renderSpecialGuestPanel() {
  const panel = document.getElementById("lz-special-guest-panel");
  const selectedIds = new Set(selectedLezioneAllieviIds());
  const options = ordinaAllieviLista(allieviSelezionabiliLezione().filter((a) => !selectedIds.has(a.id)));
  panel.hidden = false;
  panel.innerHTML = `
    <div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.5rem;align-items:end">
      <div class="field" style="margin:0">
        <label>Special guest</label>
        <select id="lz-special-guest-select" onchange="addSpecialGuestToLesson(this.value); this.value=''">
          <option value="">\u2014 Aggiungi allievo ospite \u2014</option>
          ${options.map((a) => `<option value="${a.id}">${esc(lezioneTargetLabelAllievo(a))}</option>`).join("")}
        </select>
      </div>
      <button type="button" class="btn btn-outline btn-sm" onclick="creaSpecialGuestDaLezione()">+ Crea nuovo allievo</button>
    </div>`;
}
function addSpecialGuestToLesson(id) {
  if (!id || selectedLezioneAllieviIds().includes(id)) return;
  const holder = document.getElementById("lz-hidden-checks");
  holder.insertAdjacentHTML("beforeend", `<input type="checkbox" value="${id}" checked>`);
  const a = allieviSelezionabiliLezione().find((x) => x.id === id) || allAllievi.find((x) => x.id === id);
  if (currentLessonTargetIsGroup()) {
    const gruppo = document.getElementById("lz-tipo").value.slice("gruppo:".length);
    renderGroupLessonPanel(gruppo);
    refreshGroupExclusionControls();
    renderGroupIndividualControls();
  } else if (a) {
    toggleAllievo({ checked: true, value: id }, [a.nome, a.cognome].filter(Boolean).join(" "));
  }
  renderSpecialGuestPanel();
  renderPrepBoard();
  refreshSuggerimentiLuogoSeAperti();
}
function creaSpecialGuestDaLezione() {
  saveLezioneDraft({ keep: true });
  pendingSpecialGuestId = null;
  showView("nuovo-allievo");
}
function collectLezioneDraft() {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j;
  const skillRows = {};
  const rowOwners = currentLessonTargetIsGroup() ? [GROUP_SKILL_ROWS_KEY, ...selectedLezioneAllieviIds()] : selectedLezioneAllieviIds();
  rowOwners.forEach((id) => {
    skillRows[id] = [...document.querySelectorAll(`#skill-rows-${id} .skill-row`)].map((row) => {
      var _a3, _b3;
      return {
        skillId: ((_a3 = row.querySelector(".skill-select")) == null ? void 0 : _a3.value) || "",
        stadio: parseInt(((_b3 = row.querySelector(".stadio-toggle")) == null ? void 0 : _b3.dataset.stadio) || "1", 10),
        fakie: skillRowFakie(row),
        dimensioni: skillRowDimensions(row),
        excludeIds: skillRowExcludedIds(row)
      };
    }).filter((row) => row.skillId);
  });
  return {
    data: ((_a2 = document.getElementById("lz-data")) == null ? void 0 : _a2.value) || "",
    durata: ((_b2 = document.getElementById("lz-durata")) == null ? void 0 : _b2.value) || "",
    stato: ((_c = document.getElementById("lz-stato")) == null ? void 0 : _c.value) || "aperta",
    luogo: ((_d = document.getElementById("lz-luogo")) == null ? void 0 : _d.value) || "",
    meteo: ((_e = document.getElementById("lz-meteo")) == null ? void 0 : _e.value) || "",
    noteSpeciali: ((_f = document.getElementById("lz-note-speciali")) == null ? void 0 : _f.value) || "",
    checkBene: ((_g = document.getElementById("lz-check-bene")) == null ? void 0 : _g.value) || "",
    checkNonFatto: ((_h = document.getElementById("lz-check-non-fatto")) == null ? void 0 : _h.value) || "",
    note: ((_i = document.getElementById("lz-note")) == null ? void 0 : _i.value) || "",
    target: ((_j = document.getElementById("lz-tipo")) == null ? void 0 : _j.value) || "",
    selectedIds: selectedLezioneAllieviIds(),
    skillRows,
    lezioneBackAllievoId,
    lezioneBackGruppoNome,
    formMode: lezioneFormMode
  };
}
function saveLezioneDraft({ keep = false } = {}) {
  safeStorage.setItem(LEZIONE_DRAFT_KEY, JSON.stringify(collectLezioneDraft()));
  if (!keep) safeStorage.removeItem(LEZIONE_DRAFT_KEY);
}
function loadLezioneDraft() {
  try {
    return JSON.parse(safeStorage.getItem(LEZIONE_DRAFT_KEY) || "null");
  } catch (e) {
    return null;
  }
}
function restoreLezioneDraft(draft) {
  if (draft.formMode) lezioneFormMode = draft.formMode;
  document.getElementById("lz-data").value = draft.data || localDateIso();
  document.getElementById("lz-durata").value = draft.durata || "";
  setLessonStatus(draft.stato || "aperta");
  document.getElementById("lz-luogo").value = draft.luogo || "";
  document.getElementById("lz-meteo").value = draft.meteo || "";
  document.getElementById("lz-note-speciali").value = draft.noteSpeciali || "";
  document.getElementById("lz-check-bene").value = draft.checkBene || "";
  document.getElementById("lz-check-non-fatto").value = draft.checkNonFatto || "";
  document.getElementById("lz-note").value = draft.note || "";
  renderLezioneTargetOptions(draft.target || "");
  editingLezioneSkillRows = draft.skillRows || {};
  lezioneBackAllievoId = draft.lezioneBackAllievoId || lezioneBackAllievoId;
  lezioneBackGruppoNome = draft.lezioneBackGruppoNome || lezioneBackGruppoNome;
  safeStorage.removeItem(LEZIONE_DRAFT_KEY);
  return draft.selectedIds || [];
}
function toggleAllievo(cb, nomeCompleto) {
  var _a2;
  const container = document.getElementById("lz-skills-container");
  if (cb.checked) {
    const allievo = allieviSelezionabiliLezione().find((x) => x.id === cb.value) || allAllievi.find((x) => x.id === cb.value);
    const div = document.createElement("div");
    div.className = lezioneFormMode === "prep" ? "allievo-block prep-skill-storage" : "allievo-block";
    div.id = `block-${cb.value}`;
    div.innerHTML = `
      <h4>${esc(nomeCompleto)}</h4>
      <div class="lesson-skill-tools">
        <div class="lesson-skill-hint">${lessonSkillHint(allievo)}</div>
        ${renderLessonWorkButtons(cb.value)}
      </div>
      <div class="ripasso-panel" id="${ripassoPanelId(cb.value)}" hidden></div>
      <div id="skill-rows-${cb.value}"></div>`;
    container.appendChild(div);
    const savedRows = editingLezioneSkillRows[cb.value] || [];
    if (savedRows.length) savedRows.forEach((row) => aggiungiSkillRow(cb.value, row.skillId, row.stadio, row.dimensioni || {}, !!row.fakie, [], { collapseExisting: false }));
  } else {
    (_a2 = document.getElementById(`block-${cb.value}`)) == null ? void 0 : _a2.remove();
  }
}
function ultimaLezioneAllievo(allievoId) {
  return __async(this, null, function* () {
    if (!allievoId) return null;
    let { data, error } = yield sb.from("lezioni_allievi").select("lezione_id, lezioni(id, data, durata_min, luogo, meteo, note, note_speciali, stato, lezioni_skills(allievo_id, skill_id, stadio_raggiunto, fakie, dimensioni, skills(nome)))").eq("allievo_id", allievoId);
    if (isMissingLessonMeteoError(error)) {
      ;
      ({ data, error } = yield sb.from("lezioni_allievi").select("lezione_id, lezioni(id, data, durata_min, luogo, note, note_speciali, stato, lezioni_skills(allievo_id, skill_id, stadio_raggiunto, fakie, dimensioni, skills(nome)))").eq("allievo_id", allievoId));
    }
    if (isMissingLessonStatusError(error)) {
      ;
      ({ data, error } = yield sb.from("lezioni_allievi").select("lezione_id, lezioni(id, data, durata_min, luogo, note, note_speciali, lezioni_skills(allievo_id, skill_id, stadio_raggiunto, fakie, dimensioni, skills(nome)))").eq("allievo_id", allievoId));
    }
    if (isMissingDimensioniError(error)) {
      ;
      ({ data, error } = yield sb.from("lezioni_allievi").select("lezione_id, lezioni(id, data, durata_min, luogo, note, note_speciali, stato, lezioni_skills(allievo_id, skill_id, stadio_raggiunto, fakie, skills(nome)))").eq("allievo_id", allievoId));
    }
    if (error) return null;
    const lezioni = (data || []).map((row) => row.lezioni).filter(Boolean).filter((l) => String(l.id) !== String(editingLezioneId || "")).sort((a, b) => {
      const aClosed = lessonStatus(a) === "chiusa" ? 1 : 0;
      const bClosed = lessonStatus(b) === "chiusa" ? 1 : 0;
      return bClosed - aClosed || String(b.data || "").localeCompare(String(a.data || "")) || String(b.id).localeCompare(String(a.id));
    });
    return lezioni[0] || null;
  });
}
function renderPrepInsightForAllievo(allievoId) {
  return __async(this, null, function* () {
    const panel = document.getElementById(`prep-insight-${allievoId}`);
    if (!panel) return;
    const lezione = yield ultimaLezioneAllievo(allievoId);
    if (!lezione) {
      panel.innerHTML = '<div class="lesson-prep-title">Ultima lezione</div><div class="lesson-prep-meta">Nessuna lezione precedente trovata.</div>';
      return;
    }
    const rows = (lezione.lezioni_skills || []).filter((row) => String(row.allievo_id || allievoId) === String(allievoId)).filter((row) => {
      var _a2;
      return row.skill_id && ((_a2 = row.skills) == null ? void 0 : _a2.nome);
    });
    const parsed = lessonParsedNotes(lezione);
    panel.innerHTML = `
    <div class="lesson-prep-title">Ultima lezione</div>
    <div class="lesson-prep-meta">${formatDateWithWeekday(lezione.data)}${lezione.luogo ? ` \xB7 ${esc(lezione.luogo)}` : ""}${lezione.note_speciali ? `<br>${esc(lezione.note_speciali)}` : ""}</div>
    ${rows.length ? `<div class="lesson-prep-skills">${rows.map((row) => `<span class="st st${row.stadio_raggiunto || 1}">${esc(row.skills.nome)} \xB7 ${esc(lessonStadioLabel(row.stadio_raggiunto || 1))}</span>`).join("")}</div>` : '<div class="ripasso-empty">Nessuna skill registrata nell ultima lezione.</div>'}
    ${parsed.nonFatto ? `<div class="lesson-prep-meta"><strong>Da riprendere:</strong> ${esc(parsed.nonFatto)}</div>` : ""}
  `;
    const container = document.getElementById(`skill-rows-${allievoId}`);
    if (!container || container.querySelector(".skill-row")) return;
    rows.forEach((row) => aggiungiSkillRow(allievoId, row.skill_id, row.stadio_raggiunto || 1, row.dimensioni || {}, !!row.fakie, [], { ripassoOnly: true, collapseExisting: false }));
  });
}
function prepOwnerId() {
  const ids = selectedLezioneAllieviIds();
  return ids.length === 1 ? ids[0] : null;
}
function prepSkillItemFromLessonRow(row) {
  return {
    skillId: String(row.skill_id || ""),
    stadio: Number(row.stadio_raggiunto || 1),
    fakie: !!row.fakie,
    dimensioni: row.dimensioni || {},
    skill: row.skills || allSkills.find((skill) => String(skill.id) === String(row.skill_id)) || null
  };
}
function prepSkillButtons(ownerId, items, stage, emptyText) {
  const usable = (items || []).filter((item) => {
    var _a2;
    return item.skillId && ((_a2 = item.skill) == null ? void 0 : _a2.nome);
  }).slice(0, 8);
  if (!usable.length) return `<span class="prep-empty">${esc(emptyText)}</span>`;
  return usable.map((item) => `
    <button type="button" class="prep-suggest" onclick="addPrepSkill(${jsArg(ownerId)},${jsArg(item.skillId)},${jsArg(stage)},${Number(item.stadio || 1)},${jsArg(item.dimensioni || {})},${item.fakie ? "true" : "false"})">
      ${esc(item.skill.nome)}
    </button>`).join("");
}
function buildPrepPlanDraft(allievo, lastLesson, lastItems, groups) {
  const lines = [];
  lines.push("Piano operativo");
  lines.push(`Allievo: ${allievoDisplayName(allievo.id)}`);
  if (lastLesson == null ? void 0 : lastLesson.data) lines.push(`Ultima lezione: ${formatDateWithWeekday(lastLesson.data)}`);
  if (lastItems.length) lines.push(`Ripasso iniziale: ${lastItems.map((item) => {
    var _a2;
    return (_a2 = item.skill) == null ? void 0 : _a2.nome;
  }).filter(Boolean).join(", ")}`);
  if (groups.work.length) lines.push(`Focus da lavorare: ${groups.work.slice(0, 3).map((item) => item.skill.nome).join(", ")}`);
  if (groups.done.length) lines.push(`Richiamo breve: ${groups.done.slice(0, 2).map((item) => item.skill.nome).join(", ")}`);
  lines.push("");
  lines.push("Scaletta");
  lines.push("1. Ingresso: valutare energia, equilibrio e confidenza.");
  lines.push("2. Ripasso: riattivare l ultima lezione senza pressione.");
  lines.push("3. Focus: un solo nodo tecnico, pulito e osservabile.");
  lines.push("4. Uscita: mini test, gioco o percorso breve.");
  return lines.join("\n");
}
function renderPrepSelectedSkills(ownerId = prepOwnerId()) {
  const target = document.getElementById("prep-selected-skills");
  if (!target || !ownerId) return;
  const rows = [...document.querySelectorAll(`#skill-rows-${ownerId} .skill-row`)].map((row) => {
    var _a2, _b2, _c, _d, _e, _f;
    const select = row.querySelector(".skill-select");
    if (!(select == null ? void 0 : select.value)) return "";
    const name = ((_c = (_b2 = (_a2 = select.selectedOptions) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.dataset) == null ? void 0 : _c.name) || ((_e = (_d = select.selectedOptions) == null ? void 0 : _d[0]) == null ? void 0 : _e.textContent) || "";
    const stadio = Number(((_f = row.querySelector(".stadio-toggle")) == null ? void 0 : _f.dataset.stadio) || 1);
    return `<span class="st st${stadio}">${esc(name)} \xB7 ${esc(lessonStadioLabel(stadio))}</span>`;
  }).filter(Boolean);
  target.innerHTML = rows.length ? rows.join("") : '<span class="prep-empty">Nessuna skill nel piano. Clicca una proposta nella scaletta.</span>';
}
function syncPrepPlanToNote() {
  var _a2;
  const text = ((_a2 = document.getElementById("prep-plan-text")) == null ? void 0 : _a2.value) || "";
  const note = document.getElementById("lz-note");
  if (note) note.value = text;
}
function appendPrepPlanLine(line) {
  const textarea = document.getElementById("prep-plan-text");
  const note = document.getElementById("lz-note");
  const current = (textarea == null ? void 0 : textarea.value) || (note == null ? void 0 : note.value) || "";
  const next = `${current.trim()}${current.trim() ? "\n" : ""}${line}`.trim();
  if (textarea) textarea.value = next;
  if (note) note.value = next;
}
function setPrepIntent(intent, detail) {
  document.querySelectorAll(".prep-intent").forEach((btn) => btn.classList.toggle("is-on", btn.dataset.intent === intent));
  const special = document.getElementById("lz-note-speciali");
  if (special) special.value = `Obiettivo: ${detail}`;
  appendPrepPlanLine(`Intenzione: ${detail}`);
}
function addPrepSkill(ownerId, skillId, stage = "Focus", stadio = 1, dimensioni = {}, fakie = false) {
  const skill = allSkills.find((s) => String(s.id) === String(skillId));
  if (!skill) return;
  const alreadyPlanned = [...document.querySelectorAll(`#skill-rows-${ownerId} .skill-row`)].some((row) => {
    var _a2;
    return String(((_a2 = row.querySelector(".skill-select")) == null ? void 0 : _a2.value) || "") === String(skill.id);
  });
  if (!alreadyPlanned) aggiungiSkillRow(ownerId, skill.id, stadio || 1, dimensioni || {}, !!fakie, [], { ripassoOnly: true, collapseExisting: false });
  appendPrepPlanLine(`${stage}: ${skill.nome}`);
  renderPrepSelectedSkills(ownerId);
}
function togglePrepRawEditor(ownerId = prepOwnerId()) {
  const block = ownerId ? document.getElementById(`block-${ownerId}`) : null;
  if (!block) return;
  block.classList.toggle("is-visible");
}
function renderPrepBoard() {
  return __async(this, null, function* () {
    const board = document.getElementById("lz-prep-board");
    if (!board) return;
    if (lezioneFormMode !== "prep" || editingLezioneId) {
      board.hidden = true;
      board.innerHTML = "";
      return;
    }
    const ids = selectedLezioneAllieviIds();
    if (!ids.length) {
      board.hidden = false;
      board.innerHTML = `<div class="card prep-board"><div class="prep-empty">Scegli un allievo: preparo una scaletta viva partendo dal suo ultimo lavoro.</div></div>`;
      return;
    }
    if (ids.length !== 1) {
      board.hidden = false;
      board.innerHTML = `<div class="card prep-board"><div class="prep-empty">La preparazione intelligente per ora ragiona su un allievo alla volta. Per i gruppi resta disponibile la lezione classica/postuma.</div></div>`;
      return;
    }
    const ownerId = ids[0];
    const allievo = allievoById(ownerId);
    if (!allievo) return;
    const lastLesson = yield ultimaLezioneAllievo(ownerId);
    if (prepOwnerId() !== ownerId || lezioneFormMode !== "prep") return;
    const lastItems = ((lastLesson == null ? void 0 : lastLesson.lezioni_skills) || []).filter((row) => String(row.allievo_id || ownerId) === String(ownerId)).map(prepSkillItemFromLessonRow).filter((item) => item.skillId && item.skill);
    const groups = workedSkillGroupsForOwner(ownerId);
    const note = document.getElementById("lz-note");
    if (note && !note.value.trim()) note.value = buildPrepPlanDraft(allievo, lastLesson, lastItems, groups);
    const rowsContainer = document.getElementById(`skill-rows-${ownerId}`);
    if (!editingLezioneId && rowsContainer && !rowsContainer.querySelector(".skill-row") && lastItems.length) {
      lastItems.forEach((item) => aggiungiSkillRow(ownerId, item.skillId, item.stadio || 1, item.dimensioni || {}, item.fakie, [], { ripassoOnly: true, collapseExisting: false }));
    }
    const parsed = lessonParsedNotes(lastLesson || {});
    const workItems = groups.work.map((item) => __spreadProps(__spreadValues({}, item), { stadio: item.stadio || 1 }));
    const doneItems = groups.done.map((item) => __spreadProps(__spreadValues({}, item), { stadio: 1 }));
    board.hidden = false;
    board.innerHTML = `
    <div class="prep-board">
      <div class="prep-hero">
        <div class="prep-hero-top">
          <div>
            <div class="prep-kicker">Prepara senza fretta</div>
            <div class="prep-headline">${esc(allievoDisplayName(ownerId))}</div>
            <div class="prep-subline">Questa non e una registrazione: e una scaletta aperta. La chiuderai dopo, quando saprai cosa e successo davvero.</div>
          </div>
          <div class="prep-save-tag">salva come aperta</div>
        </div>
        <div class="prep-radar">
          <div class="prep-radar-card"><strong>${(lastLesson == null ? void 0 : lastLesson.data) ? formatDate(lastLesson.data) : "\u2014"}</strong><span>ultima lezione</span><div class="prep-empty">${(lastLesson == null ? void 0 : lastLesson.luogo) ? esc(lastLesson.luogo) : "nessun luogo"}</div></div>
          <div class="prep-radar-card"><strong>${workItems.length}</strong><span>richiedono lavoro</span><div class="prep-empty">${workItems.slice(0, 2).map((item) => esc(item.skill.nome)).join(", ") || "nessuna urgenza"}</div></div>
          <div class="prep-radar-card"><strong>${doneItems.length}</strong><span>gia completate</span><div class="prep-empty">${doneItems.slice(0, 2).map((item) => esc(item.skill.nome)).join(", ") || "ancora niente"}</div></div>
          <div class="prep-radar-card"><strong>${parsed.nonFatto ? "si" : "no"}</strong><span>da riprendere</span><div class="prep-empty">${parsed.nonFatto ? esc(parsed.nonFatto).slice(0, 80) : "nessuna nota"}</div></div>
        </div>
        <div class="prep-intents">
          <button type="button" class="prep-intent" data-intent="consolidare" onclick="setPrepIntent('consolidare','consolidare una skill gia accesa')">Consolidare</button>
          <button type="button" class="prep-intent" data-intent="sbloccare" onclick="setPrepIntent('sbloccare','sbloccare un punto che resiste')">Sbloccare</button>
          <button type="button" class="prep-intent" data-intent="fiducia" onclick="setPrepIntent('fiducia','costruire fiducia e fluidita')">Fiducia</button>
          <button type="button" class="prep-intent" data-intent="testare" onclick="setPrepIntent('testare','testare se il gesto regge in autonomia')">Testare</button>
        </div>
      </div>

      <div class="prep-stage-grid">
        <div class="prep-stage">
          <h4>1. Riaccendi</h4>
          <p>Parti da qualcosa che il corpo riconosce. L ultima lezione diventa ingresso, non verifica.</p>
          <div class="prep-stage-actions">${prepSkillButtons(ownerId, lastItems, "Riaccendi", "Nessuna skill nell ultima lezione.")}</div>
        </div>
        <div class="prep-stage">
          <h4>2. Nodo tecnico</h4>
          <p>Una cosa sola da lavorare bene. Se tutto e importante, niente e davvero osservabile.</p>
          <div class="prep-stage-actions">${prepSkillButtons(ownerId, workItems, "Nodo tecnico", "Nessuna skill aperta nei progressi.")}</div>
        </div>
        <div class="prep-stage">
          <h4>3. Variazione</h4>
          <p>Cambia superficie, lato, ritmo o piano. Qui capisci se la skill e solida.</p>
          <div class="prep-stage-actions">${prepSkillButtons(ownerId, [...workItems, ...lastItems], "Variazione", "Aggiungi prima un ripasso o una skill.")}</div>
        </div>
        <div class="prep-stage">
          <h4>4. Uscita</h4>
          <p>Chiudi con qualcosa che lascia una sensazione chiara: mini percorso, gioco, test breve.</p>
          <div class="prep-stage-actions">${prepSkillButtons(ownerId, doneItems, "Uscita", "Nessuna completata da usare come uscita sicura.")}</div>
        </div>
      </div>

      <div class="card prep-plan-grid">
        <div class="field prep-plan-note" style="margin:0">
          <label>Piano operativo</label>
          <textarea id="prep-plan-text" oninput="syncPrepPlanToNote()">${esc((note == null ? void 0 : note.value) || "")}</textarea>
        </div>
        <div>
          <div class="lesson-prep-title" style="margin-bottom:.45rem">Dentro la lezione aperta</div>
          <div class="prep-selected-list" id="prep-selected-skills"></div>
          <button type="button" class="btn btn-outline btn-sm prep-raw-toggle" style="margin-top:.65rem" onclick="togglePrepRawEditor(${jsArg(ownerId)})">Editor dettagli</button>
        </div>
      </div>
    </div>`;
    renderPrepSelectedSkills(ownerId);
  });
}
function sortedSkillsForLesson() {
  return [...allSkills || []].sort((a, b) => {
    return String(a.ramo || "").localeCompare(String(b.ramo || ""), "it", { sensitivity: "base" }) || String(a.nome || "").localeCompare(String(b.nome || ""), "it", { sensitivity: "base" });
  });
}
function skillMetaLabel(skill) {
  return [skill.ramo || "Altro", skill.blocco, skill.livello ? `Lv.${skill.livello}` : ""].filter(Boolean).join(" \xB7 ");
}
function lessonSkillHint(allievo) {
  return allievo ? "Aggiungi solo il lavoro effettivamente fatto in questa lezione." : "Aggiungi le skill lavorate in questa lezione.";
}
function renderLessonWorkButtons(allieviId) {
  const ownerArg = jsArg(allieviId);
  return `
    <div style="display:flex;gap:.4rem;flex-wrap:wrap">
      <button type="button" class="btn btn-outline btn-sm" onclick="aggiungiSkillRow(${ownerArg})">+ Nuova skill</button>
      <button type="button" class="btn btn-outline btn-sm" onclick="toggleRipassoPanel(${ownerArg})">Ripasso</button>
      <button type="button" class="btn btn-outline btn-sm" onclick="lezioneFeatureSoon('Nuovo esercizio')">+ Nuovo esercizio</button>
      <button type="button" class="btn btn-outline btn-sm" onclick="lezioneFeatureSoon('Nuovo percorso')">+ Nuovo percorso</button>
    </div>`;
}
function lezioneFeatureSoon(label) {
  const err = document.getElementById("lz-err");
  if (!err) return;
  err.textContent = `${label}: lo definiamo nel prossimo passaggio.`;
  err.classList.add("show");
  err.scrollIntoView({ behavior: "smooth", block: "center" });
}
function progressMapForAllievo(allievoId) {
  const map = /* @__PURE__ */ new Map();
  (allProgressi || []).forEach((row) => {
    if (row.allievo_id === allievoId) map.set(row.skill_id, Number(row.stadio || 0));
  });
  return map;
}
function ripassoSkillIdsForOwner(ownerId) {
  const ownerIds = ownerId === GROUP_SKILL_ROWS_KEY ? selectedLezioneAllieviIds() : [ownerId];
  const skillIds = /* @__PURE__ */ new Set();
  ownerIds.filter(Boolean).forEach((allievoId) => {
    progressMapForAllievo(allievoId).forEach((stadio, skillId) => {
      if (Number(stadio || 0) > 0) skillIds.add(String(skillId));
    });
  });
  return skillIds;
}
function ripassoPanelId(ownerId) {
  return `ripasso-panel-${String(ownerId).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}
function workedSkillGroupsForOwner(ownerId) {
  const ownerIds = ownerId === GROUP_SKILL_ROWS_KEY ? selectedLezioneAllieviIds() : [ownerId];
  const bySkill = /* @__PURE__ */ new Map();
  ownerIds.filter(Boolean).forEach((allievoId) => {
    progressMapForAllievo(allievoId).forEach((stadio, skillId) => {
      if (!Number(stadio || 0)) return;
      const key = String(skillId);
      const prev = bySkill.get(key) || { skillId: key, stadio: 0 };
      prev.stadio = Math.max(prev.stadio, Number(stadio || 0));
      bySkill.set(key, prev);
    });
  });
  const list = [...bySkill.values()].map((item) => __spreadProps(__spreadValues({}, item), { skill: allSkills.find((skill) => String(skill.id) === item.skillId) })).filter((item) => item.skill).sort((a, b) => a.stadio - b.stadio || String(a.skill.nome || "").localeCompare(String(b.skill.nome || ""), "it", { sensitivity: "base" }));
  return {
    work: list.filter((item) => item.stadio < 3),
    done: list.filter((item) => item.stadio >= 3)
  };
}
function renderRipassoGroup(ownerId, title, rows) {
  return `<div class="ripasso-group">
    <div class="ripasso-title">${esc(title)}</div>
    <div class="lesson-skill-suggestions">
      ${rows.length ? rows.map((item) => `<button type="button" class="skill-suggest" onclick="aggiungiRipassoSkill(${jsArg(ownerId)},${jsArg(item.skillId)})">${esc(item.skill.nome)} \xB7 ${esc(lessonStadioLabel(item.stadio))}</button>`).join("") : '<span class="ripasso-empty">Nessuna skill in questo gruppo.</span>'}
    </div>
  </div>`;
}
function toggleRipassoPanel(ownerId) {
  const panel = document.getElementById(ripassoPanelId(ownerId));
  if (!panel) {
    aggiungiRipassoRow(ownerId);
    return;
  }
  if (!panel.hidden) {
    panel.hidden = true;
    return;
  }
  const groups = workedSkillGroupsForOwner(ownerId);
  if (!groups.work.length && !groups.done.length) {
    panel.innerHTML = '<div class="ripasso-empty">Nessuna skill gia lavorata per questa selezione.</div>';
  } else {
    panel.innerHTML = [
      renderRipassoGroup(ownerId, "Richiedono lavoro", groups.work),
      renderRipassoGroup(ownerId, "Gia completate", groups.done)
    ].join("");
  }
  panel.hidden = false;
}
function aggiungiRipassoSkill(ownerId, skillId, options = {}) {
  const skill = allSkills.find((s) => String(s.id) === String(skillId));
  if (!skill) return;
  const previous = workedSkillGroupsForOwner(ownerId);
  const item = [...previous.work, ...previous.done].find((row) => row.skillId === String(skillId));
  aggiungiSkillRow(ownerId, skill.id, options.stadio || (item == null ? void 0 : item.stadio) || 1, options.dimensioni || {}, !!options.fakie, [], { ripassoOnly: true, collapseExisting: options.collapseExisting });
}
function aggiungiRipassoRow(ownerId) {
  const workedSkillIds = ripassoSkillIdsForOwner(ownerId);
  const err = document.getElementById("lz-err");
  if (!workedSkillIds.size) {
    if (err) {
      err.textContent = "Ripasso: nessuna skill gia lavorata per questa selezione.";
      err.classList.add("show");
      err.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }
  if (err) err.classList.remove("show");
  aggiungiSkillRow(ownerId, "", 1, {}, false, [], { ripassoOnly: true });
}
function fakieProgressMapForAllievo(allievoOrId) {
  var _a2;
  const allievo = typeof allievoOrId === "string" ? allAllievi.find((a) => a.id === allievoOrId) : allievoOrId;
  const raw = ((_a2 = allievo == null ? void 0 : allievo.profilo) == null ? void 0 : _a2.fakie_progress) || {};
  return raw && typeof raw === "object" ? raw : {};
}
function salvaFakieProgressiAllievo(allievoId, updates) {
  return __async(this, null, function* () {
    const allievo = allAllievi.find((a) => a.id === allievoId);
    if (!allievo) return;
    const oggi = localDateIso();
    const profilo = __spreadValues({}, allievo.profilo || {});
    const current = __spreadValues({}, profilo.fakie_progress || {});
    Object.entries(updates || {}).forEach(([skillId, stadio]) => {
      const value = Number(stadio || 0);
      if (!value) {
        delete current[skillId];
        return;
      }
      const prev = current[skillId] || {};
      current[skillId] = __spreadProps(__spreadValues({}, prev), {
        stadio: value,
        data_inizio: prev.data_inizio || oggi,
        data_acquisizione: value >= 2 ? prev.data_acquisizione || oggi : null,
        data_perfezionamento: value >= 3 ? prev.data_perfezionamento || oggi : null
      });
    });
    profilo.fakie_progress = current;
    const { error } = yield sb.from("allievi").update({ profilo }).eq("id", allievoId);
    if (error) throw error;
    allievo.profilo = profilo;
  });
}
function aggiornaProgressiDaLezione(_0, _1, _2) {
  return __async(this, arguments, function* (allievoId, skillId, stadio, { fakie = false } = {}) {
    var _a2;
    const value = Number(stadio || 0);
    if (!allievoId || !skillId || !value) return;
    if (fakie) {
      const current2 = Number(((_a2 = fakieProgressMapForAllievo(allievoId)[skillId]) == null ? void 0 : _a2.stadio) || 0);
      if (value > current2) yield salvaFakieProgressiAllievo(allievoId, { [skillId]: value });
      return;
    }
    const current = Number(progressMapForAllievo(allievoId).get(skillId) || 0);
    if (value <= current) return;
    const oggi = localDateIso();
    const { error: deleteError } = yield sb.from("progressi_allievo").delete().eq("allievo_id", allievoId).eq("skill_id", skillId);
    if (deleteError) throw deleteError;
    const { error } = yield sb.from("progressi_allievo").insert({
      allievo_id: allievoId,
      skill_id: skillId,
      stadio: value,
      data_inizio: oggi,
      data_acquisizione: value >= 2 ? oggi : null,
      data_perfezionamento: value >= 3 ? oggi : null
    });
    if (error) throw error;
    allProgressi = allProgressi.filter((row) => !(row.allievo_id === allievoId && row.skill_id === skillId)).concat({ allievo_id: allievoId, skill_id: skillId, stadio: value });
  });
}
function skillProfileScore(skill, allievo, progressMap) {
  const livello = Number((allievo == null ? void 0 : allievo.livello_attuale) || 0);
  const blocco = String((allievo == null ? void 0 : allievo.blocco_attuale) || "");
  const knownLevels = sortedSkillsForLesson().filter((s) => (progressMap.get(s.id) || 0) > 0).map((s) => Number(s.livello || 0));
  const maxKnownLevel = knownLevels.length ? Math.max(...knownLevels) : livello;
  const referenceLevel = maxKnownLevel || livello || Number(skill.livello || 0);
  const diff = referenceLevel ? Math.abs(Number(skill.livello || 0) - referenceLevel) : 2;
  let score = Math.max(0, 10 - diff * 2);
  if (blocco && skill.blocco === blocco) score += 3;
  if (skill.obbligatoria) score += 2;
  if (skill.ramo && hasKnownSkillInRamo(skill.ramo, progressMap)) score += 1;
  return score;
}
function hasKnownSkillInRamo(ramo, progressMap) {
  return sortedSkillsForLesson().some((skill) => (skill.ramo || "Altro") === (ramo || "Altro") && (progressMap.get(skill.id) || 0) > 0);
}
function rankSuggestedSkills(skills, allievo, progressMap) {
  return [...skills].map((skill) => ({ skill, score: skillProfileScore(skill, allievo, progressMap) })).sort((a, b) => {
    return b.score - a.score || Number(a.skill.livello || 0) - Number(b.skill.livello || 0) || String(a.skill.ramo || "").localeCompare(String(b.skill.ramo || ""), "it", { sensitivity: "base" }) || String(a.skill.nome || "").localeCompare(String(b.skill.nome || ""), "it", { sensitivity: "base" });
  }).map((item) => item.skill);
}
function skillSuggestionGroupsForAllievo(allievo, limitPerGroup = 7) {
  const progressMap = progressMapForAllievo(allievo == null ? void 0 : allievo.id);
  const ordered = sortedSkillsForLesson();
  if (!ordered.length) return [];
  const sharedInLavorazione = sharedInLavorazioneSkills();
  const knownLevels = ordered.filter((skill) => (progressMap.get(skill.id) || 0) > 0).map((skill) => Number(skill.livello || 0));
  const maxKnownLevel = knownLevels.length ? Math.max(...knownLevels) : Number((allievo == null ? void 0 : allievo.livello_attuale) || 0);
  const maiFatte = ordered.filter((skill) => !progressMap.get(skill.id));
  const recuperare = maxKnownLevel ? rankSuggestedSkills(maiFatte.filter((skill) => Number(skill.livello || 0) < maxKnownLevel), allievo, progressMap).slice(0, limitPerGroup) : [];
  const daSistemare = rankSuggestedSkills(
    ordered.filter((skill) => {
      const stadio = progressMap.get(skill.id) || 0;
      return stadio === 1 || stadio === 2;
    }),
    allievo,
    progressMap
  ).slice(0, limitPerGroup);
  const usedIds = new Set([...recuperare, ...daSistemare].map((skill) => skill.id));
  const startMaxLevel = maxKnownLevel ? maxKnownLevel + 1 : Number((allievo == null ? void 0 : allievo.livello_attuale) || 0) + 1;
  const daIniziare = rankSuggestedSkills(
    maiFatte.filter((skill) => !usedIds.has(skill.id) && (!startMaxLevel || Number(skill.livello || 0) <= startMaxLevel)),
    allievo,
    progressMap
  ).slice(0, limitPerGroup);
  return [
    { title: "In lavorazione per tutti", skills: sharedInLavorazione, shared: true },
    { title: "Mai fatte da recuperare", skills: recuperare },
    { title: "Da sistemare", skills: daSistemare },
    { title: "Mai viste da iniziare", skills: daIniziare }
  ].filter((group) => group.skills.length);
}
function sharedInLavorazioneSkills(limit = 10) {
  const selectedIds = selectedLezioneAllieviIds();
  if (selectedIds.length < 2) return [];
  return sortedSkillsForLesson().filter((skill) => selectedIds.every((id) => (progressMapForAllievo(id).get(skill.id) || 0) === 1)).slice(0, limit);
}
function isSkillInLavorazionePerTutti(skillId) {
  const selectedIds = selectedLezioneAllieviIds();
  if (selectedIds.length < 2) return false;
  return selectedIds.every((id) => (progressMapForAllievo(id).get(skillId) || 0) === 1);
}
function renderLessonSkillSuggestionGroups(allieviId, groups) {
  if (!(groups == null ? void 0 : groups.length)) return "";
  return groups.map((group) => `
    <div class="lesson-suggestion-group">
      <div class="lesson-suggestion-title${group.shared ? " shared-work" : ""}">${esc(group.title)}</div>
      <div class="lesson-skill-suggestions">
        ${group.skills.map((skill) => {
    const sharedClass = group.shared || isSkillInLavorazionePerTutti(skill.id) ? " skill-suggest-shared-work" : "";
    const title = `${skillMetaLabel(skill)}${sharedClass ? " \xB7 In lavorazione per tutti i presenti" : ""}`;
    return `<button type="button" class="skill-suggest${sharedClass}" onclick="aggiungiSkillRow('${allieviId}','${skill.id}',1)" title="${esc(title)}">${esc(skill.nome)}</button>`;
  }).join("")}
      </div>
    </div>`).join("");
}
function lessonSkillBranches() {
  const preferred = ["Equilibrio", "Andatura", "Frenata", "Rotazione", "Air"];
  const found = [...new Set((allSkills || []).map((skill) => skill.ramo || "Altro").filter(Boolean))];
  return [...preferred.filter((branch) => found.includes(branch)), ...found.filter((branch) => !preferred.includes(branch)).sort((a, b) => a.localeCompare(b))];
}
function renderLessonBranchOptions(selectedBranch = "") {
  const branches = lessonSkillBranches();
  return `<option value="">Tutti i rami</option>${branches.map((branch) => `<option value="${esc(branch)}" ${branch === selectedBranch ? "selected" : ""}>${esc(branch)}</option>`).join("")}`;
}
function renderLessonSkillOptions(selectedSkillId = "", filter = "", branch = "", options = {}) {
  const q = normalizeText(filter);
  const selectedBranch = branch || "";
  const allowedSkillIds = options.allowedSkillIds || null;
  const list = sortedSkillsForLesson().filter((skill) => {
    if (allowedSkillIds && !allowedSkillIds.has(String(skill.id)) && String(skill.id) !== String(selectedSkillId)) return false;
    if (selectedBranch && (skill.ramo || "Altro") !== selectedBranch) return false;
    if (!q) return true;
    return normalizeText(skill.nome).includes(q);
  });
  if (!allSkills.length) return '<option value="">Catalogo vuoto</option>';
  if (!list.length) return '<option value="">Nessuna skill trovata</option>';
  return list.map((s) => `<option value="${s.id}" data-name="${esc(s.nome || "")}" title="${esc(s.nome || "")}" ${String(s.id) === String(selectedSkillId) ? "selected" : ""}>${esc(s.nome || "")}</option>`).join("");
}
function compactSelectedSkillOption(select) {
  if (!(select == null ? void 0 : select.value)) return;
  const selected = select.options[select.selectedIndex];
  if (selected == null ? void 0 : selected.dataset.name) selected.textContent = selected.dataset.name;
}
function filterSkillRow(input) {
  var _a2;
  const row = input.closest(".skill-row");
  const select = row == null ? void 0 : row.querySelector(".skill-select");
  if (!select) return;
  const selected = select.value;
  const branch = ((_a2 = row.querySelector(".skill-branch")) == null ? void 0 : _a2.value) || "";
  const allowedSkillIds = row.dataset.ripassoOnly === "1" ? ripassoSkillIdsForOwner(row.dataset.allieviId) : null;
  select.innerHTML = `<option value="">\u2014 Skill \u2014</option>${renderLessonSkillOptions(selected, "", branch, { allowedSkillIds })}`;
  if ([...select.options].some((option) => option.value === selected)) select.value = selected;
  compactSelectedSkillOption(select);
}
function lessonStadioLabel(stadio) {
  return {
    1: "In lavorazione",
    2: "Raffinamento",
    3: "Completato"
  }[stadio] || "In lavorazione";
}
const LESSON_STADIO_COLORS = {
  1: { border: "rgba(251,191,36,.5)", color: "#facc15", background: "rgba(251,191,36,.08)" },
  2: { border: "rgba(56,189,248,.55)", color: "#67e8f9", background: "rgba(56,189,248,.1)" },
  3: { border: "rgba(52,211,153,.65)", color: "var(--success)", background: "rgba(52,211,153,.12)" }
};
function lessonStadioInlineStyle(stadio) {
  const colors = LESSON_STADIO_COLORS[Number(stadio) || 1] || LESSON_STADIO_COLORS[1];
  return `border-color:${colors.border} !important;color:${colors.color} !important;background-color:${colors.background} !important`;
}
function applyLessonStadioVisual(btn, stadio) {
  const colors = LESSON_STADIO_COLORS[Number(stadio) || 1] || LESSON_STADIO_COLORS[1];
  btn.style.setProperty("border-color", colors.border, "important");
  btn.style.setProperty("color", colors.color, "important");
  btn.style.setProperty("background-color", colors.background, "important");
}
function renderLessonStadioToggle(stadio = 1) {
  const value = Number(stadio) || 1;
  return `<button type="button" class="btn btn-outline btn-sm stadio-toggle st st${value}" data-stadio="${value}" style="${lessonStadioInlineStyle(value)}" onclick="toggleLessonStadio(this)">${lessonStadioLabel(value)}</button>`;
}
function toggleLessonStadio(btn) {
  const next = (parseInt(btn.dataset.stadio || "1", 10) || 1) % 3 + 1;
  btn.dataset.stadio = String(next);
  btn.textContent = lessonStadioLabel(next);
  btn.classList.remove("st1", "st2", "st3");
  btn.classList.add(`st${next}`);
  applyLessonStadioVisual(btn, next);
}
const LESSON_RESULT_OPTIONS = [
  { value: "da_rivedere", label: "Da rivedere", className: "result-review" },
  { value: "bene", label: "Bene", className: "result-good" },
  { value: "ottimo", label: "Ottimo", className: "result-great" }
];
const LESSON_SIDE_FEEDBACK_OPTIONS = [
  { value: "bilaterale", label: "Bilaterale", className: "" },
  { value: "meglio_sx", label: "Meglio sx", className: "side-good" },
  { value: "meglio_dx", label: "Meglio dx", className: "side-good" },
  { value: "male_sx", label: "Male sx", className: "side-issue" },
  { value: "male_dx", label: "Male dx", className: "side-issue" }
];
function normalizedLessonResult(value) {
  return LESSON_RESULT_OPTIONS.some((option) => option.value === value) ? value : "bene";
}
function normalizedLessonSideFeedback(value) {
  return LESSON_SIDE_FEEDBACK_OPTIONS.some((option) => option.value === value) ? value : "bilaterale";
}
function lessonOption(options, value) {
  return options.find((option) => option.value === value) || options[0];
}
function renderLessonResultToggle(value = "bene") {
  const option = lessonOption(LESSON_RESULT_OPTIONS, normalizedLessonResult(value));
  return `<button type="button" class="btn btn-outline btn-sm lesson-result-toggle ${option.className}" data-result="${esc(option.value)}" onclick="toggleLessonResult(this)">${esc(option.label)}</button>`;
}
function lessonFormIsOpen() {
  var _a2;
  return ((_a2 = document.getElementById("lz-stato")) == null ? void 0 : _a2.value) !== "chiusa";
}
function renderLessonFeedbackControls(result = "bene", sideFeedback = "bilaterale") {
  return `<div class="lesson-feedback-controls" ${lessonFormIsOpen() ? "hidden" : ""}>
    ${renderLessonResultToggle(result)}
    ${renderLessonSideFeedbackToggle(sideFeedback)}
  </div>`;
}
function syncLessonFeedbackVisibility() {
  const hidden = lessonFormIsOpen();
  document.querySelectorAll(".lesson-feedback-controls").forEach((el) => {
    el.hidden = hidden;
  });
}
function toggleLessonResult(btn) {
  const current = normalizedLessonResult(btn.dataset.result);
  const index = LESSON_RESULT_OPTIONS.findIndex((option) => option.value === current);
  const next = LESSON_RESULT_OPTIONS[(index + 1) % LESSON_RESULT_OPTIONS.length];
  btn.dataset.result = next.value;
  btn.textContent = next.label;
  btn.classList.remove(...LESSON_RESULT_OPTIONS.map((option) => option.className).filter(Boolean));
  btn.classList.add(next.className);
}
function renderLessonSideFeedbackToggle(value = "bilaterale") {
  const option = lessonOption(LESSON_SIDE_FEEDBACK_OPTIONS, normalizedLessonSideFeedback(value));
  return `<button type="button" class="btn btn-outline btn-sm lesson-side-toggle ${option.className}" data-side-feedback="${esc(option.value)}" onclick="toggleLessonSideFeedback(this)">${esc(option.label)}</button>`;
}
function toggleLessonSideFeedback(btn) {
  const current = normalizedLessonSideFeedback(btn.dataset.sideFeedback);
  const index = LESSON_SIDE_FEEDBACK_OPTIONS.findIndex((option) => option.value === current);
  const next = LESSON_SIDE_FEEDBACK_OPTIONS[(index + 1) % LESSON_SIDE_FEEDBACK_OPTIONS.length];
  btn.dataset.sideFeedback = next.value;
  btn.textContent = next.label;
  btn.classList.remove(...LESSON_SIDE_FEEDBACK_OPTIONS.map((option) => option.className).filter(Boolean));
  if (next.className) btn.classList.add(next.className);
}
function skillRowResult(row) {
  var _a2, _b2;
  if ((_a2 = row == null ? void 0 : row.querySelector(".lesson-feedback-controls")) == null ? void 0 : _a2.hidden) return "";
  return normalizedLessonResult((_b2 = row == null ? void 0 : row.querySelector(".lesson-result-toggle")) == null ? void 0 : _b2.dataset.result);
}
function skillRowSideFeedback(row) {
  var _a2, _b2;
  if ((_a2 = row == null ? void 0 : row.querySelector(".lesson-feedback-controls")) == null ? void 0 : _a2.hidden) return "";
  return normalizedLessonSideFeedback((_b2 = row == null ? void 0 : row.querySelector(".lesson-side-toggle")) == null ? void 0 : _b2.dataset.sideFeedback);
}
function lessonResultLabel(value) {
  return lessonOption(LESSON_RESULT_OPTIONS, normalizedLessonResult(value)).label;
}
function lessonSideFeedbackLabel(value) {
  return lessonOption(LESSON_SIDE_FEEDBACK_OPTIONS, normalizedLessonSideFeedback(value)).label;
}
function renderFakieToggle(active = false) {
  return `<button type="button" class="btn btn-outline btn-sm fakie-toggle${active ? " is-on" : ""}" data-fakie="${active ? "on" : "off"}" onclick="toggleLessonFakie(this)">Fakie ${active ? "on" : "off"}</button>`;
}
function toggleLessonFakie(btn) {
  const active = btn.dataset.fakie !== "on";
  btn.dataset.fakie = active ? "on" : "off";
  btn.textContent = `Fakie ${active ? "on" : "off"}`;
  btn.classList.toggle("is-on", active);
}
function skillRowFakie(row) {
  var _a2;
  return ((_a2 = row.querySelector(".fakie-toggle")) == null ? void 0 : _a2.dataset.fakie) === "on";
}
const SKILL_DIMENSION_OPTIONS = {
  lato: ["bilaterale", "dx", "sx"],
  superficie: ["marmo", "liscio", "ruvida", "rovinata", "crepe/buchi", "fogliame", "bagnato", "prato"],
  piano: ["piano", "rialzo", "discesa", "salita", "bank discesa", "bank salita", "rampa discesa", "rampa salita", "pump down", "pump up"],
  velocita: ["lenta", "velocit\xE0 adeguata", "veloce"],
  assistenza: ["autonomo", "assistito"],
  stress: ["senza stress", "sotto stress"]
};
const SKILL_DIMENSION_LABELS = {
  lato: "Lato",
  superficie: "Superficie",
  piano: "Piano",
  velocita: "Velocit\xE0",
  assistenza: "Assistenza",
  stress: "Stress"
};
const LESSON_EXERCISE_OPTIONS = [
  "slalom",
  "slalom largo",
  "conetti a 8",
  "curva a 1/4 cerchio",
  "curva a 1/2 cerchio",
  "curva a cerchio",
  "curva a spirale",
  "ostacoli conetti",
  "ostacolo rialzo"
];
function renderDimensionSelect(key, selected = "") {
  const label = SKILL_DIMENSION_LABELS[key] || key;
  const options = SKILL_DIMENSION_OPTIONS[key] || [];
  const defaults = { lato: "bilaterale", superficie: "liscio", piano: "piano", velocita: "velocit\xE0 adeguata", assistenza: "autonomo", stress: "senza stress" };
  let normalizedSelected = selected;
  if (key === "lato" && selected === "entrambi") normalizedSelected = "bilaterale";
  if (key === "superficie" && ["normale", "liscia"].includes(selected)) normalizedSelected = "liscio";
  if (key === "velocita" && selected === "media") normalizedSelected = "velocit\xE0 adeguata";
  if (key === "stress" && ["basso", "medio", "alto"].includes(selected)) normalizedSelected = "sotto stress";
  const value = normalizedSelected || defaults[key] || "";
  return `<select class="skill-dimension${value ? " has-value" : ""}" data-dimension="${key}" aria-label="${esc(label)}" title="${esc(label)}" onchange="this.classList.toggle('has-value', !!this.value)">
    ${options.map((option) => `<option value="${esc(option)}" ${option === value ? "selected" : ""}>${esc(option)}</option>`).join("")}
  </select>`;
}
function hasSkillDimensions(dimensioni = {}) {
  return !!dimensioni && Object.keys(SKILL_DIMENSION_OPTIONS).some((key) => dimensioni[key]);
}
function renderDimensionToggle(active = false) {
  return `<button type="button" class="btn btn-outline btn-sm dimensions-toggle${active ? " is-on" : ""}" data-dimensions="${active ? "on" : "off"}" onclick="toggleSkillDimensions(this)">Dimensioni ${active ? "on" : "off"}</button>`;
}
function toggleSkillDimensions(btn) {
  const active = btn.dataset.dimensions !== "on";
  btn.dataset.dimensions = active ? "on" : "off";
  btn.textContent = `Dimensioni ${active ? "on" : "off"}`;
  btn.classList.toggle("is-on", active);
  const row = btn.closest(".skill-row");
  const dimensions = row == null ? void 0 : row.querySelector(".skill-dimensions");
  if (dimensions) dimensions.hidden = !active;
}
function renderSkillDimensions(dimensioni = {}, active = false) {
  return `<div class="skill-dimensions" ${active ? "" : "hidden"}>${Object.keys(SKILL_DIMENSION_OPTIONS).map((key) => renderDimensionSelect(key, (dimensioni == null ? void 0 : dimensioni[key]) || "")).join("")}</div>`;
}
function normalizeExerciseList(value) {
  if (Array.isArray(value)) return [...new Set(value.flatMap((item) => Array.isArray(item) ? item : [item]).map((item) => String(item || "").trim()).filter(Boolean))];
  if (typeof value === "string") return splitVariantText(value);
  return [];
}
function renderExerciseToggle(active = false, count = 0) {
  return `<button type="button" class="btn btn-outline btn-sm exercise-toggle${active ? " is-on" : ""}" data-exercises="${active ? "on" : "off"}" onclick="toggleSkillExercises(this)">Esercizi${count ? ` ${count}` : ""}</button>`;
}
function toggleSkillExercises(btn) {
  const active = btn.dataset.exercises !== "on";
  btn.dataset.exercises = active ? "on" : "off";
  const row = btn.closest(".skill-row");
  const selectedCount = skillRowExercises(row).length;
  btn.textContent = `Esercizi${selectedCount ? ` ${selectedCount}` : ""}`;
  btn.classList.toggle("is-on", active);
  const panel = row == null ? void 0 : row.querySelector(".skill-exercises");
  if (panel) panel.hidden = !active;
}
function renderSkillExercises(selected = [], active = false) {
  const selectedSet = new Set(normalizeExerciseList(selected));
  return `<div class="skill-exercises" ${active ? "" : "hidden"}>${LESSON_EXERCISE_OPTIONS.map((name) => `
    <button type="button" class="exercise-chip${selectedSet.has(name) ? " is-on" : ""}" data-exercise="${esc(name)}" data-selected="${selectedSet.has(name) ? "on" : "off"}" onclick="toggleExerciseChip(this)">${esc(name)}</button>
  `).join("")}</div>`;
}
function toggleExerciseChip(btn) {
  const selected = btn.dataset.selected !== "on";
  btn.dataset.selected = selected ? "on" : "off";
  btn.classList.toggle("is-on", selected);
  const row = btn.closest(".skill-row");
  const toggle = row == null ? void 0 : row.querySelector(".exercise-toggle");
  if (toggle) {
    const count = skillRowExercises(row).length;
    toggle.textContent = `Esercizi${count ? ` ${count}` : ""}`;
    toggle.classList.toggle("is-on", toggle.dataset.exercises === "on" || count > 0);
  }
}
function skillRowExercises(row) {
  return [...(row == null ? void 0 : row.querySelectorAll('.exercise-chip[data-selected="on"]')) || []].map((btn) => btn.dataset.exercise).filter(Boolean);
}
function skillRowDimensions(row) {
  var _a2;
  const dimensioni = {};
  const esito = skillRowResult(row);
  const latoFeedback = skillRowSideFeedback(row);
  if (esito) dimensioni.esito = esito;
  if (latoFeedback) dimensioni.lato_feedback = latoFeedback;
  if (((_a2 = row.querySelector(".dimensions-toggle")) == null ? void 0 : _a2.dataset.dimensions) === "on") {
    row.querySelectorAll(".skill-dimension[data-dimension]").forEach((select) => {
      if (select.value) dimensioni[select.dataset.dimension] = select.value;
    });
  }
  const esercizi = skillRowExercises(row);
  if (esercizi.length) dimensioni.esercizi = esercizi;
  return dimensioni;
}
function mergeDimensionValue(a, b) {
  const values = [];
  [a, b].forEach((value) => {
    if (Array.isArray(value)) values.push(...value);
    else if (value !== void 0 && value !== null && value !== "") values.push(value);
  });
  const unique = [...new Set(values.map((value) => String(value).trim()).filter(Boolean))];
  if (!unique.length) return void 0;
  return unique.length === 1 ? unique[0] : unique;
}
function mergeLessonDimensions(a = {}, b = {}) {
  const merged = __spreadValues({}, a || {});
  Object.entries(b || {}).forEach(([key, value]) => {
    const next = key === "esercizi" ? normalizeExerciseList([...normalizeExerciseList(merged[key]), ...normalizeExerciseList(value)]) : mergeDimensionValue(merged[key], value);
    if (next !== void 0 && (!Array.isArray(next) || next.length)) merged[key] = next;
  });
  return merged;
}
function dimensionValueLabel(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return value || "";
}
function renderGroupExclusionChips(selectedIds = []) {
  const selected = new Set(selectedIds || []);
  const chips = selectedLezioneAllieviIds().map((id) => `<button type="button" class="group-exclude-chip${selected.has(id) ? " is-excluded" : ""}" data-allievo-id="${esc(id)}" data-excluded="${selected.has(id) ? "on" : "off"}" onclick="toggleGroupExclusionChip(this)">${esc(allievoDisplayName(id))}</button>`).join("");
  return `<div class="group-exclusion-box"><span class="group-exclusion-label">Escludi</span>${chips || '<span class="lezione-empty-detail">Nessun presente</span>'}</div>`;
}
function toggleGroupExclusionChip(btn) {
  const excluded = btn.dataset.excluded !== "on";
  btn.dataset.excluded = excluded ? "on" : "off";
  btn.classList.toggle("is-excluded", excluded);
}
function skillRowExcludedIds(row) {
  return [...row.querySelectorAll('.group-exclude-chip[data-excluded="on"]')].map((btn) => btn.dataset.allievoId);
}
function refreshGroupExclusionControls() {
  document.querySelectorAll(".group-exclusion-box").forEach((box) => {
    const selected = new Set([...box.querySelectorAll('.group-exclude-chip[data-excluded="on"]')].map((btn) => btn.dataset.allievoId));
    box.innerHTML = `<span class="group-exclusion-label">Escludi</span>${selectedLezioneAllieviIds().map((id) => `<button type="button" class="group-exclude-chip${selected.has(id) ? " is-excluded" : ""}" data-allievo-id="${esc(id)}" data-excluded="${selected.has(id) ? "on" : "off"}" onclick="toggleGroupExclusionChip(this)">${esc(allievoDisplayName(id))}</button>`).join("") || '<span class="lezione-empty-detail">Nessun presente</span>'}`;
  });
}
function ensureEmptySkillRow(allieviId) {
  const container = document.getElementById(`skill-rows-${allieviId}`);
  if (!container) return;
  const rows = [...container.querySelectorAll(".skill-row")];
  const hasEmpty = rows.some((row) => {
    var _a2;
    return !((_a2 = row.querySelector(".skill-select")) == null ? void 0 : _a2.value);
  });
  if (!hasEmpty) aggiungiSkillRow(allieviId);
}
function onLessonSkillSelected(select) {
  var _a2;
  compactSelectedSkillOption(select);
  renderPrepSelectedSkills((_a2 = select.closest(".skill-row")) == null ? void 0 : _a2.dataset.allieviId);
}
function removeSkillRow(btn) {
  const row = btn.closest(".skill-row");
  const ownerId = row == null ? void 0 : row.dataset.allieviId;
  row == null ? void 0 : row.remove();
  renderPrepSelectedSkills(ownerId);
}
function skillRowSummaryText(row) {
  var _a2, _b2, _c, _d, _e, _f, _g;
  const select = row == null ? void 0 : row.querySelector(".skill-select");
  const skillName = ((_c = (_b2 = (_a2 = select == null ? void 0 : select.selectedOptions) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.dataset) == null ? void 0 : _c.name) || ((_e = (_d = select == null ? void 0 : select.selectedOptions) == null ? void 0 : _d[0]) == null ? void 0 : _e.textContent) || "Skill";
  const stadio = parseInt(((_f = row == null ? void 0 : row.querySelector(".stadio-toggle")) == null ? void 0 : _f.dataset.stadio) || "1", 10) || 1;
  const bits = [skillName.trim() || "Skill", lessonStadioLabel(stadio)];
  const exercises = skillRowExercises(row);
  if (exercises.length) bits.push(`${exercises.length} esercizi`);
  if (((_g = row == null ? void 0 : row.querySelector(".dimensions-toggle")) == null ? void 0 : _g.dataset.dimensions) === "on") bits.push("dimensioni");
  if (skillRowFakie(row)) bits.push("fakie");
  return bits.join(" \xB7 ");
}
function collapseSkillRow(row) {
  var _a2;
  if (!row || !((_a2 = row.querySelector(".skill-select")) == null ? void 0 : _a2.value)) return;
  const summary = row.querySelector(".skill-row-summary");
  if (summary) summary.textContent = skillRowSummaryText(row);
  row.classList.add("is-collapsed");
}
function expandSkillRow(btn) {
  var _a2;
  (_a2 = btn.closest(".skill-row")) == null ? void 0 : _a2.classList.remove("is-collapsed");
}
function collapseExistingSkillRows(container) {
  container == null ? void 0 : container.querySelectorAll(".skill-row").forEach((row) => collapseSkillRow(row));
}
function aggiungiSkillRow(allieviId, selectedSkillId = "", selectedStadio = 1, selectedDimensioni = {}, selectedFakie = false, selectedExcludedIds = [], options = {}) {
  const container = document.getElementById(`skill-rows-${allieviId}`);
  if (!container) return;
  if (options.collapseExisting !== false) collapseExistingSkillRows(container);
  const row = document.createElement("div");
  row.className = "skill-row";
  row.dataset.allieviId = allieviId;
  row.dataset.ripassoOnly = options.ripassoOnly ? "1" : "0";
  const selectedSkill = selectedSkillId ? allSkills.find((skill) => String(skill.id) === String(selectedSkillId)) : null;
  const selectedBranch = (selectedSkill == null ? void 0 : selectedSkill.ramo) || "";
  const allowedSkillIds = options.ripassoOnly ? ripassoSkillIdsForOwner(allieviId) : null;
  const fakieActive = !!selectedFakie || (selectedDimensioni == null ? void 0 : selectedDimensioni.direzione) === "fakie";
  const dimensionsActive = hasSkillDimensions(selectedDimensioni);
  const selectedExercises = normalizeExerciseList(selectedDimensioni == null ? void 0 : selectedDimensioni.esercizi);
  const exercisesActive = selectedExercises.length > 0;
  const selectedResult = normalizedLessonResult(selectedDimensioni == null ? void 0 : selectedDimensioni.esito);
  const selectedSideFeedback = normalizedLessonSideFeedback(selectedDimensioni == null ? void 0 : selectedDimensioni.lato_feedback);
  row.innerHTML = `
    <button type="button" class="btn btn-outline btn-sm skill-row-summary" onclick="expandSkillRow(this)">Skill</button>
    <select class="skill-branch" onchange="filterSkillRow(this)">
      ${renderLessonBranchOptions(selectedBranch)}
    </select>
    <select class="skill-select" onchange="onLessonSkillSelected(this)">
      <option value="">\u2014 Skill \u2014</option>
      ${renderLessonSkillOptions(selectedSkillId, "", selectedBranch, { allowedSkillIds })}
    </select>
    ${renderFakieToggle(fakieActive)}
    ${renderDimensionToggle(dimensionsActive)}
    ${renderExerciseToggle(exercisesActive, selectedExercises.length)}
    ${renderLessonFeedbackControls(selectedResult, selectedSideFeedback)}
    ${renderLessonStadioToggle(selectedStadio)}
    <button class="btn btn-ghost btn-sm" onclick="removeSkillRow(this)">\u2715</button>
    ${allieviId === GROUP_SKILL_ROWS_KEY ? renderGroupExclusionChips(selectedExcludedIds) : ""}
    ${renderSkillDimensions(selectedDimensioni, dimensionsActive)}
    ${renderSkillExercises(selectedExercises, exercisesActive)}`;
  container.appendChild(row);
  compactSelectedSkillOption(row.querySelector(".skill-select"));
}
function snapshotLezioneRelazioni(lezioneId) {
  return __async(this, null, function* () {
    if (!lezioneId) return { allievi: [], skills: [] };
    const [{ data: allievi, error: allieviError }, { data: skills, error: skillsError }] = yield Promise.all([
      sb.from("lezioni_allievi").select("*").eq("lezione_id", lezioneId),
      sb.from("lezioni_skills").select("*").eq("lezione_id", lezioneId)
    ]);
    if (allieviError) throw allieviError;
    if (skillsError) throw skillsError;
    return { allievi: allievi || [], skills: skills || [] };
  });
}
function sanitizeSnapshotRow(row) {
  const copy = __spreadValues({}, row);
  delete copy.id;
  delete copy.created_at;
  delete copy.updated_at;
  return copy;
}
function historySetSignature(values = []) {
  return [...new Set(values.map(valueForHistory))].sort().join("|");
}
function skillHistorySignature(row = {}) {
  return [
    row.allievo_id || "",
    row.skill_id || "",
    Number(row.stadio_raggiunto || row.stadio || 0),
    row.fakie ? "fakie" : "frontale",
    valueForHistory(row.dimensioni || {})
  ].join("::");
}
function pendingSkillHistorySignatures(pendingSkillsByAllievo) {
  const rows = [];
  pendingSkillsByAllievo.forEach((skillMap, allievoId) => {
    skillMap.forEach((item) => rows.push({
      allievo_id: allievoId,
      skill_id: item.skillId,
      stadio_raggiunto: item.stadio,
      fakie: item.fakie,
      dimensioni: item.dimensioni
    }));
  });
  return rows.map(skillHistorySignature);
}
function lessonHistoryChanges(originalLesson, payloadLezione, relationSnapshot, checkedAllievi, pendingSkillsByAllievo) {
  const changes = historyChangedFields(originalLesson || {}, payloadLezione, {
    data: "data",
    durata_min: "durata",
    tipo: "tipo",
    luogo: "luogo",
    meteo: "meteo",
    note_speciali: "note speciali",
    stato: "stato",
    check_bene: "cosa e andato bene",
    check_non_fatto: "non fatto / da riprendere",
    note: "note"
  });
  if (relationSnapshot) {
    const beforeAllievi = historySetSignature((relationSnapshot.allievi || []).map((row) => row.allievo_id));
    const afterAllievi = historySetSignature((checkedAllievi || []).map((cb) => cb.value));
    if (beforeAllievi !== afterAllievi) changes.push("allievi");
    const beforeSkills = historySetSignature((relationSnapshot.skills || []).map(skillHistorySignature));
    const afterSkills = historySetSignature(pendingSkillHistorySignatures(pendingSkillsByAllievo));
    if (beforeSkills !== afterSkills) changes.push("skill lavorate");
  }
  return changes;
}
function ripristinaRelazioniLezione(lezioneId, snapshot) {
  return __async(this, null, function* () {
    if (!lezioneId || !snapshot) return;
    yield sb.from("lezioni_skills").delete().eq("lezione_id", lezioneId);
    yield sb.from("lezioni_allievi").delete().eq("lezione_id", lezioneId);
    const allievi = (snapshot.allievi || []).map(sanitizeSnapshotRow);
    const skills = (snapshot.skills || []).map(sanitizeSnapshotRow);
    if (allievi.length) {
      const { error } = yield sb.from("lezioni_allievi").insert(allievi);
      if (error) throw error;
    }
    if (skills.length) {
      const { error } = yield sb.from("lezioni_skills").insert(skills);
      if (error) throw error;
    }
  });
}
function salvaLezione() {
  return __async(this, null, function* () {
    var _a2, _b2, _c, _d;
    const data = document.getElementById("lz-data").value;
    const durata = parseInt(document.getElementById("lz-durata").value) || null;
    const stato = ((_a2 = document.getElementById("lz-stato")) == null ? void 0 : _a2.value) === "chiusa" ? "chiusa" : "aperta";
    const target = document.getElementById("lz-tipo").value;
    const tipo = target.startsWith("gruppo:") ? "gruppo" : target.startsWith("allievo:") ? "individuale" : "campo_libero";
    const luogo = document.getElementById("lz-luogo").value.trim() || null;
    const meteo = ((_b2 = document.getElementById("lz-meteo")) == null ? void 0 : _b2.value.trim()) || null;
    const noteSpeciali = document.getElementById("lz-note-speciali").value.trim() || null;
    const checkBene = ((_c = document.getElementById("lz-check-bene")) == null ? void 0 : _c.value.trim()) || "";
    const checkNonFatto = ((_d = document.getElementById("lz-check-non-fatto")) == null ? void 0 : _d.value.trim()) || "";
    const note = composeLessonNotes(document.getElementById("lz-note").value.trim(), checkBene, checkNonFatto, noteSpeciali || "", stato, meteo || "");
    const errEl = document.getElementById("lz-err");
    errEl.classList.remove("show");
    if (!data) {
      errEl.textContent = "Inserisci la data.";
      errEl.classList.add("show");
      return;
    }
    if (!target) {
      errEl.textContent = "Seleziona allievo, gruppo o campo libero.";
      errEl.classList.add("show");
      return;
    }
    const checkedAllievi = [...document.querySelectorAll("#lz-hidden-checks input[type=checkbox]:checked")];
    if (!checkedAllievi.length) {
      errEl.textContent = "Seleziona almeno un allievo.";
      errEl.classList.add("show");
      return;
    }
    const buttons = [document.getElementById("btn-salva-lz"), document.getElementById("btn-salva-lz-top")].filter(Boolean);
    const saveText = lezioneFormSaveLabel(!!editingLezioneId);
    buttons.forEach((btn) => {
      btn.disabled = true;
      btn.textContent = "Salvataggio\u2026";
    });
    const lezioneInModifica = editingLezioneId;
    const originalLessonForHistory = lezioneInModifica ? (lezioniCache || []).find((l) => String(l.id) === String(lezioneInModifica)) || {} : {};
    let lz = null;
    let snapshot = null;
    let relazioniSostituite = false;
    let changedFieldsForHistory = [];
    try {
      if (lezioneInModifica) snapshot = yield snapshotLezioneRelazioni(lezioneInModifica);
      let e1;
      const payloadLezione = { data, durata_min: durata, tipo, luogo, meteo, note_speciali: noteSpeciali, note, stato, check_bene: checkBene || null, check_non_fatto: checkNonFatto || null };
      const payloadLezioneCompat = { data, durata_min: durata, tipo, luogo, note };
      const payloadLezioneNuova = __spreadProps(__spreadValues({}, payloadLezione), { maestro_id: currentUid || null });
      const payloadLezioneNuovaCompat = __spreadProps(__spreadValues({}, payloadLezioneCompat), { maestro_id: currentUid || null });
      if (lezioneInModifica) {
        let payloadCorrente = payloadLezione;
        ({ data: lz, error: e1 } = yield sb.from("lezioni").update(payloadCorrente).eq("id", lezioneInModifica).select().single());
        if (isMissingLessonMeteoError(e1)) {
          const _e = payloadCorrente, { meteo: _meteo } = _e, withoutMeteo = __objRest(_e, ["meteo"]);
          payloadCorrente = withoutMeteo;
          ({ data: lz, error: e1 } = yield sb.from("lezioni").update(payloadCorrente).eq("id", lezioneInModifica).select().single());
        }
        if (isMissingLessonCheckError(e1)) {
          const _f = payloadCorrente, { check_bene, check_non_fatto } = _f, withoutCheck = __objRest(_f, ["check_bene", "check_non_fatto"]);
          payloadCorrente = withoutCheck;
          ({ data: lz, error: e1 } = yield sb.from("lezioni").update(payloadCorrente).eq("id", lezioneInModifica).select().single());
        }
        if (isMissingLessonStatusError(e1)) {
          const _g = payloadCorrente, { stato: _stato } = _g, withoutStatus = __objRest(_g, ["stato"]);
          payloadCorrente = withoutStatus;
          ({ data: lz, error: e1 } = yield sb.from("lezioni").update(payloadCorrente).eq("id", lezioneInModifica).select().single());
        }
        if (isMissingLessonCheckError(e1)) {
          const _h = payloadCorrente, { stato: _stato, check_bene, check_non_fatto } = _h, withoutStatusAndCheck = __objRest(_h, ["stato", "check_bene", "check_non_fatto"]);
          payloadCorrente = withoutStatusAndCheck;
          ({ data: lz, error: e1 } = yield sb.from("lezioni").update(payloadCorrente).eq("id", lezioneInModifica).select().single());
        }
        if (isMissingNoteSpecialiError(e1)) {
          ;
          ({ data: lz, error: e1 } = yield sb.from("lezioni").update(payloadLezioneCompat).eq("id", lezioneInModifica).select().single());
        }
      } else {
        let payloadCorrente = payloadLezioneNuova;
        ({ data: lz, error: e1 } = yield sb.from("lezioni").insert(payloadCorrente).select().single());
        if (isMissingLessonMeteoError(e1)) {
          const _i = payloadCorrente, { meteo: _meteo } = _i, withoutMeteo = __objRest(_i, ["meteo"]);
          payloadCorrente = withoutMeteo;
          ({ data: lz, error: e1 } = yield sb.from("lezioni").insert(payloadCorrente).select().single());
        }
        if (isMissingLessonCheckError(e1)) {
          const _j = payloadCorrente, { check_bene, check_non_fatto } = _j, withoutCheck = __objRest(_j, ["check_bene", "check_non_fatto"]);
          payloadCorrente = withoutCheck;
          ({ data: lz, error: e1 } = yield sb.from("lezioni").insert(payloadCorrente).select().single());
        }
        if (isMissingLessonStatusError(e1)) {
          const _k = payloadCorrente, { stato: _stato } = _k, withoutStatus = __objRest(_k, ["stato"]);
          payloadCorrente = withoutStatus;
          ({ data: lz, error: e1 } = yield sb.from("lezioni").insert(payloadCorrente).select().single());
        }
        if (isMissingLessonCheckError(e1)) {
          const _l = payloadCorrente, { stato: _stato, check_bene, check_non_fatto } = _l, withoutStatusAndCheck = __objRest(_l, ["stato", "check_bene", "check_non_fatto"]);
          payloadCorrente = withoutStatusAndCheck;
          ({ data: lz, error: e1 } = yield sb.from("lezioni").insert(payloadCorrente).select().single());
        }
        if (isMissingNoteSpecialiError(e1)) {
          ;
          ({ data: lz, error: e1 } = yield sb.from("lezioni").insert(payloadLezioneNuovaCompat).select().single());
        }
      }
      if (e1) throw e1;
      if (lezioneInModifica) {
        const { error: skillsDeleteError } = yield sb.from("lezioni_skills").delete().eq("lezione_id", lezioneInModifica);
        if (skillsDeleteError) throw skillsDeleteError;
        const { error: allieviDeleteError } = yield sb.from("lezioni_allievi").delete().eq("lezione_id", lezioneInModifica);
        if (allieviDeleteError) throw allieviDeleteError;
        relazioniSostituite = true;
      }
      const pendingSkillsByAllievo = /* @__PURE__ */ new Map();
      const queueSkillForAllievo = (aid, row) => {
        var _a3, _b3;
        const skillId = (_a3 = row.querySelector(".skill-select")) == null ? void 0 : _a3.value;
        const stadio = parseInt(((_b3 = row.querySelector(".stadio-toggle")) == null ? void 0 : _b3.dataset.stadio) || "1", 10);
        const dimensioni = skillRowDimensions(row);
        const fakie = skillRowFakie(row);
        if (!skillId) return;
        if (!pendingSkillsByAllievo.has(aid)) pendingSkillsByAllievo.set(aid, /* @__PURE__ */ new Map());
        const key = `${skillId}:${stadio}:${fakie ? "fakie" : "frontale"}`;
        const pending = pendingSkillsByAllievo.get(aid);
        const current = pending.get(key);
        pending.set(key, current ? __spreadProps(__spreadValues({}, current), { dimensioni: mergeLessonDimensions(current.dimensioni, dimensioni) }) : { skillId, stadio, fakie, dimensioni });
      };
      const flushSkills = () => __async(null, null, function* () {
        for (const [aid, skillMap] of pendingSkillsByAllievo.entries()) {
          for (const item of skillMap.values()) {
            const { error: skillError } = yield insertLezioneSkill({ lezione_id: lz.id, allievo_id: aid, skill_id: item.skillId, stadio_raggiunto: item.stadio, fakie: item.fakie, dimensioni: item.dimensioni });
            if (skillError) throw skillError;
            if (stato === "chiusa") {
              try {
                yield aggiornaProgressiDaLezione(aid, item.skillId, item.stadio, { fakie: item.fakie });
              } catch (progressError) {
                console.warn("Progressi non aggiornati dopo salvataggio lezione", progressError);
              }
            }
          }
        }
      });
      for (const cb of checkedAllievi) {
        const aid = cb.value;
        const { error: allievoInsertError } = yield sb.from("lezioni_allievi").insert({ lezione_id: lz.id, allievo_id: aid });
        if (allievoInsertError) throw allievoInsertError;
      }
      yield ensureLocationDaLezione(luogo, checkedAllievi.map((cb) => cb.value));
      if (tipo === "gruppo") {
        const checkedIds = checkedAllievi.map((cb) => cb.value);
        for (const row of document.querySelectorAll(`#skill-rows-${GROUP_SKILL_ROWS_KEY} .skill-row`)) {
          const excluded = new Set(skillRowExcludedIds(row));
          for (const aid of checkedIds.filter((id) => !excluded.has(id))) {
            queueSkillForAllievo(aid, row);
          }
        }
        for (const aid of checkedIds) {
          const rows = document.querySelectorAll(`#skill-rows-${aid} .skill-row`);
          for (const row of rows) queueSkillForAllievo(aid, row);
        }
      } else {
        for (const cb of checkedAllievi) {
          const aid = cb.value;
          const rows = document.querySelectorAll(`#skill-rows-${aid} .skill-row`);
          for (const row of rows) {
            queueSkillForAllievo(aid, row);
          }
        }
      }
      if (lezioneInModifica) {
        changedFieldsForHistory = lessonHistoryChanges(originalLessonForHistory, payloadLezione, snapshot, checkedAllievi, pendingSkillsByAllievo);
      }
      yield flushSkills();
      logModificaLocale("lezione", lz.id, lezioneInModifica ? historyDescription(`Aggiornata lezione (${stato})`, changedFieldsForHistory) : `Creata lezione (${stato}): ${checkedAllievi.length} allievi, ${pendingSkillHistorySignatures(pendingSkillsByAllievo).length} skill`);
      editingLezioneId = null;
      editingLezioneAllieviIds = [];
      editingLezioneSkillRows = {};
      lezioniCache = null;
      luoghiLezioneCache.clear();
      safeStorage.removeItem(LEZIONE_DRAFT_KEY);
      const destination = editReturnTarget;
      editReturnTarget = null;
      yield goToReturnTarget(destination, { name: "lezione", id: lz.id });
    } catch (e) {
      if (lezioneInModifica && relazioniSostituite && snapshot) {
        try {
          yield ripristinaRelazioniLezione(lezioneInModifica, snapshot);
        } catch (restoreError) {
          console.error("Ripristino relazioni lezione fallito", restoreError);
        }
      }
      errEl.textContent = e.message || "Errore nel salvataggio della lezione. Le presenze precedenti sono state mantenute quando possibile.";
      errEl.classList.add("show");
    } finally {
      buttons.forEach((btn) => {
        btn.disabled = false;
        btn.textContent = saveText;
      });
    }
  });
}
function insertLezioneSkill(payload) {
  return __async(this, null, function* () {
    let nextPayload = __spreadValues({}, payload);
    for (let attempt = 0; attempt < 3; attempt++) {
      const { error } = yield sb.from("lezioni_skills").insert(nextPayload);
      if (!error) return { error: null };
      if (isMissingDimensioniError(error) && "dimensioni" in nextPayload) {
        if (hasLessonSkillMetadata(nextPayload)) return { error: missingLessonSkillColumnError("dimensioni") };
        const _a2 = nextPayload, { dimensioni } = _a2, compatPayload = __objRest(_a2, ["dimensioni"]);
        nextPayload = compatPayload;
        continue;
      }
      if (isMissingFakieError(error) && "fakie" in nextPayload) {
        if (nextPayload.fakie) return { error: missingLessonSkillColumnError("fakie") };
        const _b2 = nextPayload, { fakie } = _b2, compatPayload = __objRest(_b2, ["fakie"]);
        nextPayload = compatPayload;
        continue;
      }
      return { error };
    }
    return { error: null };
  });
}
const TUNING_PARAMS = [
  {
    key: "verticalizzazione",
    label: "Verticalizzazione",
    dbLabel: "Baricentro",
    hint: "Gestione del baricentro: abbassamento, carico, recupero asse.",
    scale: ["Rigido / centrale", "Doppio supporto stabile", "Trasferimento parziale", "Carico dominante assistito", "Instabilita controllata"]
  },
  {
    key: "forze",
    label: "Forze",
    dbLabel: "Forze",
    hint: "Interazione col suolo: generare, guidare o dissipare energia.",
    scale: ["Quasi passivo", "Forza reattiva", "Forza guidata semplice", "Forza ciclica/modulata", "Forza intensa o esplosiva"]
  },
  {
    key: "rotazione",
    label: "Rotazione",
    dbLabel: "Assi",
    hint: "Setup, pre-rotazione, dissociazione e controllo rotativo.",
    scale: ["Nessuna rotazione", "Micro aggiustamenti", "Orientamento/setup", "Rotazione funzionale", "Dissociazione complessa"]
  },
  {
    key: "tempo",
    label: "Tempo",
    dbLabel: "Tempo",
    hint: "Sequenza, ritmo, timing e fasi del gesto.",
    scale: ["Statico o libero", "Timing semplice", "Sequenza breve", "Ritmo continuo", "Timing preciso multi-fase"]
  },
  {
    key: "stabilita",
    label: "Stabilita",
    dbLabel: null,
    hint: "Quanto equilibrio serve per tenere o attraversare la posizione.",
    scale: ["Base ampia", "Stabile ma attiva", "Equilibrio da gestire", "Base ridotta/dinamica", "Equilibrio critico"]
  },
  {
    key: "asimmetria",
    label: "Asimmetria",
    dbLabel: "Bilaterale",
    hint: "Dominanza di lato, bilateralita o carichi non simmetrici.",
    scale: ["Simmetrica", "Lieve preferenza", "Un lato dominante", "Bilateralita richiesta", "Forte asimmetria tecnica"]
  },
  {
    key: "coordinazione",
    label: "Coordinazione",
    dbLabel: null,
    hint: "Numero e precisione dei segmenti corporei da coordinare.",
    scale: ["Gesto singolo", "Due elementi", "Catena semplice", "Catena coordinata", "Coordinazione fine complessa"]
  },
  {
    key: "difficolta",
    label: "Difficolta",
    dbLabel: "Livello",
    hint: "Sintesi didattica: quanto costa apprenderla in progressione.",
    scale: ["Primo approccio", "Facile guidata", "Intermedia", "Avanzata", "Molto avanzata"]
  }
];
function initTuning() {
  tuningLocal = JSON.parse(safeStorage.getItem("tuningLocal") || "[]");
  tuningAlertCount = Number(safeStorage.getItem("tuningAlertCount") || 0);
  renderTuningStats();
  setTuningMode(tuningMode, true);
}
function setTuningMode(mode, keepCard = false) {
  tuningMode = mode;
  ["parametri", "requisiti", "progressione", "livelli"].forEach((m) => {
    document.getElementById(`tune-mode-${m}`).classList.toggle("chip-on", m === mode);
  });
  if (!keepCard) nextTuningCard();
  else if (!tuningCard) nextTuningCard();
}
function tuningSkills() {
  var _a2;
  const scope = ((_a2 = document.getElementById("tune-scope")) == null ? void 0 : _a2.value) || "";
  return (allSkills || []).filter((s) => !scope || (scope === "Altro" ? !s.ramo : s.ramo === scope)).sort((a, b) => a.livello - b.livello || String(a.nome).localeCompare(String(b.nome)));
}
function pickTuningSkill() {
  const list = tuningSkills();
  if (!list.length) return null;
  const fresh = list.filter((s) => !tuningRecentSkillIds.includes(s.id));
  const pool = fresh.length ? fresh : list;
  return pool[Math.floor(Math.random() * pool.length)];
}
function rememberTuningCard(card = tuningCard) {
  var _a2, _b2;
  if (!((_a2 = card == null ? void 0 : card.skill) == null ? void 0 : _a2.id)) return;
  tuningRecentSkillIds.push(card.skill.id);
  if ((_b2 = card.refSkill) == null ? void 0 : _b2.id) tuningRecentSkillIds.push(card.refSkill.id);
  tuningRecentSkillIds = [...new Set(tuningRecentSkillIds)].slice(-12);
}
function skillById(id) {
  return allSkills.find((s) => s.id === id) || null;
}
function shortSkillMeta(skill) {
  if (!skill) return "";
  return `${skill.ramo || "Altro"} \xB7 Lv.${skill.livello}`;
}
function getRequirementContext(skill) {
  const sameRamo = allSkills.filter((s) => (s.ramo || "Altro") === (skill.ramo || "Altro") && s.id !== skill.id).sort((a, b) => a.livello - b.livello || String(a.nome).localeCompare(String(b.nome)));
  const prev = sameRamo.filter((s) => s.livello <= skill.livello).slice(-3);
  const next = sameRamo.filter((s) => s.livello >= skill.livello).slice(0, 3);
  const peers = allSkills.filter((s) => s.id !== skill.id && s.livello === skill.livello && (s.ramo || "Altro") !== (skill.ramo || "Altro")).sort((a, b) => String(a.ramo || "").localeCompare(String(b.ramo || "")) || String(a.nome).localeCompare(String(b.nome))).slice(0, 6);
  const requires = allPrereqs.filter((p) => p.skill_id === skill.id).map((p) => __spreadProps(__spreadValues({}, p), { skill: skillById(p.richiede_skill_id) })).filter((p) => p.skill).sort((a, b) => a.skill.livello - b.skill.livello || String(a.skill.nome).localeCompare(String(b.skill.nome)));
  const unlocks = allPrereqs.filter((p) => p.richiede_skill_id === skill.id).map((p) => __spreadProps(__spreadValues({}, p), { skill: skillById(p.skill_id) })).filter((p) => p.skill).sort((a, b) => a.skill.livello - b.skill.livello || String(a.skill.nome).localeCompare(String(b.skill.nome)));
  return { requires, unlocks, prev, next, peers };
}
function declaredParamSnapshot(skill) {
  const aliases = {
    verticalizzazione: ["param_verticalizzazione", "verticalizzazione", "attr_verticalizzazione", "baricentro", "attr_baricentro"],
    forze: ["param_forze", "forze", "attr_forze"],
    rotazione: ["param_rotazione", "rotazione", "attr_rotazione", "assi", "attr_assi"],
    tempo: ["param_tempo", "tempo", "attr_tempo"],
    stabilita: ["param_stabilita", "stabilita", "stabilit\xE0", "attr_stabilita", "attr_stabilit\xE0"],
    asimmetria: ["param_asimmetria", "asimmetria", "attr_asimmetria"],
    coordinazione: ["param_coordinazione", "coordinazione", "attr_coordinazione"],
    difficolta: ["param_difficolta", "difficolta", "difficolt\xE0", "attr_difficolta", "attr_difficolt\xE0"]
  };
  return TUNING_PARAMS.map((param) => {
    var _a2;
    const key = (_a2 = aliases[param.key]) == null ? void 0 : _a2.find((k) => skill[k] !== void 0 && skill[k] !== null && skill[k] !== "");
    const value = key ? skill[key] : "Non dichiarato";
    return [param.label, value, param.key, !!key];
  });
}
function nextTuningCard() {
  const el = document.getElementById("tuning-card");
  const skills = tuningSkills();
  if (!skills.length) {
    tuningCard = null;
    el.innerHTML = '<div class="empty">Nessuna skill in questo filtro.</div>';
    renderTuningStats();
    return;
  }
  rememberTuningCard();
  if (tuningMode === "parametri") tuningCard = buildParamCard();
  if (tuningMode === "requisiti") tuningCard = buildRequirementCard();
  if (tuningMode === "progressione") tuningCard = buildProgressionCard();
  if (tuningMode === "livelli") tuningCard = buildLevelCard();
  renderTuningCard();
}
function buildParamCard() {
  const skill = pickTuningSkill();
  const param = TUNING_PARAMS[Math.floor(Math.random() * TUNING_PARAMS.length)];
  return {
    tipo: "parametri",
    skill,
    parametro: param.key,
    paramKey: param.key,
    scale: param.scale,
    paramSnapshot: declaredParamSnapshot(skill),
    title: `Quanto vale ${param.label} per "${skill.nome}"?`,
    context: `${skill.ramo || "Neutra"} \xB7 livello ${skill.livello} \xB7 ${skill.blocco}. ${param.hint}`,
    value: null,
    outcome: "",
    note: ""
  };
}
function buildRequirementCard() {
  const skill = pickTuningSkill();
  const reqContext = getRequirementContext(skill);
  return {
    tipo: "requisiti",
    skill,
    reqContext,
    title: `"${skill.nome}" ha prerequisiti corretti e completi?`,
    context: "Guarda cosa richiede, cosa sblocca e le skill vicine prima di decidere se manca un ponte o se il collegamento e corretto.",
    value: null,
    outcome: "",
    note: ""
  };
}
function buildProgressionCard() {
  const skills = tuningSkills();
  const ordered = skills.filter((s) => s.ramo).sort((a2, b2) => (a2.ramo || "").localeCompare(b2.ramo || "") || a2.livello - b2.livello);
  const base = ordered.length > 1 ? ordered : skills;
  const i = Math.max(0, Math.floor(Math.random() * Math.max(1, base.length - 1)));
  const a = base[i];
  const b = base[i + 1] || base[0];
  return {
    tipo: "progressione",
    skill: a,
    refSkill: b,
    title: `L'ordine "${a.nome}" -> "${b.nome}" funziona?`,
    context: `${a.ramo || "Neutra"} \xB7 livelli ${a.livello} e ${b.livello}. La freccia indica una progressione diretta proposta: ${a.nome} prima di ${b.nome}.`,
    value: null,
    outcome: "",
    note: ""
  };
}
function buildLevelCard() {
  const skill = pickTuningSkill();
  const levelContext = getRequirementContext(skill);
  return {
    tipo: "livelli",
    skill,
    levelContext,
    title: `Il livello ${skill.livello} di "${skill.nome}" e corretto?`,
    context: `${skill.ramo || "Neutra"} \xB7 ${skill.blocco}. Alza = spostarla a un livello piu alto; Abbassa = anticiparla a un livello piu basso.`,
    value: null,
    outcome: "",
    note: ""
  };
}
function tuningChoicesFor(card) {
  if (card.tipo === "progressione") {
    return [
      ["ok", "Si, diretto"],
      ["ok-bridge", "Si, ma serve bridge"],
      ["no", "No"],
      ["contrario", "Contrario"],
      ["contrario-bridge", "Contrario con bridge"],
      ["non-collegare", "Non collegare"],
      ["non-so", "Non so"]
    ];
  }
  if (card.tipo === "livelli") {
    return [
      ["ok", "Ok"],
      ["alza", "Alza"],
      ["abbassa", "Abbassa"]
    ];
  }
  if (card.tipo === "requisiti") {
    return [
      ["ok", "Va bene"],
      ["rivedere", "Da rivedere"],
      ["manca-bridge", "Manca bridge"],
      ["contrario", "Contrario"],
      ["contrario-bridge", "Contrario con bridge"],
      ["non-collegare", "Non collegare"],
      ["non-so", "Non so"]
    ];
  }
  return [
    ["ok", "Va bene"],
    ["rivedere", "Da rivedere"],
    ["manca-bridge", "Manca bridge"],
    ["non-so", "Non so"]
  ];
}
function renderTuningCard() {
  var _a2;
  const el = document.getElementById("tuning-card");
  const card = tuningCard;
  if (!card) return;
  const progress = Math.min(100, tuningCount * 10);
  const body = card.tipo === "parametri" ? `<div class="rating-5">${[1, 2, 3, 4, 5].map((v) => {
    var _a3;
    return `
        <button class="btn btn-outline${card.value === v ? " active" : ""}" onclick="setTuningValue(${v})">
          <span class="rating-num">${v}</span>
          <span class="rating-caption">${esc(((_a3 = card.scale) == null ? void 0 : _a3[v - 1]) || "")}</span>
        </button>`;
  }).join("")}</div>` : `<div class="choice-grid${card.tipo === "progressione" ? " choice-grid-progressione" : ""}">
        ${tuningChoicesFor(card).map(([v, label]) => `<button class="btn btn-outline${card.outcome === v ? " active" : ""}" onclick="setTuningOutcome('${v}')">${label}</button>`).join("")}
      </div>`;
  const requirementContext = card.tipo === "requisiti" ? renderRequirementContext(card.reqContext) : "";
  const levelContext = card.tipo === "livelli" ? renderLevelContext(card.levelContext) : "";
  const paramContext = card.tipo === "parametri" ? renderParamSnapshot(card.paramSnapshot, card.paramKey) : "";
  el.innerHTML = `
    <div class="tuning-progress">
      <div class="tuning-bar"><span style="width:${progress}%"></span></div>
      <span>${tuningCount}/10</span>
    </div>
    <div id="tune-status" class="msg" style="display:none;margin-bottom:.65rem"></div>
    <div class="tuning-kicker"><span>${card.tipo}</span><span>\xB7</span><span>${esc(((_a2 = card.skill) == null ? void 0 : _a2.ramo) || "Altro")}</span></div>
    <h3 class="tuning-title">${esc(card.title)}</h3>
    <p class="tuning-context">${esc(card.context)} Le risposte non chiudono la skill: potra tornare nei ripassi.</p>
    ${paramContext}
    ${requirementContext}
    ${levelContext}
    ${body}
    <div class="field" style="margin:0">
      <label>Nota rapida</label>
      <textarea id="tune-note" placeholder="Motivo, dubbio, prerequisito mancante, variante specifica..." oninput="tuningCard.note=this.value">${esc(card.note || "")}</textarea>
    </div>
    <div class="tuning-actions">
      <button class="btn btn-primary" onclick="saveTuningAnswer()">Salva risposta</button>
      <button class="btn btn-outline" onclick="saveTuningAlert()">Salva avviso</button>
      <button class="btn btn-outline" onclick="nextTuningCard()">Salta</button>
    </div>`;
  requestAnimationFrame(() => motion.cards(el));
}
function renderParamSnapshot(rows, currentParam) {
  if (!(rows == null ? void 0 : rows.length)) return "";
  return `
    <div class="req-box">
      <h4>8 parametri della skill</h4>
      <div class="param-snapshot">
        ${rows.map(([label, value, key, declared]) => `
          <div class="param-pill" style="${currentParam && key === currentParam ? "border-color:var(--blu)" : ""};${!declared ? "opacity:.62" : ""}">
            <span>${esc(label)}</span>
            <strong>${esc(value)}</strong>
          </div>`).join("")}
      </div>
    </div>`;
}
function renderReqList(items, emptyText, withStage = false) {
  if (!(items == null ? void 0 : items.length)) return `<p class="req-empty">${esc(emptyText)}</p>`;
  return `<div class="req-list">${items.map((item) => {
    var _a2;
    const skill = item.skill || item;
    const stage = withStage ? `Stadio ${(_a2 = item.stadio_minimo) != null ? _a2 : "-"}` : shortSkillMeta(skill);
    return `<div class="req-item"><span>${esc(skill.nome)}</span><span>${esc(stage)}</span></div>`;
  }).join("")}</div>`;
}
function renderRequirementContext(ctx) {
  if (!ctx) return "";
  return `
    <div class="req-context">
      <div class="req-context-grid">
        <div class="req-box">
          <h4>Prerequisiti attuali</h4>
          ${renderReqList(ctx.requires, "Nessun prerequisito esplicito nel grafo.", true)}
        </div>
        <div class="req-box">
          <h4>Sblocca / serve a</h4>
          ${renderReqList(ctx.unlocks, "Nessuna skill dipendente registrata.", true)}
        </div>
      </div>
      <div class="req-context-grid">
        <div class="req-box">
          <h4>Prima nello stesso ramo</h4>
          ${renderReqList(ctx.prev, "Nessuna skill precedente nello stesso ramo.")}
        </div>
        <div class="req-box">
          <h4>Dopo nello stesso ramo</h4>
          ${renderReqList(ctx.next, "Nessuna skill successiva nello stesso ramo.")}
        </div>
        <div class="req-box">
          <h4>Stesso livello altrove</h4>
          ${renderReqList(ctx.peers, "Nessuna skill pari livello in altri rami.")}
        </div>
      </div>
    </div>`;
}
function renderLevelContext(ctx) {
  if (!ctx) return "";
  return `
    <div class="req-context">
      <div class="req-context-grid">
        <div class="req-box">
          <h4>Prima nello stesso ramo</h4>
          ${renderReqList(ctx.prev, "Nessuna skill precedente nello stesso ramo.")}
        </div>
        <div class="req-box">
          <h4>Dopo nello stesso ramo</h4>
          ${renderReqList(ctx.next, "Nessuna skill successiva nello stesso ramo.")}
        </div>
        <div class="req-box">
          <h4>Stesso livello altrove</h4>
          ${renderReqList(ctx.peers, "Nessuna skill pari livello in altri rami.")}
        </div>
      </div>
    </div>`;
}
function setTuningValue(value) {
  tuningCard.value = value;
  renderTuningCard();
}
function setTuningOutcome(value) {
  tuningCard.outcome = value;
  renderTuningCard();
}
function setTuneStatus(text, kind = "") {
  const el = document.getElementById("tune-status");
  if (!el) return;
  el.className = `msg ${kind}`.trim();
  el.style.display = text ? "block" : "none";
  el.textContent = text || "";
}
function buildTuningPayload({ avviso = false } = {}) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
  if (!tuningCard) return null;
  return {
    tipo: tuningCard.tipo,
    skill_id: ((_a2 = tuningCard.skill) == null ? void 0 : _a2.id) || null,
    skill_ref_id: ((_b2 = tuningCard.refSkill) == null ? void 0 : _b2.id) || null,
    variante: ((_c = tuningCard.skill) == null ? void 0 : _c.nome) || null,
    parametro: tuningCard.parametro || null,
    valore: avviso ? null : tuningCard.value || null,
    esito: avviso ? "avviso" : tuningCard.outcome || null,
    note: tuningCard.note || null,
    maestro_id: currentUid,
    payload: {
      avviso,
      stato_tuning: avviso ? "avviso_da_revisionare" : "risposta_da_rivedere_in_futuro",
      skill_nome: (_d = tuningCard.skill) == null ? void 0 : _d.nome,
      skill_ref_nome: (_e = tuningCard.refSkill) == null ? void 0 : _e.nome,
      ramo: ((_f = tuningCard.skill) == null ? void 0 : _f.ramo) || null,
      livello: ((_g = tuningCard.skill) == null ? void 0 : _g.livello) || null,
      blocco: ((_h = tuningCard.skill) == null ? void 0 : _h.blocco) || null,
      valori_skill_correnti: tuningCard.paramSnapshot ? Object.fromEntries(tuningCard.paramSnapshot) : null,
      verifica_livello: tuningCard.tipo === "livelli" ? {
        livello_corrente: ((_i = tuningCard.skill) == null ? void 0 : _i.livello) || null,
        blocco_corrente: ((_j = tuningCard.skill) == null ? void 0 : _j.blocco) || null,
        esito: tuningCard.outcome || null
      } : null,
      progressione_proposta: tuningCard.tipo === "progressione" ? {
        prima_id: ((_k = tuningCard.skill) == null ? void 0 : _k.id) || null,
        prima_nome: ((_l = tuningCard.skill) == null ? void 0 : _l.nome) || null,
        dopo_id: ((_m = tuningCard.refSkill) == null ? void 0 : _m.id) || null,
        dopo_nome: ((_n = tuningCard.refSkill) == null ? void 0 : _n.nome) || null,
        interpretazione_esito: tuningCard.outcome || null
      } : null,
      prerequisiti_correnti: (_p = (_o = tuningCard.reqContext) == null ? void 0 : _o.requires) == null ? void 0 : _p.map((r) => {
        var _a3;
        return {
          id: r.richiede_skill_id,
          nome: (_a3 = r.skill) == null ? void 0 : _a3.nome,
          stadio_minimo: r.stadio_minimo
        };
      }),
      sblocca_correnti: (_r = (_q = tuningCard.reqContext) == null ? void 0 : _q.unlocks) == null ? void 0 : _r.map((r) => {
        var _a3;
        return {
          id: r.skill_id,
          nome: (_a3 = r.skill) == null ? void 0 : _a3.nome,
          stadio_minimo: r.stadio_minimo
        };
      })
    }
  };
}
function persistTuningPayload(payload) {
  return __async(this, null, function* () {
    const { error } = yield sb.from("tuning_risposte").insert(payload);
    if (error) {
      const localPayload = __spreadProps(__spreadValues({}, payload), { creato_il: (/* @__PURE__ */ new Date()).toISOString(), errore_remoto: error.message });
      tuningLocal.push(localPayload);
      safeStorage.setItem("tuningLocal", JSON.stringify(tuningLocal));
    }
    return error;
  });
}
function saveTuningAnswer() {
  return __async(this, null, function* () {
    if (!tuningCard) return;
    const missing = tuningCard.tipo === "parametri" ? !tuningCard.value : !tuningCard.outcome;
    if (missing) {
      setTuneStatus("Scegli una risposta prima di salvare, oppure usa Salva avviso per registrare solo la nota.", "msg-info");
      return;
    }
    yield persistTuningPayload(buildTuningPayload());
    tuningCount += 1;
    renderTuningStats();
    nextTuningCard();
  });
}
function saveTuningAlert() {
  return __async(this, null, function* () {
    var _a2, _b2;
    if (!tuningCard) return;
    tuningCard.note = ((_b2 = (_a2 = document.getElementById("tune-note")) == null ? void 0 : _a2.value) == null ? void 0 : _b2.trim()) || tuningCard.note || "";
    if (!tuningCard.note) {
      setTuneStatus("Scrivi una nota prima di creare un avviso.", "msg-info");
      return;
    }
    yield persistTuningPayload(buildTuningPayload({ avviso: true }));
    tuningAlertCount += 1;
    safeStorage.setItem("tuningAlertCount", String(tuningAlertCount));
    renderTuningStats();
    nextTuningCard();
  });
}
function resetTuningSession() {
  tuningCount = 0;
  nextTuningCard();
  renderTuningStats();
}
function renderTuningStats() {
  const el = document.getElementById("tuning-stats");
  if (!el) return;
  el.innerHTML = `
    <div class="stat-tile"><strong>${tuningCount}</strong><span>Sessione</span></div>
    <div class="stat-tile"><strong>${tuningAlertCount}</strong><span>Avvisi</span></div>
    <div class="stat-tile"><strong>${tuningLocal.length}</strong><span>Fallback locale</span></div>
    <div class="stat-tile"><strong>${allSkills.length}</strong><span>Skill catalogo</span></div>`;
}
function importSkilltreeCatalog(btn) {
  return __async(this, null, function* () {
    const status = document.getElementById("tuning-import-status");
    const setStatus = (text, kind = "") => {
      if (!status) return;
      status.className = `msg ${kind}`.trim();
      status.style.display = text ? "block" : "none";
      status.textContent = text || "";
    };
    const nodes = window.SKILLTREE_NODES || [];
    if (!nodes.length) {
      setStatus("Catalogo locale non trovato.", "msg-err");
      return;
    }
    const branchMap = { stance: "Equilibrio", gait: "Andatura", break: "Frenata", rotation: "Rotazione", air: "Air" };
    const bloccoFor = (level) => level <= 3 ? "Base" : level <= 5 ? "Intermedio" : level <= 7 ? "Avanzato" : "Master";
    const isBilat = (node) => /dx\/sx|entrambi|bilaterale|switch naturale|senso orario\/antiorario/i.test((node.variants || []).join(", "));
    const descFor = (node) => {
      var _a2;
      return [node.note, ((_a2 = node.variants) == null ? void 0 : _a2.length) ? "Varianti: " + node.variants.join(", ") + "." : ""].filter(Boolean).join(" ") || null;
    };
    const oldText = btn == null ? void 0 : btn.textContent;
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Importo...";
    }
    setStatus(`Import in corso: ${nodes.length} skill dal catalogo locale...`);
    try {
      const { data: existing, error: readError } = yield sb.from("skills").select("id,nome");
      if (readError) throw readError;
      const existingNames = new Set((existing || []).map((s) => String(s.nome).toLowerCase()));
      const payload = nodes.filter((node) => !existingNames.has(String(node.name).toLowerCase())).map((node) => {
        const bilat = isBilat(node);
        return {
          nome: node.name,
          descrizione: descFor(node),
          tipo: "RAMO",
          ramo: branchMap[node.branch] || "Equilibrio",
          livello: node.level,
          blocco: bloccoFor(node.level),
          open_closed: node.key ? "CLOSED" : "OPEN",
          obbligatoria: !!node.key,
          e_bilaterale: bilat,
          lato_sx_nome: bilat ? "sx" : null,
          lato_dx_nome: bilat ? "dx" : null
        };
      });
      if (payload.length) {
        const { error: insertError } = yield sb.from("skills").insert(payload);
        if (insertError) throw insertError;
      }
      const { data: freshSkills, error: freshError } = yield sb.from("skills").select("*").order("livello");
      if (freshError) throw freshError;
      const byName = new Map((freshSkills || []).map((s) => [String(s.nome).toLowerCase(), s.id]));
      const edgePayload = [];
      nodes.forEach((node) => {
        const skillId = byName.get(String(node.name).toLowerCase());
        (node.prereq || []).forEach((reqName) => {
          const reqId = byName.get(String(reqName).toLowerCase());
          if (skillId && reqId && skillId !== reqId) {
            edgePayload.push({ skill_id: skillId, richiede_skill_id: reqId, stadio_minimo: 2, note: "Import skill tree metodologica" });
          }
        });
      });
      if (edgePayload.length) {
        const { error: edgeError } = yield sb.from("prerequisiti_skill").upsert(edgePayload, { onConflict: "skill_id,richiede_skill_id", ignoreDuplicates: true });
        if (edgeError) throw edgeError;
      }
      allSkills = freshSkills || [];
      renderTuningStats();
      nextTuningCard();
      setStatus(`Catalogo caricato. Skill nuove: ${payload.length}. Prerequisiti elaborati: ${edgePayload.length}.`, "msg-ok");
    } catch (e) {
      setStatus("Import non riuscito: " + (e.message || e), "msg-err");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = oldText;
      }
    }
  });
}
function formatDate(d) {
  if (!d) return "\u2014";
  const [y, m, g] = d.slice(0, 10).split("-");
  return `${g}/${m}/${y}`;
}
function formatDateWithWeekday(d) {
  if (!d) return "\u2014";
  const iso = String(d).slice(0, 10);
  const date = /* @__PURE__ */ new Date(`${iso}T12:00:00`);
  const days = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
  return `${days[date.getDay()]} ${formatDate(iso)}`;
}
function dateIsoToInput(d) {
  if (!d) return "";
  const match = String(d).slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : String(d);
}
function dateInputToIso(d) {
  if (!d) return "";
  const raw = String(d).trim();
  let match = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const day = match[1].padStart(2, "0");
    const month = match[2].padStart(2, "0");
    return `${match[3]}-${month}-${day}`;
  }
  match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? raw : "";
}
function stadioLabel(s) {
  var _a2;
  return (_a2 = ["Mai fatto", "In lavorazione", "Raffinamento", "Completato"][s]) != null ? _a2 : s;
}
function tipoLabel(t) {
  var _a2;
  return (_a2 = { individuale: "Individuale", gruppo: "Gruppo", campo_libero: "Campo libero" }[t]) != null ? _a2 : t;
}
function normalizeText(value) {
  return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}
function isFakieSkillName(name) {
  return /\bfakie\b/i.test(String(name || ""));
}
function visibleCatalogSkills(rows = []) {
  return (rows || []).filter((row) => !isFakieSkillName((row == null ? void 0 : row.nome) || (row == null ? void 0 : row.skill_nome)));
}
function editIcon() {
  return '<svg class="edit-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
function esc(s) {
  if (!s) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
document.getElementById("login-email").addEventListener("keydown", (e) => {
  if (e.key === "Enter") loginSubmit(e);
});
document.getElementById("login-pw").addEventListener("keydown", (e) => {
  if (e.key === "Enter") loginSubmit(e);
});

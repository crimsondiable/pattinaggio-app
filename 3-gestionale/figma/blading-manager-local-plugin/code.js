// Local Figma plugin bootstrap for Blading Manager.
// Import manifest.json in Figma, then run the plugin inside the target file.

const RUN_ID = "blading-manager-ds-local-v1";
const NS = "bm_ds";

function hexToColor(hex, a = 1) {
  const raw = hex.replace("#", "");
  return {
    r: parseInt(raw.slice(0, 2), 16) / 255,
    g: parseInt(raw.slice(2, 4), 16) / 255,
    b: parseInt(raw.slice(4, 6), 16) / 255,
    a,
  };
}

function rgba(r, g, b, a) {
  return { r: r / 255, g: g / 255, b: b / 255, a };
}

function solid(color) {
  return [{ type: "SOLID", color: { r: color.r, g: color.g, b: color.b }, opacity: color.a }];
}

function stroke(color, weight = 1) {
  return { strokes: solid(color), strokeWeight: weight };
}

function cssName(tokenName) {
  return `--bm-${tokenName.replace(/\./g, "-")}`;
}

function figmaVariableName(tokenName) {
  return tokenName.replace(/\./g, "/");
}

function mark(node) {
  node.setSharedPluginData(NS, "managed", RUN_ID);
  return node;
}

function ensurePage(name) {
  let page = figma.root.children.find((candidate) => candidate.name === name);
  if (!page) {
    page = figma.createPage();
    page.name = name;
  }
  return page;
}

function clearManaged(page) {
  const children = page.children.slice();
  for (const child of children) {
    if (child.getSharedPluginData(NS, "managed") === RUN_ID) child.remove();
  }
}

async function ensureCollection(name) {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  let collection = collections.find((candidate) => candidate.name === name);
  if (!collection) collection = figma.variables.createVariableCollection(name);
  return collection;
}

async function ensureVariable(collection, name, resolvedType, value, scopes) {
  const variables = await figma.variables.getLocalVariablesAsync(resolvedType);
  const variableName = figmaVariableName(name);
  let variable = variables.find(
    (candidate) => candidate.name === variableName && candidate.variableCollectionId === collection.id
  );
  if (!variable) variable = figma.variables.createVariable(variableName, collection, resolvedType);
  variable.scopes = scopes;
  variable.setValueForMode(collection.defaultModeId, value);
  if (typeof variable.setVariableCodeSyntax === "function") {
    variable.setVariableCodeSyntax("WEB", `var(${cssName(name)})`);
  }
  return variable;
}

async function ensureEffectStyle(name, effects) {
  const styles = await figma.getLocalEffectStylesAsync();
  let style = styles.find((candidate) => candidate.name === name);
  if (!style) {
    style = figma.createEffectStyle();
    style.name = name;
  }
  style.effects = effects;
  return style;
}

async function chooseFonts() {
  const availableFonts = await figma.listAvailableFontsAsync();
  const hasInter = availableFonts.some((font) => font.fontName.family === "Inter");
  const family = hasInter ? "Inter" : "Arial";
  const regular = { family, style: "Regular" };
  const bold = { family, style: "Bold" };
  await figma.loadFontAsync(regular);
  await figma.loadFontAsync(bold);
  return { family, regular, bold };
}

async function ensureTextStyles(fonts) {
  const styles = [
    ["type.caption", 12, fonts.bold, 16],
    ["type.body-sm", 13, fonts.regular, 18],
    ["type.body", 14, fonts.regular, 20],
    ["type.section", 17, fonts.bold, 22],
    ["type.title", 23, fonts.bold, 28],
  ];
  const touched = [];
  for (const [name, size, fontName, lineHeight] of styles) {
    const localTextStyles = await figma.getLocalTextStylesAsync();
    let style = localTextStyles.find((candidate) => candidate.name === name);
    if (!style) {
      style = figma.createTextStyle();
      style.name = name;
    }
    style.fontName = fontName;
    style.fontSize = size;
    style.lineHeight = { unit: "PIXELS", value: lineHeight };
    style.letterSpacing = { unit: "PERCENT", value: 0 };
    touched.push(style.id);
  }
  return touched;
}

function autoFrame(name, direction, props = {}) {
  const frame = mark(figma.createFrame());
  frame.name = name;
  frame.layoutMode = direction;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.itemSpacing = props.gap == null ? 8 : props.gap;
  frame.paddingTop = props.paddingY == null ? 0 : props.paddingY;
  frame.paddingBottom = props.paddingY == null ? 0 : props.paddingY;
  frame.paddingLeft = props.paddingX == null ? 0 : props.paddingX;
  frame.paddingRight = props.paddingX == null ? 0 : props.paddingX;
  frame.counterAxisAlignItems = props.align == null ? "CENTER" : props.align;
  frame.primaryAxisAlignItems = props.justify == null ? "MIN" : props.justify;
  frame.fills = props.fills == null ? [] : props.fills;
  frame.strokes = props.strokes == null ? [] : props.strokes;
  frame.strokeWeight = props.strokeWeight == null ? 1 : props.strokeWeight;
  frame.cornerRadius = props.radius == null ? 0 : props.radius;
  if (props.effects) frame.effects = props.effects;
  return frame;
}

function makeText(text, fontName, size, color, name = "Text") {
  const node = figma.createText();
  node.name = name;
  node.fontName = fontName;
  node.fontSize = size;
  node.lineHeight = { unit: "PIXELS", value: Math.round(size * 1.38) };
  node.letterSpacing = { unit: "PERCENT", value: 0 };
  node.fills = solid(color);
  node.characters = text;
  node.textAutoResize = "WIDTH_AND_HEIGHT";
  return node;
}

function makeDot(name, size, filled, colors, color = colors.accentCyan) {
  const dot = figma.createEllipse();
  dot.name = name;
  dot.resize(size, size);
  dot.fills = filled ? solid(color) : [];
  dot.strokes = solid(filled ? color : colors.borderDefault);
  dot.strokeWeight = 2;
  return dot;
}

function makeLearningDotsComponent(name, value, max, size, colors) {
  const component = mark(figma.createComponent());
  component.name = name;
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.itemSpacing = size === 14 ? 6 : 4;
  component.fills = [];
  for (let i = 1; i <= max; i += 1) {
    component.appendChild(makeDot(`Dot / ${i}${i <= value ? " / filled" : ""}`, size, i <= value, colors));
  }
  return component;
}

function pipEffects(stage, colors) {
  if (stage === 3) {
    return [
      { type: "DROP_SHADOW", visible: true, color: colors.pip, offset: { x: 0, y: 0 }, radius: 5, spread: 0, blendMode: "NORMAL" },
      { type: "DROP_SHADOW", visible: true, color: colors.pip, offset: { x: 0, y: 0 }, radius: 2, spread: 0, blendMode: "NORMAL" },
    ];
  }
  if (stage === 4) {
    return [
      { type: "DROP_SHADOW", visible: true, color: rgba(255, 255, 255, 0.65), offset: { x: 0, y: 0 }, radius: 2, spread: 0, blendMode: "NORMAL" },
      { type: "DROP_SHADOW", visible: true, color: colors.pip, offset: { x: 0, y: 0 }, radius: 8, spread: 0, blendMode: "NORMAL" },
      { type: "DROP_SHADOW", visible: true, color: colors.pip, offset: { x: 0, y: 0 }, radius: 18, spread: 0, blendMode: "NORMAL" },
      { type: "INNER_SHADOW", visible: true, color: rgba(255, 255, 255, 0.38), offset: { x: 0, y: 0 }, radius: 4, spread: 0, blendMode: "NORMAL" },
    ];
  }
  if (stage === 5) {
    return [
      { type: "DROP_SHADOW", visible: true, color: rgba(255, 255, 255, 0.85), offset: { x: 0, y: 0 }, radius: 3, spread: 0, blendMode: "NORMAL" },
      { type: "DROP_SHADOW", visible: true, color: colors.pip, offset: { x: 0, y: 0 }, radius: 10, spread: 0, blendMode: "NORMAL" },
      { type: "DROP_SHADOW", visible: true, color: colors.pip, offset: { x: 0, y: 0 }, radius: 22, spread: 0, blendMode: "NORMAL" },
      { type: "DROP_SHADOW", visible: true, color: rgba(255, 255, 255, 0.7), offset: { x: 0, y: 0 }, radius: 5, spread: 0, blendMode: "NORMAL" },
    ];
  }
  return [];
}

function makePip(name, fillStage, colors) {
  const pip = figma.createRectangle();
  pip.name = name;
  pip.resize(8, 8);
  pip.cornerRadius = 3;
  pip.strokeWeight = fillStage === 1 ? 1.5 : 1;
  if (fillStage === 0) {
    pip.fills = [];
    pip.strokes = solid(rgba(255, 255, 255, 0.12));
  } else if (fillStage === 1) {
    pip.fills = [];
    pip.strokes = solid(colors.pip);
  } else if (fillStage === 5) {
    pip.fills = [
      {
        type: "GRADIENT_RADIAL",
        gradientTransform: [[1, 0, 0], [0, 1, 0]],
        gradientStops: [
          { position: 0, color: rgba(255, 255, 255, 0.92) },
          { position: 0.52, color: colors.pip },
          { position: 1, color: colors.pip },
        ],
      },
    ];
    pip.strokes = solid(rgba(255, 255, 255, 0.98));
  } else {
    pip.fills = solid(colors.pip);
    pip.strokes = solid(fillStage === 4 ? rgba(255, 255, 255, 0.82) : colors.pip);
  }
  pip.effects = pipEffects(fillStage, colors);
  return pip;
}

function makePipRow(name, stage, colors, fonts) {
  const row = autoFrame(name, "HORIZONTAL", {
    gap: 4,
    paddingX: 5,
    paddingY: 3,
    radius: 5,
    fills: stage > 0 ? solid(rgba(14, 165, 233, 0.1)) : [],
    strokes: stage > 0 ? solid(rgba(56, 189, 248, 0.45)) : [],
  });
  row.appendChild(makeText(name.toUpperCase(), fonts.bold, 8, stage > 0 ? colors.agText : colors.agMuted, "Side label"));
  const pips = autoFrame("Pips", "HORIZONTAL", { gap: 3 });
  for (let i = 1; i <= 5; i += 1) {
    pips.appendChild(makePip(`pip ${i}${stage >= i ? ` / f${i}` : ""}`, stage >= i ? i : 0, colors));
  }
  row.appendChild(pips);
  return row;
}

function makeSkatingTricksPipComponent(colors, fonts) {
  const component = mark(figma.createComponent());
  component.name = "Progress / Skating Tricks Pips";
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.itemSpacing = 8;
  component.paddingLeft = 12;
  component.paddingRight = 12;
  component.paddingTop = 10;
  component.paddingBottom = 10;
  component.cornerRadius = 8;
  component.fills = solid(colors.agPanel);
  component.strokes = solid(colors.agBorder);
  component.appendChild(makePipRow("nat", 5, colors, fonts));
  component.appendChild(makePipRow("sw", 3, colors, fonts));
  return component;
}

function trickCardEffects(level, colors) {
  const base = [
    { type: "DROP_SHADOW", visible: true, color: rgba(0, 0, 0, 0.28), offset: { x: 0, y: 14 }, radius: 38, spread: 0, blendMode: "NORMAL" },
    { type: "INNER_SHADOW", visible: true, color: rgba(255, 255, 255, 0.09), offset: { x: 0, y: 1 }, radius: 0, spread: 0, blendMode: "NORMAL" },
  ];
  if (level === "lv4") {
    return [
      { type: "DROP_SHADOW", visible: true, color: rgba(255, 255, 255, 0.14), offset: { x: 0, y: 0 }, radius: 8, spread: 0, blendMode: "NORMAL" },
      { type: "DROP_SHADOW", visible: true, color: rgba(93, 181, 239, 0.18), offset: { x: 0, y: 0 }, radius: 6, spread: 0, blendMode: "NORMAL" },
    ].concat(base);
  }
  if (level === "lv5") {
    return [
      { type: "DROP_SHADOW", visible: true, color: rgba(255, 255, 255, 0.28), offset: { x: 0, y: 0 }, radius: 12, spread: 0, blendMode: "NORMAL" },
      { type: "DROP_SHADOW", visible: true, color: rgba(93, 181, 239, 0.3), offset: { x: 0, y: 0 }, radius: 10, spread: 0, blendMode: "NORMAL" },
    ].concat(base);
  }
  if (level === "one-solid") {
    return [
      { type: "DROP_SHADOW", visible: true, color: rgba(93, 181, 239, 0.55), offset: { x: 0, y: 0 }, radius: 18, spread: 0, blendMode: "NORMAL" },
      { type: "DROP_SHADOW", visible: true, color: rgba(93, 181, 239, 0.35), offset: { x: 0, y: 0 }, radius: 8, spread: 0, blendMode: "NORMAL" },
    ].concat(base);
  }
  if (level === "both-solid") {
    return [
      { type: "DROP_SHADOW", visible: true, color: rgba(93, 181, 239, 0.72), offset: { x: 0, y: 0 }, radius: 26, spread: 0, blendMode: "NORMAL" },
      { type: "DROP_SHADOW", visible: true, color: rgba(93, 181, 239, 0.5), offset: { x: 0, y: 0 }, radius: 12, spread: 0, blendMode: "NORMAL" },
      { type: "DROP_SHADOW", visible: true, color: rgba(93, 181, 239, 0.25), offset: { x: 0, y: 0 }, radius: 48, spread: 0, blendMode: "NORMAL" },
    ].concat(base);
  }
  return base;
}

function makeDiffTag(level, colors, fonts) {
  const styles = {
    beginner: { label: "BASE", bg: rgba(34, 197, 94, 0.14), color: hexToColor("#4ade80"), border: rgba(34, 197, 94, 0.25) },
    intermediate: { label: "MEDIO", bg: rgba(245, 158, 11, 0.13), color: hexToColor("#fbbf24"), border: rgba(245, 158, 11, 0.25) },
    advanced: { label: "ADV", bg: rgba(239, 68, 68, 0.13), color: hexToColor("#f87171"), border: rgba(239, 68, 68, 0.25) },
    expert: { label: "EXPERT", bg: rgba(168, 85, 247, 0.16), color: hexToColor("#c084fc"), border: rgba(168, 85, 247, 0.3) },
  };
  const style = styles[level] || styles.intermediate;
  const tag = autoFrame(`Diff / ${level}`, "HORIZONTAL", {
    gap: 0,
    paddingX: 7,
    paddingY: 2,
    radius: 3,
    fills: solid(style.bg),
    strokes: solid(style.border),
  });
  tag.appendChild(makeText(style.label, fonts.bold, 9, style.color, "Label"));
  return tag;
}

function makeSkatingTrickCard(name, diff, natStage, swStage, fav, level, colors, fonts) {
  const card = mark(figma.createComponent());
  card.name = `Card / Skating Trick / ${level}`;
  card.layoutMode = "VERTICAL";
  card.primaryAxisSizingMode = "FIXED";
  card.counterAxisSizingMode = "AUTO";
  card.resize(420, 10);
  card.itemSpacing = 7;
  card.paddingLeft = 10;
  card.paddingRight = 10;
  card.paddingTop = 7;
  card.paddingBottom = 7;
  card.cornerRadius = 8;
  card.fills = solid(colors.agPanel);
  card.strokes = solid(level === "both-solid" ? hexToColor("#7ecef5") : level === "lv4" || level === "lv5" || level === "one-solid" ? hexToColor("#5db5ef") : colors.agBorder);
  card.effects = trickCardEffects(level, colors);

  const row = autoFrame("Card top", "HORIZONTAL", { gap: 8 });
  row.primaryAxisSizingMode = "FIXED";
  row.resize(400, 10);
  const title = makeText(name, fonts.bold, 14, colors.agText, "Trick name");
  row.appendChild(title);
  title.layoutGrow = 1;
  const tracks = autoFrame("Tracks", "HORIZONTAL", { gap: 8 });
  tracks.appendChild(makePipRow("nat", natStage, colors, fonts));
  tracks.appendChild(makePipRow("sw", swStage, colors, fonts));
  row.appendChild(tracks);
  row.appendChild(makeText(fav ? "★" : "☆", fonts.bold, 15, fav ? hexToColor("#f59e0b") : colors.agMuted, "Favorite"));
  card.appendChild(row);

  const bottom = autoFrame("Card bottom", "HORIZONTAL", { gap: 8 });
  bottom.appendChild(makeDiffTag(diff, colors, fonts));
  bottom.appendChild(makeText("rail / coping / switch practice", fonts.regular, 10, colors.agMuted, "Meta"));
  card.appendChild(bottom);
  return card;
}

function makeSkatingTricksScreen(colors, fonts) {
  const screen = mark(autoFrame("Layout / Skating Tricks mobile", "VERTICAL", {
    gap: 8,
    paddingX: 14,
    paddingY: 12,
    radius: 12,
    fills: solid(hexToColor("#080e14")),
    strokes: solid(colors.agBorder),
  }));
  screen.resize(430, 760);
  screen.counterAxisSizingMode = "FIXED";

  const header = autoFrame("Header", "VERTICAL", { gap: 7 });
  header.primaryAxisSizingMode = "FIXED";
  header.resize(402, 10);
  const top = autoFrame("Header top", "HORIZONTAL", { gap: 8 });
  top.primaryAxisSizingMode = "FIXED";
  top.resize(402, 10);
  const logo = autoFrame("Logo", "HORIZONTAL", { gap: 8 });
  const icon = figma.createRectangle();
  icon.name = "Logo icon";
  icon.resize(30, 30);
  icon.cornerRadius = 8;
  icon.fills = solid(colors.pip);
  icon.effects = [{ type: "DROP_SHADOW", visible: true, color: rgba(14, 165, 233, 0.45), offset: { x: 0, y: 0 }, radius: 14, spread: 0, blendMode: "NORMAL" }];
  logo.appendChild(icon);
  logo.appendChild(makeText("Aggressive Tricks", fonts.bold, 16, colors.agText, "Title"));
  top.appendChild(logo);
  logo.layoutGrow = 1;
  top.appendChild(makeDiffTag("intermediate", colors, fonts));
  header.appendChild(top);

  const chips = autoFrame("Chips", "HORIZONTAL", { gap: 5 });
  const chipLabels = ["Tutti", "Preferiti", "Chiudilo", "Consolida"];
  for (let i = 0; i < chipLabels.length; i += 1) {
    const chip = autoFrame(`Chip / ${chipLabels[i]}`, "HORIZONTAL", {
      gap: 0,
      paddingX: 11,
      paddingY: 4,
      radius: 20,
      fills: solid(i === 0 ? colors.pip : colors.agPanel),
      strokes: solid(i === 0 ? rgba(56, 189, 248, 0.45) : colors.agBorder),
    });
    chip.appendChild(makeText(chipLabels[i], fonts.bold, 11, i === 0 ? hexToColor("#ffffff") : colors.agMuted, "Label"));
    chips.appendChild(chip);
  }
  header.appendChild(chips);
  screen.appendChild(header);

  const list = autoFrame("Trick list", "VERTICAL", { gap: 5 });
  list.primaryAxisSizingMode = "FIXED";
  list.resize(402, 10);
  list.appendChild(makeSkatingTrickCard("Soul stall", "beginner", 5, 3, true, "one-solid", colors, fonts));
  list.appendChild(makeSkatingTrickCard("Mizou", "intermediate", 4, 2, false, "lv5", colors, fonts));
  list.appendChild(makeSkatingTrickCard("Royale", "advanced", 3, 1, false, "lv4", colors, fonts));
  list.appendChild(makeSkatingTrickCard("Unity", "expert", 5, 5, true, "both-solid", colors, fonts));
  screen.appendChild(list);
  return screen;
}

function makeStageBadgeComponent(stage, colors, fonts) {
  const labels = ["Non avviata", "In lavoro", "Acquisita", "Consolidata"];
  const stageColors = [colors.stage0, colors.stage1, colors.stage2, colors.stage3];
  const stageFill = {
    r: stageColors[stage].r,
    g: stageColors[stage].g,
    b: stageColors[stage].b,
    a: 0.14,
  };
  const badge = mark(figma.createComponent());
  badge.name = `Badge / Stage ${stage}`;
  badge.layoutMode = "HORIZONTAL";
  badge.primaryAxisSizingMode = "AUTO";
  badge.counterAxisSizingMode = "AUTO";
  badge.paddingLeft = 10;
  badge.paddingRight = 10;
  badge.paddingTop = 4;
  badge.paddingBottom = 4;
  badge.cornerRadius = 20;
  badge.itemSpacing = 6;
  badge.fills = solid(stageFill);
  const text = makeText(labels[stage], fonts.bold, 12, stageColors[stage], "Label");
  badge.appendChild(text);
  return badge;
}

function makeTrickCardComponent(colors, fonts) {
  const card = mark(figma.createComponent());
  card.name = "Card / Aggressive Trick";
  card.layoutMode = "VERTICAL";
  card.primaryAxisSizingMode = "FIXED";
  card.counterAxisSizingMode = "AUTO";
  card.resize(260, 10);
  card.itemSpacing = 8;
  card.paddingLeft = 14;
  card.paddingRight = 14;
  card.paddingTop = 14;
  card.paddingBottom = 14;
  card.cornerRadius = 8;
  card.fills = solid(colors.surfacePanelSoft);
  card.strokes = solid(colors.borderDefault);
  card.strokeWeight = 1;

  const title = makeText("Soul stall", fonts.bold, 16, colors.textPrimary, "Trick name");
  const meta = makeText("stall - Base - Frontside stall, soul plate", fonts.regular, 12, colors.textMuted, "Family / Level / Prereq");
  const note = makeText(
    "Entrata controllata sul coping con peso morbido e uscita in fakie o avanti.",
    fonts.regular,
    13,
    colors.textPrimary,
    "Coaching note"
  );
  note.resize(232, note.height);
  note.textAutoResize = "HEIGHT";
  card.appendChild(title);
  card.appendChild(meta);
  card.appendChild(note);
  return card;
}

function makeLearningProgressPanel(colors, fonts) {
  const panel = mark(autoFrame("Pattern / Learning progress panel", "VERTICAL", {
    gap: 10,
    paddingX: 14,
    paddingY: 14,
    radius: 8,
    fills: solid(colors.surfaceBase),
    strokes: solid(colors.borderDefault),
  }));
  panel.resize(360, panel.height);
  panel.primaryAxisSizingMode = "AUTO";
  panel.counterAxisSizingMode = "FIXED";

  panel.appendChild(makeText("Progresso apprendimento", fonts.bold, 17, colors.textPrimary, "Title"));
  const rows = [
    ["Velocita di apprendimento", 3],
    ["Visivo", 2],
    ["Teorico", 1],
    ["Pratico", 3],
  ];
  for (const [label, value] of rows) {
    const row = autoFrame(`Row / ${label}`, "HORIZONTAL", {
      gap: 16,
      paddingX: 11,
      paddingY: 9,
      radius: 8,
      fills: solid(colors.surfacePanelSoft),
    });
    row.primaryAxisSizingMode = "FIXED";
    row.counterAxisSizingMode = "AUTO";
    row.resize(332, 10);
    const text = makeText(label, fonts.regular, 13, colors.textPrimary, "Label");
    row.appendChild(text);
    text.layoutGrow = 1;
    const dots = autoFrame(`Dots / ${value}`, "HORIZONTAL", { gap: 6 });
    for (let i = 1; i <= 3; i += 1) dots.appendChild(makeDot(`Dot ${i}`, 14, i <= value, colors));
    row.appendChild(dots);
    panel.appendChild(row);
  }
  return panel;
}

function makeSectionTitle(page, title, subtitle, x, y, colors, fonts) {
  const frame = mark(autoFrame(`Section / ${title}`, "VERTICAL", { gap: 6 }));
  frame.x = x;
  frame.y = y;
  frame.appendChild(makeText(title, fonts.bold, 23, colors.textPrimary, "Title"));
  frame.appendChild(makeText(subtitle, fonts.regular, 13, colors.textMuted, "Subtitle"));
  page.appendChild(frame);
  return frame;
}

async function main() {
  if (typeof figma.loadAllPagesAsync === "function") {
    await figma.loadAllPagesAsync();
  }

  const colors = {
    accentCyan: hexToColor("#6ee7f9"),
    accentCyanStrong: hexToColor("#22b8cf"),
    accentCyanSoft: rgba(110, 231, 249, 0.13),
    textPrimary: hexToColor("#eef7fb"),
    textMuted: hexToColor("#8fa4ad"),
    borderDefault: rgba(148, 163, 184, 0.22),
    backgroundPage: hexToColor("#081116"),
    surfaceBase: hexToColor("#101b22"),
    surfacePanel: hexToColor("#13242c"),
    surfacePanelSoft: hexToColor("#0d1920"),
    danger: hexToColor("#fb7185"),
    success: hexToColor("#7dd3a8"),
    stage0: hexToColor("#94a3b8"),
    stage1: hexToColor("#facc15"),
    stage2: hexToColor("#67e8f9"),
    stage3: hexToColor("#86efac"),
    pip: hexToColor("#0ea5e9"),
    agText: hexToColor("#e2f4ff"),
    agMuted: rgba(190, 242, 255, 0.38),
    agBorder: rgba(190, 242, 255, 0.24),
    agPanel: rgba(16, 27, 34, 0.62),
  };

  const pages = {};
  const pageNames = ["Cover", "Getting Started", "Foundations", "---", "Components", "Patterns", "Layouts", "Utilities"];
  for (let i = 0; i < pageNames.length; i += 1) {
    pages[pageNames[i]] = ensurePage(pageNames[i]);
  }
  await figma.setCurrentPageAsync(pages.Components);

  const colorCollection = await ensureCollection("BM / Colors");
  const radiusCollection = await ensureCollection("BM / Radius");
  const spacingCollection = await ensureCollection("BM / Spacing");

  const colorTokens = [
    ["color.accent.cyan", colors.accentCyan, ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL", "STROKE_COLOR"]],
    ["color.accent.cyan-strong", colors.accentCyanStrong, ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL", "STROKE_COLOR"]],
    ["color.accent.cyan-soft", colors.accentCyanSoft, ["FRAME_FILL", "SHAPE_FILL"]],
    ["color.text.primary", colors.textPrimary, ["TEXT_FILL"]],
    ["color.text.muted", colors.textMuted, ["TEXT_FILL"]],
    ["color.border.default", colors.borderDefault, ["STROKE_COLOR"]],
    ["color.background.page", colors.backgroundPage, ["FRAME_FILL"]],
    ["color.surface.base", colors.surfaceBase, ["FRAME_FILL", "SHAPE_FILL"]],
    ["color.surface.panel", colors.surfacePanel, ["FRAME_FILL", "SHAPE_FILL"]],
    ["color.surface.panel-soft", colors.surfacePanelSoft, ["FRAME_FILL", "SHAPE_FILL"]],
    ["color.status.danger", colors.danger, ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL", "STROKE_COLOR"]],
    ["color.status.success", colors.success, ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL", "STROKE_COLOR"]],
    ["color.stage.0", colors.stage0, ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"]],
    ["color.stage.1", colors.stage1, ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"]],
    ["color.stage.2", colors.stage2, ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"]],
    ["color.stage.3", colors.stage3, ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"]],
  ];
  const radiusTokens = [["radius.sm", 4], ["radius.md", 8], ["radius.lg", 12], ["radius.pill", 20]];
  const spacingTokens = [["space.1", 4], ["space.2", 6], ["space.3", 8], ["space.4", 10], ["space.5", 12], ["space.6", 16], ["space.7", 18], ["space.8", 24], ["space.9", 28], ["space.10", 40]];

  for (const [name, value, scopes] of colorTokens) await ensureVariable(colorCollection, name, "COLOR", value, scopes);
  for (const [name, value] of radiusTokens) await ensureVariable(radiusCollection, name, "FLOAT", value, ["CORNER_RADIUS"]);
  for (const [name, value] of spacingTokens) await ensureVariable(spacingCollection, name, "FLOAT", value, ["GAP"]);

  await ensureEffectStyle("shadow.card", [{ type: "DROP_SHADOW", visible: true, color: rgba(0, 0, 0, 0.28), offset: { x: 0, y: 18 }, radius: 44, spread: 0, blendMode: "NORMAL" }]);
  await ensureEffectStyle("shadow.modal", [{ type: "DROP_SHADOW", visible: true, color: rgba(0, 0, 0, 0.45), offset: { x: 0, y: 24 }, radius: 80, spread: 0, blendMode: "NORMAL" }]);

  const fonts = await chooseFonts();
  await ensureTextStyles(fonts);

  clearManaged(pages.Cover);
  clearManaged(pages.Foundations);
  clearManaged(pages.Components);
  clearManaged(pages.Patterns);
  clearManaged(pages.Layouts);

  const cover = mark(autoFrame("Blading Manager Design System", "VERTICAL", {
    gap: 14,
    paddingX: 40,
    paddingY: 40,
    radius: 8,
    fills: solid(colors.backgroundPage),
    strokes: solid(colors.borderDefault),
  }));
  cover.x = 120;
  cover.y = 120;
  cover.resize(680, 260);
  cover.counterAxisSizingMode = "FIXED";
  cover.appendChild(makeText("Blading Manager", fonts.bold, 42, colors.textPrimary, "Title"));
  cover.appendChild(makeText("Design system bootstrap locale per Figma: fondazioni, pallini di apprendimento e componenti Aggressive Tricks.", fonts.regular, 16, colors.textMuted, "Subtitle"));
  pages.Cover.appendChild(cover);

  makeSectionTitle(pages.Foundations, "Fondazioni", "Token colore, radius, spacing, ombre e tipografia creati come variabili/stili locali.", 120, 120, colors, fonts);

  makeSectionTitle(pages.Components, "Componenti", "Componenti base derivati dal gestionale e dalla sezione Aggressive tricks.", 120, 120, colors, fonts);
  const componentWrap = mark(autoFrame("Component samples", "VERTICAL", { gap: 24 }));
  componentWrap.x = 120;
  componentWrap.y = 220;
  pages.Components.appendChild(componentWrap);

  const pipRow = autoFrame("Skating Tricks pips", "HORIZONTAL", { gap: 24, align: "CENTER" });
  pipRow.appendChild(makeSkatingTricksPipComponent(colors, fonts));
  componentWrap.appendChild(pipRow);

  const trickCardRow = autoFrame("Skating Tricks cards", "VERTICAL", { gap: 10, align: "MIN" });
  trickCardRow.appendChild(makeSkatingTrickCard("Soul stall", "beginner", 5, 3, true, "one-solid", colors, fonts));
  trickCardRow.appendChild(makeSkatingTrickCard("Unity", "expert", 5, 5, true, "both-solid", colors, fonts));
  componentWrap.appendChild(trickCardRow);

  const badges = autoFrame("Stage badges", "HORIZONTAL", { gap: 10, align: "CENTER" });
  for (let stage = 0; stage <= 3; stage += 1) badges.appendChild(makeStageBadgeComponent(stage, colors, fonts));
  componentWrap.appendChild(badges);
  componentWrap.appendChild(makeTrickCardComponent(colors, fonts));

  makeSectionTitle(pages.Patterns, "Pattern", "Track progresso NAT/SW copiato da skating-tricks/index.html.", 120, 120, colors, fonts);
  const pipPattern = makeSkatingTricksPipComponent(colors, fonts);
  pipPattern.name = "Pattern / Skating Tricks NAT SW progress";
  pipPattern.x = 120;
  pipPattern.y = 220;
  pages.Patterns.appendChild(pipPattern);

  makeSectionTitle(pages.Layouts, "Layouts", "Mockup mobile della UI skating-tricks con card, chip e progressi NAT/SW.", 120, 120, colors, fonts);
  const skatingScreen = makeSkatingTricksScreen(colors, fonts);
  skatingScreen.x = 120;
  skatingScreen.y = 220;
  pages.Layouts.appendChild(skatingScreen);

  figma.viewport.scrollAndZoomIntoView([cover]);
  figma.notify("Blading Manager design system creato/aggiornato.");
  figma.closePlugin("Design system bootstrap completato.");
}

main().catch((error) => {
  figma.closePlugin(`Errore bootstrap: ${error.message}`);
});

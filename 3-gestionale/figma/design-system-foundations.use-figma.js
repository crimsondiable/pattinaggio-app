// Blading Manager design-system bootstrap for Figma MCP `use_figma`.
// Target file: https://www.figma.com/design/y6Qxjpln7ts4YLyZEOgppX
//
// This script is intentionally idempotent: it creates missing pages, variables,
// effect styles, and text styles, and leaves existing matching objects in place.
// Paste the whole file as the `code` argument of the Figma `use_figma` tool.

const RUN_ID = "blading-manager-ds-v1";
const NS = "blading_manager_ds";

function hexToColor(hex) {
  const raw = hex.replace("#", "");
  return {
    r: parseInt(raw.slice(0, 2), 16) / 255,
    g: parseInt(raw.slice(2, 4), 16) / 255,
    b: parseInt(raw.slice(4, 6), 16) / 255,
    a: 1,
  };
}

function rgbaToColor(r, g, b, a) {
  return { r: r / 255, g: g / 255, b: b / 255, a };
}

function cssName(tokenName) {
  return `--bm-${tokenName.replace(/\./g, "-")}`;
}

function ensurePage(name) {
  let page = figma.root.children.find((candidate) => candidate.name === name);
  if (!page) {
    page = figma.createPage();
    page.name = name;
    page.setSharedPluginData(NS, "run_id", RUN_ID);
  }
  return page;
}

async function ensureCollection(name) {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  let collection = collections.find((candidate) => candidate.name === name);
  if (!collection) {
    collection = figma.variables.createVariableCollection(name);
  }
  return collection;
}

async function ensureVariable(collection, name, resolvedType, value, scopes) {
  const variables = await figma.variables.getLocalVariablesAsync(resolvedType);
  let variable = variables.find(
    (candidate) =>
      candidate.name === name &&
      candidate.variableCollectionId === collection.id
  );

  if (!variable) {
    variable = figma.variables.createVariable(name, collection, resolvedType);
  }

  variable.scopes = scopes;
  variable.setValueForMode(collection.defaultModeId, value);

  if (typeof variable.setVariableCodeSyntax === "function") {
    variable.setVariableCodeSyntax("WEB", `var(${cssName(name)})`);
  }

  return variable;
}

function ensureEffectStyle(name, effects) {
  let style = figma.getLocalEffectStyles().find((candidate) => candidate.name === name);
  if (!style) {
    style = figma.createEffectStyle();
    style.name = name;
  }
  style.effects = effects;
  return style;
}

function ensureTextStyle(name, fontSize, fontWeight, lineHeightPx) {
  let style = figma.getLocalTextStyles().find((candidate) => candidate.name === name);
  if (!style) {
    style = figma.createTextStyle();
    style.name = name;
  }
  style.fontName = { family: "Inter", style: fontWeight };
  style.fontSize = fontSize;
  style.lineHeight = { unit: "PIXELS", value: lineHeightPx };
  style.letterSpacing = { unit: "PERCENT", value: 0 };
  if (typeof style.setStyleCodeSyntax === "function") {
    style.setStyleCodeSyntax("WEB", `var(${cssName(name)})`);
  }
  return style;
}

const pageNames = [
  "Cover",
  "Getting Started",
  "Foundations",
  "---",
  "Components",
  "Patterns",
  "Layouts",
  "Utilities",
];
const pages = pageNames.map(ensurePage);

const colorCollection = await ensureCollection("BM / Colors");
const radiusCollection = await ensureCollection("BM / Radius");
const spacingCollection = await ensureCollection("BM / Spacing");

const colorTokens = [
  ["color.accent.cyan", hexToColor("#6ee7f9"), ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL", "STROKE_COLOR"]],
  ["color.accent.cyan-strong", hexToColor("#22b8cf"), ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL", "STROKE_COLOR"]],
  ["color.accent.cyan-soft", rgbaToColor(110, 231, 249, 0.13), ["FRAME_FILL", "SHAPE_FILL"]],
  ["color.text.primary", hexToColor("#eef7fb"), ["TEXT_FILL"]],
  ["color.text.muted", hexToColor("#8fa4ad"), ["TEXT_FILL"]],
  ["color.border.default", rgbaToColor(148, 163, 184, 0.22), ["STROKE_COLOR"]],
  ["color.background.page", hexToColor("#081116"), ["FRAME_FILL"]],
  ["color.surface.base", hexToColor("#101b22"), ["FRAME_FILL", "SHAPE_FILL"]],
  ["color.surface.panel", hexToColor("#13242c"), ["FRAME_FILL", "SHAPE_FILL"]],
  ["color.surface.panel-soft", hexToColor("#0d1920"), ["FRAME_FILL", "SHAPE_FILL"]],
  ["color.status.danger", hexToColor("#fb7185"), ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL", "STROKE_COLOR"]],
  ["color.status.success", hexToColor("#7dd3a8"), ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL", "STROKE_COLOR"]],
  ["color.stage.0", hexToColor("#94a3b8"), ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"]],
  ["color.stage.1", hexToColor("#facc15"), ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"]],
  ["color.stage.2", hexToColor("#67e8f9"), ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"]],
  ["color.stage.3", hexToColor("#86efac"), ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"]],
];

const radiusTokens = [
  ["radius.sm", 4],
  ["radius.md", 8],
  ["radius.lg", 12],
  ["radius.pill", 20],
];

const spacingTokens = [
  ["space.1", 4],
  ["space.2", 6],
  ["space.3", 8],
  ["space.4", 10],
  ["space.5", 12],
  ["space.6", 16],
  ["space.7", 18],
  ["space.8", 24],
  ["space.9", 28],
  ["space.10", 40],
];

const createdOrUpdated = {
  pages: pages.map((page) => ({ id: page.id, name: page.name })),
  variables: [],
  textStyles: [],
  effectStyles: [],
};

for (const [name, value, scopes] of colorTokens) {
  const variable = await ensureVariable(colorCollection, name, "COLOR", value, scopes);
  createdOrUpdated.variables.push({ id: variable.id, name, collection: colorCollection.name });
}

for (const [name, value] of radiusTokens) {
  const variable = await ensureVariable(radiusCollection, name, "FLOAT", value, ["CORNER_RADIUS"]);
  createdOrUpdated.variables.push({ id: variable.id, name, collection: radiusCollection.name });
}

for (const [name, value] of spacingTokens) {
  const variable = await ensureVariable(spacingCollection, name, "FLOAT", value, ["GAP"]);
  createdOrUpdated.variables.push({ id: variable.id, name, collection: spacingCollection.name });
}

createdOrUpdated.effectStyles.push({
  id: ensureEffectStyle("shadow.card", [
    {
      type: "DROP_SHADOW",
      visible: true,
      color: rgbaToColor(0, 0, 0, 0.28),
      offset: { x: 0, y: 18 },
      radius: 44,
      spread: 0,
      blendMode: "NORMAL",
    },
  ]).id,
  name: "shadow.card",
});

createdOrUpdated.effectStyles.push({
  id: ensureEffectStyle("shadow.modal", [
    {
      type: "DROP_SHADOW",
      visible: true,
      color: rgbaToColor(0, 0, 0, 0.45),
      offset: { x: 0, y: 24 },
      radius: 80,
      spread: 0,
      blendMode: "NORMAL",
    },
  ]).id,
  name: "shadow.modal",
});

const availableFonts = await figma.listAvailableFontsAsync();
const hasInter = availableFonts.some((font) => font.fontName.family === "Inter");
const family = hasInter ? "Inter" : "Arial";
const textStyles = [
  ["type.caption", 12, "Bold", 16],
  ["type.body-sm", 13, "Regular", 18],
  ["type.body", 14, "Regular", 20],
  ["type.section", 17, "Bold", 22],
  ["type.title", 23, "Bold", 28],
];

for (const [name, size, weight, lineHeight] of textStyles) {
  let style = figma.getLocalTextStyles().find((candidate) => candidate.name === name);
  if (!style) {
    style = figma.createTextStyle();
    style.name = name;
  }
  style.fontName = { family, style: weight };
  style.fontSize = size;
  style.lineHeight = { unit: "PIXELS", value: lineHeight };
  style.letterSpacing = { unit: "PERCENT", value: 0 };
  createdOrUpdated.textStyles.push({ id: style.id, name, family, weight });
}

return {
  runId: RUN_ID,
  createdNodeIds: pages.map((page) => page.id),
  mutatedNodeIds: pages.map((page) => page.id),
  collections: [
    { id: colorCollection.id, name: colorCollection.name },
    { id: radiusCollection.id, name: radiusCollection.name },
    { id: spacingCollection.id, name: spacingCollection.name },
  ],
  summary: createdOrUpdated,
};

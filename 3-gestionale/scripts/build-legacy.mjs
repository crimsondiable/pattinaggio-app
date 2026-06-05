import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const gestionaleDir = resolve(scriptDir, '..')
const srcDir = join(gestionaleDir, 'src')
const outputPath = join(srcDir, 'app-legacy.js')

const polyfills = `
(function () {
  if (!Array.prototype.flatMap) {
    Object.defineProperty(Array.prototype, 'flatMap', {
      configurable: true,
      writable: true,
      value: function (callback, thisArg) {
        return Array.prototype.concat.apply([], this.map(callback, thisArg));
      }
    });
  }
  if (!Object.fromEntries) {
    Object.fromEntries = function (entries) {
      var result = {};
      for (var i = 0; i < entries.length; i++) result[entries[i][0]] = entries[i][1];
      return result;
    };
  }
  if (!String.prototype.padStart) {
    String.prototype.padStart = function (targetLength, padString) {
      targetLength = targetLength >> 0;
      padString = String(padString || ' ');
      if (this.length >= targetLength) return String(this);
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) padString += padString.repeat(targetLength / padString.length);
      return padString.slice(0, targetLength) + String(this);
    };
  }
  if (!Array.prototype.includes) {
    Array.prototype.includes = function (search, fromIndex) {
      return this.indexOf(search, fromIndex || 0) !== -1;
    };
  }
  if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
      return this.indexOf(search, start || 0) !== -1;
    };
  }
  if (!Array.prototype.find) {
    Array.prototype.find = function (predicate, thisArg) {
      for (var i = 0; i < this.length; i++) if (predicate.call(thisArg, this[i], i, this)) return this[i];
    };
  }
  if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (predicate, thisArg) {
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
    Element.prototype.closest = function (selector) {
      var node = this;
      while (node) {
        if (node.matches && node.matches(selector)) return node;
        node = node.parentElement;
      }
      return null;
    };
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) { return setTimeout(callback, 16); };
  }
})();
`

const orderedFiles = [
  'skilltree-catalog.js',
  'route-builder/routeModels.js',
  'route-builder/routeStorage.js',
  'route-builder/routeJsonUtils.js',
  'route-builder/ElementPalette.js',
  'route-builder/CanvasArea.js',
  'route-builder/ElementPropertiesPanel.js',
  'route-builder/RouteToolbar.js',
  'route-builder/RouteBuilderPage.js',
  'app.js',
]

const entry = [
  polyfills,
  ...orderedFiles.map(file => `\n/* ${file} */\n${readFileSync(join(srcDir, file), 'utf8')}\n;`),
].join('\n')

const tempDir = mkdtempSync(join(tmpdir(), 'gestionale-legacy-'))
const entryPath = join(tempDir, 'app-legacy-entry.js')
writeFileSync(entryPath, entry)

const args = [
  '--yes',
  'esbuild@0.25.5',
  entryPath,
  '--target=es2015',
  '--outfile=' + outputPath,
  '--log-level=warning',
]

const result = spawnSync('npx', args, { stdio: 'inherit' })
if (result.status !== 0) {
  process.exit(result.status || 1)
}

console.log('Wrote ' + outputPath)

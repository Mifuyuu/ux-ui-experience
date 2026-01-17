/**
 * CSV Search Engine using BM25
 * Ported from Python core.py
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const BM25 = require('./bm25');

const DATA_DIR = path.join(__dirname, '..', 'data');

const CSV_CONFIG = {
  style: {
    file: 'styles.csv',
    searchCols: ['Style Category', 'Keywords', 'Best For', 'Type'],
    outputCols: ['Style Category', 'Type', 'Keywords', 'Primary Colors', 'Effects & Animation', 'Best For', 'Performance', 'Accessibility', 'Framework Compatibility', 'Complexity']
  },
  color: {
    file: 'colors.csv',
    searchCols: ['Product Type', 'Keywords', 'Notes'],
    outputCols: ['Product Type', 'Keywords', 'Primary (Hex)', 'Secondary (Hex)', 'CTA (Hex)', 'Background (Hex)', 'Text (Hex)', 'Border (Hex)', 'Notes']
  },
  typography: {
    file: 'typography.csv',
    searchCols: ['Font Pairing Name', 'Category', 'Mood/Style Keywords', 'Best For', 'Heading Font', 'Body Font'],
    outputCols: ['Font Pairing Name', 'Category', 'Heading Font', 'Body Font', 'Mood/Style Keywords', 'Best For', 'Google Fonts URL', 'CSS Import', 'Tailwind Config', 'Notes']
  },
  icons: {
    file: 'icons.csv',
    searchCols: ['Category', 'Icon Name', 'Keywords', 'Best For'],
    outputCols: ['Category', 'Icon Name', 'Keywords', 'Library', 'Import Code', 'Usage', 'Best For', 'Style']
  },
  landing: {
    file: 'landing.csv',
    searchCols: ['Pattern Name', 'Keywords', 'Conversion Optimization', 'Section Order'],
    outputCols: ['Pattern Name', 'Keywords', 'Section Order', 'Primary CTA Placement', 'Color Strategy', 'Conversion Optimization']
  },
  alerts: {
    file: 'alerts.csv',
    searchCols: ['Alert Type', 'Use Case', 'Keywords', 'Code Example'],
    outputCols: ['Alert Type', 'Use Case', 'Keywords', 'Code Example', 'Best For', 'Severity', 'Theme', 'Docs URL']
  }
};

const STACK_CONFIG = {
  'html-tailwind': { file: 'stacks/html-tailwind.csv' },
  'react': { file: 'stacks/react.csv' },
  'nextjs': { file: 'stacks/nextjs.csv' },
  'vue': { file: 'stacks/vue.csv' },
  'svelte': { file: 'stacks/svelte.csv' },
  'bootstrap5': { file: 'stacks/bootstrap5.csv' },
  'nuxtjs': { file: 'stacks/nuxtjs.csv' },
  'shadcn': { file: 'stacks/shadcn.csv' },
  'flutter': { file: 'stacks/flutter.csv' },
  'swiftui': { file: 'stacks/swiftui.csv' },
  'react-native': { file: 'stacks/react-native.csv' }
};

const STACK_COLS = {
  searchCols: ['Category', 'Guideline', 'Description', 'Do', "Don't"],
  outputCols: ['Category', 'Guideline', 'Description', 'Do', "Don't", 'Code Good', 'Code Bad', 'Severity', 'Docs URL']
};

function loadCSV(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  return parse(content, { columns: true, skip_empty_lines: true });
}

function searchCSV(filepath, searchCols, outputCols, query, maxResults = 5) {
  if (!fs.existsSync(filepath)) {
    return [];
  }

  const data = loadCSV(filepath);
  const documents = data.map(row => 
    searchCols.map(col => row[col] || '').join(' ')
  );

  const bm25 = new BM25();
  bm25.fit(documents);
  const scores = bm25.score(query);

  return scores
    .slice(0, maxResults)
    .filter(([_, score]) => score > 0)
    .map(([idx]) => {
      const row = data[idx];
      const result = {};
      outputCols.forEach(col => {
        result[col] = row[col] || '';
      });
      return result;
    });
}

/**
 * Search design database
 * @param {string} domain - style|color|typography|icons|landing|alerts
 * @param {string} query
 * @param {number} maxResults
 * @returns {Array}
 */
function search(domain, query, maxResults = 5) {
  const config = CSV_CONFIG[domain];
  if (!config) {
    throw new Error(`Unknown domain: ${domain}`);
  }

  const filepath = path.join(DATA_DIR, config.file);
  return searchCSV(filepath, config.searchCols, config.outputCols, query, maxResults);
}

/**
 * Search stack guidelines
 * @param {string} stack
 * @param {string} query
 * @param {number} maxResults
 * @returns {Array}
 */
function searchStack(stack, query, maxResults = 10) {
  const config = STACK_CONFIG[stack];
  if (!config) {
    throw new Error(`Unknown stack: ${stack}`);
  }

  const filepath = path.join(DATA_DIR, config.file);
  return searchCSV(filepath, STACK_COLS.searchCols, STACK_COLS.outputCols, query, maxResults);
}

module.exports = {
  search,
  searchStack,
  loadCSV,
  DATA_DIR,
  CSV_CONFIG,
  STACK_CONFIG
};

/**
 * Design System Generator - Simplified version
 */

const { search, searchStack, loadCSV, DATA_DIR } = require('./search');
const path = require('path');

function generateDesignSystem(query, projectName, stack = 'html-tailwind') {
  const styleResults = search('style', query, 1);
  const colorResults = search('color', query, 1);
  const typographyResults = search('typography', query, 1);
  const landingResults = search('landing', query, 1);
  
  const style = styleResults[0] || {};
  const colors = colorResults[0] || {};
  const typography = typographyResults[0] || {};
  const landing = landingResults[0] || {};

  return {
    projectName,
    query,
    stack,
    pattern: landing['Pattern Name'] || 'Hero + Features + CTA',
    ctaPlacement: landing['Primary CTA Placement'] || 'Above fold',
    sections: landing['Section Order'] || '1. Hero, 2. Features, 3. CTA',
    style: {
      name: style['Style Category'] || 'Minimalism',
      type: style['Type'] || 'General',
      keywords: style['Keywords'] || 'clean, simple, spacious',
      effects: style['Effects & Animation'] || 'Subtle hover, smooth transitions',
      bestFor: style['Best For'] || 'General purpose',
      performance: style['Performance'] || 'Good',
      accessibility: style['Accessibility'] || 'WCAG AA'
    },
    colors: {
      primary: colors['Primary (Hex)'] || '#2563EB',
      secondary: colors['Secondary (Hex)'] || '#3B82F6',
      cta: colors['CTA (Hex)'] || '#F97316',
      background: colors['Background (Hex)'] || '#F8FAFC',
      text: colors['Text (Hex)'] || '#1E293B',
      notes: colors['Notes'] || 'Professional color scheme'
    },
    typography: {
      pairing: typography['Font Pairing Name'] || 'Inter',
      heading: typography['Heading Font'] || 'Inter',
      body: typography['Body Font'] || 'Inter',
      mood: typography['Mood/Style Keywords'] || 'modern, clean',
      googleFontsUrl: typography['Google Fonts URL'] || '',
      cssImport: typography['CSS Import'] || ''
    },
    antiPatterns: landing['Conversion Optimization'] ? extractAntiPatterns(landing['Conversion Optimization']) : '',
    checklist: [
      'No emojis as icons (use SVG: Heroicons/Lucide)',
      'cursor-pointer on all clickable elements',
      'Hover states with smooth transitions (150-300ms)',
      'Light mode: text contrast 4.5:1 minimum',
      'Focus states visible for keyboard nav',
      'prefers-reduced-motion respected',
      'Responsive: 375px, 768px, 1024px, 1440px'
    ]
  };
}

function extractAntiPatterns(text) {
  if (!text) return '';
  const patterns = text.match(/avoid|don't|never|no/gi);
  return patterns ? text : '';
}

function formatMarkdown(designSystem) {
  const { projectName, pattern, ctaPlacement, sections, style, colors, typography, antiPatterns, checklist } = designSystem;
  
  let md = `## Design System: ${projectName}\n\n`;
  
  md += `### Pattern\n`;
  md += `- **Name:** ${pattern}\n`;
  md += `- **CTA Placement:** ${ctaPlacement}\n`;
  md += `- **Sections:** ${sections}\n\n`;
  
  md += `### Style\n`;
  md += `- **Name:** ${style.name}\n`;
  md += `- **Keywords:** ${style.keywords}\n`;
  md += `- **Best For:** ${style.bestFor}\n`;
  md += `- **Performance:** ${style.performance} | **Accessibility:** ${style.accessibility}\n\n`;
  
  md += `### Colors\n`;
  md += `| Role | Hex |\n`;
  md += `|------|-----|\n`;
  md += `| Primary | ${colors.primary} |\n`;
  md += `| Secondary | ${colors.secondary} |\n`;
  md += `| CTA | ${colors.cta} |\n`;
  md += `| Background | ${colors.background} |\n`;
  md += `| Text | ${colors.text} |\n\n`;
  md += `*Notes: ${colors.notes}*\n\n`;
  
  md += `### Typography\n`;
  md += `- **Heading:** ${typography.heading}\n`;
  md += `- **Body:** ${typography.body}\n`;
  md += `- **Mood:** ${typography.mood}\n`;
  if (typography.googleFontsUrl) {
    md += `- **Google Fonts:** ${typography.googleFontsUrl}\n`;
  }
  if (typography.cssImport) {
    md += `- **CSS Import:**\n\`\`\`css\n${typography.cssImport}\n\`\`\`\n`;
  }
  md += `\n`;
  
  md += `### Key Effects\n${style.effects}\n\n`;
  
  if (antiPatterns) {
    md += `### Avoid (Anti-patterns)\n${antiPatterns}\n\n`;
  }
  
  md += `### Pre-Delivery Checklist\n`;
  checklist.forEach(item => {
    md += `- [ ] ${item}\n`;
  });
  
  return md;
}

module.exports = {
  generateDesignSystem,
  formatMarkdown
};

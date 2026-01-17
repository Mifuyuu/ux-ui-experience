#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { search, searchStack } = require('./lib/search');
const { generateDesignSystem, formatMarkdown } = require('./lib/designSystem');

const server = new Server(
  {
    name: 'uxui-experience',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'ui_ux_search',
        description: 'Search UI/UX design database (styles, colors, typography, icons, landing patterns, alerts)',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query (e.g., "SaaS dashboard", "fintech", "minimal dark mode")' },
            domain: { 
              type: 'string', 
              enum: ['style', 'color', 'typography', 'icons', 'landing', 'alerts'],
              description: 'Domain to search in'
            },
            maxResults: { type: 'number', default: 5, description: 'Maximum results to return' }
          },
          required: ['query', 'domain']
        }
      },
      {
        name: 'ui_ux_generate_design_system',
        description: 'Generate complete design system with style, colors, typography, and best practices',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Product/app description (e.g., "SaaS CRM dashboard")' },
            projectName: { type: 'string', description: 'Project name' },
            stack: { 
              type: 'string',
              enum: ['html-tailwind', 'react', 'nextjs', 'vue', 'svelte', 'bootstrap5', 'nuxtjs', 'shadcn', 'flutter', 'swiftui', 'react-native'],
              default: 'html-tailwind',
              description: 'Tech stack to use'
            },
            format: { type: 'string', enum: ['json', 'markdown'], default: 'markdown', description: 'Output format' }
          },
          required: ['query', 'projectName']
        }
      },
      {
        name: 'ui_ux_get_stack_guidelines',
        description: 'Get best practices and guidelines for a specific tech stack',
        inputSchema: {
          type: 'object',
          properties: {
            stack: { 
              type: 'string',
              enum: ['html-tailwind', 'react', 'nextjs', 'vue', 'svelte', 'bootstrap5', 'nuxtjs', 'shadcn', 'flutter', 'swiftui', 'react-native'],
              description: 'Tech stack'
            },
            category: { type: 'string', description: 'Category filter (optional, e.g., "Layout", "Components")', default: '' },
            maxResults: { type: 'number', default: 10, description: 'Maximum results' }
          },
          required: ['stack']
        }
      },
      {
        name: 'ui_ux_get_icons',
        description: 'Search for icons from Lucide or Font Awesome libraries',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Icon search query (e.g., "user profile", "shopping cart")' },
            library: { type: 'string', enum: ['lucide', 'fontawesome', 'all'], default: 'all', description: 'Icon library filter' },
            maxResults: { type: 'number', default: 10 }
          },
          required: ['query']
        }
      },
      {
        name: 'ui_ux_get_alerts',
        description: 'Search SweetAlert2 alert patterns and examples',
        inputSchema: {
          type: 'object',
          properties: {
            type: { type: 'string', description: 'Alert type (success, error, warning, confirm, etc.)', default: '' },
            maxResults: { type: 'number', default: 5 }
          }
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'ui_ux_search': {
        const results = search(args.domain, args.query, args.maxResults || 5);
        return {
          content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
        };
      }

      case 'ui_ux_generate_design_system': {
        const designSystem = generateDesignSystem(args.query, args.projectName, args.stack || 'html-tailwind');
        const output = args.format === 'json' 
          ? JSON.stringify(designSystem, null, 2)
          : formatMarkdown(designSystem);
        return {
          content: [{ type: 'text', text: output }]
        };
      }

      case 'ui_ux_get_stack_guidelines': {
        const query = args.category || args.stack;
        const results = searchStack(args.stack, query, args.maxResults || 10);
        return {
          content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
        };
      }

      case 'ui_ux_get_icons': {
        let results = search('icons', args.query, args.maxResults || 10);
        if (args.library && args.library !== 'all') {
          const lib = args.library === 'lucide' ? 'Lucide' : 'Font Awesome';
          results = results.filter(icon => icon.Library === lib);
        }
        return {
          content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
        };
      }

      case 'ui_ux_get_alerts': {
        const query = args.type || 'alert';
        const results = search('alerts', query, args.maxResults || 5);
        return {
          content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('UXUI-Experience MCP Server running on stdio');
}

main().catch(console.error);

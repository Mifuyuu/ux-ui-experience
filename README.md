# UXUI-Experience - Node.js MCP Server

Pure Node.js implementation of UXUI-Experience with Bootstrap 5, Font Awesome, and SweetAlert2 support.

## Features

- ✅ **Bootstrap 5** - 40 best practices guidelines
- ✅ **Font Awesome** - 90 popular icons (total 183 with Lucide)
- ✅ **SweetAlert2** - 25 alert patterns
- ✅ **BM25 Search** - Advanced search algorithm
- ✅ **Design System Generator** - Generate complete design systems
- ✅ **11 Tech Stacks** - Bootstrap 5, React, Next.js, Vue, Svelte, etc.

## Installation

### Quick Start (Recommended)

```bash
npx uxui-experience@latest
```

### Global Installation

```bash
npm install -g uxui-experience
```

### OpenCode Configuration

Add to your OpenCode configuration file (`~/.config/opencode/opencode.json` or `%APPDATA%\opencode\opencode.json` on Windows):

```json
{
  "mcpServers": {
    "uxui-experience": {
      "command": "npx",
      "args": ["-y", "uxui-experience@latest"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "uxui-experience": {
      "command": "uxui-experience"
    }
  }
}
```

**Restart OpenCode** after adding the configuration.

## MCP Tools Available

### 1. `ui_ux_search`
Search design database (styles, colors, typography, icons, landing, alerts)

```json
{
  "query": "SaaS dashboard",
  "domain": "style|color|typography|icons|landing|alerts",
  "maxResults": 5
}
```

### 2. `ui_ux_generate_design_system`
Generate complete design system

```json
{
  "query": "fintech dashboard",
  "projectName": "FinApp",
  "stack": "bootstrap5|react|nextjs|vue|...",
  "format": "markdown|json"
}
```

### 3. `ui_ux_get_stack_guidelines`
Get tech stack best practices

```json
{
  "stack": "bootstrap5|react|nextjs|...",
  "category": "Layout|Components|...",
  "maxResults": 10
}
```

### 4. `ui_ux_get_icons`
Search icons (Lucide + Font Awesome)

```json
{
  "query": "user profile",
  "library": "lucide|fontawesome|all",
  "maxResults": 10
}
```

### 5. `ui_ux_get_alerts`
Search SweetAlert2 patterns

```json
{
  "type": "success|error|warning|confirm|...",
  "maxResults": 5
}
```

## Usage in OpenCode

The MCP server is registered in `~/.config/opencode/opencode.json` and will be available when OpenCode restarts.

**To restart OpenCode:** Close and reopen the application.

## Example Queries

- "Generate design system for a fintech dashboard using Bootstrap 5"
- "Find icons for user authentication"
- "Show me SweetAlert2 confirmation dialogs"
- "Get React best practices for state management"
- "Find color palettes for healthcare apps"

## Data Files

- `data/stacks/bootstrap5.csv` - Bootstrap 5 guidelines
- `data/icons.csv` - Lucide + Font Awesome icons
- `data/alerts.csv` - SweetAlert2 patterns
- All original data files included

## Tech Stack

- Node.js 18+
- @modelcontextprotocol/sdk
- csv-parse
- Custom BM25 search algorithm

## License

MIT

# ux-ui-experience - Node.js MCP Server

Pure Node.js implementation of UX-UI-Experience with Bootstrap 5, Font Awesome, and SweetAlert2 support.

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
npx ux-ui-experience@latest
```

### Global Installation

```bash
npm install -g ux-ui-experience
```

### OpenCode Configuration

Add to your OpenCode configuration file:
- **Windows:** `%APPDATA%\opencode\opencode.json`
- **Mac/Linux:** `~/.config/opencode/opencode.json`

```json
{
  "mcp": {
    "ux-ui-experience": {
      "type": "local",
      "command": ["npx", "-y", "ux-ui-experience@latest"],
      "enabled": true
    }
  }
}
```

Or if installed globally:

```json
{
  "mcp": {
    "ux-ui-experience": {
      "type": "local",
      "command": ["ux-ui-experience"],
      "enabled": true
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

### Slash Command

The MCP server automatically provides a slash command in OpenCode:

**`/ux-ui-exp [your request]`**

Examples:
```
/ux-ui-exp create a fintech dashboard design system
/ux-ui-exp find icons for user authentication
/ux-ui-exp show SweetAlert2 confirmation dialogs
/ux-ui-exp get React best practices for state management
/ux-ui-exp find color palettes for healthcare apps
```

The command automatically selects and uses the appropriate MCP tools based on your request.

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

## Credits

This project is a **Node.js MCP Server implementation** based on the original **UI-UX-Pro-Max-Skill** by **NextLevelBuilder + Sisyphus**.

Original repository: [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)

Special thanks to:
- **NextLevelBuilder** - Original concept and design intelligence framework
- **Sisyphus** - AI Agent implementation and OpenCode integration

This implementation provides a pure Node.js MCP server that can be easily installed and used with OpenCode and other MCP-compatible clients.

## License

MIT

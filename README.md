# NZBGet MCP Server

An MCP (Model Context Protocol) server for [NZBGet](https://nzbget.net/) that exposes NZBGet API functionality as MCP tools usable by LLM clients.

Control your Usenet downloads with natural language through Claude and other MCP-compatible clients.

## Features

- **17 MCP tools** for complete NZBGet control
- Queue management: list, add, pause, resume, delete downloads
- History tracking: view completed and failed downloads
- Speed control: set download rate limits
- Status monitoring: real-time server status, disk space, queue info
- Logging: access and write to NZBGet logs
- TypeScript implementation with JSON-RPC client
- Stdio transport compatible with Claude Desktop

## Requirements

- Node.js 18+
- A running NZBGet instance with RPC enabled

## Setup

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/aserper/nzbget-mcp.git
cd nzbget-mcp
npm install
```

2. Build the project:

```bash
npm run build
```

3. Copy `.env.example` to `.env` and set your values:

```bash
cp .env.example .env
```

Edit `.env`:

```
NZBGET_HOST=localhost
NZBGET_PORT=6789
NZBGET_USERNAME=nzbget
NZBGET_PASSWORD=tegbzn6789
NZBGET_USE_HTTPS=false
```

## Running the MCP Server

```bash
npm start
```

Or directly:

```bash
node dist/index.js
```

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NZBGET_HOST` | NZBGet hostname | `localhost` |
| `NZBGET_PORT` | NZBGet RPC port | `6789` |
| `NZBGET_USERNAME` | NZBGet username | - |
| `NZBGET_PASSWORD` | NZBGet password | - |
| `NZBGET_USE_HTTPS` | Use HTTPS | `false` |

## Claude Desktop Configuration

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS, or equivalent on other platforms):

```json
{
  "mcpServers": {
    "nzbget": {
      "command": "node",
      "args": ["/path/to/nzbget-mcp/dist/index.js"],
      "env": {
        "NZBGET_HOST": "localhost",
        "NZBGET_PORT": "6789",
        "NZBGET_USERNAME": "nzbget",
        "NZBGET_PASSWORD": "tegbzn6789"
      }
    }
  }
}
```

## Docker

### Build Locally

```bash
docker build -t nzbget-mcp .
```

### Run

```bash
docker run --rm -it \
  -e NZBGET_HOST="localhost" \
  -e NZBGET_PORT="6789" \
  -e NZBGET_USERNAME="nzbget" \
  -e NZBGET_PASSWORD="tegbzn6789" \
  nzbget-mcp
```

## Exposed Tools

### Status & Information
- `nzbget_status` - Get server status (speed, queue size, disk space)
- `nzbget_version` - Get NZBGet version
- `nzbget_server_volumes` - Get download statistics per server

### Download Queue
- `nzbget_list_groups` - List all downloads in queue
- `nzbget_append` - Add NZB file to queue
- `nzbget_edit_queue` - Edit queue (pause, resume, delete, set priority)

### History
- `nzbget_history` - View download history

### Control
- `nzbget_pause_download` / `nzbget_resume_download`
- `nzbget_pause_post` / `nzbget_resume_post`
- `nzbget_rate` - Set download speed limit (KB/s)
- `nzbget_scan` - Scan for new NZB files

### Logging
- `nzbget_log` - Get log entries
- `nzbget_write_log` - Write custom log message

## Usage Examples

```
"Show me what's currently downloading"
"Pause the download queue"
"Set download speed to 5 MB/s"
"Add an NZB file to the queue"
"Show my recent download history"
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Lint
npm run lint

# Type check
npm run typecheck
```

## License

MIT

## Contributing

Contributions welcome! Feel free to open an issue or submit a PR.

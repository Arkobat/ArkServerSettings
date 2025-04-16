# ARK Server Configuration Generator

A TypeScript application that scrapes ARK: Survival Evolved and ARK: Survival Ascended server configuration data from the official wiki and generates ready-to-use configuration files.

## Features

- Scrapes server configuration data from the ARK wiki
- Filters settings based on game version (ASA or ASE)
- Generates properly formatted configuration files
- TypeScript implementation with a modular, maintainable structure
- Command-line interface with options

## Project Structure

```
ArkConfigTS/
├── dist/               # Compiled JavaScript code (after build)
├── src/
│   ├── types/          # TypeScript type definitions
│   ├── services/       # Core functionality classes
│   ├── utils/          # Utility functions
│   └── index.ts        # Main entry point
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone this repository
2. Install dependencies:

```bash
cd ArkConfigTS
npm install
```

3. Build the project:

```bash
npm run build
```

## Usage

Run the application with Node.js:

```bash
# Basic usage with default options (targets ASA)
npm start

# Specify the game version (ASA or ASE)
npm start -- --game ASE

# Save output to a specific directory
npm start -- --game ASA --output ./configs

# Also generate JSON data files
npm start -- --json
```

## CLI Options

- `-g, --game <value>` - Target game version (ASA or ASE), default: ASA
- `-o, --output <directory>` - Output directory for config files, default: ./
- `-j, --json` - Also output JSON data files, default: false
- `--version` - Show version information
- `--help` - Show help

## Development

To run the TypeScript code directly during development:

```bash
npm run dev
```

## License

MIT

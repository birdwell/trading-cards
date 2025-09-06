# Trading Cards Database

A TypeScript application that automatically imports and manages trading card data from beckett.com. The application scrapes trading card checklists from URLs, downloads Excel files, and stores the card information in a SQLite database.

## Features

- 🃏 **Automated Card Import**: Import trading card data directly from URLs
- 📊 **Excel Processing**: Parse and process Excel checklist files
- 🗄️ **Database Storage**: Store card data in SQLite with Drizzle ORM
- 🏀 **Multi-Sport Support**: Support for Basketball and Football cards
- 🧪 **Comprehensive Testing**: Full test suite with Jest
- 📝 **Type Safety**: Written in TypeScript for better code reliability

## Project Structure

```
trading-cards/
├── src/
│   ├── db/                     # Database configuration and services
│   │   ├── index.ts           # Database connection
│   │   ├── schema.ts          # Database schema definitions
│   │   └── service.ts         # Database operations
│   ├── download-file.ts       # File download utilities
│   ├── get-set-name.ts        # Extract set names from URLs
│   ├── get-xlsx-link.ts       # Extract Excel file links
│   ├── import-cards-from-url.ts # Main import functionality
│   ├── index.ts               # Application entry point
│   ├── logger.ts              # Logging configuration
│   ├── process-cards.ts       # Excel file processing
│   └── types.ts               # Type definitions
├── tests/                     # Test files
├── drizzle/                   # Database migrations
├── spreadsheet-downloads/     # Downloaded Excel files
└── database.db              # SQLite database file
```

## Database Schema

The application uses a relational database with two main tables:

### Sets Table

- `id`: Primary key
- `name`: Set name (e.g., "2024 Panini Prizm Football")
- `year`: Release year
- `source_file`: Original Excel file path
- `sport`: Sport type (Basketball/Football)

### Cards Table

- `id`: Primary key
- `card_number`: Card number within the set
- `player_name`: Player name on the card
- `card_type`: Type of card (Base, Rookie, etc.)
- `set_id`: Foreign key to sets table

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd trading-cards
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database:

```bash
npm run db:generate
npm run db:migrate
```

## Usage

### Basic Usage

Run the application to import cards from a URL:

```bash
npm start
```

The default configuration imports from a Panini Prizm Football URL. You can modify the URL in `src/index.ts`.

### Development

Run in development mode with hot reloading:

```bash
npm run dev
```

### Import Cards Programmatically

```typescript
import { importCardsFromUrl } from "./src/import-cards-from-url";
import { Sport } from "./src/types";

// Import football cards
const footballCards = await importCardsFromUrl(
  "https://www.beckett.com/news/2024-panini-prizm-football-cards/",
  Sport.Football
);

// Import basketball cards
const basketballCards = await importCardsFromUrl(
  "https://www.beckett.com/news/2024-25-panini-nba-hoops-basketball-cards/",
  Sport.Basketball
);
```

### Database Operations

```typescript
import { dbService } from "./src/db/service";

// Get all sets
const sets = await dbService.getAllSets();

// Get cards by set
const cards = await dbService.getCardsBySetId(1);

// Create a new set
const newSet = await dbService.createSet({
  name: "2024 Topps Baseball",
  year: "2024",
  sourceFile: "topps-2024.xlsx",
  sport: "Baseball",
});
```

## Scripts

- `npm start` - Run the application
- `npm run dev` - Run in development mode
- `npm run build` - Build TypeScript to JavaScript
- `npm test` - Run the test suite
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Apply database migrations

## Testing

The project includes comprehensive tests for all major components:

```bash
# Run all tests
npm test

# Run specific test file
npm test -- get-set-name.test.ts

# Run tests in watch mode
npm test -- --watch
```

## Dependencies

### Core Dependencies

- **TypeScript**: Type-safe JavaScript
- **Drizzle ORM**: Type-safe database operations
- **ExcelJS**: Excel file processing
- **Axios**: HTTP client for downloads
- **Playwright**: Web scraping capabilities
- **Pino**: High-performance logging
- **Zod**: Runtime type validation

### Development Dependencies

- **Jest**: Testing framework
- **Drizzle Kit**: Database migration tools

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database configuration
DATABASE_URL=./database.db

# Logging level
LOG_LEVEL=info
```

### TypeScript Configuration

The project uses modern TypeScript with ES modules. See `tsconfig.json` for full configuration.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the MIT License.

## Troubleshooting

### Common Issues

**Database connection errors:**

- Ensure the database file exists: `ls database.db`
- Run migrations: `npm run db:migrate`

**Excel parsing errors:**

- Check that the downloaded Excel file is valid
- Verify the file structure matches expected format

**Network errors:**

- Check internet connection
- Verify the source URL is accessible
- Some sites may require user agent headers

For more help, please open an issue on GitHub.

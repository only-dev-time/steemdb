
# Blaze Scanner - STEEM Blockchain Explorer

A modern, fast, and intuitive blockchain explorer for the STEEM network. Built with React, TypeScript, and Tailwind CSS for optimal performance and user experience.

## Features

- **Real-time Block Tracking** - Monitor the latest blocks as they're produced
- **Transaction Analysis** - Detailed view of transactions and operations
- **Account Explorer** - Comprehensive account information and history
- **Network Statistics** - Live network health metrics and properties
- **Witness Information** - Current witness status and voting data
- **Internal Market** - STEEM/SBD trading data and charts
- **DAO Proposals** - Worker proposal system tracking
- **Responsive Design** - Works seamlessly on desktop and mobile

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for data fetching
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 16+ and npm (install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd blaze-scanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Configuration

The application connects to STEEM RPC nodes for blockchain data. You can configure the API endpoints in `src/config.json`.

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and API calls
└── styles/             # Global styles and Tailwind config
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ for the STEEM community

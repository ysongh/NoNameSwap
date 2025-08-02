# TxInsight

**TxInsight** is a decentralized finance (DeFi) wallet analysis dashboard that provides users with real-time insights into their cryptocurrency portfolios and transaction history across EVM-compatible blockchains. Powered by the [1inch Developer Portal APIs](https://portal.1inch.dev/documentation/overview), TxInsight aggregates portfolio balances, transaction details, token prices, and security alerts, offering a user-friendly interface for managing and analyzing DeFi activities.

## Features

- **Portfolio Overview**: Displays total wallet value, token distribution, and chain-specific balances (e.g., Ethereum, Polygon, BNB Chain).
- **Transaction History**: Shows a detailed, filterable transaction log with timestamps, amounts, and types (e.g., swaps, transfers).
- **Real-Time Token Prices**: Visualizes token price trends using charts for 1h, 24h, or 7d periods.
- **Security Alerts**: Flags suspicious transactions using the 1inch Shield API to protect users from scams.
- **Multi-Chain Support**: Aggregates data across EVM-compatible blockchains supported by 1inch.
- **Swap Integration**: (Planned) Allows users to execute token swaps directly from the dashboard with optimal rates via the 1inch Swap API.
- **Exportable Reports**: (Planned) Enables users to download portfolio and transaction data for tax or auditing purposes.

## Tech Stack

- **Frontend**: React.js, Chart.js (for visualizations), Bootstrap (for styling)
- **Backend**: Node.js, Express.js
- **APIs**: 1inch Balance API, History API, Spot Price API, Shield API

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A 1inch Developer Portal API key (sign up at [https://portal.1inch.dev](https://portal.1inch.dev))
- A supported Ethereum wallet (e.g., MetaMask) for testing

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ysongh/TxInsight.git
   cd TxInsight
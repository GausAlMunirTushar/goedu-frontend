# IngoHR- Frontend

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16.1.0
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Radix UI Primitives with custom styling
- **Icons**: Lucide React Icons
- **State Management**: React Hooks and Context API
- **HTTP Client**: Axios
- **Data Fetching**: SWR (Stale While Revalidate)
- **Internationalization**: i18next
- **Form Handling**: React Hook Form (if implemented)
- **Notifications**: Sonner Toast Notifications
- **Date Handling**: date-fns
- **Package Manager**: Yarn / Bun

## Project Structure

```
src/
├── apis/                 # API service functions and configurations
├── app/                  # Next.js 13+ App Router pages
│   ├── (auth)/          # Authentication-related routes
│   ├── (main)/          # Main application routes
│   ├── (public_page)/   # Public-facing pages
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Homepage
├── components/          # Reusable UI components
├── configs/             # Configuration files
├── contexts/            # React Context providers
├── guard/               # Route protection utilities
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and libraries
├── providers/           # Application providers
├── style/               # Global styles and CSS
├── types/               # TypeScript type definitions
```

## Getting Started

### Prerequisites

Make sure you have the following installed on your local development machine:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Yarn](https://yarnpkg.com/) or [Bun](https://bun.sh/) package manager
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ingohr_frontend
```

2. Install dependencies:

```bash
# Using Yarn
yarn install

# Or using Bun
bun install
```

3. Create a `.env.local` file in the root directory and add the required environment variables:

```bash
NEXT_PUBLIC_API_BASE_URL=https://ums.dp.shuvoo.com/api
# Add other environment variables as needed
```

### Environment Variables

| Variable                   | Description                  | Default                         |
| -------------------------- | ---------------------------- | ------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the backend API | `https://ums.dp.shuvoo.com/api` |

For a complete list of environment variables, refer to the `.env.example` file.

### Running the Development Server

```bash
# Using Yarn
yarn dev

# Or using Bun
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

```bash
# Using Yarn
yarn build

# Or using Bun
bun build
```

### Running the Production Server

```bash
# Using Yarn
yarn start

# Or using Bun
bun start
```

## 🧪 Testing

Run the following command to execute tests:

```bash
# Linting
yarn lint
yarn lint:fix  # To auto-fix linting issues

# Type checking
yarn tsc

# Formatting
yarn format      # Format all files
yarn format:check  # Check formatting without making changes
```

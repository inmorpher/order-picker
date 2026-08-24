# Order Picker 📦

A sleek web application for efficiently composing and managing product orders. Optimized for mobile devices with an intuitive interface and cloud-based data persistence.

## ✨ Features

- **📱 Mobile-First Design** — Large buttons and intuitive navigation tailored for mobile devices
- **🎨 Dark & Light Themes** — Automatic system preference detection with manual toggle
- **💾 Order History** — All saved orders are securely stored in the cloud
- **⚡ Lightning-Fast** — Instant quantity input with +/- buttons and manual entry
- **🔍 Product Management** — Full product editor with ability to toggle active/inactive items
- **🌐 Cloud Database** — Real-time data synchronization with Turso (libSQL)

## 🛠 Tech Stack

| Component            | Technology                       |
| -------------------- | -------------------------------- |
| **Frontend**         | Next.js 16, React 19, TypeScript |
| **Styling**          | Tailwind CSS 4, Lucide React     |
| **State Management** | Zustand                          |
| **Database**         | Turso (libSQL)                   |
| **ORM**              | Drizzle ORM                      |

## 📋 Project Structure

```
order-picker/
├── src/
│   ├── app/                      # Application pages
│   │   ├── page.tsx             # Home menu
│   │   ├── order/               # Order composition
│   │   │   ├── page.tsx
│   │   │   └── summary/         # Order summary screen
│   │   ├── history/             # Order history
│   │   │   └── [id]/            # Order details view
│   │   └── items/               # Product manager
│   ├── components/              # React components
│   ├── db/                      # Database layer (schema, index)
│   ├── store/                   # Zustand store
│   └── lib/                     # Utilities
├── drizzle.config.ts            # Drizzle configuration
├── next.config.ts               # Next.js configuration
└── seed.ts                      # Database seeding
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/order-picker.git
   cd order-picker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**
   - Create `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   - Add Turso database credentials:

   ```
   TURSO_DATABASE_URL=libsql://your-database-url
   TURSO_AUTH_TOKEN=your-auth-token
   ```

4. **Run migrations and seed data**

   ```bash
   npm run migrate
   npm run seed
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Main Pages

| Page              | Route            | Description                              |
| ----------------- | ---------------- | ---------------------------------------- |
| Home Menu         | `/`              | Choose action: new order, history, items |
| Order Composition | `/order`         | Select products and input quantities     |
| Order Summary     | `/order/summary` | Review and confirm order                 |
| Order History     | `/history`       | View all saved orders                    |
| Order Details     | `/history/[id]`  | View specific order details              |
| Product Manager   | `/items`         | Manage products (enable/disable)         |
| Recommended Order | `/recommended-order` | Calculate quantities from daily usage and current stock |

## 🎯 Usage Flow

1. **Home Menu** → Click "New Order"
2. **Order Page** → Use +/- buttons or manual input to set quantities
3. **Selected Items** → Highlighted in accent color when quantity > 0
4. **Order Totals** → Displayed in sticky footer
5. **Confirmation** → Complete order on summary page
6. **History** → All orders automatically saved to cloud database

## 🔧 Available Commands

```bash
npm run dev        # Start dev server on http://localhost:3000
npm run build      # Build for production
npm run start      # Run production build
npm run lint       # Lint code with ESLint
```

## 📦 Key Dependencies

### Production

- **next** — React framework for production
- **react** — UI library
- **zustand** — Client state management
- **drizzle-orm** — Type-safe ORM for database operations
- **@libsql/client** — Turso database client
- **lucide-react** — Icon library
- **tailwindcss** — Utility-first CSS framework
- **date-fns** — Date utilities

### Development

- **typescript** — Static type checking
- **drizzle-kit** — Migration and schema management tools
- **eslint** — Code linter

## 🗄 Database Schema

### `items` Table (Products)

- `id` — Unique identifier
- `external_id` — External product code (unique)
- `description` — Product name
- `unit` — Unit of measure (CS, Case, BIB, etc.)
- `category` — Product category (optional)
- `daily_usage` — Estimated quantity used per day (defaults to 0)
- `is_active` — Product status (true/false)

### `orders` Table

- `id` — Unique identifier
- `created_at` — Creation timestamp
- `status` — Order status (draft, completed)
- `total_items_count` — Total items in order
- `order_type` — `standard` or `recommended`

### `order_items` Table (Order Contents)

- `id` — Unique identifier
- `order_id` — Reference to order
- `item_id` — Reference to product
- `quantity` — Quantity ordered

## 🎨 Design & UX

- **Color Palette**: Slate/Zinc for neutral elements, Indigo/Violet for accents, Emerald for confirmations
- **Visual Feedback**: Selected items (quantity > 0) highlighted in accent color
- **Sticky Footer**: "Next" / "Total" button always accessible at bottom
- **Responsive**: Optimized for all screen sizes with mobile-first approach
- **Theme Support**: Dark and light themes with system preference detection

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Pull requests and issues are welcome! For major changes, please open an issue first to discuss.

## 💬 Questions or Suggestions?

Если у вас есть вопросы по проекту, создайте issue в репозитории или свяжитесь с автором.

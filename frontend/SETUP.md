# Smart Shopping List - Setup Guide

## 🚀 Quick Start

### 1. Configure Backend API

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and set your FastAPI backend URL:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## 🔧 Backend Requirements

Your FastAPI backend should have the following endpoints:

### Shopping Lists
- `POST /api/list` - Create a new shopping list
- `GET /api/list/{share_code}` - Get list by share code

### Grocery Items
- `POST /api/items` - Add a new item
- `GET /api/items?list_id={list_id}` - Get all items for a list
- `PUT /api/items/{item_id}` - Update an item
- `DELETE /api/items/{item_id}` - Delete an item

## 📱 Features

✅ Create shopping lists  
✅ Add items with auto-categorization  
✅ Mark items as bought  
✅ Delete items  
✅ Share lists via QR code  
✅ Real-time updates (polling every 10s)  
✅ Mobile-responsive design  
✅ Category-based organization  

## 🎨 Technologies Used

- React 18 + Vite + TypeScript
- Tailwind CSS for styling
- Axios for API calls
- QR Code generation
- React Hot Toast for notifications
- Lucide React for icons

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Your FastAPI backend URL | `http://localhost:8000` |

## 🐛 Troubleshooting

**API Connection Issues:**
- Ensure your backend is running
- Check CORS settings on your FastAPI backend
- Verify the `VITE_API_BASE_URL` in your `.env` file

**Build Issues:**
- Delete `node_modules` and run `npm install` again
- Clear cache: `npm run clean` (if available)

## 📦 Build for Production

```bash
npm run build
```

The production files will be in the `dist` directory.

## 🤝 Support

For issues or questions, please refer to the project documentation or open an issue.

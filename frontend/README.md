# Airline Ticket Shopping Dashboard - React Frontend

## Overview
Interactive React.js dashboard for the Airline Ticket Shopping System with real-time price predictions, demand forecasting, and market analytics.

## Features
- ✅ **Real-time Dashboard** with live stats and charts
- ✅ **Price Prediction** with interactive form and AI predictions
- ✅ **Demand Forecasting** module
- ✅ **Market Analytics** visualization
- ✅ **Anomaly Detection** alerts
- ✅ **Responsive Design** - works on all devices
- ✅ **Dark Theme** - modern, premium UI
- ✅ **Interactive Charts** using Recharts
- ✅ **Toast Notifications** for user feedback

## Tech Stack
- **React 18** - UI framework
- **Recharts** - Data visualization
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Notifications
- **CSS3** - Custom design system

## Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Header.css
│   │   ├── Sidebar.js
│   │   ├── Sidebar.css
│   │   ├── Dashboard.js
│   │   ├── Dashboard.css
│   │   ├── PricePrediction.js
│   │   ├── PricePrediction.css
│   │   ├── DemandForecasting.js
│   │   ├── MarketAnalytics.js
│   │   └── AnomalyDetection.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## Components

### Dashboard
- Real-time system stats
- Price trends chart (24h)
- Weekly demand chart
- Top routes pie chart
- Recent alerts

### Price Prediction
- Interactive flight search form
- AI-powered price predictions
- Confidence intervals
- Price factors analysis
- Recommendations

### Header
- System statistics
- User menu
- Notifications

### Sidebar
- Navigation menu
- Active route indicator

## Design System

### Colors
- Primary: `#2563eb` (Blue)
- Secondary: `#7c3aed` (Purple)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Amber)
- Error: `#ef4444` (Red)

### Typography
- Font: Inter
- Sizes: xs, sm, base, lg, xl, 2xl, 3xl, 4xl

### Spacing
- xs: 0.25rem
- sm: 0.5rem
- md: 1rem
- lg: 1.5rem
- xl: 2rem
- 2xl: 3rem

## API Integration

To connect to the backend API, update the API endpoints in each component:

```javascript
// Example API call
const response = await fetch('http://your-api-url/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData)
});
```

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Deployment

### Deploy to AWS S3 + CloudFront

```bash
# Build the app
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SAGEMAKER_ENDPOINT=your-endpoint-url
```

## Customization

### Change Theme Colors

Edit `src/index.css`:

```css
:root {
  --color-primary: #your-color;
  --color-secondary: #your-color;
}
```

### Add New Components

1. Create component file: `src/components/YourComponent.js`
2. Create styles: `src/components/YourComponent.css`
3. Import in `App.js`
4. Add to navigation in `Sidebar.js`

## Performance Optimization

- ✅ Code splitting with React.lazy()
- ✅ Memoization with React.memo()
- ✅ Optimized re-renders
- ✅ Lazy loading of charts
- ✅ CSS animations with GPU acceleration

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - see LICENSE file

## Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for the Airline Industry**

# ⚡ EV Journey Analyzer

A web app that analyzes your EV journey log CSV files and provides detailed insights about your electric travels.

## Features

- **📊 Dashboard** — Summary cards with total distance, energy, efficiency, and CO₂ savings
- **🗺️ Interactive Map** — Visualize all your trips on a dark-themed map with color-coded categories
- **📈 Trend Analysis** — Charts showing daily distance, monthly overview, hourly patterns, weekday distribution, and efficiency trends
- **💡 Smart Insights** — AI-generated observations about your driving habits, battery usage, cost savings, and environmental impact
- **📋 Data Explorer** — Sortable, searchable table of all your journeys

## How to Use

1. **Upload your CSV** — Drag & drop or click to browse for your EV journey log CSV file
2. **Or try demo data** — Click "Try with demo data" to see a sample analysis
3. **Explore tabs** — Switch between Overview, Map, Trends, Insights, and Data views

## Supported CSV Format

The app works with BMW EV journey log exports (and similar formats). Expected columns:

| Column | Description |
|---|---|
| Start Date | Trip start date/time |
| End Date | Trip end date/time |
| Start Address | Starting location |
| End Address | Destination |
| Distance in Mile | Trip distance |
| Consumption in Kwh | Energy used |
| Category | Trip category (Commute, Leisure, etc.) |
| Start/End Latitude/Longitude | GPS coordinates |
| SOC Source/Destination | Battery state of charge |

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploying to GitHub Pages

1. Create a new GitHub repository
2. Update `package.json` with your GitHub username:
   ```json
   "homepage": "https://<your-username>.github.io/ev-journey-analyzer"
   ```
3. Update `vite.config.js` with the repo name:
   ```js
   const base = '/ev-journey-analyzer/'
   ```
4. Push and deploy:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/ev-journey-analyzer.git
   git push -u origin main
   npm run deploy
   ```
5. Enable GitHub Pages in your repo settings (Settings → Pages → Deploy from branch → `gh-pages`)

## Tech Stack

- **React 19** + **Vite** — Fast, modern frontend
- **Papa Parse** — CSV parsing
- **Recharts** — Data visualization charts
- **Leaflet** + **React-Leaflet** — Interactive maps
- **Lucide React** — Icons

## Insights Generated

The analyzer computes:
- Total trips, distance, energy consumption
- Average efficiency (Wh/mi)
- CO₂ savings vs petrol car
- Cost savings (electricity vs petrol)
- Peak driving hours
- Battery/SOC patterns
- Location diversity
- Driving style analysis
- Efficiency trends over time

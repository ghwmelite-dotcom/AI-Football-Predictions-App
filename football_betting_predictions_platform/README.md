# ⚽ AI Football Predictions Platform

A comprehensive, real-time football betting predictions platform powered by AI, built with React, TypeScript, and Convex. This platform provides intelligent match predictions, live score tracking, booking code management, and community features for football betting enthusiasts.

**Developed by [@ohwpstudios](https://github.com/ohwpstudios)**

---

## 🌟 Features

### Core Functionality
- **AI-Powered Predictions** - Advanced machine learning models analyze matches and generate predictions with confidence scores
- **Live Match Tracking** - Real-time score updates and match status monitoring
- **Multi-Prediction Types** - Support for match results, over/under goals, and both teams to score predictions
- **Booking Codes** - Generate and share betting slips with odds and potential returns
- **Analytics Dashboard** - Track prediction accuracy, ROI, and performance metrics
- **User Statistics** - Personal prediction history, win rates, and streak tracking

### Social Features
- **Community Chat** - Real-time chat rooms for general discussion and match-specific conversations
- **Emoji Reactions** - React to messages with emoji support
- **User Presence** - See who's online in chat rooms
- **Leaderboards** - Compare performance with other users (via analytics)

### Admin Features
- **Match Management** - Add, update, and manage football matches
- **Prediction Oversight** - Monitor AI predictions and results
- **User Role Management** - Assign admin privileges
- **Analytics Controls** - View platform-wide statistics

### Progressive Web App (PWA)
- **Offline Support** - Service worker for offline functionality
- **Mobile Optimized** - Responsive design for all devices
- **Install Prompt** - Add to home screen capability

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library with latest features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Sonner** - Beautiful toast notifications

### Backend
- **Convex** - Real-time backend as a service
- **Convex Auth** - Authentication and authorization
- **OpenAI** - AI-powered prediction generation
- **TypeScript** - End-to-end type safety

### Development Tools
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **npm-run-all** - Parallel script execution

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Required Accounts
- [Convex Account](https://convex.dev) - For backend services
- [OpenAI API Key](https://platform.openai.com) - For AI predictions (optional)

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ghwmelite-dotcom/AI-Football-Predictions-App.git
cd AI-Football-Predictions-App/football_betting_predictions_platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Convex

#### Create a Convex Project
```bash
npx convex dev
```

This will:
- Create a new Convex project (or link to existing)
- Generate necessary configuration files
- Set up your `.env.local` file with Convex URL

#### Configure Authentication

The platform uses **Convex Auth** with anonymous authentication by default. To customize:

1. Edit `convex/auth.config.ts`
2. Add additional providers (Google, GitHub, etc.)
3. Follow [Convex Auth documentation](https://auth.convex.dev/)

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Convex (automatically added by convex dev)
VITE_CONVEX_URL=https://your-convex-deployment.convex.cloud

# Optional: OpenAI for AI predictions
OPENAI_API_KEY=your_openai_api_key_here
```

### 5. Run the Application

```bash
npm run dev
```

This starts:
- **Frontend** at `http://localhost:5173`
- **Convex backend** in development mode

The browser will automatically open with your application.

---

## 📁 Project Structure

```
football_betting_predictions_platform/
├── convex/                          # Backend code
│   ├── _generated/                  # Auto-generated Convex files
│   ├── admin.ts                     # Admin functions
│   ├── analytics.ts                 # Analytics queries/mutations
│   ├── auth.config.ts               # Authentication configuration
│   ├── auth.ts                      # Auth functions
│   ├── bookingCodes.ts              # Booking code management
│   ├── chat.ts                      # Chat functionality
│   ├── http.ts                      # HTTP endpoints
│   ├── liveMatches.ts               # Live match updates
│   ├── matches.ts                   # Match management
│   ├── predictions.ts               # Prediction logic
│   ├── router.ts                    # Custom HTTP routes
│   └── schema.ts                    # Database schema
│
├── src/                             # Frontend code
│   ├── components/                  # React components
│   │   ├── AdminPanel.tsx           # Admin dashboard
│   │   ├── AnalyticsCard.tsx        # Analytics display
│   │   ├── AnimatedCard.tsx         # Reusable animated card
│   │   ├── BookingCodesCard.tsx     # Booking codes UI
│   │   ├── ChatPanel.tsx            # Chat interface
│   │   ├── Dashboard.tsx            # Main dashboard
│   │   ├── Header.tsx               # App header
│   │   ├── LandingPage.tsx          # Landing page
│   │   ├── LiveMatchCard.tsx        # Live match display
│   │   ├── MatchesCard.tsx          # Match listings
│   │   ├── PredictionsCard.tsx      # Predictions display
│   │   ├── SignUpPromptModal.tsx    # Sign-up modal
│   │   └── StatsOverview.tsx        # Statistics overview
│   │
│   ├── lib/                         # Utilities
│   │   └── utils.ts                 # Helper functions
│   │
│   ├── App.tsx                      # Main app component
│   ├── SignInForm.tsx               # Sign-in component
│   ├── SignOutButton.tsx            # Sign-out component
│   ├── index.css                    # Global styles
│   ├── main.tsx                     # App entry point
│   └── vite-env.d.ts                # Vite type definitions
│
├── public/                          # Static assets
│   ├── manifest.json                # PWA manifest
│   └── sw.js                        # Service worker
│
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.js               # Tailwind config
├── vite.config.ts                   # Vite config
└── README.md                        # This file
```

---

## 🎯 Key Features in Detail

### 1. AI Predictions

The platform generates predictions using:
- **Historical data analysis**
- **Team performance metrics**
- **Head-to-head statistics**
- **Form analysis**
- **Odds evaluation**

Prediction types:
- Match Result (Home/Draw/Away)
- Over/Under Goals
- Both Teams to Score

Each prediction includes:
- Confidence score (0-100%)
- AI reasoning
- Recommended odds
- Potential return calculation

### 2. Live Match Tracking

Features:
- Real-time score updates
- Match status (upcoming, live, finished)
- Match minute tracking
- Half-time/Extra-time indicators
- Team logos and venue information

### 3. Booking Codes

Create shareable betting slips with:
- Multiple matches
- Combined odds
- Stake calculation
- Potential winnings
- Platform compatibility
- Expiration dates

### 4. Analytics Dashboard

Track performance with:
- Overall accuracy percentage
- Total predictions made
- Win/loss ratio
- ROI (Return on Investment)
- Prediction type breakdown
- Historical trends

### 5. Community Chat

Engage with other users:
- General discussion rooms
- Match-specific chat rooms
- Real-time messaging
- Emoji reactions
- Online user presence
- Typing indicators

---

## 🔧 Backend Structure

### Database Schema

The Convex database includes these tables:

| Table | Description |
|-------|-------------|
| `users` | User accounts (managed by Convex Auth) |
| `userRoles` | User role assignments (admin/user) |
| `matches` | Football match data |
| `predictions` | AI-generated predictions |
| `userPredictions` | User-created predictions |
| `analytics` | Platform analytics data |
| `leagues` | Football league information |
| `userStats` | Individual user statistics |
| `bookingCodes` | Betting slip codes |
| `chatRooms` | Chat room configurations |
| `messages` | Chat messages |
| `chatPresence` | User online status |

### API Endpoints

Custom HTTP routes are defined in `convex/router.ts`:

```typescript
// Example endpoints (customize as needed)
GET  /api/matches          // Fetch matches
POST /api/predictions      // Create prediction
GET  /api/analytics        // Get analytics
POST /api/booking-codes    // Generate booking code
```

---

## 📱 PWA Configuration

### Service Worker

The service worker (`public/sw.js`) provides:
- Offline caching
- Background sync
- Push notifications (optional)

### Manifest

The `public/manifest.json` defines:
- App name and icons
- Theme colors
- Display mode
- Orientation preferences

### Installation

Users can install the app:
1. Open in Chrome/Edge
2. Click "Install App" prompt
3. Access from home screen

---

## 🚀 Deployment

### Deploy to Production

#### 1. Build the Frontend
```bash
npm run build
```

#### 2. Deploy Convex Backend
```bash
npx convex deploy
```

This creates a production Convex deployment.

#### 3. Deploy Frontend

Popular hosting options:

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Cloudflare Pages:**
- Connect GitHub repository
- Set build command: `npm run build`
- Set output directory: `dist`

#### 4. Environment Variables

Set production environment variables in your hosting platform:
```env
VITE_CONVEX_URL=https://your-production-deployment.convex.cloud
```

### Recommended Hosting

- **Frontend:** Vercel, Netlify, Cloudflare Pages
- **Backend:** Convex (automatically scaled)

---

## 🔐 Security

### Authentication

- Built with **Convex Auth**
- Anonymous sign-in by default
- Extensible to add OAuth providers

### Authorization

- Role-based access control (RBAC)
- Admin-only functions protected
- User data isolation

### Best Practices

- Environment variables for secrets
- No sensitive data in client code
- HTTPS enforced in production
- Regular dependency updates

---

## 🧪 Development

### Available Scripts

```bash
# Start development servers (frontend + backend)
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Build for production
npm run build

# Lint and type-check
npm run lint
```

### Adding Features

1. **New Component:** Add to `src/components/`
2. **New Backend Function:** Add to appropriate `convex/` file
3. **New Database Table:** Update `convex/schema.ts`

### Code Quality

Run before committing:
```bash
npm run lint
```

This checks:
- TypeScript compilation
- ESLint rules
- Convex schema validation
- Production build

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style
- Add TypeScript types for all functions
- Test thoroughly before submitting
- Update documentation as needed
- Keep commits atomic and descriptive

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🐛 Known Issues & Roadmap

### Current Limitations
- AI predictions require OpenAI API key
- Limited to manual match data entry (no live API integration yet)

### Future Enhancements
- [ ] Integration with live football data APIs
- [ ] More AI models for predictions
- [ ] Mobile apps (iOS/Android)
- [ ] Push notifications
- [ ] Social sharing features
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Advanced filtering and search
- [ ] Export predictions to CSV
- [ ] Subscription/payment integration

---

## 📞 Support & Contact

- **Developer:** [@ohwpstudios](https://github.com/ohwpstudios)
- **Repository:** [AI-Football-Predictions-App](https://github.com/ghwmelite-dotcom/AI-Football-Predictions-App)
- **Issues:** [Report a bug](https://github.com/ghwmelite-dotcom/AI-Football-Predictions-App/issues)

### Getting Help

1. Check existing [Issues](https://github.com/ghwmelite-dotcom/AI-Football-Predictions-App/issues)
2. Review [Convex Documentation](https://docs.convex.dev/)
3. Open a new issue with details

---

## 🙏 Acknowledgments

- **Convex** - For the amazing real-time backend platform
- **OpenAI** - For AI prediction capabilities
- **React Team** - For the excellent UI library
- **Tailwind CSS** - For the utility-first CSS framework
- **Football Data Community** - For inspiration and data insights

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/ghwmelite-dotcom/AI-Football-Predictions-App?style=social)
![GitHub forks](https://img.shields.io/github/forks/ghwmelite-dotcom/AI-Football-Predictions-App?style=social)
![GitHub issues](https://img.shields.io/github/issues/ghwmelite-dotcom/AI-Football-Predictions-App)
![GitHub license](https://img.shields.io/github/license/ghwmelite-dotcom/AI-Football-Predictions-App)

---

**Built with ❤️ by [@ohwpstudios](https://github.com/ohwpstudios)**

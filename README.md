# 📊 FinTracker

> **Intelligent Financial Management for Digital Businesses**

Transform your financial chaos into clear, actionable insights. FinTracker is built specifically for performance marketing agencies, digital businesses, and growing companies who need more than basic accounting software.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://fintracker.vercel.app/demo)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

## 🚀 **Live Demo**

Experience FinTracker with real data and interactions:

- **🌐 [Live Website](https://fintracker.vercel.app)** - Complete marketing site
- **📊 [Interactive Dashboard Demo](https://fintracker.vercel.app/demo)** - Try the actual interface
- **📱 Fully Responsive** - Works perfectly on all devices

## ✨ **Why FinTracker?**

Born from the daily frustration of managing a performance marketing agency's finances across spreadsheets, multiple tools, and platforms. We built what we desperately needed.

### **The Problem We Solved**

- ❌ Juggling endless spreadsheets for financial tracking
- ❌ No clear visibility into campaign ROI across platforms
- ❌ Hours wasted on manual data compilation
- ❌ Difficulty tracking employee performance vs revenue
- ❌ Scattered financial data across multiple tools

### **The FinTracker Solution**

- ✅ **Save 15+ hours per week** with automated financial tracking
- ✅ **Increase ROI by 34%** with real-time performance insights
- ✅ **Multi-platform integration** - Facebook Ads, Google Ads, Stripe, PayPal
- ✅ **Employee performance tracking** tied to actual revenue contribution
- ✅ **Real-time dashboards** that answer "Are we profitable?" instantly

## 🎯 **Key Features**

### **💰 Revenue & Income Tracking**

- Multi-source income aggregation
- Real-time revenue attribution
- Client and project-based tracking
- Automated categorization

### **📊 Expense Management**

- Smart expense categorization
- Receipt scanning and processing
- Budget tracking and alerts
- Vendor and subscription management

### **📈 Analytics & Reporting**

- ROI calculation across all campaigns
- Profit/loss analysis with trends
- Custom dashboard creation
- Automated report generation
- Export capabilities (PDF, Excel, CSV)

### **👥 Team Performance**

- Employee revenue attribution
- Performance-based insights
- Campaign ownership tracking
- Team productivity metrics

### **🔗 Integrations**

- **Ad Platforms**: Facebook Ads, Google Ads, TikTok Ads
- **Payment Processing**: Stripe, PayPal, Square
- **Accounting**: QuickBooks integration
- **Banking**: Secure bank connections
- **Email**: Automated financial reports

### **🛡️ Security & Compliance**

- Bank-level AES-256 encryption
- SOC 2 Type II compliance
- GDPR and CCPA compliant
- Regular security audits
- No sensitive credential storage

## 🛠️ **Tech Stack**

**Frontend & Framework:**

- Next.js 15 with App Router for optimal performance and SEO
- React 18 + TypeScript for type-safe development
- Server-side rendering and static generation

**Backend & Database:**

- MongoDB Atlas for flexible, scalable data storage
- Mongoose ODM for elegant data modeling
- Custom JWT authentication with secure token management

**UI & User Experience:**

- Tailwind CSS for rapid, responsive styling
- shadcn/ui + Radix UI for accessible, beautiful components
- Recharts for interactive financial visualizations
- Lucide React for consistent iconography

**Developer Experience:**

- TypeScript for enhanced code quality and IDE support
- React Hook Form + Zod for robust form validation
- pnpm for fast, efficient package management
- ESLint + Prettier for code consistency

**Infrastructure & Deployment:**

- Vercel for seamless deployment and hosting
- Nodemailer for transactional emails
- Sharp for optimized image processing
- Environment-based configuration for security

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 20+
- pnpm (recommended) or npm
- MongoDB database (local or Atlas)

### **Installation**

1. **Clone the repository**

```bash
git clone https://github.com/hellomrariful/FinTracker.git
cd FinTracker
```

2. **Install dependencies**

```bash
pnpm install
# or
npm install
```

3. **Environment Setup**

```bash
cp .env.example .env.local
```

4. **Configure Environment Variables**

```env
# Required
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Optional (for full functionality)
SMTP_HOST=your_smtp_host
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
EMAIL_FROM=your_sender_email
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Run Development Server**

```bash
pnpm dev
# or
npm run dev
```

6. **Open in Browser**

```
http://localhost:3000
```

### **Production Build**

```bash
pnpm build
pnpm start
```

## 📁 **Project Structure**

```
FinTracker/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Protected dashboard pages
│   ├── api/              # API routes
│   └── (marketing)/      # Public marketing pages
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── layout/          # Layout components
│   └── sections/        # Page sections
├── lib/                 # Utility functions and configurations
│   ├── auth/           # Authentication utilities
│   ├── api/            # API client and helpers
│   └── utils/          # General utilities
├── models/             # MongoDB/Mongoose models
├── scripts/            # Build and utility scripts
└── public/             # Static assets
```

## 🔧 **Configuration**

### **Database Setup**

The application uses MongoDB with Mongoose ODM. You can use:

- **MongoDB Atlas** (recommended for production)
- **Local MongoDB** instance
- **Docker MongoDB** container

### **Authentication**

Custom JWT-based authentication with:

- Access tokens (short-lived)
- Refresh tokens (long-lived)
- Secure HTTP-only cookies
- Password hashing with bcryptjs

### **Email Configuration**

Configure SMTP settings for:

- Welcome emails
- Password reset
- Financial report delivery
- Alert notifications

## 📊 **Features in Detail**

### **Dashboard Analytics**

- Real-time financial overview
- Revenue vs expenses trends
- ROI calculations with attribution
- Profit margin analysis
- Cash flow projections

### **Multi-Platform Integration**

- **Facebook Ads**: Campaign performance and spend tracking
- **Google Ads**: Keyword and campaign ROI analysis
- **Stripe/PayPal**: Automated payment reconciliation
- **Bank Connections**: Secure transaction importing

### **Team Management**

- Role-based access control (Owner, Admin, Manager, Viewer)
- Employee performance dashboards
- Revenue attribution by team member
- Campaign ownership tracking

### **Reporting & Export**

- Automated monthly/quarterly reports
- Custom date range analysis
- Multiple export formats (PDF, Excel, CSV)
- Investor-ready financial summaries

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Standards**

- TypeScript for all new code
- ESLint + Prettier for formatting
- Comprehensive error handling
- Unit tests for critical functions

## 📈 **Roadmap**

### **Q1 2025**

- [ ] Mobile app (React Native)
- [ ] Advanced forecasting with AI
- [ ] Multi-currency support
- [ ] API rate limiting and caching

### **Q2 2025**

- [ ] Advanced integrations (HubSpot, Salesforce)
- [ ] White-label solutions
- [ ] Advanced team collaboration features
- [ ] Automated tax preparation

### **Q3 2025**

- [ ] Machine learning insights
- [ ] Advanced budgeting and planning
- [ ] Integration marketplace
- [ ] Enterprise SSO

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- Built with [Next.js](https://nextjs.org/) and [React](https://reactjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)

## 📞 **Support & Contact**

- **Website**: [fintracker.vercel.app](https://fintracker.vercel.app)
- **Email**: hello@fintracker.com
- **Documentation**: [fintracker.vercel.app/docs](https://fintracker.vercel.app/docs)
- **Support**: [fintracker.vercel.app/help](https://fintracker.vercel.app/help)

---

**Built with ❤️ for digital businesses who deserve better financial tools.**

_Stop juggling spreadsheets. Start growing profits._

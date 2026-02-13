# Re-Cell Technology Solutions - PRD

## Original Problem Statement
Build a wholesale company website for Re-Cell Technology Solutions - global wholesale distribution of Apple devices (iPhone, iPad, MacBook, AirPods). The website should replicate a provided HTML template design with dark theme and gold accents.

## User Personas
1. **Trade Buyers** - Professional wholesale buyers looking for bulk Apple device supply across Europe, UAE, and USA
2. **Admin Users** - Re-Cell staff managing trade enquiries and customer communications

## Core Requirements (Static)
- Landing page with premium dark theme (#000000) and gold accents (#D5A528)
- Hero section with company branding and CTAs
- Supply section showcasing product categories
- Process section explaining 3-step workflow
- International Footprint section with locations
- FAQ section with accordion functionality
- Contact form for trade enquiries
- Admin dashboard for managing enquiries
- WhatsApp integration for quick contact

## What's Been Implemented - December 2025

### Backend (FastAPI + MongoDB)
- Enquiry submission and storage API
- Admin authentication (HTTP Basic Auth)
- Enquiry CRUD operations with status tracking (new/contacted/closed)
- FAQ management with seed data
- CSV export for enquiries
- Dashboard statistics endpoint
- Resend email integration ready (awaiting API key)

### Frontend (React + Tailwind + Shadcn)
- Full landing page with all sections
- Premium dark theme with gold accents
- Responsive design (mobile-friendly)
- Framer Motion animations
- Contact form with validation
- Admin dashboard with login
- Enquiry management (view, update status, delete)
- Export functionality

### Features Delivered
- [x] Hero section with CTAs
- [x] Supply section (4 product cards)
- [x] Process section (3 steps)
- [x] Footprint section (3 locations)
- [x] FAQ section (6 items, accordion)
- [x] Contact form with submission
- [x] Admin login
- [x] Admin dashboard with stats
- [x] Enquiry table with filters
- [x] Status management
- [x] CSV export
- [x] WhatsApp integration

## Prioritized Backlog

### P0 - Critical (Done)
- [x] Landing page
- [x] Contact form
- [x] Admin dashboard

### P1 - Important
- [ ] Email notifications (add Resend API key to enable)
- [ ] Stock list PDF download functionality
- [ ] Mobile menu improvements

### P2 - Nice to Have
- [ ] Enquiry reply feature from admin
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] SEO optimization

## Technical Stack
- **Frontend**: React 19, Tailwind CSS, Shadcn UI, Framer Motion
- **Backend**: FastAPI, Motor (MongoDB async), Pydantic
- **Database**: MongoDB
- **Auth**: HTTP Basic Authentication
- **Email**: Resend (configured, awaiting API key)

## Admin Credentials
- Username: admin
- Password: recell2024!

## Contact Info
- Email: info@re-cell.ie
- Phone: +353 83 045 0305
- WhatsApp: +353830450305
- Location: Maynooth, Co. Kildare, Ireland

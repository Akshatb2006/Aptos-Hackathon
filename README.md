# 🎓 Campus Wallet — Blockchain-Powered Student Reward & Engagement Platform

<div align="center">

**A comprehensive student reward ecosystem built on Aptos blockchain**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.0-green.svg)](https://www.mongodb.com/)
[![Aptos](https://img.shields.io/badge/Aptos-Testnet-purple.svg)](https://aptoslabs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Real-Life Use Cases](#-real-life-use-cases)
- [High-Level Design](#-high-level-design)
- [Folder Structure](#-folder-structure)
- [Technical Architecture](#-technical-architecture)
- [Database Design](#-database-design)
- [API Documentation](#-api-documentation)
- [Features](#-features)
- [Setup & Installation](#-setup--installation)
- [Workflows](#-workflows)
- [Security](#-security)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Campus Wallet** is a next-generation student engagement platform that transforms campus activities into a rewarding experience. Built on Aptos blockchain, it enables universities to incentivize student participation through a transparent, decentralized points system.

### The Problem

Traditional university reward systems are:
- ❌ Opaque and difficult to track
- ❌ Limited to physical vouchers or cash
- ❌ Prone to fraud and manipulation
- ❌ Lack real-time balance updates
- ❌ Don't provide audit trails

### Our Solution

Campus Wallet provides:
- ✅ **Transparent Blockchain Ledger** - Every transaction is immutable and auditable
- ✅ **Real-Time Point Tracking** - Instant balance updates across all platforms
- ✅ **Digital Redemption** - QR-based reward claims with automated validation
- ✅ **Wallet Integration** - Seamless connection with Petra and Martian wallets
- ✅ **Multi-Category Rewards** - From food coupons to premium subscriptions
- ✅ **Admin Dashboard** - Comprehensive student and reward management

---

## 💡 Real-Life Use Cases

### 🎯 Scenario 1: Academic Participation

**Student Journey:**
1. **Sarah attends a guest lecture** on AI/ML organized by the CS department
2. Admin uploads attendance CSV with Sarah's roll number
3. Sarah receives **50 points** automatically in her wallet
4. Points are minted on-chain and reflected immediately in her dashboard
5. Sarah accumulates points over the semester from multiple events

**Value Delivered:**
- Encourages seminar attendance
- Automated reward distribution
- Transparent point allocation
- No manual intervention required

---

### 🏆 Scenario 2: Merit-Based Rewards

**Student Journey:**
1. **Raj scores 95%** in his mid-semester exams
2. Professor nominates him for merit points
3. Admin reviews and approves **200 points** for academic excellence
4. Raj views the transaction in his ledger with description "Mid-Sem Excellence Award"
5. Points are cryptographically signed on Aptos blockchain

**Value Delivered:**
- Merit recognition automation
- Permanent achievement records
- Motivates academic performance
- Gamifies learning experience

---

### 🎫 Scenario 3: Event Pass Redemption

**Student Journey:**
1. **Maya has 500 points** accumulated from hackathons and workshops
2. She browses the marketplace and finds "Tech Fest VIP Pass" for 400 points
3. Maya redeems the pass
4. System generates a **unique QR code** with redemption ID
5. At the event entrance, scanner validates QR code
6. Maya gets VIP access; redemption marked as "used"

**Value Delivered:**
- Contactless redemption
- Anti-fraud QR validation
- Real-time inventory management
- Audit trail for all redemptions

---

### 🍔 Scenario 4: Campus Cafeteria Integration

**Student Journey:**
1. **Arjun has 150 points**, wants lunch at campus cafeteria
2. Redeems "₹100 Food Coupon" for 100 points
3. Receives QR code on his phone
4. Shows QR at cafeteria counter
5. Staff scans QR, validates authenticity
6. Arjun enjoys subsidized meal; system deducts points

**Value Delivered:**
- Cashless campus economy
- Student welfare enhancement
- Real-time point deduction
- Merchant integration ready

---

### 🎵 Scenario 5: Subscription Rewards

**Student Journey:**
1. **Priya accumulates 800 points** throughout the year
2. Sees "Spotify Premium 3-Month Subscription" in marketplace
3. Redeems for 750 points
4. Receives unique activation code via email/dashboard
5. Activates Spotify premium using the code

**Value Delivered:**
- Digital reward fulfillment
- Partnership with premium brands
- Non-monetary incentives
- Enhanced student experience

---

## 🏗️ High-Level Design

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CAMPUS WALLET ECOSYSTEM                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   STUDENT PORTAL     │         │    ADMIN PORTAL      │
│  (React + Vite)      │         │  (React + Vite)      │
│                      │         │                      │
│  • Dashboard         │         │  • Analytics         │
│  • Marketplace       │         │  • Student Mgmt      │
│  • Ledger/History    │         │  • Reward Mgmt       │
│  • Redemptions       │         │  • Point Allocation  │
│  • Wallet Connect    │         │  • CSV Upload        │
└──────────┬───────────┘         └──────────┬───────────┘
           │                                │
           │    HTTPS REST API              │
           ├────────────────────────────────┤
           │                                │
           ▼                                ▼
┌─────────────────────────────────────────────────────────┐
│              API GATEWAY (Express.js)                   │
│                                                         │
│  Routes:                                                │
│  • /api/auth  → Authentication & Registration          │
│  • /api/student → Student Operations                   │
│  • /api/admin → Admin Operations                       │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│          BACKEND (Clean Architecture)                   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  INTERFACES LAYER (Controllers, Middlewares)     │  │
│  │  • authController, studentController, adminCtrl  │  │
│  │  • JWT Auth Middleware, CORS, Multer            │  │
│  └──────────────────────────────────────────────────┘  │
│                      ▼                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  APPLICATION LAYER (Use Cases / Business Logic)  │  │
│  │  • Award Points, Redeem Rewards, Upload CSV      │  │
│  └──────────────────────────────────────────────────┘  │
│                      ▼                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  DOMAIN LAYER (Entities)                         │  │
│  │  • Student, Reward, Transaction, Redemption      │  │
│  └──────────────────────────────────────────────────┘  │
│                      ▼                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  INFRASTRUCTURE LAYER (Database, External APIs)  │  │
│  │  • MongoDB Models, CSV Parser, QR Generator      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │
           ┌──────────┴───────────┐
           ▼                      ▼
┌─────────────────────┐  ┌─────────────────────┐
│   MongoDB Atlas     │  │  Aptos Blockchain   │
│                     │  │                     │
│  Collections:       │  │  Smart Contract:    │
│  • users            │  │  • CampusCoin.move  │
│  • rewards          │  │                     │
│  • ledger           │  │  Features:          │
│  • redemptions      │  │  • Mint tokens      │
│                     │  │  • Transfer tokens  │
│  Indexes:           │  │  • Burn tokens      │
│  • userId+timestamp │  │  • Register wallet  │
│  • walletAddress    │  │                     │
└─────────────────────┘  └─────────────────────┘
           │                      ▲
           │                      │
           └──────────┬───────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│           WALLET ADAPTERS (Frontend)                    │
│  • Petra Wallet Adapter                                 │
│  • Martian Wallet Adapter                               │
│  • Wallet Standard Core                                 │
└─────────────────────────────────────────────────────────┘
```

---

### Component Interaction Flow

```
Student Login → JWT Token → API Call → Controller → Use Case 
    → Domain Logic → Repository → MongoDB → Response → UI Update

Blockchain Interaction:
Student → Connect Wallet → Sign Transaction → Move Contract 
    → Mint Tokens → Wallet Balance Updated → Synced with Backend
```

---

### Data Flow Diagram

```
[Student Action] 
       ↓
[Frontend Validation]
       ↓
[API Request + JWT]
       ↓
[Auth Middleware]
       ↓
[Controller Layer]
       ↓
[Business Logic Layer]
       ↓
[Database Operation] + [Blockchain Operation (Parallel)]
       ↓                         ↓
[Update MongoDB]          [Mint/Transfer Campus Coin]
       ↓                         ↓
[Success Response] ←──────┘
       ↓
[UI State Update + Toast Notification]
```

---

## 📂 Folder Structure

### Complete Project Structure

```
Aptos-Hackathon/
│
├── README.md                          # This comprehensive documentation
├── .gitignore                         # Git ignore patterns
│
├── backend/                           # Node.js Backend (Clean Architecture)
│   ├── .env                          # Environment variables (MongoDB URI, JWT secret)
│   ├── package.json                  # Backend dependencies
│   ├── package-lock.json
│   │
│   ├── src/                          # Source code root
│   │   ├── server.js                 # Entry point, Express setup, MongoDB connection
│   │   │
│   │   ├── domain/                   # DOMAIN LAYER - Core business entities
│   │   │   └── entities/             # Pure business objects (minimal logic)
│   │   │
│   │   ├── application/              # APPLICATION LAYER - Use cases
│   │   │   └── useCases/             # Business logic implementations
│   │   │                             # (e.g., AwardPointsUseCase, RedeemRewardUseCase)
│   │   │
│   │   ├── infrastructure/           # INFRASTRUCTURE LAYER - External dependencies
│   │   │   └── database/
│   │   │       └── models/           # Mongoose schema definitions
│   │   │           ├── UserModel.js           # User schema (auth, wallet, role)
│   │   │           ├── RewardModel.js         # Marketplace reward items
│   │   │           ├── LedgerModel.js         # Transaction history (EARN/REDEEM)
│   │   │           └── RedemptionModel.js     # Redemption tracking + QR codes
│   │   │
│   │   └── interfaces/               # INTERFACES LAYER - API controllers & routes
│   │       ├── controllers/          # Request handlers (business logic invoked here)
│   │       │
│   │       ├── middlewares/
│   │       │   └── authMiddleware.js # JWT verification, role-based access control
│   │       │
│   │       └── routes/
│   │           ├── authRoutes.js     # /api/auth/* (register, login)
│   │           ├── studentRoutes.js  # /api/student/* (dashboard, redeem, ledger)
│   │           └── adminRoutes.js    # /api/admin/* (award points, manage rewards)
│   │
│   ├── test-db.js                    # Database connection test script
│   └── uploads/                      # CSV file uploads from admin (attendance sheets)
│
├── Frontend/                          # React + Vite Frontend
│   ├── .env.production               # Production environment variables
│   ├── package.json                  # Frontend dependencies (React, Aptos SDK, etc.)
│   ├── package-lock.json
│   ├── vite.config.js                # Vite bundler configuration
│   ├── tailwind.config.js            # Tailwind CSS design system config
│   ├── postcss.config.js             # PostCSS + Autoprefixer
│   ├── eslint.config.js              # ESLint code quality rules
│   ├── index.html                    # HTML template
│   │
│   ├── public/                       # Static assets
│   │   └── vite.svg                  # Favicon placeholder
│   │
│   └── src/                          # Frontend source code
│       ├── main.jsx                  # React app entry point
│       ├── App.jsx                   # Root component with routing
│       ├── App.css                   # Global app styles
│       ├── index.css                 # Tailwind directives + global CSS
│       │
│       ├── aptosConfig.js            # Aptos network config, module address
│       │
│       ├── components/               # React components
│       │   ├── AptosProvider.jsx     # Wallet adapter context provider
│       │   ├── Navbar.jsx            # Top navigation bar
│       │   ├── landing.jsx           # Landing/Hero page
│       │   │
│       │   ├── common/
│       │   │   └── VantaBackground.jsx   # 3D animated background (Vanta.js)
│       │   │
│       │   ├── auth/
│       │   │   └── AuthPage.jsx      # Login + Registration form
│       │   │
│       │   ├── student/
│       │   │   ├── StudentApp.jsx           # Student route container
│       │   │   ├── StudentDashboard.jsx     # Balance, quick actions, wallet connect
│       │   │   ├── Marketplace.jsx          # Browse & redeem rewards
│       │   │   ├── Ledger.jsx               # Transaction history viewer
│       │   │   └── Redemptions.jsx          # QR codes + redemption status
│       │   │
│       │   └── admin/
│       │       ├── AdminApp.jsx             # Admin route container
│       │       ├── AdminDashboard.jsx       # Analytics overview
│       │       ├── ManageStudents.jsx       # Student list + award points
│       │       └── ManageRewards.jsx        # Create/Edit marketplace items
│       │
│       ├── hooks/                    # Custom React hooks
│       │   ├── useWalletConnection.js   # Wallet connect/disconnect logic
│       │   ├── useStudent.js            # Student API calls + state
│       │   └── useAdmin.js              # Admin API calls + state
│       │
│       └── services/
│           └── api.js                # Axios instance, API endpoints abstraction
│
├── move/                              # Aptos Move Smart Contract
│   ├── Move.toml                     # Move package manifest
│   │
│   └── sources/
│       └── CampusCoin.move           # Campus Coin token implementation
│                                     # Functions: initialize, register, mint, burn
│
└── .git/                             # Git version control
```

---

### Directory Explanations

#### **Backend Architecture (Clean Architecture Pattern)**

The backend follows **Clean Architecture** principles, separating concerns into distinct layers:

1. **Domain Layer** (`domain/entities/`)
   - Contains pure business entities with minimal dependencies
   - Represents core concepts (Student, Reward, Transaction)
   - No framework dependencies

2. **Application Layer** (`application/useCases/`)
   - Houses business logic and use case implementations
   - Examples: `AwardPointsUseCase`, `RedeemRewardUseCase`
   - Orchestrates domain entities and repositories

3. **Infrastructure Layer** (`infrastructure/`)
   - Deals with external systems (database, file system, blockchain)
   - Mongoose models, CSV parsers, QR code generators
   - Implements repository interfaces defined in domain

4. **Interfaces Layer** (`interfaces/`)
   - Controllers handle HTTP requests/responses
   - Routes define API endpoints
   - Middlewares handle cross-cutting concerns (auth, logging)

**Benefits:**
- **Testability**: Each layer can be tested independently
- **Maintainability**: Changes in one layer don't cascade
- **Flexibility**: Easy to swap databases or frameworks

---

#### **Frontend Architecture**

- **Component-Based**: Reusable UI components with clear responsibilities
- **Separation by Role**: Distinct student and admin interfaces
- **Custom Hooks**: Encapsulate reusable logic (wallet connection, API calls)
- **Service Layer**: Centralized API communication via `services/api.js`
- **Context Providers**: Wallet state management via `AptosProvider`

---

#### **Blockchain Layer**

- **Move Contract**: Implements fungible token standard for Campus Coin
- **Wallet Adapters**: Frontend libraries for Petra/Martian wallet integration
- **On-Chain Operations**: Mint, transfer, and burn tokens

---

## 🔧 Technical Architecture

### Frontend Stack

| Technology | Purpose |
|------------|---------|
| **React 19.2** | UI component library |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **React Router DOM** | Client-side routing |
| **Framer Motion** | Smooth animations |
| **Aptos Wallet Adapter** | Wallet connection abstraction |
| **Petra/Martian Adapters** | Specific wallet implementations |
| **JWT Decode** | Token parsing on client |
| **Lucide React** | Icon library |
| **Vanta.js** | 3D background effects |

**Key Features:**
- **Wallet Integration**: Seamless connection to Petra and Martian wallets
- **Responsive Design**: Mobile-first Tailwind CSS
- **Animated UI**: Framer Motion for smooth transitions
- **Protected Routes**: Role-based access (student/admin)

---

### Backend Stack

| Technology | Purpose |
|------------|---------|
| **Node.js 18+** | JavaScript runtime |
| **Express 5.1** | Web framework |
| **MongoDB 9.0** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Stateless authentication |
| **bcryptjs** | Password hashing |
| **Multer** | File upload handling (CSV) |
| **csv-parser** | Parse attendance CSVs |
| **qrcode** | QR code generation |
| **CORS** | Cross-origin resource sharing |

**Architecture Patterns:**
- **Clean Architecture**: Layered separation of concerns
- **Repository Pattern**: Abstract data access
- **Middleware Chain**: Request processing pipeline
- **JWT Authentication**: Stateless session management

---

### Blockchain Stack

| Technology | Purpose |
|------------|---------|
| **Aptos Blockchain** | L1 blockchain (testnet) |
| **Move Language** | Smart contract language |
| **Aptos TS SDK** | TypeScript SDK for Aptos |
| **Wallet Standard** | Cross-wallet compatibility |

**Smart Contract Functions:**
```move
initialize(admin: &signer)      // Deploy Campus Coin
register(account: &signer)      // Register user wallet
mint(admin, recipient, amount)  // Issue new tokens
burn(admin, amount)             // Destroy tokens
```

---

## 🗄️ Database Design

### MongoDB Collections

#### **1. Users Collection**

```javascript
{
  _id: ObjectId("..."),
  email: "student@university.edu",
  password: "$2a$10$...",              // bcrypt hashed
  name: "John Doe",
  rollNumber: "21BCE001",
  role: "student",                    // enum: ['student', 'admin']
  walletBalance: 450,                 // Off-chain points
  walletAddress: "0x1a2b3c...",       // Aptos wallet address
  authMethod: "email",                // enum: ['email', 'keyless']
  createdAt: ISODate("2024-01-15")
}
```

**Indexes:**
- `email` (unique)
- `rollNumber` (unique, sparse)
- `walletAddress` (unique, sparse)

---

#### **2. Rewards Collection**

```javascript
{
  _id: ObjectId("..."),
  name: "Spotify Premium 3-Month",
  description: "Enjoy ad-free music streaming",
  pointsCost: 750,
  category: "subscription",           // enum: ['food', 'subscription', 'event', 'coupon', 'merchandise']
  stock: 50,                          // -1 for unlimited
  active: true,
  imageUrl: "https://example.com/spotify.png",
  createdAt: ISODate("2024-02-01")
}
```

**Indexes:**
- `category`
- `active`
- `pointsCost`

---

#### **3. Ledger Collection** (Transaction History)

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),             // Reference to users
  type: "EARN",                        // enum: ['EARN', 'REDEEM']
  amount: 50,                          // Points earned/spent
  description: "AI Workshop Attendance",
  metadata: {
    event: "AI/ML Guest Lecture",
    uploadedBy: "admin@university.edu",
    csvFile: "attendance_2024_01_15.csv"
  },
  timestamp: ISODate("2024-01-15T10:30:00Z")
}
```

**Indexes:**
- `userId + timestamp` (compound, descending)
- `type`

---

#### **4. Redemptions Collection**

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  rewardId: ObjectId("..."),
  pointsSpent: 750,
  status: "approved",                  // enum: ['pending', 'approved', 'rejected', 'used']
  qrCode: "data:image/png;base64,...", // Base64 QR code image
  redemptionCode: "RDM-2024-ABC123",   // Unique code
  redeemedAt: ISODate("2024-03-01T14:20:00Z"),
  usedAt: ISODate("2024-03-02T09:00:00Z")  // When QR was scanned
}
```

**Indexes:**
- `userId + redeemedAt` (compound)
- `redemptionCode` (unique)
- `status`

---

### Entity Relationship Diagram

```
┌─────────────┐
│    Users    │
│ (students,  │
│   admins)   │
└──────┬──────┘
       │
       │ 1:N
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌─────────────┐ ┌──────────────┐
│   Ledger    │ │ Redemptions  │
│ (tx history)│ │  (QR codes)  │
└─────────────┘ └──────┬───────┘
                       │
                       │ N:1
                       ▼
                ┌──────────────┐
                │   Rewards    │
                │ (marketplace)│
                └──────────────┘
```

---

## 📡 API Documentation

### Base URL
```
Development: http://localhost:5000
Production: https://campus-wallet-api.example.com
```

---

### Authentication Endpoints

#### **POST** `/api/auth/register`

Register a new student or admin account.

**Request Body:**
```json
{
  "email": "student@university.edu",
  "password": "SecurePass123!",
  "name": "Jane Smith",
  "rollNumber": "21BCE042",
  "role": "student"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "65a1b2c3d4e5f6...",
    "email": "student@university.edu",
    "name": "Jane Smith",
    "role": "student",
    "walletBalance": 0
  }
}
```

---

#### **POST** `/api/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "student@university.edu",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65a1b2c3d4e5f6...",
    "email": "student@university.edu",
    "name": "Jane Smith",
    "role": "student",
    "walletBalance": 450,
    "walletAddress": "0x1a2b3c4d..."
  }
}
```

---

### Student Endpoints

> **Authentication Required**: Include `Authorization: Bearer <token>` header

#### **GET** `/api/student/dashboard`

Get student dashboard data (balance, recent transactions).

**Response (200 OK):**
```json
{
  "user": {
    "name": "Jane Smith",
    "walletBalance": 450,
    "walletAddress": "0x1a2b3c4d..."
  },
  "recentTransactions": [
    {
      "type": "EARN",
      "amount": 50,
      "description": "Hackathon Participation",
      "timestamp": "2024-03-01T10:30:00Z"
    }
  ]
}
```

---

#### **GET** `/api/student/rewards`

Fetch all active marketplace rewards.

**Response (200 OK):**
```json
{
  "rewards": [
    {
      "_id": "65a1b2c3...",
      "name": "₹100 Food Coupon",
      "description": "Valid at campus cafeteria",
      "pointsCost": 100,
      "category": "food",
      "stock": 50,
      "imageUrl": "https://example.com/food.png"
    }
  ]
}
```

---

#### **POST** `/api/student/redeem`

Redeem a reward using points.

**Request Body:**
```json
{
  "rewardId": "65a1b2c3d4e5f6..."
}
```

**Response (201 Created):**
```json
{
  "message": "Reward redeemed successfully",
  "redemption": {
    "_id": "65a1b2c3...",
    "redemptionCode": "RDM-2024-XYZ789",
    "qrCode": "data:image/png;base64,iVBORw0KGgo...",
    "status": "approved"
  },
  "newBalance": 350
}
```

---

#### **GET** `/api/student/ledger`

Get complete transaction history.

**Response (200 OK):**
```json
{
  "transactions": [
    {
      "type": "EARN",
      "amount": 100,
      "description": "Quiz Winner - Data Structures",
      "timestamp": "2024-02-28T15:00:00Z"
    },
    {
      "type": "REDEEM",
      "amount": 75,
      "description": "Redeemed: Event Pass",
      "timestamp": "2024-03-01T10:00:00Z"
    }
  ]
}
```

---

#### **GET** `/api/student/redemptions`

Get all user redemptions with QR codes.

**Response (200 OK):**
```json
{
  "redemptions": [
    {
      "_id": "65a1b2c3...",
      "reward": {
        "name": "Tech Fest VIP Pass"
      },
      "redemptionCode": "RDM-2024-ABC123",
      "qrCode": "data:image/png;base64,...",
      "status": "used",
      "redeemedAt": "2024-03-01T14:20:00Z",
      "usedAt": "2024-03-02T09:00:00Z"
    }
  ]
}
```

---

### Admin Endpoints

> **Authentication Required**: Admin role + JWT token

#### **GET** `/api/admin/students`

Get all registered students.

**Response (200 OK):**
```json
{
  "students": [
    {
      "_id": "65a1b2c3...",
      "name": "Jane Smith",
      "email": "student@university.edu",
      "rollNumber": "21BCE042",
      "walletBalance": 450,
      "walletAddress": "0x1a2b3c4d..."
    }
  ]
}
```

---

#### **POST** `/api/admin/award-points`

Award points to a specific student.

**Request Body:**
```json
{
  "studentId": "65a1b2c3d4e5f6...",
  "points": 100,
  "description": "Excellent Project Presentation",
  "walletAddress": "0x1a2b3c4d..."
}
```

**Response (200 OK):**
```json
{
  "message": "Points awarded successfully",
  "newBalance": 550,
  "onChainSuccess": true
}
```

---

#### **POST** `/api/admin/upload-csv`

Bulk award points via CSV upload.

**Request**: Multipart form data
- `file`: CSV file with columns `rollNumber`, `points`, `description`

**CSV Format:**
```csv
rollNumber,points,description
21BCE001,50,AI Workshop Attendance
21BCE042,50,AI Workshop Attendance
21BCE103,50,AI Workshop Attendance
```

**Response (200 OK):**
```json
{
  "message": "CSV processed successfully",
  "results": {
    "successful": 3,
    "failed": 0,
    "details": [
      {
        "rollNumber": "21BCE001",
        "success": true,
        "newBalance": 500
      }
    ]
  }
}
```

---

#### **POST** `/api/admin/rewards`

Create a new marketplace reward.

**Request Body:**
```json
{
  "name": "Amazon Gift Card ₹500",
  "description": "E-voucher sent via email",
  "pointsCost": 500,
  "category": "coupon",
  "stock": 100,
  "imageUrl": "https://example.com/amazon.png"
}
```

**Response (201 Created):**
```json
{
  "message": "Reward created successfully",
  "reward": {
    "_id": "65a1b2c3...",
    "name": "Amazon Gift Card ₹500",
    "pointsCost": 500
  }
}
```

---

#### **GET** `/api/admin/analytics`

Get system-wide analytics.

**Response (200 OK):**
```json
{
  "totalUsers": 1250,
  "totalPointsIssued": 125000,
  "totalRedemptions": 340,
  "activeRewards": 15
}
```

---

## ✨ Features

### Student Features

| Feature | Description |
|---------|-------------|
| 🔐 **Secure Login** | JWT-based authentication with bcrypt password hashing |
| 👛 **Wallet Connection** | Connect Petra or Martian wallet for on-chain operations |
| 💰 **Point Balance** | Real-time off-chain and on-chain balance tracking |
| 🛒 **Marketplace** | Browse rewards across categories (food, events, subscriptions) |
| 🎁 **Redemption** | One-click reward redemption with instant QR generation |
| 📊 **Transaction Ledger** | Complete audit trail of all EARN/REDEEM transactions |
| 📱 **QR Codes** | Digital QR passes for redemption validation |

---

### Admin Features

| Feature | Description |
|---------|-------------|
| 📈 **Analytics Dashboard** | Real-time stats (users, points issued, redemptions) |
| 👥 **Student Management** | View all students with wallet addresses and balances |
| ⚡ **Point Allocation** | Award points manually or via CSV bulk upload |
| 🎫 **Reward Management** | Create, edit, and manage marketplace items |
| 📄 **CSV Upload** | Bulk import attendance sheets for automated rewards |
| 💳 **Blockchain Integration** | Mint tokens directly to student wallets |

---

### Blockchain Features

| Feature | Description |
|---------|-------------|
| 🪙 **Campus Coin (CAMP)** | Fungible token on Aptos blockchain |
| 🏦 **On-Chain Minting** | Admin mints tokens to student wallets |
| 🔗 **Transparent Ledger** | All transactions visible on Aptos Explorer |
| 🔒 **Immutable Records** | Cryptographic proof of point allocation |

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** 6+ (Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Aptos CLI** ([Installation Guide](https://aptos.dev/cli-tools/aptos-cli-tool/install-aptos-cli))
- **Petra Wallet** or **Martian Wallet** browser extension

---

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/campus-wallet.git
cd campus-wallet/backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your configuration:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus_wallet
# JWT_SECRET=your_super_secret_key_here
# PORT=5000

# 4. Test database connection (optional)
node test-db.js

# 5. Start development server
npm run dev
# Server running on http://localhost:5000
```

**Environment Variables:**
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_min_32_chars
PORT=5000
NODE_ENV=development
```

---

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd ../Frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create .env file with:
# VITE_API_URL=http://localhost:5000
# VITE_APTOS_MODULE_ADDRESS=0x...

# 4. Start development server
npm run dev
# Frontend running on http://localhost:5173
```

**Environment Variables:**
```env
VITE_API_URL=http://localhost:5000
VITE_APTOS_MODULE_ADDRESS=0xYOUR_MODULE_ADDRESS
VITE_APTOS_NETWORK=testnet
```

---

### Move Contract Deployment

```bash
# 1. Navigate to move directory
cd ../move

# 2. Initialize Aptos CLI (if not done)
aptos init --network testnet

# 3. Compile the contract
aptos move compile

# 4. Deploy to testnet
aptos move publish \
  --named-addresses campus_wallet=YOUR_ACCOUNT_ADDRESS

# 5. Initialize Campus Coin
aptos move run \
  --function-id YOUR_MODULE_ADDRESS::campus_coin::initialize

# 6. Copy module address to Frontend/.env
# VITE_APTOS_MODULE_ADDRESS=0xYOUR_MODULE_ADDRESS
```

---

### Database Initialization

MongoDB collections are auto-created on first use. Optional: Create indexes manually.

```javascript
// In MongoDB shell or Compass
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ rollNumber: 1 }, { unique: true, sparse: true });
db.ledger.createIndex({ userId: 1, timestamp: -1 });
db.redemptions.createIndex({ redemptionCode: 1 }, { unique: true });
```

---

## 🔄 Workflows

### User Registration Flow

```
┌─────────────────┐
│ Student visits  │
│  /auth page     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Fills form:     │
│ • Email         │──────┐
│ • Password      │      │ Frontend Validation
│ • Name          │      │ (regex, required fields)
│ • Roll Number   │      │
└────────┬────────┘      │
         │◄──────────────┘
         ▼
┌─────────────────┐
│ POST /api/auth/ │
│    register     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Backend checks: │
│ • Unique email  │
│ • Hash password │
│ • Save to DB    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Return JWT +    │
│  user object    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Store token in  │
│  localStorage   │
│ Redirect to     │
│  /student       │
└─────────────────┘
```

---

### Point Earning Workflow (CSV Upload)

```
┌──────────────────┐
│ Admin uploads    │
│ attendance CSV   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ POST /api/admin/ │
│   upload-csv     │
│ (Multer handles  │
│  file upload)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Parse CSV:       │
│ csv-parser lib   │
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│ For each row:        │
│ 1. Find user by roll │
│ 2. Update balance    │
│ 3. Create ledger     │
│ 4. Mint on-chain     │
└────────┬─────────────┘
         │
         ▼
┌──────────────────┐
│ Return success   │
│ summary with     │
│ successes/fails  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Admin sees       │
│ results table    │
│ in UI            │
└──────────────────┘
```

---

### Redemption Workflow

```
┌────────────────────┐
│ Student browses    │
│   marketplace      │
└──────────┬─────────┘
           │
           ▼
┌────────────────────┐
│ Clicks "Redeem"    │
│ on reward card     │
└──────────┬─────────┘
           │
           ▼
┌────────────────────┐
│ POST /api/student/ │
│     redeem         │
│ { rewardId }       │
└──────────┬─────────┘
           │
           ▼
┌─────────────────────────┐
│ Backend validation:     │
│ • Check balance >= cost │
│ • Check stock > 0       │
│ • Check reward active   │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ Transaction:            │
│ 1. Deduct points        │
│ 2. Create redemption    │
│ 3. Generate QR code     │
│ 4. Create ledger entry  │
│ 5. Decrement stock      │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ Return QR code +        │
│ redemption details      │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ Student sees QR code    │
│ on screen (can save)    │
└─────────────────────────┘
```

---

## 🔒 Security

### Authentication & Authorization

- **JWT Tokens**: Stateless authentication with 24-hour expiry
- **Password Hashing**: bcrypt with 10 salt rounds
- **Role-Based Access Control**: Middleware checks user role for admin routes
- **Protected Routes**: Frontend route guards based on authentication status

### Input Validation

- **Email Regex**: Validates university email format
- **Password Strength**: Minimum 8 characters (enforced client + server)
- **SQL Injection**: N/A (MongoDB with Mongoose ODM)
- **XSS Protection**: React auto-escapes JSX output

### Wallet Security

- **Signature Verification**: Blockchain transactions require wallet signature
- **Address Validation**: Aptos address format validation
- **Admin Whitelist**: Only whitelisted admin wallet can mint tokens

---

## 🛣️ Future Roadmap

- [ ] **Mobile App** - React Native iOS/Android app
- [ ] **NFC Card Integration** - Physical student ID card redemption
- [ ] **Email Notifications** - Point earning/redemption alerts
- [ ] **Partner Integrations** - Swiggy, Amazon, Spotify direct vouchers
- [ ] **Multi-University Support** - SaaS model with tenant isolation
- [ ] **Advanced Analytics** - Student engagement heatmaps, reward popularity
- [ ] **Gamification** - Leaderboards, badges, achievement unlocks
- [ ] **AI-Powered Recommendations** - Personalized reward suggestions
- [ ] **Mainnet Deployment** - Migrate from Aptos testnet to mainnet
- [ ] **Decentralized Governance** - Student voting for new reward categories

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

Please ensure:
- Code follows existing style conventions
- All tests pass
- Documentation is updated for new features

---

## 📧 Contact & Support

**Project Maintainer**: Akshat Baranwal  
**GitHub**: [@Akshatb2006](https://github.com/Akshatb2006)  
**Repository**: [Aptos-Hackathon](https://github.com/Akshatb2006/Aptos-Hackathon)  

For issues and feature requests, please open an issue on GitHub.

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Aptos Foundation** - For blockchain infrastructure
- **VIT University** - Inspiration for campus use case
- **Open Source Community** - For amazing libraries and tools

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Built with ❤️ for the Aptos Hackathon

</div>

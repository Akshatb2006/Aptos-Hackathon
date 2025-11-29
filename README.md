# 🎓 Campus Wallet — Student Reward & Engagement Platform

A smart university wallet system that rewards students for academic participation and lets them redeem points for perks like event passes, food coupons, digital subscriptions (Coursera/Spotify), library credits, and more.

Built for **Aptos** using **Photon** (wallet + identity), **Event-Sourced Ledger**, and optional blockchain tokenization for **CPT (Campus Token)**.

---

## 🚀 Features

| Module | Description |
|--------|-------------|
| 🎓 **Student Wallet** | Login via Photon → wallet generated automatically |
| 🏆 **Reward System** | Earn points for attendance, quizzes, assignments & events |
| 🎫 **Redemption Store** | Redeem points for rewards + generate QR passes |
| 🧾 **Ledger System** | Append-only event ledger for complete audit history |
| ⚡ **Real-time Balance** | Redis projection for instant UI updates |
| 🔐 **Admin Console** | Attendance upload + reward approvals |
| 🧩 **Blockchain Ready** | Optional Move + Decibel token mint + Geomi/Shelby relays |

---

## 🏗 Architecture Overview
```
Frontend (Next.js + Photon SDK)
        ↓ Auth / Wallet
API Gateway (REST/GraphQL)
        ↓
Backend Services (Node.js)
  • Reward Engine
  • Ledger Service (Event-Sourced)
  • Redemption Engine
  • Admin Panel Backend
        ↓
PostgreSQL EventStore + Redis Cache
        ↓
(Optionally)
Aptos Blockchain + Move Token + Decibel + Shelby/Geomi
```

📷 **Diagram available in repo** → `/docs/architecture/System_Architecture.png`

---

## 🔥 Core Workflows

### Reward Allocation Flow

1. Attendance/Quiz recorded
2. Reward Engine validates
3. Ledger logs immutable event
4. Projection worker updates Redis
5. UI balance updates instantly

📷 **Reward_Workflow_Clean.png**

---

### Redemption Flow

1. User selects reward to redeem
2. Backend verifies balance
3. Ledger stores deduction event
4. QR pass generated
5. Scanner validates QR
6. Redemption marked completed

📷 **Redemption_Workflow_Clean.png**

---

## 📂 Project Folder Structure
```
/frontend (Next.js + Photon)
/backend
  ├── api
  ├── services
  ├── workers
  ├── prisma | knex migrations
/docs
  ├── architecture/
  ├── workflow/
  ├── db-schema/
```

---

## 🗄 Database Design (Event Sourced)

| Table | Purpose |
|-------|---------|
| `users` | Photon ID, wallet address |
| `reward_events` | Append-only event history |
| `reward_store` | Redeemable items |
| `redemptions` | QR-based claims |
| `ledger_projection` | Cached balances for fast UI |

> **Event history = truth**  
> **Projection = fast access** ⚡

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React.js + Tailwind + Photon SDK |
| **Backend** | Node.js + Express/NestJS |
| **Database** | MongoDB + Redis |
| **Ledger Model** | Event Sourcing Pattern |
| **Optional** | Aptos Move + Decibel + Geomi/Shelby RPC |

---

## 🚀 Getting Started

### Backend Setup
```bash
git clone https://github.com//campus-wallet.git
cd campus-wallet/backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🏁 Demo Flow

| Action | Result |
|--------|--------|
| Student logs in | Wallet auto-generated |
| QR redeemed at event | Balance deducted |
| Admin uploads attendance | Points rewarded system-wide |

---

## 🎫 Redemption Marketplace

Students can exchange points for non-monetary perks:

- 🎟 Event passes
- 🍔 Food coupons
- 📚 Print credits/library hours
- 🎵 Spotify/Coursera/OTT plans
- ⚡ Priority access & fast-track entry

### Redemption AC

- Points deducted atomically
- Reward inventory reduced (if applicable)
- Auto-QR/ticket generation
- Status = `Pending` → `Approved` → `Fulfilled`

---

## 🍀 Roadmap

- [ ] Mobile App (React Native)
- [ ] NFC Card Access
- [ ] Multi-university Cloud Dashboard
- [ ] Partner integrations (Swiggy, Amazon Vouchers, Spotify Student Packs)

---

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check [issues page](https://github.com/<your-repo>/campus-wallet/issues).

---

## 📧 Contact

**Project Maintainer** - [@yourhandle](https://github.com/yourhandle)  
**Project Link** - [https://github.com/<your-repo>/campus-wallet](https://github.com/<your-repo>/campus-wallet)

---

<div align="center">
  <strong>⭐ Star this repo if you find it helpful!</strong>
</div>

# 🛒 Botsch – Secure E-Commerce Checkout (SECOC) System

A modern, highly secure, and responsive e-commerce web application with integrated multi-gateway payment processing (Stripe & PayPal). Built for seamless online checkout experiences, robust order handling, and end-to-end data protection.

---

## 🔐 Key Highlights

- ✅ Stripe & PayPal integration with tokenized checkout (PCI DSS compliant)
- ✅ HTTP-only secure cookie authentication
- ✅ GDPR & CCPA-oriented privacy practices
- ✅ Responsive frontend (mobile-first) using React + TailwindCSS
- ✅ Role-based access control (Admin & Users)
- ✅ AES encryption on sensitive address fields (optional)
- ✅ Bcrypt hashing for passwords
- ✅ Order verification after payment using session-based validation (no card data ever stored)

---

## 🏗️ Project Structure

```
ecommerce1/
├── client/                # React frontend (Vite)
│   ├── components/        # Reusable UI components
│   ├── Pages/             # Page-level views (Login, Checkout, Admin)
│   ├── redux/             # Global state using Redux Toolkit
│   └── App.jsx            # Main App structure & routes
│
├── server/                # Express backend
│   ├── controllers/       # Business logic (auth, payments, orders)
│   ├── routes/            # Route definitions
│   ├── models/            # Mongoose schemas
│   ├── middlewares/       # Auth & error handling
│   └── server.js          # Backend entry point
│
├── .env                   # Environment variables (Stripe keys, DB URI)
└── README.md              # Project documentation
```

---

## ⚙️ Technologies Used

- **Frontend**: React, TailwindCSS, Redux Toolkit, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Payments**: Stripe, PayPal
- **Security**:
  - AES Encryption (`mongoose-encryption`)
  - Bcrypt (password hashing)
  - HTTP-only cookies
  - Environment-secured API keys

---

## 💳 Payment Architecture

```
[ Client React App ]
     |
     |---> PayPal Checkout (Tokenized)
     |---> Stripe Session (Secure URL)
     |
     ↓
[ Express Server (No card data stored) ]
     |
     |---> Verifies sessionId from Stripe or PayPal
     |
     ↓
[ MongoDB ]
  - Saves safe transaction ID & marks order paid
```

---

## 🔧 Setup Instructions

### 1. Clone the Project

```bash
git clone https://github.com/yourusername/botsch-ecommerce.git
cd ecommerce1
```

### 2. Environment Configuration

Create a `.env` file inside the `server/` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

### 3. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 4. Run the Project

```bash
# Run backend
cd server
node server.js

# Run frontend
cd ../client
npm run dev
```

---

## 📦 Core Features

- 🔐 Auth: Login, Signup, Logout with JWT in HTTP-only cookies
- 🛍️ Cart & Checkout: Add/remove items, dynamic total, live checkout
- 🧾 Orders: Order history, status, and tracking
- 🧑‍💼 Admin Panel:
  - View all orders
  - Manage users/products
  - Confirm payments
- 💳 Payment Flow:
  - Stripe: Session URL → Success page → Payment verification via session_id
  - PayPal: Frontend SDK → Order captured → ID verified → Order marked

---

## 🔒 Data Privacy & Security

- 🔐 No card data stored (Tokenized by Stripe/PayPal)
- 🔐 AES-encrypted fields (e.g., address, phone)
- 🔐 Passwords hashed with bcrypt
- 🔐 Secure environment variables
- 🔐 HTTP-only & SameSite cookies
- 🔐 GDPR / CCPA-compliant design

---

## 🚀 Performance & Scalability

- ⚡ Vite = ultra-fast dev & build
- ⚡ Redux Toolkit = efficient global state
- ⚡ Modular codebase = scalable structure

---

## 📈 Future Enhancements

- 🔁 Razorpay integration
- 🔁 OTP-based email/SMS verification
- 🔁 Webhooks for Stripe/PayPal
- 🔁 Product reviews & rating system
- 🔁 Admin analytics dashboard

---

## 👨‍💻 Author

**Name**: [Your Name]  
**GitHub**: [github.com/yourusername](https://github.com/yourusername)  
**Email**: your.email@example.com

---

## 📜 License

MIT License. Use freely, credit appreciated!

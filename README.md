# 💎 GlowUp - Luxury Jewelry Platform: Admin & Vendor Portal

> ✨ *The command center of the GlowUp ecosystem—powering real-time analytics, 3D/AR asset pipelines, multi-vendor finances, and generative AI design processing.*

Welcome to the **GlowUp Admin & Vendor Portal**. This is the administrative web interface of the GlowUp Luxury Jewelry platform. Built as a high-performance Single Page Application (SPA), it connects directly to our Firebase backend to manage product catalogs, orchestrate AR virtual try-on assets, process custom generative AI designs, oversee multi-vendor financials, and provide real-time chat support to mobile app users.

---

## 💎 GlowUp Unified Platform Architecture

The GlowUp platform is a cohesive, full-stack ecosystem consisting of four main components. Whether you are working on the client app or this admin portal, the system operates as a unified entity:

```mermaid
graph TD
    subgraph Client_Layer ["Client Layer"]
        App["📱 Flutter Client App<br>(iOS & Android)"]
        Admin["💻 React + Vite Admin Portal<br>(Web Webpage)"]
    end

    subgraph Firebase_Cloud_Services ["Firebase Cloud Services (Project: jewelry-ai-app-bba3d)"]
        Auth["🔐 Firebase Authentication<br>(Role-based Access Control)"]
        DB[("🔥 Cloud Firestore<br>(Real-time Database)")]
        Storage[("📦 Cloud Storage<br>(Product Media & 3D GLB models)")]
        Funcs["⚡ Serverless Cloud Functions<br>(Commissions, Analytics, Push Schedulers)"]
    end

    subgraph AI_Search_Engine ["AI & Search Engine"]
        AIVision["🤖 Python FastAPI Service<br>(SentenceTransformer CLIP Engine)"]
        VectorDB[("🔍 Qdrant Vector DB<br>(Semantic Embeddings Store)")]
    end

    %% Interactions
    App -->|Auth & Sync| Auth
    App -->|Reads/Writes Data| DB
    App -->|Fetches media & 3D| Storage
    App -->|Triggers serverless logic| Funcs
    App -->|Sends images for Search/Scan| AIVision

    Admin -->|Superadmin Login & RBAC| Auth
    Admin -->|Live DB Updates & Support Chat| DB
    Admin -->|Uploads Banners & 3D Models| Storage
    Admin -->|Triggers Financial Ledgers| Funcs

    AIVision -->|Connects & Indexes| VectorDB
    Funcs -->|Invokes AI models| AIVision
```

> [!IMPORTANT]
> **Companion Codebase Notice**  
> This admin panel is only half of the story. The mobile application, serverless backend functions, and visual search service live in the **`jewelry_app`** repository.
> To run or understand the client-facing e-commerce app and AI services, please read the [jewelry_app README](file:///c:/Users/Admin/AndroidStudioProjects/jewelry_app/README.md).

---

## 🧩 Core Admin Features

The GlowUp Admin Portal provides comprehensive tools for platform administrators and marketplace vendors:

### 📈 Real-Time Dashboard Stats
- Displays live sales metrics, customer registration trends, and order volumes.
- Uses **Recharts** to compile elegant visual reports on daily/monthly revenue.
- Monitors active vendor performances, commission splits, and platform transaction fees.

### 📦 Products & Catalog Manager
- Complete CRUD operations for premium jewelry lines.
- Specialized attributes configuration including size, material (e.g., Yellow Gold, White Silver, Rose Gold), purity (18K, 22K, 24K), and stock levels.
- Upload and host multi-angle high-resolution product photography.

### 🕶️ AR Media Hub
- The control room for our virtual try-on technology.
- Allows administrators to upload, manage, and link **3D Models (`.glb` / `.gltf` format)** and custom AR reference markers.
- The assets uploaded here are instantly streamed into the Flutter client app for real-time customer try-ons.

### 🧠 AI Custom Designs Console
- Manages generative AI custom design requests created by shoppers in the mobile app.
- Admins can inspect the customer's text prompt, the generated design preview, and custom reference metrics.
- Allows updates to the review status (e.g., *Under Review*, *Quoted*, *Approved*, *Manufacturing*, *Shipped*) and pricing updates for manufacturing.

### 💸 Multi-Vendor Financial Ledger
- Automated ledger tracking vendor balances, marketplace commission structures, and payouts.
- Processes withdrawal requests submitted by vendors.
- Calculates and logs transaction fees and affiliate commission logs.

### 💬 Real-Time Live Support Console
- A highly reactive customer support console.
- Leverages Firestore listeners to establish instant, two-way chat connections with active app shoppers.
- Features quick-reply macros, custom product recommendation card sharing, and session tracking.

### ⚙️ Platform Settings
- Multi-language interface switching between **English (en)** and **Vietnamese (vi)**.
- Dark/Light premium interface mode switcher.
- Configures global coupon codes, promotional banner carousels, and marketplace policies.

---

## 🛠️ Tech Stack & Key Libraries

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/) (Lightning-fast HMR and build speeds).
- **Styling**: Premium custom HSL-tailored vanilla CSS layout, featuring dark-mode native themes and luxury glassmorphism transitions.
- **Backend SDK**: [Firebase Web SDK v12](https://firebase.google.com/docs/web/setup) (Authentication, Firestore, Storage).
- **Data Visualization**: [Recharts v2](https://recharts.org/) (Interactive SVG charts).
- **Icons**: [Lucide React](https://lucide.dev/) (Clean minimalist vector icons).
- **Linter**: ESLint with flat config style.

---

## ⚙️ Quick Start Guide

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18.0.0 or higher) installed on your development machine.

### 2. Installation
Navigate to the root directory and install dependencies:
```bash
npm install
```

### 3. Setup Firebase Credentials
Create a `.env` file in the root directory (or update your environment settings) with your Firebase project configurations:
```env
VITE_FIREBASE_API_KEY=AIzaSyA-kgFaCuV_-bocHxtRQ_HwOiashSk2qE0
VITE_FIREBASE_AUTH_DOMAIN=jewelry-ai-app-bba3d.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=jewelry-ai-app-bba3d
VITE_FIREBASE_STORAGE_BUCKET=jewelry-ai-app-bba3d.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=79453872525
VITE_FIREBASE_APP_ID=1:79453872525:web:48351645a932695f151dc4
```

### 4. Create an Admin Account
To log in, your user must exist in the Firebase Auth database and have a matching document in the `admins` Firestore collection. 
We have provided a automated credential bootstrapping script. Run it using node:
```bash
node create_admin.js
```
*Note: This will bootstrap a superadmin account with the email `huyadmin@gmail.com` and password `123456`. You can change these details inside [create_admin.js](file:///c:/Users/Admin/AndroidStudioProjects/jewelry_admin/create_admin.js) before running.*

### 5. Running the Application
Launch the Vite local development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 6. Building for Production
To build the application for hosting (e.g., Firebase Hosting):
```bash
npm run build
```
The compiled, optimized bundle will be generated inside the `/dist` directory.

---

## 🔗 Integrated Ecosystem Workflows

To understand how this admin portal connects seamlessly to the Flutter application, review these integrated workflows:

```
[Customer Mobile App] ──(Generates Custom AI Prompt)──> [Firestore DB] ──> [Admin Panel Hub]
                                                                                │
                                                                       (Admin Reviews & Quotes)
                                                                                │
                                                                                ▼
[Customer Checkout] <──(Notified via Cloud Push) <────── [Firestore DB] <───────┘
```

1. **AR Asset Streaming**: Admin uploads a `.glb` jewelry 3D file to the **AR Media Hub** ➡️ It is saved in Firebase Storage and linked to a Product ID in Firestore ➡️ Shopper browses the product on their Android/iOS device and taps **"AR Try-On"** ➡️ Flutter app stream-loads the 3D model and maps it to the camera viewfinder.
2. **AI Generative Design Review**: Customer prompts the generative AI stylist inside the Flutter app ➡️ The custom drawing and parameters are stored in Firestore ➡️ Admin receives an alert in the **AI Custom Designs** tab ➡️ Admin determines price, reviews constraints, and updates status ➡️ Customer receives a real-time order update.
3. **Live Chat Routing**: Shopper taps **"Chat Support"** inside Flutter app ➡️ Firestore establishes a document inside the `chats` collection ➡️ Admin Support Console receives a visual "Unread Chat" trigger ➡️ Admin replies from their web console ➡️ The customer's mobile device renders the reply within milliseconds.

---

> **Developer Note**  
> All updates to layout and forms must adhere to the high-end minimalist design aesthetics. Keep spacing consistent and use the HSL-defined custom properties in `src/index.css`.

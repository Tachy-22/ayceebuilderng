# Ayceebuilder Nigeria - eCommerce Platform for Construction Materials

## Overview

Ayceebuilder Nigeria is a modern and fully functional eCommerce platform designed for purchasing construction materials. Built using **Next.js, Radix UI, and Tailwind CSS**, it provides a seamless and aesthetically pleasing shopping experience for contractors, builders, and homeowners.

## Features

### Core Features

- **User Authentication** (Email & Password, Social Login)
- **Product Listings & Advanced Filtering** (Category, Price, Rating, etc.)
- **Product Details Page** (Images, Specifications, Vendor Info, Reviews)
- **Shopping Cart & Checkout** (Discounts, Payment Gateway Integration)
- **Order Management** (Order Tracking, Invoice Download)
- **Vendor Dashboard** (Product Management, Sales Analytics)
- **Admin Panel** (User & Vendor Management, Reports, Transaction Monitoring)
- **Customer Support** (Live Chat, FAQs, Contact Support)

### Additional Feature

#### **Delivery Cost Calculator**

A **Delivery Cost Calculator** helps users estimate delivery costs based on:

- Distance from depot to delivery location
- Weight & volume of materials
- Transportation type (truck, van, etc.)
- Dynamic pricing based on logistics & fuel costs

Users can access this tool on the checkout page and a separate **Delivery Estimator** page.

## Tech Stack

- **Frontend:** Next.js, TypeScript, Radix UI, Tailwind CSS, Framer Motion
- **Backend:** Firebase (Authentication, Firestore Database)
- **Payments:** Stripe, Flutterwave, Paystack
- **Hosting:** Vercel (for frontend), Firebase Hosting (for backend API)

## Installation & Setup

### **1. Clone the Repository**

```sh
 git clone https://github.com/your-username/Ayceebuilder-nigeria.git
 cd Ayceebuilder-nigeria
```

### **2. Install Dependencies**

```sh
npm install  # or yarn install
```

### **3. Set Up Environment Variables**

Create a `.env.local` file and add the following:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_key
```

### **4. Run the Development Server**

```sh
npm run dev  # or yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Deployment

This project is deployed using **Vercel**. To deploy manually:

```sh
vercel --prod
```

## Contribution Guidelines

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit (`git commit -m "Added new feature"`).
4. Push to your fork (`git push origin feature-name`).
5. Submit a Pull Request.

## License

This project is licensed under the **MIT License**.

---

For any inquiries or support, please contact [support@Ayceebuilder.ng](mailto:support@Ayceebuilder.ng).
#   a y c e e b u i l d e r n g  
 
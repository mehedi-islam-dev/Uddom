# 🎓 Uddom Academic Care

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

**🔴 Live Demo:** [Visit Uddom Academic Care](https://uddomacademiccare.vercel.app)

A comprehensive, full-stack educational platform built for **Uddom Academic Care**. This platform features a public-facing dynamic website for students and a robust admin dashboard for complete content management.

## ✨ Key Features

* **🌐 Bilingual Support (i18n):** Seamlessly switch between English and Bengali using next-intl.
* **⚡ Real-Time Dynamic Frontend:** The Hero section, statistics, faculty members, and notices fetch live data directly from the database without aggressive caching.
* **🎉 Special Offer Banner:** An animated, toggleable promotional banner controlled directly from the admin panel.
* **🔐 Secure Admin Dashboard:** Manage Site Settings, Teachers, Students, and Notices through an intuitive UI.
* **📱 Fully Responsive Design:** Modern and elegant UI built with Tailwind CSS and Lucide React icons, ensuring a perfect view on all devices.

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide React
* **Backend:** Next.js API Routes
* **Database:** MongoDB, Mongoose
* **Language:** TypeScript

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Installation

1. Clone the repository:
    git clone https://github.com/mehedi-islam-dev/Uddom
    cd Uddom

2. Install dependencies:
    npm install

3. Set up Environment Variables:
    Create a .env file in the root directory and add your MongoDB URI:
    MONGODB_URI=your_mongodb_connection_string_here

4. Run the development server:
    npm run dev

Open http://localhost:3000 with your browser to see the result.

## 📂 Project Structure

* `/app` - Next.js App Router pages, localized routes, and APIs.
* `/components` - Reusable UI components.
* `/models` - Mongoose database schemas.
* `/lib` - Helper functions and TypeScript interfaces.
* `/public` - Static assets.

---
*Built with ❤️ for Uddom Academic Care.*
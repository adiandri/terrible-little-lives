# Terrible Little Lives (Mobile Web Prototype)

> A gothic horror life simulator inspired by *BitLife*. How long can your soul endure?

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 📱 Quick Start: Play Locally Right Now

Because this prototype is built with modern zero-dependency web technologies (HTML5, Tailwind CSS, Lucide icons, and Web Audio API):

1. Navigate into the `terrible-little-lives` folder.
2. Double-click `index.html` to open it in Google Chrome, Microsoft Edge, or Safari.
3. **To see it in mobile view on your desktop**:
   * Press `F12` to open DevTools.
   * Click the **Toggle Device Toolbar** icon (`Ctrl+Shift+M` / `Cmd+Shift+M`).
   * Select **iPhone 14 Pro** or **Pixel 7**.

---

## 🚀 How to Deploy to GitHub & Vercel (Free & Under 2 Minutes)

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Name your repo `terrible-little-lives` (Public or Private).
3. Push this directory to your repository:
   ```bash
   cd terrible-little-lives
   git init
   git add .
   git commit -m "feat: initial playable prototype of Terrible Little Lives"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/terrible-little-lives.git
   git push -u origin main
   ```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** → **"Project"**.
3. Select your `terrible-little-lives` repository and click **"Import"**.
4. Leave all build settings at default (Vercel automatically detects static HTML/JS).
5. Click **"Deploy"**.

Your game is now live with an SSL URL: `https://terrible-little-lives.vercel.app`!

---

## 📲 Install on Mobile as a Fullscreen App (PWA)

Once live on your Vercel URL, you and your playtesters can install it directly without an app store:

* **On iPhone (iOS Safari)**:
  1. Open your Vercel URL in Safari.
  2. Tap the **Share** button (box with an arrow pointing up).
  3. Scroll down and tap **"Add to Home Screen"**.
* **On Android (Chrome)**:
  1. Open your Vercel URL in Chrome.
  2. Tap the three dots menu `⋮` in the top right.
  3. Tap **"Add to Home screen"** or **"Install app"**.

The game will now launch fullscreen without browser bars, displaying its custom icon.

---

## ⚙️ Architecture & Adding New Horror Content

* **`index.html`**: The mobile viewport chassis, responsive bottom sheet, and "Ashen Archive" dark styling.
* **`js/events.js`**: Declarative database of horror events:
  * `AMBIENT_YEAR_EVENTS`: Quick one-liner journal entries for annual progression.
  * `INTERACTIVE_DILEMMAS`: Decision points with narrative choices, stat impacts, and death triggers.
* **`js/names.js`**: Gothic names, ominous birthplaces, and eerie birth origins.
* **`js/audio.js`**: Procedural synthesizer using the Web Audio API (heartbeats, clock ticks, low-dread bass drones, discord whispers, death chimes).
* **`js/game.js`**: State machine, age progression loop, mortality checks, and `localStorage` auto-save.

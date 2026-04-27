# 📸 Professional Image Carousel

A high-performance, responsive image carousel built with **React**, **TypeScript**, and **SASS**. This project features a seamless infinite loop implementation using the "Triple Buffer" technique, providing a premium user experience without any layout shifts or animation stutters.

## ✨ Key Features

- **Seamless Infinite Loop:** Uses a triple-buffer array method (`[...images, ...images, ...images]`) to ensure the scroll never ends and transitions smoothly in both directions.
- **Smart "Teleportation" Logic:** Leverages the `onTransitionEnd` event to instantly reset the scroll position, creating a perfect illusion of an infinite track.
- **Fully Responsive:** - **Desktop:** 5 items visible
  - **Tablet:** 3 items visible
  - **Mobile:** 1 item visible
- **Selection System:** Interactive cards with a selection state. Users can click to select/deselect images, with chosen URLs displayed in a dedicated summary section below.
- **Premium UI/UX:** - Smooth `cubic-bezier` animations.
  - Interactive hover effects (zoom and info overlay).
  - Selection badges with "pop" animations.
  - Handled loading states with `lazy` loading for images.

## 🛠 Tech Stack

- **React 18** (Hooks: `useState`, `useEffect`, `useRef`, `useCallback`)
- **TypeScript** (Strict typing for API data and component props)
- **SASS (SCSS)** (Advanced nesting, variables, and BEM-inspired architecture)
- **Picsum Photos API** (Dynamic image source)

## 🚀 Getting Started

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>

   ```

2. **Install dependencies:**

   ```bash
   npm install

   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🌐 Live Demo

You can check out the live version of the project here:  
[https://image-carousel-wheat.vercel.app/](https://image-carousel-wheat.vercel.app/)

## ⚙️ How the Infinite Loop Works

To avoid the "jumpy" behavior common in basic sliders, this carousel renders the image set three times. The viewport starts at the beginning of the second (middle) set.

- When a user moves to the third set, the component waits for the animation to finish and then instantly "teleports" the scroll position back to the identical spot in the second set.
- This reset happens without animation (`transition: none`), making it completely invisible to the human eye.

## 📂 Project Structure

- `Carousel.tsx`: Core logic, index management, and teleportation handling.
- `Carousel.scss`: All styling, including responsive breakpoints and smooth transitions.
- `App.tsx`: Main entry point fetching data from the API.

---

_Developed with ♥ by Marina_

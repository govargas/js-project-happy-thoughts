# Happy Thoughts

**Live Demo:** [https://happythoughtstalo.netlify.app/](https://happythoughtstalo.netlify.app/)

---

## Project Overview

A simple, positive-messaging web app built with React, Vite, and Tailwind CSS. Users can post “happy thoughts,” view the latest messages from a public API, and send likes.

Key features include:

- **Controlled form** for typing and submitting messages with client-side validation  
- **API integration** using `fetch`: GET recent thoughts, POST new thoughts, POST likes  
- **Component lifecycle** with `useEffect` for initial data fetch and loading state  
- **Tailwind CSS**: Utility-first styling, custom `shadow-sharp` and `animate-fade-in` via `@layer utilities`  
- **Human-friendly timestamps** via Day.js (`x minutes ago`)  
- **Per-user like tracking** using `localStorage` to prevent double-likes  
- **Responsive design** (mobile-first min 320px up to desktop 1600px) with Tailwind’s breakpoints  
- **Accessibility**: `<label>` associations, `aria-invalid`, `role="alert"` for errors, and `aria-label`/`aria-pressed` on like buttons  
- **Custom fonts** (IvyMode & Eixample Dip) from Adobe Fonts  

---

## Implementation Details

1. **App.jsx (Parent)**
   - Manages state: `thoughts`, `loading`, `likedIds`, and `lastAddedId`  
   - Uses `useEffect` to fetch the latest 20 thoughts on mount  
   - Defines `addThought` to prepend new messages and trigger animation  
   - Defines `handleLike` to POST likes, update state, and persist liked IDs in `localStorage`

2. **Form.jsx (Child)**
   - Implements a **controlled** `<textarea>` bound to `message` state  
   - Client-side validation for 5–140 characters, with inline error messages (`role="alert"`)  
   - Live character counter under the textarea, turns red at 140+  
   - Posts new thoughts to the API, handles loading state (`submitting`) and errors  

3. **ThoughtCard.jsx (Sibling)**
   - Receives props: `message`, `hearts`, `createdAt`, `isLiked`, `isNew`  
   - Renders a card with message text, like button, count, and relative timestamp (`dayjs.fromNow()`)  
   - Applies `animate-fade-in` when `isNew` is true for a smooth entry animation  
   - Accessible ❤️ button with `aria-label` and `aria-pressed`

4. **Styling & Utilities**
   - **Tailwind CSS** for utility-first styling and responsive layout  
   - Custom **shadow-sharp** utility for crisp black drop-shadows  
   - `@layer utilities` in `index.css` for manual keyframes and `.animate-fade-in` class  

---

## Completed Requirements & Stretch Goals

### Week 14

**Requirements**  
☑️ Design fidelity: Follows the provided mockup closely  
☑️ Responsive: Mobile-first layout (320px) up to large screens (1600px+)  
☑️ Form & card rendering: Textarea + submit button clears on click and displays the new message in a card  
☑️ Clean code: Component-based structure, readable JSX, and DRY utility classes

**Stretch Goals**  
☑️ Live character counter under the textarea, turns red at 140+  
☑️ Error states: Inline error message when input is invalid  
☑️ Entry animation: New thoughts animate with a fade-in slide-down effect

### Week 15

**Requirements**  
☑️ POST new thoughts: Happy thoughts are sent to the API on form submission  
☑️ List rendering & update: Thoughts are fetched/listed (newest first) at load and update live after submission  
☑️ Show content & likes: Each card displays message text and current like count  
☑️ Like button: Sends a like to the API and increments the count on click

**Stretch Goals**  
☑️ Per-user like tracking via `localStorage`  
☑️ Loading states: “Loading…” message on initial fetch and disabled UI during POST requests

---

Enjoy exploring this project! Feedback and questions are always welcome.  
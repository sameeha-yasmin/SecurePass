# SecurePass – Password Strength & Security Analyzer

SecurePass is a small, beginner-friendly password tool made with HTML, CSS, and plain JavaScript. It checks a password against a short list of common composition rules, shows suggestions, and can generate a random password in the browser.

This is a learning project. Its score is only a basic estimate: it does not check leaked-password databases, guessability, reuse, or whether a password can be hacked.

## Features

- Instant local analysis while typing
- Show and hide password control
- Checklist for length, uppercase, lowercase, numbers, and special characters
- Weak, Medium, or Strong label with a progress bar
- A 0–100 score and improvement suggestions
- Browser-generated password containing every requested character group
- Copy button using the Clipboard API
- Reset control
- Responsive dark interface with keyboard focus styles
- No backend, API, localStorage, or password transmission

## Technologies

- HTML5 for the page structure and accessible controls
- CSS3 for layout, colors, responsive behavior, and motion
- Vanilla JavaScript for analysis, generation, and browser interactions
- Web Crypto API for random values used by the password generator
- Clipboard API for copying a password

The project has no build step or JavaScript dependencies. The Google Fonts links are optional visual styling; the page has local fallback fonts if they are unavailable.

## Run the project

Open `index.html` in a modern browser. Clipboard access is restricted by some browsers when a page is opened directly from disk; if copying is unavailable, use a local static server or copy the password manually. The other features work without a backend.

## How the score works

The score is deliberately simple and is not a security guarantee:

- Each character adds 2 points, up to 20 characters (maximum 40 length points).
- Uppercase, lowercase, number, and special-character groups add 15 points each (maximum 60 variety points).
- The total is shown from 0 to 100.
- A password is Strong when it scores at least 75 and passes all five checklist items. A score of at least 45 is Medium. Other non-empty passwords are Weak. Empty input is Not rated.

A longer, unique password or passphrase is often more useful than just mixing character types. This project does not evaluate uniqueness or actual attack resistance.

## What this project teaches

- Connecting labels, inputs, buttons, and live status regions with semantic HTML
- Styling a responsive interface with CSS variables, grid, and media queries
- Selecting and updating page elements with the DOM
- Responding to `input` and `click` events
- Splitting work into small JavaScript functions
- Using `crypto.getRandomValues()` and the Clipboard API
- Presenting a transparent score without claiming certainty

## Project files

- `index.html` contains the content and controls.
- `style.css` contains the visual design and responsive rules.
- `script.js` contains password checks, score calculation, rendering, and button behavior.

# Disney Princess Showcase

A responsive single-page web experience celebrating Disney Princesses with a polished carousel main view and an immersive detail panel. Built with HTML, CSS, and vanilla JavaScript—no external frameworks required.

## Features

- **Modern UI shell** – Rounded white app card on a soft gradient background with glow accents.
- **Search-inspired header** – Brand, faux search field, and menu stub styled like a streaming dashboard.
- **Responsive carousel** – Shows 1–4 princess cards per screen width, with smooth Prev/Next navigation.
- **Character detail view** – Clicking a card reveals artwork, biography, and faux clip thumbnails with animated transitions.
- **Accessible interactions** – Cards are keyboard-focusable, `Enter`/`Space` open the detail view, and `Esc` or the close button return to the carousel.
- **Princess palette** – Each character uses a tailored gradient inspired by her movie.

## Getting Started

1. Clone or download this folder.
2. Add princess PNG artwork into `images/` using these filenames:
   - `ariel.png`
   - `belle.png`
   - `rapunzel.png`
   - `cinderella.png`
   - `jasmine.png`
   - `moana.png`
3. Open `index.html` in any modern browser (double-click the file or run `start index.html` from PowerShell on Windows).

## Tech Stack

- HTML5 structure
- CSS3 with custom properties and responsive media queries
- Vanilla JavaScript for slider logic, detail view state, and accessibility enhancements

## Customization Tips

- Update `script.js` to adjust princess data (names, movies, descriptions, gradients, clip colors).
- Modify `styles.css` to tweak theme colors, animation timing, or responsive breakpoints.
- Swap in additional characters by adding to the `princesses` array and placing matching PNGs in `images/`.

## License

This project is provided for personal or educational use. Replace artwork with assets you have rights to use.

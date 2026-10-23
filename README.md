# GLASSVERSE Portfolio — Sanskar Kulkarni

A glassmorphism portfolio built with plain HTML5, CSS3 and vanilla JavaScript. No frameworks, no build step, no icon library (icons are an inline SVG sprite).

## Run it
1. Unzip the folder.
2. Double-click `index.html` to open it in any modern browser.

Optional: serve it locally with `python3 -m http.server` and visit http://localhost:8000.
Fonts (Sora, Inter) load from Google Fonts when online and fall back to system fonts offline.

## Files
| File | Purpose |
|---|---|
| `index.html` | Page structure and content |
| `style.css` | Theme tokens, glass effects, layout, animations, responsive rules |
| `script.js` | Typing effect, nav, reveal animations, form validation, particles |
| `assets/profile.jpg` | Your profile photo (replace with another file of the same name to change it) |
| `resume.pdf` | Your resume (converted from the image you supplied). Replace with a text-based PDF if you want selectable text. |

## Customize
- **Colors:** edit the variables at the top of `style.css` (`--cyan`, `--blue`, `--violet`, `--bg`).
- **Typing phrases:** edit the `phrases` array in `script.js`.
- **Project links:** Hospital Appointment System has a GitHub Repository button (currently your GitHub profile; set it to the repo URL). CyberShield AI has an Explore Project button (search `placeholder-link` in `index.html` and replace `href="#"`).
- **Certifications:** edit the `cert-list` items in `index.html`.
- **Location spelling:** the site shows "Yeoul" as written in the brief. Search `Yeoul` in `index.html` to correct it if needed.

## Contact form
There is no backend, so the form validates the fields and then opens the visitor's email app with the message pre-filled. It does not claim a message was sent. To receive messages directly, connect a service such as Formspree or EmailJS and replace the `mailto:` logic in the submit handler in `script.js`.

## Accessibility
Skip link, visible focus styles, keyboard-friendly menu (Esc closes it), ARIA labels, and `prefers-reduced-motion` support (turns off animations, particles and smooth scrolling).

## Deploy
Upload the folder to GitHub Pages, Netlify or Vercel as a static site.

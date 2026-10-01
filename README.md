# Portfolio: Phaneendra Kumar Papinedi

A static site (plain HTML, CSS and a little JavaScript). No framework and no build step.

```
index.html
assets/
  css/style.css
  js/main.js
  fonts/        Poppins (self-hosted, open licence)
  img/          project covers
  Phaneendra_Kumar_Papinedi_Resume.pdf
```

## Run it on your computer
Open `index.html` in a browser, or serve the folder:
```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

## Add your photo
Save your photo as `assets/images/avatar.jpg` (square works best, at least 256 x 256 px). It replaces the "PK" initials automatically. Create the `images` folder if it does not exist.

## Deploy on Vercel
1. Put these files at the **root** of the GitHub repo, so `index.html` is at the top level.
2. In Vercel: Settings, General. Leave **Framework Preset** as "Other" and **Root Directory** empty.
3. Push to GitHub. Vercel redeploys on its own.

## Deploy on your own server (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.example;
    root /var/www/portfolio;
    index index.html;
    location / { try_files $uri $uri/ =404; }
    location /assets/ { expires 7d; add_header Cache-Control "public"; }
}
```
Copy the files to `/var/www/portfolio`, then add HTTPS with `certbot --nginx`.

## Editing
- Text and links: `index.html`. Each project's popup text is in the `<template id="d-...">` blocks near the bottom.
- Colours: the variables at the top of `assets/css/style.css`.
- Replace the resume by overwriting `assets/Phaneendra_Kumar_Papinedi_Resume.pdf`, keeping the file name.
- Project covers in `assets/img/` are 1200 x 750 images. Replace one with a real screenshot or photo of the project whenever you have it.

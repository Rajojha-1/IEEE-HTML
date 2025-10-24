TMLNEW folder

This folder contains a static, self-contained version of the site home page (HTML/CSS/JS).

What I changed in this session:
- Removed unresolved Tailwind directives from `css/style.css` so the stylesheet works without a PostCSS build.
- Ensured all behavior (menu, carousel) runs from `js/script.js` and styles are in `css/style.css`.

If you want a compiled Tailwind CSS file instead (optional):
1. From the repository root (requires Node.js and npm installed), install dev dependencies:

   npm install -D tailwindcss postcss autoprefixer

2. Create an input file (for example `tailwind-src/input.css`) with:

   @tailwind base;
   @tailwind components;
   @tailwind utilities;

3. Run the Tailwind CLI to build a minified CSS file into this folder's CSS directory:

   npx tailwindcss -i tailwind-src/input.css -o HTMLNEW/css/style.tailwind.css --minify

4. Replace the `<link rel="stylesheet" href="css/style.css">` in `HTMLNEW/index.html` with the generated `style.tailwind.css` (or include both, with preference as needed).

Notes and options:
- If you want everything physically inside `HTMLNEW` (images too), confirm and I'll copy the image files from `frontend/public/images` into `HTMLNEW/images` (this will add binary files to the repo).
- I did not change image sources automatically to keep edits low-risk. If you'd like that, tell me and I'll update the HTML to use `HTMLNEW/images/...` and copy the files.

Next steps I can take (tell me which you'd like):
- Copy images into `HTMLNEW/images` and update HTML paths (will add many binary files).
- Recreate a local Tailwind build config that outputs compiled CSS into `HTMLNEW/css` (requires running npm commands; I can run them if you want and they may modify root package.json/devDependencies).
- Wire the hero progress bar to the carousel so it animates with slides.

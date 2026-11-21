# 2muchethan.com

A one-page site for the 2MuchEthan YouTube channel. Plain HTML, nothing to install or build.

## Make it yours
Open `index.html` and look for `EDIT:` comments:
- **Tagline and bio**: change the text.
- **Videos**: paste video IDs into the `videos` list near the bottom. For `youtube.com/watch?v=dQw4w9WgXcQ`, the ID is `dQw4w9WgXcQ`.
- **Photo**: put `me.jpg` in this folder and swap the `E` circle for `<img src="me.jpg" class="avatar" alt="Ethan">`.
- **Social links**: fix the handles and delete any you don't use.
- **Email**: `hello@2muchethan.com` won't receive mail until you set up email forwarding at your registrar.

## Put it online free (GitHub Pages)
1. Make a GitHub repo and upload `index.html` and `CNAME`.
2. Repo **Settings → Pages**: set Source to the `main` branch, then save.
3. At your domain registrar, add these DNS records:
   - `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`
   - a `CNAME` record for `www` pointing to `<your-github-username>.github.io`
4. Back in Settings → Pages, once the domain check passes, tick **Enforce HTTPS**.

DNS changes can take anywhere from a few minutes to a few hours.

Netlify and Cloudflare Pages work too: drag the folder into either one and add the domain.

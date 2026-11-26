# Card Ideas for Cards Against Our Ulibarri Family

A one-page site where family and friends send card ideas. Each idea lands in a Google Sheet, where you check off the good ones.

## One-time setup (about 5 minutes)

1. **Make the Sheet.** Go to sheets.new and name it "Card Ideas".
2. **Add the script.** In the Sheet, open **Extensions → Apps Script**, delete what's there, paste everything from `apps-script/Code.gs`, and save.
3. **Deploy it.** Click **Deploy → New deployment**, set the type to **Web app**, then set:
   - Execute as: **Me**
   - Who has access: **Anyone**

   Click **Deploy** and allow the permissions it asks for. Google may warn that the app isn't verified: tap **Advanced → Go to (project name)**. That's expected because you wrote the script yourself.
4. **Copy the Web app URL** (ends in `/exec`).
5. **Paste it into `config.js`** on GitHub, between the quotes, and commit.
6. **Turn on the site.** In the repo, open **Settings → Pages**, set Source to **Deploy from a branch** with branch `main` and folder `/ (root)`, then save. The site will be at `https://hulibarri.github.io/get-stuff/`.

## Using it

- Text the site link to everyone.
- New ideas show up on the **Ideas** tab of the Sheet with who sent them, black or white, and whether they're spicy (adults only).
- Check the **Approved** box on the ones you like, then copy those into the game.

If you change `Code.gs` later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

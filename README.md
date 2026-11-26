# Card Ideas for Cards Against Our Ulibarri Family

A one-page site where family and friends send card ideas. People send themes, stories and inside jokes (not finished cards). Each idea lands in a Google Sheet, and the actual cards get written from them later.

## One-time setup (about 5 minutes, works on a phone)

1. **Open script.google.com** in Safari (or any browser) and tap **New project**.
2. **Paste the script.** Delete what's in the editor, paste everything from `apps-script/Code.gs`, and tap the save icon.
3. **Run setup once.** In the function dropdown at the top, pick **setup**, then tap **Run**. Allow the permissions. If Google says the app isn't verified, tap **Advanced → Go to (project name)**. That's expected because you wrote it yourself. This creates a **Card Ideas** sheet in your Google Drive.
4. **Deploy it.** Tap **Deploy → New deployment**, choose the gear → **Web app**, set Execute as **Me** and Who has access **Anyone**, then **Deploy**.
5. **Copy the Web app URL** (ends in `/exec`) and paste it between the quotes in `config.js` on GitHub, then commit.
6. **Turn on the site.** In the repo, open **Settings → Pages**, set the branch to `main` and folder `/ (root)`, then save. The site will be at `https://hulibarri.github.io/get-stuff/`.

If the editor looks cramped, tap **aA → Request Desktop Website** in Safari.

## Using it

- Text the site link to everyone.
- New ideas show up on the **Ideas** tab of the Sheet with the idea and whether it is spicy (adults only).
- Check **Used in cards** once an idea has been turned into cards.

If you change `Code.gs` later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

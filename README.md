# Squadnote landing page

Single static page hosted on GitHub Pages. No JavaScript, dependencies, backend,
analytics or Riot assets. Edit `index.html` and `style.css`; push to `main` to deploy.

This site describes a planned product, not a functioning sign-in or feedback service.
The private Overwolf app lives in a separate repository and is not included here.

Privacy/removal requests start through GitHub Issues without personal identifiers.
Account-specific verification must take place privately. A full app privacy policy,
retention schedule and review threshold must be published before collecting data.

## Public product demo

Open `demo.html` for the five-step tutorial and free exploration. All players,
feedback and confirmations are fictional. State stays in memory and resets on
reload. No credentials, API calls, storage, analytics or form submissions.

For local review: `python3 -m http.server 8877 --bind 127.0.0.1`.

Manual QA covers the account-step advance, gated orb step, all four summaries,
expanded tag basis, toggle-close, preset tag selection and submission, planned
rule buttons, all three privacy confirmations, Back/Next, and tutorial skipping.
Phone layout checked at 390px; all demo controls have 44px minimum targets.

# Growth: links, channels and how to read the results

How people find the app, and how to tell which channel brought which install, without adding any tracker to the app
or the site. The stores count installs themselves.

## Tagged links

All store links come from `components/growthLinks.js`:

| Where | Campaign | Notes |
| --- | --- | --- |
| Scoring-chart pages (`site/scoring/*`) | `web-<page name>`, e.g. `web-deadlift-male-combat` | one per page, so you can see which chart sends installs |
| Scoring index | `web-scoring-index` | |
| Share button in the app | `share-ios`, `share-android` | installs that came from a shared score |

For a new channel (a Reddit reply, a flyer, a Discord post), make the campaign name `<channel>-<what>`, lower case with
dashes, at most 40 characters, for example `reddit-army-pt`. Build the links in a terminal in this repo:

```
node -e "const g=require('./components/growthLinks'); console.log(g.appStoreLink('reddit-army-pt')); console.log(g.playStoreLink('reddit-army-pt','reddit'))"
```

Keep the table above current when you start using a campaign, so a name in the console can be traced back.

### The App Store provider token (already set)

The App Store only reports a campaign link when it also carries the account's provider token (`pt`). Open App Store
Connect > App Analytics > Campaigns > Campaign Links, build one link there, and copy the number after `pt=` into
`APP_STORE_PROVIDER_TOKEN` in `components/growthLinks.js`. It is public (it is in every campaign link) and not a
secret. The provider token is set (122126127, 2026-11-18), so the App Store reports these campaigns in App Analytics. Google Play needs nothing.

## Where to read the results

- **App Store Connect > App Analytics > Acquisition > Campaigns**: first-time downloads per campaign (needs the
  provider token above). **Sources** shows App Store Search vs Browse vs Web Referrer vs App Referrer in total.
- **Google Play Console > Statistics**: add the dimension *UTM source / UTM campaign* (Acquisition reports) to see
  installs per campaign.
- **Listing conversion**: App Store Connect > App Analytics > Product Page Views and Conversion Rate; Play Console >
  Store presence > Store listing acquisition. Many views and few installs means the listing is the problem
  (see `docs/store-listing.md`); few views means discovery is.
- **Website**: GitHub Pages has no analytics. The scoring pages are indexed through Google Search Console (add the
  site URL, verify ownership, submit `sitemap.xml`), which shows the searches that reach each page and the clicks.
  This adds nothing to the pages themselves.

## Channels, and what to say

- Reddit and Facebook groups for soldiers, ROTC and unit PT leaders: answer "how many points is X" questions with the
  answer, and link the matching chart page (not the app) when it helps. Read each group's rules on self-promotion.
- Master fitness trainers, ROTC cadre and recruiters: a short message with the chart index link and a line on what the
  app adds. One recommendation reaches a whole unit.
- Unit PT boards: the scoring index link.

Measure before spending: after four weeks of tagged links, keep the channels that produced installs and drop the rest.
Paid ads are not recommended for a free utility with no revenue per install.

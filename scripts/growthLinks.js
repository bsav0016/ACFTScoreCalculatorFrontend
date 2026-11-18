// Store links tagged so each channel can be told apart in the store consoles. No tracker, SDK or script is involved:
// the stores count the installs themselves (App Store Connect > App Analytics > Campaigns, Google Play Console >
// Statistics > Acquisition by UTM).
//
// Channels in use are listed in docs/growth.md. Campaign names are lower-case words and dashes, and stay short
// (App Store campaign tokens are limited to 40 characters).

const APP_STORE_URL = 'https://apps.apple.com/us/app/updated-acft-score-calculator/id1619926227';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=org.name.UpdatedACFTScoreCalculator';

// The App Store only attributes a campaign link when it also carries the account's provider token ("pt"), shown in
// App Store Connect when you build a campaign link there. It is public (it is in every campaign link) and not a
// secret. Leave it empty until it is known: links then carry the campaign name but the App Store will not report on it.
const APP_STORE_PROVIDER_TOKEN = '';

const CAMPAIGN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function assertCampaign(campaign) {
  if (!CAMPAIGN.test(campaign) || campaign.length > 40) {
    throw new Error(`Campaign must be lower-case words and dashes, 40 characters at most: ${campaign}`);
  }
}

/** The App Store listing, tagged with a campaign. */
function appStoreLink(campaign) {
  assertCampaign(campaign);
  const token = APP_STORE_PROVIDER_TOKEN ? `pt=${APP_STORE_PROVIDER_TOKEN}&` : '';
  return `${APP_STORE_URL}?${token}ct=${campaign}&mt=8`;
}

/** The Google Play listing, tagged with a campaign (read back from the install referrer as UTM values). */
function playStoreLink(campaign, medium = 'organic') {
  assertCampaign(campaign);
  const referrer = encodeURIComponent(`utm_source=${campaign}&utm_medium=${medium}&utm_campaign=${campaign}`);
  return `${PLAY_STORE_URL}&referrer=${referrer}`;
}

module.exports = { APP_STORE_URL, PLAY_STORE_URL, appStoreLink, playStoreLink };

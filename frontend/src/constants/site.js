/** Shared marketing / app links (landing, About, footer). */

export const ANDROID_URL =
  "https://play.google.com/store/apps/details?id=com.remiminderai.app";

export const IOS_URL = "https://apps.apple.com/us/app/remiminderai/id6776771952";

export const trackDownloadClick = () => {
  window.ttq?.track("ClickButton");
};

export const CONTACT_EMAIL = "team@remiminderai.com";

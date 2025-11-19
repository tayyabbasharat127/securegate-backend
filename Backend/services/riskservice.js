const geoip = require("geoip-lite");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const calculateriskscore = async (ip, device, lastlogin) => {
  let score = 0;
  let reasons = [];

  // Geo lookup
  const geo = geoip.lookup(ip);
  const country = geo?.country ?? "Unknown";

  // --- FIXED VPN CHECK (FREE API) ---
  let vpn = { security: { vpn: false } };
  try {
    const vpnReq = await fetch(`https://ipapi.co/7047c56adb4846d7ab5daa9a3ce1400b/json/`);
    vpn = await vpnReq.json();
  } catch (err) {
    console.log("VPN API ERROR:", err.message);
  }

  // VPN detection (ipapi flags)
  if (vpn?.proxy || vpn?.vpn) {
    score += 30;
    reasons.push("VPN/Proxy Detected");
  }

  // Country change
  if (lastlogin && lastlogin.location !== country) {
    score += 40;
    reasons.push("New Country Detected");
  }

  // Device change
  if (lastlogin && lastlogin.device !== device) {
    score += 20;
    reasons.push("New Device Detected");
  }

  return { score, reasons, country };
};

module.exports = { calculateriskscore };

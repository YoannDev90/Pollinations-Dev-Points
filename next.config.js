const isProd = process.env.NODE_ENV === "production";

module.exports = {
  basePath: isProd ? "/Pollinations-Seed-Tier-Dev-Points" : "",
  assetPrefix: isProd ? "/Pollinations-Seed-Tier-Dev-Points" : "",
  reactStrictMode: true,
};

// Test-only server: the browser intercepts CAPTCHA and every form request.
import config from "../vite.config.js";
export default {
  ...config,
  cacheDir: ".vite-qa-cache",
  define: { "import.meta.env.VITE_RECAPTCHA_SITE_KEY": '"qa-only-site-key"' },
};

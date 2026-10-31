INSTANT PAY COMPLETE FIX

Yeh package registration aur UTR submission ke liye 5 website/function files deta hai.

GitHub repository mein in files ko unke EXACT naam se replace karein:
- supabase-config.js
- instant-pay-login.html
- instant-pay-buy.html
- instant-pay-register-en.html

Supabase mein:
- Edge Functions > mobile-register > code ko mobile-register-function.ts se replace karke Deploy karein.
- Verify JWT OFF hona chahiye (public registration endpoint).
- SUP_SERVICE_ROLE_KEY sirf Edge Function Secrets mein rakhein. HTML/GitHub mein kabhi nahi.

Deploy ke baad browser mein Ctrl+Shift+R karein. Phir Login page se mobile/password ke saath login karein aur Buy page par UTR submit karein.
Agar mobile pehle se registered hai to Register dobara nahi; Login karein.

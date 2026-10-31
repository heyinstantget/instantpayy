INSTANT PAY ACCOUNT DATA ISOLATION PATCH

Replace these files in your GitHub repository with the same filenames:
- instant-pay-register-en.html
- instant-pay-login.html
- instant-pay-home.html
- instant-pay-sell.html
- instant-pay-my.html
- instant-pay-buy.html
- instant-pay-orders.html

What this fixes:
- Each newly registered mobile gets its own profile and UID.
- New accounts start with Available Balance ₹0 and Selling Balance ₹0. A one-time registration reward amount is randomly recorded from ₹68 to ₹110 in the separate registrationReward field; it does not increase the starting balance.
- Login always loads the matching account profile instead of retaining the previous account's profile.
- Sell/order history pages only show records tagged with the logged-in member's UID or mobile.

Important limitations:
- This remains browser localStorage demo storage, not a shared backend. Data is device/browser-specific and can be modified by users.
- Old historical orders that do not contain memberUid or memberMobile are intentionally hidden rather than risk showing one member's records to another.
- The Buy page is currently a front-end/demo and does not persist a buy order in this source file.
- For real balances, rewards, UPI locking, and cross-device accounts, use server-side database/authentication (e.g. Supabase/Firebase) and enforce member ownership on the server.
- After deploying, hard refresh (Ctrl+Shift+R). Clear site data only if you are okay losing local demo data.

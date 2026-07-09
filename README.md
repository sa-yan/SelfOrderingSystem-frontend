# Food Corner — Self Ordering System (Frontend)

React frontend for a restaurant self-ordering system. Customers scan a QR / open the site on their phone, browse the menu, add items to a cart, pay through Razorpay and track their order live — no waiter involved. There are also separate views for the kitchen staff and the admin who manages the menu.

The backend lives in its own repo (Spring Boot + PostgreSQL): [SelfOrderingSystem-backend](https://github.com/sa-yan/SelfOrderingSystem-backend). It's deployed on Render at `https://selforderingsystem-backend.onrender.com`.

## What it does

**Customer side**
- Browse the menu by category, with search
- Cart with quantity controls (kept in React context)
- Razorpay checkout (test mode), bill gets emailed after payment
- Live order tracking — the status page polls the backend every few seconds so you can watch your order go from Placed → Preparing → Ready

**Kitchen side** (`/kitchen`, password protected)
- Dashboard of active orders, refreshes every 30s
- Move orders through Preparing / Ready / Delivered

**Admin side** (`/admin`, code protected)
- Add menu items with an image (uploaded to Cloudinary via the backend)
- Edit prices, toggle availability, delete items

Dark/light theme is available everywhere via a toggle in the header.

## Routes

| Route | Page |
|---|---|
| `/` | Menu (customer) |
| `/cart` | Cart |
| `/payment` | Razorpay checkout |
| `/thankyou` | Order confirmation |
| `/track-order` | Live order status |
| `/kitchen` | Kitchen dashboard (login) |
| `/admin` | Admin login |
| `/admin/menu` | Menu management |

## Running locally

You need Node 18+.

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

`npm run dev` runs Vite with `--host`, so you can open it from your phone on the same wifi — handy for testing the customer flow on an actual mobile screen.

### Environment variables

| Variable | What it is |
|---|---|
| `VITE_REACT_APP_API_URL` | Backend URL. `http://localhost:8080` for local, or the Render URL |
| `VITE_RAZORPAY_KEY_ID` | Razorpay key id (test key is fine) |
| `VITE_ADMIN_CODE` | Code for the admin login |
| `VITE_KITCHEN_CODE` | Password for the kitchen dashboard |

Heads up: the Render backend is on the free tier, so after being idle it takes ~30–60s to wake up. If the menu doesn't load on first visit, that's usually why — give it a minute and refresh. `https://selforderingsystem-backend.onrender.com/health` shows whether it's up.

## Stack

- React 19 + Vite 6
- react-router-dom for routing
- axios for API calls (`src/utils/axiosConfig.js` has the shared instance)
- Plain CSS per component, no UI framework
- react-icons

## Project layout

```
src/
  components/   Menu, Kitchen, Admin views + logins, Razorpay checkout
  pages/        Cart, OrderStatus, ThankYou
  context/      CartContext, ThemeContext
  utils/        axios instance with base URL + admin header
```

## Building

```bash
npm run build    # output in dist/
npm run lint
```

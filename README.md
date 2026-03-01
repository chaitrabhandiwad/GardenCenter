# Garden Center App

A simple React Native (Expo) mobile app for a garden center.

It includes:
- Home screen with image carousel
- Products screen with image cards
- Add Product screen with form
- API integration for loading and creating products
- Local demo fallback when API is not configured

## Tech Stack

- Expo SDK 55
- React Native
- React Navigation (native stack)

## Project Structure

- `App.js` main app, navigation, UI, API calls
- `assets/` app icons and splash assets
- `.env.example` sample environment variables

## Prerequisites

- Node.js 18+
- npm
- Expo CLI via `npx`

## Setup

```bash
cd /Users/sd/Documents/garden-center-app
npm install
```

## Environment Variables

Create `.env` in the project root:

```bash
EXPO_PUBLIC_API_URL=http://localhost:8080
```

If `EXPO_PUBLIC_API_URL` is not set, the app uses local demo products.

## Run the App

```bash
cd /Users/sd/Documents/garden-center-app
npx expo start
```

Then in Expo terminal:
- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Press `w` to open web

## API Contract

### Get products

- `GET /products`
- Expected response:

```json
[
  {
    "id": "1",
    "name": "Monstera Deliciosa",
    "price": 24,
    "tag": "Indoor",
    "imageUrl": "https://example.com/image.jpg"
  }
]
```

Also supported response shape:

```json
{
  "products": [
    {
      "id": "1",
      "name": "Monstera Deliciosa",
      "price": 24,
      "tag": "Indoor",
      "imageUrl": "https://example.com/image.jpg"
    }
  ]
}
```

### Create product

- `POST /products`
- Request body:

```json
{
  "name": "Lavender Pot",
  "price": 12,
  "tag": "Fragrant",
  "imageUrl": "https://example.com/lavender.jpg"
}
```

- Expected response: created product object.

## Notes

- This app uses a shadcn-style custom component design adapted for React Native.
- `shadcn/ui` itself is web-focused and not directly used in native mobile runtime.

## Scripts

```bash
npm run start
npm run ios
npm run android
npm run web
```

## License

MIT

# ATLAS Home Control

A modular, structure-first Next.js application designed as a frontend for Home Assistant.

## Project Structure

- **/app**: App Router pages and layout.
- **/modules**: Independent business logic modules (Status, Control, Voice, Insights).
- **/core**: Shared core logic (HA client stub, layout, navigation).
- **/context**: Global React contexts (App state, Presence stub).
- **/ui**: Shared UI primitives.

## Features

- **Modular Architecture**: Isolated modules for scalability.
- **Home Assistant Ready**: Types and client stubs prepared for WS integration.
- **Responsive Design**: Mobile-first, adaptive layout for all screens.
- **Control**: Room-based control with manual override concepts.

## getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run locally:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Future Integration

- Replace `core/ha/client.stub.ts` with real WebSocket client.
- Connect `PresenceContext` to HA sensors.
- Expand Modules with real entity data.

# 🧬 3D DNA Strand Visualization

A beautiful rotating 3D DNA strand made up of dynamically loaded images using React Three Fiber.

## Features

- **3D Helix Geometry**: Mathematical helix formula places images in 3D space
- **Dynamic Image Loading**: Fetches images from Unsplash API or falls back to placeholder images
- **Smooth Animations**: 
  - Main helix rotation
  - Individual image floating animations
  - Subtle rotation effects
- **Interactive Controls**: Orbit controls for pan, zoom, and rotate
- **Responsive Design**: Full-screen experience with beautiful gradient background

## Navigation

- **Main Page**: `/` - Your existing KitViewer with a link to the DNA strand
- **DNA Strand**: `/dna-strand` - The new 3D visualization

## Setup

### 1. Unsplash API (Optional)

For dynamic image loading from Unsplash:

1. Get a free API key at [Unsplash Developers](https://unsplash.com/developers)
2. Create a `.env.local` file in your project root
3. Add your key:
   ```
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_actual_api_key_here
   ```

**Note**: If no API key is provided, the app automatically uses beautiful placeholder images from Picsum.

### 2. Run the Application

```bash
npm run dev
```

Visit:
- `http://localhost:3000` - Main page with navigation
- `http://localhost:3000/dna-strand` - DNA strand visualization

## Technology Stack

- **React Three Fiber** (`@react-three/fiber`) - React renderer for Three.js
- **Drei** (`@react-three/drei`) - Useful helpers (OrbitControls, Html)
- **Three.js** - 3D graphics library
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## Components Structure

```
src/app/
├── components/
│   ├── DNAStrand.tsx      # Main 3D scene setup
│   ├── DNAHelix.tsx       # Helix geometry and image planes
│   ├── ImageLoader.tsx    # Image fetching utilities
│   └── KitViewer.tsx      # Your existing component
├── dna-strand/
│   └── page.tsx           # DNA strand page route
└── page.tsx               # Main page with navigation
```

## Customization

### Helix Parameters

In `DNAHelix.tsx`, you can adjust:

```typescript
const radius = 3;           // Helix radius
const spacing = 0.3;        // Vertical spacing between images
const angleStep = 0.3;      // Angular step between images
```

### Animation Speed

```typescript
// Main rotation speed
groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;

// Individual image animations
meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + index * 0.1) * 0.05;
```

### Image Queries

Modify the search queries in `ImageLoader.tsx`:

```typescript
const queries = ['people', 'science', 'nature', 'technology', 'abstract', 'space'];
```

## Performance Notes

- **Image Limit**: Currently limited to 200 images for optimal performance
- **Texture Loading**: Images are loaded asynchronously with error handling
- **Fallback Strategy**: Automatic fallback to placeholder images if API fails

## Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (with WebGL support)
- **Mobile**: Works on mobile devices with touch controls

## Future Enhancements

- Add image filtering/categorization
- Implement double helix structure with connecting bonds
- Add particle effects
- Include sound visualization
- Add VR/AR support

Enjoy your 3D DNA strand visualization! 🧬✨ 
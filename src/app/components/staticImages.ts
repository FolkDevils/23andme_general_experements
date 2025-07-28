// Static image URLs for DNA helix testing
// Using reliable sources that work well with Three.js and CORS

export const staticImageUrls = [
  // Picsum Photos - reliable and CORS-friendly
  'https://picsum.photos/400/400?seed=1',
  'https://picsum.photos/400/400?seed=2',
  'https://picsum.photos/400/400?seed=3',
  'https://picsum.photos/400/400?seed=4',
  'https://picsum.photos/400/400?seed=5',
  'https://picsum.photos/400/400?seed=6',
  'https://picsum.photos/400/400?seed=7',
  'https://picsum.photos/400/400?seed=8',
  'https://picsum.photos/400/400?seed=9',
  'https://picsum.photos/400/400?seed=10',
  'https://picsum.photos/400/400?seed=11',
  'https://picsum.photos/400/400?seed=12',
  'https://picsum.photos/400/400?seed=13',
  'https://picsum.photos/400/400?seed=14',
  'https://picsum.photos/400/400?seed=15',
  'https://picsum.photos/400/400?seed=16',
  'https://picsum.photos/400/400?seed=17',
  'https://picsum.photos/400/400?seed=18',
  'https://picsum.photos/400/400?seed=19',
  'https://picsum.photos/400/400?seed=20',
  'https://picsum.photos/400/400?seed=21',
  'https://picsum.photos/400/400?seed=22',
  'https://picsum.photos/400/400?seed=23',
  'https://picsum.photos/400/400?seed=24',
  'https://picsum.photos/400/400?seed=25',
  'https://picsum.photos/400/400?seed=26',
  'https://picsum.photos/400/400?seed=27',
  'https://picsum.photos/400/400?seed=28',
  'https://picsum.photos/400/400?seed=29',
  'https://picsum.photos/400/400?seed=30',
  'https://picsum.photos/400/400?seed=32',
  'https://picsum.photos/400/400?seed=33',
  'https://picsum.photos/400/400?seed=34',
  'https://picsum.photos/400/400?seed=35',
  'https://picsum.photos/400/400?seed=36',
  'https://picsum.photos/400/400?seed=37',
  'https://picsum.photos/400/400?seed=38',
  'https://picsum.photos/400/400?seed=39',
  'https://picsum.photos/400/400?seed=40',
  'https://picsum.photos/400/400?seed=41',
  'https://picsum.photos/400/400?seed=42',
  'https://picsum.photos/400/400?seed=43',
  'https://picsum.photos/400/400?seed=44',
  'https://picsum.photos/400/400?seed=45',
  'https://picsum.photos/400/400?seed=46',
  'https://picsum.photos/400/400?seed=47',
  'https://picsum.photos/400/400?seed=48',
  'https://picsum.photos/400/400?seed=49',
  'https://picsum.photos/400/400?seed=50',
];

// Generate image data objects for the DNA helix
export const generateImageData = (count: number = 400) => {
  const images = [];
  
  for (let i = 0; i < count; i++) {
    const urlIndex = i % staticImageUrls.length;
    images.push({
      id: `static-${i}`,
      urls: {
        small: staticImageUrls[urlIndex],
        thumb: staticImageUrls[urlIndex],
      },
      alt_description: `Static image ${i}`,
    });
  }
  
  return images;
}; 
import Link from 'next/link';
import KitViewer from '../components/KitViewer';


export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <nav className="absolute top-4 right-4 z-10">
        <Link 
          href="/dna-strand" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-lg"
        >
          View DNA Strand →
        </Link>
      </nav>
      
      {/* Existing KitViewer */}
      <KitViewer />
      
 
    </div>
  );
}

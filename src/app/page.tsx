import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-12">
        {/* Title */}
        <h1 className="text-6xl font-bold text-black mb-16">
          Explorations
        </h1>
        
        {/* Navigation Links */}
        <div className="space-y-4">
          <div>
            <Link 
              href="/logo"
              className="text-xl text-blue-600 hover:text-blue-800 underline"
            >
              Original Exploration
            </Link>
          </div>
          
          <div>
            <Link 
              href="/logo_chromo01"
              className="text-xl text-blue-600 hover:text-blue-800 underline"
            >
              Chromosome Exploration
            </Link>
          </div>
          
          <div>
            <Link 
              href="/logo_cross"
              className="text-xl text-blue-600 hover:text-blue-800 underline"
            >
              23andMe Logo Spin Exploration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

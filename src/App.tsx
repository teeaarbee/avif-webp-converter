import React from 'react';
import { ImageConverter } from './components/ImageConverter';
import { Image as ImageIcon } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">Divyanshu Image Converter</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <ImageConverter />
      </main>

      <footer className="mt-auto py-6 text-center text-gray-600">
        <p>Convert your images with ease</p>
      </footer>
    </div>
  );
}

export default App;
import { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

export function Catalog() {
  const { books, user, addToCart } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Agotado', color: 'text-red-600' };
    if (stock <= 5) return { text: 'Pocas piezas', color: 'text-orange-500' };
    return { text: 'Disponible', color: 'text-green-600' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-[#8B5F7D] mb-8 text-center">Catálogo de Libros</h1>

      {/* Search Bar */}
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar por título o autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-2 border-[#00BCD4] focus:ring-[#8B5F7D]"
          />
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600">
            Mostrando {filteredBooks.length} resultado(s)
          </p>
        )}
      </div>

      {/* Books Grid */}
      <div className="space-y-6">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No se encontraron libros que coincidan con tu búsqueda</p>
          </div>
        ) : (
          filteredBooks.map((book) => {
            const stockStatus = getStockStatus(book.stock);
            return (
              <div key={book.id} className="flex flex-col md:flex-row gap-6 border-2 border-[#00BCD4] rounded-lg p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="w-full md:w-48 flex-shrink-0">
                  <img 
                    src={book.image} 
                    alt={book.title}
                    className="w-full h-64 md:h-72 object-cover rounded"
                  />
                </div>
                
                <div className="flex-1 space-y-3">
                  <h2 className="text-[#8B5F7D]">{book.title}</h2>
                  <div className="space-y-1 text-gray-700">
                    <p>Autor: {book.author}</p>
                    <p>Año de publicación: {book.year}</p>
                    <p className="text-sm mt-2">Sinopsis: {book.synopsis}</p>
                  </div>
                  <p className={`${stockStatus.color}`}>{stockStatus.text}</p>
                </div>

                <div className="flex flex-col justify-between items-end md:w-48 gap-4">
                  <p className="text-[#8B5F7D]">${book.price}.00</p>
                  {book.stock > 0 && (
                    <Button
                      onClick={() => addToCart(book)}
                      className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white w-full md:w-auto"
                    >
                      Agregar
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
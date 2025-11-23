import { useApp } from '../App';
import { Button } from './ui/button';
import owlImage from '../assets/logo.png';

interface HomeProps {
  setCurrentPage: (page: any) => void;
}

export function Home({ setCurrentPage }: HomeProps) {
  const { books, user, addToCart } = useApp();
  
  // Mostrar los primeros 4 libros
  const featuredBooks = books.slice(0, 4);

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Agotado', color: 'text-red-600' };
    if (stock <= 5) return { text: 'Pocas piezas', color: 'text-orange-500' };
    return { text: 'Disponible', color: 'text-green-600' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-[#8B5F7D] mb-4">BIENVENID@S A</h1>
        <h2 className="text-[#F5B471] mb-8">EL NIDO LITERARIO</h2>
        <div className="flex justify-center mb-8">
          <img src={owlImage} alt="Búho leyendo" className="h-64 object-contain" />
        </div>
      </div>

      {/* Featured Books Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#8B5F7D]">Libros Destacados</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => {
            const stockStatus = getStockStatus(book.stock);
            return (
              <div key={book.id} className="border-2 border-[#00BCD4] rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow">
                <div className="aspect-[3/4] bg-gray-100">
                  <img 
                    src={book.image} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-[#8B5F7D] line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-gray-600">Autor: {book.author}</p>
                  <p className="text-sm text-gray-600">Año de publicación: {book.year}</p>
                  <p className="text-sm text-gray-700 line-clamp-3">{book.synopsis}</p>
                  <p className={`${stockStatus.color}`}>{stockStatus.text}</p>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[#8B5F7D]">${book.price}.00</p>
                    {book.stock > 0 && (
                      <Button
                        onClick={() => addToCart(book)}
                        className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white"
                        size="sm"
                      >
                        Agregar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center py-8">
        <Button
          onClick={() => setCurrentPage('catalog')}
          className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white"
        >
          Ver todos los libros
        </Button>
      </div>
    </div>
  );
}
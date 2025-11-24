import { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Edit, Search, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function AdminCatalog() {
  const { books, updateBook, addBook, deleteBook } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBook, setEditingBook] = useState<any>(null);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: 0,
    synopsis: '',
    price: 0,
    stock: 0,
    image: ''
  });

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditDialog = (book: any) => {
    setEditingBook(book);
    setIsAddingBook(false);
    setFormData({
      title: book.title,
      author: book.author,
      year: book.year,
      synopsis: book.synopsis,
      price: book.price,
      stock: book.stock,
      image: book.image
    });
  };

  const openAddDialog = () => {
    setIsAddingBook(true);
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      year: new Date().getFullYear(),
      synopsis: '',
      price: 0,
      stock: 0,
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop'
    });
  };

  const handleSave = () => {
    if (editingBook) {
      updateBook(editingBook.id, formData);
      setEditingBook(null);
      toast.success('Libro actualizado exitosamente');
    } else if (isAddingBook) {
      addBook(formData);
      setIsAddingBook(false);
      toast.success('Libro agregado exitosamente');
    }
  };

  const handleDelete = (bookId: number) => {
    deleteBook(bookId);
    toast.success('Libro eliminado exitosamente');
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Agotado', color: 'text-red-600' };
    if (stock <= 5) return { text: 'Pocas piezas', color: 'text-orange-500' };
    return { text: 'Disponible', color: 'text-green-600' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-[#8B5F7D]">Administrar Catálogo</h1>
        
        {/* Add New Book Button */}
        <Dialog open={isAddingBook} onOpenChange={setIsAddingBook}>
          <DialogTrigger asChild>
            <Button
              onClick={openAddDialog}
              className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Agregar Nuevo Libro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-[#8B5F7D]">Agregar Nuevo Libro</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-title">Título</Label>
                <Input
                  id="new-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="border-[#00BCD4]"
                  placeholder="Ingrese el título del libro"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-author">Autor</Label>
                <Input
                  id="new-author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="border-[#00BCD4]"
                  placeholder="Ingrese el nombre del autor"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-year">Año de publicación</Label>
                  <Input
                    id="new-year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="border-[#00BCD4]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-price">Precio</Label>
                  <Input
                    id="new-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="border-[#00BCD4]"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-stock">Cantidad de piezas disponibles</Label>
                <Input
                  id="new-stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className="border-[#00BCD4]"
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-image">URL de la imagen</Label>
                <Input
                  id="new-image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="border-[#00BCD4]"
                  placeholder="https://..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-synopsis">Sinopsis</Label>
                <Textarea
                  id="new-synopsis"
                  value={formData.synopsis}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  className="border-[#00BCD4] min-h-[120px]"
                  placeholder="Ingrese la sinopsis del libro"
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-[#00BCD4] hover:bg-[#00ACC1] text-white"
                >
                  Agregar Libro
                </Button>
                <Button
                  onClick={() => setIsAddingBook(false)}
                  variant="outline"
                  className="flex-1 border-[#8B5F7D] text-[#8B5F7D]"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
        {filteredBooks.map((book) => {
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
                  <p className="text-sm">Precio: ${book.price}.00</p>
                  <p className={`${stockStatus.color}`}>
                    Stock: {book.stock} piezas - {stockStatus.text}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center md:w-48">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => openEditDialog(book)}
                      className="bg-[#8B5F7D] hover:bg-[#7A4E6C] text-white w-full"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-[#8B5F7D]">Editar Libro</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="border-[#00BCD4]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="author">Autor</Label>
                        <Input
                          id="author"
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          className="border-[#00BCD4]"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="year">Año de publicación</Label>
                          <Input
                            id="year"
                            type="number"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                            className="border-[#00BCD4]"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="price">Precio</Label>
                          <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                            className="border-[#00BCD4]"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="stock">Cantidad de piezas disponibles</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                          className="border-[#00BCD4]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="synopsis">Sinopsis</Label>
                        <Textarea
                          id="synopsis"
                          value={formData.synopsis}
                          onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                          className="border-[#00BCD4] min-h-[120px]"
                        />
                      </div>
                      
                      <div className="flex gap-4 pt-4">
                        <Button
                          onClick={handleSave}
                          className="flex-1 bg-[#00BCD4] hover:bg-[#00ACC1] text-white"
                        >
                          Guardar Cambios
                        </Button>
                        <Button
                          onClick={() => {
                            if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
                              handleDelete(editingBook.id);
                              setEditingBook(null);
                            }
                          }}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                        <Button
                          onClick={() => setEditingBook(null)}
                          variant="outline"
                          className="flex-1 border-[#8B5F7D] text-[#8B5F7D]"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
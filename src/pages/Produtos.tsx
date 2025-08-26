import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Edit, Trash2, Package, DollarSign, Tag, Barcode, Building2, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

// Interface para Produto
interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  barcode: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Interface para Fornecedor
interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Interface para Categoria
interface Category {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  productsCount: number;
  createdAt: string;
}

// Dados mock de produtos
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Coca-Cola 2L',
    category: 'Bebidas',
    brand: 'Coca-Cola',
    barcode: '7894900011517',
    description: 'Refrigerante Coca-Cola 2 litros',
    price: 8.99,
    cost: 5.50,
    stock: 24,
    minStock: 5,
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Arroz Branco 5kg',
    category: 'Grãos',
    brand: 'Tio João',
    barcode: '7891234567890',
    description: 'Arroz branco tipo 1, pacote 5kg',
    price: 22.50,
    cost: 18.00,
    stock: 12,
    minStock: 3,
    status: 'active',
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Leite Integral 1L',
    category: 'Laticínios',
    brand: 'Nestlé',
    barcode: '7891000100103',
    description: 'Leite integral UHT 1 litro',
    price: 4.89,
    cost: 3.20,
    stock: 2,
    minStock: 10,
    status: 'active',
    createdAt: '2024-01-25'
  }
];

const categories = ['Todos', 'Bebidas', 'Grãos', 'Laticínios', 'Limpeza', 'Higiene', 'Carnes', 'Frutas'];

// Dados mock de fornecedores
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Distribuidora ABC',
    contact: 'João Silva',
    phone: '(11) 1234-5678',
    email: 'contato@abc.com.br',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    category: 'Bebidas',
    status: 'active',
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Atacado XYZ',
    contact: 'Maria Santos',
    phone: '(11) 9876-5432',
    email: 'vendas@xyz.com.br',
    address: 'Av. Principal, 456 - São Paulo, SP',
    category: 'Grãos',
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    name: 'Laticínios Premium',
    contact: 'Pedro Oliveira',
    phone: '(11) 5555-1234',
    email: 'pedro@premium.com.br',
    address: 'Estrada Rural, 789 - Interior, SP',
    category: 'Laticínios',
    status: 'inactive',
    createdAt: '2024-01-20'
  }
];

// Dados mock de categorias
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Bebidas',
    description: 'Refrigerantes, sucos, águas e bebidas em geral',
    status: 'active',
    productsCount: 15,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Grãos',
    description: 'Arroz, feijão, lentilha e outros grãos',
    status: 'active',
    productsCount: 8,
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'Laticínios',
    description: 'Leite, queijo, iogurte e derivados',
    status: 'active',
    productsCount: 12,
    createdAt: '2024-01-01'
  },
  {
    id: '4',
    name: 'Limpeza',
    description: 'Produtos de limpeza e higienização',
    status: 'active',
    productsCount: 20,
    createdAt: '2024-01-01'
  },
  {
    id: '5',
    name: 'Higiene',
    description: 'Produtos de higiene pessoal',
    status: 'inactive',
    productsCount: 0,
    createdAt: '2024-01-01'
  }
];

export default function Produtos() {
  // States para Produtos
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: '',
    brand: '',
    barcode: '',
    description: '',
    price: 0,
    cost: 0,
    stock: 0,
    minStock: 0,
    status: 'active'
  });

  // States para Fornecedores
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState('');
  const [isAddSupplierDialogOpen, setIsAddSupplierDialogOpen] = useState(false);
  const [isEditSupplierDialogOpen, setIsEditSupplierDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: '',
    contact: '',
    phone: '',
    email: '',
    address: '',
    category: '',
    status: 'active'
  });

  // States para Categorias
  const [categoriesData, setCategoriesData] = useState<Category[]>(mockCategories);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    description: '',
    status: 'active'
  });

  // Fornecedores filtrados
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(supplierSearchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(supplierSearchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(supplierSearchTerm.toLowerCase())
  );

  // Categorias filtradas
  const filteredCategories = categoriesData.filter(category =>
    category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  // Produtos filtrados
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Métricas
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length;

  const totalCategories = categoriesData.length;
  const activeCategories = categoriesData.filter(c => c.status === 'active').length;

  // Status do produto
  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge variant="secondary" className="bg-green-100 text-green-800">Ativo</Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">Inativo</Badge>
    );
  };

  // Status do estoque
  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return 'Sem estoque';
    if (stock <= minStock) return 'Estoque baixo';
    return 'Normal';
  };

  const getStockBadge = (stock: number, minStock: number) => {
    const status = getStockStatus(stock, minStock);
    if (status === 'Sem estoque') {
      return <Badge variant="destructive">Sem estoque</Badge>;
    } else if (status === 'Estoque baixo') {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Estoque baixo</Badge>;
    }
    return <Badge variant="secondary" className="bg-green-100 text-green-800">Normal</Badge>;
  };

  // Adicionar produto
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.brand) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name!,
      category: newProduct.category!,
      brand: newProduct.brand!,
      barcode: newProduct.barcode || '',
      description: newProduct.description || '',
      price: Number(newProduct.price) || 0,
      cost: Number(newProduct.cost) || 0,
      stock: Number(newProduct.stock) || 0,
      minStock: Number(newProduct.minStock) || 0,
      status: newProduct.status as 'active' | 'inactive' || 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProducts([...products, product]);
    setNewProduct({
      name: '',
      category: '',
      brand: '',
      barcode: '',
      description: '',
      price: 0,
      cost: 0,
      stock: 0,
      minStock: 0,
      status: 'active'
    });
    setIsAddDialogOpen(false);
    toast.success('Produto adicionado com sucesso!');
  };

  // Editar produto
  const handleEditProduct = () => {
    if (!editingProduct) return;

    const updatedProducts = products.map(product =>
      product.id === editingProduct.id ? editingProduct : product
    );
    setProducts(updatedProducts);
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    toast.success('Produto atualizado com sucesso!');
  };

  // Excluir produto
  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    toast.success('Produto excluído com sucesso!');
  };

  // Adicionar fornecedor
  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.contact) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const supplier: Supplier = {
      id: Date.now().toString(),
      name: newSupplier.name!,
      contact: newSupplier.contact!,
      phone: newSupplier.phone || '',
      email: newSupplier.email || '',
      address: newSupplier.address || '',
      category: newSupplier.category || '',
      status: newSupplier.status as 'active' | 'inactive' || 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSuppliers([...suppliers, supplier]);
    setNewSupplier({
      name: '',
      contact: '',
      phone: '',
      email: '',
      address: '',
      category: '',
      status: 'active'
    });
    setIsAddSupplierDialogOpen(false);
    toast.success('Fornecedor adicionado com sucesso!');
  };

  // Editar fornecedor
  const handleEditSupplier = () => {
    if (!editingSupplier) return;

    const updatedSuppliers = suppliers.map(supplier =>
      supplier.id === editingSupplier.id ? editingSupplier : supplier
    );
    setSuppliers(updatedSuppliers);
    setIsEditSupplierDialogOpen(false);
    setEditingSupplier(null);
    toast.success('Fornecedor atualizado com sucesso!');
  };

  // Excluir fornecedor
  const handleDeleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    toast.success('Fornecedor excluído com sucesso!');
  };

  // Adicionar categoria
  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name!,
      description: newCategory.description || '',
      status: newCategory.status as 'active' | 'inactive' || 'active',
      productsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCategoriesData([...categoriesData, category]);
    setNewCategory({
      name: '',
      description: '',
      status: 'active'
    });
    setIsAddCategoryDialogOpen(false);
    toast.success('Categoria adicionada com sucesso!');
  };

  // Editar categoria
  const handleEditCategory = () => {
    if (!editingCategory) return;

    const updatedCategories = categoriesData.map(category =>
      category.id === editingCategory.id ? editingCategory : category
    );
    setCategoriesData(updatedCategories);
    setIsEditCategoryDialogOpen(false);
    setEditingCategory(null);
    toast.success('Categoria atualizada com sucesso!');
  };

  // Excluir categoria
  const handleDeleteCategory = (id: string) => {
    setCategoriesData(categoriesData.filter(category => category.id !== id));
    toast.success('Categoria excluída com sucesso!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Produtos</h1>
          <p className="text-muted-foreground">Gerencie produtos, fornecedores e categorias</p>
        </div>

        {/* Abas principais */}
        <Tabs defaultValue="produtos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="produtos" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="fornecedores" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Fornecedores
            </TabsTrigger>
            <TabsTrigger value="categorias" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Categorias
            </TabsTrigger>
          </TabsList>

          {/* Aba Produtos */}
          <TabsContent value="produtos" className="space-y-6">
            {/* Cards de métricas - Produtos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    {activeProducts} ativos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{lowStockProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    produtos com estoque baixo
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {totalValue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    valor em estoque
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categorias</CardTitle>
                  <Barcode className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length - 1}</div>
                  <p className="text-xs text-muted-foreground">
                    categorias ativas
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filtros e ações - Produtos */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Buscar por nome, marca ou código de barras..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Produto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Produto</DialogTitle>
                        <DialogDescription>
                          Preencha as informações do produto
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome *</Label>
                          <Input
                            id="name"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            placeholder="Nome do produto"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="brand">Marca *</Label>
                          <Input
                            id="brand"
                            value={newProduct.brand}
                            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                            placeholder="Marca do produto"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Categoria *</Label>
                          <Select
                            value={newProduct.category}
                            onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.slice(1).map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="barcode">Código de Barras</Label>
                          <Input
                            id="barcode"
                            value={newProduct.barcode}
                            onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                            placeholder="Código de barras"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">Preço de Venda</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cost">Preço de Custo</Label>
                          <Input
                            id="cost"
                            type="number"
                            step="0.01"
                            value={newProduct.cost}
                            onChange={(e) => setNewProduct({ ...newProduct, cost: Number(e.target.value) })}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="stock">Estoque Atual</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="minStock">Estoque Mínimo</Label>
                          <Input
                            id="minStock"
                            type="number"
                            value={newProduct.minStock}
                            onChange={(e) => setNewProduct({ ...newProduct, minStock: Number(e.target.value) })}
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea
                            id="description"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            placeholder="Descrição do produto"
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddProduct}>
                          Adicionar Produto
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Estoque</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              {product.barcode && (
                                <div className="text-sm text-muted-foreground">{product.barcode}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.brand}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{product.stock}</span>
                              {getStockBadge(product.stock, product.minStock)}
                            </div>
                          </TableCell>
                          <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(product.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Fornecedores */}
          <TabsContent value="fornecedores" className="space-y-6">
            {/* Cards de métricas - Fornecedores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Fornecedores</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSuppliers}</div>
                  <p className="text-xs text-muted-foreground">
                    {activeSuppliers} ativos
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filtros e ações - Fornecedores */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar por nome, contato ou email..."
                      value={supplierSearchTerm}
                      onChange={(e) => setSupplierSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Dialog open={isAddSupplierDialogOpen} onOpenChange={setIsAddSupplierDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Fornecedor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Fornecedor</DialogTitle>
                        <DialogDescription>
                          Preencha as informações do fornecedor
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="supplier-name">Nome *</Label>
                          <Input
                            id="supplier-name"
                            value={newSupplier.name}
                            onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                            placeholder="Nome da empresa"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="supplier-contact">Contato *</Label>
                          <Input
                            id="supplier-contact"
                            value={newSupplier.contact}
                            onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                            placeholder="Nome do contato"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="supplier-phone">Telefone</Label>
                          <Input
                            id="supplier-phone"
                            value={newSupplier.phone}
                            onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                            placeholder="(11) 1234-5678"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="supplier-email">Email</Label>
                          <Input
                            id="supplier-email"
                            type="email"
                            value={newSupplier.email}
                            onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                            placeholder="contato@empresa.com"
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="supplier-address">Endereço</Label>
                          <Textarea
                            id="supplier-address"
                            value={newSupplier.address}
                            onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                            placeholder="Endereço completo"
                            rows={2}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddSupplierDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddSupplier}>
                          Adicionar Fornecedor
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSuppliers.map((supplier) => (
                        <TableRow key={supplier.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{supplier.name}</div>
                              <div className="text-sm text-muted-foreground">{supplier.category}</div>
                            </div>
                          </TableCell>
                          <TableCell>{supplier.contact}</TableCell>
                          <TableCell>{supplier.phone}</TableCell>
                          <TableCell>{supplier.email}</TableCell>
                          <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingSupplier(supplier);
                                  setIsEditSupplierDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSupplier(supplier.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Categorias */}
          <TabsContent value="categorias" className="space-y-6">
            {/* Cards de métricas - Categorias */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Categorias</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCategories}</div>
                  <p className="text-xs text-muted-foreground">
                    {activeCategories} ativas
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filtros e ações - Categorias */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar por nome da categoria..."
                      value={categorySearchTerm}
                      onChange={(e) => setCategorySearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Categoria
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Nova Categoria</DialogTitle>
                        <DialogDescription>
                          Preencha as informações da categoria
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="category-name">Nome *</Label>
                          <Input
                            id="category-name"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            placeholder="Nome da categoria"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category-description">Descrição</Label>
                          <Textarea
                            id="category-description"
                            value={newCategory.description}
                            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                            placeholder="Descrição da categoria"
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddCategory}>
                          Adicionar Categoria
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Produtos</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCategories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>
                            <div className="font-medium">{category.name}</div>
                          </TableCell>
                          <TableCell>{category.description}</TableCell>
                          <TableCell>{category.productsCount}</TableCell>
                          <TableCell>{getStatusBadge(category.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingCategory(category);
                                  setIsEditCategoryDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Diálogos de edição */}
        
        {/* Dialog de edição - Produto */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
              <DialogDescription>
                Altere as informações do produto
              </DialogDescription>
            </DialogHeader>
            {editingProduct && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome *</Label>
                  <Input
                    id="edit-name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-brand">Marca *</Label>
                  <Input
                    id="edit-brand"
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Categoria *</Label>
                  <Select
                    value={editingProduct.category}
                    onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-barcode">Código de Barras</Label>
                  <Input
                    id="edit-barcode"
                    value={editingProduct.barcode}
                    onChange={(e) => setEditingProduct({ ...editingProduct, barcode: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Preço de Venda</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cost">Preço de Custo</Label>
                  <Input
                    id="edit-cost"
                    type="number"
                    step="0.01"
                    value={editingProduct.cost}
                    onChange={(e) => setEditingProduct({ ...editingProduct, cost: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Estoque Atual</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-minStock">Estoque Mínimo</Label>
                  <Input
                    id="edit-minStock"
                    type="number"
                    value={editingProduct.minStock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, minStock: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingProduct.status}
                    onValueChange={(value: 'active' | 'inactive') => setEditingProduct({ ...editingProduct, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit-description">Descrição</Label>
                  <Textarea
                    id="edit-description"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditProduct}>
                Salvar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog de edição - Fornecedor */}
        <Dialog open={isEditSupplierDialogOpen} onOpenChange={setIsEditSupplierDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Fornecedor</DialogTitle>
              <DialogDescription>
                Altere as informações do fornecedor
              </DialogDescription>
            </DialogHeader>
            {editingSupplier && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-supplier-name">Nome *</Label>
                  <Input
                    id="edit-supplier-name"
                    value={editingSupplier.name}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-supplier-contact">Contato *</Label>
                  <Input
                    id="edit-supplier-contact"
                    value={editingSupplier.contact}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, contact: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-supplier-phone">Telefone</Label>
                  <Input
                    id="edit-supplier-phone"
                    value={editingSupplier.phone}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-supplier-email">Email</Label>
                  <Input
                    id="edit-supplier-email"
                    type="email"
                    value={editingSupplier.email}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-supplier-status">Status</Label>
                  <Select
                    value={editingSupplier.status}
                    onValueChange={(value: 'active' | 'inactive') => setEditingSupplier({ ...editingSupplier, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit-supplier-address">Endereço</Label>
                  <Textarea
                    id="edit-supplier-address"
                    value={editingSupplier.address}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, address: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditSupplierDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditSupplier}>
                Salvar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog de edição - Categoria */}
        <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoria</DialogTitle>
              <DialogDescription>
                Altere as informações da categoria
              </DialogDescription>
            </DialogHeader>
            {editingCategory && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category-name">Nome *</Label>
                  <Input
                    id="edit-category-name"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category-description">Descrição</Label>
                  <Textarea
                    id="edit-category-description"
                    value={editingCategory.description}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category-status">Status</Label>
                  <Select
                    value={editingCategory.status}
                    onValueChange={(value: 'active' | 'inactive') => setEditingCategory({ ...editingCategory, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditCategoryDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditCategory}>
                Salvar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
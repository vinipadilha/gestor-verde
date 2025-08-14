import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Plus, 
  Edit, 
  Package, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  supplier: string;
  barcode: string;
  description: string;
  lastMovement: string;
  status: "active" | "inactive" | "low_stock";
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Arroz Integral 5kg",
    category: "Grãos",
    price: 25.90,
    cost: 18.50,
    stock: 50,
    minStock: 10,
    maxStock: 100,
    supplier: "Distribuidora ABC",
    barcode: "7891234567890",
    description: "Arroz integral premium, rico em fibras",
    lastMovement: "2024-01-10",
    status: "active"
  },
  {
    id: "2",
    name: "Feijão Preto 1kg",
    category: "Grãos",
    price: 8.50,
    cost: 5.80,
    stock: 5,
    minStock: 15,
    maxStock: 80,
    supplier: "Grãos do Sul",
    barcode: "7891234567891",
    description: "Feijão preto selecionado",
    lastMovement: "2024-01-12",
    status: "low_stock"
  },
  {
    id: "3",
    name: "Óleo de Soja 900ml",
    category: "Óleos",
    price: 6.90,
    cost: 4.20,
    stock: 25,
    minStock: 8,
    maxStock: 60,
    supplier: "Óleos Naturais",
    barcode: "7891234567892",
    description: "Óleo de soja refinado",
    lastMovement: "2024-01-11",
    status: "active"
  },
  {
    id: "4",
    name: "Leite Integral 1L",
    category: "Laticínios",
    price: 5.50,
    cost: 3.80,
    stock: 3,
    minStock: 20,
    maxStock: 100,
    supplier: "Laticínios Fresco",
    barcode: "7891234567895",
    description: "Leite integral pasteurizado",
    lastMovement: "2024-01-13",
    status: "low_stock"
  }
];

const categories = ["Todos", "Grãos", "Óleos", "Laticínios", "Padaria", "Higiene", "Limpeza"];

const Estoque = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const { toast } = useToast();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (product: Product) => {
    if (product.stock <= product.minStock) return "low";
    if (product.stock >= product.maxStock) return "high";
    return "normal";
  };

  const getStockBadge = (product: Product) => {
    const status = getStockStatus(product);
    if (status === "low") {
      return <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="w-3 h-3" />
        Baixo
      </Badge>;
    }
    if (status === "high") {
      return <Badge variant="secondary" className="gap-1">
        <TrendingUp className="w-3 h-3" />
        Alto
      </Badge>;
    }
    return <Badge variant="default" className="gap-1">
      <Package className="w-3 h-3" />
      Normal
    </Badge>;
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, categoria e preço",
        variant: "destructive"
      });
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name || "",
      category: newProduct.category || "",
      price: newProduct.price || 0,
      cost: newProduct.cost || 0,
      stock: newProduct.stock || 0,
      minStock: newProduct.minStock || 5,
      maxStock: newProduct.maxStock || 100,
      supplier: newProduct.supplier || "",
      barcode: newProduct.barcode || "",
      description: newProduct.description || "",
      lastMovement: new Date().toISOString().split('T')[0],
      status: "active"
    };

    setProducts([...products, product]);
    setNewProduct({});
    setIsAddDialogOpen(false);
    
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao estoque`
    });
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;

    setProducts(products.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    ));
    
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    
    toast({
      title: "Produto atualizado!",
      description: `${editingProduct.name} foi atualizado`
    });
  };

  const adjustStock = (productId: string, adjustment: number) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, stock: Math.max(0, p.stock + adjustment), lastMovement: new Date().toISOString().split('T')[0] }
        : p
    ));
    
    const movement = adjustment > 0 ? "Entrada" : "Saída";
    toast({
      title: `${movement} de estoque`,
      description: `${Math.abs(adjustment)} unidades ${adjustment > 0 ? "adicionadas" : "removidas"}`
    });
  };

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Controle de Estoque</h1>
            <p className="text-muted-foreground">
              Gerencie produtos, quantidades e movimentações
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Produto</DialogTitle>
                <DialogDescription>
                  Preencha os dados do produto para adicionar ao estoque
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input
                    id="name"
                    value={newProduct.name || ""}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Ex: Arroz Integral 5kg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== "Todos").map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Preço de Venda *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price || ""}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Preço de Custo</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={newProduct.cost || ""}
                    onChange={(e) => setNewProduct({...newProduct, cost: parseFloat(e.target.value)})}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Estoque Inicial</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock || ""}
                    onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Estoque Mínimo</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={newProduct.minStock || ""}
                    onChange={(e) => setNewProduct({...newProduct, minStock: parseInt(e.target.value)})}
                    placeholder="5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Fornecedor</Label>
                  <Input
                    id="supplier"
                    value={newProduct.supplier || ""}
                    onChange={(e) => setNewProduct({...newProduct, supplier: e.target.value})}
                    placeholder="Nome do fornecedor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode">Código de Barras</Label>
                  <Input
                    id="barcode"
                    value={newProduct.barcode || ""}
                    onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                    placeholder="7891234567890"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description || ""}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Descrição detalhada do produto"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
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

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">produtos cadastrados</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
              <AlertTriangle className="w-4 h-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{lowStockCount}</div>
              <p className="text-xs text-muted-foreground">produtos para repor</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <TrendingUp className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">R$ {totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">valor do estoque</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorias</CardTitle>
              <Filter className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length - 1}</div>
              <p className="text-xs text-muted-foreground">categorias ativas</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou código de barras..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Produtos */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.barcode}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-bold">{product.stock}</div>
                        <div className="text-xs text-muted-foreground">
                          Min: {product.minStock}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStockBadge(product)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">R$ {product.price.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          Custo: R$ {product.cost.toFixed(2)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.supplier}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => adjustStock(product.id, -1)}
                          disabled={product.stock === 0}
                        >
                          <TrendingDown className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => adjustStock(product.id, 1)}
                        >
                          <TrendingUp className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingProduct(product);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dialog de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
              <DialogDescription>
                Atualize as informações do produto
              </DialogDescription>
            </DialogHeader>
            {editingProduct && (
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome do Produto</Label>
                  <Input
                    id="edit-name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Categoria</Label>
                  <Select 
                    value={editingProduct.category}
                    onValueChange={(value) => setEditingProduct({...editingProduct, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== "Todos").map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Preço de Venda</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cost">Preço de Custo</Label>
                  <Input
                    id="edit-cost"
                    type="number"
                    step="0.01"
                    value={editingProduct.cost}
                    onChange={(e) => setEditingProduct({...editingProduct, cost: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Estoque Atual</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-minStock">Estoque Mínimo</Label>
                  <Input
                    id="edit-minStock"
                    type="number"
                    value={editingProduct.minStock}
                    onChange={(e) => setEditingProduct({...editingProduct, minStock: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-supplier">Fornecedor</Label>
                  <Input
                    id="edit-supplier"
                    value={editingProduct.supplier}
                    onChange={(e) => setEditingProduct({...editingProduct, supplier: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-barcode">Código de Barras</Label>
                  <Input
                    id="edit-barcode"
                    value={editingProduct.barcode}
                    onChange={(e) => setEditingProduct({...editingProduct, barcode: e.target.value})}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit-description">Descrição</Label>
                  <Textarea
                    id="edit-description"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditProduct}>
                Salvar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Estoque;
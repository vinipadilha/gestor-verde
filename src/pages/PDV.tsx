import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus,
  CreditCard,
  Banknote,
  Receipt
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  barcode: string;
  category: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

const mockProducts: Product[] = [
  { id: "1", name: "Arroz Integral 5kg", price: 25.90, barcode: "7891234567890", category: "Grãos", stock: 50 },
  { id: "2", name: "Feijão Preto 1kg", price: 8.50, barcode: "7891234567891", category: "Grãos", stock: 30 },
  { id: "3", name: "Óleo de Soja 900ml", price: 6.90, barcode: "7891234567892", category: "Óleos", stock: 25 },
  { id: "4", name: "Açúcar Cristal 1kg", price: 4.20, barcode: "7891234567893", category: "Açúcar", stock: 40 },
  { id: "5", name: "Farinha de Trigo 1kg", price: 3.80, barcode: "7891234567894", category: "Farinhas", stock: 35 },
  { id: "6", name: "Leite Integral 1L", price: 5.50, barcode: "7891234567895", category: "Laticínios", stock: 20 },
  { id: "7", name: "Pão de Forma", price: 4.50, barcode: "7891234567896", category: "Padaria", stock: 15 },
  { id: "8", name: "Sabonete Neutro", price: 2.80, barcode: "7891234567897", category: "Higiene", stock: 60 },
];

const PDV = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<"dinheiro" | "cartao" | null>(null);
  const { toast } = useToast();

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast({
          title: "Estoque insuficiente",
          description: `Apenas ${product.stock} unidades disponíveis`,
          variant: "destructive"
        });
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    const product = mockProducts.find(p => p.id === id);
    if (product && newQuantity > product.stock) {
      toast({
        title: "Estoque insuficiente",
        description: `Apenas ${product.stock} unidades disponíveis`,
        variant: "destructive"
      });
      return;
    }

    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const finalizeSale = () => {
    if (cart.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos antes de finalizar a venda",
        variant: "destructive"
      });
      return;
    }

    if (!selectedPayment) {
      toast({
        title: "Forma de pagamento",
        description: "Selecione uma forma de pagamento",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Venda finalizada!",
      description: `Total: R$ ${total.toFixed(2)} - Pagamento: ${selectedPayment === "dinheiro" ? "Dinheiro" : "Cartão"}`,
    });

    // Reset
    setCart([]);
    setSelectedPayment(null);
    setSearchTerm("");
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">PDV - Ponto de Venda</h1>
            <p className="text-muted-foreground">Interface para operadores de caixa</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <ShoppingCart className="w-4 h-4 mr-2" />
              {itemCount} itens
            </Badge>
            <Badge variant="default" className="text-lg px-4 py-2 bg-primary">
              Total: R$ {total.toFixed(2)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Produtos e Busca */}
          <div className="lg:col-span-2 space-y-4">
            {/* Busca */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Buscar Produtos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Digite o nome do produto ou código de barras..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-lg h-12"
                    autoFocus
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lista de Produtos */}
            <Card>
              <CardHeader>
                <CardTitle>Produtos Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => addToCart(product)}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Estoque: {product.stock}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          R$ {product.price.toFixed(2)}
                        </p>
                        <Button size="sm" className="mt-1">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Carrinho e Finalização */}
          <div className="space-y-4">
            {/* Carrinho */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Carrinho de Compras
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Carrinho vazio
                  </p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            R$ {item.price.toFixed(2)} cada
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Forma de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle>Forma de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant={selectedPayment === "dinheiro" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedPayment("dinheiro")}
                >
                  <Banknote className="w-4 h-4 mr-2" />
                  Dinheiro
                </Button>
                <Button
                  variant={selectedPayment === "cartao" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedPayment("cartao")}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Cartão
                </Button>
              </CardContent>
            </Card>

            {/* Total e Finalização */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Subtotal:</span>
                    <span className="text-lg">R$ {total.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total:</span>
                    <span className="text-xl font-bold text-primary">R$ {total.toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full h-12 text-lg"
                    onClick={finalizeSale}
                    disabled={cart.length === 0}
                  >
                    <Receipt className="w-5 h-5 mr-2" />
                    Finalizar Venda
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PDV;
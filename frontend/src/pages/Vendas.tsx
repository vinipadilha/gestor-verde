import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, DollarSign, ShoppingCart, TrendingUp, Search, Filter, Download } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";

interface Sale {
  id: string;
  data: string;
  hora: string;
  itens: Array<{
    produto: string;
    quantidade: number;
    preco: number;
  }>;
  total: number;
  pagamento: "Dinheiro" | "Cartão";
  status: "Concluída" | "Cancelada";
  operador: string;
}

const mockSales: Sale[] = [
  {
    id: "V001",
    data: "19/08/2025",
    hora: "09:15",
    itens: [
      { produto: "Arroz 5kg", quantidade: 2, preco: 25.90 },
      { produto: "Feijão 1kg", quantidade: 1, preco: 8.50 }
    ],
    total: 60.30,
    pagamento: "Cartão",
    status: "Concluída",
    operador: "João Silva"
  },
  {
    id: "V002",
    data: "19/08/2025",
    hora: "10:32",
    itens: [
      { produto: "Coca-Cola 2L", quantidade: 3, preco: 7.50 },
      { produto: "Pão Francês", quantidade: 1, preco: 12.00 }
    ],
    total: 34.50,
    pagamento: "Dinheiro",
    status: "Concluída",
    operador: "Maria Santos"
  },
  {
    id: "V003",
    data: "19/08/2025",
    hora: "11:45",
    itens: [
      { produto: "Leite 1L", quantidade: 4, preco: 4.80 },
      { produto: "Ovos Dúzia", quantidade: 2, preco: 8.90 }
    ],
    total: 37.00,
    pagamento: "Cartão",
    status: "Concluída",
    operador: "João Silva"
  },
  {
    id: "V004",
    data: "18/08/2025",
    hora: "15:20",
    itens: [
      { produto: "Açúcar 1kg", quantidade: 1, preco: 5.20 }
    ],
    total: 5.20,
    pagamento: "Dinheiro",
    status: "Cancelada",
    operador: "Maria Santos"
  }
];

export default function Vendas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todas");
  const [filterPayment, setFilterPayment] = useState("todos");

  const filteredSales = mockSales.filter(sale => {
    const matchesSearch = sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.operador.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "todas" || sale.status.toLowerCase() === filterStatus;
    const matchesPayment = filterPayment === "todos" || sale.pagamento.toLowerCase() === filterPayment;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalVendas = mockSales.filter(sale => sale.status === "Concluída").length;
  const faturamentoTotal = mockSales
    .filter(sale => sale.status === "Concluída")
    .reduce((acc, sale) => acc + sale.total, 0);
  const ticketMedio = totalVendas > 0 ? faturamentoTotal / totalVendas : 0;
  const vendasCanceladas = mockSales.filter(sale => sale.status === "Cancelada").length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Relatório de Vendas</h1>
            <p className="text-muted-foreground">Acompanhe o histórico e performance das vendas</p>
          </div>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Exportar Relatório
          </Button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total de Vendas"
            value={totalVendas.toString()}
            icon={ShoppingCart}
            description="Vendas concluídas hoje"
          />
          <MetricCard
            title="Faturamento"
            value={`R$ ${faturamentoTotal.toFixed(2)}`}
            icon={DollarSign}
            description="Receita total do dia"
          />
          <MetricCard
            title="Ticket Médio"
            value={`R$ ${ticketMedio.toFixed(2)}`}
            icon={TrendingUp}
            description="Valor médio por venda"
          />
          <MetricCard
            title="Vendas Canceladas"
            value={vendasCanceladas.toString()}
            icon={Calendar}
            description="Cancelamentos hoje"
          />
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar por ID da venda ou operador..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="concluída">Concluídas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPayment} onValueChange={setFilterPayment}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="cartão">Cartão</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Vendas */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Vendas</CardTitle>
            <CardDescription>
              Lista completa de todas as vendas registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Itens</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Operador</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.id}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{sale.data}</div>
                          <div className="text-muted-foreground">{sale.hora}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          {sale.itens.map((item, index) => (
                            <div key={index} className="text-xs">
                              {item.quantidade}x {item.produto}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        R$ {sale.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={sale.pagamento === "Cartão" ? "secondary" : "outline"}>
                          {sale.pagamento}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={sale.status === "Concluída" ? "default" : "destructive"}
                        >
                          {sale.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{sale.operador}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredSales.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma venda encontrada com os filtros aplicados.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
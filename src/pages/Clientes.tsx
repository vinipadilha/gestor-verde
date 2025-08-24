import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, UserPlus, Search, Filter, Edit, Trash2, Eye, Phone, Mail, MapPin } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { useToast } from "@/hooks/use-toast";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  dataCadastro: string;
  ultimaCompra: string;
  totalCompras: number;
  status: "Ativo" | "Inativo";
  observacoes?: string;
}

const mockClientes: Cliente[] = [
  {
    id: "C001",
    nome: "Ana Silva Santos",
    email: "ana.silva@email.com",
    telefone: "(11) 99999-1234",
    cpf: "123.456.789-00",
    endereco: "Rua das Flores, 123",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01234-567",
    dataCadastro: "15/01/2024",
    ultimaCompra: "18/08/2025",
    totalCompras: 1250.80,
    status: "Ativo",
    observacoes: "Cliente VIP, sempre pontual nos pagamentos"
  },
  {
    id: "C002", 
    nome: "João Pereira Costa",
    email: "joao.costa@email.com",
    telefone: "(11) 88888-5678",
    cpf: "987.654.321-00",
    endereco: "Av. Principal, 456",
    cidade: "São Paulo",
    estado: "SP", 
    cep: "05678-901",
    dataCadastro: "22/02/2024",
    ultimaCompra: "16/08/2025",
    totalCompras: 890.45,
    status: "Ativo"
  },
  {
    id: "C003",
    nome: "Maria Oliveira",
    email: "maria.oliveira@email.com", 
    telefone: "(11) 77777-9012",
    cpf: "456.789.123-00",
    endereco: "Rua da Paz, 789",
    cidade: "São Paulo",
    estado: "SP",
    cep: "02345-678",
    dataCadastro: "10/03/2024",
    ultimaCompra: "12/08/2025",
    totalCompras: 2340.60,
    status: "Ativo"
  },
  {
    id: "C004",
    nome: "Carlos Mendes",
    email: "carlos.mendes@email.com",
    telefone: "(11) 66666-3456", 
    cpf: "789.123.456-00",
    endereco: "Rua do Comércio, 321",
    cidade: "São Paulo",
    estado: "SP",
    cep: "03456-789",
    dataCadastro: "05/12/2023",
    ultimaCompra: "01/07/2025",
    totalCompras: 450.30,
    status: "Inativo",
    observacoes: "Cliente com histórico de atraso"
  }
];

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [viewingCliente, setViewingCliente] = useState<Cliente | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    observacoes: ""
  });

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.cpf.includes(searchTerm);
    const matchesStatus = filterStatus === "todos" || cliente.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalClientes = clientes.length;
  const clientesAtivos = clientes.filter(c => c.status === "Ativo").length;
  const faturamentoTotal = clientes.reduce((acc, cliente) => acc + cliente.totalCompras, 0);
  const ticketMedio = totalClientes > 0 ? faturamentoTotal / totalClientes : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCliente) {
      // Editar cliente
      setClientes(prev => prev.map(cliente => 
        cliente.id === editingCliente.id 
          ? { ...cliente, ...formData }
          : cliente
      ));
      toast({
        title: "Cliente atualizado",
        description: "Os dados do cliente foram atualizados com sucesso.",
      });
    } else {
      // Novo cliente
      const novoCliente: Cliente = {
        ...formData,
        id: `C${String(clientes.length + 1).padStart(3, '0')}`,
        dataCadastro: new Date().toLocaleDateString('pt-BR'),
        ultimaCompra: "-",
        totalCompras: 0,
        status: "Ativo"
      };
      setClientes(prev => [...prev, novoCliente]);
      toast({
        title: "Cliente cadastrado",
        description: "Novo cliente foi cadastrado com sucesso.",
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
      observacoes: ""
    });
    setEditingCliente(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      cpf: cliente.cpf,
      endereco: cliente.endereco,
      cidade: cliente.cidade,
      estado: cliente.estado,
      cep: cliente.cep,
      observacoes: cliente.observacoes || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setClientes(prev => prev.filter(cliente => cliente.id !== id));
    toast({
      title: "Cliente removido",
      description: "Cliente foi removido do sistema.",
      variant: "destructive"
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestão de Clientes</h1>
            <p className="text-muted-foreground">Gerencie sua base de clientes</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => setEditingCliente(null)}>
                <UserPlus className="w-4 h-4" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCliente ? "Editar Cliente" : "Novo Cliente"}
                </DialogTitle>
                <DialogDescription>
                  {editingCliente ? "Atualize as informações do cliente" : "Cadastre um novo cliente no sistema"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={formData.estado}
                      onChange={(e) => setFormData({...formData, estado: e.target.value})}
                      placeholder="SP"
                      maxLength={2}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => setFormData({...formData, cep: e.target.value})}
                      placeholder="00000-000"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                    rows={3}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingCliente ? "Atualizar" : "Cadastrar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total de Clientes"
            value={totalClientes.toString()}
            icon={Users}
            description="Clientes cadastrados"
          />
          <MetricCard
            title="Clientes Ativos"
            value={clientesAtivos.toString()}
            icon={Users}
            description="Com compras recentes"
          />
          <MetricCard
            title="Faturamento Total"
            value={`R$ ${faturamentoTotal.toFixed(2)}`}
            icon={Users}
            description="Soma de todas as compras"
          />
          <MetricCard
            title="Ticket Médio"
            value={`R$ ${ticketMedio.toFixed(2)}`}
            icon={Users}
            description="Valor médio por cliente"
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
                    placeholder="Buscar por nome, email ou CPF..."
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
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="inativo">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Clientes */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>
              Gerencie todos os clientes cadastrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Total Compras</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{cliente.nome}</div>
                          <div className="text-sm text-muted-foreground">
                            Cadastro: {cliente.dataCadastro}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            {cliente.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3" />
                            {cliente.telefone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{cliente.cpf}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3" />
                          {cliente.cidade}, {cliente.estado}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        R$ {cliente.totalCompras.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={cliente.status === "Ativo" ? "default" : "secondary"}>
                          {cliente.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingCliente(cliente)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(cliente)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(cliente.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredClientes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum cliente encontrado com os filtros aplicados.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Visualização */}
        <Dialog open={!!viewingCliente} onOpenChange={() => setViewingCliente(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Cliente</DialogTitle>
            </DialogHeader>
            {viewingCliente && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Nome Completo</Label>
                    <p>{viewingCliente.nome}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">CPF</Label>
                    <p>{viewingCliente.cpf}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">E-mail</Label>
                    <p>{viewingCliente.email}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Telefone</Label>
                    <p>{viewingCliente.telefone}</p>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold">Endereço Completo</Label>
                  <p>{viewingCliente.endereco}, {viewingCliente.cidade} - {viewingCliente.estado}, {viewingCliente.cep}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="font-semibold">Data de Cadastro</Label>
                    <p>{viewingCliente.dataCadastro}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Última Compra</Label>
                    <p>{viewingCliente.ultimaCompra}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Total em Compras</Label>
                    <p>R$ {viewingCliente.totalCompras.toFixed(2)}</p>
                  </div>
                </div>
                {viewingCliente.observacoes && (
                  <div>
                    <Label className="font-semibold">Observações</Label>
                    <p>{viewingCliente.observacoes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
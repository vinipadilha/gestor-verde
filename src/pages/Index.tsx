import { Layout } from "@/components/layout/Layout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { LowStockAlert } from "@/components/dashboard/LowStockAlert";
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  Users,
  AlertTriangle
} from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu mercado - monitoramento em tempo real
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Receita Total"
            value="R$ 12.350,80"
            description="Últimos 30 dias"
            icon={DollarSign}
            trend={{ value: "12.5%", isPositive: true }}
            variant="success"
          />
          <MetricCard
            title="Produtos Cadastrados"
            value="324"
            description="Itens no sistema"
            icon={Package}
            trend={{ value: "8", isPositive: true }}
            variant="info"
          />
          <MetricCard
            title="Vendas Hoje"
            value="48"
            description="Transações realizadas"
            icon={ShoppingCart}
            trend={{ value: "23.1%", isPositive: true }}
            variant="success"
          />
          <MetricCard
            title="Estoque Baixo"
            value="4"
            description="Produtos para repor"
            icon={AlertTriangle}
            variant="warning"
          />
        </div>

        {/* Second Row Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Clientes Ativos"
            value="156"
            description="Últimos 30 dias"
            icon={Users}
            trend={{ value: "5.2%", isPositive: true }}
          />
          <MetricCard
            title="Crescimento Mensal"
            value="18.2%"
            description="Comparado ao mês anterior"
            icon={TrendingUp}
            trend={{ value: "2.3%", isPositive: true }}
            variant="success"
          />
          <MetricCard
            title="Ticket Médio"
            value="R$ 45,60"
            description="Valor médio por venda"
            icon={DollarSign}
            trend={{ value: "1.8%", isPositive: false }}
          />
        </div>

        {/* Data Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentSales />
          <LowStockAlert />
        </div>
      </div>
    </Layout>
  );
};

export default Index;

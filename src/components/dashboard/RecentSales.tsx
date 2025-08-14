import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recentSales = [
  {
    id: "1",
    customer: "João Silva",
    product: "Arroz Integral 5kg",
    amount: "R$ 25,90",
    status: "completed",
    time: "há 2 min"
  },
  {
    id: "2", 
    customer: "Maria Santos",
    product: "Feijão Preto 1kg",
    amount: "R$ 8,50",
    status: "completed",
    time: "há 5 min"
  },
  {
    id: "3",
    customer: "Pedro Costa",
    product: "Óleo de Soja 900ml",
    amount: "R$ 6,90",
    status: "pending",
    time: "há 8 min"
  },
  {
    id: "4",
    customer: "Ana Oliveira",
    product: "Açúcar Cristal 1kg",
    amount: "R$ 4,20",
    status: "completed",
    time: "há 12 min"
  },
  {
    id: "5",
    customer: "Carlos Lima",
    product: "Farinha de Trigo 1kg",
    amount: "R$ 3,80",
    status: "completed",
    time: "há 15 min"
  }
];

export function RecentSales() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas Recentes</CardTitle>
        <CardDescription>
          Últimas transações realizadas no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentSales.map((sale) => (
            <div key={sale.id} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{sale.customer}</p>
                  <Badge 
                    variant={sale.status === "completed" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {sale.status === "completed" ? "Concluído" : "Pendente"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{sale.product}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-semibold text-primary">{sale.amount}</span>
                  <span className="text-xs text-muted-foreground">{sale.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const lowStockItems = [
  {
    id: "1",
    name: "Leite Integral 1L",
    current: 5,
    minimum: 10,
    category: "Laticínios"
  },
  {
    id: "2",
    name: "Pão de Forma Integral",
    current: 3,
    minimum: 15,
    category: "Padaria"
  },
  {
    id: "3",
    name: "Sabonete Neutro",
    current: 2,
    minimum: 8,
    category: "Higiene"
  },
  {
    id: "4",
    name: "Detergente Neutro",
    current: 1,
    minimum: 6,
    category: "Limpeza"
  }
];

export function LowStockAlert() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          Estoque Baixo
        </CardTitle>
        <CardDescription>
          Produtos que necessitam reposição urgente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lowStockItems.map((item) => (
            <Alert key={item.id} className="border-warning/20 bg-warning/5">
              <Package className="w-4 h-4 text-warning" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Atual: {item.current} | Mínimo: {item.minimum}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-warning">
                      {item.current} unidades
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Repor {item.minimum - item.current}
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "info";
}

export function MetricCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  variant = "default" 
}: MetricCardProps) {
  const getIconBgColor = () => {
    switch (variant) {
      case "success":
        return "bg-success text-success-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      case "info":
        return "bg-info text-info-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card to-accent/20 border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", getIconBgColor())}>
          <Icon className="w-5 h-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <div className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend.isPositive
                ? "text-success bg-success/10"
                : "text-destructive bg-destructive/10"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
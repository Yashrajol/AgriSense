import { memo } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Advisory } from "@/types";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface AdvisoryPanelProps {
  advisories: Advisory[];
}

const AdvisoryPanel = memo(({ advisories }: AdvisoryPanelProps) => {
  const getStatusColor = (status: Advisory['status']) => {
    switch (status) {
      case 'good':
        return 'border-success bg-success/10';
      case 'caution':
        return 'border-warning bg-warning/10';
      case 'alert':
        return 'border-destructive bg-destructive/10';
    }
  };

  const getStatusIcon = (status: Advisory['status']) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'caution':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Today's Advisory</h2>
        <Button variant="outline" size="sm">
          View History
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {advisories.map((advisory) => (
          <Card
            key={advisory.id}
            className={`p-4 border-2 transition-all hover:shadow-md ${getStatusColor(advisory.status)}`}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{advisory.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(advisory.status)}
                  <h3 className="font-semibold">{advisory.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{advisory.message}</p>
                {advisory.action && (
                  <Button size="sm" variant="outline" className="w-full">
                    {advisory.action}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
});

AdvisoryPanel.displayName = 'AdvisoryPanel';

export default AdvisoryPanel;

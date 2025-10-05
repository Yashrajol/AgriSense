import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { CropSuggestion } from "@/types";
import { Sprout } from "lucide-react";

interface CropPredictorProps {
  suggestions: CropSuggestion[];
}

const CropPredictor = ({ suggestions }: CropPredictorProps) => {
  const getSuitabilityColor = (suitability: number) => {
    if (suitability >= 80) return 'bg-success';
    if (suitability >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Sprout className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Crop Succession Predictor</h2>
      </div>

      <p className="text-muted-foreground mb-6">
        Based on current soil conditions and NASA data analysis
      </p>

      <div className="space-y-4">
        {suggestions.map((crop, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-border hover:border-primary transition-all"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{crop.name}</h3>
                <Badge variant="secondary" className="mt-1">
                  {crop.season}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {crop.suitability}%
                </div>
                <p className="text-xs text-muted-foreground">Suitability</p>
              </div>
            </div>

            <div className="w-full bg-muted rounded-full h-2 mb-3">
              <div
                className={`${getSuitabilityColor(crop.suitability)} rounded-full h-2 transition-all`}
                style={{ width: `${crop.suitability}%` }}
              />
            </div>

            <p className="text-sm text-muted-foreground">{crop.reason}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CropPredictor;

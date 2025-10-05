import { memo } from "react";
import { Card } from "./ui/card";
import { NASAData } from "@/types";
import { Droplets, Thermometer, CloudRain } from "lucide-react";
import { useTranslation } from "react-i18next";

interface WeatherCardProps {
  data: NASAData;
}

const WeatherCard = memo(({ data }: WeatherCardProps) => {
  const { t } = useTranslation();
  
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">{t('weather.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-secondary/20">
            <Droplets className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('weather.soilMoisture')}</p>
            <p className="text-3xl font-bold number-display no-select">{data.soilMoisture}%</p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="bg-secondary rounded-full h-2 stable-layout"
                style={{ width: `${data.soilMoisture}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-accent/20">
            <Thermometer className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('weather.temperature')}</p>
            <p className="text-3xl font-bold number-display no-select">{data.temperature}°C</p>
            <p className="text-sm text-muted-foreground mt-2">
              {data.temperature > 30 ? t('weather.hot') : data.temperature > 20 ? t('weather.warm') : t('weather.cool')}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/20">
            <CloudRain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('weather.precipitation')}</p>
            <p className="text-3xl font-bold number-display no-select">{data.precipitation}mm</p>
            <p className="text-sm text-muted-foreground mt-2">{t('weather.last7Days')}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground">
          {t('weather.lastUpdated')}: {data.lastUpdated.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {t('weather.dataSource')}
        </p>
      </div>
    </Card>
  );
});

WeatherCard.displayName = 'WeatherCard';

export default WeatherCard;

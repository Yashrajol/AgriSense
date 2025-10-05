import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Trophy, Star, Target, Users, BarChart3, Award } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface UserStats {
  level: number;
  points: number;
  nextLevelPoints: number;
  achievements: Achievement[];
}

const GamificationPanel = () => {
  const { t } = useTranslation();
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    points: 150,
    nextLevelPoints: 200,
    achievements: [
      {
        id: 'firstLogin',
        name: t('achievements.firstLogin'),
        description: 'Complete your first login',
        icon: Star,
        points: 10,
        unlocked: true,
        progress: 1,
        maxProgress: 1
      },
      {
        id: 'weatherExpert',
        name: t('achievements.weatherExpert'),
        description: 'Check weather data 10 times',
        icon: Target,
        points: 50,
        unlocked: false,
        progress: 7,
        maxProgress: 10
      },
      {
        id: 'cropMaster',
        name: t('achievements.cropMaster'),
        description: 'Use crop predictor 5 times',
        icon: Trophy,
        points: 100,
        unlocked: false,
        progress: 3,
        maxProgress: 5
      },
      {
        id: 'communityHelper',
        name: t('achievements.communityHelper'),
        description: 'Share 3 posts in community',
        icon: Users,
        points: 75,
        unlocked: false,
        progress: 1,
        maxProgress: 3
      },
      {
        id: 'dataAnalyst',
        name: t('achievements.dataAnalyst'),
        description: 'View analytics 5 times',
        icon: BarChart3,
        points: 80,
        unlocked: false,
        progress: 2,
        maxProgress: 5
      }
    ]
  });

  const levelProgress = (userStats.points / userStats.nextLevelPoints) * 100;

  return (
    <div className="space-y-6">
      {/* User Level & Points */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-primary">
              {t('common.level')} {userStats.level}
            </h3>
            <p className="text-muted-foreground">
              {userStats.points} {t('common.points')}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl">🌱</div>
            <p className="text-sm text-muted-foreground">
              {t('common.nextLevel')}: {userStats.nextLevelPoints}
            </p>
          </div>
        </div>
        <Progress value={levelProgress} className="h-3" />
        <p className="text-sm text-muted-foreground mt-2">
          {userStats.nextLevelPoints - userStats.points} {t('common.points')} to next level
        </p>
      </Card>

      {/* Achievements */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold">{t('achievements.title')}</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          {t('achievements.description')}
        </p>
        
        <div className="space-y-3">
          {userStats.achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  achievement.unlocked 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-muted/50 border-border'
                }`}
              >
                <div className={`p-3 rounded-full ${
                  achievement.unlocked 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{achievement.name}</h4>
                    {achievement.unlocked && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        ✓ Unlocked
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {achievement.description}
                  </p>
                  {!achievement.unlocked && (
                    <div className="space-y-1">
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-2" 
                      />
                      <p className="text-xs text-muted-foreground">
                        {achievement.progress}/{achievement.maxProgress} completed
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-primary">
                    +{achievement.points}
                  </p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default GamificationPanel;

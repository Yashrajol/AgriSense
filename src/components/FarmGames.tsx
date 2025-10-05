import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Brain, 
  Cloud, 
  Gamepad2, 
  Leaf, 
  Calculator, 
  Play, 
  Star,
  Trophy,
  Target
} from 'lucide-react';
import CropIdentificationGame from './CropIdentificationGame';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  completed: boolean;
  progress: number;
  maxProgress: number;
}

const FarmGames = () => {
  const { t } = useTranslation();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameProgress, setGameProgress] = useState(0);

  // If a specific game is selected, render it
  if (selectedGame === 'plantIdentification') {
    return <CropIdentificationGame />;
  }

  const games: Game[] = [
    {
      id: 'cropQuiz',
      title: t('games.cropQuiz'),
      description: 'Test your knowledge about different crops and farming techniques',
      icon: Brain,
      difficulty: 'Easy',
      points: 50,
      completed: false,
      progress: 0,
      maxProgress: 10
    },
    {
      id: 'weatherChallenge',
      title: t('games.weatherChallenge'),
      description: 'Predict weather patterns and learn about climate impact on farming',
      icon: Cloud,
      difficulty: 'Medium',
      points: 75,
      completed: false,
      progress: 3,
      maxProgress: 8
    },
    {
      id: 'farmingSimulator',
      title: t('games.farmingSimulator'),
      description: 'Manage your virtual farm and make strategic decisions',
      icon: Gamepad2,
      difficulty: 'Hard',
      points: 100,
      completed: false,
      progress: 0,
      maxProgress: 15
    },
    {
      id: 'plantIdentification',
      title: t('games.plantIdentification'),
      description: 'Learn to identify different plants, weeds, and crops',
      icon: Leaf,
      difficulty: 'Easy',
      points: 40,
      completed: true,
      progress: 10,
      maxProgress: 10
    },
    {
      id: 'harvestCalculator',
      title: t('games.harvestCalculator'),
      description: 'Calculate optimal harvest times and yields',
      icon: Calculator,
      difficulty: 'Medium',
      points: 60,
      completed: false,
      progress: 2,
      maxProgress: 6
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const startGame = (gameId: string) => {
    setSelectedGame(gameId);
    setGameScore(0);
    setGameProgress(0);
  };

  const backToGames = () => {
    setSelectedGame(null);
  };

  const renderGameContent = () => {
    if (!selectedGame) return null;

    const game = games.find(g => g.id === selectedGame);
    if (!game) return null;

    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{game.title}</h3>
          <Button 
            variant="outline" 
            onClick={backToGames}
          >
            {t('common.close')}
          </Button>
        </div>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">{game.description}</p>
          
          <div className="flex items-center gap-4">
            <Badge className={getDifficultyColor(game.difficulty)}>
              {game.difficulty}
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{game.points} points</span>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Game Instructions:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Answer questions correctly to earn points</li>
              <li>• Complete all levels to unlock the achievement</li>
              <li>• Your progress is saved automatically</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => startGame(game.id)} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              {game.completed ? t('common.play') : t('common.continue')}
            </Button>
            <Button variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Practice
            </Button>
          </div>

          {game.progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{game.progress}/{game.maxProgress}</span>
              </div>
              <Progress value={(game.progress / game.maxProgress) * 100} />
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">{t('games.title')}</h2>
        <p className="text-muted-foreground">
          Learn farming through fun and interactive games
        </p>
      </div>

      {selectedGame ? (
        renderGameContent()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Card 
                key={game.id} 
                className="p-6 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => startGame(game.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{game.title}</h3>
                      {game.completed && (
                        <Trophy className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {game.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={getDifficultyColor(game.difficulty)}>
                        {game.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{game.points}</span>
                      </div>
                    </div>
                    
                    {game.progress > 0 && (
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{game.progress}/{game.maxProgress}</span>
                        </div>
                        <Progress value={(game.progress / game.maxProgress) * 100} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FarmGames;

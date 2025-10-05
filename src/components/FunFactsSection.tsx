import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Lightbulb, 
  RefreshCw, 
  Share2, 
  Heart,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface FunFact {
  id: string;
  fact: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
}

const FunFactsSection = () => {
  const { t } = useTranslation();
  const [currentFact, setCurrentFact] = useState<FunFact | null>(null);
  const [factIndex, setFactIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [points, setPoints] = useState(0);

  const funFacts: FunFact[] = [
    {
      id: '1',
      fact: t('funFacts.fact1'),
      category: 'Crops',
      difficulty: 'Easy',
      points: 10
    },
    {
      id: '2',
      fact: t('funFacts.fact2'),
      category: 'Botany',
      difficulty: 'Easy',
      points: 10
    },
    {
      id: '3',
      fact: t('funFacts.fact3'),
      category: 'Records',
      difficulty: 'Medium',
      points: 15
    },
    {
      id: '4',
      fact: t('funFacts.fact4'),
      category: 'Ecology',
      difficulty: 'Medium',
      points: 15
    },
    {
      id: '5',
      fact: t('funFacts.fact5'),
      category: 'Farming',
      difficulty: 'Hard',
      points: 20
    }
  ];

  useEffect(() => {
    setCurrentFact(funFacts[factIndex]);
  }, [factIndex]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const nextFact = () => {
    setFactIndex((prev) => (prev + 1) % funFacts.length);
    setLiked(false);
  };

  const likeFact = () => {
    if (!liked) {
      setLiked(true);
      setPoints(prev => prev + (currentFact?.points || 0));
    }
  };

  const shareFact = () => {
    if (navigator.share && currentFact) {
      navigator.share({
        title: 'Amazing Farming Fact!',
        text: currentFact.fact,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(currentFact?.fact || '');
    }
  };

  if (!currentFact) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Lightbulb className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">{t('funFacts.title')}</h2>
        </div>
        <p className="text-muted-foreground">
          Discover amazing facts about farming and agriculture
        </p>
      </div>

      <Card className="p-8 text-center bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <div className="space-y-6">
          {/* Fact Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <Badge className={getDifficultyColor(currentFact.difficulty)}>
                {currentFact.difficulty}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {currentFact.category}
              </Badge>
            </div>
            
            <blockquote className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed">
              "{currentFact.fact}"
            </blockquote>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={liked ? "default" : "outline"}
              onClick={likeFact}
              className="gap-2"
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
              {liked ? 'Liked!' : 'Like'}
            </Button>
            
            <Button variant="outline" onClick={shareFact} className="gap-2">
              <Share2 className="h-4 w-4" />
              {t('common.share')}
            </Button>
            
            <Button variant="outline" onClick={nextFact} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Next Fact
            </Button>
          </div>

          {/* Points Display */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>Earn {currentFact.points} points for learning this fact!</span>
          </div>
        </div>
      </Card>

      {/* Progress Indicator */}
      <div className="flex justify-center space-x-2">
        {funFacts.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === factIndex ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Points Summary */}
      {points > 0 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-800">
              You've earned {points} points from learning fun facts!
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FunFactsSection;

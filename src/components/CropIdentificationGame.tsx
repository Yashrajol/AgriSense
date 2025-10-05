import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Leaf, 
  CheckCircle, 
  XCircle, 
  Star, 
  Trophy,
  RotateCcw,
  Play,
  Target,
  Award
} from 'lucide-react';

interface Crop {
  id: string;
  name: string;
  description: string;
  image: string;
  characteristics: string[];
  growingSeason: string;
  waterNeeds: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface GameState {
  currentCrop: Crop | null;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  currentQuestion: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  selectedAnswer: string | null;
  showResult: boolean;
}

const CropIdentificationGame = () => {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<GameState>({
    currentCrop: null,
    score: 0,
    totalQuestions: 5,
    correctAnswers: 0,
    currentQuestion: 1,
    gameStarted: false,
    gameCompleted: false,
    selectedAnswer: null,
    showResult: false
  });

  const crops: Crop[] = [
    {
      id: '1',
      name: 'Tomato',
      description: 'A red, juicy fruit commonly used in cooking',
      image: '🍅',
      characteristics: ['Red color', 'Round shape', 'Juicy texture', 'Sweet taste'],
      growingSeason: 'Summer',
      waterNeeds: 'Moderate',
      difficulty: 'Easy'
    },
    {
      id: '2',
      name: 'Corn',
      description: 'A tall cereal plant with yellow kernels',
      image: '🌽',
      characteristics: ['Yellow kernels', 'Tall stalks', 'Green leaves', 'Sweet taste'],
      growingSeason: 'Summer',
      waterNeeds: 'High',
      difficulty: 'Easy'
    },
    {
      id: '3',
      name: 'Wheat',
      description: 'A cereal grain used for making bread and flour',
      image: '🌾',
      characteristics: ['Golden color', 'Small grains', 'Tall stalks', 'Grass-like'],
      growingSeason: 'Winter',
      waterNeeds: 'Low',
      difficulty: 'Medium'
    },
    {
      id: '4',
      name: 'Rice',
      description: 'A staple grain grown in water-logged fields',
      image: '🌾',
      characteristics: ['White grains', 'Grown in water', 'Short stalks', 'Staple food'],
      growingSeason: 'Monsoon',
      waterNeeds: 'Very High',
      difficulty: 'Hard'
    },
    {
      id: '5',
      name: 'Potato',
      description: 'An underground tuber rich in carbohydrates',
      image: '🥔',
      characteristics: ['Brown skin', 'Underground growth', 'Round shape', 'Starchy'],
      growingSeason: 'Cool season',
      waterNeeds: 'Moderate',
      difficulty: 'Easy'
    }
  ];

  const questions = [
    {
      id: '1',
      question: 'Which crop is known for growing in water-logged fields?',
      options: ['Tomato', 'Rice', 'Wheat', 'Corn'],
      correct: 'Rice',
      crop: crops.find(c => c.name === 'Rice')
    },
    {
      id: '2',
      question: 'Which crop has yellow kernels and grows on tall stalks?',
      options: ['Wheat', 'Corn', 'Rice', 'Potato'],
      correct: 'Corn',
      crop: crops.find(c => c.name === 'Corn')
    },
    {
      id: '3',
      question: 'Which crop is commonly red and used in salads?',
      options: ['Potato', 'Tomato', 'Wheat', 'Rice'],
      correct: 'Tomato',
      crop: crops.find(c => c.name === 'Tomato')
    },
    {
      id: '4',
      question: 'Which crop is grown underground and is rich in starch?',
      options: ['Corn', 'Wheat', 'Potato', 'Rice'],
      correct: 'Potato',
      crop: crops.find(c => c.name === 'Potato')
    },
    {
      id: '5',
      question: 'Which crop is golden in color and used for making bread?',
      options: ['Rice', 'Tomato', 'Wheat', 'Corn'],
      correct: 'Wheat',
      crop: crops.find(c => c.name === 'Wheat')
    }
  ];

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      currentQuestion: 1,
      score: 0,
      correctAnswers: 0,
      gameCompleted: false
    }));
  };

  const selectAnswer = (answer: string) => {
    if (gameState.showResult) return;
    
    setGameState(prev => ({
      ...prev,
      selectedAnswer: answer,
      showResult: true
    }));

    const currentQ = questions[gameState.currentQuestion - 1];
    const isCorrect = answer === currentQ.correct;
    
    if (isCorrect) {
      setGameState(prev => ({
        ...prev,
        score: prev.score + 100,
        correctAnswers: prev.correctAnswers + 1
      }));
    }
  };

  const nextQuestion = () => {
    if (gameState.currentQuestion < gameState.totalQuestions) {
      setGameState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        selectedAnswer: null,
        showResult: false
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        gameCompleted: true
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      currentCrop: null,
      score: 0,
      totalQuestions: 5,
      correctAnswers: 0,
      currentQuestion: 1,
      gameStarted: false,
      gameCompleted: false,
      selectedAnswer: null,
      showResult: false
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getScoreMessage = () => {
    const percentage = (gameState.correctAnswers / gameState.totalQuestions) * 100;
    if (percentage >= 80) return "Excellent! You're a crop expert! 🌟";
    if (percentage >= 60) return "Good job! Keep learning! 👍";
    if (percentage >= 40) return "Not bad! Practice makes perfect! 💪";
    return "Keep studying! You'll get better! 📚";
  };

  if (!gameState.gameStarted) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-green-500" />
            <h2 className="text-3xl font-bold">Crop Identification Game</h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Test your knowledge of different crops and farming!
          </p>
        </div>

        <Card className="p-8 text-center">
          <div className="space-y-6">
            <div className="text-6xl">🌱</div>
            <h3 className="text-2xl font-bold">Ready to Play?</h3>
            <p className="text-muted-foreground">
              Answer 5 questions about different crops and earn points for correct answers!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <h4 className="font-semibold">5 Questions</h4>
                <p className="text-sm text-muted-foreground">Test your crop knowledge</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Star className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <h4 className="font-semibold">100 Points Each</h4>
                <p className="text-sm text-muted-foreground">Earn points for correct answers</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Trophy className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <h4 className="font-semibold">Achievement</h4>
                <p className="text-sm text-muted-foreground">Unlock the Crop Expert badge</p>
              </div>
            </div>

            <Button onClick={startGame} size="lg" className="gap-2">
              <Play className="h-5 w-5" />
              Start Game
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (gameState.gameCompleted) {
    const percentage = (gameState.correctAnswers / gameState.totalQuestions) * 100;
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <div className="space-y-6">
            <div className="text-6xl">
              {percentage >= 80 ? '🏆' : percentage >= 60 ? '🎉' : '📚'}
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-2">Game Complete!</h2>
              <p className="text-lg text-muted-foreground">{getScoreMessage()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{gameState.score}</div>
                <div className="text-sm text-muted-foreground">Total Score</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{gameState.correctAnswers}/{gameState.totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{Math.round(percentage)}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={resetGame} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Play Again
              </Button>
              <Button onClick={resetGame} className="gap-2">
                <Award className="h-4 w-4" />
                Back to Games
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const currentQ = questions[gameState.currentQuestion - 1];
  const isCorrect = gameState.selectedAnswer === currentQ.correct;

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Crop Identification Game</h2>
          <p className="text-muted-foreground">Question {gameState.currentQuestion} of {gameState.totalQuestions}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{gameState.score}</div>
          <div className="text-sm text-muted-foreground">Points</div>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={(gameState.currentQuestion / gameState.totalQuestions) * 100} className="h-3" />

      {/* Question Card */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">{currentQ.question}</h3>
            {currentQ.crop && (
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-6xl">{currentQ.crop.image}</div>
                <div className="text-left">
                  <h4 className="font-semibold">{currentQ.crop.name}</h4>
                  <p className="text-sm text-muted-foreground">{currentQ.crop.description}</p>
                  <Badge className={getDifficultyColor(currentQ.crop.difficulty)}>
                    {currentQ.crop.difficulty}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQ.options.map((option, index) => {
              const isSelected = gameState.selectedAnswer === option;
              const isCorrectOption = option === currentQ.correct;
              let buttonClass = "w-full p-4 text-left border rounded-lg transition-all hover:bg-muted/50";
              
              if (gameState.showResult) {
                if (isCorrectOption) {
                  buttonClass += " bg-green-100 border-green-300 text-green-700";
                } else if (isSelected && !isCorrectOption) {
                  buttonClass += " bg-red-100 border-red-300 text-red-700";
                } else {
                  buttonClass += " bg-muted/30 border-muted";
                }
              } else if (isSelected) {
                buttonClass += " bg-primary/10 border-primary text-primary";
              } else {
                buttonClass += " border-border";
              }

              return (
                <button
                  key={index}
                  className={buttonClass}
                  onClick={() => selectAnswer(option)}
                  disabled={gameState.showResult}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                      {gameState.showResult && isCorrectOption && (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      {gameState.showResult && isSelected && !isCorrectOption && (
                        <XCircle className="h-4 w-4" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result Message */}
          {gameState.showResult && (
            <div className={`p-4 rounded-lg text-center ${
              isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span className="font-semibold">
                  {isCorrect ? 'Correct!' : 'Incorrect!'}
                </span>
              </div>
              <p className="text-sm">
                {isCorrect 
                  ? `Great job! You earned 100 points.`
                  : `The correct answer is ${currentQ.correct}.`
                }
              </p>
            </div>
          )}

          {/* Next Button */}
          {gameState.showResult && (
            <div className="flex justify-center">
              <Button onClick={nextQuestion} className="gap-2">
                {gameState.currentQuestion < gameState.totalQuestions ? 'Next Question' : 'Finish Game'}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CropIdentificationGame;

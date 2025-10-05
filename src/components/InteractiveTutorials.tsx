import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Target,
  Clock,
  Star,
  Award,
  Lightbulb
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  content: string;
  image?: string;
  tips: string[];
  completed: boolean;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  steps: TutorialStep[];
  points: number;
  completed: boolean;
}

const InteractiveTutorials = () => {
  const { t } = useTranslation();
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const tutorials: Tutorial[] = [
    {
      id: 'soilTesting',
      title: t('tutorials.soilTesting'),
      description: 'Learn how to test and analyze your soil quality for better crop yields',
      icon: Target,
      difficulty: 'Beginner',
      duration: '15 min',
      points: 50,
      completed: false,
      steps: [
        {
          id: 'step1',
          title: 'Understanding Soil Types',
          description: 'Learn about different soil types and their characteristics',
          content: 'Soil is the foundation of agriculture. There are three main soil types: sandy, clay, and loamy. Each has different properties that affect plant growth.',
          tips: [
            'Sandy soil drains quickly but doesn\'t hold nutrients well',
            'Clay soil holds water and nutrients but drains slowly',
            'Loamy soil is the ideal balance of sand, silt, and clay'
          ],
          completed: false
        },
        {
          id: 'step2',
          title: 'Testing Soil pH',
          description: 'Learn how to test and adjust soil pH levels',
          content: 'Soil pH affects nutrient availability. Most crops prefer a pH between 6.0 and 7.0. You can test pH using a simple test kit.',
          tips: [
            'Use a pH test kit from your local garden center',
            'Test multiple areas of your field',
            'Add lime to raise pH or sulfur to lower it'
          ],
          completed: false
        },
        {
          id: 'step3',
          title: 'Nutrient Analysis',
          description: 'Understand essential nutrients and how to test for them',
          content: 'Plants need 16 essential nutrients. The three most important are nitrogen (N), phosphorus (P), and potassium (K).',
          tips: [
            'Nitrogen promotes leaf growth',
            'Phosphorus helps root development',
            'Potassium improves disease resistance'
          ],
          completed: false
        }
      ]
    },
    {
      id: 'plantingGuide',
      title: t('tutorials.plantingGuide'),
      description: 'Master the art of planting for optimal crop growth',
      icon: BookOpen,
      difficulty: 'Intermediate',
      duration: '20 min',
      points: 75,
      completed: false,
      steps: [
        {
          id: 'step1',
          title: 'Seed Selection',
          description: 'Choose the right seeds for your climate and soil',
          content: 'Select seeds that are adapted to your local climate and soil conditions. Consider factors like disease resistance and yield potential.',
          tips: [
            'Check seed packets for climate zone information',
            'Look for disease-resistant varieties',
            'Consider your local growing season length'
          ],
          completed: false
        },
        {
          id: 'step2',
          title: 'Planting Depth and Spacing',
          description: 'Learn proper planting techniques',
          content: 'Planting depth and spacing are crucial for healthy plant development. Follow the guidelines on seed packets for best results.',
          tips: [
            'Plant seeds at the recommended depth',
            'Space plants according to their mature size',
            'Consider companion planting for better yields'
          ],
          completed: false
        }
      ]
    },
    {
      id: 'irrigationTips',
      title: t('tutorials.irrigationTips'),
      description: 'Learn efficient irrigation methods to save water and improve yields',
      icon: Lightbulb,
      difficulty: 'Advanced',
      duration: '25 min',
      points: 100,
      completed: false,
      steps: [
        {
          id: 'step1',
          title: 'Water Requirements',
          description: 'Understand how much water your crops need',
          content: 'Different crops have different water needs. Factors like temperature, humidity, and soil type affect water requirements.',
          tips: [
            'Monitor soil moisture regularly',
            'Water deeply but less frequently',
            'Consider drip irrigation for efficiency'
          ],
          completed: false
        }
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const startTutorial = (tutorialId: string) => {
    setSelectedTutorial(tutorialId);
    setCurrentStep(0);
    setCompletedSteps(new Set());
  };

  const completeStep = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const renderTutorialContent = () => {
    if (!selectedTutorial) return null;

    const tutorial = tutorials.find(t => t.id === selectedTutorial);
    if (!tutorial) return null;

    const currentStepData = tutorial.steps[currentStep];
    const isLastStep = currentStep === tutorial.steps.length - 1;
    const isFirstStep = currentStep === 0;

    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <tutorial.icon className="h-6 w-6 text-primary" />
            <div>
              <h3 className="text-xl font-bold">{tutorial.title}</h3>
              <p className="text-sm text-muted-foreground">{tutorial.description}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setSelectedTutorial(null)}>
            {t('common.close')}
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Step {currentStep + 1} of {tutorial.steps.length}</span>
            <span>{Math.round(((currentStep + 1) / tutorial.steps.length) * 100)}% Complete</span>
          </div>
          <Progress value={((currentStep + 1) / tutorial.steps.length) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">{currentStepData.title}</h4>
            <p className="text-muted-foreground mb-4">{currentStepData.description}</p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm">{currentStepData.content}</p>
            </div>
          </div>

          {/* Tips */}
          <div>
            <h5 className="font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              Pro Tips
            </h5>
            <ul className="space-y-2">
              {currentStepData.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <div className="flex gap-2">
              {!isFirstStep && (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => completeStep(currentStepData.id)}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Mark Complete
              </Button>
              
              {!isLastStep ? (
                <Button onClick={nextStep} className="gap-2">
                  Next Step
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button className="gap-2 bg-green-600 hover:bg-green-700">
                  <Award className="h-4 w-4" />
                  Complete Tutorial
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">{t('tutorials.title')}</h2>
        </div>
        <p className="text-muted-foreground">
          {t('tutorials.subtitle')}
        </p>
      </div>

      {selectedTutorial ? (
        renderTutorialContent()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => {
            const Icon = tutorial.icon;
            return (
              <Card 
                key={tutorial.id} 
                className="p-6 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => startTutorial(tutorial.id)}
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{tutorial.title}</h3>
                        {tutorial.completed && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {tutorial.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getDifficultyColor(tutorial.difficulty)}>
                            {tutorial.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {tutorial.duration}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{tutorial.points}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full gap-2">
                    <Play className="h-4 w-4" />
                    {tutorial.completed ? 'Review Tutorial' : 'Start Tutorial'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InteractiveTutorials;

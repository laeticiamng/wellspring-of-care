import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Progress } from './ui/progress';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuestionnaireQuestion {
  id: string;
  question: string;
  options: {
    value: number;
    label: string;
    description?: string;
  }[];
  required?: boolean;
  category?: string;
}

export interface QuestionnaireConfig {
  title: string;
  description: string;
  instrument: string; // 'STAI-6', 'SAM', 'POMS-SF', etc.
  questions: QuestionnaireQuestion[];
  scoringInfo?: {
    min: number;
    max: number;
    interpretation?: Record<string, string>;
  };
}

interface QuestionnaireFormProps {
  config: QuestionnaireConfig;
  onSubmit: (answers: Record<string, number>, score: number) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  showProgress?: boolean;
  allowNavigation?: boolean;
}

export function QuestionnaireForm({
  config,
  onSubmit,
  onCancel,
  isLoading = false,
  showProgress = true,
  allowNavigation = true,
}: QuestionnaireFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = config.questions[currentQuestionIndex];
  const progress = ((Object.keys(answers).length) / config.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === config.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const canSubmit = config.questions.every(q => !q.required || answers[q.id] !== undefined);

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = (): number => {
    return Object.values(answers).reduce((sum, value) => sum + value, 0);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    
    const totalScore = calculateScore();
    setIsSubmitted(true);
    onSubmit(answers, totalScore);
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-primary" />
          </div>
          <CardTitle>Questionnaire terminé</CardTitle>
          <CardDescription>
            Merci d'avoir complété le questionnaire {config.instrument}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            Vos réponses ont été enregistrées avec succès.
          </p>
          {config.scoringInfo && (
            <div className="bg-primary/10 rounded-lg p-4 mb-4">
              <p className="text-sm text-muted-foreground mb-2">Score total:</p>
              <p className="text-3xl font-bold text-primary">
                {calculateScore()} / {config.scoringInfo.max}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle>{config.title}</CardTitle>
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} / {config.questions.length}
          </span>
        </div>
        <CardDescription>{config.description}</CardDescription>
        {showProgress && (
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round(progress)}% complété
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Question */}
        <div className="space-y-4">
          {currentQuestion.category && (
            <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary">
              {currentQuestion.category}
            </div>
          )}
          
          <h3 className="text-lg font-semibold leading-relaxed">
            {currentQuestion.question}
          </h3>

          <RadioGroup
            value={answers[currentQuestion.id]?.toString()}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, parseInt(value))}
            className="space-y-3"
          >
            {currentQuestion.options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-accent",
                  answers[currentQuestion.id] === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border"
                )}
              >
                <RadioGroupItem value={option.value.toString()} id={`${currentQuestion.id}-${option.value}`} />
                <Label
                  htmlFor={`${currentQuestion.id}-${option.value}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </div>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstQuestion || !allowNavigation}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Précédent
          </Button>

          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Annuler
            </Button>
          )}

          {!isLastQuestion ? (
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id] && currentQuestion.required}
              className="gap-2"
            >
              Suivant
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isLoading}
              className="gap-2"
            >
              {isLoading ? "Envoi..." : "Terminer"}
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Answer summary (optional) */}
        {allowNavigation && (
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">Progression:</p>
            <div className="flex flex-wrap gap-2">
              {config.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={cn(
                    "w-8 h-8 rounded-full text-xs font-medium transition-all",
                    idx === currentQuestionIndex
                      ? "bg-primary text-primary-foreground"
                      : answers[q.id] !== undefined
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

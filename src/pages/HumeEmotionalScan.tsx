import { useState } from 'react';
import { useHumeEmotionalScan } from '@/hooks/useHumeEmotionalScan';
import { EmotionWheel } from '@/components/EmotionWheel';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, FileText, Loader2 } from 'lucide-react';

export default function HumeEmotionalScan() {
  const [textInput, setTextInput] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const { isScanning, scanFromText, scanFromVoice } = useHumeEmotionalScan();

  const handleTextScan = async () => {
    if (!textInput.trim()) return;
    const result = await scanFromText(textInput);
    if (result) {
      setScanResult(result);
    }
  };

  const handleVoiceScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const result = await scanFromVoice(audioBlob);
        if (result) {
          setScanResult(result);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000);
    } catch (error) {
      console.error('Microphone access error:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Scan Émotionnel Hume AI</h1>
        <p className="text-muted-foreground">
          Analysez vos émotions via texte ou voix avec l'IA Hume
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Scan par Texte
            </CardTitle>
            <CardDescription>
              Écrivez quelques phrases sur votre état émotionnel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Comment vous sentez-vous aujourd'hui ?"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <Button
              onClick={handleTextScan}
              disabled={isScanning || !textInput.trim()}
              className="w-full"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                'Analyser le texte'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Scan Vocal
            </CardTitle>
            <CardDescription>
              Enregistrez 5 secondes de votre voix
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground">
                Cliquez pour enregistrer
              </p>
            </div>
            <Button
              onClick={handleVoiceScan}
              disabled={isScanning}
              variant="outline"
              className="w-full"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Enregistrer (5s)
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {scanResult && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats du Scan</CardTitle>
            <CardDescription>
              Émotion dominante: <span className="font-semibold text-foreground">{scanResult.top_emotion}</span> (confiance: {(scanResult.confidence * 100).toFixed(0)}%)
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <EmotionWheel emotions={scanResult.emotions} size={400} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

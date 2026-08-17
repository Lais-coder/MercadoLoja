import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Sparkles, Loader2 } from 'lucide-react';
import type { CategoryType } from '../../types';
import {
  VOICE_DEMO_EXAMPLES,
  createSpeechRecognition,
  isSpeechRecognitionSupported,
  parseProductFromSpeech,
  simulateAiProcessing,
  type ParsedVoiceProduct,
} from '../../lib/voiceProductAgent';

interface Props {
  category?: CategoryType;
  onParsed: (data: ParsedVoiceProduct) => void;
}

type AgentStatus = 'idle' | 'listening' | 'processing';

export default function AudioProductDemo({ category = 'MODA', onParsed }: Props) {
  const [status, setStatus] = useState<AgentStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const [message, setMessage] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  async function processTranscript(text: string) {
    setTranscript(text);
    setStatus('processing');
    setMessage('Agente de IA analisando o áudio...');

    await simulateAiProcessing();

    const parsed = parseProductFromSpeech(text, category);
    onParsed(parsed);
    setStatus('idle');
    setMessage('Campos preenchidos pela IA. Revise e adicione as fotos antes de salvar.');
  }

  function startListening() {
    setMessage('');
    setTranscript('');

    const recognition = createSpeechRecognition(
      (text) => {
        recognitionRef.current = null;
        void processTranscript(text);
      },
      () => {
        recognitionRef.current = null;
        setStatus('idle');
        setMessage('Não foi possível capturar o áudio. Use um exemplo de demonstração abaixo.');
      }
    );

    if (!recognition) {
      setMessage('Seu navegador não suporta reconhecimento de voz. Use os exemplos de demonstração.');
      return;
    }

    recognitionRef.current = recognition;
    setStatus('listening');
    setMessage('Fale agora: nome, tamanhos e preço do produto...');
    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    if (status === 'listening') {
      setStatus('idle');
      setMessage('Gravação interrompida.');
    }
  }

  async function runDemoExample(exampleTranscript: string) {
    await processTranscript(exampleTranscript);
  }

  const examples = VOICE_DEMO_EXAMPLES.filter(
    (e) => e.category === category || category === 'MODA'
  ).slice(0, 3);

  return (
    <section className="p-4 bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-100 rounded-xl space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-text text-sm">Cadastro por áudio</h3>
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Demonstração
            </span>
          </div>
          <p className="text-muted text-xs mt-1 leading-relaxed">
            Agente de IA simulado — entende o áudio e preenche o formulário. Sem API paga; em produção
            usaria Whisper ou similar.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {status === 'listening' ? (
          <button type="button" onClick={stopListening} className="btn-outline text-sm !border-red-200 !text-red-600">
            <MicOff className="w-4 h-4" />
            Parar gravação
          </button>
        ) : (
          <button
            type="button"
            onClick={startListening}
            disabled={status === 'processing'}
            className="btn-navy text-sm disabled:opacity-60"
          >
            {status === 'processing' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
            {status === 'processing' ? 'Processando...' : 'Gravar áudio'}
          </button>
        )}

        {!isSpeechRecognitionSupported() && (
          <span className="text-xs text-muted self-center">Microfone indisponível neste navegador</span>
        )}
      </div>

      {message && (
        <p className={`text-xs ${status === 'processing' ? 'text-violet-700 font-medium' : 'text-muted'}`}>
          {message}
        </p>
      )}

      {transcript && status === 'idle' && (
        <blockquote className="text-xs text-text bg-white/80 border border-violet-100 rounded-lg p-3 italic">
          &ldquo;{transcript}&rdquo;
        </blockquote>
      )}

      <div>
        <p className="text-xs font-semibold text-text mb-2">Exemplos de demonstração:</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example.label}
              type="button"
              disabled={status !== 'idle'}
              onClick={() => runDemoExample(example.transcript)}
              className="text-xs px-3 py-1.5 rounded-full bg-white border border-violet-200 text-violet-700 hover:bg-violet-50 transition-colors disabled:opacity-50"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

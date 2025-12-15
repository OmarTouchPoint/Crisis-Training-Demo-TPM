/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Clock, 
  MessageCircle, 
  Mail, 
  AlertTriangle, 
  Bomb, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  RotateCcw,
  Heart,
  Repeat,
  Share,
  MessageSquare,
  Smartphone,
  Volume2,
  VolumeX
} from 'lucide-react';

// --- TIPOS E INTERFACES ---

type GameState = 'intro' | 'playing' | 'decision' | 'results';

type SoundType = 'whatsapp' | 'sms' | 'email' | 'alert' | 'tweet' | 'explosion';

interface DecisionState {
  immediateAction: string;
  teamComm: string;
  clientAction: string;
  additionalNotes: string;
}

interface Message {
  sender: string;
  message: string;
  sent: boolean;
}

interface EmailContent {
  from: string;
  to: string;
  subject: string;
  body: string;
}

interface Threat {
  type?: 'sms' | 'whatsapp';
  recipient: string;
  message: string;
  number: string;
}

interface Tweet {
  user: string;
  handle: string;
  message: string;
  time?: string;
}

interface MixedContent {
  package: string;
  threats: Threat[];
}

interface ExplosionContent {
  explosion: string;
  tweets: Tweet[];
  whatsapp: Message[];
  threat: Threat;
}

interface InstructionsContent {
  title: string;
  instructions: string[];
  urgency: string;
  priority: string;
}

// Discriminación de tipos para los pasos
interface BaseStep {
  time: string;
  title: string;
}

interface WhatsAppStep extends BaseStep {
  type: 'whatsapp';
  content: { messages: Message[] };
}

interface EmailStep extends BaseStep {
  type: 'email';
  content: EmailContent;
}

interface MixedStep extends BaseStep {
  type: 'mixed';
  content: MixedContent;
}

interface ExplosionStep extends BaseStep {
  type: 'explosion';
  content: ExplosionContent;
}

interface InstructionsStep extends BaseStep {
  type: 'instructions';
  content: InstructionsContent;
}

type CrisisStep = WhatsAppStep | EmailStep | MixedStep | ExplosionStep | InstructionsStep;

// Extender la interfaz Window para webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

const CrisisSimulation: React.FC = () => {
  // --- ESTADOS ---
  const [gameState, setGameState] = useState<GameState>('intro');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(600); // 10 minutos
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [crisisName] = useState<string>('Crisis Touchpoint');
  const [decisions, setDecisions] = useState<DecisionState>({
    immediateAction: '',
    teamComm: '',
    clientAction: '',
    additionalNotes: ''
  });
  
  // Referencias
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // --- SISTEMA DE SONIDO (Web Audio API) ---
  const initAudio = () => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const playNotificationSound = useCallback((type: SoundType | string) => {
    if (!soundEnabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'whatsapp': // Silbido ascendente suave (tipo burbuja)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.15);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      
      case 'sms': // Doble beep electrónico
        osc.type = 'square';
        // Primer beep
        osc.frequency.setValueAtTime(800, now);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.setValueAtTime(0, now + 0.08);
        
        // Segundo beep (simplificado)
        osc.frequency.setValueAtTime(800, now + 0.1);
        gainNode.gain.setValueAtTime(0.05, now + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        
        osc.start(now);
        osc.stop(now + 0.2);
        break;

      case 'email': // Ding suave y resonante
        osc.type = 'sine';
        osc.frequency.setValueAtTime(550, now);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
        break;

      case 'alert': // Tono de advertencia grave
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.4);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      
      case 'tweet': // Pop muy corto y agudo (tipo gota de agua)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;

      case 'explosion': // Ruido blanco/grave
        osc.type = 'sawtooth'; 
        osc.frequency.setValueAtTime(50, now);
        osc.frequency.exponentialRampToValueAtTime(10, now + 0.8);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
        break;

      default:
        break;
    }
  }, [soundEnabled]);

  // --- DATOS ---
  const crisisSteps: CrisisStep[] = [
    {
      time: "8:30 AM",
      title: "Preocupación inicial por ausencia",
      type: "whatsapp",
      content: {
        messages: [
          { sender: "Arlette", message: "¿Alguien sabe dónde están Caro y Misa? No llegaron al estatus", sent: false },
          { sender: "Mariana", message: "Carola tampoco responde... esto es raro", sent: false },
          { sender: "Mariana", message: "Tenemos las entregas de Finnosummit y el Webinar de Business Republic hoy", sent: false },
          { sender: "Ricardo", message: "Ya les marqué a los tres, nadie contesta", sent: true }
        ]
      }
    },
    {
      time: "8:40 AM",
      title: "Asignación de moderación de panel",
      type: "whatsapp",
      content: {
        messages: [
          { sender: "Mariana", message: "¿Quién va a moderar el Zoom para Xepelin? Era Carola", sent: false },
          { sender: "Arlette", message: "Moisés, ¿puedes hacerlo tú?", sent: false },
          { sender: "Moisés", message: "Claro, pero no he practicado...", sent: true },
          { sender: "Mariana", message: "No le digas nada a Xepelin, solo avisa del cambio de moderador", sent: false }
        ]
      }
    },
    {
      time: "8:50 AM",
      title: "Preparación para el webinar",
      type: "whatsapp",
      content: {
        messages: [
          { sender: "Moisés", message: "En serio no he practicado nada, estoy nervioso", sent: true },
          { sender: "Mariana", message: "Tienes el guión y todo el material, la sala se abre en 10 minutos", sent: false },
          { sender: "Mariana", message: "Confío en ti, lo vas a hacer perfecto", sent: false },
          { sender: "Moisés", message: "Ok, vamos a esto 💪", sent: true }
        ]
      }
    },
    {
      time: "9:30 AM",
      title: "Éxito del webinar y búsqueda de desaparecidos",
      type: "whatsapp",
      content: {
        messages: [
          { sender: "Mariana V.", message: "¡Todo salió perfecto! Aunque fue apenas... 😅", sent: false },
          { sender: "Mariana V.", message: "Parece que no hicieron falta los desaparecidos", sent: false },
          { sender: "Ricardo", message: "Carola está en Querétaro pero no responde desde ayer", sent: true },
          { sender: "Arlette", message: "¿Alguien tiene el contacto de la pareja de Misa?", sent: false }
        ]
      }
    },
    {
      time: "10:10 AM",
      title: "Aviso de la administración del edificio",
      type: "email",
      content: {
        from: "Eva@circulodeideas.com",
        to: "Lista de distribución",
        subject: "Visitas de personas indeseables",
        body: "Buenos días,\n\nLes informamos que han llegado personas insistentes preguntando por 'Jamiltokers'. Se han mostrado agresivos con el personal de seguridad.\n\nSi alguien conoce a estas personas o sabe de qué se trata, favor de contactar a Melina inmediatamente.\n\nGracias,\nAdministración Zamora 33"
      }
    },
    {
      time: "10:20 AM",
      title: "Paquete sospechoso y amenazas directas",
      type: "mixed",
      content: {
        package: "📦 PAQUETE SOSPECHOSO entregado a Gabo y Poncho - Sin remitente identificado",
        threats: [
          { 
            type: "sms",
            recipient: "Carlos", 
            message: "Tenemos invitados especiales para ustedes. Esperamos que no quieran que sufran las consecuencias.",
            number: "+52 55 XXXX-XXXX"
          },
          { 
            type: "whatsapp",
            recipient: "Marianita", 
            message: "Sabemos que estás 'checaca' aunque trabajes desde casa. Ya sabes qué hacer.",
            number: "+52 55 YYYY-YYYY"
          }
        ]
      }
    },
    {
      time: "10:25 AM",
      title: "Escalamiento de la situación",
      type: "whatsapp",
      content: {
        messages: [
          { sender: "Gabo", message: "¡¡¡URGENTE!!! Llegó un paquete raro sin remitente", sent: true },
          { sender: "Carlos", message: "A mí me llegó un mensaje amenazante", sent: true },
          { sender: "Mariana", message: "A mí también... esto ya no es coincidencia", sent: false },
          { sender: "Ricardo", message: "¿Alguien más recibió algo extraño?", sent: true }
        ]
      }
    },
    {
      time: "10:30 AM",
      title: "Indicaciones de seguridad urgentes",
      type: "whatsapp",
      content: {
        messages: [
          { sender: "Coordinador Planta", message: "¡¡¡ATENCIÓN TODOS!!!", sent: false },
          { sender: "Coordinador Planta", message: "Confirmamos paquete sospechoso en las instalaciones", sent: false },
          { sender: "Coordinador Planta", message: "NO LO TOQUEN!!", sent: false },
          { sender: "Coordinador Planta", message: "NO contesten los mensajes!!!", sent: false },
          { sender: "Coordinador Planta", message: "Esperamos instrucciones de seguridad", sent: false }
        ]
      }
    },
    {
      time: "10:55 AM",
      title: "Explosión y difusión en medios",
      type: "explosion",
      content: {
        explosion: "💥 El paquete explota. El humo es insoportable. Pero no hay heridos.",
        tweets: [
          {
            user: "Pablinho",
            handle: "@Pablinho",
            time: "2m",
            message: "🚨 EXPLOSIÓN en edificio Zamora 33. Evacuación masiva en curso. Humo visible desde varias cuadras. #AlertaCDMX"
          },
          {
            user: "Pamela Cerdeira",
            handle: "@PamCerdeira",
            time: "5m",
            message: "ÚLTIMA HORA: Explosión de bomba en zona empresarial. Fuentes confirman presencia de delegado de alto nivel en el área. Investigación en curso."
          }
        ],
        whatsapp: [
          { sender: "Rodrigo", message: "Mira lo que están repartiendo en la entrada", sent: true },
          { sender: "Rodrigo", message: "📄 ULTIMO AVISO - A todos los inquilinos de Zamora33", sent: true },
          { sender: "Rodrigo", message: "Tienen 24 horas para evacuar o enfrentar las consecuencias", sent: true }
        ],
        threat: {
          recipient: "Moi",
          message: "Sabemos de tu novio que trabaja en el reclusorio. Sería una lástima que algo le pasara por tu culpa.",
          number: "+52 55 ZZZZ-ZZZZ"
        }
      }
    },
    {
      time: "Inmediatamente",
      title: "¿Qué hacer?",
      type: "instructions",
      content: {
        title: "ACCIONES INMEDIATAS REQUERIDAS",
        instructions: [
          "🏃‍♂️ Reunirse de inmediato - Todo el equipo debe congregarse en lugar seguro",
          "📞 Acciones clave a tomar - Contactar autoridades y activar protocolos de emergencia",
          "📋 Pasos a seguir sobre las acciones - Implementar plan de crisis y comunicación"
        ],
        urgency: "La seguridad del equipo está en riesgo inmediato",
        priority: "🚨 MÁXIMA PRIORIDAD 🚨 "
      }
    }
  ];

  // --- LOGICA DEL TIMER ---
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameState === 'decision' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && gameState === 'decision') {
      submitDecisions();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, timeRemaining]);

  // Scroll al final del chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentStep, gameState]);

  // --- MANEJADORES ---
  const startSimulation = () => {
    initAudio(); 
    setGameState('playing');
    setCurrentStep(0);
    setIsStarted(true);
    setTimeRemaining(600);
  };

  const nextStep = () => {
    if (currentStep < crisisSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setGameState('decision');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleDecisionChange = (field: keyof DecisionState, value: string) => {
    setDecisions(prev => ({ ...prev, [field]: value }));
  };

  const submitDecisions = () => {
    setGameState('results');
  };

  const restartSimulation = () => {
    setIsStarted(false);
    setGameState('intro');
    setDecisions({
      immediateAction: '',
      teamComm: '',
      clientAction: '',
      additionalNotes: ''
    });
    setTimeRemaining(600);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  // --- COMPONENTES DE RENDERIZADO (Sub-componentes) ---

  const RenderWhatsApp: React.FC<{ messages: Message[] }> = ({ messages }) => {
    useEffect(() => {
      messages.forEach((_, idx) => {
        const timeout = setTimeout(() => {
          playNotificationSound('whatsapp');
        }, idx * 800);
        return () => clearTimeout(timeout);
      });
    }, [messages]);

    return (
      <div className="bg-[#e5f5f5] rounded-2xl p-4 border border-(--turq-tpm) h-full overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-(--turq-tpm) flex items-center gap-2">
          <MessageCircle size={20} /> Chat Grupal TouchPoint
        </h3>
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.sent ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
              style={{ animationDelay: `${idx * 0.8}s`, opacity: 0, animationFillMode: 'forwards' }}
            >
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl relative shadow-sm ${
                msg.sent 
                  ? 'bg-[#dcf8c6] text-slate-800 rounded-br-sm ml-auto' 
                  : 'bg-white text-slate-800 rounded-bl-sm mr-auto'
              }`}>
                {!msg.sent && <div className="text-xs font-bold text-blue-600 mb-1">{msg.sender}</div>}
                <div className="text-sm leading-snug">{msg.message}</div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>
    );
  };

  const RenderEmail: React.FC<{ content: EmailContent }> = ({ content }) => {
    useEffect(() => {
      const timeout = setTimeout(() => {
        playNotificationSound('email');
      }, 500);
      return () => clearTimeout(timeout);
    }, []);

    return (
      <div className="bg-slate-100 rounded-lg border border-slate-300 p-6 animate-fadeIn text-slate-800 shadow-lg max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-4 text-blue-600 flex items-center gap-2 border-b pb-2 border-slate-300">
          <Mail size={20} /> Correo Electrónico
        </h3>
        <div className="space-y-2 mb-4 font-mono text-sm">
          <div><span className="font-bold text-slate-600">De:</span> {content.from}</div>
          <div><span className="font-bold text-slate-600">Para:</span> {content.to}</div>
          <div><span className="font-bold text-slate-600">Asunto:</span> {content.subject}</div>
        </div>
        <div className="bg-white p-4 rounded border-l-4 border-red-500 shadow-inner">
          <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700">{content.body}</pre>
        </div>
      </div>
    );
  };

  const RenderMixed: React.FC<{ content: MixedContent }> = ({ content }) => {
    useEffect(() => {
      playNotificationSound('alert');
      
      content.threats.forEach((threat, idx) => {
        const timeout = setTimeout(() => {
          playNotificationSound(threat.type || 'alert'); 
        }, 500 + (idx * 500));
        return () => clearTimeout(timeout);
      });
    }, [content]);

    return (
      <div className="space-y-6">
        <div className="bg-(--red-light) border border-red-600 rounded-lg p-4 animate-slideInLeft">
          <h3 className="text-lg font-semibold mb-2 text-(--red-tpm) flex items-center gap-2">
            <AlertTriangle size={20} /> Alerta de Seguridad
          </h3>
          <p className="text-(--black-tpm) font-normal">{content.package}</p>
        </div>

        <div className="bg-(--light-yellow) border border-orange-600 rounded-lg p-4 animate-slideInRight" style={{animationDelay: '0.3s'}}>
          <h3 className="text-lg font-bold mb-4 text-orange-400">⚠️ Mensajes Amenazantes</h3>
          <div className="space-y-3">
            {content.threats.map((threat, idx) => (
              <div key={idx} className="bg-slate-800/80 rounded-lg p-3 animate-fadeInUp flex items-start gap-3" style={{animationDelay: `${0.5 + (idx * 0.5)}s`, opacity: 0, animationFillMode: 'forwards'}}>
                <div className={`mt-1 p-2 rounded-full ${threat.type === 'whatsapp' ? 'bg-green-600/20 text-green-500' : 'bg-blue-600/20 text-blue-500'}`}>
                  {threat.type === 'whatsapp' ? <MessageCircle size={16} /> : <Smartphone size={16} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-300">Para: {threat.recipient}</span>
                      <span className="text-xs text-slate-400 font-mono">{threat.number}</span>
                  </div>
                  <div className="text-orange-200 italic text-sm">"{threat.message}"</div>
                  <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest text-right">{threat.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const RenderExplosion: React.FC<{ content: ExplosionContent }> = ({ content }) => {
    useEffect(() => {
      playNotificationSound('explosion');

      content.tweets.forEach((_, idx) => {
        const timeout = setTimeout(() => {
          playNotificationSound('tweet');
        }, 1000 + (idx * 1000));
        return () => clearTimeout(timeout);
      });
      
      const waTimeout = setTimeout(() => {
        playNotificationSound('whatsapp');
      }, 3000);

      return () => {
         clearTimeout(waTimeout);
      };
    }, [content]);

    return (
      <div className="space-y-6">
        <div className="bg-(--light-red) border-2 border-red-500 rounded-2xl p-6 text-center animate-pulse-fast">
          <h3 className="text-3xl font-bold mb-4 text-(--red-tpm) flex justify-center items-center gap-2">
            <Bomb size={32} /> EXPLOSIÓN
          </h3>
          <p className="text-xl text-(--black-tpm)">{content.explosion}</p>
        </div>

        <div className="bg-[#507fe1]/10 border border-[#507fe1]/50 rounded-xl p-6 animate-fadeIn" style={{animationDelay: '1s', opacity: 0, animationFillMode: 'forwards'}}>
          <h3 className="text-lg font-bold mb-4 text-[#507fe1] border-b border-slate-700 pb-2">
            Tendencias en X
          </h3>
          <div className="space-y-4">
            {content.tweets.map((tweet, idx) => (
              <div key={idx} className="bg-black border border-slate-800 rounded-xl p-4 transition-colors animate-fadeInUp" style={{animationDelay: `${1 + (idx * 1)}s`, opacity: 0, animationFillMode: 'forwards'}}>
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white shrink-0">
                      {tweet.user.charAt(0)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5">
                          <span className="font-bold text-white truncate">{tweet.user}</span>
                          <span className="text-slate-500 text-sm truncate">{tweet.handle}</span>
                          <span className="text-slate-500 text-sm">·</span>
                          <span className="text-slate-500 text-sm">{tweet.time || '1m'}</span>
                      </div>
                      
                      <div className="text-white text-[15px] leading-normal mb-3 whitespace-pre-wrap">
                          {tweet.message}
                      </div>

                      <div className="flex justify-between text-slate-500 max-w-md pr-4">
                          <div className="flex items-center gap-2 group cursor-pointer hover:text-blue-500 transition-colors">
                            <MessageSquare size={16} /> <span className="text-xs">12</span>
                          </div>
                          <div className="flex items-center gap-2 group cursor-pointer hover:text-green-500 transition-colors">
                            <Repeat size={16} /> <span className="text-xs">48</span>
                          </div>
                          <div className="flex items-center gap-2 group cursor-pointer hover:text-pink-500 transition-colors">
                            <Heart size={16} /> <span className="text-xs">182</span>
                          </div>
                          <div className="flex items-center gap-2 group cursor-pointer hover:text-blue-500 transition-colors">
                            <Share size={16} />
                          </div>
                      </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-(--light-yellow) border border-amber-500 rounded-lg p-4 animate-fadeIn" style={{animationDelay: '2s', opacity: 0, animationFillMode: 'forwards'}}>
          <h3 className="text-lg font-semibold mb-2 text-amber-500">⚠️ Amenaza Personal</h3>
          <div className="bg-slate-800 p-3 rounded text-slate-100 flex-col">
            
            <p className='text-sm font-light'>
              De: +52 XXXX XXXXXX
            </p>
            <p className="message text-amber-100">

              "{content.threat.message}"
            </p>
          </div>
        </div>
      </div>
    );
  };

  const RenderInstructions: React.FC<{ content: InstructionsContent }> = ({ content }) => (
     <div className="bg-(--red-light) border border-(--red-tpm) rounded-2xl p-8 animate-zoomIn">
        <h3 className="text-3xl font-bold mb-8 text-center text-(--red-tpm)">{content.title}</h3>
        <div className="space-y-4 mb-8">
           {content.instructions.map((ins, idx) => (
              <div key={idx} className="bg-(--red-tpm) rounded-lg p-4 border-l-4 border-(--red-tpm) flex items-start gap-3">
                 <div className="mt-1 text-white"><ArrowRight size={16}/></div>
                 <p className="text-white font-medium text-lg">{ins}</p>
              </div>
           ))}
        </div>
        <div className=" rounded-lg p-4 text-center animate-pulse">
           <p className='font-bold text-(--red-tpm) text-xl uppercase tracking-wider'>{content.priority}</p>
           <p className="font-bold text-(--gray-tpm) text-xl tracking-wider">{content.urgency}</p>
        </div>
     </div>
  );

  // --- RENDERIZADO PRINCIPAL ---

  return (
    <div className={`min-h-screen ${ isStarted ? "step-bg" : "main-bg" }`}>
      
      {/* Definición de animaciones custom */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes zoomIn {
           from { opacity: 0; transform: scale(0.95); }
           to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
        .animate-fadeIn { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-slideInLeft { animation: slideInLeft 0.5s ease-out forwards; }
        .animate-slideInRight { animation: slideInRight 0.5s ease-out forwards; }
        .animate-zoomIn { animation: zoomIn 0.5s ease-out forwards; }
        .animate-pulse-fast { animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>

      {/* Control de Sonido Global */}
      <button 
        onClick={toggleSound}
        className="fixed top-4 right-4 z-50 p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors border border-slate-600"
        title={soundEnabled ? "Silenciar" : "Activar Sonido"}
      >
        {soundEnabled ? <Volume2 size={20} className="text-green-400"/> : <VolumeX size={20} className="text-red-400"/>}
      </button>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* VIEW: INTRO */}
        {gameState === 'intro' && (
          <div className="animate-zoomIn">
            <div className="text-center mb-12 pt-10">
              <h1 className="text-5xl font-bold mb-6 ">
                🚨 CRISIS TOUCHPOINT
              </h1>
              <p className="text-2xl  font-light tracking-wide">Simulación Interactiva de Manejo de Crisis</p>
            </div>
            
            <div className=" rounded-3xl p-10 border bg-white text-(--black-tpm) ">
              <video poster='/placeholder-video.png' src="/introduction-video.mp4" controls className='w-full rounded-2xl mb-10 text'></video>
              
              <div className="space-y-8 mb-10">
                <p className=" leading-relaxed text-xl  text-left  mx-auto">
                  Estás a punto de experimentar una simulación realista. 
                  Como parte del equipo, enfrentarás eventos inesperados que pondrán 
                  a prueba tus habilidades de toma de decisiones bajo presión.
                </p>
                
                <div className="grid md:flex-col gap-6">
                  <div className="bg-(--light-yellow) border border-yellow-600/50 rounded-xl p-6 text-lg">
                    <h3 className="font-bold  mb-3 flex items-center gap-2">📋 Instrucciones</h3>
                    <ul className="font-light space-y-2">
                      <li className="flex gap-2 items-start"><span className="opacity-50">•</span> Observa cada situación cuidadosamente</li>
                      <li className="flex gap-2 items-start"><span className="opacity-50">•</span> Toma notas mentales de los eventos</li>
                      <li className="flex gap-2 items-start"><span className="opacity-50">•</span> Al final tendrás 10 minutos para decidir</li>
                    </ul>
                  </div>
                  
                  <div className="bg-(--red-light) border border-red-600/50 rounded-xl p-6">
                    <h3 className="font-bold  mb-3 flex items-center gap-2">⚠️ Contexto Inicial</h3>
                    <p className="text-lg font-light ">
                      Jueves 11 de septiembre, 8:30 AM. Entregas de Finnosummit y webinar de Business Republic programados. Algo no está bien...
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <button 
                  onClick={startSimulation}
                  className=" bg-(--red-tpm) text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-red-500/20 ring-4 ring-transparent hover:ring-red-500/30"
                >
                Iniciar Simulación
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: PLAYING (CRISIS STEPS) */}
        {gameState === 'playing' && (
          <div className="animate-fadeIn">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-2xl capitalize  text-(--red-tpm) font-bold mb-1">{crisisName}</h2>
                  
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-(--gray-tpm) px-4 py-2 rounded-lg font-mono text-white  flex items-center gap-2">
                     <Clock size={16} /> {crisisSteps[currentStep].time}
                  </div>
                  <div className="text-lg text-(--black-tpm) font-light  px-3 py-2 rounded-lg">
                    Paso {currentStep + 1} / {crisisSteps.length}
                  </div>
                </div>
              </div>
              <div className="w-full bg-[#D2EAEA] rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-(--red-tpm) h-full transition-all duration-700 ease-out"
                  style={{ width: `${((currentStep + 1) / crisisSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Dynamic Content */}
            <div key={currentStep} className="bg-white backdrop-blur-md rounded-3xl p-8 border border-slate-700 min-h-[500px] shadow-2xl relative overflow-hidden">
              <h2 className="text-3xl font-bold mb-6 text-(--black-tpm) border-b border-slate-700 pb-4">
                {crisisSteps[currentStep].title}
              </h2>
              
              <div className="mt-6">
                {crisisSteps[currentStep].type === 'whatsapp' && <RenderWhatsApp messages={crisisSteps[currentStep].content.messages} />}
                {crisisSteps[currentStep].type === 'email' && <RenderEmail content={crisisSteps[currentStep].content} />}
                {crisisSteps[currentStep].type === 'mixed' && <RenderMixed content={crisisSteps[currentStep].content} />}
                {crisisSteps[currentStep].type === 'explosion' && <RenderExplosion content={crisisSteps[currentStep].content} />}
                {crisisSteps[currentStep].type === 'instructions' && <RenderInstructions content={crisisSteps[currentStep].content} />}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button 
                onClick={prevStep}
                disabled={currentStep === 0}
                className="bg-[#e5f5f5] flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed  text-(--black-tpm) hover:scale-105"
              >
                <ArrowLeft size={20} /> Anterior
              </button>
              <button 
                onClick={nextStep}
                className="bg-(--red-tpm) px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                {currentStep === crisisSteps.length - 1 ? 'Tomar Decisiones' : 'Siguiente'} <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* VIEW: DECISION */}
        {gameState === 'decision' && (
          <div className="animate-fadeInUp">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold mb-4 text-(--black-tpm) flex items-center justify-center gap-3">
                 ⏰ MOMENTO DE DECISIÓN
              </h1>
              <div className={`text-4xl w-full font-mono font-bold mb-4 px-8 py-4 rounded-2xl inline-block transition-colors duration-500 bg-(--red-tpm)`}>
                {formatTime(timeRemaining)}
              </div>
              <p className="text-xl font-ligth text-(--black-tpm)">Tiempo restante para definir tu estrategia</p>
            </ div>
 
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Resumen */}
              <div className="bg-white backdrop-blur-sm rounded-2xl p-8 ">
                <h2 className="text-2xl font-bold mb-6 text-(--black-tpm) flex items-center gap-2">
                   📝 Resumen de Eventos
                </h2>
                <div className="space-y-4 text-lg">
                  <div className="bg-(--light-red) p-4 rounded-xl border border-(--red-tpm) text-(--black-tpm) font-normal">
                    <strong className="block text-(--red-tpm) mb-1">Personas Desaparecidas</strong> Carola, Caro y Misa no responden.
                  </div>
                  <div className="bg-[#507FE1]/10 p-4 rounded-xl border border-[#507FE1] text-(--black-tpm)">
                    <strong className="block text-[#507FE1] mb-1">Amenazas</strong> Mensajes intimidantes directos y llamadas.
                  </div>
                  <div className="bg-[#e5f5f5] p-4 rounded-xl border border-(--turq-tpm) text-(--black-tpm)">
                    <strong className="block text-(--turq-tpm) mb-1">Incidente Crítico</strong> Paquete sospechoso y posterior detonación controlada (sin heridos).
                  </div>
                  <div className="bg-(--light-yellow) p-4 rounded-xl border border-amber-500 text-(--black-tpm)">
                    <strong className="block text-amber-500 mb-1">Seguridad Física</strong> Intrusos buscando personal específico en el edificio.
                  </div>
                </div>
              </div>

              {/* Formulario */}
              <div className="bg-white backdrop-blur-sm rounded-2xl p-8  shadow-xl">
                <h2 className="text-2xl font-semibold mb-6 text-(--black-tpm) flex items-center gap-2">
                   <CheckCircle size={24}/> Tus Decisiones
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-(--black-tpm)">Acción Inmediata (Prioridad 1):</label>
                    <select 
                      value={decisions.immediateAction}
                      onChange={(e) => handleDecisionChange('immediateAction', e.target.value)}
                      className="w-full bg-[#f6f6f6] text-(--black-tpm) rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="">Selecciona una acción...</option>
                      <option value="evacuate">Evacuar oficinas inmediatamente</option>
                      <option value="police">Llamar a la policía</option>
                      <option value="security">Contactar seguridad del edificio</option>
                      <option value="continue">Continuar operaciones normalmente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-(--black-tpm)">Estrategia de Comunicación:</label>
                    <select 
                      value={decisions.teamComm}
                      onChange={(e) => handleDecisionChange('teamComm', e.target.value)}
                      className="w-full bg-[#f6f6f6]  text-(--black-tpm) rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="">Selecciona estrategia...</option>
                      <option value="transparent">Transparencia total con el equipo</option>
                      <option value="partial">Información parcial (evitar pánico)</option>
                      <option value="minimal">Solo información esencial "Need to know"</option>
                      <option value="silence">Silencio hasta tener confirmación</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-(--black-tpm)">Manejo de Clientes y Operaciones:</label>
                    <select 
                      value={decisions.clientAction}
                      onChange={(e) => handleDecisionChange('clientAction', e.target.value)}
                      className="w-full bg-[#f6f6f6]  text-(--black-tpm) rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="">Selecciona enfoque...</option>
                      <option value="cancel">Cancelar todo (Día perdido)</option>
                      <option value="postpone">Posponer reuniones críticas</option>
                      <option value="remote">Switch inmediato a remoto</option>
                      <option value="normal">Business as usual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-(--black-tpm)">Notas tácticas adicionales:</label>
                    <textarea 
                      value={decisions.additionalNotes}
                      onChange={(e) => handleDecisionChange('additionalNotes', e.target.value)}
                      className="w-full bg-[#f6f6f6] placeholder:text-(--black-tpm) text-(--black-tpm) rounded-xl px-4 py-3 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Ej: Protocolo de localización de personal, soporte legal..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12 pb-12">
              <button 
                onClick={submitDecisions}
                disabled={!decisions.immediateAction || !decisions.teamComm || !decisions.clientAction}
                className="bg-(--red-tpm) px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                ✅ Confirmar Protocolo
              </button>
            </div>
          </div>
        )}

        {/* VIEW: RESULTS */}
        {gameState === 'results' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-10">
              <h1 className="text-5xl text-(--black-tpm) font-bold mb-4  t">
                📊 ANÁLISIS DE DECISIONES
              </h1>
              <p className="text-xl text-(--black-tpm)">Evaluación de Desempeño en Crisis</p>
            </div>

            <div className="bg-white rounded-3xl p-10 space-y-6 max-w-3xl mx-auto pb-12">
              
              {/* Detail Cards */}
              <span className='text-(--black-tpm) font-bold text-3xl mb-3 block'>🚨 Acción Inmediata</span>
              <div className="bg-(--turq-tpm)/10 rounded-2xl p-6 border border-(--turq-tpm)">
                <h3 className="font-bold text-(--turq-tpm) text-lg mb-2">{decisions.immediateAction.toUpperCase()}</h3>
                <p className="text-(--black-tpm) text-base">
                   {decisions.immediateAction === 'evacuate' ? 'Correcto. Ante amenaza de bomba, la evacuación es no negociable.' : 
                    decisions.immediateAction === 'continue' ? 'Error fatal. Ignorar amenazas de bomba pone vidas en riesgo.' : 'Parcialmente correcto, pero insuficiente ante el riesgo de explosivos.'}
                </p>
              </div>
              <span className='text-(--black-tpm) font-bold text-3xl mb-3 block'>💬 Comunicación con el Equipo</span>      
              <div className="bg-(--red-light) rounded-2xl p-6 border border-(--red-tpm)">
                <h3 className="font-bold text-(--red-tpm) text-lg mb-2">{decisions.teamComm.toUpperCase()}</h3>
                <p className="text-(--black-tpm) text-base">
                   {decisions.teamComm === 'transparent' ? 'La mejor opción. En crisis de seguridad física, el equipo necesita saber a qué se enfrenta para protegerse.' : 
                    decisions.teamComm === 'silence' ? 'Muy peligroso. El rumor hace más daño que la verdad, y la ignorancia expone al equipo.' : 'Estrategia aceptable para evitar pánico masivo, pero riesgosa.'}
                </p>
              </div>
              <span className='text-(--black-tpm) font-bold text-3xl mb-3 block'>⏱️ Gestión del Tiempo</span>      
              <div className="bg-[#507FE1]/10 rounded-2xl p-6 border border-slate-700">
                 <h3 className="font-bold text-[#507FE1] text-lg mb-2">Tiempo restante: {formatTime(timeRemaining)}.</h3>
                 <p className="text-(--black-tpm) text-base">
                     
                    {timeRemaining > 300 ? ' Toma de decisiones muy ágil.' : ' Se tomó tiempo prudente para analizar.'}
                 </p>
              </div>

              <div className="text-center pt-8">
                <button 
                  onClick={restartSimulation}
                  className="bg-(--red-tpm) hover:scale-105 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 mx-auto"
                >
                  <RotateCcw size={20}/> Reiniciar Simulación
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrisisSimulation;
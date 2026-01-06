// --- TIPOS E INTERFACES ---

export type GameState = 'intro' | 'playing' | 'decision' | 'results';

export type SoundType = 'whatsappGroup' | 'sms' | 'email' | 'alert' | 'tweet' | 'event';

export interface DecisionState {
  immediateAction: string;
  teamComm: string;
  clientAction: string;
  additionalNotes: string;
}

export interface Message {
  sender: string;
  message: string;
  sent: boolean;
}

export interface EmailContent {
  from: string;
  to: string;
  subject: string;
  body: string;
}

export interface Threat {
  type?: 'sms' | 'whatsappGroup';
  recipient: string;
  message: string;
  number: string;
}

export interface Tweet {
  user: string;
  handle: string;
  message: string;
  time?: string;
}

export interface MixedContent {
  steps: CrisisStep[];
}

export interface ExplosionContent {
  explosion: string;
  tweets: Tweet[];
  whatsapp: Message[];
  threat: Threat;
}

export interface InstructionsContent {
  title: string;
  instructions: string[];
  urgency: string;
  priority: string;
}

export interface BreakingNewContent {
  url: string;
  encabezado: string;
}

export interface WhatsAppChatContent {
  chatPerfilImg: string;
  chatPerfilName: string;
  messages: Message[];
}

export interface HeadingNewContent {
  heading: string;
  article: string;
  placeholderImg: string;
  date: string;
}

export interface NotificationContent {
  senderContact: string;
  message: string;
  time: string;
  icon: 'whatsapp' | 'sms';
}

export interface AlertContent {
  title: string;
  context: string;
  urgency: string;
  priority: string;
}

export interface TransitionOption {
  id: string; // Corresponds to the route id to transition to
  option: string;
}

export interface TransitionContent {
  title: string;
  options: TransitionOption[];
}

// Discriminación de tipos para los pasos
export interface BaseStep {
  time: string;
  title: string;
}

export interface WhatsAppGroupStep extends BaseStep {
  type: 'whatsappGroup';
  content: { messages: Message[] };
}

export interface EmailStep extends BaseStep {
  type: 'email';
  content: EmailContent;
}

export interface MixedStep extends BaseStep {
  type: 'mixed';
  content: MixedContent;
}

export interface EventStep extends BaseStep {
  type: 'event';
  content: ExplosionContent;
}

export interface InstructionsStep extends BaseStep {
  type: 'instructions';
  content: InstructionsContent;
}

export interface TransitionStep extends BaseStep {
  type: 'transition';
  content: TransitionContent;
}

export interface BreakingNewStep extends BaseStep {
  type: 'breaking-new';
  content: BreakingNewContent;
}

export interface WhatsAppChatStep extends BaseStep {
  type: 'whatsapp-chat';
  content: WhatsAppChatContent;
}

export interface HeadingNewStep extends BaseStep {
  type: 'headingNew';
  content: HeadingNewContent;
}

export interface WhatsAppNotificationStep extends BaseStep {
  type: 'whatsappNotification';
  content: NotificationContent;
}

export interface SMSNotificationStep extends BaseStep {
  type: 'smsNotification';
  content: NotificationContent;
}

export interface AlertStep extends BaseStep {
  type: 'alert';
  content: AlertContent;
}

export interface TwitterPostStep extends BaseStep {
  type: 'twitterPost';
  content: Tweet;
}

export type CrisisStep = WhatsAppGroupStep | EmailStep | MixedStep | EventStep | InstructionsStep | TransitionStep | BreakingNewStep | WhatsAppChatStep | HeadingNewStep | WhatsAppNotificationStep | SMSNotificationStep | AlertStep | TwitterPostStep;

// --- ESTRUCTURA DE RUTAS ---

export interface Route {
  id: string;
  steps: CrisisStep[];
}

export const routes: Route[] = [
  {
    id: 'initial',
    steps: [
        {
            time: "8:30 AM",
            title: "Preocupación inicial por ausencia",
            type: "whatsappGroup",
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
            type: "whatsappGroup",
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
            type: "whatsappGroup",
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
            type: "whatsappGroup",
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
            time: "10:15 AM",
            title: "Notificación de SMS",
            type: "smsNotification",
            content: {
              senderContact: "Carlos",
              message: "Tenemos invitados especiales para ustedes. Esperamos que no quieran que sufran las consecuencias.",
              time: "10:15 AM",
              icon: "sms"
            }
          },
          {
            time: "10:18 AM",
            title: "Notificación de WhatsApp",
            type: "whatsappNotification",
            content: {
              senderContact: "Marianita",
              message: "Sabemos que estás 'checaca' aunque trabajes desde casa. Ya sabes qué hacer.",
              time: "10:18 AM",
              icon: "whatsapp"
            }
          },
          {
            time: "10:19 AM",
            title: "Alerta de Seguridad",
            type: "alert",
            content: {
              title: "ALERTA DE SEGURIDAD",
              context: "Se ha detectado un paquete sospechoso en las instalaciones de la oficina. Se recomienda no tocarlo y esperar instrucciones.",
              urgency: "Inmediata",
              priority: "Máxima"
            }
          },
          {
            time: "10:20 AM",
            title: "Paquete sospechoso",
            type: "mixed",
            content: {
              steps: [
                {
                  time: "10:20 AM",
                  title: "Alerta de Paquete",
                  type: "alert",
                  content: {
                    title: "ALERTA DE SEGURIDAD",
                    context: "📦 PAQUETE SOSPECHOSO entregado a Gabo y Poncho - Sin remitente identificado",
                    urgency: "Precaución Extrema",
                    priority: "ALTA"
                  }
                },
                {
                  time: "10:20 AM",
                  title: "Notificación de SMS",
                  type: "smsNotification",
                  content: {
                    senderContact: "Carlos",
                    message: "Tenemos invitados especiales para ustedes. Esperamos que no quieran que sufran las consecuencias.",
                    time: "10:20 AM",
                    icon: "sms"
                  }
                },
                {
                  time: "10:20 AM",
                  title: "Notificación de WhatsApp",
                  type: "whatsappNotification",
                  content: {
                    senderContact: "Marianita",
                    message: "Sabemos que estás 'checaca' aunque trabajes desde casa. Ya sabes qué hacer.",
                    time: "10:20 AM",
                    icon: "whatsapp"
                  }
                }
              ]
            }
          },
          {
                type:"twitterPost",
                time:'10:20',
                title:'Explosión',
                content: {
                  user: "Pablinho",
                  handle: "Pablinho",
                  time: "2m",
                  message: "🚨 EXPLOSIÓN en edificio Zamora 33. Evacuación masiva en curso. Humo visible desde varias cuadras. #AlertaCDMX"
                }

          },
          {
            time: "10:25 AM",
            title: "Escalamiento de la situación",
            type: "whatsappGroup",
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
            type: "whatsappGroup",
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
            type: "event",
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
                message: "Esto es solo el comienzo.",
                number: "+52 55 ZZZZ-ZZZZ"
              }
            }
          },
          {
            time: "10:56 AM",
            title: "Amenaza Directa",
            type: "whatsapp-chat",
            content: {
              chatPerfilImg: "/placeholder.svg",
              chatPerfilName: "Número Desconocido",
              messages: [
                { sender: "Desconocido", message: "Sabemos de tu novio que trabaja en el reclusorio. Sería una lástima que algo le pasara por tu culpa.", sent: false }
              ]
            }
          },
      {
        time: "11:00 AM",
        title: "Punto de Decisión Crítico",
        type: "transition",
        content: {
          title: "La situación ha escalado. ¿Cuál es el siguiente paso inmediato?",
          options: [
            { id: 'call_police', option: "Llamar al 911 y reportar la explosión y amenazas" },
            { id: 'internal_protocol', option: "Activar protocolo de crisis interno y contactar al equipo de seguridad privada" }
          ]
        }
      }
    ]
  },
  {
    id: 'call_police',
    steps: [
      {
        time: "11:05 AM",
        title: "Respuesta de Emergencia",
        type: "whatsappGroup",
        content: {
          messages: [
            { sender: "Coordinador", message: "Ok, 911 contactado. La policía y los paramédicos vienen en camino. Nadie se mueva.", sent: true },
            { sender: "Mariana", message: "Bien hecho. Mantengamos la calma y sigamos los protocolos de las autoridades cuando lleguen.", sent: false }
          ]
        }
      },
      {
        time: "11:20 AM",
        title: "Llegan las Autoridades",
        type: "instructions",
        content: {
          title: "LA POLICÍA HA LLEGADO",
          instructions: [
            "El edificio está acordonado.",
            "Un equipo de investigación criminal tomará declaraciones.",
            "La prensa está afuera. NO den declaraciones."
          ],
          urgency: "La escena está bajo control de las autoridades.",
          priority: "COOPERACIÓN TOTAL"
        }
      },
      {
        time: "11:30 AM",
        title: "Cobertura Mediática",
        type: "breaking-new",
        content: {
          url: "/introduction-video.mp4",
          encabezado: "ÚLTIMA HORA: Tensión en Zamora 33 tras explosión; se investiga posible secuestro."
        }
      }
    ]
  },
  {
    id: 'internal_protocol',
    steps: [
      {
        time: "11:05 AM",
        title: "Activación de Protocolo Interno",
        type: "whatsappGroup",
        content: {
          messages: [
            { sender: "Coordinador", message: "Protocolo de crisis activado. Se ha contactado a 'Seguridad Total MX'. Vienen en camino.", sent: true },
            { sender: "Ricardo", message: "Bien, ellos tienen más experiencia en manejo de crisis corporativas. Evitemos el pánico mediático por ahora.", sent: true }
          ]
        }
      },
      {
        time: "11:25 AM",
        title: "Llega el Equipo de Seguridad Privada",
        type: "instructions",
        content: {
          title: "SEGURIDAD TOTAL MX EN EL SITIO",
          instructions: [
            "El equipo está asegurando el perímetro de forma discreta.",
            "Un consultor de crisis se reunirá con la dirección.",
            "Se ha establecido un canal de comunicación seguro."
          ],
          urgency: "La situación está siendo manejada internamente.",
          priority: "SEGUIR INDICACIONES DEL CONSULTOR"
        }
      },
      {
        time: "11:45 AM",
        title: "Publicación en Periódico",
        type: "headingNew",
        content: {
          heading: "Silencio Corporativo: Empresa de RP bajo fuego tras explosión en sus oficinas.",
          article: "Fuentes internas sugieren que la agencia Touchpoint, conocida por su manejo de crisis, está ahora en el centro de una. Tras una explosión en su sede de la Condesa, la empresa ha optado por un hermetismo total, contratando seguridad privada y evitando contacto con las autoridades. Esta decisión ha levantado sospechas sobre la naturaleza del incidente y la posible implicación de la agencia en actividades ilícitas. Expertos en seguridad cuestionan la legalidad de no reportar un incidente de esta magnitud a la policía, lo que podría acarrear consecuencias legales severas para la dirección de la empresa. Mientras tanto, el paradero de tres de sus empleados sigue siendo un misterio.",
          placeholderImg: "/main-bg.jpg",
          date: "Viernes, 12 de Septiembre"
        }
      }
    ]
  }
];

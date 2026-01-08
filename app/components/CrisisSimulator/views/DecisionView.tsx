'use client'
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { DecisionState } from '@/app/data/crisisSteps';

interface DecisionViewProps {
  timeRemaining: number;
  formattedTime: string;
  decisions: DecisionState;
  onDecisionChange: (field: keyof DecisionState, value: string) => void;
  onSubmit: () => void;
}

const DecisionView: React.FC<DecisionViewProps> = ({
  timeRemaining,
  formattedTime,
  decisions,
  onDecisionChange,
  onSubmit,
}) => {
  return (
    <div className="animate-fadeInUp">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4 text-(--black-tpm) flex items-center justify-center gap-3">
           ⏰ MOMENTO DE DECISIÓN
        </h1>
        <div className={`text-4xl w-full font-mono font-bold mb-4 px-8 py-4 rounded-2xl inline-block transition-colors duration-500 bg-(--red-tpm)`}>
          {formattedTime}
        </div>
        <p className="text-xl font-ligth text-(--black-tpm)">Tiempo restante para definir tu estrategia</p>
      </div>

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
                onChange={(e) => onDecisionChange('immediateAction', e.target.value)}
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
                onChange={(e) => onDecisionChange('teamComm', e.target.value)}
                className="w-full bg-[#f6f6f6]  text-(--black-tpm) rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="">Selecciona estrategia...</option>
                <option value="transparent">Transparencia total con el equipo</option>
                <option value="partial">Información parcial (evitar pánico)</option>
                <option value="minimal">Solo información esencial {'"'}Need to know{'"'}</option>
                <option value="silence">Silencio hasta tener confirmación</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-(--black-tpm)">Manejo de Clientes y Operaciones:</label>
              <select 
                value={decisions.clientAction}
                onChange={(e) => onDecisionChange('clientAction', e.target.value)}
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
                onChange={(e) => onDecisionChange('additionalNotes', e.target.value)}
                className="w-full bg-[#f6f6f6] placeholder:text-(--black-tpm) text-(--black-tpm) rounded-xl px-4 py-3 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Ej: Protocolo de localización de personal, soporte legal..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-12 pb-12">
        <button 
          onClick={onSubmit}
          disabled={!decisions.immediateAction || !decisions.teamComm || !decisions.clientAction}
          className="bg-(--red-tpm) px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          ✅ Confirmar Protocolo
        </button>
      </div>
    </div>
  );
};

export default DecisionView;

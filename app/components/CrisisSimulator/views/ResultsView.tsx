'use client'
import React from 'react';
import { RotateCcw } from 'lucide-react';
import { DecisionState } from '@/app/data/crisisSteps';

interface ResultsViewProps {
  decisions: DecisionState;
  timeRemaining: number;
  formattedTime: string;
  onRestart: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({
  decisions,
  timeRemaining,
  formattedTime,
  onRestart,
}) => {
  return (
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
           <h3 className="font-bold text-[#507FE1] text-lg mb-2">Tiempo restante: {formattedTime}.</h3>
           <p className="text-(--black-tpm) text-base">
               
              {timeRemaining > 300 ? ' Toma de decisiones muy ágil.' : ' Se tomó tiempo prudente para analizar.'}
           </p>
        </div>

        <div className="text-center pt-8">
          <button 
            onClick={onRestart}
            className="bg-(--red-tpm) hover:scale-105 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 mx-auto"
          >
            <RotateCcw size={20}/> Reiniciar Simulación
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResultsView;

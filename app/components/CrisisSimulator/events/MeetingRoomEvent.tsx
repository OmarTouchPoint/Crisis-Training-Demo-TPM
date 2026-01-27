'use client'
import React from 'react';
import { Video } from 'lucide-react';
import { MeetingRoom } from '@/app/data/crisisSteps';

interface MeetingRoomEventProps {
  content: {
    rooms: MeetingRoom[];
  };
  onSequenceComplete?: () => void;
}

const MeetingRoomEvent: React.FC<MeetingRoomEventProps> = ({ content, onSequenceComplete }) => {
  return (
    <div className="bg-blue-100 border border-blue-600 rounded-lg p-4 animate-slideInLeft max-w-2xl mx-auto shadow-lg">
      <h3 className="text-lg font-semibold mb-2 text-blue-700 flex items-center gap-2">
        <Video size={20} /> Salas de Reuniones
      </h3>
      <div className="flex flex-col gap-4 mt-4">
        {content.rooms.map((room, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-bold text-gray-800">{room.title}</h4>
            <p className="text-gray-600 my-2">{room.linkText}</p>
            <a
              href={room.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Unirse a la reunión
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingRoomEvent;

import React, { useState, useEffect } from 'react';

interface ToastMessage {
  id: string;
  icon: string;
  title: string;
  message: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

interface CarouselToastProps {
  messages: ToastMessage[];
  interval?: number; // milliseconds
}

const CarouselToast: React.FC<CarouselToastProps> = ({ 
  messages, 
  interval = 3000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [messages.length, interval]);

  if (messages.length === 0) return null;

  const currentMessage = messages[currentIndex];
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-800',
    green: 'from-green-50 to-green-100 border-green-200 text-green-800',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-800',
    orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-800'
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-2 pb-1">
      <div 
        className={`bg-gradient-to-r ${colorClasses[currentMessage.color]} border rounded-xl p-3 shadow-lg transition-all duration-500 transform`}
        key={currentMessage.id}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{currentMessage.icon}</span>
          <div className="flex-1">
            <p className="font-semibold text-sm">{currentMessage.title}</p>
            <p className="text-xs opacity-80 mt-0.5">{currentMessage.message}</p>
          </div>
          {messages.length > 1 && (
            <div className="flex gap-1">
              {messages.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-current opacity-100' : 'bg-current opacity-30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarouselToast;

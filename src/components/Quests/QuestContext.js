import React, { createContext, useContext, useState, useEffect } from 'react';

const QuestContext = createContext();

export const useQuests = () => useContext(QuestContext);

export const QuestProvider = ({ children }) => {
  const [quests, setQuests] = useState([]);
  const [activeQuest, setActiveQuest] = useState(null);

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      const response = await fetch('http://localhost/api/index.php/quests');
      const data = await response.json();
      if (data.success) {
        setQuests(data.quests);
        setActiveQuest(data.activeQuest);
      }
    } catch (error) {
      console.error('Error fetching quests:', error);
    }
  };

  const completeQuest = async (questId) => {
    try {
      const response = await fetch('http://localhost/api/index.php/quests/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId }),
      });
      const data = await response.json();
      if (data.success) {
        const updatedQuests = quests.map(quest => 
          quest.id === questId ? { ...quest, completed: 1 } : quest
        );
        setQuests(updatedQuests);
        setActiveQuest(data.nextQuest);

        // Check if all quests are completed
        const allCompleted = updatedQuests.every(quest => quest.completed === 1);
        if (allCompleted) {
          // Reset all quests
          fetchQuests(); // Fetch the reset quests from the server
        }
      }
    } catch (error) {
      console.error('Error completing quest:', error);
    }
  };

  return (
    <QuestContext.Provider value={{ quests, activeQuest, completeQuest, fetchQuests }}>
      {children}
    </QuestContext.Provider>
  );
};
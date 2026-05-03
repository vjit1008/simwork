import { createContext, useContext, useState, useEffect } from 'react';
import { defaultSimulations } from '../data/simulations';

// ✅ Named export for testing
export const SimContext = createContext(null);

export const SimProvider = ({ children }) => {
  const [sims,             setSims]             = useState(defaultSimulations());
  const [currentSim,       setCurrentSim]       = useState(null);
  const [currentStage,     setCurrentStage]     = useState('beginner');
  const [currentTask,      setCurrentTask]      = useState(0);
  const [taskResults,      setTaskResults]      = useState({});
  const [validationPassed, setValidationPassed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('simwork_sims_v3');
      if (saved) {
        const state = JSON.parse(saved);
        setSims(prev => prev.map(s => {
          const found = state.find(x => x.id === s.id);
          return found ? { ...s, ...found } : s;
        }));
      }
    } catch (e) {}
  }, []);

  const saveSims = (next) => {
    setSims(next);
    try {
      localStorage.setItem('simwork_sims_v3', JSON.stringify(
        next.map(s => ({
          id: s.id, status: s.status,
          progress: s.progress, stageProgress: s.stageProgress,
        }))
      ));
    } catch (e) {}
  };

  const updateSim  = (id, partial) => saveSims(sims.map(s => s.id === id ? { ...s, ...partial } : s));
  const resetSims  = () => { setSims(defaultSimulations()); localStorage.removeItem('simwork_sims_v3'); };

  return (
    <SimContext.Provider value={{
      sims, updateSim, resetSims,
      currentSim,       setCurrentSim,
      currentStage,     setCurrentStage,
      currentTask,      setCurrentTask,
      taskResults,      setTaskResults,
      validationPassed, setValidationPassed,
    }}>
      {children}
    </SimContext.Provider>
  );
};

export const useSim = () => {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error('useSim must be used within SimProvider');
  return ctx;
};
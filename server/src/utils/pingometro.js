const calculatePingometer = (deadline, status) => {
    if (status === 'done') return 0;
  
    const now = new Date();
    const deadlineDate = new Date(deadline);
  
    if (now <= deadlineDate) return 0;
  
    const diffInMs = now - deadlineDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); //Conversão de milissegundos para dias
    return diffInDays;
  };
  
  module.exports = { calculatePingometer };
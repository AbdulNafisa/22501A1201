const logger  = (message,data={}) =>{
    const log={
        timestamp: new Date().toISOString(),
        message,
        ...data
    };
    window.localStorage.setItem(`log-${Date.now()}`, JSON.stringify(log));
};
export default logger;
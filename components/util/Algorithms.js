const generateUniqueRandomName = () => (Math.random().toString(36) + Date.now().toString()).split('.')[1];

export {
    generateUniqueRandomName
};
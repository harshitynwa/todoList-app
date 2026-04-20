import app from './src/app.js';
import { initializeStore } from './src/store/dataStore.js';

const PORT = Number(process.env.PORT) || 5000;

initializeStore();

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
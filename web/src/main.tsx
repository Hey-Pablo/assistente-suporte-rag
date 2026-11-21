import {createRoot} from 'react-dom/client';
import {App} from './App';
import {criarApi} from './api';
import './style.css';
const url=import.meta.env.VITE_SUPABASE_URL, chave=import.meta.env.VITE_SUPABASE_ANON_KEY;
createRoot(document.getElementById('root')!).render(url&&chave?<App api={criarApi(url,chave)}/>:<main><h1>Configuração necessária</h1><p>Configure a URL e a chave pública do Supabase em web/.env.</p></main>);

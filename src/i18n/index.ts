import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import es from './es.json';

const deviceLocale = Intl.DateTimeFormat().resolvedOptions().locale;
const lang = deviceLocale.startsWith('es') ? 'es' : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: lang,
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
});

export default i18n;

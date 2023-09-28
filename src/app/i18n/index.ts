import { createInstance, Namespace, KeyPrefix } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { getOptions } from './settings';

const initI18next = async (lng: string, ns: string | string[]) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
    .init(getOptions(lng, ns));
  return i18nInstance;
};

export async function useTranslation<N extends Namespace, TKPrefix extends KeyPrefix<N>>(
  lng: string,
  ns?: any,
  options: { keyPrefix?: TKPrefix } = {}
) {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? (ns[0] as string[]) : (ns as string), options.keyPrefix),
    i18n: i18nextInstance,
  };
}

export const locationNS = {
  COMMON: 'common',
  HOME: 'home',
  SECOND_PAGE: 'second-page',
};

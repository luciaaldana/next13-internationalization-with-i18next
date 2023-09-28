export const fallbackLng = 'es';
export const languages = [fallbackLng, 'en'];
export const defaultNS = 'common';

export function getOptions(lng = fallbackLng, ns: string | string[] = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}

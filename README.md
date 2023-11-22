`PUEDES VER LA GUÍA COMPLETA Y EXPLICADA EN ESTE ARTÍCULO` →  [Internacionalización en Next.js 13 con I18Next](https://www.huasi.dev/blog/internacionalizacion-nextjs-13-i18next)

# INTERNACIONALIZACIÓN EN NEXT.JS 13 Y I18NEXT

INTERNACIONALIZACIÓN EN NEXT.JS 13 CON APP DIRECTORY, I18NEXT Y TYPESCRIPT

```
UTILIZA ESTE PROYECTO:

git clone https://github.com/luciaaldana/next13-internationalization-with-i18next.git

cd next13-internationalization-with-i18next
npm install

npm run dev
```

---

# PASOS:

(\*) NOTA: En este proyecto utilizamos los lenguajes Español e Inglés, pero puedes agregar tantos como quieras.

## `🏁 Crear el proyecto`

Si ya tienes tu proyecto, puedes saltar este paso.

```bash
npx create-next-app@latest
```

What is your project named? … next13-internationalization-with-i18next

✔ Would you like to use TypeScript? … No / Yes ✅

✔ Would you like to use ESLint? … No / Yes ✅

✔ Would you like to use Tailwind CSS? … No / Yes ❌

✔ Would you like to use `src/` directory? … No / Yes ✅

✔ Would you like to use App Router? (recommended) … No / Yes ✅

✔ Would you like to customize the default import alias? … No / Yes ❌

```bash
cd next13-internationalization-with-i18next
```

---

## `🏛️ Nueva estructura`

```bash
npm install i18next

```

Crearemos la nueva estructura del proyecto donde usaremos el lenguaje para crear rutas dinámicas.

Estas rutas se crean agregando segmentos dinámicos a partir de datos dinámicos que se completan en el momento de la solicitud o se renderizan previamente en el momento de la compilación.

Este segmento dinámico lo creamos colocando el nombre de la carpeta entre corchetes, que en nuestro caso será `[lng]`, y lo tendremos disponible como parámetros en layout, page, route y generateMetadata.

La ruta de nuestro proyecto se verá cómo:

```
Ruta => app/[lng]/page.ts

URL => http://localhost:3000/[lng] => [lng] será reemplazado por el lenguaje que usemos.
por ejemplo http://localhost:3000/es o http://localhost:3000/en donde 'es' y 'en' son nuestros datos dinámicos para la url en español e inglés respectivamente.

Params => {lng: ['es', 'en']}

```

La estructura quedaría de esta forma:

```
.
|__ app
    |__[lng]
        |__second-page
            |__page.tsx
        |__layout.tsx
        |__page.tsx
```

En app/layout.tsx agregamos la lista de idiomas para que esté disponible en el html:

```javascript
import { dir } from 'i18next'; // i18n para agregar el lenguaje al html

const languages = ['en', 'de']; // define los lenguajes necesites

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default function RootLayout({
  children,
  params: { lng }, // lng estará disponible por parámetro
}: {
  children: React.ReactNode,
  params: {
    lng: string,
  },
}) {
  return (
    // pasamos lng
    <html lang={lng} dir={dir(lng)}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

Ahora nuestra URL funcionará utilizando '/es' o '/en' que son los lenguajes que definimos en el archivo layout.tsx, ejemplo http://localhost:3000/es.

❗️**WARNING**❗️Nos encontraremos con un error 404 si utilizamos la ruta sin ese parámetro (http://localhost:3000), corrigamos eso en el siguiente paso.

---

## `🌎 Detectar el idioma`

#### (1) Instalamos el siguiente paquete:

```bash
npm install accept-language

```

#### (2) Creamos el archivo settings.ts y un middleware:

```
📂 .src
    |__📂 app
          |__📂 i18n
              |__📄 settings.ts
    |__📄 middleware.ts

```

- settings.ts:

Definimos el lenguaje por defecto y la lista de lenguajes que usamos (en este proyecto será español e inglés).

```javascript
// src/app/i18n/settings.ts

export const fallbackLng = 'es';
export const languages = [fallbackLng, 'en'];
```

- layout.tsx:

El array de lenguajes definida en el archivo layout.tsx, la reemplazamos con la importación de `languages` desde i18n/setting.ts

- middleware.ts:

Este middleware nos permitirá redireccionar a la url adecuada.

```javascript
// src/middleware.ts

import { NextResponse, NextRequest } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLng, languages } from './app/i18n/settings';

acceptLanguage.languages(languages);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
};

const cookieName = 'i18next';

export function middleware(req: NextRequest) {
  let lng;
  if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  if (!lng) lng = fallbackLng;

  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}`, req.url));
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') as string | URL);
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  return NextResponse.next();
}
```

Ahora si no agregamos el parámetro a la URL, nos redireccionará al idioma de nuestro navegador.

En mi caso http://localhost:3000/ me redirecciona a http://localhost:3000/es.

Probemos cambiar nuestro parámetro a 'en' y navegar.

Esto guardará la `cookie 'i18next'` que definimos con el valor del parámetro. Luego, si borramos el parámetro de la URL nos redirecciona al último lenguaje utilizado, el guardado en la cookie 'i18next': en.

---

## `🔥 I18Next en Server Components`

Preparemos el hook useTranslation para las traducciones en Server Components.

#### (1) Instalamos los siguientes paquetes:

```bash
npm install react-i18next i18next-resources-to-backend

```

#### (2) Agregamos las traducciones en una carpeta locales dentro de la carpeta i18n.

Cada lenguaje que queramos tener disponible tendrá su propia carpeta.

Dentro de cada lenguaje estarán los archivos .json que deberán tener el mismo nombre y estructura en cada lenguaje.

```
📂 .src
    |__📂 app
          |__📂 i18n
              |__📂 locales
                      |__📂 en
                          |__📄 home.json
                          |__📄 second-page.json
                          |__📄 common.json
                      |__📂 es
                          |__📄 home.json
                          |__📄 second-page.json
                          |__📄 common.json
```

#### (3) En el archivo settings.ts agregamos las opciones de configuración,

donde defaultNS define qué archivo .json se usará por defecto cuando no especificamos ninguno:

```javascript
// src/app/i18n/settings.ts

export const fallbackLng = 'es';
export const languages = [fallbackLng, 'en'];
export const defaultNS = 'common'; // nombre del archivo .json de locales que usaremos por defecto

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
```

#### (4) Creamos el archivo index.ts dentro de la carpeta i18n:

```javascript
// src/app/i18n/index.ts

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
```

Estaremos creando una nueva instancia de i18n en cada llamado al hook useTranslation, que recibe el lenguaje que estamos requiriendo mostrar (lng) y el nombre del archivo .json que queremos usar (ns). Este último lo definimos en locationNS al final del index.ts, que no es más que una lista de los nombres de los archivos .json con las traducciones.

#### (4) Aplicar las traducciones:

Los archivos Page.tsx serán asíncronos, importamos el hook `useTranslation` que creamos en i18n/index.ts y le pasamos las opciones de configuración que necesitamos (lng y ns).

Luego podremos usar la función `t` con las keys que definimos en el archivo .json, por ejemplo la key title del home.json ({t('title')}; ) para reemplazar los string de la Page.

Según el idioma que estemos utilizando en la url, será la traducción que se muestre. Prueba navegar entre http://localhost:3000/es y http://localhost:3000/en.

Agrega de la misma forma las traducciones a second-page. Recuerda cambiar el ns del useTranslation, locationNS.HOME por locationNS.SECOND_PAGE.

```javascript
// src/app/[lng]/page.tsx

import Link from 'next/link';
import { locationNS, useTranslation } from '../i18n';
import SwitchLng from '@/components/SwitchLng';
import styles from './page.module.css';

const Home = async ({ params: { lng } }: { params: { lng: string } }) => {
  const { t } = await useTranslation(lng, locationNS.HOME); // Cambiar a la sección necesaria

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>{t('note')}</p>
      </div>
      <SwitchLng lng={lng} />
      <div className={styles.center}>
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
      </div>

      <div className={styles.cardsContainer}>
        <Link href={`/${lng}/second-page`} className={styles.card}>
          <h2>
            {t('link.title')} <span>-&gt;</span>
          </h2>
          <p> {t('link.description')}</p>
        </Link>
      </div>
    </main>
  );
};

export default Home;

// http://localhost:3000 || http://localhost:3000/es || http://localhost:3000/en
```

---

## `💥 I18Next en Client Components`

Vamos a hacer de second-page un client component para aplicar i18n.

Usar nuestro hook con async/await en un client component nos dará este error:

_Error: async/await is not yet supported in Client Components, only Server Components. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server._

Saquemos el async/await y ahora no funciona useTranslation.

Preparemos el hook useTranslation para las traducciones en Client Components.

#### (1) Instalamos el siguiente paquete:

```bash
npm install i18next-browser-languagedetector

```

#### (2) En la carpeta i18n, creamos un archivo client.ts:

```javascript
// src/app/i18n/client.ts

'use client';
import { useEffect, useState } from 'react';
import i18next, { Namespace, KeyPrefix } from 'i18next';
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
  UseTranslationOptions,
  UseTranslationResponse,
} from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getOptions, languages } from './settings';

const runsOnServerSide = typeof window === 'undefined';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
  .init({
    ...getOptions(),
    lng: undefined,
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? languages : [],
  });

export function useTranslation<N extends Namespace, TKPrefix extends KeyPrefix<N> = undefined>(
  lng: string,
  ns?: N | Readonly<N>,
  options?: UseTranslationOptions<TKPrefix>
): UseTranslationResponse<N, TKPrefix> {
  const ret = useTranslationOrg(ns, options);
  const { i18n } = ret;
  if (runsOnServerSide && lng && i18next.resolvedLanguage !== lng) {
    i18next.changeLanguage(lng);
  } else {
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);
    useEffect(() => {
      if (activeLng === i18n.resolvedLanguage) return;
      setActiveLng(i18n.resolvedLanguage);
    }, [activeLng, i18n.resolvedLanguage]);
    useEffect(() => {
      if (!lng || i18n.resolvedLanguage === lng) return;
      i18n.changeLanguage(lng);
    }, [lng, i18n]);
  }
  return ret;
}
```

Ahora la importación de useTranslation será desde i18n/client.ts y tenemos las traducciones para client component.

---

## `💡 Crear un switch de lenguaje`

Dentro de src crearemos la carpeta components. Aquí crearemos el switch.

```javascript
// src/components/SwitchLng/index.tsx

'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { languages } from '@/app/i18n/settings';
import styles from './styles.module.css';

const SwitchLng = ({ lng }: { lng: string }) => {
  const pathname = usePathname();
  const langRegex = languages.join('|');

  return (
    <div className={styles.languageSwitch}>
      {languages.map((lang, index) => (
        <Link
          href={pathname.replace(new RegExp(`^/(${langRegex})\\b`), `/${lang}`)}
          key={lang}
          className={`${styles.link} ${styles[index === 0 ? 'firstLink' : '']} ${
            styles[index === languages.length - 1 ? 'lastLink' : '']
          } ${styles[lang === lng ? 'activeLng' : '']}`}
        >
          <span className={styles.language}>{lang.toUpperCase()}</span>
        </Link>
      ))}
    </div>
  );
};
export default SwitchLng;
```

Para cambiar de lenguaje, lo que hacemos es usar la ruta dinámica que creamos con la carpeta [lng]. Entonces debemos navegar a la ruta del lenguaje que queramos.

El componente será un client component porque usaremos el hook usePathname.

Este hook (`usePathname`) es necesario para hacer la navegación en caso de que tengamos una url con más partes que el dominio, por ejemplo /second-page. Tomamos el path completo y luego con una expresión regular, reemplazamos el lenguaje por el que elegimos en el switch.

En langRegex modificamos nuestro array languages definido en settings para usarlo en la expresión regular y no tener que agregar manualmente al switch algún idioma extra.

## Referencias

https://dev.to/adrai/i18n-with-nextjs-13-and-app-directory-18dm

https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes

https://nextjs.org/docs/app/building-your-application/rendering/server-components

https://nextjs.org/docs/app/building-your-application/rendering/client-components

# @jereztech/i18n-react

[![NPM Version](https://img.shields.io/npm/v/@jereztech/i18n-react.svg)](https://www.npmjs.com/package/@jereztech/i18n-react)
[![GPL License](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://coveralls.io/github/jereztech/i18n-react)

TypeScript-based internationalization (i18n) package for the React ecosystem, including but not limited to **React**, **Next.js**, and **React Native**.

## Features

- **Auto-detection**: Automatically detects user's language preferences.
- **Namespace Support**: Organize your translations using namespaces.
- **Lightweight**: Minimal overhead with efficient performance.
- **Fallback Message**: Fall back to default message if TranslationKey is not resolved.

## Installation

Install the package via npm:

```bash
npm install @jereztech/i18n-react
```

## Usage

### Configuration

Create an `i18n.config.ts` file at the root of your project. See [`/examples/i18n.config.ts`](/examples/i18n.config.ts) for reference.

### `I18nConfig` Options

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `defaultLocale` | `string` | `'en'` | The default locale to use when no user preference is detected or for fallback translations. |
| `dictionaries` | `Map` | `{}` | A Map of translation dictionaries for supported locales. |
| `autodetectLanguage` | `boolean` | `true` | Automatically detect the user's language preferences. |
| `initializeWithDefault` | `boolean` | `true` | Initialize with the default locale if autodetection is disabled or fails. |


**Note:** The fields `autodetectLanguage` and `initializeWithDefault` default to `true`. They can be disabled by setting them to `undefined` in your configuration:

```tsx
import { DictionaryMap, I18nConfig } from "@jereztech/i18n-react";
import en from './assets/dictionaries/en.json';
import es from './assets/dictionaries/es.json';

const dictionaries: DictionaryMap = { en, es };

const i18nConfig: I18nConfig = {
    defaultLocale: 'en',
    dictionaries,
    autodetectLanguage: undefined,
};

export default i18nConfig;
```

### Setting Up the `I18nProvider`

Wrap your application with the `I18nProvider` to provide localization context:

```tsx
import { ReactNode } from 'react';
import { I18nProvider } from '@jereztech/i18n-react';
import i18nConfig from '../i18n.config';

export default async function RootLayout(
    { children, params }: { children: ReactNode; params: { locale: string };}
) {
    const { locale } = await params;

    return (
        <html lang={locale}>
            <body>
                <I18nProvider config={i18nConfig}>
                    {children}
                </I18nProvider>
            </body>
        </html>
    );
};
```

### Using the `useI18n` Hook

Access translations within your components using the `useI18n` hook:

```tsx
"use client";
import { useI18n } from '@jereztech/i18n-react';

export default function Home() {
  const { t } = useI18n();

  return <div>{t('greeting', { name: 'John' }, 'fallbackTranslationKey')}</div>;
};
```

## License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

Copyright (C) 2025 [Jerez Tech](https://jereztech.com)

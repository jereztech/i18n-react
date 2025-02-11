# @jereztech/i18n-react

[![NPM Version](https://img.shields.io/npm/v/@jereztech/i18n-react.svg)](https://www.npmjs.com/package/@jereztech/i18n-react)
[![GPL License](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://coveralls.io/github/jereztech/i18n-react)
[![Latest Release](https://img.shields.io/github/release/jereztech/i18n-react.svg)](https://github.com/jereztech/i18n-react/releases)

**@jereztech/i18n-react** is a TypeScript-based internationalization (i18n) package for the React ecosystem, including but not limited to **React**, **Next.js**, and **React Native**.

## Features

- **Auto-detection**: Automatically detects user's language preferences.
- **Dynamic Loading**: Supports dynamic loading of translations.
- **Namespace Support**: Organize your translations using namespaces.
- **Lightweight**: Minimal overhead with efficient performance.

## Installation

Install the package via npm:

```bash
npm install @jereztech/i18n-react rxjs
```
**Note:** `@jereztech/i18n-react` uses `rxjs` for handling asynchronous data streams and implementing reactive programming patterns, which enhance the efficiency of internationalization processes. Make sure to install this package correctly.

## Usage

### Configuration

Create an `i18n-config.ts` file at the root of your project. See [`/examples/i18n-config.ts`](/examples/i18n-config.ts) for reference.

### React

#### Setting Up the `I18nProvider`

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

#### Using the `useI18n` Hook

Access translations within your components using the `useI18n` hook:

```tsx
"use client";
import { useI18n } from '@jereztech/i18n-react';

export default function Home() {
  const { t } = useI18n();

  return <div>{t('welcome')}</div>;
};
```

### `I18nConfig` Options

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `defaultLocale` | `string` | `'en'` | The default locale to use when no user preference is detected or for fallback translations. |
| `dictionaries` | `Map` | `{}` | A Map of translation dictionaries for supported locales. |
| `autodetectLanguage` | `boolean` | `true` | Automatically detect the user's language preferences. |
| `initializeWithDefault` | `boolean` | `true` | Initialize with the default locale if autodetection is disabled or fails. |
| `redirectToLocaleSubpath` | `boolean` | `true` | If `true`, redirects to a locale-specific subpath (e.g., `/en/products`). |
| `redirectWithParameter` | `string` |  | If provided, redirects with a query parameter specifying the locale (e.g., `?lang=en`). |

**Note:** The fields `autodetectLanguage`, `initializeWithDefault`, and `redirectToLocaleSubpath` default to `true`. They can be disabled by setting them to `undefined` in your configuration:

```tsx
import { DictionaryMap, I18nConfig } from "@jereztech/i18n-react";
import en from './assets/dictionaries/en.json';
import es from './assets/dictionaries/es.json';

const dictionaries: DictionaryMap = { en, es };

const i18nConfig: I18nConfig = {
    defaultLocale: 'en',
    dictionaries,
    redirectToLocaleSubpath: undefined,
};

export default i18nConfig;
```

### React Components and Hooks

#### `I18nProvider`

Provides i18n context to child components:

```tsx
<I18nProvider config={I18nConfig}>
  {/* Child components */}
</I18nProvider>
```

#### `useI18n`

Hook to access translation functions and current locale:

```tsx
const { t, locale } = useI18n(namespace?: Namespace);
```

## License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

Copyright (C) 2025 [Jerez Tech](https://jereztech.com)

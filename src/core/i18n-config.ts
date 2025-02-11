/*
 * Copyright (C) 2025 Jerez Tech
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import type { DictionaryMap, Locale } from "@core/types/i18n-types";

export const DEFAULT_LOCALE = 'en';
export const DEFAULT_CURRENCY = 'USD';
export const REDIRECT_PARAM_NAME = 'lang';

export const DEFAULT_CONFIG: I18nConfig = {
    defaultLocale: DEFAULT_LOCALE,
    dictionaries: {},
    autodetectLanguage: true,
    initializeWithDefault: true,
    redirectToLocaleSubpath: true,
};

type I18nConfig = {
    /**
     * The default locale to use when no user preference is detected or for fallback translations.
     */
    defaultLocale: Locale,
    /**
      * A Map of translation dictionaries for supported locales.
      * 
      * This constant maps locale codes (e.g., 'en', 'es') to their corresponding translation dictionaries.
      * Each `dictionary` contains key-value pairs where the key is a translation identifier, 
      * and the value is the translated string in the specified locale.
     */
    dictionaries: DictionaryMap,
    /**
     * Automatically detect the user's language preferences.
     */
    autodetectLanguage?: true,
    /**
     * Initialize with the default locale if autodetection is disabled or fails.
     */
    initializeWithDefault?: true,
    /**
     * If true, redirects to a locale-specific subpath (e.g., `/en/products`).
     */
    redirectToLocaleSubpath?: true,
    /**
     * If provided, redirects with a query parameter specifying the locale (e.g., `?lang=en`).
     */
    redirectWithParameter?: string,
};

export default I18nConfig;

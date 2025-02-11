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

import I18nConfig, { DEFAULT_CURRENCY } from "@core/i18n-config";
import { FormatType } from "@core/types/FormatType";
import type { Dictionary, Locale, Namespace, TranslationKey, TranslationParams, TranslationValue } from "@core/types/i18n-types";

/**
 * Load translations based on locale.
 * 
 * @param locale - Current locale.
 * @param config - Current i18nConfig.
 * @returns The loaded translations.
 */
export const getDictionary = (locale: Locale, config: I18nConfig): Dictionary => {
    const { defaultLocale, dictionaries } = config;

    if (!dictionaries.hasOwnProperty(locale)) {
        if (locale === defaultLocale) { // prevent infinite recursion
            console.error(`Dictionary not found for locale "${locale}".`);
            return {};
        }
        return getDictionary(defaultLocale, config); // load fallback translations
    }

    return dictionaries[locale];
};

/**
   * Translate function that handles dynamic formatting based on placeholders.
   * 
   * @param locale - Current locale.
   * @param dictionary - Current locale's translations.
   * @param key - The translation key.
   * @param params - Parameters for interpolation and formatting.
   * @param namespace - Namespace to look up the key.
   * @param fallbackKey - The fallback key.
   * @returns The translated and formatted string.
   */
export const translate = (
    locale: Locale,
    dictionary: Dictionary,
    key: TranslationKey,
    params?: TranslationParams,
    namespace?: Namespace,
    fallbackKey?: TranslationKey,
): string => {

    let translation: TranslationValue = namespace && dictionary[namespace] ?
        (dictionary[namespace] as any)[key] ?? key :
        (dictionary[key] ?? key);

    if (translation === key && fallbackKey && key != fallbackKey) {
        return translate(locale, dictionary, fallbackKey, params, namespace);
    }

    // Handle pluralization if translation is an object
    if (typeof translation === 'object') {
        const count = params?.count;
        if (count === undefined) {
            console.warn(`Missing 'count' parameter for pluralization in key '${key}'.`);
            return key;
        }
        const pluralRule = new Intl.PluralRules(locale).select(count);
        translation = translation[pluralRule] || translation.other;
    }

    // Interpolate parameters with dynamic formatting
    if (params) {
        /**
         * Captures placeholders with optional formatting instructions:
         * 
         * - paramName (p1): The name of the parameter (e.g., date).
         * - formatTypeStr (p2): The optional formatting type (e.g., date, currency).
         */
        const placeholderRegex = /{{\s?(\w+)(?:\s*,\s*(\w+))?\s?}}/g;

        translation = translation.replace(placeholderRegex, (_: any, paramName: string, formatTypeStr: string) => {
            const value = params[paramName];
            const formatType = getFormatType(formatTypeStr);
            switch (formatType) {
                case FormatType.DATE:
                    if (value instanceof Date) {
                        return new Intl.DateTimeFormat(locale, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            timeZone: 'UTC',
                        }).format(value);
                    }
                    console.warn(`Expected Date object for parameter '${paramName}', received ${typeof value}.`);
                    return value;

                case FormatType.NUMBER:
                    if (typeof value === 'number') {
                        return new Intl.NumberFormat(locale).format(value);
                    }
                    console.warn(`Expected number for parameter '${paramName}', received ${typeof value}.`);
                    return value;

                case FormatType.CURRENCY:
                    const currency = params.currency || DEFAULT_CURRENCY;
                    if (typeof value === 'number') {
                        return new Intl.NumberFormat(locale, {
                            style: 'currency',
                            currency,
                        }).format(value);
                    }
                    console.warn(`Expected number for currency formatting on parameter '${paramName}', received ${typeof value}.`);
                    return value;

                case FormatType.NONE:
                default:
                    return value !== undefined ? value : `{{${paramName}}}`;
            }
        });
    }

    return translation;
};

const getFormatType = (value: string): FormatType => {
    if (!value) return FormatType.NONE;
    const [formatType] = Object.values(FormatType).filter(format => format === value.toLowerCase());
    return formatType || FormatType.NONE;
}

/**
 * Resolves the user's preferred locale based on browser settings.
 *
 * @param config - Current i18nConfig.
 * @returns The resolved locale string.
 */
export function resolveUserLocale(config: I18nConfig): string {
    const { dictionaries, defaultLocale } = config;
    const supportedLocales = Object.keys(dictionaries);
    const normalizedLocales = supportedLocales.map((locale) => locale.toLowerCase());

    let browserLanguages: readonly string[] = [];
    if (typeof navigator !== 'undefined') {
        browserLanguages = !!navigator.languages?.length
            ? navigator.languages
            : navigator.language
                ? [navigator.language]
                : [];
    }

    for (const browserLang of browserLanguages) {
        if (!browserLang) continue;
        const normalizedBrowserLang = browserLang.toLowerCase();
        const exactMatchIndex = normalizedLocales.indexOf(normalizedBrowserLang);
        if (exactMatchIndex !== -1) {
            return supportedLocales[exactMatchIndex];
        }

        const primaryLang = normalizedBrowserLang.split('-')[0];
        const primaryMatchIndex = normalizedLocales.findIndex((locale) =>
            locale.startsWith(primaryLang)
        );
        if (primaryMatchIndex !== -1) {
            return supportedLocales[primaryMatchIndex];
        }
    }

    return defaultLocale;
}

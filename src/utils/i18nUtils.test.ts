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

import I18nConfig, { DEFAULT_CONFIG } from '@core/i18n-config';
import type { Dictionary, DictionaryMap, Locale } from '@core/types/i18n-types';
import { getDictionary, resolveUserLocale, translate } from './i18nUtils';

const mockDictionaryMap: DictionaryMap = {
    en: { greeting: "Hey" },
    'fr-FR': { greeting: "Bonjour" },
    'en-GB': { greeting: "Hello" },
};

const mockConfig: I18nConfig = {
    ...DEFAULT_CONFIG,
    dictionaries: mockDictionaryMap
};

const mockLocale: Locale = 'en';
const mockDictionary: Dictionary = {
    welcome: 'Welcome',
    greeting: 'Hello {{name}}!',
    items: {
        one: 'You have one item',
        other: 'You have {{count}} items',
    },
    date: 'Today is {{date, date}}',
    number: 'Your score is {{score, number}}',
    currency: 'Total price: {{price, currency}}',
    Home: {
        title: 'Welcome Home',
        sales: {
            one: 'Sale: {{count}} item left!',
        },
    },
    fallbackKey: 'Fallback translation',
};

describe('getDictionary', () => {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    beforeEach(() => {
        console.error = jest.fn();
        console.warn = jest.fn();
    });

    afterEach(() => {
        console.error = originalConsoleError;
        console.warn = originalConsoleWarn;
    });

    it('should successfully get the dictionary for a supported locale', () => {
        const dictionary = getDictionary('en', mockConfig);
        expect(dictionary).toEqual(mockDictionaryMap['en']);
    });

    it('should fallback to defaultLocale if locale is not supported', () => {
        const dictionary = getDictionary('es', mockConfig);
        expect(dictionary).toEqual(mockDictionaryMap['en']);
    });

    it('should prevent infinite recursion when defaultLocale is not supported', () => {
        const config: I18nConfig = { ...mockConfig, defaultLocale: 'es' };

        const dictionary = getDictionary('it', config);

        expect(dictionary).toEqual({});
        expect(console.error).toHaveBeenCalledWith('Dictionary not found for locale "es".');
    });
});

describe('resolveUserLocale', () => {
    const originalNavigator = { ...navigator };

    afterEach(() => {
        // Restore original navigator properties
        Object.defineProperty(navigator, 'languages', {
            value: originalNavigator.languages,
            configurable: true,
        });
        Object.defineProperty(navigator, 'language', {
            value: originalNavigator.language,
            configurable: true,
        });
    });

    it('should return exact match when available', () => {
        Object.defineProperty(navigator, 'languages', {
            value: ['fr-FR', 'en'],
            configurable: true,
        });

        const result = resolveUserLocale(mockConfig);

        expect(result).toBe('fr-FR');
    });

    it('should return default locale when no matches are found', () => {
        Object.defineProperty(navigator, 'languages', {
            value: ['de-DE', 'it-IT'],
            configurable: true,
        });

        const result = resolveUserLocale(mockConfig);

        expect(result).toBe('en'); // Falls back to defaultLocale
    });

    it('should match locales regardless of case sensitivity', () => {
        Object.defineProperty(navigator, 'languages', {
            value: ['FR-fr'],
            configurable: true,
        });

        const result = resolveUserLocale(mockConfig);

        expect(result).toBe('fr-FR');
    });

    it('should handle undefined navigator.languages and navigator.language', () => {
        Object.defineProperty(navigator, 'languages', {
            value: undefined,
            configurable: true,
        });
        Object.defineProperty(navigator, 'language', {
            value: undefined,
            configurable: true,
        });

        const result = resolveUserLocale(mockConfig);

        expect(result).toBe('en');
    });

    it('should prefer exact match over primary language match', () => {
        Object.defineProperty(navigator, 'languages', {
            value: ['en-GB', 'en'],
            configurable: true,
        });

        const result = resolveUserLocale(mockConfig);

        expect(result).toBe('en-GB');
    });

    it('should handle locales with different region codes', () => {
        Object.defineProperty(navigator, 'languages', {
            value: ['fr-HT'],
            configurable: true,
        });

        const result = resolveUserLocale(mockConfig);

        expect(result).toBe('fr-FR');
    });

    it('should handle empty navigator.languages and navigator.language', () => {
        Object.defineProperty(navigator, 'languages', {
            value: [],
            configurable: true,
        });
        Object.defineProperty(navigator, 'language', {
            value: '',
            configurable: true,
        });

        const result = resolveUserLocale(mockConfig);

        expect(result).toBe('en');
    });
});

describe('translate', () => {
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
        consoleWarnSpy.mockRestore();
    });

    it('should return the translation for a given key', () => {
        const result = translate(mockLocale, mockDictionary, 'welcome');
        expect(result).toBe(mockDictionary.welcome);
    });

    it('should return the translation for a given key in namespace', () => {
        const result = translate(mockLocale, mockDictionary, 'title', [], 'Home');
        expect(result).toBe('Welcome Home');
    });

    it('should use the fallbackKey when the main key is missing', () => {
        const result = translate(mockLocale, mockDictionary, 'missingKey', [], undefined, 'fallbackKey');
        expect(result).toBe('Fallback translation');
    });

    it('should handle pluralization correctly (singular)', () => {
        const result = translate(mockLocale, mockDictionary, 'items', { count: 1 });
        expect(result).toBe('You have one item');
    });

    it('should handle pluralization correctly (plural)', () => {
        const result = translate(mockLocale, mockDictionary, 'items', { count: 5 });
        expect(result).toBe('You have 5 items');
    });

    it('should interpolate parameters', () => {
        const result = translate(mockLocale, mockDictionary, 'greeting', { name: 'John' });
        expect(result).toBe('Hello John!');
    });

    it('should interpolate parameters in namespace', () => {
        const result = translate(mockLocale, mockDictionary, 'sales', { count: 1 }, 'Home');
        expect(result).toBe('Sale: 1 item left!');
    });

    it('should format date parameters', () => {
        const date = new Date('2023-01-01T00:00:00Z');
        const result = translate(mockLocale, mockDictionary, 'date', { date });
        expect(result).toBe('Today is January 1, 2023');
    });

    it('should format number parameters', () => {
        const result = translate(mockLocale, mockDictionary, 'number', { score: 12345 });
        expect(result).toBe('Your score is 12,345');
    });

    it('should format currency parameters', () => {
        const result = translate(mockLocale, mockDictionary, 'currency', { price: 99.99, currency: 'USD' });
        expect(result).toBe('Total price: $99.99');
    });

    it('should spy on console.warn correctly', () => {
        console.warn('Test warning');
        expect(consoleWarnSpy).toHaveBeenCalledWith('Test warning');
    });

    it('should warn and return key if count is missing for pluralization', () => {
        const result = translate(mockLocale, mockDictionary, 'items');
        expect(result).toBe('items');
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            "Missing 'count' parameter for pluralization in key 'items'."
        );
    });

    it('should handle missing parameters gracefully', () => {
        const result = translate(mockLocale, mockDictionary, 'greeting');
        expect(result).toBe(mockDictionary.greeting);
    });

    it('should use default plural form if pluralRule is missing', () => {
        const customDictionary: Dictionary = {
            items: {
                other: 'You have {{count}} items',
            },
        };
        const result = translate(mockLocale, customDictionary, 'items', { count: 1 });
        expect(result).toBe('You have 1 items');
    });

    it('should handle unknown format types as NONE', () => {
        const customDictionary: Dictionary = {
            unknownFormat: 'Value: {{value, unknown}}',
        };
        const result = translate(mockLocale, customDictionary, 'unknownFormat', { value: 'Test' });
        expect(result).toBe('Value: Test');
    });

    it('should warn if date parameter is not a Date object', () => {
        const result = translate(mockLocale, mockDictionary, 'date', { date: '2023-01-01' });
        expect(result).toBe('Today is 2023-01-01');
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            "Expected Date object for parameter 'date', received string."
        );
    });

    it('should warn if number parameter is not a number', () => {
        const result = translate(mockLocale, mockDictionary, 'number', { score: '12345' });
        expect(result).toBe('Your score is 12345');
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            "Expected number for parameter 'score', received string."
        );
    });

    it('should warn if currency parameter is not a number', () => {
        const result = translate(mockLocale, mockDictionary, 'currency', { price: '99.99', currency: 'USD' });
        expect(result).toBe('Total price: 99.99');
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            "Expected number for currency formatting on parameter 'price', received string."
        );
    });
});

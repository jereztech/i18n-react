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

export type Locale = string;
export type Namespace = string;
export type TranslationKey = string;
export type PluralRules = { [pluralRule: string]: string };
export type TranslationValue = string | PluralRules;

export type TranslationParams = {
    [key: string]: any;
}

/** 
 * @example
    const dictionary: Dictionary = {
        greeting: 'Hello {{name}}!',
        farewell: 'Goodbye',
        items: { // Pluralization.
            one: 'You have one item',
            other: 'You have {{count}} items',
        },
        home: { // With Namespace.
            title: 'Welcome Home',
            description: 'This is the home page.',
        },
    }; 
*/
export type Dictionary = {
    [key: TranslationKey | Namespace]: TranslationValue | {
        [key: TranslationKey]: TranslationValue // With Namespace.
    };
};

export type DictionaryMap = {
    [locale: Locale]: Dictionary;
};

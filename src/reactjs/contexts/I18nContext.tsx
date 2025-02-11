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

"use client";

import I18nConfig, { DEFAULT_CONFIG } from '@core/i18n-config';
import type { Dictionary, Locale } from '@core/types/i18n-types';
import { getDictionary, resolveUserLocale } from '@utils/i18nUtils';
import React, { createContext, useCallback, useEffect, useState, type PropsWithChildren } from 'react';

export interface I18nProviderProps extends PropsWithChildren {
    config?: I18nConfig;
};

export type I18nContextProps = {
    locale: Locale;
    supportedLocales: Locale[];
    setLocale: (locale: Locale) => void;
    dictionary: Dictionary;
};

const I18nContext = createContext<I18nContextProps>({
    locale: '',
    supportedLocales: [],
    setLocale: () => { },
    dictionary: {}
});

export const I18nProvider: React.FC<I18nProviderProps> = ({ children, config = DEFAULT_CONFIG }) => {

    const {
        defaultLocale,
        autodetectLanguage,
        initializeWithDefault,
        dictionaries
    } = Object.assign({}, DEFAULT_CONFIG, config);

    const supportedLocales = Object.keys(dictionaries);

    const [locale, setLocaleState] = useState('');
    const [dictionary, setDictionary] = useState({});
    const [initialized, setInitialized] = useState(false);

    /**
     * Sets the current locale and loads corresponding translations.
     * @param newLocale - The new locale to set.
     */
    const setLocale = useCallback((newLocale: Locale) => {
        if (newLocale === locale) return;
        const newDictionary = getDictionary(newLocale, config);
        setLocaleState(newLocale);
        setDictionary(newDictionary);
    }, [locale]);

    /**
     * Load translations using the user's language preferences in the browser if autodetectLanguage is true, 
     * otherwise load initial translations with defaultLocale.
     */
    useEffect(() => {
        const setUserLocale = () => {
            let userLocale = resolveUserLocale(config);
            setLocale(userLocale);
            setInitialized(true);
        };
        if (autodetectLanguage) {
            setUserLocale();
        } else if (initializeWithDefault) {
            const loadDefaultTranslations = () => {
                setLocale(defaultLocale);
                setInitialized(true);
            };
            loadDefaultTranslations();
        }
    }, []);

    if ((autodetectLanguage || initializeWithDefault) && !initialized) {
        return null;
    }

    return (
        <I18nContext.Provider value={{ locale, supportedLocales, setLocale, dictionary }}>
            {children}
        </I18nContext.Provider>
    );
};

export default I18nContext;

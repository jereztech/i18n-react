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

import type { Namespace, TranslationKey, TranslationParams } from '@core/types/i18n-types';
import { translate } from '@utils/i18nUtils';
import { useCallback, useContext } from 'react';
import I18nContext from '../contexts/I18nContext';

const useI18n = (namespace?: Namespace) => {

    const { dictionary, locale, setLocale, supportedLocales } = useContext(I18nContext);

    /**
     * Translates a given key with optional parameters.
     * @param key - The translation key.
     * @param params - Parameters for interpolation and formatting.
     * @param fallbackKey - The fallback key.
     * @returns The translated and formatted string.
     */
    const t = useCallback((key: TranslationKey, params?: TranslationParams, fallbackKey?: TranslationKey) =>
        translate(locale, dictionary, key, params, namespace, fallbackKey),
        [locale, namespace]
    );

    return { t, locale, setLocale, supportedLocales };
};

export default useI18n;

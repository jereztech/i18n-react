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

import type { Dictionary, Locale } from '@core/types/i18n-types';
import { renderHook } from '@testing-library/react';
import React from 'react';
import I18nContext from '../contexts/I18nContext';
import useI18n from './useI18n';

const mockLocale: Locale = 'en';
const mockDictionary: Dictionary = {
    greeting: 'Hello {{name}}!',
    Home: {
        title: 'Welcome',
    }
};

const wrapper: React.FC = ({ children }: { children?: React.ReactNode }) => (
    <I18nContext.Provider
        value={{
            locale: mockLocale,
            supportedLocales: [mockLocale],
            dictionary: mockDictionary,
            setLocale: jest.fn(),
        }}
    >
        {children}
    </I18nContext.Provider>
);

describe('useI18n', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return t function and locale', () => {
        const { result } = renderHook(() => useI18n(), { wrapper });

        expect(result.current.locale).toBe('en');
        expect(typeof result.current.t).toBe('function');
    });

    test('t function should call translate with correct arguments without namespace', () => {
        const { result } = renderHook(() => useI18n(), { wrapper });

        const translation = result.current.t('greeting', { name: 'John' });

        expect(translation).toBe('Hello John!');
    });

    test('t function should call translate with namespace', () => {
        const { result } = renderHook(() => useI18n('Home'), { wrapper });

        const translation = result.current.t('title');

        expect(translation).toBe('Welcome');
    });

    test('should memoize t function unless locale or namespace changes', () => {
        const { result, rerender } = renderHook(() => useI18n(), { wrapper });

        const initialT = result.current.t;

        // Rerender without changes
        rerender();

        expect(result.current.t).toBe(initialT);

        // Rerender with different namespace
        const { result: resultWithNamespace } = renderHook(() => useI18n('Home'), { wrapper });

        expect(resultWithNamespace.current.t).not.toBe(initialT);
    });
});

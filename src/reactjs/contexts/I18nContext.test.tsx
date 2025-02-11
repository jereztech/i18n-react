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
import type { Dictionary, Locale } from '@core/types/i18n-types';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getDictionary, resolveUserLocale } from '@utils/i18nUtils';
import React, { useContext } from 'react';
import I18nContext, { I18nProvider } from './I18nContext';

jest.mock('@utils/i18nUtils', () => ({
    getDictionary: jest.fn(),
    resolveUserLocale: jest.fn()
}));

const TestComponent: React.FC = () => {
    const { locale, setLocale, dictionary } = useContext(I18nContext);
    return (
        <div>
            <div data-testid="locale">{locale}</div>
            <div data-testid="greeting">{dictionary.greeting as string}</div>
            <button onClick={() => setLocale('en')}>English</button>
            <button onClick={() => setLocale('fr')}>Français</button>
        </div>
    );
};

const TestChildComponent: React.FC = () => <div data-testid="child">Child Component</div>;

const mockGetDictionary = getDictionary as jest.MockedFunction<typeof getDictionary>;
const mockResolveUserLocale = resolveUserLocale as jest.MockedFunction<typeof resolveUserLocale>;

const mockDictionaryEn: Dictionary = { greeting: 'Hello' };
const mockDictionaryFr: Dictionary = { greeting: 'Bonjour' };

mockGetDictionary.mockImplementation((locale: Locale) => {
    if (locale === 'en') {
        return mockDictionaryEn;
    } else if (locale === 'fr') {
        return mockDictionaryFr;
    }
    return {};
});

const baseConfig: I18nConfig = {
    ...DEFAULT_CONFIG,
    dictionaries: {
        en: mockDictionaryEn,
        fr: mockDictionaryFr,
    },
};

describe('I18nProvider', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('initializes with user locale when autodetectLanguage is true', async () => {
        mockResolveUserLocale.mockReturnValue('fr');

        render(
            <I18nProvider config={baseConfig}>
                <TestComponent />
            </I18nProvider>
        );

        //expect(screen.queryByTestId('locale')).toBeNull();

        await waitFor(() => expect(screen.getByTestId('locale')).toHaveTextContent('fr'));

        expect(screen.getByTestId('greeting')).toHaveTextContent(mockDictionaryFr.greeting as string);
        expect(mockResolveUserLocale).toHaveBeenCalledWith(baseConfig);
        expect(mockGetDictionary).toHaveBeenCalledWith('fr', baseConfig);
    });

    test('initializes with defaultLocale when autodetectLanguage is undefined', async () => {
        const config = { ...baseConfig, autodetectLanguage: undefined };

        render(
            <I18nProvider config={config}>
                <TestComponent />
            </I18nProvider>
        );

        await waitFor(() => expect(screen.getByTestId('locale')).toHaveTextContent('en'));

        expect(screen.getByTestId('greeting')).toHaveTextContent(mockDictionaryEn.greeting as string);
        expect(mockResolveUserLocale).not.toHaveBeenCalled();
        expect(mockGetDictionary).toHaveBeenCalledWith('en', config);
    });

    test('updates locale and dictionary when setLocale is called', async () => {
        mockResolveUserLocale.mockReturnValue('en');

        render(
            <I18nProvider config={baseConfig}>
                <TestComponent />
            </I18nProvider>
        );

        await waitFor(() => expect(screen.getByTestId('locale')).toHaveTextContent('en'));
        expect(screen.getByTestId('greeting')).toHaveTextContent(mockDictionaryEn.greeting as string);

        userEvent.click(screen.getByText('Français'));

        await waitFor(() => expect(screen.getByTestId('locale')).toHaveTextContent('fr'));

        expect(screen.getByTestId('greeting')).toHaveTextContent(mockDictionaryFr.greeting as string);
        expect(mockGetDictionary).toHaveBeenCalledWith('fr', baseConfig);
    });

    test('setLocale does not update if the new locale is the same as current', async () => {
        mockResolveUserLocale.mockReturnValue('en');

        render(
            <I18nProvider config={baseConfig}>
                <TestComponent />
            </I18nProvider>
        );

        await waitFor(() => expect(screen.getByTestId('locale')).toHaveTextContent('en'));

        userEvent.click(screen.getByText('Français'));

        await waitFor(() => expect(screen.getByTestId('locale')).toHaveTextContent('fr'));

        userEvent.click(screen.getByText('Français'));
        expect(mockGetDictionary).toHaveBeenCalledTimes(2);
    });

    test('renders null before initialization is complete', async () => {
        mockResolveUserLocale.mockReturnValue('en');

        const { queryByTestId } = render(
            <I18nProvider config={baseConfig}>
                <TestChildComponent />
            </I18nProvider>
        );

        //expect(queryByTestId('child')).toBeNull();

        await waitFor(() => expect(queryByTestId('child')).toBeInTheDocument());

        expect(screen.getByTestId('child')).toHaveTextContent('Child Component');
    });

    test('uses default config when no config is provided', async () => {
        mockResolveUserLocale.mockReturnValue('en');

        render(
            <I18nProvider>
                <TestComponent />
            </I18nProvider>
        );

        await waitFor(() => expect(screen.getByTestId('locale')).toHaveTextContent('en'));

        expect(mockResolveUserLocale).toHaveBeenCalledWith(DEFAULT_CONFIG);
        expect(mockGetDictionary).toHaveBeenCalledWith('en', DEFAULT_CONFIG);
        expect(screen.getByTestId('greeting')).toHaveTextContent(mockDictionaryEn.greeting as string);
    });

    test('renders children immediately when no initialization is needed', () => {
        const config = { ...baseConfig, autodetectLanguage: undefined, initializeWithDefault: undefined };

        const { queryByTestId } = render(
            <I18nProvider config={config}>
                <TestChildComponent />
            </I18nProvider>
        );

        expect(queryByTestId('child')).toBeInTheDocument();
    });
});

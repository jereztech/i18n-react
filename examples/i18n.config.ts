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

// @ts-ignore
import { DictionaryMap, I18nConfig } from "@jereztech/i18n-react";
// @ts-ignore
import en from './assets/dictionaries/en.json';
// @ts-ignore
import es from './assets/dictionaries/es.json';

const dictionaries: DictionaryMap = { en, es };

const i18nConfig: I18nConfig = {
    defaultLocale: 'en',
    dictionaries,
};

export default i18nConfig;
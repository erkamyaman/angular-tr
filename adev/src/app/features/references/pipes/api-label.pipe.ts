/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {Pipe, PipeTransform} from '@angular/core';

import {ApiItemType} from '../interfaces/api-item-type';

@Pipe({
  name: 'adevApiLabel',
})
export class ApiLabel implements PipeTransform {
  transform(value: ApiItemType, labelType: 'short' | 'full'): string {
    return labelType === 'full' ? fullLabelsMap[value] : shortLabelsMap[value];
  }
}

export const shortLabelsMap: Record<ApiItemType, string> = {
  [ApiItemType.BLOCK]: 'B',
  [ApiItemType.CLASS]: 'C',
  [ApiItemType.CONST]: 'K',
  [ApiItemType.DECORATOR]: '@',
  [ApiItemType.DIRECTIVE]: 'D',
  [ApiItemType.ELEMENT]: 'El',
  [ApiItemType.ENUM]: 'E',
  [ApiItemType.FUNCTION]: 'F',
  [ApiItemType.INTERFACE]: 'I',
  [ApiItemType.PIPE]: 'P',
  [ApiItemType.NG_MODULE]: 'M',
  [ApiItemType.TYPE_ALIAS]: 'T',
  [ApiItemType.INITIALIZER_API_FUNCTION]: 'IA',
};

export const fullLabelsMap: Record<ApiItemType, string> = {
  [ApiItemType.BLOCK]: 'Blok',
  [ApiItemType.CLASS]: 'Sınıf',
  [ApiItemType.CONST]: 'Sabit',
  [ApiItemType.DECORATOR]: 'Dekoratör',
  [ApiItemType.DIRECTIVE]: 'Direktif',
  [ApiItemType.ELEMENT]: 'Eleman',
  [ApiItemType.ENUM]: 'Enum',
  [ApiItemType.FUNCTION]: 'Fonksiyon',
  [ApiItemType.INTERFACE]: 'Arayüz',
  [ApiItemType.PIPE]: 'Pipe',
  [ApiItemType.NG_MODULE]: 'Modül',
  [ApiItemType.TYPE_ALIAS]: 'Tür Takma Adı',
  [ApiItemType.INITIALIZER_API_FUNCTION]: 'Başlatıcı API',
};

import type { Field, DisplayValue } from '@grafana/data';
import { FieldType } from '@grafana/data';
import mean from 'lodash/mean';

export const getValueField = (field: Field) => field.type === FieldType.number;

export const getMeanValue = (valueField: Field) => {
  return valueField.state?.calcs?.mean ?? mean(valueField.values.toArray());
};

export const formatDisplayValue = (displayValue: DisplayValue) => {
  return displayValue.text + (displayValue.suffix ?? '');
};

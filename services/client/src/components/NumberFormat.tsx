import * as React from "react";
import ReactNumberFormat from "react-number-format";
import type { ChangeEvent } from "react";
import type { NumberFormatProps as OriginalNumberFormatProps } from "react-number-format";
import type { Except } from "type-fest";

export interface NumberFormatProps extends Except<OriginalNumberFormatProps, "onValueChange"> {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

function NumberFormat({ id, inputRef, name, onChange, ...restProps }: NumberFormatProps) {
  return (
    <ReactNumberFormat
      {...restProps}
      // Sweden only use 2 decimal places
      decimalScale={2}
      // Sweden uses ',' instead of '.' for decimal formatting (from 'en-SE')
      decimalSeparator=","
      fixedDecimalScale
      getInputRef={inputRef}
      id={id}
      name={name}
      onValueChange={(values) => {
        // Here we force cast to a change event and mimic it's behaviour (for unified API),
        // as react-number-format's change handlers does not provide a bind event.
        onChange?.({
          target: {
            name,
            id,
            // Default to 0 in the case of a malformed input
            value: values.floatValue?.toString() || "0"
          }
        } as ChangeEvent<HTMLInputElement>);
      }}
      // Sweden uses ' ' instead of ',' for thousand separator (from 'en-SE')
      thousandSeparator=" "
    />
  );
}

export default NumberFormat;

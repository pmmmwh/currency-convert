import * as React from "react";
import { TableCell, TableHead, TableRow } from "@material-ui/core";
import type { ListCell } from "./types";

export interface ListTableHeadProps {
  cells: ListCell[];
}

function ListTableHead({ cells }: ListTableHeadProps) {
  return (
    <TableHead>
      <TableRow>
        {cells.map(({ id, label, numeric }) => (
          <TableCell align={numeric ? "right" : "left"} key={id}>
            {label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default ListTableHead;

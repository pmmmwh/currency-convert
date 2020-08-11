import * as React from 'react';
import { TableBody, TableCell, TableRow } from '@material-ui/core';
import type { ListCell, ListTableDataRow } from './types';

interface ListTableBodyProps<Data extends ListTableDataRow[]> {
  cells: ListCell[];
  data: Data;
}

function ListTableBody<Data extends ListTableDataRow[]>({ cells, data }: ListTableBodyProps<Data>) {
  return (
    <TableBody>
      {data.map((row) => (
        <TableRow hover key={row.name} tabIndex={-1}>
          {cells.map(({ id, numeric }, cellIndex) => (
            <TableCell
              align={numeric ? 'right' : 'left'}
              key={id}
              // Make the first table cell the row header
              {...(cellIndex === 0 && {
                component: 'th',
                id: `country-${row.name}`,
                scope: 'row',
              })}
            >
              {row[id]}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}

export default ListTableBody;

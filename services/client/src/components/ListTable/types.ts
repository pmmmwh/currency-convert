export interface ListCell {
  id: string;
  label: string;
  numeric?: boolean;
}

export interface ListTableDataRow {
  name: string;

  // Explicitly set any here for extensibility of this interface
  [key: string]: any;
}

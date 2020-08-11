import type { JsonObject, Primitive } from "type-fest";

export type ComparatorFn<Key extends keyof JsonObject> = (
  first: { [key in Key]: Primitive },
  second: { [key in Key]: Primitive }
) => number;

export type SortOrder = "asc" | "desc";

function ascComparator<T>(first: T, second: T, orderBy: keyof T) {
  if (second[orderBy] < first[orderBy]) {
    return 1;
  }
  if (second[orderBy] > first[orderBy]) {
    return -1;
  }
  return 0;
}

export function getComparator<OrderBy extends keyof JsonObject>(
  order: SortOrder,
  orderBy: OrderBy
): ComparatorFn<OrderBy> {
  return order === "asc"
    ? (first, second) => ascComparator(first, second, orderBy)
    : (first, second) => -ascComparator(first, second, orderBy);
}

export default function stableSort<Item>(
  array: Item[],
  comparator: (first: Item, second: Item) => -1 | 0 | 1
) {
  // Array keys are used as a tie breaker.
  // This is a workaround to pre-ES2019 non-stable array sorting,
  // preserving the original order if comparator returns 0.
  const stabilizedArray: Array<[Item, number]> = array.map((x, index) => [x, index]);
  stabilizedArray.sort((first, second) => {
    const order = comparator(first[0], second[0]);
    if (order !== 0) {
      return order;
    }

    return first[1] - second[1];
  });

  return stabilizedArray.map((x) => x[0]);
}

function uniqBy<Item, Property extends PropertyKey>(
  array: Item[],
  getProperty: (x: Item) => Property
): Item[] {
  // For efficiency, we will utilize a "hash map" during unique.
  // It removes the need for array findIndex lookups.
  // Note: this is only possible as we're dealing with primitives.
  const seen: Record<PropertyKey, unknown> = {};
  return array.filter((item) => {
    const key = getProperty(item);
    if (!seen.hasOwnProperty(key)) {
      seen[key] = true;
      return true;
    }

    return false;
  });
}

export default uniqBy;

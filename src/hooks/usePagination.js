import { useState } from "react";

export function usePagination(items, itemsPerPage = 10) {
  const [page, setPage] = useState(1);

  const visibleItems = items.slice(0, page * itemsPerPage);
  const hasMore = visibleItems.length < items.length;

  function loadMore() {
    setPage(p => p + 1);
  }

  function reset() {
    setPage(1);
  }

  return { visibleItems, hasMore, loadMore, reset };
}
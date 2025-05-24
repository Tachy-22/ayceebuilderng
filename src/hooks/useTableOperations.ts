import { useState, useMemo } from "react";

interface UseTableOperationsProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  itemsPerPage?: number;
  defaultSortField?: keyof T;
  defaultSortDirection?: "asc" | "desc";
}

type SortDirection = "asc" | "desc";

export function useTableOperations<T>({
  data,
  searchFields,
  itemsPerPage = 10,
  defaultSortField,
  defaultSortDirection = "desc",
}: UseTableOperationsProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pageSize, setPageSize] = useState(itemsPerPage);
  const [sortField, setSortField] = useState<keyof T | null>(
    defaultSortField || null
  );
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(defaultSortDirection);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [customFilters, setCustomFilters] = useState<Record<string, string>>(
    {}
  );
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Status filter
      if (statusFilter !== "all") {
        const status =
          (item as { approved?: boolean; replied?: boolean }).approved ??
          (item as { approved?: boolean; replied?: boolean }).replied;
        if (statusFilter === "true" && !status) return false;
        if (statusFilter === "false" && status) return false;
      } // Category filter (if available)
      if (
        categoryFilter !== "all" &&
        typeof item === "object" &&
        item !== null &&
        "category" in item
      ) {
        const category = String(item["category"]).toLowerCase();
        if (category !== categoryFilter.toLowerCase()) return false;
      }

      // Custom filters for other fields
      for (const [key, value] of Object.entries(customFilters)) {
        if (
          value !== "all" &&
          typeof item === "object" &&
          item !== null &&
          key in item
        ) {
          const itemValue = String(item[key as keyof T]).toLowerCase();
          if (itemValue !== value.toLowerCase()) return false;
        }
      }

      // Search filter
      if (!searchQuery) return true;

      return searchFields.some((field) => {
        const value = String(item[field])?.toLowerCase();
        return value?.includes(searchQuery.toLowerCase());
      });
    });
  }, [
    data,
    searchQuery,
    statusFilter,
    categoryFilter,
    customFilters,
    searchFields,
  ]);
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Handle dates specially
      if (
        sortField === "date" ||
        sortField === "createdAt" ||
        sortField === "updatedAt"
      ) {
        const aDate = new Date(aValue as string | number | Date);
        const bDate = new Date(bValue as string | number | Date);

        return sortDirection === "asc"
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }

      // Handle strings and other types
      if (aValue === bValue) return 0;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Fallback for numbers and other types
      if (aValue === null || aValue === undefined)
        return sortDirection === "asc" ? -1 : 1;
      if (bValue === null || bValue === undefined)
        return sortDirection === "asc" ? 1 : -1;

      return sortDirection === "asc"
        ? aValue < bValue
          ? -1
          : 1
        : bValue < aValue
        ? -1
        : 1;
    });
  }, [filteredData, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  return {
    paginatedData,
    totalPages,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    pageSize,
    setPageSize,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    categoryFilter,
    setCategoryFilter,
    customFilters,
    setCustomFilters,
    // Helper function to toggle sort
    toggleSort: (field: keyof T) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
  };
}

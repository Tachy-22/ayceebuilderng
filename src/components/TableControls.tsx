import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Filter, Search, X } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface TableControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showStatusFilter?: boolean;
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  sortField?: string | null;
  sortDirection?: "asc" | "desc";
  onSort?: (field: string) => void;
  categories?: string[];
  categoryFilter?: string;
  onCategoryFilterChange?: (value: string) => void;
  customFilters?: Record<string, string>;
  onCustomFilterChange?: (field: string, value: string) => void;
  filterOptions?: Record<string, string[]>;
}

export function SearchControls({
  searchQuery,
  onSearchChange,
  showStatusFilter,
  statusFilter,
  onStatusFilterChange,
  categories,
  categoryFilter,
  onCategoryFilterChange,
  customFilters,
  onCustomFilterChange,
  filterOptions,
}: Omit<
  TableControlsProps,
  | "currentPage"
  | "totalPages"
  | "onPageChange"
  | "pageSize"
  | "onPageSizeChange"
  | "sortField"
  | "sortDirection"
  | "onSort"
>) {
  const [showFilters, setShowFilters] = useState(false);

  // Count active filters
  const activeFilterCount = [
    categoryFilter !== "all" ? 1 : 0,
    statusFilter !== "all" && showStatusFilter ? 1 : 0,
    ...Object.values(customFilters || {}).map((val) => (val !== "all" ? 1 : 0)),
  ].reduce((sum, val) => sum + val, 0);

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div className="relative flex-1 min-w-[300px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-9 rounded-xl border-gray-200 focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 text-gray-900 placeholder:text-gray-400 placeholder:text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex gap-2 items-center">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 h-10 rounded-xl"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 bg-black text-white">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {showStatusFilter && (
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[180px] rounded-xl">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Approved/Replied</SelectItem>
              <SelectItem value="false">Pending</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {showFilters && (
        <div className="w-full flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200 mt-2">
          {categories && categories.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <Select
                value={categoryFilter}
                onValueChange={onCategoryFilterChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {filterOptions &&
            Object.entries(filterOptions).map(([field, options]) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <Select
                  value={customFilters?.[field] || "all"}
                  onValueChange={(value) =>
                    onCustomFilterChange?.(field, value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={`All ${field}s`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{`All ${field}s`}</SelectItem>
                    {options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="self-end mt-2"
              onClick={() => {
                onCategoryFilterChange?.("all");
                if (showStatusFilter) onStatusFilterChange?.("all");
                if (onCustomFilterChange) {
                  Object.keys(customFilters || {}).forEach((field) => {
                    onCustomFilterChange(field, "all");
                  });
                }
              }}
            >
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
}: Pick<
  TableControlsProps,
  | "currentPage"
  | "totalPages"
  | "onPageChange"
  | "pageSize"
  | "onPageSizeChange"
>) {
  return (
    <div className="flex  flex-col gap-3 lg:flex-row lg:items-center justify-between border-t border-gray-200 px- py-3 sm:px-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Rows per page:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(v) => onPageSizeChange(Number(v))}
        >
          <SelectTrigger className="w-[70px] rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-xl"
        >
          Previous
        </Button>
        <span className="text-sm text-gray-700 text-nowrap">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-xl"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

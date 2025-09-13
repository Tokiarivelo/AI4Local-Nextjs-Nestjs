'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronUp,
  ChevronDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Check,
  Minus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { TableColumn, TableAction, BulkAction } from '@/types/dashboard';

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  bulkActions?: BulkAction<T>[];
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  sorting?: {
    column: string;
    direction: 'asc' | 'desc';
    onSort: (column: string, direction: 'asc' | 'desc') => void;
  };
  selection?: {
    selected: string[];
    onSelect: (ids: string[]) => void;
    getRowId: (row: T) => string;
  };
  className?: string;
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  actions = [],
  bulkActions = [],
  loading = false,
  pagination,
  sorting,
  selection,
  className,
  emptyMessage = 'Aucune donnée disponible',
}: DataTableProps<T>) {
  const [localSorting, setLocalSorting] = useState<{
    column: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const sortedData = useMemo(() => {
    const currentSort = sorting || localSorting;
    if (!currentSort) return data;

    return [...data].sort((a, b) => {
      const column = columns.find((col) => col.key === currentSort.column);
      if (!column) return 0;

      const aValue = (a as any)[column.key];
      const bValue = (b as any)[column.key];

      if (aValue < bValue) return currentSort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return currentSort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, columns, sorting, localSorting]);

  const handleSort = (column: string) => {
    const currentSort = sorting || localSorting;
    const isCurrentColumn = currentSort?.column === column;
    const newDirection =
      isCurrentColumn && currentSort.direction === 'asc' ? 'desc' : 'asc';

    if (sorting) {
      sorting.onSort(column, newDirection);
    } else {
      setLocalSorting({ column, direction: newDirection });
    }
  };

  const isAllSelected = selection
    ? data.length > 0 &&
      data.every((row) => selection.selected.includes(selection.getRowId(row)))
    : false;

  const isIndeterminate = selection
    ? selection.selected.length > 0 && !isAllSelected
    : false;

  const handleSelectAll = () => {
    if (!selection) return;

    if (isAllSelected) {
      selection.onSelect([]);
    } else {
      selection.onSelect(data.map(selection.getRowId));
    }
  };

  const handleSelectRow = (rowId: string) => {
    if (!selection) return;

    const newSelected = selection.selected.includes(rowId)
      ? selection.selected.filter((id) => id !== rowId)
      : [...selection.selected, rowId];

    selection.onSelect(newSelected);
  };

  const selectedRows = selection
    ? data.filter((row) => selection.selected.includes(selection.getRowId(row)))
    : [];

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Bulk actions bar */}
      {selection && selection.selected.length > 0 && (
        <div className='flex items-center justify-between p-3 bg-muted/50 rounded-lg border'>
          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium'>
              {selection.selected.length} élément(s) sélectionné(s)
            </span>
          </div>
          <div className='flex items-center space-x-2'>
            {bulkActions.map((action, index) => (
              <Button
                key={index}
                variant={
                  action.variant === 'destructive' ? 'destructive' : 'outline'
                }
                size='sm'
                onClick={() => action.onClick(selectedRows)}
                disabled={action.disabled?.(selectedRows)}
              >
                {action.label}
              </Button>
            ))}
            <Button
              variant='ghost'
              size='sm'
              onClick={() => selection.onSelect([])}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className='rounded-lg border bg-card'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='border-b bg-muted/30'>
              <tr>
                {selection && (
                  <th className='w-10 p-4'>
                    <Checkbox
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate;
                      }}
                      onCheckedChange={handleSelectAll}
                      aria-label='Sélectionner tout'
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      'text-left p-4 font-medium text-muted-foreground',
                      column.width && `w-${column.width}`,
                      column.sortable && 'cursor-pointer hover:text-foreground'
                    )}
                    onClick={
                      column.sortable ? () => handleSort(column.key) : undefined
                    }
                  >
                    <div className='flex items-center space-x-1'>
                      <span>{column.label}</span>
                      {column.sortable && (
                        <div className='flex flex-col'>
                          <ChevronUp
                            className={cn(
                              'w-3 h-3',
                              (sorting || localSorting)?.column ===
                                column.key &&
                                (sorting || localSorting)?.direction === 'asc'
                                ? 'text-foreground'
                                : 'text-muted-foreground/50'
                            )}
                          />
                          <ChevronDown
                            className={cn(
                              'w-3 h-3 -mt-1',
                              (sorting || localSorting)?.column ===
                                column.key &&
                                (sorting || localSorting)?.direction === 'desc'
                                ? 'text-foreground'
                                : 'text-muted-foreground/50'
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className='w-10 p-4'>
                    <span className='sr-only'>Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (selection ? 1 : 0) +
                      (actions.length > 0 ? 1 : 0)
                    }
                    className='p-8 text-center text-muted-foreground'
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                sortedData.map((row, index) => {
                  const rowId = selection
                    ? selection.getRowId(row)
                    : index.toString();
                  const isSelected = selection
                    ? selection.selected.includes(rowId)
                    : false;

                  return (
                    <tr
                      key={rowId}
                      className={cn(
                        'border-b hover:bg-muted/30 transition-colors',
                        isSelected && 'bg-muted/50'
                      )}
                    >
                      {selection && (
                        <td className='p-4'>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleSelectRow(rowId)}
                            aria-label={`Sélectionner la ligne ${index + 1}`}
                          />
                        </td>
                      )}
                      {columns.map((column) => (
                        <td key={column.key} className='p-4'>
                          {column.render
                            ? column.render((row as any)[column.key], row)
                            : (row as any)[column.key]}
                        </td>
                      ))}
                      {actions.length > 0 && (
                        <td className='p-4'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='w-8 h-8 p-0'
                              >
                                <MoreVertical className='w-4 h-4' />
                                <span className='sr-only'>Ouvrir le menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              {actions.map((action, actionIndex) => {
                                if (action.hidden?.(row)) return null;

                                return (
                                  <DropdownMenuItem
                                    key={actionIndex}
                                    onClick={() => action.onClick(row)}
                                    className={cn(
                                      action.variant === 'destructive' &&
                                        'text-destructive focus:text-destructive'
                                    )}
                                  >
                                    {action.label}
                                  </DropdownMenuItem>
                                );
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && <TablePagination {...pagination} />}
    </div>
  );
}

function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className='flex items-center justify-between px-2'>
      <div className='flex items-center space-x-2'>
        <p className='text-sm text-muted-foreground'>
          Affichage de {startItem} à {endItem} sur {total} éléments
        </p>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className='text-sm border rounded px-2 py-1'
        >
          <option value={10}>10 par page</option>
          <option value={25}>25 par page</option>
          <option value={50}>50 par page</option>
          <option value={100}>100 par page</option>
        </select>
      </div>

      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(1)}
          disabled={page === 1}
        >
          <ChevronsLeft className='w-4 h-4' />
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className='w-4 h-4' />
        </Button>
        <span className='text-sm font-medium px-2'>
          Page {page} sur {totalPages}
        </span>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          <ChevronRight className='w-4 h-4' />
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
        >
          <ChevronsRight className='w-4 h-4' />
        </Button>
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='rounded-lg border bg-card'>
        <div className='overflow-hidden'>
          <div className='border-b bg-muted/30 p-4'>
            <div className='flex items-center space-x-4'>
              <div className='w-4 h-4 bg-muted rounded animate-pulse' />
              <div className='w-24 h-4 bg-muted rounded animate-pulse' />
              <div className='w-32 h-4 bg-muted rounded animate-pulse' />
              <div className='w-20 h-4 bg-muted rounded animate-pulse' />
              <div className='w-16 h-4 bg-muted rounded animate-pulse' />
            </div>
          </div>
          <div className='divide-y'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='p-4'>
                <div className='flex items-center space-x-4'>
                  <div className='w-4 h-4 bg-muted rounded animate-pulse' />
                  <div className='w-24 h-4 bg-muted rounded animate-pulse' />
                  <div className='w-32 h-4 bg-muted rounded animate-pulse' />
                  <div className='w-20 h-4 bg-muted rounded animate-pulse' />
                  <div className='w-16 h-4 bg-muted rounded animate-pulse' />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { DataTable as default };

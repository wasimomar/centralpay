import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Laptop,
  ArrowDownLeft,
  ArrowUpRight,
  SearchX,
} from "lucide-react";

import { getSenderIcon } from "../../utils/getSenderIcon";
import { cn } from "../../utils/cn";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "../ui/table";
import { Button } from "../ui/button";

export interface Transaction {
  _id: string;
  sender: string;
  amount: number;
  date: string;
  type: "sent" | "received";
  device: string;
}

interface Props {
  data: Transaction[];
  newTransactionId?: string | null;
  loading?: boolean;
}

const getTransactionKey = (t: Transaction) =>
  `${t._id}-${t.sender}-${t.amount}-${t.date}-${t.device}-${t.type}`;

export default function TransactionsDataTable({
  data,
  newTransactionId,
  loading,
}: Props) {
  const [sorting, setSorting] = useState<any>([]);

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "sender",
      header: "Sender",
      cell: (info) => {
        const sender = info.getValue() as string;
        return (
          <div className="flex items-center gap-3">
            <img
              src={getSenderIcon(sender)}
              alt={sender}
              className="w-9 h-9 rounded-full object-cover border border-[var(--border-card)] shadow-sm"
            />
            <span className="font-semibold text-[var(--text-primary)]">
              {sender}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="flex items-center gap-1.5 font-bold">
            {row.type === "sent" ? (
              <span className="text-rose-500"><ArrowUpRight size={15} /></span>
            ) : (
              <span className="text-emerald-500"><ArrowDownLeft size={15} /></span>
            )}
            <span className={row.type === "sent" ? "text-rose-500" : "text-emerald-600"}>
              {row.type === "sent" ? "-" : "+"} {row.amount.toLocaleString()} EGP
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: (info) => {
        const value = info.getValue() as string;
        return (
          <span
            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
            style={{
              backgroundColor: value === "sent" ? "var(--bg-badge-sent)" : "var(--bg-badge-received)",
              color: value === "sent" ? "var(--text-badge-sent)" : "var(--text-badge-received)",
              borderColor: value === "sent" ? "var(--border-badge-sent)" : "var(--border-badge-received)",
            }}
          >
            {value}
          </span>
        );
      },
    },
    {
      accessorKey: "device",
      header: "Device",
      cell: (info) => (
        <span className="text-[var(--text-secondary)] flex items-center gap-1.5 font-medium">
          <Laptop size={14} className="text-[var(--text-muted)]" />
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: (info) => {
        const date = new Date(info.getValue() as string);
        return (
          <div className="text-sm whitespace-nowrap">
            <div className="text-[var(--text-primary)] font-medium">
              {date.toLocaleDateString("en-GB")}
            </div>
            <div className="text-[var(--text-secondary)] text-xs mt-0.5">
              {date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row._id,
    autoResetPageIndex: false,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="bg-[var(--bg-card)] p-6 rounded-2xl shadow-xl border border-[var(--border-card)] text-[var(--text-primary)]">
        <div className="overflow-hidden rounded-xl border border-[var(--border-card)]">
          <Table>
            <TableHeader className="bg-[var(--bg-table-header)]">
              <TableRow>
                <TableHead className="w-1/4"><div className="skeleton-shimmer h-4 w-16" /></TableHead>
                <TableHead className="w-1/5"><div className="skeleton-shimmer h-4 w-16" /></TableHead>
                <TableHead className="w-1/6"><div className="skeleton-shimmer h-4 w-12" /></TableHead>
                <TableHead className="w-1/5"><div className="skeleton-shimmer h-4 w-16" /></TableHead>
                <TableHead className="w-1/5"><div className="skeleton-shimmer h-4 w-20" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(6)].map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="skeleton-shimmer h-9 w-9 rounded-full shrink-0" />
                      <div className="skeleton-shimmer h-4 w-28 rounded-md" />
                    </div>
                  </TableCell>
                  <TableCell><div className="skeleton-shimmer h-4 w-20 rounded-md" /></TableCell>
                  <TableCell><div className="skeleton-shimmer h-6 w-16 rounded-full" /></TableCell>
                  <TableCell><div className="skeleton-shimmer h-4 w-24 rounded-md" /></TableCell>
                  <TableCell>
                    <div>
                      <div className="skeleton-shimmer h-4 w-20 rounded-md mb-1" />
                      <div className="skeleton-shimmer h-3.5 w-12 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="skeleton-shimmer h-10 w-24 rounded-xl" />
          <div className="skeleton-shimmer h-4 w-32 rounded-md" />
          <div className="skeleton-shimmer h-10 w-24 rounded-xl" />
        </div>
      </div>
    );
  }

  const rows = table.getRowModel().rows;

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl shadow-xl border border-[var(--border-card)] overflow-hidden text-[var(--text-primary)]">
      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[var(--bg-table-header)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-b border-[var(--border-card)]"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="cursor-pointer select-none group"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <span className="transition-all opacity-0 group-hover:opacity-100">
                        {{
                          asc: <ArrowUp size={13} className="text-emerald-600" />,
                          desc: <ArrowDown size={13} className="text-emerald-600" />,
                        }[header.column.getIsSorted() as string] ?? (
                          <ArrowUpDown size={12} className="text-[var(--text-muted)]" />
                        )}
                      </span>
                      {header.column.getIsSorted() && (
                        <span className="block group-hover:hidden">
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUp size={13} className="text-emerald-600 font-bold" />
                          ) : (
                            <ArrowDown size={13} className="text-emerald-600 font-bold" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="divide-y divide-[var(--border-card)]">
            {rows.map((row) => {
              const isNew = getTransactionKey(row.original) === newTransactionId;
              return (
                <TableRow
                  key={row.id}
                  className={cn(
                    "transition-all duration-200",
                    isNew
                      ? "bg-emerald-500/10 animate-highlight"
                      : "hover:bg-[var(--bg-table-hover)]"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* ── Empty State ── */}
      {rows.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center justify-center py-16 px-6 text-center"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-inner"
            style={{ background: "var(--bg-table-header)" }}
          >
            <SearchX size={28} className="text-[var(--text-muted)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
            No transactions found
          </h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-xs">
            No transactions match your current filters. Try adjusting or resetting the filters to see results.
          </p>
        </motion.div>
      )}

      {/* ── Pagination ── */}
      {rows.length > 0 && (
        <div className="flex justify-between items-center px-6 py-4 border-t border-[var(--border-card)]">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="gap-1 px-3 border-[var(--border-card)] bg-[var(--bg-card)] hover:bg-[var(--bg-table-hover)] hover:text-[var(--text-primary)] text-[var(--text-secondary)]"
          >
            ← Previous
          </Button>

          <span className="text-sm text-[var(--text-secondary)] font-medium">
            Page{" "}
            <span className="text-[var(--text-primary)] font-semibold">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of{" "}
            <span className="text-[var(--text-primary)] font-semibold">
              {table.getPageCount()}
            </span>
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="gap-1 px-3 border-[var(--border-card)] bg-[var(--bg-card)] hover:bg-[var(--bg-table-hover)] hover:text-[var(--text-primary)] text-[var(--text-secondary)]"
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}
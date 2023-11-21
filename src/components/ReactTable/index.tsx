import React from 'react'

import { Box, styled } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'

import {
    Column,
    Table as ReactTable,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getExpandedRowModel,
    ColumnDef,
    flexRender,
    PaginationState,
    OnChangeFn,
} from '@tanstack/react-table'

import TablePaginationActions from './actions'
import Loader from '../Loader'
// import { makeData, Person } from './makeData'

const TD = styled(TableCell)({
    minHeight: "52px",
    padding: 10,
    textAlign: "center",
})

const TH = styled(TableCell)({
    backgroundColor: "#F0F3FF",
    color: "#2C6EF2",
    textAlign: "center",
})

export default function LocalTable({
    loading,
    data,
    columns,
    renderSubComponent,
    getRowCanExpand,
    pagination,
    setPagination,
    rowCount
}: {
    loading: boolean,
    data: any[]
    columns: ColumnDef<any>[],
    renderSubComponent: any,
    getRowCanExpand: any,
    pagination: { pageIndex: number, pageSize: number },
    setPagination: any,
    rowCount: number;
}) {
    const table = useReactTable({
        data,
        pageCount: rowCount,
        columns,
        getRowCanExpand,
        manualPagination: true,
        state: {
            pagination,
        },
        onPaginationChange: (e: any) => {
            const p = e({ pageIndex, pageSize });
            setPagination(p);
        },
        getExpandedRowModel: getExpandedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        //
        debugTable: true,
    })

    const { pageSize, pageIndex } = table.getState().pagination

    return (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TH key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder ? null : (
                                                <div>
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                </div>
                                            )}
                                        </TH>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody>
                        {!loading && table.getRowModel().rows.length === 0 && <TableRow>
                            <TableCell rowSpan={pageSize} colSpan={columns.length} align="center">
                                Now rows
                            </TableCell>
                        </TableRow>}
                        {loading && <TableRow>
                            <TableCell rowSpan={pageSize} colSpan={columns.length} align="center">
                                <Loader minHeight={pageSize * 20} />
                            </TableCell>
                        </TableRow>}
                        {!loading && table.getRowModel().rows.map(row => {
                            return (
                                <>
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map(cell => {
                                            return (
                                                <TD key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TD>
                                            )
                                        })}

                                    </TableRow>
                                    {row.getIsExpanded() && (
                                        <TableRow>
                                            <TD colSpan={row.getVisibleCells().length} sx={{ p: 0 }}>
                                                {renderSubComponent({ row })}
                                            </TD>
                                        </TableRow>
                                    )}
                                </>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: data.length }]}
                component="div"
                count={table.getPageCount()}
                rowsPerPage={pageSize}
                page={pageIndex}
                SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                }}
                onPageChange={(_, page) => {
                    table.setPageIndex(page)
                }}
                onRowsPerPageChange={e => {
                    const size = e.target.value ? Number(e.target.value) : 10
                    table.setPageSize(size)
                }}
                ActionsComponent={TablePaginationActions}
            />
        </Box >
    )
}

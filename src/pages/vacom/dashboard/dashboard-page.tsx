import React from 'react'
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    CellContext,
} from '@tanstack/react-table'
import { faker } from '@faker-js/faker'

const EditableCell = React.memo(function EditableCell({ getValue, row: { index }, column: { id }, table }: CellContext<Person, unknown>) {
    const initialValue = getValue()
    const [value, setValue] = React.useState(initialValue)

    const onBlur = () => {
        table.options.meta?.updateData(index, id, value)
    }

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    return (
        <input
            value={value as string}
            onChange={e => setValue(e.target.value)}
            onBlur={onBlur}
            className="border p-1 w-full"
        />
    )
})
// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<Person>> = {
    cell: (props) => <EditableCell {...props} />
}

function useSkipper() {
    const shouldSkipRef = React.useRef(true)
    const shouldSkip = shouldSkipRef.current

    // Wrap a function with this to skip a pagination reset temporarily
    const skip = React.useCallback(() => {
        shouldSkipRef.current = false
    }, [])

    React.useEffect(() => {
        shouldSkipRef.current = true
    })

    return [shouldSkip, skip] as const
}

export function DashboardPage() {
    const columns = React.useMemo<ColumnDef<Person>[]>(
        () => [
            {
                header: 'Name',
                footer: props => props.column.id,
                columns: [
                    {
                        accessorKey: 'firstName',
                        footer: props => props.column.id,
                    },
                    {
                        accessorFn: row => row.lastName,
                        id: 'lastName',
                        header: () => <span>Last Name</span>,
                        footer: props => props.column.id,
                    },
                ],
            },
            {
                header: 'Info',
                footer: props => props.column.id,
                columns: [
                    {
                        accessorKey: 'age',
                        header: () => 'Age',
                        footer: props => props.column.id,
                    },
                    {
                        header: 'More Info',
                        columns: [
                            {
                                accessorKey: 'visits',
                                header: () => <span>Visits</span>,
                                footer: props => props.column.id,
                            },
                            {
                                accessorKey: 'status',
                                header: 'Status',
                                footer: props => props.column.id,
                            },
                            {
                                accessorKey: 'progress',
                                header: 'Profile Progress',
                                footer: props => props.column.id,
                            },
                        ],
                    },
                ],
            },
        ],
        []
    )

    const [data, setData] = React.useState(() => makeData(1000))

    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

    const table = useReactTable({
        data,
        columns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex,
        // Provide our updateData function to our table meta
        meta: {
            updateData: (rowIndex, columnId, value) => {
                // Skip page index reset until after next rerender
                skipAutoResetPageIndex()
                setData(old =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...old[rowIndex]!,
                                [columnId]: value,
                            }
                        }
                        return row
                    })
                )
            },
        },
        debugTable: true,
    })

    return (
        <div className="p-2">
            <div className="h-2" />
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <div>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}

                                            </div>
                                        )}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => {
                        return (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
export type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    progress: number
    status: 'relationship' | 'complicated' | 'single'
    subRows?: Person[]
}

const range = (len: number) => {
    const arr: number[] = []
    for (let i = 0; i < len; i++) {
        arr.push(i)
    }
    return arr
}

const newPerson = (): Person => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        age: faker.number.int(40),
        visits: faker.number.int(1000),
        progress: faker.number.int(100),
        status: faker.helpers.shuffle<Person['status']>([
            'relationship',
            'complicated',
            'single',
        ])[0]!,
    }
}

export function makeData(...lens: number[]) {
    const makeDataLevel = (depth = 0): Person[] => {
        const len = lens[depth]!
        return range(len).map((d): Person => {
            return {
                ...newPerson(),
                subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
            }
        })
    }

    return makeDataLevel()
}
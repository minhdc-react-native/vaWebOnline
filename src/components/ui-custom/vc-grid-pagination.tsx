import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DynamicIcon } from 'lucide-react/dynamic';

export interface VcGridPaginationProps {
    pageIndex: number;
    pageSize: number;
    recordCount: number;
    isLoading?: boolean;

    onPageChange?: (pageIndex: number) => void;
    onPageSizeChange?: (pageSize: number) => void;

    sizes?: number[];
    sizesInfo?: string;
    sizesLabel?: string;
    sizesDescription?: string;
    sizesSkeleton?: ReactNode;
    more?: boolean;
    moreLimit?: number;
    info?: string;
    infoSkeleton?: ReactNode;
    className?: string;
}

export function VcGridPagination({
    pageIndex,
    pageSize,
    recordCount,
    isLoading = false,
    onPageChange,
    onPageSizeChange,
    sizes = [50, 100, 200, 300, 500],
    sizesLabel = 'Lấy',
    sizesDescription = 'dòng',
    sizesSkeleton = <Skeleton className="h-8 w-44" />,
    moreLimit = 5,
    info = '{from} - {to} của {count}',
    infoSkeleton = <Skeleton className="h-8 w-60" />,
    className
}: VcGridPaginationProps) {
    const btnBaseClasses = 'size-7 p-0 text-sm';
    const btnArrowClasses = btnBaseClasses + ' rtl:transform rtl:rotate-180';
    const pageCount = Math.ceil(recordCount / pageSize);
    const from = recordCount === 0 ? 0 : pageIndex * pageSize + 1;
    const to = Math.min((pageIndex + 1) * pageSize, recordCount);

    const paginationInfo = info
        .replace('{from}', from.toString())
        .replace('{to}', to.toString())
        .replace('{count}', recordCount.toString());

    const paginationMoreLimit = moreLimit;
    const currentGroupStart = Math.floor(pageIndex / paginationMoreLimit) * paginationMoreLimit;
    const currentGroupEnd = Math.min(currentGroupStart + paginationMoreLimit, pageCount);

    const renderPageButtons = () => {
        const buttons = [];
        for (let i = currentGroupStart; i < currentGroupEnd; i++) {
            buttons.push(
                <Button
                    key={i}
                    size="sm"
                    mode="icon"
                    variant="ghost"
                    className={cn(btnBaseClasses, 'text-muted-foreground', {
                        'bg-accent text-accent-foreground': pageIndex === i,
                    })}
                    onClick={() => pageIndex !== i && onPageChange?.(i)}
                >
                    {i + 1}
                </Button>,
            );
        }
        return buttons;
    };

    const renderEllipsisPrevButton = () =>
        currentGroupStart > 0 ? (
            <Button
                size="sm"
                mode="icon"
                className={btnBaseClasses}
                variant="ghost"
                onClick={() => onPageChange?.(currentGroupStart - 1)}
            >
                ...
            </Button>
        ) : null;

    const renderEllipsisNextButton = () =>
        currentGroupEnd < pageCount ? (
            <Button
                className={btnBaseClasses}
                variant="ghost"
                size="sm"
                mode="icon"
                onClick={() => onPageChange?.(currentGroupEnd)}
            >
                ...
            </Button>
        ) : null;

    return (
        <div
            data-slot="data-grid-pagination"
            className={cn(
                'flex flex-wrap flex-col sm:flex-row justify-end items-center gap-2.5 py-2.5 sm:py-0 grow font-bold',
                className,
            )}
        >
            <div className="flex flex-wrap items-center space-x-2.5 pb-2.5 sm:pb-0 order-2 sm:order-1">
                {isLoading ? (
                    sizesSkeleton
                ) : (
                    <>
                        <div className="text-sm text-muted-foreground">{sizesLabel}</div>
                        <Select
                            value={`${pageSize}`}
                            onValueChange={(value) => onPageSizeChange?.(Number(value))}
                        >
                            <SelectTrigger className="w-fit" size="sm">
                                <SelectValue placeholder={`${pageSize}`} />
                            </SelectTrigger>
                            <SelectContent side="top" className="min-w-[50px]">
                                {sizes.map((size) => (
                                    <SelectItem key={size} value={`${size}`}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="text-sm text-muted-foreground">{sizesDescription}</div>
                    </>
                )}
            </div>

            <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-center gap-2.5 pt-2.5 sm:pt-0 order-1 sm:order-2">
                {isLoading ? (
                    infoSkeleton
                ) : (
                    <>
                        <div className="text-sm text-muted-foreground text-nowrap order-2 sm:order-1">
                            {paginationInfo}
                        </div>

                        {pageCount > 1 && (
                            <div className="flex items-center space-x-1 order-1 sm:order-2">
                                {pageCount > paginationMoreLimit && <Button
                                    size="sm"
                                    mode="icon"
                                    variant="ghost"
                                    className={btnArrowClasses}
                                    onClick={() => onPageChange?.(0)}
                                    disabled={pageIndex <= 0}
                                >
                                    <span className="sr-only">Previous</span>
                                    <DynamicIcon name='chevrons-left' className="size-4" strokeWidth={3} />
                                </Button>}
                                <Button
                                    size="sm"
                                    mode="icon"
                                    variant="ghost"
                                    className={btnArrowClasses}
                                    onClick={() => onPageChange?.(pageIndex - 1)}
                                    disabled={pageIndex <= 0}
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeftIcon className="size-4" strokeWidth={3} />
                                </Button>

                                {renderEllipsisPrevButton()}
                                {renderPageButtons()}
                                {renderEllipsisNextButton()}

                                <Button
                                    size="sm"
                                    mode="icon"
                                    variant="ghost"
                                    className={btnArrowClasses}
                                    onClick={() => onPageChange?.(pageIndex + 1)}
                                    disabled={pageIndex >= pageCount - 1}
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRightIcon className="size-4" strokeWidth={3} />
                                </Button>
                                {pageCount > paginationMoreLimit && <Button
                                    size="sm"
                                    mode="icon"
                                    variant="ghost"
                                    className={btnArrowClasses}
                                    onClick={() => onPageChange?.(pageCount - 1)}
                                    disabled={pageIndex === pageCount - 1}
                                >
                                    <span className="sr-only">Next</span>
                                    <DynamicIcon name='chevrons-right' className="size-4" strokeWidth={3} />
                                </Button>}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

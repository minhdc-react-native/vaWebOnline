import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useVirtualizer } from "@tanstack/react-virtual";

interface TreeNode {
    id: string;
    name: string;
    position?: string;
    children?: TreeNode[];
}

const data: TreeNode[] = [
    {
        id: "1",
        name: "Công ty A",
        position: "Tổng công ty",
        children: [
            {
                id: "1.1",
                name: "Phòng Kinh doanh",
                position: "Trưởng phòng",
            },
            {
                id: "1.2",
                name: "Phòng Kỹ thuật",
                position: "Trưởng phòng",
                children: [
                    { id: "1.2.1", name: "Tổ phần mềm", position: "Nhân viên" },
                    { id: "1.2.2", name: "Tổ phần cứng", position: "Nhân viên" },
                ],
            },
        ],
    },
    {
        id: "2",
        name: "Phòng Kinh doanh",
        position: "Trưởng phòng",
    },
    {
        id: "3",
        name: "Phòng Kỹ thuật",
        position: "Trưởng phòng",
        children: [
            { id: "3.1", name: "Tổ phần mềm", position: "Nhân viên" },
            { id: "3.2", name: "Tổ phần cứng", position: "Nhân viên" },
        ],
    },
    {
        id: "4",
        name: "Phòng Kinh doanh",
        position: "Trưởng phòng",
    },
    {
        id: "5",
        name: "Phòng Kỹ thuật",
        position: "Trưởng phòng",
        children: [
            { id: "5.1", name: "Tổ phần mềm", position: "Nhân viên" },
            { id: "5.2", name: "Tổ phần cứng", position: "Nhân viên" },
        ],
    },
];

export default function TreeTable() {
    const parentRef = useRef<HTMLDivElement | null>(null);
    const [parentHeight, setParentHeight] = useState(0);

    // Đo kích thước container mỗi khi thay đổi
    useEffect(() => {
        if (!parentRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            setParentHeight(entry.contentRect.height);
        });
        resizeObserver.observe(parentRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 32,
        overscan: 20,
    });
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggle = (id: string) =>
        setExpanded((prev) => ({ ...prev, [id]: !(prev[id] !== undefined ? prev[id] : true) }));

    const renderNode = (node: TreeNode, level = 0) => {
        const hasChildren = node.children && node.children.length > 0;
        const isOpen = expanded[node.id] !== undefined ? expanded[node.id] : true;

        return (
            <React.Fragment key={node.id}>
                <tr
                    className="hover:bg-muted/40 transition-colors"
                // onClick={() => hasChildren && toggle(node.id)}
                >
                    <td className="py-2 px-3 text-sm font-medium text-foreground">
                        <div
                            className="flex items-center gap-2"
                            style={{ paddingLeft: `${level * 20}px` }}
                        >
                            {hasChildren ? (
                                <button
                                    type="button"
                                    style={{ width: 20 }}
                                    className="p-1  hover:cursor-pointer text-muted-foreground"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggle(node.id);
                                    }}
                                >
                                    {isOpen ? (
                                        <DynamicIcon name="minus-square" className="w-4 h-4" />
                                    ) : (
                                        <DynamicIcon name="plus-square" className="w-4 h-4" />
                                    )}
                                </button>
                            ) : (<div style={{ width: 20 }} />)}
                            <span>{node.name}</span>
                        </div>
                    </td>
                    <td className="py-2 px-3 text-sm">
                        {node.position}
                    </td>
                </tr>

                {isOpen &&
                    hasChildren &&
                    node.children!.map((child) => renderNode(child, level + 1))}
            </React.Fragment>
        );
    };

    return (
        <div className="flex flex-col flex-1 rounded-xl border bg-card overflow-hidden">
            <div ref={parentRef} className="overflow-auto flex-1">
                <table className="w-full text-sm border-collapse">
                    <thead className="sticky top-0 text-left z-10 bg-muted-foreground">
                        <tr>
                            <th style={{ width: 250 }} className="px-3 py-2 font-semibold text-foreground">
                                Tên đơn vị
                            </th>
                            <th className="px-3 py-2 font-semibold text-foreground">
                                Chức vụ
                            </th>
                        </tr>
                    </thead>
                    <tbody
                    // style={{
                    //     height: rowVirtualizer.getTotalSize(),
                    //     position: "relative",
                    // }}
                    >
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const node = data[virtualRow.index];
                            return renderNode(node);
                        })}
                        {/* {data.map((node) => renderNode(node))} */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

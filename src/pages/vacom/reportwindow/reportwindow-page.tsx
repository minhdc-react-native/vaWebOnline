import { useParams } from "react-router";
import { Fragment } from "react";
import { Container } from "@/components/common/container";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function ReportWindowPage() {
    const { window_id } = useParams();
    return (
        <Fragment>
            <Container>
                <span className="text-black text-lg">ReportWindow: {window_id}</span>
            </Container>
        </Fragment>
    );
}
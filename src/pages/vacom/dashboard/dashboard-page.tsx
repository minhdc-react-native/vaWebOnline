import { useParams } from "react-router";
import { Fragment } from "react";
import { Container } from "@/components/common/container";

export function DashboardPage() {
    const { window_id } = useParams();
    return (
        <Fragment>
            <Container>
                <span className="text-black text-lg">DashboardPage: {window_id}</span>
            </Container>
        </Fragment>
    );
}
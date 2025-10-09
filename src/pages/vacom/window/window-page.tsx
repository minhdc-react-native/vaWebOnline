import { useParams } from "react-router";
import { Fragment } from "react";
import { Container } from "@/components/common/container";

export function WindowPage() {
    const { window_id } = useParams();
    return (
        <Fragment>
            <Container>
                <span className="text-black text-lg">Window: {window_id}</span>
            </Container>
        </Fragment>
    );
}
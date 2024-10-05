import React from "react";
import { Spinner, Card, Container } from 'react-bootstrap';

type CardProps<T> = {
    list: Array<T>,
    loading: boolean,
    child: (l: T, index: number) => React.ReactElement,
    empty: () => React.ReactElement,
    style?: React.CSSProperties
    customCard?:boolean
};
const CardList = <T extends object>({ customCard, list, loading, child, empty, style }: CardProps<T>) => {
    if (loading) {
        return <Container fluid className="d-flex align-items-center justify-content-center col-12 m-0" style={style}>
            <Card className="col-12 col-md-10 card col-lg-8 col-xl-6">
                <Card.Body className="d-flex justify-content-center">
                    <Spinner animation="grow" variant="primary" />
                </Card.Body>
            </Card>
        </Container>
    }
    if (list.length == 0) {
        return <Container fluid className="d-flex align-items-center justify-content-center col-12 m-0" style={style}>
            {empty()}
        </Container >;
    }
    return <Container fluid className="d-flex flex-wrap align-items-stretch justify-content-center col-12 m-0" style={style}>
        <>{list.map((e, index) => {
            if(customCard){
                return <div key={index} className="m-2">{child(e, index)}</div> 
            }
            return <Card key={index} className="m-2">
                <Card.Body>{child(e, index)}</Card.Body>
            </Card>
        })}
        </>
    </Container >;
}
export default CardList;
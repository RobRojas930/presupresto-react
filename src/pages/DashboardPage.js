import React, { useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Progress } from 'reactstrap';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/dashBoardSlice';
// Styled Components
const StyledCard = styled(Card)`
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const CategoryTitle = styled.h5`
    margin-bottom: 0.5rem;
`;

const categories = [
    { name: 'Alimentación', spent: 300, total: 500 },
    { name: 'Transporte', spent: 120, total: 200 },
    { name: 'Entretenimiento', spent: 80, total: 150 },
    { name: 'Salud', spent: 50, total: 100 },
];

// Datos de ejemplo


const DashboardPage = () => {
    const [dashboardData, setDashboardData] = React.useState(null);
    const dispatch = useDispatch();
    const fetchData = async () => {
        const data = await dispatch(fetchDashboardData());
        if (fetchDashboardData.fulfilled.match(data)) {
            console.log("Dashboard data fetched:", data.payload);
            setDashboardData(data.payload);

        }
        else {
            console.error("Error fetching dashboard data:", data.error);
            setDashboardData(null);
        }
    };
    useEffect(() => {
        fetchData();
    }, [dispatch]);

    return (
        <Container className="mt-4">
            {/* Cards superiores */}
            <Row className="mb-4">
                <Col md={3}>
                    <StyledCard>
                        <CardBody>
                            <CardTitle tag="h4">Ingreso Total</CardTitle>
                            <h2>${dashboardData ? dashboardData.totalAmount : 'Cargando...'}</h2>
                        </CardBody>
                    </StyledCard>
                </Col>
                <Col md={3}>
                    <StyledCard>
                        <CardBody>
                            <CardTitle tag="h4">Egreso Total</CardTitle>
                            <h2>${dashboardData ? dashboardData.totalExpense : 'Cargando...'}</h2>
                        </CardBody>
                    </StyledCard>
                </Col>
                <Col md={3}>
                    <StyledCard>
                        <CardBody>
                            <CardTitle tag="h4">Egreso Total</CardTitle>
                            <h2>${dashboardData ? dashboardData.totalIncome : 'Cargando...'}</h2>
                        </CardBody>
                    </StyledCard>
                </Col>
                <Col md={3}>
                    <StyledCard>
                        <CardBody>
                            <CardTitle tag="h4">Ahorro Neto</CardTitle>
                            <h2>${dashboardData ? dashboardData.totalSaved : 'Cargando...'}</h2>
                        </CardBody>
                    </StyledCard>
                </Col>
            </Row>

            {/* Lista de categorías */}
            <Row>
                <Col md={12}>
                    {dashboardData !== null ?
                        dashboardData.categories.map((cat, idx) => {
                            return (
                                <StyledCard key={idx}>
                                    <CardBody>
                                        <CategoryTitle>{cat.category}</CategoryTitle>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Gastado: ${cat.total}</span>
                                            <span>{cat.percentage}%</span>
                                        </div>
                                        <Progress value={cat.percentage /100} color="info" />
                                    </CardBody>
                                </StyledCard>
                            );
                        }) : <div>Cargando...</div>}
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardPage;
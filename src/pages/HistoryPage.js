import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

import {
Card, CardBody, CardTitle, CardText, Row, Col,
} from 'reactstrap';

// Simulación de datos de transacciones
const transactions = [
// { id, amount, type: 'income' | 'expense', category, date: 'YYYY-MM-DD' }
{ id: 1, amount: 500, type: 'income', category: 'Salario', date: '2024-06-01' },
{ id: 2, amount: 100, type: 'expense', category: 'Comida', date: '2024-06-02' },
{ id: 3, amount: 200, type: 'expense', category: 'Transporte', date: '2024-06-03' },
{ id: 4, amount: 150, type: 'income', category: 'Freelance', date: '2024-05-15' },
{ id: 5, amount: 50, type: 'expense', category: 'Comida', date: '2024-05-20' },
{ id: 6, amount: 300, type: 'income', category: 'Salario', date: '2024-05-01' },
{ id: 7, amount: 80, type: 'expense', category: 'Entretenimiento', date: '2024-06-10' },
{ id: 8, amount: 120, type: 'expense', category: 'Comida', date: '2024-06-12' },
];

// Helpers
const getMonth = (dateStr) => {
const date = new Date(dateStr);
return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const months = Array.from(new Set(transactions.map(t => getMonth(t.date)))).sort();

const HistoryPageContainer = styled.div`
padding: 2rem;
background: #f8f9fa;
min-height: 100vh;
`;

const StyledCard = styled(Card)`
margin-bottom: 1rem;
`;

const ChartContainer = styled.div`
background: #fff;
border-radius: 1rem;
padding: 2rem;
margin-bottom: 2rem;
box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

function HistoryPage() {
// Cálculos
const summary = useMemo(() => {
    let total = 0;
    let totalIncome = 0;
    let totalExpense = 0;
    let byMonth = {};
    let byCategory = {};

    transactions.forEach(t => {
        total += t.type === 'income' ? t.amount : -t.amount;
        if (t.type === 'income') totalIncome += t.amount;
        if (t.type === 'expense') totalExpense += t.amount;

        const month = getMonth(t.date);
        if (!byMonth[month]) byMonth[month] = { income: 0, expense: 0 };
        byMonth[month][t.type] += t.amount;

        if (t.type === 'expense') {
            if (!byCategory[t.category]) byCategory[t.category] = 0;
            byCategory[t.category] += t.amount;
        }
    });

    return {
        total,
        totalIncome,
        totalExpense,
        totalTransactions: transactions.length,
        byMonth,
        byCategory,
    };
}, []);

// Datos para gráfica de dona por categoría de gastos
const expenseCategoryData = {
    labels: Object.keys(summary.byCategory),
    datasets: [{
        data: Object.values(summary.byCategory),
        backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        ],
    }],
};

// Datos para gráfica de dona de ingresos vs gastos
const incomeExpenseData = {
    labels: ['Ingresos', 'Gastos'],
    datasets: [{
        data: [summary.totalIncome, summary.totalExpense],
        backgroundColor: ['#36A2EB', '#FF6384'],
    }],
};

return (
    <HistoryPageContainer>
        <Row>
            <Col md={3}>
                <StyledCard>
                    <CardBody>
                        <CardTitle tag="h5">Total de Transacciones</CardTitle>
                        <CardText>{summary.totalTransactions}</CardText>
                    </CardBody>
                </StyledCard>
            </Col>
            <Col md={3}>
                <StyledCard>
                    <CardBody>
                        <CardTitle tag="h5">Total</CardTitle>
                        <CardText>${summary.total}</CardText>
                    </CardBody>
                </StyledCard>
            </Col>
            <Col md={3}>
                <StyledCard>
                    <CardBody>
                        <CardTitle tag="h5">Total Ingresos</CardTitle>
                        <CardText>${summary.totalIncome}</CardText>
                    </CardBody>
                </StyledCard>
            </Col>
            <Col md={3}>
                <StyledCard>
                    <CardBody>
                        <CardTitle tag="h5">Total Gastos</CardTitle>
                        <CardText>${summary.totalExpense}</CardText>
                    </CardBody>
                </StyledCard>
            </Col>
        </Row>

        <Row>
            <Col md={6}>
                <ChartContainer>
                    <h6>Gastos por Categoría</h6>
                    <Doughnut data={expenseCategoryData} />
                </ChartContainer>
            </Col>
            <Col md={6}>
                <ChartContainer>
                    <h6>Ingresos vs Gastos</h6>
                    <Doughnut data={incomeExpenseData} />
                </ChartContainer>
            </Col>
        </Row>

        <Row>
            <Col>
                <StyledCard>
                    <CardBody>
                        <CardTitle tag="h5">Resumen Mensual</CardTitle>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Mes</th>
                                    <th>Ingresos</th>
                                    <th>Gastos</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {months.map(month => (
                                    <tr key={month}>
                                        <td>{month}</td>
                                        <td>${summary.byMonth[month]?.income || 0}</td>
                                        <td>${summary.byMonth[month]?.expense || 0}</td>
                                        <td>${(summary.byMonth[month]?.income || 0) - (summary.byMonth[month]?.expense || 0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardBody>
                </StyledCard>
            </Col>
        </Row>
    </HistoryPageContainer>
);
}

export default HistoryPage;
import React, { useState } from "react";
import styled from "styled-components";
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";

import {
    Card,
    CardBody,
    Badge,
    Progress,
    Input,
    Button,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    ListGroup,
    ListGroupItem,
} from "reactstrap";

// Styled Components
const CalendarNav = styled.div`
display: flex;
align-items: center;
justify-content: center;
margin-bottom: 2rem;
`;

const MonthButton = styled(Button)`
background: none;
border: none;
color: #333;
font-size: 1.2rem;
&:hover {
    background: #f8f9fa;
}
`;

const MonthDisplay = styled.div`
cursor: pointer;
font-weight: bold;
font-size: 1.1rem;
margin: 0 1rem;
padding: 0.5rem 1rem;
border-radius: 8px;
background: #f8f9fa;
transition: background 0.2s;
&:hover {
    background: #e2e6ea;
}
`;

const SearchBox = styled(Input)`
margin-bottom: 1.5rem;
max-width: 400px;
`;

const BudgetCardWrapper = styled.div`
position: relative;
margin-bottom: 1.5rem;
overflow: hidden;
`;

const SlideActions = styled.div`
position: absolute;
right: 0;
top: 0;
height: 100%;
display: flex;
flex-direction: column;
justify-content: center;
background: #f8f9fa;
padding: 0.5rem;
z-index: 2;
transition: right 0.3s;
`;

const StyledCard = styled(Card)`
transition: transform 0.3s;
&:hover {
    transform: translateX(-80px);
}
`;

const CategoryBadge = styled(Badge)`
background-color: ${(props) => props.color || "#6c757d"};
margin-bottom: 0.5rem;
`;

const ProgressBarWrapper = styled.div`
margin-top: 1rem;
`;

const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Dummy categories/colors
const categoryColors = {
    Hogar: "#007bff",
    Comida: "#28a745",
    Entretenimiento: "#ffc107",
    Transporte: "#17a2b8",
    Otros: "#6c757d",
};

// Dummy data
const budgets = [
    {
        id: 1,
        name: "Supermercado",
        category: "Comida",
        spent: 120,
        total: 300,
    },
    {
        id: 2,
        name: "Netflix",
        category: "Entretenimiento",
        spent: 50,
        total: 60,
    },
    {
        id: 3,
        name: "Gasolina",
        category: "Transporte",
        spent: 80,
        total: 100,
    },
];

function BudgetCard({ budget, onEdit, onDelete }) {
    const [hovered, setHovered] = useState(false);
    const percent = Math.round((budget.spent / budget.total) * 100);

    return (
        <BudgetCardWrapper
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <StyledCard style={hovered ? { transform: "translateX(-80px)" } : {}}>
                <CardBody>
                    <h5>{budget.name}</h5>
                    <CategoryBadge color={categoryColors[budget.category]}>
                        {budget.category}
                    </CategoryBadge>
                    <ProgressBarWrapper>
                        <Progress value={percent} color="info" />
                        <small>
                            {budget.spent} / {budget.total} ({percent}%)
                        </small>
                    </ProgressBarWrapper>
                </CardBody>
            </StyledCard>
            {hovered && (
                <SlideActions>
                    <Button color="warning" size="sm" onClick={() => onEdit(budget)}>
                        <FaEdit />
                    </Button>
                    <Button color="danger" size="sm" onClick={() => onDelete(budget)}>
                        <FaTrash />
                    </Button>
                </SlideActions>
            )}
        </BudgetCardWrapper>
    );
}

export default function BudgetPage() {
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());
    const [search, setSearch] = useState("");
    const [calendarOpen, setCalendarOpen] = useState(false);

    // Dummy edit/delete handlers
    const handleEdit = (budget) => alert(`Editar: ${budget.name}`);
    const handleDelete = (budget) => alert(`Eliminar: ${budget.name}`);

    // Filter budgets by search
    const filteredBudgets = budgets.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase())
    );

    // Calendar modal for month selection
    const handleMonthSelect = (m) => {
        setMonth(m);
        setCalendarOpen(false);
    };

    return (
        <div className="container py-4">
            <CalendarNav>
                <MonthButton onClick={() => setMonth((m) => (m === 0 ? 11 : m - 1))}>
                    <FaChevronLeft />
                </MonthButton>
                <MonthDisplay onClick={() => setCalendarOpen(true)}>
                    {months[month]} {year}
                </MonthDisplay>
                <MonthButton onClick={() => setMonth((m) => (m === 11 ? 0 : m + 1))}>
                    <FaChevronRight />
                </MonthButton>
            </CalendarNav>

            <Modal isOpen={calendarOpen} toggle={() => setCalendarOpen(false)}>
                <ModalHeader toggle={() => setCalendarOpen(false)}>
                    Selecciona el mes
                </ModalHeader>
                <ModalBody>
                    <ListGroup>
                        {months.map((m, idx) => (
                            <ListGroupItem
                                key={m}
                                active={idx === month}
                                tag="button"
                                action
                                onClick={() => handleMonthSelect(idx)}
                            >
                                {m} {year}
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </ModalBody>
            </Modal>

            <Row>
                <Col md={6}>
                    <SearchBox
                        type="search"
                        placeholder="Buscar presupuesto..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={8}>
                    {filteredBudgets.map((budget) => (
                        <BudgetCard
                            key={budget.id}
                            budget={budget}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </Col>
            </Row>
        </div>
    );
}
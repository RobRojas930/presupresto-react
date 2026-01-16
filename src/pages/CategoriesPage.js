import React, { useState } from "react";
import styled from "styled-components";
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";
import {
    Container,
    Row,
    Col,
    Input,
    Card,
    CardBody,
    Button,
} from "reactstrap";

// Dummy categories data
const categoriesData = [
    {
        id: 1,
        name: "Alimentos",
        color: "#FFB347",
        icon: "🍔",
    },
    {
        id: 2,
        name: "Transporte",
        color: "#77DD77",
        icon: "🚗",
    },
    {
        id: 3,
        name: "Entretenimiento",
        color: "#AEC6CF",
        icon: "🎬",
    },
];

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
font-size: 1.5rem;
&:hover {
    background: #f0f0f0;
}
`;

const MonthDisplay = styled.div`
padding: 0.5rem 1.5rem;
font-size: 1.2rem;
font-weight: bold;
cursor: pointer;
border-radius: 20px;
background: #e9ecef;
margin: 0 1rem;
transition: background 0.2s;
&:hover {
    background: #d1d5db;
}
`;

const SearchBox = styled(Input)`
margin-bottom: 2rem;
max-width: 400px;
`;

const CategoryIconBubble = styled.div`
background: ${(props) => props.color || "#ccc"};
color: #fff;
font-size: 1.5rem;
width: 48px;
height: 48px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
margin-right: 1rem;
`;

const CategoryCard = styled(Card)`
display: flex;
align-items: center;
margin-bottom: 1rem;
box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const CategoryName = styled.div`
font-size: 1.1rem;
font-weight: 500;
`;

const CardActions = styled.div`
margin-left: auto;
display: flex;
gap: 0.5rem;
`;

const MonthPickerModal = styled.div`
position: fixed;
top: 0; left: 0; right: 0; bottom: 0;
background: rgba(0,0,0,0.2);
display: flex;
align-items: center;
justify-content: center;
z-index: 1000;
`;

const MonthPickerBox = styled.div`
background: #fff;
padding: 2rem;
border-radius: 12px;
box-shadow: 0 4px 24px rgba(0,0,0,0.12);
min-width: 320px;
`;

const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function CategoriesPage() {
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [search, setSearch] = useState("");

    const filteredCategories = categoriesData.filter(cat =>
        cat.name.toLowerCase().includes(search.toLowerCase())
    );

    const handlePrevMonth = () => {
        if (month === 0) {
            setMonth(11);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    };

    const handleNextMonth = () => {
        if (month === 11) {
            setMonth(0);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    };

    const handleMonthClick = () => setShowMonthPicker(true);

    const handleMonthSelect = (idx) => {
        setMonth(idx);
        setShowMonthPicker(false);
    };

    return (
        <Container style={{ maxWidth: 600, marginTop: 40 }}>
            <CalendarNav>
                <MonthButton onClick={handlePrevMonth}>
                    <FaChevronLeft />
                </MonthButton>
                <MonthDisplay onClick={handleMonthClick}>
                    {months[month]} {year}
                </MonthDisplay>
                <MonthButton onClick={handleNextMonth}>
                    <FaChevronRight />
                </MonthButton>
            </CalendarNav>

            <SearchBox
                type="search"
                placeholder="Buscar categoría..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <Row>
                <Col>
                    {filteredCategories.map(cat => (
                        <CategoryCard key={cat.id}>
                            <CategoryIconBubble color={cat.color}>{cat.icon}</CategoryIconBubble>
                            <CategoryName>{cat.name}</CategoryName>
                            <CardActions>
                                <Button color="primary" size="sm">
                                    <FaEdit />
                                </Button>
                                <Button color="danger" size="sm">
                                    <FaTrash />
                                </Button>
                            </CardActions>
                        </CategoryCard>
                    ))}
                </Col>
            </Row>

            {showMonthPicker && (
                <MonthPickerModal onClick={() => setShowMonthPicker(false)}>
                    <MonthPickerBox onClick={e => e.stopPropagation()}>
                        <h5>Selecciona el mes</h5>
                        <Row>
                            {months.map((m, idx) => (
                                <Col xs="6" sm="4" key={m} style={{ marginBottom: 12 }}>
                                    <Button
                                        color={idx === month ? "primary" : "secondary"}
                                        block
                                        onClick={() => handleMonthSelect(idx)}
                                    >
                                        {m}
                                    </Button>
                                </Col>
                            ))}
                        </Row>
                    </MonthPickerBox>
                </MonthPickerModal>
            )}
        </Container>
    );
}

export default CategoriesPage;
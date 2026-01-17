import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import styled from "styled-components";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

import { useDispatch } from "react-redux";
import { getHistoryData } from "../store/historySlice";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
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

// Simulación de datos de transacciones
const transactions = [
  // { id, amount, type: 'income' | 'expense', category, date: 'YYYY-MM-DD' }
  {
    id: 1,
    amount: 500,
    type: "income",
    category: "Salario",
    date: "2024-06-01",
  },
  {
    id: 2,
    amount: 100,
    type: "expense",
    category: "Comida",
    date: "2024-06-02",
  },
  {
    id: 3,
    amount: 200,
    type: "expense",
    category: "Transporte",
    date: "2024-06-03",
  },
  {
    id: 4,
    amount: 150,
    type: "income",
    category: "Freelance",
    date: "2024-05-15",
  },
  {
    id: 5,
    amount: 50,
    type: "expense",
    category: "Comida",
    date: "2024-05-20",
  },
  {
    id: 6,
    amount: 300,
    type: "income",
    category: "Salario",
    date: "2024-05-01",
  },
  {
    id: 7,
    amount: 80,
    type: "expense",
    category: "Entretenimiento",
    date: "2024-06-10",
  },
  {
    id: 8,
    amount: 120,
    type: "expense",
    category: "Comida",
    date: "2024-06-12",
  },
];

// Helpers
const getMonth = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

function HistoryPage() {
  const today = new Date();
  const dispatch = useDispatch();
  // Cálculos
  const [historyData, setHistoryData] = React.useState({});
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const userId = parsedUser ? parsedUser.data.id || parsedUser.data._id : null;
  // Calendar modal for month selection
  const handleMonthSelect = (m) => {
    setMonth(m);
    setCalendarOpen(false);
  };
  // Datos para gráfica de dona de ingresos vs gastos

  const fetchHistoryData = async (month, year) => {
    const data = await dispatch(
      getHistoryData({
        userId,
        startDate: `${year}-${String(month + 1).padStart(2, "0")}-01`,
        endDate: `${year}-${String(month + 1).padStart(2, "0")}-31`,
      }),
    );
    if (getHistoryData.fulfilled.match(data)) {
      console.log("History data fetched:", data.payload);
      setHistoryData(data.payload);
    } else {
      console.error("Error fetching history data:", data.error);
      setHistoryData({});
    }
  };

  useEffect(() => {
    fetchHistoryData( month, year);
  }, [dispatch, month, year]);

  return (
    <HistoryPageContainer>
      <Row>
        <Col md={12}>
          <CalendarNav>
            <MonthButton
              onClick={() => setMonth((m) => (m === 0 ? 11 : m - 1))}
            >
              <FaChevronLeft />
            </MonthButton>
            <MonthDisplay onClick={() => setCalendarOpen(true)}>
              {monthNames[month]} {year}
            </MonthDisplay>
            <MonthButton
              onClick={() => setMonth((m) => (m === 11 ? 0 : m + 1))}
            >
              <FaChevronRight />
            </MonthButton>
          </CalendarNav>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <StyledCard>
            <CardBody>
              <CardTitle tag="h5">Total de Transacciones</CardTitle>
              <CardText>{historyData.countTransactions }</CardText>
            </CardBody>
          </StyledCard>
        </Col>
        <Col md={3}>
          <StyledCard>
            <CardBody>
              <CardTitle tag="h5">Total</CardTitle>
              <CardText>${historyData.totalTransactionsAmount }</CardText>
            </CardBody>
          </StyledCard>
        </Col>
        <Col md={3}>
          <StyledCard>
            <CardBody>
              <CardTitle tag="h5">Total Ingresos</CardTitle>
              <CardText>${historyData.totalIncomeByMonth }</CardText>
            </CardBody>
          </StyledCard>
        </Col>
        <Col md={3}>
          <StyledCard>
            <CardBody>
              <CardTitle tag="h5">Total Gastos</CardTitle>
              <CardText>${historyData.totalExpenseByMonth }</CardText>
            </CardBody>
          </StyledCard>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <ChartContainer>
            <h6>Gastos por Categoría</h6>
            <Doughnut
              data={{
                labels:
                  (Array.isArray(historyData.transactionsByCategory) ? historyData.transactionsByCategory : []).map((item) => item.category),
                datasets: [
                  {
                    data:
                      (Array.isArray(historyData.transactionsByCategory) ? historyData.transactionsByCategory : []).map(
                        (item) => item.totalAmount ,
                      ),
                    backgroundColor: (Array.isArray(historyData.transactionsByCategory) ? historyData.transactionsByCategory : []).map(
                      (item) => item.color,
                    ),
                  },
                ],
              }}
            />
          </ChartContainer>
        </Col>
        <Col md={6}>
          <ChartContainer>
            <h6>Ingresos vs Gastos</h6>
            <Doughnut
              data={{
                labels: ["Ingresos", "Gastos"],
                datasets: [
                  {
                    data: [
                      historyData.totalIncomeByMonth || 0,
                      historyData.totalExpenseByMonth || 0,
                    ],
                    backgroundColor: ["#36A2EB", "#FF6384"],
                  },
                ],
              }}
            />
          </ChartContainer>
        </Col>
      </Row>
      <Modal isOpen={calendarOpen} toggle={() => setCalendarOpen(false)}>
        <ModalHeader toggle={() => setCalendarOpen(false)}>
          Selecciona el mes
        </ModalHeader>
        <ModalBody>
          <ListGroup>
            {monthNames.map((m, idx) => (
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
    </HistoryPageContainer>
  );
}

export default HistoryPage;

import React, { useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import CreateTransactionsModal from "../components/CreateTransactionsModal";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import {
  fetchTransactions,
  fetchCreateTransaction,
  fetchUpdateTransaction,
  fetchDeleteTransaction,
} from "../store/tansactionSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Input,
  Button,
  Badge,
  Card,
  CardBody,
  CardTitle,
  CardText,
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

const CenterMonth = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1rem;
  margin: 0 1rem;
`;

const SearchBox = styled(Input)`
  margin-bottom: 2rem;
`;

const TransactionCard = styled(Card)`
  margin-bottom: 1rem;
  border-left: 6px solid ${(props) => props.bordercolor || "#ccc"};
`;

const Amount = styled.span`
  font-weight: bold;
  color: ${(props) => (props.type === "income" ? "green" : "red")};
`;

const CategoryBadge = styled(Badge)`
  background-color: ${(props) => props.bg || "#888"};
  margin-right: 0.5rem;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const categories = [
  { name: "Food", color: "#ff9800" },
  { name: "Salary", color: "#4caf50" },
  { name: "Transport", color: "#2196f3" },
  { name: "Shopping", color: "#e91e63" },
];

const mockTransactions = [
  {
    id: 1,
    title: "Supermarket",
    description: "Groceries for the week",
    amount: -50,
    type: "expense",
    category: "Food",
    date: "2024-06-10",
  },
  {
    id: 2,
    title: "Salary",
    description: "Monthly salary",
    amount: 1200,
    type: "income",
    category: "Salary",
    date: "2024-06-01",
  },
  {
    id: 3,
    title: "Bus Ticket",
    description: "Commute to work",
    amount: -2.5,
    type: "expense",
    category: "Transport",
    date: "2024-06-09",
  },
];

const FloatingAddButton = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #007bff;
  color: #fff;
  border: none;
  font-size: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: background 0.2s;
  &:hover {
    background: #0056b3;
  }
`;

function formatMonthYear(date) {
  return date.toLocaleString("default", { month: "long", year: "numeric" });
}

export default function TransactionsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [editModal, setEditModal] = useState({
    open: false,
    transaction: null,
  });
  let user;
  const dataUser = localStorage.getItem("user");
  if (dataUser) {
    user = JSON.parse(dataUser);
  }
  const userId = user ? user.data._id : "defaultUserId";

  // Filter transactions by search
  const filteredTransactions = transactions.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()),
  );

  // Calendar navigation
  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };
  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  // Month picker logic
  const handleMonthClick = () => setShowMonthPicker(true);
  const handleMonthSelect = (e) => {
    const [year, month] = e.target.value.split("-");
    setCurrentDate(new Date(year, month - 1, 1));
    setShowMonthPicker(false);
  };

  // Edit/Delete handlers (mock)
  const handleEdit = (id) => {
    const transaction = transactions.find((t) => t._id === id);
    if (!transaction) return;

    setEditModal({
      open: true,
      transaction: {
        ...transaction,
      },
    });
  };
  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTransaction(id).then(() => {
          Swal.fire({
            icon: "success",
            title: "Transacción eliminada",
            showConfirmButton: false,
            timer: 1500,
          });
        });
      }
    });
  };

  const dispatch = useDispatch();

  //CARGAR TRANSACCIONES
  const fetchData = async () => {
    const data = await dispatch(
      fetchTransactions({
        startDate: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1,
        )
          .toISOString()
          .split("T")[0],
        endDate: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0,
        )
          .toISOString()
          .split("T")[0],
      }),
    );
    if (fetchTransactions.fulfilled.match(data)) {
      console.log("Dashboard data fetched:", data.payload);
      setTransactions(data.payload);
    } else {
      console.error("Error fetching dashboard data:", data.error);
      setTransactions([]);
    }
  };

  const createTransactionData = async (transaction) => {
    const data = await dispatch(fetchCreateTransaction(transaction));
    if (fetchCreateTransaction.fulfilled.match(data)) {
      console.log("Transaction data fetched:", data.payload);
      await fetchData();
    } else {
      console.error("Error fetching transaction data:", data.error);
    }
  };

  //ACTUALIZAR TRANSACCIONES
  const updateTransaction = async (id, updatedTransaction) => {
    const data = await dispatch(
      fetchUpdateTransaction({ id, updatedTransaction }),
    );
    if (fetchUpdateTransaction.fulfilled.match(data)) {
      await fetchData();
      console.log("Transaction updated:", data.payload);
    } else {
      console.error("Error updating transaction:", data.error);
    }
  };

  const deleteTransaction = async (id) => {
    const data = await dispatch(fetchDeleteTransaction({ id }));
    if (fetchDeleteTransaction.fulfilled.match(data)) {
      await fetchData();
      console.log("Transaction deleted:", data.payload);
    } else {
      console.error("Error deleting transaction:", data.error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, currentDate]);

  return (
    <Container>
      <Row>
        <Col md={{ size: 8, offset: 2 }}>
          <CalendarNav>
            <MonthButton onClick={handlePrevMonth}>
              <FaChevronLeft />
            </MonthButton>
            <CenterMonth onClick={handleMonthClick}>
              <FaCalendarAlt style={{ marginRight: "0.5rem" }} />
              {formatMonthYear(currentDate)}
            </CenterMonth>
            <MonthButton onClick={handleNextMonth}>
              <FaChevronRight />
            </MonthButton>
            {showMonthPicker && (
              <Input
                type="month"
                style={{ width: "150px", marginLeft: "1rem" }}
                value={`${currentDate.getFullYear()}-${String(
                  currentDate.getMonth() + 1,
                ).padStart(2, "0")}`}
                onChange={handleMonthSelect}
                onBlur={() => setShowMonthPicker(false)}
                autoFocus
              />
            )}
          </CalendarNav>

          {/* Search Box */}
          <SearchBox
            type="search"
            placeholder="Buscar transacciones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Transactions List */}
          {filteredTransactions.map((t) => (
            <TransactionCard key={t.id} bordercolor={t.category[0].color}>
              <CardBody>
                <Row>
                  <Col md={3}>
                    <CardTitle tag="h5">{t.title}</CardTitle>
                    <CardText>{t.description}</CardText>
                  </Col>
                  <Col md={3} style={{ textAlign: "right" }}>
                    <CardText>
                      <Amount type={t.type}>
                        {t.type === "income" ? "+" : "-"}${Math.abs(t.amount)}
                      </Amount>
                    </CardText>
                  </Col>
                  <Col md={3}>
                    <CardText>
                      <CategoryBadge bg={t.category[0].color}>
                        {t.category[0].name}
                      </CategoryBadge>
                      <div>{new Date(t.date).toLocaleDateString()}</div>
                    </CardText>
                  </Col>
                  <Col md={3} style={{ textAlign: "right" }}>
                    <CardActions>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => handleEdit(t._id)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleDelete(t._id)}
                      >
                        <FaTrash />
                      </Button>
                    </CardActions>
                  </Col>
                </Row>
              </CardBody>
            </TransactionCard>
          ))}
        </Col>
      </Row>
      <CreateTransactionsModal
        userId={userId}
        startDate={
          new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
            .toISOString()
            .split("T")[0]
        }
        endDate={
          new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
            .toISOString()
            .split("T")[0]
        }
        isOpen={editModal.open}
        toggle={() => setEditModal({ open: false, transaction: null })}
        transaction={editModal.transaction}
        onSave={async (transaction) => {
          createTransactionData(transaction);
          setEditModal({ open: false, transaction: null });
        }}
        onEdit={(id, updatedTransaction) => {
          updateTransaction(id, updatedTransaction);
          setEditModal({ open: false, transaction: null });
        }}
      />
      <FloatingAddButton
        title="Crear presupuesto"
        onClick={() => {
          setEditModal({ open: true, transaction: null });
        }}
      >
        +
      </FloatingAddButton>
    </Container>
  );
}

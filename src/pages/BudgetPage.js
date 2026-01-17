import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  fetchBudgets,
  fetchCreateBudget,
  fetchUpdateBudget,
  fetchDeleteBudget,
} from "../store/budgetSlice";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
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
import { fetchCategories, fetchCategoryById } from "../store/categoriesSlice";
import CreateBudgetModal from "../components/CreateBudgetModal";

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
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

// Dummy data

function BudgetCard({ budget, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const percent = budget.percentage / 100;
  const [category, setCategory] = useState({
    name: "Sin categoría",
    color: "#6c757d",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    const fetchCategory = async () => {
      const data = await dispatch(fetchCategoryById({ id: budget.categoryId }));
      if (fetchCategoryById.fulfilled.match(data)) {
        if (isMounted) setCategory(data.payload);
      } else {
        if (isMounted) setCategory({ name: "Sin categoría", color: "#6c757d" });
      }
    };
    fetchCategory();
    return () => {
      isMounted = false;
    };
  }, [dispatch, budget.categoryId]);

  return (
    <BudgetCardWrapper
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <StyledCard style={hovered ? { transform: "translateX(-80px)" } : {}}>
        <CardBody>
          <h5>{budget.title}</h5>
          <CategoryBadge color={category.color}>{category.name}</CategoryBadge>
          <ProgressBarWrapper>
            <Progress value={percent} color="info" />
            <small>
              {budget.currentAmount} / {budget.initialAmount} ({percent}%)
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
  const [budgetData, setBudgetData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const dispatch = useDispatch();

  const user = localStorage.getItem("user");
  let userId = null;
  if (user !== null) {
    const jsonData = JSON.parse(user);
    userId = jsonData.data._id;
  }

  // Dummy edit/delete handlers
  const handleEdit = (budget) => {
    setSelectedBudget(budget);
    setOpenModal(true);
  };
  const handleDelete = (budget) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Eliminar presupuesto "${budget.title}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetchDeleteBudgetData(budget._id);
        Swal.fire("Eliminado", "El presupuesto ha sido eliminado.", "success");
      }
    });
  };

  // Filter budgets by search
  const filteredBudgets =
    Array.isArray(budgetData) && budgetData !== null
      ? budgetData.filter(
          (b) =>
            b.title &&
            typeof b.title === "string" &&
            b.title.toLowerCase().includes(search.toLowerCase()),
        )
      : [];

  // Calendar modal for month selection
  const handleMonthSelect = (m) => {
    setMonth(m);
    setCalendarOpen(false);
  };

  const fetchBudgetData = async (month, year) => {
    const data = await dispatch(
      fetchBudgets({
        userId,
        startDate: `${year}-${String(month + 1).padStart(2, "0")}-01`,
        endDate: `${year}-${String(month + 1).padStart(2, "0")}-31`,
      }),
    );
    if (fetchBudgets.fulfilled.match(data)) {
      console.log("Budget data fetched:", data.payload);
      setBudgetData(data.payload);
    } else {
      console.error("Error fetching budget data:", data.error);
      setBudgetData([]);
    }
  };

  const fetchCreateBudgetData = async (budget) => {
    const data = await dispatch(fetchCreateBudget(budget));
    if (fetchBudgets.fulfilled.match(data)) {
      console.log("Budget data fetched:", data.payload);
      setBudgetData(data.payload);
    } else {
      console.error("Error fetching budget data:", data.error);
      setBudgetData([]);
    }
  };

  const fetchUpdateBudgetData = async (budgetData) => {
    const data = await dispatch(
      fetchUpdateBudget({
        id: budgetData.id,
        budgetData: budgetData,
      }),
    );
    if (fetchUpdateBudget.fulfilled.match(data)) {
      console.log("Budget data fetched:", data.payload);
      fetchBudgetData(month, year);
    } else {
      console.error("Error fetching budget data:", data.error);
      setBudgetData([]);
    }
  };

  const fetchDeleteBudgetData = async (budgetId) => {
    const data = await dispatch(
      fetchDeleteBudget({
        id: budgetId,
      }),
    );
    if (fetchDeleteBudget.fulfilled.match(data)) {
      console.log("Budget data fetched:", data.payload);
      fetchBudgetData(month, year);
    } else {
      console.error("Error fetching budget data:", data.error);
      setBudgetData([]);
    }
  };

  useEffect(() => {
    fetchBudgetData(month, year);
  }, [dispatch, month, year]);

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
        <Col md={6}>
          <FloatingAddButton
            color="primary"
            className="float-end"
            onClick={() => {
              setSelectedBudget(null);
              setOpenModal(true);
            }}
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
        <CreateBudgetModal
          isOpen={openModal}
          userId={userId}
          toggle={() => {
            setOpenModal(!openModal);
            setSelectedBudget(null);
          }}
          budget={selectedBudget}
          onSave={(budget) => {
            fetchCreateBudgetData(budget);
          }}
          onEdit={(budget) => {
            fetchUpdateBudgetData(budget);
          }}
        />
        <FloatingAddButton
          title="Crear presupuesto"
          onClick={() => {
            setSelectedBudget(null);
            setOpenModal(true);
          }}
        >+
        </FloatingAddButton>
      </Row>
    </div>
  );
}

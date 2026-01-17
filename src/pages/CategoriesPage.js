import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";
import { Container, Row, Col, Input, Card, CardBody, Button } from "reactstrap";
import { useDispatch } from "react-redux";
import {
  fetchCategories,
  fetchCreateCategory,
  fetchDeleteCategory,
  fetchUpdateCategory,
} from "../store/categoriesSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconByCode } from "../utils/icons";
import CreateCategoryModal from "../components/CreateCategoryModal";
import Swal from "sweetalert2";
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const MonthPickerBox = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  min-width: 320px;
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

function CategoriesPage() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [search, setSearch] = useState("");
  const [categoriesData, setCategoriesData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dispatch = useDispatch();
  const user = localStorage.getItem("user");
  const parsedUser = JSON.parse(user);
  const userId = parsedUser.data.id || parsedUser.data._id;

  const filteredCategories =
    categoriesData && categoriesData.length
      ? categoriesData.filter((cat) =>
          cat.name.toLowerCase().includes(search.toLowerCase()),
        )
      : [];

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

  const fetchCategoriesData = async (month, year) => {
    const data = await dispatch(
      fetchCategories({
        userId,
        startDate: `${year}-${String(month + 1).padStart(2, "0")}-01`,
        endDate: `${year}-${String(month + 1).padStart(2, "0")}-31`,
      }),
    );
    if (fetchCategories.fulfilled.match(data)) {
      console.log("Budget data fetched:", data.payload);
      setCategoriesData(data.payload);
    } else {
      console.error("Error fetching budget data:", data.error);
      setCategoriesData([]);
    }
  };

  const fetchCreateCategoryData = async (category) => {
    const data = await dispatch(fetchCreateCategory(category));
    if (fetchCreateCategory.fulfilled.match(data)) {
      console.log("Budget data fetched:", data.payload);
      fetchCategoriesData(month, year);
    } else {
      Swal.fire("Error", data.error.message, "error");
      console.error("Error fetching budget data:", data.error);
      setCategoriesData([]);
    }
  };

  const fetchUpdateCategoryData = async (categoryData) => {
    const data = await dispatch(
      fetchUpdateCategory({
        id: categoryData.id,
        categoryData: categoryData,
      }),
    );
    if (fetchUpdateCategory.fulfilled.match(data)) {
      console.log("Budget data fetched:", data.payload);
      setCategoriesData(month, year);
    } else {
      console.error("Error fetching budget data:", data.error);
      setCategoriesData([]);
    }
  };

  const fetchDeleteCategoryData = async (categoryId) => {
    const data = await dispatch(
      fetchDeleteCategory({
        id: categoryId,
      }),
    );
    if (fetchDeleteCategory.fulfilled.match(data)) {
      console.log("Budget data fetched:", data.payload);
      fetchCategoriesData(month, year);
    } else {
      Swal.fire("Error", data.error.message, "error");
      console.error("Error fetching budget data:", data.error);
    }
  };

  useEffect(() => {
    fetchCategoriesData(month, year);
  }, [dispatch, month, year]);
  return (
    <Container style={{ maxWidth: 600, marginTop: 40 }}>
      <SearchBox
        type="search"
        placeholder="Buscar categoría..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Row>
        <Col>
          {filteredCategories.map((cat) => {
            const icon = getIconByCode(cat.icon);
            return (
              <CategoryCard key={cat.id}>
                <CategoryIconBubble color={cat.color}>
                  <FontAwesomeIcon icon={icon} />
                </CategoryIconBubble>
                <CategoryName>{cat.name}</CategoryName>
                <CardActions>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsOpenModal(true);
                    }}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => {
                      Swal.fire({
                        title: "¿Estás seguro?",
                        text: "Esta acción no se puede deshacer.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Sí, eliminar",
                        cancelButtonText: "Cancelar",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          fetchDeleteCategoryData(cat._id);
                        }
                      });
                    }}
                  >
                    <FaTrash />
                  </Button>
                </CardActions>
              </CategoryCard>
            );
          })}
        </Col>
      </Row>
      <CreateCategoryModal
        isOpen={isOpenModal}
        onClose={() => {
          setIsOpenModal(false);
        }}
        category={selectedCategory}
        onSave={(newCategory) => {
          fetchCreateCategoryData(newCategory);
          setIsOpenModal(false);
        }}
        onEdit={(updatedCategory) => {
          fetchUpdateCategoryData(updatedCategory);
          setIsOpenModal(false);
        }}
      />
      <FloatingAddButton
        title="Crear presupuesto"
        onClick={() => {
          setIsOpenModal(true);
          setSelectedCategory(null);
        }}
      >
        +
      </FloatingAddButton>
    </Container>
  );
}

export default CategoriesPage;

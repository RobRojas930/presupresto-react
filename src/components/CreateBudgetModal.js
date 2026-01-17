import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { fetchCategories } from "../store/categoriesSlice";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

// Styled Components
const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 12px;
  }
`;

const StyledButton = styled(Button)`
  min-width: 100px;
`;

const CreateBudgetModal = ({
  isOpen,
  toggle,
  userId,
  budget = {},
  onSave,
  onEdit,
  startDate,
  endDate,
}) => {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const dispatch = useDispatch();

  const fetchCategoriesData = async () => {
    const user = localStorage.getItem("user");
    if (user !== null) {
      const parsedUser = JSON.parse(user);
      var userId = parsedUser.data.id || parsedUser.data._id;
      const data = await dispatch(
        fetchCategories({
          userId,
          startDate,
          endDate,
        })
      );
      if (fetchCategories.fulfilled.match(data)) {
        console.log("Dashboard data fetched:", data.payload);
        setCategories(data.payload);
      } else {
        console.error("Error fetching dashboard data:", data.error);
        setCategories(null);
      }
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, [dispatch]);

  useEffect(() => {
    if (budget && Object.keys(budget).length > 0) {
      setTitle(budget.title || "");
      setCategoryId(budget.categoryId || "");
      setInitialAmount(budget.initialAmount || "");
    } else {
      setTitle("");
      setCategoryId("");
      setInitialAmount("");
    }
  }, [budget, isOpen]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !categoryId || !initialAmount) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    if (budget && Object.keys(budget).length > 0) {
      const newBudget = {
        id: budget._id,
        userId: userId,
        title: title,
        categoryId: categoryId,
        currentAmount: 0.0,
        percentage: 0.0,
        userId: userId,
        color: selectedCategory.color || "#FFFFFF",
        initialAmount: parseFloat(initialAmount),
      };
      await onEdit({
        ...newBudget,
      });
    } else {
      const newBudget = {
        id: '',
        userId: userId,
        title: title,
        categoryId: categoryId,
        currentAmount: 0.0,
        percentage: 0.0,
        userId: userId,
        color: selectedCategory.color || "",
        initialAmount: parseFloat(initialAmount),
      };
      await onSave({
        ...newBudget,
      });
    }
    Swal.fire(
      budget && Object.keys(budget).length > 0 ? "Editado" : "Creado",
      `El presupuesto ha sido ${
        budget && Object.keys(budget).length > 0 ? "editado" : "creado"
      } correctamente`,
      "success"
    );
    toggle();
  };

return (
    <StyledModal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>
            {budget && Object.keys(budget).length > 0
                ? "Editar Presupuesto"
                : "Crear Presupuesto"}
        </ModalHeader>
        <Form onSubmit={handleSave}>
            <ModalBody>
                <FormGroup>
                    <Label for="title">Título</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Título del presupuesto"
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="category">Categoría</Label>
                    <Input
                        type="select"
                        id="category"
                        value={categoryId}
                        onChange={(e) => {
                            setCategoryId(e.target.value);
                            const selectedCat =
                                Array.isArray(categories) && categories.length > 0
                                    ? categories.find((cat) => cat._id === e.target.value)
                                    : undefined;
                            setSelectedCategory(selectedCat || {});
                        }}
                        required
                    >
                        <option value="">
                            {selectedCategory
                                ? selectedCategory.name
                                : "Selecciona una categoría"}
                        </option>
                        {Array.isArray(categories) && categories.length > 0 &&
                            categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="initialAmount">Monto Inicial</Label>
                    <Input
                        type="number"
                        id="initialAmount"
                        value={initialAmount}
                        onChange={(e) => setInitialAmount(e.target.value)}
                        placeholder="Monto inicial"
                        min="0"
                        required
                    />
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <StyledButton color="secondary" onClick={toggle}>
                    Cancelar
                </StyledButton>
                <StyledButton color="primary" type="submit">
                    {budget && Object.keys(budget).length > 0
                        ? "Guardar Cambios"
                        : "Crear"}
                </StyledButton>
            </ModalFooter>
        </Form>
    </StyledModal>
);
};

export default CreateBudgetModal;

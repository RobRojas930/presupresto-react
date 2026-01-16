import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { fetchCategories } from "../store/categoriesSlice";
import { useDispatch } from "react-redux";

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

const StyledModalBody = styled(ModalBody)`
  background: #f8f9fa;
`;

const StyledButton = styled(Button)`
  min-width: 100px;
`;

const categoriesList = [
  "Alimentación",
  "Transporte",
  "Entretenimiento",
  "Salud",
  "Educación",
  "Otros",
];

const CreateTransactionsModal = ({ isOpen, toggle, transaction, onSave }) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categories, setCategories] = useState([]);
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const dispatch = useDispatch();

  const fetchData = async () => {
    const data = await dispatch(fetchCategories());
    if (fetchCategories.fulfilled.match(data)) {
      console.log("Dashboard data fetched:", data.payload);
      setCategories(data.payload);
    } else {
      console.error("Error fetching dashboard data:", data.error);
      setCategories(null);
    }
  };
  useEffect(() => {
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (transaction) {
      setTitulo(transaction.title || "");
      setDescripcion(transaction.description || "");
      setCategories([]);
      setMonto(transaction.amount || "");
      setFecha(transaction.date ? transaction.date.slice(0, 10) : "");
    } else {
      setTitulo("");
      setDescripcion("");
      setCategories([]);
      setMonto("");
      setFecha("");
    }
  }, [transaction, isOpen]);

  const handleSave = () => {
    if (!titulo || !monto || !fecha) {
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Por favor completa título, monto y fecha.",
      });
      return;
    }
    const newTransaction = {
      titulo,
      descripcion,
      categories,
      monto,
      fecha,
    };
    onSave(newTransaction);
    Swal.fire({
      icon: "success",
      title: transaction ? "Transacción editada" : "Transacción creada",
      showConfirmButton: false,
      timer: 1500,
    });
    toggle();
  };

  const handleCancel = () => {
    Swal.fire({
      title: "¿Cancelar?",
      text: "Se perderán los cambios realizados.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        toggle();
      }
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {transaction ? "Editar Transacción" : "Crear Transacción"}
      </ModalHeader>
      <StyledModalBody>
        <Form>
          <FormGroup>
            <Label for="titulo">Título*</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título"
            />
          </FormGroup>
          <FormGroup>
            <Label for="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción"
            />
          </FormGroup>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>
              {selectedCategory
                ? selectedCategory.name
                : "Selecciona una categoría"}
            </DropdownToggle>
            <DropdownMenu>
              {categories &&
                categories.map((cat) => (
                  <DropdownItem
                    key={cat._id || cat.categoryId}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat.name}
                  </DropdownItem>
                ))}
            </DropdownMenu>
          </Dropdown>
          <FormGroup>
            <Label for="monto">Monto*</Label>
            <Input
              id="monto"
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Monto"
              min="0"
            />
          </FormGroup>
          <FormGroup>
            <Label for="fecha">Fecha*</Label>
            <Input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </FormGroup>
        </Form>
      </StyledModalBody>
      <ModalFooter>
        <StyledButton color="primary" onClick={handleSave}>
          {transaction ? "Editar" : "Crear"}
        </StyledButton>
        <StyledButton color="secondary" onClick={handleCancel}>
          Cancelar
        </StyledButton>
      </ModalFooter>
    </Modal>
  );
};

export default CreateTransactionsModal;

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { fetchCategories } from "../store/categoriesSlice";
import { useDispatch } from "react-redux";
import { getIconByCode } from "../utils/icons"; // Assume this is a mapping of icon names to FontAwesome classes
import { icons } from "../utils/icons"; // Assume this exports an object mapping icon names to FontAwesome classes
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#E7E9ED",
  "#43A047",
];

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 2rem;
  min-width: 350px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  margin-top: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-weight: 500;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  resize: vertical;
`;

const IconDropdown = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const IconPreview = styled.i`
  font-size: 1.5rem;
`;

const ColorSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ColorDot = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${(props) => (props.selected ? "#333" : "transparent")};
  background: ${(props) => props.color};
  cursor: pointer;
  transition: border 0.2s;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1.2rem;
  border-radius: 5px;
  border: none;
  background: ${(props) => (props.primary ? "#36A2EB" : "#eee")};
  color: ${(props) => (props.primary ? "#fff" : "#333")};
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: ${(props) => (props.primary ? "#2580c3" : "#ddd")};
  }
`;

const CreateCategoryModal = ({ isOpen, onClose, onSave, onEdit, category }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const user = localStorage.getItem("user");
  const parsedUser = JSON.parse(user);
  const userId = parsedUser.data.id || parsedUser.data._id;

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
      setIcon(category.icon || "");
      setColor(category.color || COLORS[0]);
    } else {
      setName("");
      setDescription("");
      setIcon("");
      setColor(COLORS[0]);
    }
  }, [category, isOpen]);

  const handleSubmit = (e) => {
    const newCategory = {
      id: category ? category._id : '',
      userId: userId,
      name,
      description,
      icon,
      color,
    };

    e.preventDefault();
    if (category) {
      onEdit(newCategory);
    } else {
      onSave(newCategory);
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay>
      <Modal>
        <Title>{category ? "Editar Categoría" : "Crear Categoría"}</Title>
        <Form onSubmit={handleSubmit}>
          <Label>
            Título:
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Label>
          <Label>
            Descripción:
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Label>
          <Label>
            Icono:
            <IconDropdown>
              <Select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                required
              >
                <option value="">Selecciona un icono</option>
                {icons.map((iconData) => (
                  <option key={iconData.code} value={iconData.code}>
                    <FontAwesomeIcon icon={iconData.icon} /> {iconData.title}
                  </option>
                ))}
              </Select>
              {icon && <IconPreview className={`fa ${icon}`} />}
            </IconDropdown>
          </Label>
          <Label>
            Color:
            <ColorSelector>
              {COLORS.map((c) => (
                <ColorDot
                  key={c}
                  color={c}
                  selected={color === c}
                  onClick={() => setColor(c)}
                />
              ))}
            </ColorSelector>
          </Label>
          <Actions>
            <Button type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" primary>
              {category ? "Guardar" : "Crear"}
            </Button>
          </Actions>
        </Form>
      </Modal>
    </Overlay>
  );
};

CreateCategoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  category: PropTypes.object,
};

export default CreateCategoryModal;

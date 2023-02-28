import styled from "styled-components";
import Select, {
  components as Components,
  MultiValueGenericProps,
  MultiValueProps,
  OnChangeValue,
  Props
} from "react-select";
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortEndHandler,
  SortableHandle
} from "react-sortable-hoc";

const ValuesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const Value = styled.div`
  padding: 0.3rem 0.5rem 0.3rem 0.5rem;
  margin: 0 0.55rem 0.55rem 0;
  font-size: 0.75rem;
  color: black;
  background-color: rgba(247, 173, 46, 0.6);
  user-select: none;
`;

const XButton = styled.button`
  all: unset;
  margin-left: 0.3rem;
  color: black;
  transition: fill 0.15s ease-in-out;
  cursor: pointer;
  &:hover {
    color: #bb392d;
  }
  &:focus {
    color: #c82f21;
  }
`;

const OptionsOutsideSelect = (props) => {
  const { isMulti, value, onChange } = props;

  const handleRemoveValue = (e) => {
    if (!onChange) return;
    const { name: buttonName } = e.currentTarget;
    const removedValue = value.find((val) => val.value === buttonName);
    if (!removedValue) return;
    onChange(
      value.filter((val) => val.value !== buttonName),
      { name, action: "remove-value", removedValue }
    );
  };

  return (
    <div>
      <ValuesContainer>
        {isMulti
          ? value.map((val) => (
              <Value key={val.value}>
                {val.label}
                <XButton name={val.value} onClick={handleRemoveValue}>
                  ✕
                </XButton>
              </Value>
            ))
          : null}
      </ValuesContainer>
      <Select {...props} controlShouldRenderValue={!isMulti} />
    </div>
  );
};

export default OptionsOutsideSelect;

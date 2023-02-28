import React, { MouseEventHandler, useState } from "react";
import Select, {
  components,
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
import OptionsOutsideSelect from "./OptionsOutsideSelect";
import allergens from "./allergens";

import "./styles.css";

function arrayMove(array, from, to) {
  const slicedArray = array.slice();
  slicedArray.splice(
    to < 0 ? array.length + to : to,
    0,
    slicedArray.splice(from, 1)[0]
  );
  return slicedArray;
}

const SortableMultiValue = SortableElement((props) => {
  // this prevents the menu from being opened/closed when the user clicks
  // on a value to begin dragging it. ideally, detecting a click (instead of
  // a drag) would still focus the control and toggle the menu, but that
  // requires some magic with refs that are out of scope for this example
  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const innerProps = { ...props.innerProps, onMouseDown };
  return <components.MultiValue {...props} innerProps={innerProps} />;
});

const SortableMultiValueLabel = SortableHandle((props) => (
  <components.MultiValueLabel {...props} />
));

const SortableSelect = SortableContainer(Select);

export default function App() {
  const [selected, setSelected] = useState([]);

  const handleSelectChange = (values) => {
    setSelected(values);
  };

  const handleRemoveValue = (e) => {
    const { name: buttonName } = e.currentTarget;
    const removedValue = selected.find((val) => val.value === buttonName);
    if (!removedValue) return;
    handleSelectChange(
      selected.filter((val) => val.value !== buttonName),
      { name, action: "remove-value", removedValue }
    );
  };
  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newValue = arrayMove(selected, oldIndex, newIndex);
    setSelected(newValue);
    console.log(
      "Values sorted:",
      newValue.map((i) => i.value)
    );
  };

  const SortableItem = SortableElement(({ value, label }) => (
    <div>
      {label}
      <button name={value} onClick={handleRemoveValue}>
        ✕
      </button>
    </div>
  ));

  const SortableList = SortableContainer(({ items }) => {
    return (
      <div>
        {items.map((val, index) => (
          <SortableItem
            key={val.value}
            index={index}
            value={val.value}
            label={val.label}
          />
        ))}
      </div>
    );
  });
  return (
    <div>
      {/* <h2>Default Select</h2>
      <Select
        onChange={handleSelectChange}
        isMulti
        options={allergens}
        value={selected}
      /> */}
      <SortableList items={selected} onSortEnd={onSortEnd} />
      <h2>Options Outside Select</h2>
      {/* <>
        {selected.map((val) => (
          <div key={val.value}>
            {val.label}
            <button name={val.value} onClick={handleRemoveValue}>
              ✕
            </button>
          </div>
        ))}
      </> */}
      <SortableSelect
        useDragHandle
        // react-sortable-hoc props:
        axis="xy"
        onSortEnd={onSortEnd}
        distance={4}
        // small fix for https://github.com/clauderic/react-sortable-hoc/pull/352:
        getHelperDimensions={({ node }) => node.getBoundingClientRect()}
        // react-select props:
        isMulti
        options={allergens}
        value={selected}
        onChange={handleSelectChange}
        components={{
          // @ts-ignore We're failing to provide a required index prop to SortableElement
          MultiValue: SortableMultiValue,
          MultiValueLabel: SortableMultiValueLabel
        }}
        closeMenuOnSelect={false}
      />
    </div>
  );
}

import React from "react";
import useAutocomplete from "@mui/material/useAutocomplete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { autocompleteClasses } from "@mui/material/Autocomplete";

const Root = styled("div")(() => ({
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
}));

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  font-weight: 600;
  color: #294a29;
  display: block;
`;

const InputWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  minHeight: "44px",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  borderRadius: "8px",
  padding: "6px",
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
  alignItems: "center",

  boxSizing: "border-box",
  "&.focused": {
    borderColor: "#A2CB75",
    boxShadow: "0 0 0 2px rgba(162, 203, 117, 0.3)",
  },
  "& input": {
    flexGrow: 1,
    minWidth: "60px",
    border: 0,
    outline: 0,
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    padding: "4px 6px",
  },
}));

const StyledTag = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  height: 28,
  margin: "2px",
  padding: "0 8px",
  backgroundColor: "#EAF4DB",
  borderRadius: "16px",
  color: "#294A29",
  fontWeight: 500,
  fontSize: "13px",
  "& svg": {
    fontSize: 16,
    marginLeft: 6,
    cursor: "pointer",
  },
}));

const Listbox = styled("ul")(() => ({
  margin: 0,
  padding: 0,
  position: "absolute",
  listStyle: "none",
  backgroundColor: "#fff",
  border: "1px solid rgba(0,0,0,0.1)",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  maxHeight: 240,
  overflowY: "auto",
  zIndex: 2,
  "& li": {
    padding: "8px 12px",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    color: "#294A29",
    cursor: "pointer",
  },
  '& li[aria-selected="true"]': {
    backgroundColor: "#F5FBEF",
    fontWeight: 600,
    "& svg": {
      color: "#A2CB75",
    },
  },
  [`& li.${autocompleteClasses.focused}`]: {
    backgroundColor: "#F0F8E8",
  },
}));

export default function ModuleSelect({ options, value, onChange }) {
  const {
    getRootProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "module-select",
    multiple: true,
    options,
    value,
    getOptionLabel: (option) => option,
    onChange: (event, newValue) => {
      if (newValue.length <= 10) {
        onChange(newValue);
      } else {
        alert("Maximum of 10 modules");
      }
    },
  });

  return (
    <Root>
      <div {...getRootProps()}>
        <Label>Modules You Can Teach</Label>
        <InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
          {value.map((option, index) => {
            const { key, onDelete, ...tagProps } = getTagProps({ index });
            return (
              <StyledTag key={key} {...tagProps} label={option}>
                <span>{option}</span>
                <CloseIcon onClick={onDelete} />
              </StyledTag>
            );
          })}
          <input {...getInputProps()} />
        </InputWrapper>
      </div>
      {groupedOptions.length > 0 && (
        <Listbox {...getListboxProps()}>
          {groupedOptions.map((option, index) => (
            <li key={option} {...getOptionProps({ option, index })}>
              <span>{option}</span>
              {value.includes(option) && <CheckIcon fontSize="small" />}
            </li>
          ))}
        </Listbox>
      )}
    </Root>
  );
}

import React, { useState, useEffect } from 'react';
import { Select } from '@instructure/ui-select';
import PropTypes from 'prop-types';

const proptypes = {
  options: PropTypes.any.isRequired,
  isGroup: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

const getOptionById = (queryId, options, isGroup = false) => {
  if (!isGroup) return options.find(({ id }) => id === queryId);
  let match = null;
  Object.keys(options).forEach((key, index) => {
    for (let i = 0; i < options[key].length; i += 1) {
      const option = options[key][i];
      if (queryId === option.id) {
        // Return group property with the object just to make it easier
        // to check which group the option belongs to
        match = { ...option, group: key };
        break;
      }
    }
  });
  return match;
};

const filterOptions = (value, options, isGroup = false) => {
  if (!isGroup) {
    return options.filter(option =>
      option.label.toLowerCase().startsWith(value.toLowerCase())
    );
  }
  const filteredOptions = {};
  Object.entries(options).forEach(([year, terms]) => {
    console.log('filterOptions');
    if (year.startsWith(value)) {
      filteredOptions[year] = terms;
    } else {
      const filteredTerms = terms.filter(option =>
        option.label.toLowerCase().startsWith(value.toLowerCase())
      );
      if (filteredTerms.length > 0) filteredOptions[year] = filteredTerms;
    }
  });
  return filteredOptions;
};

const handleShowOptions = setIsShowingOptions => {
  setIsShowingOptions(true);
};
const matchValue = (
  filteredOptions,
  inputValue,
  highlightedOptionId,
  selectedOptionId,
  options,
  isGroup = false,
  setInputValue,
  setSelectedOptionId,
  setFilteredOptions
) => {
  // An option matching user input exists
  if (filteredOptions.length === 1) {
    const onlyOption = filteredOptions[0];
    // Automatically select the matching option
    if (onlyOption.label.toLowerCase() === inputValue.toLowerCase()) {
      setInputValue(onlyOption.label);
      setSelectedOptionId(onlyOption.id);
      setFilteredOptions(filterOptions('', options, isGroup));
    }
  }
  // Allow user to return to empty input and no selection
  if (inputValue.length === 0) {
    setSelectedOptionId(null);
  }
  // No match found, return selected option label to input
  if (selectedOptionId) {
    const selectedOption = getOptionById(selectedOptionId, options, isGroup);
    setInputValue(selectedOption.label);
  }
  // Input value is from highlighted option, not user input
  // clear input, reset options
  if (highlightedOptionId) {
    if (
      inputValue === getOptionById(highlightedOptionId, options, isGroup).label
    ) {
      setInputValue('');
      setFilteredOptions(filterOptions('', options, isGroup));
    }
  }
};

const handleHideOptions = (
  filteredOptions,
  inputValue,
  highlightedOptionId,
  selectedOptionId,
  options,
  isGroup,
  setIsShowingOptions,
  setHighlightedOptionId,
  setInputValue,
  setSelectedOptionId,
  setFilteredOptions
) => {
  setIsShowingOptions(false);
  setHighlightedOptionId(null);
  debugger;
  matchValue(
    filteredOptions,
    inputValue,
    null,
    selectedOptionId,
    options,
    isGroup,
    setInputValue,
    setSelectedOptionId,
    setFilteredOptions
  );
};

const handleBlur = setHighlightedOptionId => {
  setHighlightedOptionId(null);
};

const handleHighlightOption = (
  event,
  id,
  options,
  isGroup = false,
  setHighlightedOptionId,
  setInputValue,
  inputValue
) => {
  event.persist();
  const option = getOptionById(id, options, isGroup);
  if (!option) return; // Prevent highlighting of empty option
  setHighlightedOptionId(id);
  setInputValue(event.type === 'keydown' ? option.label : inputValue);
};

const handleSelectOption = (
  event,
  id,
  options,
  isGroup = false,
  setSelectedOptionId,
  setInputValue,
  setIsShowingOptions,
  setFilteredOptions,
  onSelect
) => {
  const option = getOptionById(id, options, isGroup);
  if (!option) return; // Prevent selecting of empty option
  setSelectedOptionId(id);
  setInputValue(option.label);
  setIsShowingOptions(false);
  setFilteredOptions(options);
  onSelect(option);
  //
};

const handleInputChange = (
  event,
  options,
  isGroup = false,
  setInputValue,
  setFilteredOptions,
  setHighlightedOptionId,
  setIsShowingOptions,
  setSelectedOptionId,
  selectedOptionId
) => {
  const { value } = event.target;
  const newOptions = filterOptions(value, options, isGroup);
  let highlightedOptionId = null;
  if (!isGroup) {
    highlightedOptionId = newOptions.length > 0 ? newOptions[0].id : null;
  } else {
    const groups = Object.keys(newOptions);
    highlightedOptionId =
      groups.length > 0 ? newOptions[groups[0]][0].id : null;
  }
  setInputValue(value);
  setFilteredOptions(newOptions);
  setHighlightedOptionId(highlightedOptionId);
  setIsShowingOptions(true);
  setSelectedOptionId(value === '' ? null : selectedOptionId);
};

const renderGroup = (highlightedOptionId, selectedOptionId, filteredOptions) =>
  Object.keys(filteredOptions).map((key, index) => (
    <Select.Group key={index} renderLabel={key}>
      {filteredOptions[key].map(option => (
        <Select.Option
          key={option.id}
          id={option.id}
          isHighlighted={option.id === highlightedOptionId}
          isSelected={option.id === selectedOptionId}
        >
          {option.label}
        </Select.Option>
      ))}
    </Select.Group>
  ));

const renderOptions = (
  highlightedOptionId,
  selectedOptionId,
  filteredOptions
) => (
  <>
    {filteredOptions.length > 0 ? (
      filteredOptions.map(option => (
        <Select.Option
          id={option.id}
          key={option.id}
          isHighlighted={option.id === highlightedOptionId}
          isSelected={option.id === selectedOptionId}
          isDisabled={option.disabled}
        >
          {!option.disabled ? option.label : `${option.label} (unavailable)`}
        </Select.Option>
      ))
    ) : (
      <Select.Option id="empty-option" key="empty-option">
        ---
      </Select.Option>
    )}
  </>
);

/**
 * @param root0
 * @param root0.options
 * @param root0.isGroup
 * @param root0.onSelect
 */
function SelectCompleteForm({ options = [], isGroup = false, onSelect }) {
  const [inputValue, setInputValue] = useState('');
  const [isShowingOptions, setIsShowingOptions] = useState(false);
  const [highlightedOptionId, setHighlightedOptionId] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState(options);
  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  return (
    <div>
      <Select
        renderLabel="Terms auto complete"
        placeholder="Start typing to search..."
        inputValue={inputValue}
        isShowingOptions={isShowingOptions}
        onBlur={e => {
          handleBlur(setHighlightedOptionId);
        }}
        onInputChange={e => {
          handleInputChange(
            e,
            options,
            isGroup,
            setInputValue,
            setFilteredOptions,
            setHighlightedOptionId,
            setIsShowingOptions,
            setSelectedOptionId,
            selectedOptionId
          );
        }}
        onRequestShowOptions={e => {
          handleShowOptions(setIsShowingOptions);
        }}
        onRequestHideOptions={e => {
          handleHideOptions(
            filteredOptions,
            inputValue,
            highlightedOptionId,
            selectedOptionId,
            options,
            isGroup,
            setIsShowingOptions,
            setHighlightedOptionId,
            setInputValue,
            setSelectedOptionId,
            setFilteredOptions
          );
        }}
        onRequestHighlightOption={(e, { id }) => {
          handleHighlightOption(
            e,
            id,
            options,
            isGroup,
            setHighlightedOptionId,
            setInputValue,
            inputValue
          );
        }}
        onRequestSelectOption={(e, { id }) => {
          handleSelectOption(
            e,
            id,
            options,
            isGroup,
            setSelectedOptionId,
            setInputValue,
            setIsShowingOptions,
            setFilteredOptions,
            onSelect
          );
        }}
      >
        {isGroup
          ? renderGroup(highlightedOptionId, selectedOptionId, filteredOptions)
          : renderOptions(
              highlightedOptionId,
              selectedOptionId,
              filteredOptions
            )}
      </Select>
    </div>
  );
}
export default SelectCompleteForm;

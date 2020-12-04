import React, { useState, useEffect, useRef } from 'react';
import { Select } from '@instructure/ui-select';
import PropTypes from 'prop-types';

const proptypes = {
  options: PropTypes.any.isRequired,
  renderLabel: PropTypes.string.isRequired,
  isGroup: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

/**
 * @param {Array} root0 root0
 * @param {Array} root0.options options
 * @param {number} root0.isGroup isGroup
 * @param {number} root0.onSelect onSelect
 * @param {string} root0.renderLabel renderLabel
 * @returns {object} SelectCompleteForm
 */
function SelectCompleteForm({
  options = [],
  renderLabel = 'Select',
  isGroup = false,
  onSelect,
}) {
  const [inputValue, setInputValue] = useState('');
  const [isShowingOptions, setIsShowingOptions] = useState(false);
  const [highlightedOptionId, setHighlightedOptionId] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState(options);
  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const localRef = useRef(null);

  const getOptionById = (queryId) => {
    if (!isGroup) return options.find(({ id }) => id === queryId);
    let match = null;
    Object.keys(options).forEach((key) => {
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

  const filterOptions = (value) => {
    if (!isGroup) {
      return options.filter((option) =>
        option.label.toLowerCase().includes(value.toLowerCase())
      );
    }
    Object.entries(options).forEach(([year, terms]) => {
      if (year.startsWith(value)) {
        filteredOptions[year] = terms;
      } else {
        const filteredTerms = terms.filter((option) =>
          option.label.toLowerCase().startsWith(value.toLowerCase())
        );
        if (filteredTerms.length > 0) filteredOptions[year] = filteredTerms;
      }
    });
    return filteredOptions;
  };

  const handleShowOptions = () => {
    setIsShowingOptions(true);
  };
  const matchValue = () => {
    // An option matching user input exists
    if (filteredOptions.length === 1) {
      const onlyOption = filteredOptions[0];
      // Automatically select the matching option
      if (onlyOption.label.toLowerCase() === inputValue.toLowerCase()) {
        setInputValue(onlyOption.label);
        setSelectedOptionId(onlyOption.id);
        setFilteredOptions(filterOptions(''));
        return;
      }
    }
    // Allow user to return to empty input and no selection
    if (inputValue.length === 0) {
      setSelectedOptionId(null);
      return;
    }
    // No match found, return selected option label to input
    if (selectedOptionId) {
      const selectedOption = getOptionById(selectedOptionId);
      setInputValue(selectedOption.label);
      return;
    }
    // Input value is from highlighted option, not user input
    // clear input, reset options
    if (highlightedOptionId) {
      if (inputValue === getOptionById(highlightedOptionId).label) {
        setInputValue('');
        setFilteredOptions(filterOptions(''));
      }
    }
  };

  const handleHideOptions = () => {
    setIsShowingOptions(false);
    setHighlightedOptionId(null);
    matchValue();
  };

  const handleBlur = () => {
    setHighlightedOptionId(null);
  };

  const handleHighlightOption = (event, id) => {
    event.persist();
    const option = getOptionById(id);
    if (!option) return; // Prevent highlighting of empty option
    setHighlightedOptionId(id);
    setInputValue(event.type === 'keydown' ? option.label : inputValue);
  };

  const handleSelectOption = (event, id) => {
    const option = getOptionById(id);
    if (!option) return; // Prevent selecting of empty option
    setSelectedOptionId(id);
    setInputValue(option.label);
    setIsShowingOptions(false);
    setFilteredOptions(options);
    onSelect(option);
    //
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    const newOptions = filterOptions(value);
    let newHighlightedOptionId = null;
    if (!isGroup) {
      newHighlightedOptionId = newOptions.length > 0 ? newOptions[0].id : null;
    } else {
      const groups = Object.keys(newOptions);
      newHighlightedOptionId =
        groups.length > 0 ? newOptions[groups[0]][0].id : null;
    }
    setInputValue(value);
    setFilteredOptions(newOptions);
    setHighlightedOptionId(newHighlightedOptionId);
    setIsShowingOptions(true);
    setSelectedOptionId(value === '' ? null : selectedOptionId);
  };

  const renderGroup = () =>
    Object.keys(filteredOptions).map((key, index) => (
      <Select.Group key={index} renderLabel={key}>
        {filteredOptions[key].map((option) => (
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

  const renderOptions = () => {
    const newOptions = filteredOptions.map((option) => (
      <Select.Option
        id={option.id}
        key={option.id}
        isHighlighted={option.id === highlightedOptionId}
        isSelected={option.id === selectedOptionId}
      >
        {option.label}
      </Select.Option>
    ));
    if (newOptions.length === 0)
      return (
        <Select.Option id="empty-option" key="empty-option">
          ---
        </Select.Option>
      );
    return newOptions;
  };

  return (
    <div>
      <Select
        renderLabel={renderLabel}
        placeholder="Start typing to search..."
        inputValue={inputValue}
        isShowingOptions={isShowingOptions}
        inputRef={(el) => {
          localRef.current = el;
        }}
        onBlur={() => {
          handleBlur();
        }}
        onInputChange={(e) => {
          handleInputChange(e);
        }}
        onRequestShowOptions={() => {
          handleShowOptions();
        }}
        onRequestHideOptions={() => {
          handleHideOptions();
        }}
        onRequestHighlightOption={(e, { id }) => {
          handleHighlightOption(e, id);
        }}
        onRequestSelectOption={(e, { id }) => {
          handleSelectOption(e, id);
        }}
      >
        {isGroup ? renderGroup() : renderOptions()}
      </Select>
    </div>
  );
}
SelectCompleteForm.propTypes = proptypes;
export default SelectCompleteForm;

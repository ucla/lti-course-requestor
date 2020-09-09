/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from 'react';
import { Selectable } from '@instructure/ui-selectable';
import PropTypes from 'prop-types';

const proptypes = {
  options: PropTypes.array.isRequired,
  isDisabled: PropTypes.bool,
};

const filterOptions = (value, options) =>
  options.filter(option =>
    option.label.toLowerCase().startsWith(value.toLowerCase())
  );

const getOptionIndex = (
  direction,
  id,
  from,
  filteredOptions,
  highlightedOptionId
) => {
  const options = from || filteredOptions;
  let index;

  for (let i = 0; i <= options.length - 1; i += 1) {
    if (typeof id === 'undefined') {
      if (highlightedOptionId === options[i].id) {
        index = i + direction;
        if (index < 0) {
          index = 0;
        } else if (index >= options.length - 1) {
          index = options.length - 1;
        }
        break;
      }
    } else if (id === options[i].id) {
      index = i;
      break;
    }
  }
  return index;
};

const matchValue = (
  filteredOptions,
  inputValue,
  selectedOptionId,
  options,
  highlightedOptionId,
  setInputValue,
  setSelectedOptionId
) => {
  if (filteredOptions.length === 1) {
    if (filteredOptions[0].label.toLowerCase() === inputValue.toLowerCase()) {
      // Return {
      //   inputValue: filteredOptions[0].label,
      //   selectedOptionId: filteredOptions[0].id,
      // };
      setInputValue(filteredOptions[0].label);
      setSelectedOptionId(filteredOptions[0].id);
    }
  }
  const index = getOptionIndex(
    null,
    selectedOptionId,
    options,
    filteredOptions,
    highlightedOptionId
  );
  setInputValue(options[index].label);
};

const getInputStyles = () => ({
  display: 'block',
  width: '250px',
  padding: '5px',
});

const getListStyles = isShowingOptions => ({
  background: 'white',
  listStyle: 'none',
  padding: 0,
  margin: 0,
  border: isShowingOptions && 'solid 1px lightgray',
});

const getOptionStyles = (option, selectedOptionId, highlightedOptionId) => {
  const selected = selectedOptionId === option.id;
  const highlighted = highlightedOptionId === option.id;
  let background = 'transparent';
  if (selected) {
    background = 'lightgray';
  } else if (highlighted) {
    background = '#eeeeee';
  }
  return {
    background,
    padding: '0 10px',
  };
};

const getHandlers = (
  isDisabled,
  options,
  isShowingOptions,
  selectedOptionId,
  highlightedOptionId,
  inputValue,
  filteredOptions,
  setIsShowingOptions,
  setSelectedOptionId,
  setHighlightedOptionId,
  setInputValue,
  setFilteredOptions,
  onSelect
) =>
  isDisabled
    ? {}
    : {
        onRequestShowOptions: e => {
          setIsShowingOptions(true);
          setHighlightedOptionId(filteredOptions[0].id);
        },
        onRequestHideOptions: e => {
          const index = getOptionIndex(
            null,
            selectedOptionId,
            options,
            filteredOptions,
            highlightedOptionId
          );
          setIsShowingOptions(false);
          setInputValue(options[index].label);
          setFilteredOptions(options);
          setHighlightedOptionId(null);
        },
        onRequestHighlightOption: (e, { id, direction }) => {
          const index = getOptionIndex(
            direction,
            id,
            options,
            filteredOptions,
            highlightedOptionId
          );
          setHighlightedOptionId(
            filteredOptions[index] ? filteredOptions[index].id : null
          );
          setInputValue(
            direction && filteredOptions[index]
              ? filteredOptions[index].label
              : inputValue
          );
          setHighlightedOptionId();
        },
        onRequestSelectOption: (e, { id }) => {
          const index = getOptionIndex(
            null,
            id,
            null,
            filteredOptions,
            highlightedOptionId
          );
          setSelectedOptionId(id);
          setInputValue(filteredOptions[index].label);
          setFilteredOptions(options);
          setIsShowingOptions(false);
          setHighlightedOptionId(null);
          onSelect(filteredOptions[index]);
        },
      };
/**
 * @param root0
 * @param root0.options
 * @param root0.isDisabled
 * @param root0.onSelect
 */
function CustomSelect({ options = [], isDisabled, onSelect }) {
  const [isShowingOptions, setIsShowingOptions] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [highlightedOptionId, setHighlightedOptionId] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    if (options) {
      const emptyOption = {
        id: '--',
        value: '--',
        label: '',
      };
      options.unshift(emptyOption);
      setFilteredOptions(options);
      setSelectedOptionId(options[0].id);
      setInputValue(options[0].label);
      setHighlightedOptionId(options[0].id);
    }
  }, [options]);

  const localRef = useRef(null);

  return (
    <Selectable
      isShowingOptions={isShowingOptions}
      highlightedOptionId={highlightedOptionId}
      selectedOptionId={selectedOptionId || null}
      {...getHandlers(
        isDisabled,
        options,
        isShowingOptions,
        selectedOptionId,
        highlightedOptionId,
        inputValue,
        filteredOptions,
        setIsShowingOptions,
        setSelectedOptionId,
        setHighlightedOptionId,
        setInputValue,
        setFilteredOptions,
        onSelect
      )}
    >
      {({
        getRootProps,
        getLabelProps,
        getInputProps,
        getTriggerProps,
        getListProps,
        getOptionProps,
      }) => (
        <span
          style={{ display: 'inline-block' }}
          {...getRootProps({
            ref: el => {
              localRef.current = el;
            },
          })}
        >
          <label {...getLabelProps()}>Subject Area</label>
          <input
            style={getInputStyles()}
            {...getInputProps()}
            {...getTriggerProps({
              type: 'text',
              value: inputValue,
              onChange: e => {
                const newOptions = filterOptions(e.target.value, options);
                setInputValue(e.target.value);
                setFilteredOptions(newOptions);
                setIsShowingOptions(true);
                setHighlightedOptionId(newOptions[0] ? newOptions[0].id : null);
              },
              onBlur: () => {
                setFilteredOptions(options);
                setHighlightedOptionId(null);
                setIsShowingOptions(false);
                matchValue(
                  filteredOptions,
                  inputValue,
                  selectedOptionId,
                  options,
                  highlightedOptionId,
                  setInputValue,
                  setSelectedOptionId
                );
              },
            })}
          />
          <ul style={getListStyles(isShowingOptions)} {...getListProps()}>
            {isShowingOptions &&
              filteredOptions.map(option => (
                <li
                  key={option.id}
                  style={getOptionStyles(
                    option,
                    selectedOptionId,
                    highlightedOptionId
                  )}
                  {...getOptionProps({ id: option.id })}
                >
                  {option.label}
                </li>
              ))}
          </ul>
        </span>
      )}
    </Selectable>
  );
}
CustomSelect.propTypes = proptypes;
export default CustomSelect;

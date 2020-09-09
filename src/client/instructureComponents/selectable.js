/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from 'react';
import { Selectable } from '@instructure/ui-selectable';
import PropTypes from 'prop-types';

const proptypes = {
  options: PropTypes.array.isRequired,
  isDisabled: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
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

  const filterOptions = value =>
    options.filter(option =>
      option.label.toLowerCase().startsWith(value.toLowerCase())
    );

  const getOptionIndex = (direction, id, from) => {
    const newOptions = from || filteredOptions;
    let index;

    for (let i = 0; i <= newOptions.length - 1; i += 1) {
      if (typeof id === 'undefined') {
        if (highlightedOptionId === newOptions[i].id) {
          index = i + direction;
          if (index < 0) {
            index = 0;
          } else if (index >= newOptions.length - 1) {
            index = newOptions.length - 1;
          }
          break;
        }
      } else if (id === newOptions[i].id) {
        index = i;
        break;
      }
    }
    return index;
  };

  const matchValue = () => {
    if (filteredOptions.length === 1) {
      if (filteredOptions[0].label.toLowerCase() === inputValue.toLowerCase()) {
        setInputValue(filteredOptions[0].label);
        setSelectedOptionId(filteredOptions[0].id);
        return;
      }
    }
    const index = getOptionIndex(null, selectedOptionId);
    setInputValue(options[index].label);
  };

  const getInputStyles = () => ({
    display: 'block',
    width: '250px',
    padding: '5px',
  });

  const getListStyles = () => ({
    background: 'white',
    listStyle: 'none',
    padding: 0,
    margin: 0,
    border: isShowingOptions && 'solid 1px lightgray',
  });

  const getOptionStyles = option => {
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

  const getHandlers = () =>
    isDisabled
      ? {}
      : {
          onRequestShowOptions: e => {
            setIsShowingOptions(true);
            setHighlightedOptionId(filteredOptions[0].id);
          },
          onRequestHideOptions: e => {
            const index = getOptionIndex(null, selectedOptionId);
            setIsShowingOptions(false);
            setInputValue(options[index].label);
            setFilteredOptions(options);
            setHighlightedOptionId(null);
          },
          onRequestHighlightOption: (e, { id, direction }) => {
            const index = getOptionIndex(direction, id);
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
            // Here I was passing null for the value of 'options'
            const index = getOptionIndex(null, id);
            setSelectedOptionId(id);
            setInputValue(filteredOptions[index].label);
            setFilteredOptions(options);
            setIsShowingOptions(false);
            setHighlightedOptionId(null);
            onSelect(filteredOptions[index]);
          },
        };

  return (
    <Selectable
      isShowingOptions={isShowingOptions}
      highlightedOptionId={highlightedOptionId}
      selectedOptionId={selectedOptionId || null}
      {...getHandlers()}
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
                const newOptions = filterOptions(e.target.value);
                setInputValue(e.target.value);
                setFilteredOptions(newOptions);
                setIsShowingOptions(true);
                setHighlightedOptionId(newOptions[0] ? newOptions[0].id : null);
              },
              onBlur: () => {
                setFilteredOptions(options);
                setHighlightedOptionId(null);
                setIsShowingOptions(false);
                matchValue();
              },
            })}
          />
          <ul style={getListStyles()} {...getListProps()}>
            {isShowingOptions &&
              filteredOptions.map(option => (
                <li
                  key={option.id}
                  style={getOptionStyles(option)}
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

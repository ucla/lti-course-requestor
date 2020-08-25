import React, { Component } from 'react';

import { Select } from '@instructure/ui-select';
// Import Alert from '@instructure/ui-alerts';
// import {
//   IconUserSolid,
//   IconUserLine,
//   IconSearchLine,
// } from '@instructure/ui-icons';
import PropTypes from 'prop-types';

const proptypes = {
  options: PropTypes.any.isRequired,
  isGroup: PropTypes.bool,
};

class SelectCompleteForm extends Component {
  constructor() {
    super();
    this.state = {
      inputValue: '',
      isShowingOptions: false,
      highlightedOptionId: null,
      selectedOptionId: null,
      filteredOptions: [],
    };
  }

  componentDidMount() {
    const { options } = this.props;
    if (options) this.setState({ filteredOptions: options });
  }

  // Static getDerivedStateFromProps(props, state) {
  //   const { options } = props;
  //   const { defaultOptions } = state;
  //   if (options.length > 0 && options.length !== defaultOptions.length) {
  //     return {
  //       defaultOptions: options,
  //       filteredOptions: options,
  //     };
  //   }
  //   return null;
  // }

  getOptionById(queryId) {
    const { options, isGroup = false } = this.props;
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
  }

  getOptionsChangedMessage(newOptions) {
    const { filteredOptions, highlightedOptionId } = this.state;
    let message =
      newOptions.length !== filteredOptions.length
        ? `${newOptions.length} options available.` // Options changed, announce new total
        : null; // Options haven't changed, don't announce
    if (message && newOptions.length > 0) {
      // Options still available
      if (highlightedOptionId !== newOptions[0].id) {
        // Highlighted option hasn't been announced
        const option = this.getOptionById(newOptions[0].id).label;
        message = `${option}. ${message}`;
      }
    }
    return message;
  }

  filterOptions = value => {
    const { options, isGroup = false } = this.props;
    if (!isGroup) {
      return options.filter(option =>
        option.label.toLowerCase().startsWith(value.toLowerCase())
      );
    }
    const filteredOptions = {};
    Object.entries(options).forEach(([year, terms]) => {
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

  handleShowOptions = () => {
    this.setState(({ filteredOptions }) => ({
      isShowingOptions: true,
    }));
  };

  handleHideOptions = () => {
    this.setState({
      isShowingOptions: false,
      highlightedOptionId: null,
      ...this.matchValue(),
    });
  };

  handleBlur = () => {
    this.setState({ highlightedOptionId: null });
  };

  handleHighlightOption = (event, { id }) => {
    event.persist();
    const option = this.getOptionById(id);
    if (!option) return; // Prevent highlighting of empty option
    this.setState(state => ({
      highlightedOptionId: id,
      inputValue: event.type === 'keydown' ? option.label : state.inputValue,
    }));
  };

  handleSelectOption = (event, { id }) => {
    const option = this.getOptionById(id);
    if (!option) return; // Prevent selecting of empty option
    const { options } = this.props;
    this.setState({
      selectedOptionId: id,
      inputValue: option.label,
      isShowingOptions: false,
      filteredOptions: options,
    });
  };

  handleInputChange = event => {
    const { value } = event.target;
    const newOptions = this.filterOptions(value);
    const { isGroup } = this.props;
    let highlightedOptionId = null;
    if (!isGroup) {
      highlightedOptionId = newOptions.length > 0 ? newOptions[0].id : null;
    } else {
      const groups = Object.keys(newOptions);
      highlightedOptionId =
        groups.length > 0 ? newOptions[groups[0]][0].id : null;
    }

    this.setState(state => ({
      inputValue: value,
      filteredOptions: newOptions,
      highlightedOptionId,
      isShowingOptions: true,
      selectedOptionId: value === '' ? null : state.selectedOptionId,
    }));
  };

  matchValue() {
    const {
      filteredOptions,
      inputValue,
      highlightedOptionId,
      selectedOptionId,
    } = this.state;

    // An option matching user input exists
    if (filteredOptions.length === 1) {
      const onlyOption = filteredOptions[0];
      // Automatically select the matching option
      if (onlyOption.label.toLowerCase() === inputValue.toLowerCase()) {
        return {
          inputValue: onlyOption.label,
          selectedOptionId: onlyOption.id,
          filteredOptions: this.filterOptions(''),
        };
      }
    }
    // Allow user to return to empty input and no selection
    if (inputValue.length === 0) {
      return { selectedOptionId: null };
    }
    // No match found, return selected option label to input
    if (selectedOptionId) {
      const selectedOption = this.getOptionById(selectedOptionId);
      return { inputValue: selectedOption.label };
    }
    // Input value is from highlighted option, not user input
    // clear input, reset options
    if (highlightedOptionId) {
      if (inputValue === this.getOptionById(highlightedOptionId).label) {
        return {
          inputValue: '',
          filteredOptions: this.filterOptions(''),
        };
      }
    }
  }

  renderGroup() {
    const {
      highlightedOptionId,
      selectedOptionId,
      filteredOptions,
    } = this.state;

    return Object.keys(filteredOptions).map((key, index) => (
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
  }

  renderOptions() {
    const {
      highlightedOptionId,
      selectedOptionId,
      filteredOptions,
    } = this.state;

    return (
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
              {!option.disabled
                ? option.label
                : `${option.label} (unavailable)`}
            </Select.Option>
          ))
        ) : (
          <Select.Option id="empty-option" key="empty-option">
            ---
          </Select.Option>
        )}
      </>
    );
  }

  render() {
    const { inputValue, isShowingOptions } = this.state;
    const { isGroup } = this.props;
    return (
      <div>
        <Select
          renderLabel="Terms auto complete"
          placeholder="Start typing to search..."
          inputValue={inputValue}
          isShowingOptions={isShowingOptions}
          onBlur={this.handleBlur}
          onInputChange={this.handleInputChange}
          onRequestShowOptions={this.handleShowOptions}
          onRequestHideOptions={this.handleHideOptions}
          onRequestHighlightOption={this.handleHighlightOption}
          onRequestSelectOption={this.handleSelectOption}
        >
          {isGroup ? this.renderGroup() : this.renderOptions()}
        </Select>
      </div>
    );
  }
}
SelectCompleteForm.propTypes = proptypes;
export default SelectCompleteForm;

// Import PropTypes from 'prop-types';
import axios from 'axios';
import React, { Component } from 'react';
import { Select } from '@instructure/ui-select';
import { SimpleSelect } from '@instructure/ui-simple-select';
import { Button } from '@instructure/ui-buttons';
import { FormFieldGroup } from '@instructure/ui-form-field';
import { ToggleDetails } from '@instructure/ui-toggle-details';
import { Text } from '@instructure/ui-text';
import { ltikPromise } from '../services/ltik';

// Import PropTypes from 'prop-types';
// import { Children as ChildrenPropTypes } from '@instructure/ui-prop-types';
// import { Option } from './Option';
// import { Group } from './Group';
import SelectCompleteForm from './selectCompleteForm';
import CustomSelect from './selectable';

class IndexForm extends Component {
  // Static propTypes = {
  //   // PropTypes
  // };

  constructor(props) {
    super(props);

    // Const [terms, setTerms] = useState({});
    // const [toggled, setToggled] = useState(false);
    // const [session, setSessions] = useState({});
    // const [subjArea, setSubjAreas] = useState({});
    // const [suject, setSubjects] = useState({});

    this.state = {
      session: {},
      subjectareas: [],
      subject: '',
      expanded: false,
      terms: {},
    };
    // This.getAllTerms = this.getAllTerms.bind(this);
  }

  componentDidMount() {
    this.getAllTerms();
    this.getAllSessions();
    this.getAllSubjectAreas();
  }

  getAllTerms = () => {
    ltikPromise
      .then(
        ltik => {
          axios.get(`/api/forms/getTerms?ltik=${ltik}`).then(res => {
            const terms = res.data;
            // Const { terms } = responseData;
            this.setState({ terms });
          });
        },
        error => {
          console.log(error);
        }
      )
      .catch(error => {
        console.log(error);
      });
  };

  getAllSessions = () => {
    ltikPromise
      .then(
        ltik => {
          axios.post(`/api/forms/getSessions?ltik=${ltik}`).then(res => {
            // TermName = this.state.termName;
            // Axios.get(`/api/sessions/getSessions?ltik=${ltik}&termSelected=${termName}`)
            const sessions = res.data;
            this.setState({ sessions });
          });
        },
        error => {
          console.log(error);
        }
      )
      .catch(error => {
        console.log(error);
      });
  };

  getAllSubjectAreas = () => {
    ltikPromise
      .then(
        ltik => {
          axios.post(`/api/forms/getSubjectareas?ltik=${ltik}`).then(res => {
            const subjectareas = res.data;
            this.setState({ subjectareas });
          });
        },
        error => {
          console.log(error);
        }
      )
      .catch(error => {
        console.log(error);
      });
  };

  // The default parameter is event - event.target So, pass that.
  handleTermChange = event => {
    this.setState({
      term: event.target.value,
    });
  };

  handleSessionChange = event => {
    this.setState({
      session: event.target.value,
    });
  };

  handleSubjectAreaChange = event => {
    this.setState({
      subjectArea: event.target.value,
    });
  };

  handleSubjectChange = event => {
    this.setState({
      subject: event.target.value,
    });
  };

  handleSubmit = event => {
    const { term, session, subjectArea, subject } = this.state;
    alert(`${term} ${session} ${subjectArea} ${subject}`);
    event.preventDefault();
  };

  handleChange = (event, expanded) => this.setState({ expanded });

  handleToggle = () => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  };

  render() {
    const { sessions, subjectareas, subject, expanded, terms } = this.state;
    const isTermsEmpty = Object.keys(terms).length === 0;

    return (
      <FormFieldGroup
        description="To search for classes offered, select a term and search criterion from the drop-down menus, then click GO."
        colSpacing="medium"
        layout="columns"
        vAlign="top"
        onSubmit={this.handleSubmit}
      >
        <div>
          {!isTermsEmpty && <SelectCompleteForm options={terms} isGroup />}
        </div>
        <div>
          <SimpleSelect
            inputValue={sessions}
            renderLabel="Select a Session"
            onInputChange={this.handleSessiontChange}
          ></SimpleSelect>
          {/* <SimpleSelect
            renderLabel="Sessions"
            placeholder="Start typing to search..."
            onInputChange={this.handleSessiontChange}
            // OnChange={e => this.setState({ selectedSession: e.target.value })}
          >
            {this.sessions.map(session => (
              <Select.Option
                id={session.termSessionCode}
                value={session.termsessionGroupCode}
              >
                {session.termsessionGroupCode}
              </Select.Option>
            ))}
          </SimpleSelect> */}
        </div>
        <div>
          <SimpleSelect
            inputValue={subject}
            // Options={Options}
            renderLabel="Search Criteria"
            onInputChange={this.handleSubjectAreaChange}
          >
            <Select.Option id="one"> Subject Area </Select.Option>
          </SimpleSelect>
          <ToggleDetails
            summary="What is {subjectArea}"
            expanded={expanded}
            style={StyleSheet.ToggleDetails}
            onToggle={this.handleChange}
          >
            <Text weight="bold">
              <p>
                A Subject Area defines an overall area of study. All subject
                areas are listed alphabetically, and only subject areas with
                courses offered in the selected term will display. A list of all
                active subject areas is available on the Course Descriptions
                page.
              </p>
            </Text>
          </ToggleDetails>
        </div>
        <div>
          {subjectareas.length > 0 && <CustomSelect options={subjectareas} />}
        </div>
        <Button color="primary" margin="medium" display="block" type="submit">
          Submit
        </Button>
      </FormFieldGroup>
    );
  }
}

export default IndexForm;

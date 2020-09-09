import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Select } from '@instructure/ui-select';
import { SimpleSelect } from '@instructure/ui-simple-select';
import { Button } from '@instructure/ui-buttons';
import { FormFieldGroup } from '@instructure/ui-form-field';
import { ToggleDetails } from '@instructure/ui-toggle-details';
import { Text } from '@instructure/ui-text';
import { ltikPromise } from '../services/ltik';
import SelectCompleteForm from '../instructureComponents/selectCompleteForm';
import CustomSelect from '../instructureComponents/selectable';

/**
 * @param root0
 * @param root0.test
 */
function IndexForm() {
  const [terms, setTerms] = useState({});
  const [toggled, setToggled] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [subjectareas, setSubjAreas] = useState({});
  const [topic, setTopic] = useState({});
  const isTermsEmpty = Object.keys(terms).length === 0;
  const [selectedTerm, setSelectedTerm] = useState({});

  const getAllTerms = setState => {
    ltikPromise
      .then(
        ltik => {
          axios.get(`/api/forms/getTerms?ltik=${ltik}`).then(res => {
            setState(res.data);
          });
        },
        error => {
          console.log(error);
        }
      )
      .catch(error => {
        console.log(error);
      });
    // .finally(() => {
    //   getAllSubjectAreas();
    // });
  };

  const getAllSessions = () => {
    ltikPromise
      .then(
        ltik => {
          axios.post(`/api/forms/getSessions?ltik=${ltik}`).then(res => {
            // TermName = this.state.termName;
            // Axios.get(`/api/sessions/getSessions?ltik=${ltik}&termSelected=${termName}`)
            setSessions(res.data);
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
  // Const updatedTerm = () => ({ selectedTerm });

  const getAllSubjectAreas = ({ id }, setState) => {
    // Const updatedSelectedTerm = updatedTerm();
    ltikPromise
      .then(
        ltik => {
          axios
            .post(`/api/forms/getSubjectareas?ltik=${ltik}`, {
              termCode: id,
            })
            .then(res => {
              setState(res.data);
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

  useEffect(() => {
    getAllTerms(setTerms);
    getAllSessions();
    getAllSubjectAreas(selectedTerm, setSubjAreas);
  }, [selectedTerm]);

  const handleSessionChange = event => {
    setSessions(event.target.value);
  };

  const handleTopicChange = event => {
    setTopic(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
  };

  const handleToggle = (event, expanded) => {
    setToggled(!expanded);
  };

  const onSelectTerms = term => {
    console.log(term);
    setSelectedTerm(term);
    // GetAllSubjectAreas();
  };

  const onSelectSubjAreas = subjectarea => {
    console.log(subjectarea);
  };

  return (
    <FormFieldGroup
      description="To search for classes offered, select a term and search criterion from the drop-down menus, then click GO."
      colSpacing="medium"
      layout="columns"
      vAlign="top"
      onSubmit={handleSubmit}
    >
      <div>
        {!isTermsEmpty && (
          <SelectCompleteForm
            options={terms}
            onSelect={onSelectTerms}
            isGroup
          />
        )}
      </div>
      <div>
        <SimpleSelect
          inputValue={sessions}
          renderLabel="Select a Session"
          onInputChange={e => {
            handleSessionChange(e);
          }}
        >
          <Select.Option id="one"> -- </Select.Option>
          <Select.Option id="one"> Session A </Select.Option>
          <Select.Option id="one"> Session C </Select.Option>
        </SimpleSelect>
      </div>
      <div>
        <SimpleSelect
          inputValue={topic}
          // Options={Options}
          renderLabel="Search Criteria"
          onInputChange={e => {
            handleTopicChange(e);
          }}
        >
          <Select.Option id="one"> Subject Area </Select.Option>
          <Select.Option id="two"> Course ID </Select.Option>
        </SimpleSelect>
        <ToggleDetails
          summary="What is {subjectArea}"
          expanded={toggled}
          style={StyleSheet.ToggleDetails}
          onToggle={e => {
            handleToggle(e, toggled);
          }}
        >
          <Text weight="bold">
            <p>
              A Subject Area defines an overall area of study. All subject areas
              are listed alphabetically, and only subject areas with courses
              offered in the selected term will display. A list of all active
              subject areas is available on the Course Descriptions page.
            </p>
          </Text>
        </ToggleDetails>
      </div>
      <div>
        {subjectareas.length > 0 && (
          <CustomSelect options={subjectareas} onSelect={onSelectSubjAreas} />
        )}
      </div>
      <Button color="primary" margin="medium" display="block" type="submit">
        Submit
      </Button>
    </FormFieldGroup>
  );
}
export default IndexForm;

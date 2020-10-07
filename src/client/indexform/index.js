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

import CourseRequestForm from '../CourseRequestForm';

const TOPICS = {
  SUBJECT: 'subject',
  CLASSID: 'classid',
};

/**
 * @returns {object} IndexForm
 */
function IndexForm() {
  const [terms, setTerms] = useState({});
  const [toggled, setToggled] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [subjectareas, setSubjAreas] = useState({});
  const [topic, setTopic] = useState(TOPICS.SUBJECT);
  const [topicOptions, setTopicOptions] = useState([]);
  const isTermsEmpty = Object.keys(terms).length === 0;
  const [selectedTerm, setSelectedTerm] = useState({
    label: 'Fall',
    id: '19F',
  });
  const [selectedSubjArea, setSelectedSubjArea] = useState({
    id: 'ENGCOMP',
    value: 'ENGCOMP',
  });
  const [showResults, setShowResults] = useState(false);
  const [courses, setCourses] = useState([]);
  const getAllTerms = (setState) => {
    ltikPromise
      .then(
        (ltik) => {
          axios.get(`/api/forms/getTerms?ltik=${ltik}`).then((res) => {
            setState(res.data);
          });
        },
        (error) => {
          console.log(error);
        }
      )
      .catch((error) => {
        console.log(error);
      });
    // .finally(() => {
    //   getAllSubjectAreas();
    // });
  };

  // Const getAllSessions = () => {
  //   ltikPromise
  //     .then(
  //       (ltik) => {
  //         axios.post(`/api/forms/getSessions?ltik=${ltik}`).then((res) => {
  //           // TermName = this.state.termName;
  //           // Axios.get(`/api/sessions/getSessions?ltik=${ltik}&termSelected=${termName}`)
  //           setSessions(res.data);
  //         });
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     )
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  // Const updatedTerm = () => ({ selectedTerm });

  const getAllSubjectAreas = ({ id }, setState) => {
    // Const updatedSelectedTerm = updatedTerm();
    ltikPromise
      .then(
        (ltik) => {
          axios
            .post(`/api/forms/getSubjectareas?ltik=${ltik}`, {
              termCode: id,
            })
            .then((res) => {
              setState(res.data);
            });
        },
        (error) => {
          console.log(error);
        }
      )
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllCourses = ({ id }, { value }, setState) => {
    ltikPromise
      .then(
        (ltik) => {
          axios
            .post(`/api/forms/getCourses?ltik=${ltik}`, {
              termCode: id,
              subjectAreaCode: value,
            })
            // .then((res) =>
            //   // Second API req.
            //   axios.get(`/api/forms/getCourseSections?ltik=${ltik}`, {
            //     termCode: id,
            //     subjectAreaCode: value,
            //     // Res.courseCatalogNumber,
            //     // res.classNumber,
            //   })
            // )
            .then((res) => {
              setState(res.data);
            });
        },
        (error) => {
          console.log(error);
        }
      )
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllTerms(setTerms);
  }, []);

  const handleSessionChange = (event) => {
    setSessions(event.target.value);
  };

  const getSavedSubjectAreas = () => {
    if (subjectareas.length > 0) {
      setTopicOptions(subjectareas);
    } else {
      getAllSubjectAreas(selectedTerm, setTopicOptions);
    }
  };
  const handleTopicChange = (event) => {
    const newTopic = event.target.id;
    setTopic(topic);
    if (newTopic === TOPICS.SUBJECT) {
      getSavedSubjectAreas();
    } else {
      setTopicOptions([]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Handling Submit...here!');
    getAllCourses(selectedTerm, selectedSubjArea, setShowResults);
  };

  const handleToggle = (event, expanded) => {
    setToggled(!expanded);
  };

  const onSelectTerms = (term) => {
    console.log(term);
    setSelectedTerm(term);
    setSubjAreas([]);
    getSavedSubjectAreas();
  };

  const onSelectSubjAreas = (subjectarea) => {
    console.log(subjectarea);
    setSelectedSubjArea(subjectarea);
  };

  const onSelectTopicOption = (option) => {
    if (topic === TOPICS.SUBJECT) {
      onSelectSubjAreas(option);
    }
  };

  return (
    <>
      <FormFieldGroup
        description="To search for classes offered, select a term and search criterion from the drop-down menus, then click GO."
        colSpacing="medium"
        layout="columns"
        vAlign="top"
        // OnSubmit={(e) => {
        //   handleSubmit(e);
        // }}
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
        {selectedTerm.label.includes('Sessions') && (
          <div>
            <SimpleSelect
              inputValue={sessions}
              renderLabel="Select a Session"
              onInputChange={(e) => {
                handleSessionChange(e);
              }}
            >
              <Select.Option id="one"> -- </Select.Option>
              <Select.Option id="one"> Session A </Select.Option>
              <Select.Option id="one"> Session C </Select.Option>
            </SimpleSelect>
          </div>
        )}
        <div>
          <SimpleSelect
            inputValue={topic}
            renderLabel="Search Criteria"
            onChange={handleTopicChange}
          >
            <Select.Option id={TOPICS.SUBJECT}>Subject Area</Select.Option>
            <Select.Option id={TOPICS.CLASSID}>Class ID</Select.Option>
          </SimpleSelect>
          <ToggleDetails
            summary="What is {subjectArea}"
            expanded={toggled}
            style={StyleSheet.ToggleDetails}
            onToggle={(e) => {
              handleToggle(e, toggled);
            }}
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
          <CustomSelect options={topicOptions} onSelect={onSelectTopicOption} />
        </div>
        <Button
          color="primary"
          margin="medium"
          display="block"
          type="submit"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </FormFieldGroup>
      {showResults && <CourseRequestForm courses={courses} />}
    </>
  );
}
export default IndexForm;

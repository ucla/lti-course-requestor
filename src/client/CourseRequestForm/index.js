/* eslint-disable react/prop-types */
import React, { useState } from 'react';
// Before mounting your React application:
import { theme } from '@instructure/canvas-theme';

import { Button } from '@instructure/ui-buttons';
import { Checkbox, CheckboxGroup } from '@instructure/ui-checkbox';
import { Flex } from '@instructure/ui-flex';
import { FormFieldGroup } from '@instructure/ui-form-field';
import { Table } from '@instructure/ui-table';
import { TextInput } from '@instructure/ui-text-input';

import * as constants from '../styling_constants';

theme.use();

const CourseRequestForm = ({ courses }) => {
  const [emailToggleValue, toggleEmail] = useState(false);
  const [coursesData, setCoursesData] = React.useState(courses);
  const handleEmailToggle = () => {
    toggleEmail(!emailToggleValue);
  };
  const [classTypeFilter, setClassTypeFilter] = React.useState([
    'ugrad',
    'grad',
    'tut',
  ]);
  const handleClassTypeToggle = value => {
    const ugradFlag =
      (value.includes('ugrad') && !classTypeFilter.includes('ugrad')) ||
      (!value.includes('ugrad') && classTypeFilter.includes('ugrad'));
    const gradFlag =
      (value.includes('grad') && !classTypeFilter.includes('grad')) ||
      (!value.includes('grad') && classTypeFilter.includes('grad'));
    const tutFlag =
      (value.includes('tut') && !classTypeFilter.includes('tut')) ||
      (!value.includes('tut') && classTypeFilter.includes('tut'));
    coursesData.forEach((element, i) => {
      if (ugradFlag && coursesData[i].classType === 'ugrad') {
        coursesData[i].toBeBuilt =
          value.includes('ugrad') && !classTypeFilter.includes('ugrad');
      } else if (gradFlag && coursesData[i].classType === 'grad') {
        coursesData[i].toBeBuilt =
          value.includes('grad') && !classTypeFilter.includes('grad');
      } else if (tutFlag && coursesData[i].classType === 'tut') {
        coursesData[i].toBeBuilt =
          value.includes('tut') && !classTypeFilter.includes('tut');
      }
    });
    setClassTypeFilter(value);
  };

  const CrossListings = ({ term, courseInfoList }) => {
    if (courseInfoList.length !== 0) {
      return courseInfoList.map((courseInfo, index) => (
        <Checkbox
          key={index}
          size="small"
          label={`${term}-${courseInfo.classID} (${courseInfo.subjectAreaCode} ${courseInfo.courseCatalogNumberDisplay}-${courseInfo.classNumber})`}
          defaultChecked
        ></Checkbox>
      ));
    }
    return null;
  };
  const SettingCheckbox = ({ isChecked, onChangeCallback }) =>
    isChecked ? (
      <Checkbox
        label=""
        size="small"
        defaultChecked
        onChange={onChangeCallback}
      />
    ) : (
      <Checkbox label="" size="small" onChange={onChangeCallback} />
    );
  const classTypeStyling = {
    ugrad: constants.ugradRow,
    grad: constants.gradRow,
    tut: constants.tutRow,
    none: constants.unselectedRow,
  };
  const toggleToBeBuilt = index => {
    coursesData[index].toBeBuilt = !coursesData[index].toBeBuilt;
    setCoursesData(coursesData);
  };

  const courseListings = coursesData.map((course, index) => (
    <Table.Row key={index}>
      <Table.Cell
        theme={
          classTypeStyling[
            course.toBeBuilt === true ? course.classType : 'none'
          ]
        }
      >
        {course.requestID}
      </Table.Cell>
      <Table.Cell
        theme={
          classTypeStyling[
            course.toBeBuilt === true ? course.classType : 'none'
          ]
        }
      >
        {course.offeredTermCode}
      </Table.Cell>
      <Table.Cell
        theme={
          classTypeStyling[
            course.toBeBuilt === true ? course.classType : 'none'
          ]
        }
      >
        {course.classID}
      </Table.Cell>
      <Table.Cell
        theme={
          classTypeStyling[
            course.toBeBuilt === true ? course.classType : 'none'
          ]
        }
      >
        {course.subjectAreaCode}
      </Table.Cell>
      <Table.Cell
        theme={
          classTypeStyling[
            course.toBeBuilt === true ? course.classType : 'none'
          ]
        }
      >
        {`${course.courseCatalogNumberDisplay}-${course.classNumber}`}
      </Table.Cell>
      <Table.Cell
        theme={
          classTypeStyling[
            course.toBeBuilt === true ? course.classType : 'none'
          ]
        }
      >
        <CrossListings
          term={course.offeredTermCode}
          courseInfoList={course.crosslistedCourses}
        ></CrossListings>
        <TextInput width="200px" renderLabel="" />
        <Button>Add additional Class ID</Button>
      </Table.Cell>
      <Table.Cell
        theme={
          classTypeStyling[
            course.toBeBuilt === true ? course.classType : 'none'
          ]
        }
      >
        {course.timeRequested}
      </Table.Cell>
      <Table.Cell
        theme={
          classTypeStyling[
            course.toBeBuilt === true ? course.classType : 'none'
          ]
        }
      >
        <TextInput width="200px" type="email" renderLabel="" />
      </Table.Cell>
      <Table.Cell
        theme={
          classTypeStyling[
            course.toBeBuilt === true ? course.classType : 'none'
          ]
        }
      >
        {course.status}
      </Table.Cell>
      <Table.Cell
        theme={
          classTypeStyling[
            course.toBeBuilt === true ? course.classType : 'none'
          ]
        }
      >
        <Flex justifyItems="center">
          <Flex.Item>
            <SettingCheckbox
              isChecked={course.emailInstructors}
            ></SettingCheckbox>
          </Flex.Item>
        </Flex>
      </Table.Cell>
      <Table.Cell
        theme={
          classTypeStyling[
            course.toBeBuilt === true ? course.classType : 'none'
          ]
        }
      >
        <Flex justifyItems="center">
          <Flex.Item>
            <SettingCheckbox isChecked={course.sendUrl}></SettingCheckbox>
          </Flex.Item>
        </Flex>
      </Table.Cell>
      <Table.Cell
        theme={
          classTypeStyling[
            course.toBeBuilt === true ? course.classType : 'none'
          ]
        }
      >
        <Flex justifyItems="center">
          <Flex.Item>
            <SettingCheckbox
              isChecked={course.toBeBuilt}
              onChangeCallback={() => toggleToBeBuilt(index)}
            ></SettingCheckbox>
          </Flex.Item>
        </Flex>
      </Table.Cell>
    </Table.Row>
  ));
  return (
    <FormFieldGroup label="" description="">
      <TextInput
        width="400px"
        type="email"
        renderLabel="Email to contact when these courses are built:"
      />
      <Checkbox
        onChange={handleEmailToggle}
        size="small"
        label="Toggle email instructors"
      />
      <CheckboxGroup
        description="Build filters:"
        layout="columns"
        defaultValue={classTypeFilter}
        name="buildfilters"
        size="small"
        onChange={value => handleClassTypeToggle(value)}
      >
        <Checkbox label="ugrad" value="ugrad" />
        <Checkbox label="grad" value="grad" />
        <Checkbox label="tut" value="tut" />
      </CheckboxGroup>
      <Table caption="">
        <Table.Head>
          <Table.Row>
            <Table.ColHeader theme={constants.courseListHeader} id="requestID">
              Request ID
            </Table.ColHeader>
            <Table.ColHeader theme={constants.courseListHeader} id="term">
              Term
            </Table.ColHeader>
            <Table.ColHeader theme={constants.courseListHeader} id="classID">
              Class ID
            </Table.ColHeader>
            <Table.ColHeader theme={constants.courseListHeader} id="department">
              Department
            </Table.ColHeader>
            <Table.ColHeader theme={constants.courseListHeader} id="course">
              Course
            </Table.ColHeader>
            <Table.ColHeader
              theme={constants.courseListHeader}
              id="crosslistedclassIDs"
            >
              Crosslisted Class IDs
            </Table.ColHeader>
            <Table.ColHeader
              theme={constants.courseListHeader}
              id="timerequested"
            >
              Time requested
            </Table.ColHeader>
            <Table.ColHeader
              theme={constants.courseListHeader}
              id="requestoremail"
            >
              Requestor Email
            </Table.ColHeader>
            <Table.ColHeader theme={constants.courseListHeader} id="status">
              Status
            </Table.ColHeader>
            <Table.ColHeader
              theme={constants.courseListHeader}
              id="emailinstructors"
            >
              Email instructors
            </Table.ColHeader>
            <Table.ColHeader theme={constants.courseListHeader} id="sendurl">
              Send class link to MyUCLA
            </Table.ColHeader>
            <Table.ColHeader theme={constants.courseListHeader} id="tobebuilt">
              To be built
            </Table.ColHeader>
          </Table.Row>
        </Table.Head>
        <Table.Body>{courseListings}</Table.Body>
      </Table>
      <Button type="submit" color="secondary">
        Submit requests
      </Button>
    </FormFieldGroup>
  );
};

export default CourseRequestForm;

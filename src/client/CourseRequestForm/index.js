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
  const [emailToggleValue, setEmailtoggleValue] = useState(false);
  const [emailCheckbox, setEmailCheckbox] = useState(new Set());
  const [coursesData, setCoursesData] = useState(courses);

  const handleEmailToggle = () => {
    setEmailtoggleValue(!emailToggleValue);
    setEmailCheckbox(new Set());
  };

  const toggleEmailInstr = (code) => {
    const copy = new Set(emailCheckbox);
    if (copy.has(code)) {
      copy.delete(code);
    } else {
      copy.add(code);
    }

    setEmailCheckbox(copy);
  };

  const [gradSelected, setGradSelected] = useState(true);
  const [ugradSelected, setUgradSelected] = useState(true);
  const [tutSelected, setTutSelected] = useState(true);
  const [tobeBuiltCheckedIds, setTobeBuiltCheckedIds] = useState(new Set());

  const getCourseType = (courseCatalogNumber, courseCode) => {
    let themeCls = '';

    if (courseCatalogNumber >= 200) {
      if (
        (gradSelected && !tobeBuiltCheckedIds.has(courseCode)) ||
        (!gradSelected && tobeBuiltCheckedIds.has(courseCode))
      ) {
        themeCls = 'grad';
      }
    }
    if (courseCatalogNumber < 200) {
      if (
        (ugradSelected && !tobeBuiltCheckedIds.has(courseCode)) ||
        (!ugradSelected && tobeBuiltCheckedIds.has(courseCode))
      ) {
        themeCls = 'ugrad';
      }
    }
    return themeCls;
  };

  const handleCheckboxGroup = (values) => {
    setGradSelected(values.includes('grad'));
    setUgradSelected(values.includes('ugrad'));
    setTutSelected(values.includes('tut'));
    setTobeBuiltCheckedIds(new Set());
  };

  const [classTypeFilter, setClassTypeFilter] = useState([
    'ugrad',
    'grad',
    'tut',
  ]);

  const CrossListings = ({ term, courseInfoList }) => {
    if (Array.isArray(courseInfoList)) {
      return courseInfoList.map((courseInfo, index) => (
        <Checkbox
          key={index}
          size="small"
          label={`${term}-${courseInfo.classID} (${courseInfo.subjectAreaCode} ${courseInfo.courseCatalogNumberDisplay}-${courseInfo.classNumber})`}
          defaultChecked
        />
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
  const toggleToBeBuilt = (courseCode) => {
    const copy = new Set(tobeBuiltCheckedIds);
    if (copy.has(courseCode)) {
      copy.delete(courseCode);
    } else {
      copy.add(courseCode);
    }

    setTobeBuiltCheckedIds(copy);
  };

  const currentDate = new Date().toLocaleString();

  const courseListings = coursesData.map((course, index) =>
    course.courseList.map((courseCode) => {
      const type = getCourseType(
        course.courseCatalogNumber.substring(0, 4),
        courseCode
      );

      course.emailInstructors =
        (emailToggleValue && !emailCheckbox.has(courseCode)) ||
        (!emailToggleValue && emailCheckbox.has(courseCode));
      return (
        <Table.Row key={courseCode}>
          <Table.Cell
            theme={classTypeStyling[type]}
            // Theme={classTypeStyling.getCourseType(course.courseCatalogNumber)}
          >
            {index + 1}
          </Table.Cell>
          <Table.Cell theme={classTypeStyling[type]}>
            {course.offeredTermCode}
          </Table.Cell>
          {/* <Table.Cell
          theme={
            classTypeStyling[
              course.toBeBuilt === true ? course.classType : 'none'
            ]
          }
        >
          {course.classID}
        </Table.Cell> */}
          <Table.Cell theme={classTypeStyling[type]}>
            {course.subjectAreaCode}
          </Table.Cell>
          <Table.Cell theme={classTypeStyling[type]}>{courseCode}</Table.Cell>
          <Table.Cell theme={classTypeStyling[type]}>
            <CrossListings
              term={course.offeredTermCode}
              courseInfoList={course.crosslistedCourses}
            />
            <TextInput width="200px" renderLabel=" " />
            <Button>Add additional Class ID</Button>
          </Table.Cell>
          <Table.Cell theme={classTypeStyling[type]}>{currentDate}</Table.Cell>
          <Table.Cell theme={classTypeStyling[type]}>
            <TextInput width="200px" type="email" renderLabel=" " />
          </Table.Cell>
          <Table.Cell theme={classTypeStyling[type]}>
            {course.status ? course.status : 'To be built'}
          </Table.Cell>
          <Table.Cell theme={classTypeStyling[type]}>
            <Flex justifyItems="center">
              <Flex.Item>
                <SettingCheckbox
                  isChecked={course.emailInstructors}
                  onChangeCallback={() => toggleEmailInstr(courseCode)}
                />
              </Flex.Item>
            </Flex>
          </Table.Cell>
          <Table.Cell theme={classTypeStyling[type]}>
            <Flex justifyItems="center">
              <Flex.Item>
                <SettingCheckbox isChecked={course.sendUrl} />
              </Flex.Item>
            </Flex>
          </Table.Cell>
          <Table.Cell theme={classTypeStyling[type]}>
            <Flex justifyItems="center">
              <Flex.Item>
                <SettingCheckbox
                  isChecked={type}
                  onChangeCallback={() => toggleToBeBuilt(courseCode)}
                />
              </Flex.Item>
            </Flex>
          </Table.Cell>
        </Table.Row>
      );
    })
  );

  const courseRequestFormHeaderList = [
    'Request ID',
    'Term',
    // 'Class ID',
    'Department',
    'Course',
    'Crosslisted Class IDs',
    'Time requested',
    'Requestor email',
    'Status',
    'Email instructors',
    'Do NOT send URL to MyUCLA',
    'To be built',
  ];
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
        onChange={(value) => handleCheckboxGroup(value)}
      >
        <Checkbox label="ugrad" value="ugrad" />
        <Checkbox label="grad" value="grad" />
        <Checkbox label="tut" value="tut" />
      </CheckboxGroup>
      <Table caption="">
        <Table.Head>
          <Table.Row>
            {courseRequestFormHeaderList.map((colname) => (
              <Table.ColHeader
                key={colname}
                id={colname}
                theme={constants.courseListHeader}
              >
                {colname}
              </Table.ColHeader>
            ))}
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

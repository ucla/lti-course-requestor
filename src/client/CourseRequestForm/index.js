/* eslint-disable react/prop-types */
import React, { useState } from 'react';
// before mounting your React application:
import { theme } from '@instructure/canvas-theme'
theme.use();

import { Button } from '@instructure/ui-buttons'
import { Checkbox, CheckboxGroup } from '@instructure/ui-checkbox'
import { Flex } from '@instructure/ui-flex'
import { FormFieldGroup } from '@instructure/ui-form-field'
import { Table } from '@instructure/ui-table';
import { TextInput } from '@instructure/ui-text-input'

const CourseRequestForm = ({courses}) => {
    const [emailToggleValue, toggleEmail] = useState(false);
    const handleEmailToggle = (() => {
        toggleEmail(!emailToggleValue);
    });
    const CrossListings = ({term, courseInfoList}) => {
        if (courseInfoList.length !== 0) {
            return (
                courseInfoList.map((courseInfo, index) => (
                    <Checkbox
                        key={index}
                        size='small'
                        label={ term + '-' + courseInfo.classID + ' (' + courseInfo.subjectAreaCode + ' ' + courseInfo.courseCatalogNumberDisplay + '-' + courseInfo.classNumber + ')' }
                        defaultChecked
                    >
                    </Checkbox>
                ))
            );
        }
        return null;
    }
    const SettingCheckbox = ({isChecked}) => (
        isChecked ? <Checkbox label='' size='small' defaultChecked/> : <Checkbox label='' size='small'/>
    )
    const courseListings = courses.map((course, index) => (
        <Table.Row key={index}>
            <Table.Cell>{course.requestID}</Table.Cell>
            <Table.Cell>{course.offeredTermCode}</Table.Cell>
            <Table.Cell>{course.classID}</Table.Cell>
            <Table.Cell>{course.subjectAreaCode}</Table.Cell>
            <Table.Cell>{ course.courseCatalogNumberDisplay + '-' + course.classNumber }</Table.Cell>
            <Table.Cell>
                <CrossListings term={course.offeredTermCode} courseInfoList={course.crosslistedCourses}></CrossListings>
                <TextInput width='200px' renderLabel=''/>
                <Button>Add additional Class ID</Button>
            </Table.Cell>
            <Table.Cell>{course.timeRequested}</Table.Cell>
            <Table.Cell>
                <TextInput width='200px' type='email' renderLabel=''/>
            </Table.Cell>
            <Table.Cell>{course.status}</Table.Cell>
            <Table.Cell>
                <Flex justifyItems='center'>
                    <Flex.Item>
                        <SettingCheckbox isChecked={course.emailInstructors}></SettingCheckbox>
                    </Flex.Item>
                </Flex>
            </Table.Cell>
            <Table.Cell>
                <Flex justifyItems='center'>
                    <Flex.Item>
                        <SettingCheckbox isChecked={course.sendUrl}></SettingCheckbox>
                    </Flex.Item>
                </Flex>
            </Table.Cell>
            <Table.Cell textAlign='center'>
                <Flex justifyItems='center'>
                    <Flex.Item>
                        <SettingCheckbox isChecked={course.toBeBuilt}></SettingCheckbox>
                    </Flex.Item>
                </Flex>
            </Table.Cell>
        </Table.Row>
    ));
    return (
        <FormFieldGroup label='' description=''>
            <TextInput width='400px' type='email' renderLabel='Email to contact when these courses are built:'/>
            <Checkbox onChange={handleEmailToggle} size='small' label='Toggle email instructors' />
            <CheckboxGroup
                description='Build filters:'
                layout='columns'
                defaultValue={['ugrad', 'grad', 'tut']}
                name='buildfilters'
                size='small'
            >
                <Checkbox label='ugrad' value='ugrad' />
                <Checkbox label='grad' value='grad' />
                <Checkbox label='tut' value='tut' />
            </CheckboxGroup>
            <Table caption=''>
                <Table.Head>
                    <Table.Row>
                        <Table.ColHeader id='requestID'>Request ID</Table.ColHeader>
                        <Table.ColHeader id='term'>Term</Table.ColHeader>
                        <Table.ColHeader id='classID'>Class ID</Table.ColHeader>
                        <Table.ColHeader id='department'>Department</Table.ColHeader>
                        <Table.ColHeader id='course'>Course</Table.ColHeader>
                        <Table.ColHeader id='crosslistedclassIDs'>Crosslisted Class IDs</Table.ColHeader>
                        <Table.ColHeader id='timerequested'>Time requested</Table.ColHeader>
                        <Table.ColHeader id='requestoremail'>Requestor Email</Table.ColHeader>
                        <Table.ColHeader id='status'>Status</Table.ColHeader>
                        <Table.ColHeader id='emailinstructors'>Email instructors</Table.ColHeader>
                        <Table.ColHeader id='sendurl'>Send class link to MyUCLA</Table.ColHeader>
                        <Table.ColHeader id='tobebuilt'>To be built</Table.ColHeader>
                    </Table.Row>
                </Table.Head>
                <Table.Body>
                    {courseListings}
                </Table.Body>
            </Table>
            <Button type='submit' color='secondary'>Submit requests</Button>
        </FormFieldGroup>
    );
}

export default CourseRequestForm;

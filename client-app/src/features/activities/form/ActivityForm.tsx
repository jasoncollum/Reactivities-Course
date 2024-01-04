import { Button, Header, Segment } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import Activity from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import CustomTextInput from "../../../app/common/form/CustomTextInput";
import CustomTextArea from "./CustomTextArea";
import CustomSelectInput from "../../../app/common/form/CustomSelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import CustomDateInput from "../../../app/common/form/CustomDateInput";
import { v4 as uuid } from 'uuid';

export default observer(function ActivityForm() {
  const {activityStore} = useStore();
  const {loading, loadingInitial, loadActivity, createActivity, updateActivity} = activityStore;
  const {id} = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState<Activity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: null,
    city: '',
    venue: ''
  });

  const validationSchema = Yup.object({
    title: Yup.string().required('The activity title is required'),
    description: Yup.string().required('The activity description is required').nullable(),
    category: Yup.string().required(),
    date: Yup.string().required('Date is required'),
    city: Yup.string().required(),
    venue: Yup.string().required()
  })

  useEffect(() => {
    if (id) loadActivity(id).then(activity => setActivity(activity!))
  }, [id, loadActivity]);

  function handleFormSubmit(activity: Activity) {
    if (!activity.id) {
      activity.id = uuid();
      createActivity(activity).then(() => navigate(`/activities/${activity.id}`))
    } else {
      updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
    }
  }

  if (loadingInitial) return <LoadingComponent content='Loading Activity...' />

  return (
    <Segment clearing>
      <Header content='Activity Details' sub color='teal' />
      <Formik 
        validationSchema={validationSchema}
        enableReinitialize 
        initialValues={activity} 
        onSubmit={values => handleFormSubmit(values)}>
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
            <CustomTextInput placeholder='Title' name='title' />   
            <CustomTextArea rows={3} placeholder='Description' name='description' />
            <CustomSelectInput options={categoryOptions} placeholder='Category' name='category' />
            <CustomDateInput 
              placeholderText='Date' 
              name='date' 
              showTimeSelect
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm aa'
            />
            <Header content='Location Details' sub color='teal' />
            <CustomTextInput placeholder='City' name='city' />
            <CustomTextInput placeholder='Venue'  name='venue' />
            <Button 
              disabled={isSubmitting || !dirty || !isValid}
              loading={loading} floated='right' 
              positive type='submit' content='Submit' 
            />
            <Button as={Link} to={`/activities`} floated='right' type='button' content='Cancel' />
          </Form>
        )}
      </Formik>
    </Segment>
  )
})
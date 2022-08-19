import React, { useState } from 'react';
import { Formik } from 'formik';
import Spinner from '../../Components/Spinner';
import { useCreateEvent } from '../../Hooks/Events/useCreateEvent';
import { WEB3_STORAGE_CLIENT } from '../../Utils/config';

const CreateEvent = () => {
    const [initialValues, setInitialValues] = useState({
        eventDate: '',
        eventTimeFrom: '',
        eventTimeTo: '',
        petName: '',
        petImage: '',
        deathDate: '',
        location: '',
        ownerName: '',
        isPublic: '',
        occuring: '',
    })
    const [showLoader, setShowLoader] = useState(false);

    const { mutate, isLoading } = useCreateEvent();

    const handleSubmit = (values, setSubmitting, resetForm) => {
        setInitialValues(values)
        let tempReq = {
            eventDate: values.eventDate,
            eventTime: values.eventTimeFrom,
            petName: values.petName,
            petImage: values.petImage,
            deathDate: values.deathDate,
            location: values.location,
            ownerName: values.ownerName,
            timePeriod: 0,
            isPublic: values.isPublic === 'yes' ? true : false,
            occuring: values.occuring === 'yes' ? true : false,
            graveYardId: 1234,
            graveId: 1
        }
        mutate(tempReq, {
            onSuccess: () => {
                resetForm()
                alert("Event Created")
            }
        })
    }

    const validate = (values) => {
        const errors = {};
        if (!values.petName) {
            errors.petName = `Pet Name is Required`;
        }
        if (!values.ownerName) {
            errors.ownerName = `Owner Name is Required`;
        }
        if (!values.eventDate) {
            errors.eventDate = `Event Date is Required`;
        }
        if (!values.location) {
            errors.location = `Event location is Required`;
        }
        if (!values.eventTimeFrom) {
            errors.eventTimeFrom = `Event Time From is Required`;
        }
        if (!values.eventTimeTo) {
            errors.eventTimeTo = `Event Time From is Required`;
        }
        if (!values.deathDate) {
            errors.deathDate = `Death Date is Required`;
        }
        if (!values.petImage) {
            errors.petImage = `Pet Image is Required`;
        }
        if (!values.occuring) {
            errors.occuring = `occuring is Required`;
        }
        if (!values.isPublic) {
            errors.isPublic = `isPublic is Required`;
        }
        return errors;
    }

    return (

        <div>
            <span className='text-6xl font-medium'>Create an Event</span>
            <Formik
                initialValues={initialValues}
                validate={(values) => validate(values)}
                onSubmit={(values, { setSubmitting, resetForm }) => handleSubmit(values, setSubmitting, resetForm)} >
                {
                    ({
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isValid,
                        dirty
                    }) =>
                    (
                        <form onSubmit={handleSubmit} className='flex flex-col pt-4'>

                            <div className='flex flex-col md:flex-row'>
                                <div className='w-full pr-2 md:w-1/2'>
                                    <div className='flex flex-col p-4 mb-2 border rounded'>
                                        <label htmlFor="petName" className='labelStyle'>Pet Name :</label>
                                        <input type="text" id="petName" name="petName" placeholder="Enter your Pet Name "
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.petName}
                                            className={
                                                errors.petName && touched.petName ? "input-error" : null
                                            } />
                                        {errors.petName && touched.petName && (
                                            <span className="error">{errors.petName}</span>
                                        )}
                                    </div>


                                    <div className='flex flex-col p-4 mb-2 border rounded'>
                                        <label htmlFor="eventDate" className='labelStyle'>Event Date :</label>
                                        <input type="date" id="eventDate" name="eventDate" placeholder="Enter your Event Date"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.eventDate}
                                            className={
                                                errors.eventDate && touched.eventDate ? "input-error" : null
                                            } />
                                        {errors.eventDate && touched.eventDate && (
                                            <span className="error">{errors.eventDate}</span>
                                        )}
                                    </div>

                                    <div className='flex flex-col p-4 mb-2 border rounded'>
                                        <label htmlFor="eventTimeFrom" className='labelStyle'>Event Time From:</label>
                                        <input type="text" id="eventTimeFrom" name="eventTimeFrom" placeholder="Enter your Event Time From"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.eventTimeFrom}
                                            className={
                                                errors.eventTimeFrom && touched.eventTimeFrom ? "input-error" : null
                                            } />
                                        {errors.eventTimeFrom && touched.eventTimeFrom && (
                                            <span className="error">{errors.eventTimeFrom}</span>
                                        )}
                                    </div>

                                    <div className='flex flex-col p-4 mb-2 border rounded'>
                                        <label htmlFor="deathDate" className='labelStyle'>Death Date :</label>
                                        <input type="date" id="deathDate" name="deathDate" placeholder="Enter your Death Date"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.deathDate}
                                            className={
                                                errors.deathDate && touched.deathDate ? "input-error" : null
                                            } />
                                        {errors.deathDate && touched.deathDate && (
                                            <span className="error">{errors.deathDate}</span>
                                        )}
                                    </div>

                                    <div className='flex flex-col p-4 mb-2 border rounded'>
                                        <label htmlFor="occuring" className='labelStyle'>Is this occuring event every year?</label>
                                        <div className='flex flex-row'>

                                            <input type="radio" id="occuring" name="occuring" placeholder="Enter your Pet Image"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={'yes'}
                                                className={
                                                    errors.occuring && touched.occuring ? "input-error" : null
                                                } />Yes
                                            <input type="radio" id="occuring" name="occuring" placeholder="Enter your Pet Image"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={'no'}
                                                className={
                                                    errors.occuring && touched.occuring ? "input-error" : null
                                                } />No
                                        </div>
                                        {errors.occuring && touched.occuring && (
                                            <span className="error">{errors.occuring}</span>
                                        )}
                                    </div>

                                </div>

                                <div className='w-full pl-2 md:w-1/2'>

                                    <div className='flex flex-col p-4 mb-2 border rounded'>
                                        <label htmlFor="ownerName" className='labelStyle'>Owner Name :</label>
                                        <input type="text" id="ownerName" name="ownerName" placeholder="Enter your Owner Name"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.ownerName}
                                            className={
                                                errors.ownerName && touched.ownerName ? "input-error" : null
                                            } />
                                        {errors.ownerName && touched.ownerName && (
                                            <span className="error">{errors.ownerName}</span>
                                        )}
                                    </div>

                                    <div className='flex flex-col p-4 mb-2 border rounded'>
                                        <label htmlFor="location" className='labelStyle'>Event Location :</label>
                                        <input type="text" id="location" name="location" placeholder="Enter your Event Location"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.location}
                                            className={
                                                errors.location && touched.location ? "input-error" : null
                                            } />
                                        {errors.location && touched.location && (
                                            <span className="error">{errors.location}</span>
                                        )}
                                    </div>

                                    <div className='flex flex-col p-4 mb-2 border rounded'>
                                        <label htmlFor="eventTimeTo" className='labelStyle'>Event Time To:</label>
                                        <input type="text" id="eventTimeTo" name="eventTimeTo" placeholder="Enter your Event Time To"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.eventTimeTo}
                                            className={
                                                errors.eventTimeTo && touched.eventTimeTo ? "input-error" : null
                                            } />
                                        {errors.eventTimeTo && touched.eventTimeTo && (
                                            <span className="error">{errors.eventTimeTo}</span>
                                        )}
                                    </div>

                                    <div className='flex flex-col p-4 mb-2 border rounded'>
                                        <label htmlFor="petImage" className='labelStyle'>Pet Image :</label>
                                        <input type="file" id="petImage" name="petImage"
                                           onChange={async(e) => {
                                            try {
                                                setShowLoader(true)
                                                const files = e.target.files
                                                const rootCid = await WEB3_STORAGE_CLIENT.put(files);
                                                const url = `https://${rootCid}.ipfs.w3s.link/${files[0].name}`;
                                                setFieldValue('petImage', url);
                                                setShowLoader(false);   
                                            } catch (error) {
                                            }finally{
                                                setShowLoader(false)
                                            }
                                        }}
                                        />
                                        {showLoader ?
                                            <div className='flex items-center justify-center' >
                                                <Spinner />
                                            </div> : null}
                                    </div>

                                    <div className='flex flex-col p-4 mb-2 border rounded'>
                                        <label htmlFor="isPublic" className='labelStyle'>Is this public event ?</label>
                                        <div className='flex flex-row'>

                                            <input type="radio" id="isPublic" name="isPublic" placeholder="Enter your Pet Image"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={'yes'}
                                                className={
                                                    errors.isPublic && touched.isPublic ? "input-error" : null
                                                } />Yes
                                            <input type="radio" id="isPublic" name="isPublic" placeholder="Enter your Pet Image"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={'no'}
                                                className={
                                                    errors.isPublic && touched.isPublic ? "input-error" : null
                                                } />No
                                        </div>
                                        {errors.isPublic && touched.isPublic && (
                                            <span className="error">{errors.isPublic}</span>
                                        )}
                                    </div>

                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center my-2">
                                {isLoading ? <div className='flex items-center justify-center' >
                                    <Spinner />
                                </div>
                                    :
                                    <button type="submit" disabled={!(dirty && isValid)}
                                        className={!(dirty && isValid) ? "disabledBtnStyle w-1/2" : "BtnStyle w-1/2"}
                                    >Save Details</button>
                                }
                            </div>
                        </form>
                    )
                }
            </Formik>
        </div>
    );
}


export default CreateEvent;
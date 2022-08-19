import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { Formik } from 'formik';
import Spinner from '../../Components/Spinner';
import { useGraveStore, useGraveYardStore, useWalletStore } from '../../Store';
import PriceABI from '../../Assets/Json/PriceABI.json';
import { WEB3_STORAGE_CLIENT } from '../../Utils/config';
import Web3 from 'web3';

const Modal = ({ onclose }) => {
    const web3 = new Web3(window.ethereum);
    const selectedGraveYard = useGraveYardStore((state) => state.selectedGraveYard);
    const graveDetails = useGraveStore((state) => state.selectedGrave);
    const walletId = useWalletStore((state) => state.walletId);
    const [fileUrl, setFileUrl] = useState("");
    const [initialValues, setInitialValues] = useState({
        name: '', petDes: '', birthDate: '',
        deathDate: '', deathTime: '', fileUrl: fileUrl
    })
    const [showLoader, setShowLoader] = useState(false)
    const [selectedImage, setSelectedImage] = useState('');

    const onChangeImage = async (e, setFieldValue,) => {

        setShowLoader(true)
        const file = e.target.files[0]
        try {
            const fileInput = document.querySelector('input[type="file"]')
            const rootCid = await WEB3_STORAGE_CLIENT.put(fileInput.files);
            const url = `https://${rootCid}.ipfs.w3s.link/${fileInput.files[0].name}`
            setFieldValue('fileUrl', url)
            setSelectedImage(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        } finally {
            setShowLoader(false)
        }

    }

    async function makeFileObjects(data) {  //converting object to json file 
        
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })

        const files = [
            new File([blob], graveDetails.tokenID + '.json')
        ]
        return files
    }

    const handleSubmit = async (values, setSubmitting) => {
        try {
            setShowLoader(true)
            let updatedJson = {
                description: values.petDes,
                external_url: "",
                image: values.fileUrl,
                name: values.name,
                edition: 3,
                attributes: [
                    {
                        trait_type: "birthDate",
                        value: values.birthDate
                    },
                    {
                        trait_type: "deathDate",
                        value: values.deathDate
                    },
                    {
                        trait_type: "deathTime",
                        value: values.deathTime
                    }
                ],
                compiler: "HashLips Art Engine"
            }

            const urifile = await makeFileObjects(updatedJson);
            const rootCid = await WEB3_STORAGE_CLIENT.put(urifile);
            const tokenURI = `https://${rootCid}.ipfs.w3s.link/${urifile[0].name}`

            const graveyard = new web3.eth.Contract(PriceABI, selectedGraveYard.graveYardId);
            const gasPrice = await web3.eth.getGasPrice()
            const fData = graveyard.methods.saveData(graveDetails.tokenID, tokenURI).encodeABI();
            const gasLimit = await graveyard.methods.saveData(graveDetails.tokenID, tokenURI).estimateGas({ from: walletId, value: 0 });
            web3.eth.sendTransaction({
                from: walletId,
                to: selectedGraveYard.graveYardId,
                value: 0,
                gas: gasLimit + 30000,
                gasPrice: gasPrice,
                data: fData
            }, function (err, res) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(res);
                }
            }
            ).then(res => { onclose() })
            setInitialValues(values)

        } catch (error) {

        } finally {
            setShowLoader(false)
        }


    }

    const validate = (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = `Name is Required`;
        }
        if (!values.petDes) {
            errors.petDes = `Pet Description is Required`;
        }
        if (!values.birthDate) {
            errors.birthDate = `Birth Date is Required`;
        }
        if (!values.deathDate) {
            errors.deathDate = `Death Date is Required`;
        }
        if (!values.deathTime) {
            errors.deathTime = `Death Time is Required`;
        }
        if (!values.fileUrl) {
            errors.fileUrl = `image is Required`;
        }
        return errors;
    }

    return (
        <div className="absolute inset-x-0 inset-y-0 flex items-center justify-center z-100">
            <div className="relative w-1/2 mx-auto my-2 h-4/5">
                <div className="relative flex flex-col w-full bg-white border rounded-lg shadow-lg outline-none focus:outline-none">
                    <div className="flex justify-end mt-4 mr-4">
                        <FontAwesomeIcon onClick={() => onclose()} icon={faClose} className='w-6 h-6 cursor-pointer' />
                    </div>
                    <div className='p-10'>
                        <Formik
                            initialValues={initialValues}
                            validate={(values) => validate(values)}
                            onSubmit={(values, { setSubmitting, setFieldValue }) => handleSubmit(values, setSubmitting)} >
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
                                    <form onSubmit={handleSubmit} className='flex flex-col'>

                                        <div className='flex flex-col p-4 mb-2 border rounded'>
                                            <label htmlFor="name" className='labelStyle'>Name :</label>
                                            <input type="text" id="name" name="name" placeholder="Enter your Pet Name "
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.name}
                                                className={
                                                    errors.deathTime && touched.deathTime ? "input-error" : null
                                                } />
                                            {errors.name && touched.name && (
                                                <span className="error">{errors.name}</span>
                                            )}
                                        </div>

                                        <div className='flex flex-col p-4 mb-2 border rounded'>
                                            <label htmlFor="petDes" className='labelStyle'>Pet Description :</label>
                                            <input type="text" id="petDes" name="petDes" placeholder="Enter your Pet Description"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.petDes}
                                                className={
                                                    errors.deathTime && touched.deathTime ? "input-error" : null
                                                } />
                                            {errors.petDes && touched.petDes && (
                                                <span className="error">{errors.petDes}</span>
                                            )}
                                        </div>

                                        <div className='flex flex-col p-4 mb-2 border rounded'>
                                            <label htmlFor="birthDate" className='labelStyle'>Birth Date :</label>
                                            <input type="date" id="birthDate" name="birthDate" placeholder="Enter your Birth Date"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.birthDate}
                                                className={
                                                    errors.deathTime && touched.deathTime ? "input-error" : null
                                                } />
                                            {errors.birthDate && touched.birthDate && (
                                                <span className="error">{errors.birthDate}</span>
                                            )}
                                        </div>

                                        <div className='flex flex-col p-4 mb-2 border rounded'>
                                            <label htmlFor="deathDate" className='labelStyle'>Death Date :</label>
                                            <input type="date" id="deathDate" name="deathDate" placeholder="Enter your Death Date"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.deathDate}
                                                className={
                                                    errors.deathTime && touched.deathTime ? "input-error" : null
                                                } />
                                            {errors.deathDate && touched.deathDate && (
                                                <span className="error">{errors.deathDate}</span>
                                            )}
                                        </div>

                                        <div className='flex flex-col p-4 mb-2 border rounded'>
                                            <label htmlFor="deathTime" className='labelStyle'>Death Time :</label>
                                            <input type="text" id="deathTime" name="deathTime" placeholder="Enter your Death Time"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.deathTime}
                                                className={
                                                    errors.deathTime && touched.deathTime ? "input-error" : null
                                                } />
                                            {errors.deathTime && touched.deathTime && (
                                                <span className="error">{errors.deathTime}</span>
                                            )}
                                        </div>

                                        <div className='flex flex-col p-4 mb-2 border rounded'>
                                            <label htmlFor="file" className='labelStyle'>Pet Image :</label>
                                            <input type="file" id="file" name="file"
                                                onChange={(e) => onChangeImage(e, setFieldValue)}
                                            />
                                            {errors.fileUrl && touched.fileUrl && (
                                                <span className="error">{errors.fileUrl}</span>
                                            )}
                                            {showLoader ?
                                                <div className='flex items-center justify-center' >
                                                    <Spinner />
                                                </div> : null}
                                        </div>
                                        <div className="flex flex-col items-center justify-center my-2">
                                            <button type="submit" disabled={!(dirty && isValid)}
                                                className={!(dirty && isValid) ? "disabledBtnStyle w-1/2" : "BtnStyle w-1/2"}
                                            >Save Details</button>
                                        </div>
                                    </form>
                                )
                            }
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;

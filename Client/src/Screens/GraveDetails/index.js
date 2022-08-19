import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import "./GraveDetails.css"
import Modal from "./Modal";
import { useGraveStore, useGraveYardStore, useMaticUsdPrice, useWalletStore } from "../../Store";
import BreadCrumbs from "../../Components/Breadcrumbs";
import PriceABI from '../../Assets/Json/PriceABI.json';
import BuyGraveABI from '../../Assets/Json/BuyGraveABI';
import { BUY_CONTRACT, DECIMALS } from "../../Utils/config";
import images from "../../Assets/Images";
import Spinner from "../../Components/Spinner";

const Web3 = require('web3');

const BreadCrumbsList = [
    { listName: 'Our Cemeteries', navigatePath: '/OurLocations' },
    { listName: 'Cemetery Details', navigatePath: '/GraveyardDetails' }
]

const GraveDetails = () => {
    const web3 = new Web3(window.ethereum);

    const updateSelectedGrave = useGraveStore((state) => state.setSelectedGrave);
    const [tokenUriData, setTokenUriData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const graveDetails = useGraveStore((state) => state.selectedGrave);
    const maticUSDRate = useMaticUsdPrice((state) => state.USDRate);
    const [showEditModal, setShowEditModal] = useState(false);
    const walletId = useWalletStore((state) => state.walletId);
    const selectedGraveYard = useGraveYardStore((state) => state.selectedGraveYard);

    useEffect(() => {
        if (graveDetails && graveDetails.isSold) {
            getTokenUri()
        }
    }, [graveDetails]);

    const OncloseClicked = () => {
        setShowEditModal(false)
    }

    const buyNowClicked = async (e) => {

        const tokenInst = new web3.eth.Contract(PriceABI, selectedGraveYard.graveYardId);
        const price = await tokenInst.methods.price().call();
        const gasPrice = await web3.eth.getGasPrice();
        const tokenInstForBuy = new web3.eth.Contract(BuyGraveABI, BUY_CONTRACT);
        const fData = tokenInstForBuy.methods.buyGrave(selectedGraveYard.graveYardId, walletId, graveDetails.tokenID).encodeABI();
        const gasLimit = await tokenInstForBuy.methods.buyGrave(selectedGraveYard.graveYardId, walletId, graveDetails.tokenID).estimateGas({ from: walletId, value: price });
        web3.eth.sendTransaction({
            from: walletId,
            to: BUY_CONTRACT,
            value: price,
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
        ).on('receipt', async (res) => {
            updateSelectedGrave({ ...graveDetails, isSold: true,owner:walletId })
        })

    }
    const getTokenUri = () => { //converting json data to object from fileurl to display 
        setIsLoading(true)
        if (graveDetails.tokenID) {
            const graveYard = new web3.eth.Contract(PriceABI, selectedGraveYard.graveYardId);
            graveYard.methods.tokenURI(graveDetails.tokenID).call().then((uri) => {
                fetch(uri).then(response => response.json())
                    .then((jsonData) => {
                        setTokenUriData(jsonData)
                    })
                    .catch((error) => {
                        console.error(error)
                    }).finally(() => {
                        setIsLoading(false)
                    })
            })
        }
    }
    const OwnerComponent = () => {
        return (
            <>
                <div className="w-2/5">
                    <img src={tokenUriData?.image || images.petGraveImg} className='w-full rounded' alt="Pet" />
                </div>
                <div className='mx-6 bg-gray-500 border' />
                <div className="flex flex-col w-3/5 ">
                    <div className="flex flex-row justify-between">
                        <span className="my-3 text-4xl">{tokenUriData?.name}</span>
                        <div className="flex flex-row">
                            <div className="flex flex-row items-center justify-center pr-4 cursor-pointer"
                                onClick={() => { setShowEditModal(true) }}>
                                <FontAwesomeIcon icon={faEdit} className='w-6 h-6' />
                            </div>
                            <a className="flex flex-row items-center justify-center cursor-pointer"
                                rel="noreferrer"
                                href={`https://testnets.opensea.io/assets/mumbai/${selectedGraveYard.graveYardId}/${graveDetails.tokenID}`} target="_blank">
                                <FontAwesomeIcon icon={faEye} className='w-6 h-6' />
                            </a>
                        </div>
                    </div>
                    <span className="my-3">
                        The place is situated at latitude
                        <span> {graveDetails.lat} </span>
                        and longitude <span>{graveDetails.long}</span>
                    </span>
                    <span className="my-3">{tokenUriData?.description}</span>
                    <span className="my-3">{`Birth Date -  ${tokenUriData?.attributes[0].value || ""}`}</span>
                    <span className="my-3">{`Death Time : ${tokenUriData?.attributes[2].value || ''}`}</span>
                    <div className="flex flex-row justify-between my-3"
                        onClick={() => { navigate('/CreateEvent') }}>
                        <button className="w-2/5 BtnStyle">Create an Event</button>
                    </div>
                </div>
            </>
        );
    }

    const NonOwnerComponent = () => {
        return (
            <>
                <div className="w-2/5">
                    <img src={tokenUriData?.image || images.petGraveImg} className='w-full rounded' alt="Grave" />
                </div>
                <div className='mx-6 bg-gray-500 border' />
                <div className="flex flex-col w-3/5 ">
                    <div className="flex flex-row justify-between">
                        <span className="my-3 text-4xl">{graveDetails.name}</span>
                        {graveDetails.isSold ?
                            <a className="flex flex-row items-end justify-center cursor-pointer"
                                rel="noreferrer"
                                href={`https://testnets.opensea.io/assets/mumbai/${selectedGraveYard.graveYardId}/${graveDetails.tokenID}`} target="_blank">
                                <FontAwesomeIcon icon={faEye} className='w-6 h-6' />
                            </a> : null}
                    </div>
                    <span className="my-3">
                        The place is situated at latitude
                        <span> {graveDetails.lat} </span>
                        and longitude <span>{graveDetails.long}</span>
                    </span>
                    <span className="my-3">{`$  ${(graveDetails.price * Math.pow(10, -DECIMALS) * maticUSDRate).toFixed(6)}`}</span>
                    {!graveDetails.isSold ?
                        <button className="w-2/5 BtnStyle" onClick={(e) => { buyNowClicked(e) }}>Buy Now</button> :
                        <span>Sold Out</span>}
                </div>
            </>
        );
    }

    return (
        <div>
            <BreadCrumbs list={BreadCrumbsList} />
            <div className="flex flex-row py-10">
                {isLoading && <div className='flex items-center justify-center' style={{ position: 'absolute', left: '50%', transform: 'translate(50%, 50%)' }}>
                    <Spinner />
                </div>}
                {
                    graveDetails?.owner?.toLowerCase() === walletId?.toLowerCase() ? <OwnerComponent /> : <NonOwnerComponent />
                }
            </div>

            {showEditModal ? <Modal onclose={OncloseClicked} graveDetails={graveDetails} /> : null}
        </div>
    );
};

export default GraveDetails;

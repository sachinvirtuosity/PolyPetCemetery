import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BuyGraveABI from '../../Assets/Json/BuyGraveABI';
import PriceABI from '../../Assets/Json/PriceABI.json';
import { useGetGraveList } from '../../Hooks/Graves/useGetGraveList';
import { useGraveYardStore, useGraveStore, useWalletStore } from '../../Store';
import Spinner from '../../Components/Spinner';
import images from '../../Assets/Images';
import { useMaticUsdPrice } from '../../Store/MaticUSDRate';
import axios from 'axios';
import { BUY_CONTRACT, DECIMALS } from '../../Utils/config';
import { PRICE_TICKER_URL } from '../../Utils/serviceURLConfig';
import { useGetBoughtGraveList } from '../../Hooks/Graves/useBoughtList';

const Web3 = require('web3');

function GraveyardDetails() {
    const selectedGraveYard = useGraveYardStore((state) => state.selectedGraveYard);
    const setSelectedGrave = useGraveStore((state) => state.setSelectedGrave)
    const walletId = useWalletStore((state) => state.walletId);
    const setUSDRate = useMaticUsdPrice((state) => state.setUSDRate);
    const maticUSDRate = useMaticUsdPrice((state) => state.USDRate);

    const navigate = useNavigate();
    const web3 = new Web3(window.ethereum);
    const dataLimit = 12;
    const pageLimit = 5;
    const priceAbi = PriceABI;
    const [currentPage, setCurrentPage] = useState(1);
    const [displayNumbers, setDisplayNumbers] = useState((new Array(pageLimit).fill().map((_, idx) => 0 + idx + 1)));
    const [graveData, setGraveData] = useState([]);
    const [gravePrice, setPrice] = useState();
    const [totalCount, setTotalCount] = useState(0);
    const [paginationNumber, setPaginationNumber] = useState(0);
    const [boughtGraves, setBoughtGraves] = useState([]);
    const [showSpinner, setSpinner] = useState([]);

    useEffect(() => {
        const getPrice = async () => {
            const tokenInst = new web3.eth.Contract(priceAbi, selectedGraveYard.graveYardId);
            const temprice = await tokenInst.methods.price().call();
            setPrice(temprice);
        }
        getPrice();
    })
    useEffect(() => {
        axios({
            method: 'get',
            url: `${PRICE_TICKER_URL}`,
        }).then(res => {
            setUSDRate(res.data.price)
        });
    }, []);
    
    const pageChange = (index) => {
        setCurrentPage(index)
        const startIndex = (index) * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        setGraveData(data.data.tokens.slice(startIndex, endIndex));


        const start = index - 1;
        const end = start + pageLimit;
        if (!displayNumbers.includes(index)) {
            setDisplayNumbers(paginationNumber.slice(start, end))
        }
    }

    const onSuccess = (data) => {
        let tempTotalCount = Math.ceil(data.data.tokens.length / dataLimit);
        setTotalCount(tempTotalCount);
        setPaginationNumber(new Array(tempTotalCount).fill().map((_, idx) => 0 + idx + 1));

        const startIndex = (currentPage) * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        setGraveData(data.data.tokens.slice(startIndex, endIndex));


        const start = currentPage - 1;
        const end = start + pageLimit;
        if (!displayNumbers.includes(currentPage)) {
            setDisplayNumbers(paginationNumber.slice(start, end))
        }
    }
    const onBoutListRetrieve = (data) => {
        setBoughtGraves(data.data.exampleEntities);

    }

    const { data, isLoading, error, refetch } = useGetGraveList(selectedGraveYard.graveUrl, onSuccess);
    useGetBoughtGraveList(onBoutListRetrieve);
    useEffect(() => {
        setSpinner(true)
        const graveDatas = data?.data?.tokens;
        if (boughtGraves && graveDatas) {
            graveDatas.forEach((d) => {
                const sold = boughtGraves.find(bg => bg.id.toLowerCase() === d.tokenID.toLowerCase());
                if (sold) d["isSold"] = true;
                else d["isSold"] = false;
            });
            let tempTotalCount = Math.ceil(graveDatas.length / dataLimit);
            setTotalCount(tempTotalCount);
            setPaginationNumber(new Array(tempTotalCount).fill().map((_, idx) => 0 + idx + 1));

            const startIndex = (currentPage) * dataLimit - dataLimit;
            const endIndex = startIndex + dataLimit;
            setGraveData(graveDatas.slice(startIndex, endIndex));
            setSpinner(false)
        }
    }, [boughtGraves, data]);
    const buyNowClicked = async (graveDetails) => {
        const tokenInst = new web3.eth.Contract(PriceABI, selectedGraveYard.graveYardId);
        const price = await tokenInst.methods.price().call();
        const gasPrice = await web3.eth.getGasPrice()
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
            setSpinner(true)
            setTimeout(() => {
                setSpinner(false)
            }, 2000);
            if (err) {
                console.log(err);
            } else {
                console.log(res);
            }
        }
        ).then(res => { refetch() }).catch(err => { refetch() })
    }

    const graveSelected = (obj) => {
        obj.price = gravePrice;
        setSelectedGrave(obj)
        navigate('/GraveDetails')
    }

    return (
        <div>
            <div>
                <p className='flex items-center justify-center my-4 text-6xl'>{selectedGraveYard.title}</p>
                <div className='flex flex-row'>
                    <span className='w-3/5 m-4'>{selectedGraveYard.des}</span>
                    <img className='w-2/5 m-4 rounded max-h-60' src={selectedGraveYard.image} alt='Banner' />

                </div>

            </div>
            <p className='flex items-center justify-center my-4 text-6xl'> Our Cemetery Details</p>
            {
                isLoading || showSpinner ?
                    <div className='flex items-center justify-center' >
                        <Spinner />
                    </div>
                    :

                    <div className='grid grid-cols-2 md:grid-cols-4'>
                        {graveData.map((obj, k) => (
                            <div key={k} className='p-4 m-4 rounded-lg shadow cursor-pointer hover:scale-105 ' >
                                <div onClick={() => { graveSelected(obj) }}>
                                    <img src={images.petGraveImg} className='w-full rounded h-26' alt='Grave' />
                                    <p className='my-2 text-2xl font-medium'>{`grave ${obj.tokenID}`}</p>
                                    <p className='my-2 text-lg font-normal'>{`$  ${(gravePrice * Math.pow(10, -DECIMALS) * maticUSDRate).toFixed(6)}`}</p>
                                </div>
                                <div className='flex flex-1 p-0 m-0'>
                                    {!obj.isSold ?
                                        <button className='flex items-center justify-center flex-1 p-0 m-0 border border-gray-300 rounded cursor-pointer h-9'
                                            onClick={(e) => {
                                                buyNowClicked(obj)
                                            }}>Buy Now</button>
                                        : <p className='flex flex-1 p-0 m-0'>Sold out</p>}
                                </div>
                            </div>

                        ))}
                    </div>
            }
            <div className='flex items-center justify-center my-4'>
                {
                    currentPage === 1 ? null :

                        <button
                            onClick={() => { pageChange(currentPage - 1) }}>
                            <FontAwesomeIcon
                                icon={faAngleLeft}
                                className='w-6 h-6 cursor-pointer'
                            />
                        </button>
                }
                {displayNumbers.map((item, index) => (
                    <button
                        key={index}
                        onClick={(e) => { pageChange(Number(e.target.innerHTML)) }}
                        className={`m-2 ${currentPage === item ? 'bg-gray-200 w-6 h-6  rounded-r ' : null}`}
                    >
                        <span>{item}</span>
                    </button>
                ))}
                {currentPage >= totalCount ? null :
                    <button
                        onClick={() => { pageChange(currentPage + 1) }} >
                        <FontAwesomeIcon
                            icon={faAngleRight}
                            className='w-6 h-6 cursor-pointer'
                        />
                    </button>
                }
            </div>
        </div >
    );
}

export default GraveyardDetails;
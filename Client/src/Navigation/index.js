import React, { useEffect } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useMetaMask } from "metamask-react";
import MetaMaskOnboarding from '@metamask/onboarding';

import OurLocations from '../Screens/OurLocations';
import Events from '../Screens/Events';
import Home from '../Screens/Home';
import GraveyardDetails from '../Screens/GraveyardDetails';
import GraveDetails from '../Screens/GraveDetails';

import "./Navigation.css";
import images from '../Assets/Images';
import { useWalletStore } from '../Store';
import { MiddleEllipsis } from '../Utils/Functions';
import EventDetails from '../Screens/EventDetails';
import CreateEvent from '../Screens/CreateEvent';

function AppRouter() {
    const { status, account, ethereum } = useMetaMask();
    const walletId = useWalletStore((state) => state.walletId);
    const setWalletId = useWalletStore((state) => state.setWalletId);
    const resetWalletId = useWalletStore((state) => state.resetWalletId)
    const onboarding = React.useRef();
    const navigate = useNavigate();

    useEffect(() => {
        if (status === 'connected') {
            setWalletId(account)
        } else if (status === 'notConnected') {
            resetWalletId();
        }
    }, [status])

    window.ethereum.on('disconnect', () => {
        window.location.reload();
    })

    const handleConnectWallet = async (e) => {
        if (status === "unavailable") {
            onboarding.current = new MetaMaskOnboarding();
            onboarding.current.startOnboarding();
        } else {
            if (status === "notConnected") {
                ethereum.request({
                    method: "eth_requestAccounts"
                }).then((res) => {
                    setWalletId(res[0])
                });
            } else {
                setWalletId(account)
            }
        }
    }

    return (
        <div className='pl-1/10 pr-1/10'>
            <header className='flex flex-col justify-center items-center my-4  cursor-pointer' onClick={() => { navigate('/') }} >
                <img src={images.logo} alt='logo' className='w-20' />
                <span>Poly Pet Cemetery</span>
            </header>
            <div className='border bg-gray-500' />
            <nav>
                <div className='flex flex-row items-center w-full mb-20 mt-4'>
                    <div className='flex justify-evenly w-full '>
                        <Link className='no-underline text-gray-600' to='/OurLocations'>Our Cemeteries</Link >
                        <Link className='no-underline text-gray-600' to='/Events'>Memorials</Link >
                        {walletId ? <span title={walletId} className='cursor-pointer text-gray-600 w-24 truncate ...'>{MiddleEllipsis(walletId, 12)}</span> :
                            <span className='cursor-pointer text-gray-600' onClick={() => { handleConnectWallet() }}>Connect Wallet</span>
                        }
                    </div>
                </div>
            </nav>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/OurLocations" element={<OurLocations />} />
                    <Route path="/Events" element={<Events />} />
                    <Route path='/EventDetails' element={<EventDetails />} />
                    <Route path='/CreateEvent' element={<CreateEvent />} />
                    <Route path="/GraveyardDetails" element={<GraveyardDetails />} />
                    <Route path='/GraveDetails' element={<GraveDetails />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </div>
    );
}

export default AppRouter;

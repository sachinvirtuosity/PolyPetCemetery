import React from 'react';
import images from '../../Assets/Images';
import "./Home.css";

function Home() {
    return (
        <div >
            <div className='flex flex-col justify-center items-center '>
                <span className='text-6xl font-medium'>Poly Pet Cemetery</span>
                <span className='my-6 text-2xl font-light'>Where history comes alive</span>
            </div>
            <div className='homeMainContainer mb-20 rounded' />

            <div className="relative w-full h-auto mb-20" >
                <div className='absolute z-50 w-1/2 top-20 p-4 rounded-lg hover:-translate-y-1 hover:scale-110 duration-300' style={{ backgroundColor: '#f7f7f7' }}>
                    <span>
                        we understand the special bond that exists between humans and our companion animals. We know firsthand how difficult losing a pet can be and how overwhelming it is making decisions at the time of pet loss. In fact, many of our family pets are buried here so we can always remember. We offer decorations on pet graves that are placed for the different seasons. You may visit whenever you like. Our beautiful, historic Pet Cemetery is open during daylight hours all year-round.</span>
                </div>
                <div className='absolute z-0 left-2/5 hover:-translate-y-1 hover:scale-110 duration-300'>
                    <img src={images.cemetery} className='rounded' alt='Cemetery' />
                </div>
            </div>
        </div>

    );
}

export default Home;

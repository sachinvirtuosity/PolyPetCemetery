import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import images from '../Assets/Images';

const EventCard = ({ EventObj }) => {
    return (
        <div className='grid grid-row-5'>
            <img src={EventObj.petImage ? EventObj.petImage : images.noImage} alt='' className='rounded row-span-3' />

            <div className='row-span-2 flex flex-col p-4 justify-center '>

                <div className='flex flex-row items-center'>
                    <FontAwesomeIcon icon={faCalendar} className='w-4 h-4 mr-2' color='#6B7280' />
                    <p> {EventObj.eventDate}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <FontAwesomeIcon icon={faClock} className='w-4 h-4 mr-2' color='#6B7280' />
                    <p> {EventObj.eventTime}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <FontAwesomeIcon icon={faLocationDot} className='w-4 h-4 mr-2' color='#6B7280' />
                    <p>{EventObj.location}</p>
                </div>

            </div>
        </div>
    );
}

export default EventCard;
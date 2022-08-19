import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import EventCard from "../../Components/EventCard";
import NoData from "../../Components/NoData";
import Spinner from "../../Components/Spinner";
import TabComponent from "../../Components/TabComponent";
import { useGetEventList } from "../../Hooks/Events/useGetEventList";
import { useEventStore } from "../../Store";

const types = [
    { type: 'Upcoming Events', param: 'Pending' },
    { type: 'Past Events', param: 'Completed' },
    { type: 'Ongoing Events', param: 'Ongoing' },
    { type: 'Cancelled Events', param: 'Cancelled' }
];

const Events = () => {
    const navigate = useNavigate();
    const setSelectedEvent = useEventStore((state) => state.setSelectedEvent)
    const [active, setActive] = useState(types[0]);

    const tabSelected = (type) => {
        setActive(type)
    }

    const eventSelected = (obj) => {
        setSelectedEvent(obj)
        navigate('/EventDetails')
    }
    const { isLoading, data, error, isError, isFetching } = useGetEventList(active.param);

    return (
        <div>
            <div className='flex flex-col justify-center items-center '>
                <span className='text-6xl font-medium'>Events</span>
                <span className='my-6 text-2xl font-light'>Track and manage events here</span>
            </div>
            <TabComponent types={types} active={active} tabSelected={tabSelected} />

            <div >
                {isLoading ?
                    <div className='flex justify-center items-center' >
                        <Spinner />
                    </div>
                    :
                    <>
                        {data.length > 0 ?
                            <div className='grid grid-cols-2 md:grid-cols-4'>
                                {data?.map((obj, k) => (
                                    <div key={k} className='shadow rounded-lg m-4 cursor-pointer hover:scale-105'
                                        onClick={() => eventSelected(obj)}>
                                        <EventCard key={k} EventObj={obj} />
                                    </div>
                                ))}
                            </div>
                            :
                            <NoData message='No Events Found !!' />
                        }
                    </>
                }
            </div>

        </div>
    );

}

export default Events;

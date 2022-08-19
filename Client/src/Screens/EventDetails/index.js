import images from "../../Assets/Images";
import { useCancelEvent } from "../../Hooks/Events/useCancelEvent";
import { useEventStore } from "../../Store";

const EventDetails = () => {
    const selectedEvent = useEventStore((state) => state.selectedEvent)

    const { mutate } = useCancelEvent();

    const cancelEvent = (_id) => {
        let req = {
            eventId: _id
        }
        mutate(req, {
            onSuccess: () => {
                alert("Event Cancelled")
            }
        })
    }
    
    return (
        <div className="flex flex-col sm:flex-row ">
            <div className="w-full md:w-2/5">
                <img src={selectedEvent.petImage ? selectedEvent.petImage : images.noImage} className='w-full rounded' alt="Pet" />
            </div>
            <div className='border bg-gray-500 mx-6' />
            <div className="w-3/5 flex flex-col ">
                <span className="my-3">{`Event Date : ${selectedEvent.eventDate}`}</span>
                <span className="my-3">{`Event Time : ${selectedEvent.eventTime}`}</span>
                <span className="my-3">{`Event Location : ${selectedEvent.location}`}</span>
                <span className="my-3">{selectedEvent.des}</span>
                <div className="flex flex-row justify-between my-3" onClick={() => { cancelEvent(selectedEvent._id) }}>
                    <button className="BtnStyle w-2/5">Cancel an Event</button>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;

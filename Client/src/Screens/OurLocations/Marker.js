import React from "react";
import { useNavigate } from 'react-router-dom';
import { useGraveYardStore } from "../../Store";

const Marker = ({ obj }) => {
    const navigate = useNavigate();

    const setSelectedGraveYard = useGraveYardStore((state) => state.setSelectedGraveYard)

    const locationSelected = () => {
        setSelectedGraveYard(obj)
        navigate('/GraveyardDetails')
    }

    return (
        <div className="circle" onClick={locationSelected} >
            <span className="circleText" title={obj.title}>
            </span>
        </div>
    );
};

export default Marker;

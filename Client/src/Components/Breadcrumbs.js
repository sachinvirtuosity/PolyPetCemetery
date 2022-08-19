import React from "react";
import { useNavigate } from "react-router-dom";

const BreadCrumbs = ({ list }) => {
    const navigate = useNavigate();

    const clickHandler = (path) => {
        if (path) {
            navigate(path)
        }
    }

    return (
        <div className="flex flex-row">
            {
                list.map((obj, k) => (
                    <div key={k}>
                        <span className={obj.navigatePath ? 'cursor-pointer' : ''} onClick={() => { clickHandler(obj.navigatePath) }}>{obj.listName}
                            {k < (list.length - 1) ? <span>&#47;</span>
                                : null}
                        </span>
                    </div>
                ))
            }
        </div>
    );
};

export default BreadCrumbs;

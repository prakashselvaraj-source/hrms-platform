import React, { useState } from 'react'

function CareerHistory() {
    const [history, setHistory] = useState([]);

    return (
        history.length > 0 ? (
            <div>
                <p className="text-lg font-bold">Career History</p>
            </div>
        )
            :
            (
                <div className='min-h-[200px] flex items-center justify-center'>
                    <p className="text-lg font-bold">No career history found</p>
                </div>
            )
    )
}

export default CareerHistory
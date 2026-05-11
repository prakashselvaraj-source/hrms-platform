import React, { useState } from 'react'

function UpcomingHolidays() {

    const [holidays, setHolidays] = useState([])


    return (
        holidays.length > 0 ? (
            <div>
                <p className="text-lg font-bold">Upcoming Holidays</p>
            </div>
        )
            :
            (
                <div className='min-h-[200px] flex items-center justify-center'>
                    <p className="text-lg font-bold">No upcoming holidays found</p>
                </div>
            )
    )
}

export default UpcomingHolidays
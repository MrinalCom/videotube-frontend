import React from 'react'

function Logo({
    classname
}) {
  return (
    <div>
        <img src="https://res.cloudinary.com/dlymuxgr0/image/upload/v1729451162/g3edp87rdrcek93spzry.png" alt="Logo" className={`${classname} h-14 object-cover object-center rounded-full cursor-pointer hover:opacity-60 transition duration-300 ease-in-out`}
        />
    </div>
  )
}

export default Logo
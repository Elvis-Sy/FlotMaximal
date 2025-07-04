import { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import Popover from './Popover';
import { BookOpenTextIcon } from "lucide-react";

const Header = () => {
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const location = useLocation();

    const showBouton = location.pathname !== "/";

  return (
    <header className='py-4 px-6 flex justify-between items-center bg-blue-200/50'>
        <div className='flex gap-2 items-center'>
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                <img src="/assets/logo.png" alt="logo" width={30} height={30}/>
            </Link>
            <div className='w-full'>
                <p className='font-transcity text-3xl text-[#166cb7]'>
                    R<span className='hidden md:inline-block text-2xl text-gray-800'>echerche</span>{" "} 
                    O<span className='hidden md:inline-block text-2xl text-gray-800'>perationnelle</span>
                </p>
            </div>
        </div>

        {showBouton && (
            <div>
                <button
                    ref={buttonRef}
                    onClick={() => setPopoverOpen((prev: any) => !prev)}
                    className="p-2 shadow-md group bg-white active:scale-105 rounded-md transition-all duration-500"
                >
                    <BookOpenTextIcon className='text-gray-800 group-active:scale-105 group-active:text-[#166cb7] transition-all duration-500'/>
                </button>

                <Popover
                    isOpen={isPopoverOpen}
                    onClose={() => setPopoverOpen(false)}
                    anchorRef={buttonRef}
                />
            </div>
        )}
    </header>
  )
}

export default Header
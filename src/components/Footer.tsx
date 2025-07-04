import { Copyright, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <div className='mt-[100px] flex flex-col lg:flex-row justify-between gap-20 lg:gap-0 lg:items-center bg-blue-200 w-full py-6 px-8 lg:px-16'>
        <div className="flex flex-col gap-4 order-2 md:order-1">
            <h1 className='font-semibold text-gray-900 text-lg'>EQUIPE</h1>
            <div className='flex flex-col gap-2 text-gray-800'>
                <p>
                    Elvis Sylvano <span className='font-serif'>(Chef de projet)</span>
                </p>
                <p>
                    Chryswdell Jeannioh
                </p>
            </div>
        </div>

        <h1 className='flex justify-center gap-2 text-gray-900 order-1 md:order-2'>
            <Copyright/>2025 <span className='font-medium'>Projet-RO.</span> Tous droits réservés.
        </h1>

        <div className="flex flex-col gap-4 order-3">
            <h1 className='font-semibold text-gray-900 text-lg'>CONTACTS</h1>
            <div className='flex flex-col gap-2 text-gray-800'>
                <a href='mailto:elvissy04@gmail.com' className='flex gap-2'>
                    <Mail/> elvissy04@gmail.com
                </a> 
                <a href='mailto:jeanniohchrysdwell@gmail.com' className='flex gap-2'>
                    <Mail/> jeanniohchrysdwell@gmail.com
                </a>
            </div>
        </div>
    </div>
  )
}

export default Footer
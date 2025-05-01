import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[url('/assets/heros.jpg')] bg-cover bg-center">
      <Header/>
      
      <div className="flex h-full flex-col gap-14">
        <div className="flex-col py-6 px-4 md:px-6">
          <h1 className='font-transcity text-[70px] md:text-[80px] mt-16 text-[#166cb7]'>
            FLOT MAXIMAL
          </h1>
          <p className='text-gray-600 font-semibold text-xl'>🔮 Application d’un réseau de transport</p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-center py-6 px-4 md:px-6">
          <Link to="/creative" className="group py-6 px-4 shadow-lg rounded-lg max-w-80 bg-white/80 backdrop-blur-sm transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:translate-y-2">
            <h1 className='font-bold text-lg text-[#127ad0]'>
                Mode Libre
            </h1>
            <p className='text-gray-700 mt-2'>
                Création de sommets avec positionnement libre et connexions définies manuellement.
            </p>
          </Link>

          <Link to="/documentation" className="group py-6 px-4 shadow-lg rounded-lg max-w-80 bg-white/80 backdrop-blur-sm transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:translate-y-2">
            <h1 className='font-bold text-lg text-[#127ad0]'>
              Mode Assisté
            </h1>
            <p className='text-gray-700 mt-2'>
              Construction du graphe avec placement optimisé et connexions générées à partir des données fournies.
            </p>
          </Link>
        </div>
      </div>
      
      <Footer/>
    </div>
  )
}

export default LandingPage
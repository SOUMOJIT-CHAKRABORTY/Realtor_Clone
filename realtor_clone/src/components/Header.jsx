import { useLocation , useNavigate } from 'react-router-dom'


export default function Header() {
    const location = useLocation(); // should always wrap inside the router.
    const navigate = useNavigate()
    function pathMathRoute(route) {
        if(route === location.pathname) {
            return true;
        }
    }
  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-10'>
        <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
            <div>
                <img src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" alt="Logo"
                className='h-5 cursor-pointer ' onClick= {()=>navigate("/")} />
            </div>
            <div>
                <ul className='flex space-x-10'>
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMathRoute("/") && "border-b-red-500 text-black"}`} onClick= {()=>navigate("/")}>Home</li>
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMathRoute("/offers") && "border-b-red-500 text-black"}`} onClick= {()=>navigate("offers")}>Offers</li>
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMathRoute("/sign-in") && "border-b-red-500 text-black"}`} onClick= {()=>navigate("sign-in")}>Sign In</li>
                </ul>
            </div>
        </header>
    </div>
  )
}

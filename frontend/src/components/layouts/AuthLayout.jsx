import UI_IMG from "../../assets/images/auth-img.png";
import BG_IMG from "../../assets/images/bg.jpg";
const AuthLayout = ({children}) =>{
    return <div className ="flex">
    <div className="w-full md:w-[60vw] h-full px-12 pt-8 pb-12 flex flex-col">
        <h2 className="text-2xl font-semibold text-black mb-6">Task Manager</h2>
        {children}
      </div>
  
      <div
        className="hidden md:flex w-[40vw] h-full items-center justify-center bg-blue-50 overflow-hidden p-8"
        // Optional background image instead of color:
        style={{ backgroundImage: `url(${BG_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <img
          src={UI_IMG}
          alt="Auth Illustration"
          className="w-64 lg:w-[90%] object-contain"
        />
      </div>

    </div>;
};
//console.log(import.meta.url);


export default AuthLayout;
import ReactDOM from "react-dom";

const Dropdown = ({ isOpen })=> {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="z-50 fixed top-56 left-0  bg-seagreen mt-1 border border-white transform transition-transform duration-500 ease-in-out opacity-100 translate-y-0 animate-menuFadeIn">
      <ul className="flex flex-col text-center">
        <li className="py-2 hover:bg-white hover:text-black transition-colors duration-300 ease-in-out">
          Product 1
        </li>
        <li className="py-2 hover:bg-white hover:text-black transition-colors duration-300 ease-in-out">
          Product 2
        </li>
        <li className="py-2 hover:bg-white hover:text-black transition-colors duration-300 ease-in-out">
          Product 3
        </li>
        <li className="py-2 hover:bg-white hover:text-black transition-colors duration-300 ease-in-out">
          Product 4
        </li>
      </ul>
    </div>,
    document.body // Renders the dropdown in the body of the HTML
  );
}

export default Dropdown;
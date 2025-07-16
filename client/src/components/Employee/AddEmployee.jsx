import { useContext, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { BiLoader } from "react-icons/bi";
import { postData } from "../../utils/api";
import { toast } from "react-toastify"; // Assuming you are using react-toastify
import { MyContext } from "../../App";

function AddEmployee() {
  const [isLoading, setIsLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [formFields, setFormFields] = useState({
    fullName: "",
    salary: 0,
    contact: "",
    avatar: "",
  });

  const context = useContext(MyContext);

  const handleOnChangeFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviews([imageUrl]);
      setFormFields((prevState) => ({
        ...prevState,
        avatar: file,
      }));
    }
  };

  const handleOnChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formFields.fullName === "") {
      toast.error("Please enter employee name!");
      return;
    }
    if (formFields.salary === 0) {
      toast.error("Please enter employee salary!");
      return;
    }
    setIsLoading(true);
    postData("/api/employee", formFields).then((res) => {
      if (res?.success === true) {
        toast.success(res?.message);
        context.setOpenModel({ open: false, _id: null, type: null });
        context?.setEmployeesData((prev) => {
          return [...prev, res?.data];
        });
        setIsLoading(false);
        setFormFields({
          fullName: "",
          salary: 0,
          contact: "",
          avatar: "",
        });
        setPreviews([]);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="rounded-full w-[110px] bg-gray-200 !mx-auto aspect-square flex items-center justify-center object-cover overflow-hidden relative !mb-[1rem] group cursor-pointer">
        {previews.length > 0 ? (
          previews.map((img, index) => (
            <img
              src={img}
              key={index}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ))
        ) : (
          <img
            src={"https://www.freeiconspng.com/uploads/upload-icon-30.png"}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        )}

        <div className="overlay w-full h-full absolute top-0 items-center justify-center left-0 z-50 bg-[rgba(0,0,0,0.5)] opacity-0 transition flex group-hover:opacity-100">
          <FaCloudUploadAlt className="text-[#fff] text-[25px]" />
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="opacity-0 absolute top-0 cursor-pointer left-0 w-full h-full"
            onChange={handleOnChangeFile}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <label
            htmlFor="fullName"
            className="block !mb-[0.2rem] text-sm font-medium text-gray-600"
          >
            FullName
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formFields?.fullName}
            onChange={handleOnChangeInput}
            placeholder="Employee full name"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full !p-[0.6rem]"
          />
        </div>
        <div className="!mb-[0.5rem]">
          <label
            htmlFor="salary"
            className="block !mb-[0.2rem] text-sm font-medium text-gray-600"
          >
            Salary
          </label>
          <input
            type="number"
            name="salary"
            value={formFields?.salary}
            onChange={handleOnChangeInput}
            id="salary"
            placeholder="₹0.00"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full !p-[0.6rem]"
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 !mb-[0.5rem] w-full hover:bg-blue-800 font-medium rounded-lg text-md !p-[0.5rem] flex items-center justify-center"
        >
          {isLoading ? <BiLoader className="animate-spin" size={22} /> : "Add"}
        </button>
      </div>
    </form>
  );
}

export default AddEmployee;

import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MyContext } from "../../App";
import { editData } from "../../utils/api";
import { BiLoader } from "react-icons/bi";
import { FaCloudUploadAlt } from "react-icons/fa";

function EditEmployee() {
  const context = useContext(MyContext);

  const [isLoading, setIsLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [formFields, setFormFields] = useState({
    fullName: "",
    salary: 0,
    avatar: "",
    joiningDate: "",
  });

  useEffect(() => {
    const currEmp = context?.employeesData?.find(
      (emp) => emp?._id === context?.openModel?._id
    );

    setFormFields({
      fullName: currEmp?.fullName || "",
      salary: currEmp?.salary || 0,
      avatar:
        currEmp?.avatar ||
        "https://www.freeiconspng.com/uploads/upload-icon-30.png",
      joiningDate: currEmp?.joiningDate
        ? new Date(currEmp.joiningDate).toISOString().split("T")[0]
        : "",
    });
  }, []);

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

  const handleEditEmployee = async (e) => {
    e.preventDefault();

    const empId =
      context?.openModel?.type === "Edit Employee" && context?.openModel?._id;
    if (!empId) {
      toast.error("Employee not found!");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", formFields.fullName);
    formData.append("salary", formFields.salary);
    formData.append(
      "joiningDate",
      new Date(formFields.joiningDate).toISOString()
    );

    if (formFields.avatar && typeof formFields.avatar !== "string") {
      formData.append("avatar", formFields.avatar);
    }

    setIsLoading(true);
    try {
      const res = await editData(`/api/employee/${empId}`, formData);
      console.log(res)
      if (res?.data?.success === true) {
        toast.success(res?.data?.message);

        // update employee data in context
        const updated = context?.employeesData?.map(emp => emp?._id === empId ? res?.data?.data : emp);

        context.setEmployeesData(updated);

        context.setOpenModel({ open: false, _id: null, type: null });
      }
    } catch (err) {
      toast.error("Something went wrong while updating.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleEditEmployee} className="w-full">
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
            src={
              typeof formFields.avatar === "string"
                ? formFields.avatar
                : "https://www.freeiconspng.com/uploads/upload-icon-30.png"
            }
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
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formFields.fullName}
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
            value={formFields.salary}
            onChange={handleOnChangeInput}
            id="salary"
            placeholder="₹0.00"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full !p-[0.6rem]"
          />
        </div>
        <div className="!mb-[0.5rem]">
          <label
            htmlFor="joiningDate"
            className="block !mb-[0.2rem] text-sm font-medium text-gray-600"
          >
            Joining Date
          </label>
          <input
            type="date"
            id="joiningDate"
            name="joiningDate"
            value={formFields.joiningDate}
            onChange={handleOnChangeInput}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full !p-[0.6rem]"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="text-white bg-blue-700 !mb-[0.5rem] w-full hover:bg-blue-800 font-medium rounded-lg text-md !p-[0.5rem] flex items-center justify-center"
        >
          {isLoading ? (
            <BiLoader className="animate-spin" size={22} />
          ) : (
            "Update Details"
          )}
        </button>
      </div>
    </form>
  );
}

export default EditEmployee;

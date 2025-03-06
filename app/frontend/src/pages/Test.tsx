import { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
  companyName: string;
  companyDescription: string;
};

type AuthGeneralProps = {
  onNext: () => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
};

type AuthCompanyProps = {
  onBack: () => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
};

const AuthGeneral: React.FC<AuthGeneralProps> = ({ onNext, formData, setFormData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ defaultValues: formData });
  
  const onSubmit = (data: FormData) => {
    setFormData({ ...formData, ...data });
    onNext();
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Step 1: User Credentials</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-2 border rounded"
          {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Next</button>
      </form>
    </div>
  );
};

const AuthCompany: React.FC<AuthCompanyProps> = ({ onBack, formData, setFormData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ defaultValues: formData });
  
  const onSubmit = (data: FormData) => {
    setFormData({ ...formData, ...data });
    console.log("Form Submitted", { ...formData, ...data });
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Step 2: Company Information</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Company Name"
          className="w-full p-2 mb-2 border rounded"
          {...register("companyName", { required: "Company name is required" })}
        />
        {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}
        
        <textarea
          placeholder="Company Description"
          className="w-full p-2 mb-2 border rounded"
          {...register("companyDescription", { required: "Company description is required" })}
        />
        {errors.companyDescription && <p className="text-red-500 text-sm">{errors.companyDescription.message}</p>}
        
        <div className="flex justify-between">
          <button type="button" onClick={onBack} className="bg-gray-500 text-white p-2 rounded">Back</button>
          <button type="submit" className="bg-green-500 text-white p-2 rounded">Submit</button>
        </div>
      </form>
    </div>
  );
};

const MultiStepAuth: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    companyName: "",
    companyDescription: ""
  });

  return (
    <div className="max-w-md mx-auto mt-10">
      {step === 1 ? (
        <AuthGeneral onNext={() => setStep(2)} formData={formData} setFormData={setFormData} />
      ) : (
        <AuthCompany onBack={() => setStep(1)} formData={formData} setFormData={setFormData} />
      )}
    </div>
  );
};

export default MultiStepAuth;

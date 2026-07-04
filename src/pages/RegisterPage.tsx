import { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import { addUser, type DbUser } from "../lib/indexedDb";
import { generatePrivateKey } from "../lib/crypto";
import { generatePasswordVerifier } from "../lib/authentication";

export interface AuthData {
  username: string;
  password: string;
}

export default function RegisterPage() {

  const [ errors, setErrors ] = useState<Partial<Record<keyof AuthData, string>>>({});
  const [ form, setForm ] = useState<AuthData>({
    username: "",
    password: ""
  });
  const [ showPassword, setShowPassword ] = useState<boolean>(false);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({...prev, [name]: value}));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof AuthData, string>> = {};
    
    const username = form.username.trim().toLowerCase();
    const password = form.password.trim();

    if (!username) newErrors.username = "Username is Required";
    if (password.length < 10) newErrors.password = "Password must be at least 10 characters";
    if (!/^[a-zA-Z0-9]+$/.test(username)) newErrors.username = "Username can only contain number of letters";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function submitForm(e: React.SubmitEvent<HTMLFormElement>) {
    try {
      setIsLoading(true);

      e.preventDefault();

      if(!validate()) return;
      const privateKeyData = await generatePrivateKey(form.password.trim());
      const verifier = await generatePasswordVerifier(privateKeyData.key);


      const newUser: Omit<DbUser, "id" | "createdAt" | "updatedAt"> = {
        username: form.username.trim().toLowerCase(),
        salt: privateKeyData.salt,

        verifierIv: verifier.iv,
        passwordVerifier: verifier.ciphertext
      }
      await addUser(newUser);
    } catch (error) {

      if(error instanceof DOMException && error.name === "ConstraintError") {
        setErrors({ username: "Username already exists" });
      } else {
        console.error("Error occurred while registering user:", error);
      }
    } finally {
      setIsLoading(false);
    }
}

  return (
    <AuthLayout>
      <div className="bg-primary-color flex flex-col gap-5 p-5 rounded-sm lg:w-1/5 md:w-1/2 sm:w-5/6">
        <h1 className="text-3xl font-bold text-center">
          Register
        </h1>
        <form 
          onSubmit={(e) => submitForm(e)}
          className="flex flex-col gap-10 text-text-color font-semibold"
        >
          <div className="flex flex-col gap-3">
            <label className="text-sm">Username:</label>
            <input 
              value={form.username}
              onChange={e => handleChange(e)}
              name="username"
              type="text" 
              className={`border-b ${ errors.username ? "border-error-color" : "border-secondary-color"} p-1 focus:outline-none focus:border-button-color font-normal tracking-wide`}
            />
            <span className="text-xs text-error-color">
              {errors.username}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-sm">Password:</label>
            <div className="w-full relative">
              <input 
                value={form.password}
                onChange={e => handleChange(e)}
                name="password"
                type={ showPassword ? "text" : "password" } 
                className={`w-full border-b ${ errors.password ? "border-error-color" : "border-secondary-color"} p-1 focus:outline-none focus:border-button-color font-normal tracking-wide bg-transparent`}
              />
              <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-0 bottom-1 text-sm text-button-color hover:text-button-color/80 focus:outline-none cursor-pointer"
                >
                  { showPassword ? "Hide" : "Show" } 
              </button>
            </div>
            <span className="text-xs font-semibold text-error-color">
              {errors.password}
            </span>
          </div>
          <button 
            type="submit"
            className="py-3 font-semibold text-primary-color bg-button-color cursor-pointer hover:bg-button-color/80"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}
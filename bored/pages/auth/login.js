import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

export default function Login() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  //Sign in with Google
  const googleProvider = new GoogleAuthProvider();
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      route.push("/"); // redirect to homepage
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      // if user already logged in
      route.push("/"); // redirect to homepage
    } else {
      console.log("need to login.");
    }
  }, [user]); // will rerun every time user changes

  return (
    <div className="shadow-xl mt-32 p-10 text-gray-700 rounded-lg">
      <h2 className="text-2xl font-medium">Join Now!</h2>
      <div className="py-4">
        <button
          onClick={GoogleLogin}
          className="text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-4"
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
export default function Nav() {
  const [user, loading] = useAuthState(auth);
  return (
    <nav className="flex justify-between items-center py-10">
      <Link href="/">
        <button className="text-5xl text-white font-medium">
          Bulletin Bored
        </button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link
            className="py-2 px-4 text-sm bg-blue-500 text-white rounded-lg font-medium ml-8"
            href={"/auth/login"}
          >
            Sign In
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-6">
            <Link href="/post">
              <button className="font-medium bg-blue-500 text-white py-2 px-4 rounded-lg text-sm">
                Create Post
              </button>
            </Link>
            <Link href="/dashboard">
              <img
                referrerPolicy="no-referrer"
                className="w-12 rounded-full cursor-pointer"
                src={user.photoURL}
              />
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}

import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Post() {
  //Form state
  const [post, setPost] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);
  const route = useRouter();

  //Submit post
  const submitPost = async (e) => {
    e.preventDefault(); // prevents loss of data on refresh
    //Check if length is 0
    if (!post.description) {
      toast.error("Description field cannot be empty!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000, //three seconds before error disappears
      });
      return;
    }
    //Check if length exceeds max
    if (post.description.length > 280) {
      toast.error("Description field cannot exceed 280 characters!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000, //three seconds before error disappears
      });
      return;
    }
    //Make a new post
    const collectionRef = collection(db, "posts");
    await addDoc(collectionRef, {
      ...post,
      timestamp: serverTimestamp(),
      user: user.uid,
      avatar: user.photoURL,
      username: user.displayName,
    });
    setPost({ description: "" }); //clear description after successful post
    return route.push("/"); //redirect to home page
  };
  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold">Create a new post</h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="bg-gray-600 h-48 w-full text-white rounded-lg p-2 text-sm"
          ></textarea>
          <p
            //   make post description red if length greater than 280
            className={`text-blue-500 font-medium text-sm ${
              post.description.length > 280 ? "text-red-600" : ""
            }`}
          >
            {post.description.length}/280
          </p>
        </div>
        <button className="w-full bg-blue-500 text-white font-medium p-2 my-2 rounded-lg text-sm">
          Submit
        </button>
      </form>
    </div>
  );
}

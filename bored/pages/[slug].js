import Message from "../components/message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import {
  arrayUnion,
  doc,
  updateDoc,
  getDoc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { toast } from "react-toastify";

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  //Submit a comment
  const submitComment = async () => {
    //Check if user logged in
    if (!auth.currentUser) return router.push("/auth/login");

    // check for empty comment
    if (!message) {
      toast.error("Comment cannot be empty!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    }

    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });
    setMessage("");
  };

  // Get comments
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data().comments);
    });
    return unsubscribe;
  };

  useEffect(() => {
    // only run this hook if router data is ready. otherwise will err
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);

  return (
    <div>
      <Message {...routeData}></Message>
      <div className="my-4">
        <div className="flex">
          <input
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            value={message}
            placeholder="Add a comment"
            className="bg-gray-800 w-full p-2 text-white text-sm rounded-lg"
          />
          <button
            onClick={submitComment}
            className="bg-blue-500 text-white py-2 px-4 text-sm rounded-lg"
          >
            Submit
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allMessages?.map((msg) => (
            <div
              className="bg-white p-4 my-4 border-2 rounded-xl"
              key={msg.time}
            >
              <div className="flex items-center gap-2 mb-4">
                <img className="w-10 rounded-full" src={msg.avatar} />
                <h2>{msg.username}</h2>
              </div>
              <h2>{msg.message}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaCopy, FaShareSquare } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { PiWarningCircle } from "react-icons/pi";
import { useRouter } from "next/router";


const WritingGame = ({ writingGameSettings }) => {
  const { secondsOfLife, totalSessionDuration, waitingTime, prompt } = writingGameSettings;
  const router = useRouter();

  const [thisSessionData, setThisSessionData] = useState({
    sessionBrowserId: null,
    sessionDatabaseId: null,
    started: false,
    finished: false,
    won: false,
    savedOnIrys: false,
    startingTimestamp: null,
    endingTimestamp: null,
    text: "",
    cid: "",
    timeWritten: 0,
  });
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [isLifeOver, setIsLifeOver] = useState(false);
  const [time, setTime] =useState(false);
  const [text, setText] = useState("");
  const [newenBarLength, setNewenBarLength] = useState(0);
  const [lifeBarLength, setLifeBarLength] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [lastKeystroke, setLastKeystroke] = useState(undefined);
  const [castCreated, setCastCreated] = useState(false);
  const [castId, setCastId] = useState(null);
  const [deletingCast, setDeletingCast] = useState(false)


  const startingIntervalRef = useRef(null);
  const intervalRef = useRef(null);
  const keystrokeIntervalRef = useRef(null);
  const textAreaRef = useRef(null);

  const scrollToBottom = () => {
    if (textAreaRef.current) {
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // state management for the 8 second timer trigger
    if (sessionStarted && !isTimeOver) {
      keystrokeIntervalRef.current = setInterval(() => {
        const now = new Date().getTime();
        const elapsedTimeBetweenKeystrokes = Date.now() - lastKeystroke;
        if (elapsedTimeBetweenKeystrokes > secondsOfLife * 1000) {
          finishWritingSession()
          clearInterval(keystrokeIntervalRef.current);
        } else {
          const newLifeBarLength =
            100 - elapsedTimeBetweenKeystrokes / (10 * secondsOfLife);
          setLifeBarLength(Math.max(newLifeBarLength, 0));
        }
      }, 100);
    }
    return () => clearInterval(keystrokeIntervalRef.current);
  }, [sessionStarted, lastKeystroke]);

  const handleTextChange = e => {
    setText(e.target.value);
    const now = Date.now();
    setLastKeystroke(now);
  };

  const finishWritingSession = async () => {
    try {
      setSessionStarted(false);
      setIsTimeOver(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROUTE}/finish-session`, {
        text: text,
      });
      if (response.data.castHash) {
        setCastId(response.data.castHash);
        setCastCreated(true);
      }
      console.log('The response after writing the session is: ', response);
    } catch (error) {
      console.error("There was an error saving the session", error);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="w-full h-8 flex bg-black text-white justify-center items-center"><p>just write. we will do the rest.</p></div>
      <>
        <div className="h-4 w-full overflow-hidden">
          <div
            className="h-full opacity-80 newen-bar rounded-r-xl"
            style={{ width: `100%` }}
          ></div>
        </div>
        <div className="h-1 w-full overflow-hidden">
          <div
            className="h-full opacity-80 life-bar rounded-r-xl"
            style={{ width: `${lifeBarLength}%` }}
          ></div>
        </div>
      </>

      <div className="px-4 md:px-0 md:w-1/2 mx-auto py-4 grow ">
      {!castCreated ? (
        <textarea
          ref={textAreaRef}
          style={{ fontStyle: "italic" }}
          onPaste={(e) => e.preventDefault()}
          disabled={isTimeOver}
          onClick={()=>{setSessionStarted(true)}}
          onChange={handleTextChange}
          className={`${isTimeOver ? 'textarea-timeover' : 'textarea-normal'} w-full h-full shadow-md mx-auto placeholder:italic italic opacity-80 text-black italic border border-white p-3 cursor-pointer`}
          placeholder="Start writing..."
        />
      ) : (
        <div className="text-center p-4">
          <h2>Your thoughts have been casted!</h2>
          <button
            className="bg-blue-500 text-white p-2 m-2 rounded-lg"
            onClick={() => window.open(`https://warpcast.com/anky/${castId.slice(0,10)}`, "_blank")}
          >
            View on Farcaster
          </button>
          <button
            className={`text-white p-2 m-2 rounded-lg ${deletingCast ? 'deleting-animation bg-red-200' : 'bg-red-500'}`}
            onClick={async () => {
              if (!deletingCast) {  // Prevent re-triggering during animation
                setDeletingCast(true);
                try {
                  await axios.delete(`${process.env.NEXT_PUBLIC_API_ROUTE}/delete-cast`, { params: { castId } });
                  setCastCreated(false);
                  setSessionStarted(true);
                  setIsTimeOver(false);
                  setCastId("");
                  setDeletingCast(false); 
                  setText("");
                  const now = Date.now();
                  setLastKeystroke(now);
                } catch (error) {
                  console.error("Error deleting the cast", error);
                  setDeletingCast(false);  // Reset state in case of error
                }
              }
            }}
          >
            {deletingCast ? "Deleting..." : "Delete Forever"}
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default WritingGame;

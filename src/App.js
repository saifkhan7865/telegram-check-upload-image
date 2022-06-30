import "./styles.css";
import { useEffect, useRef, useState } from "react";
import { Telegram } from "./Telegram";
import { asyncButtonListner } from "./AuthUtils";

export default function App() {
  const phoneNumber = useRef();

  const [showAuthBox, setShowAuthBox] = useState(false);
  const OTP = useRef();
  const [password, setpassword] = useState("");
  const [state, setState] = useState("PHONE_NUMBER");
  async function StartAuthentication() {
    setShowAuthBox(true);
    let stringSession = localStorage.getItem("ishantoken");
    const telegram = new Telegram({
      apiHash: "14e66fb48343706b14daa82ccbeb05d9",
      apiId: 15701863,
      stringSession: stringSession,
    });

    SignINTelegram(telegram);
  }

  // downloading the image
  // const downloadImage = async (url) => {
  //   // console.log(url);

  //   const data = await fetch(url, {
  //     mode: "no-cors",
  //   });

  //   const blob = await (await data.blob()).arrayBuffer();

  //   return blob;
  // };

  //download image from URL
  const downloadImage = async (url) => {
    const response = await fetch(url, {
      mode: "no-cors",
    });
    const blob = await response.blob();
    return blob;
  };
  // //download the image from a url and get all the data
  // const downloadImage = async (url) => {
  //   const data = await fetch(url, {
  //     mode: "no-cors",
  //   });
  //   const blob = await data.blob();
  //   return blob;
  // };

  useEffect(() => {
    // async function getTelegram(telegram) {
    //   // let stringSession = localStorage.getItem("ishantoken");

    //   await telegram.connect();
    //   // const data = await telegram.getAccountDetails();

    //   const channels = await telegram.getAllAdminChannels();

    //   console.log(channels);
    //   // const channelsid; // assign a channel id to it

    //   const channelid = String(parseInt("784721677n"));
    //   const image = await downloadImage("https://place-hold.it/100x100");
    //   console.log(await image.arrayBuffer());

    //   // const result = await telegram.addImageToGroup(image,channelsid)
    // }
    let stringSession = localStorage.getItem("ishantoken");
    const telegram = new Telegram({
      apiHash: "example 123",
      apiId: 12312313,
      stringSession: stringSession,
    });
    // getTelegram(telegram);
  }, []);

  function SignINTelegram(telegram) {
    telegram
      .signIn({
        onInputPhoneNumber: async () => {
          await asyncButtonListner("onNextClicked");
          let phone = phoneNumber.current.value;
          setState("OTP");
          if (phone == null) {
            phone = "";
          }
          return phone;
        },
        onInputPhoneCode: async () => {
          await asyncButtonListner("onNextClicked");

          console.log("next clicked");
          let otp = OTP.current.value;
          console.log(otp);
          if (otp == null) {
            otp = "000000";
          }
          return otp;
        },
        onInputPassword: async () => {
          await asyncButtonListner("onNextClicked");

          let passwords = password;
          if (passwords == null) {
            passwords = "22222";
          }

          return passwords;
        },
      })
      .then((res) => {
        console.log(res);
      });
  }
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>

      <button onClick={StartAuthentication}> Start Auth</button>

      {showAuthBox && (
        <>
          {state === "PHONE_NUMBER" && (
            <>
              <input ref={phoneNumber} name="phoneNumber" id="phoneNumber" />
            </>
          )}
          {state === "OTP" && (
            <>
              <input ref={OTP} name="OTP" id="OTP" />
            </>
          )}
          <button id="onNextClicked">Next</button>
        </>
      )}
    </div>
  );
}

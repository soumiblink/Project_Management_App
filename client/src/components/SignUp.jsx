// import {
//   CloseRounded,
//   EmailRounded,
//   PasswordRounded,
//   Person,
//   Visibility,
//   VisibilityOff,
//   TroubleshootRounded,
// } from "@mui/icons-material";
// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import { useTheme } from "styled-components";
// import Google from "../Images/google.svg";
// import { IconButton, Modal } from "@mui/material";
// import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
// import { openSnackbar } from "../redux/snackbarSlice";
// import { useDispatch } from "react-redux";
// import axios from "axios";
// import CircularProgress from "@mui/material/CircularProgress";
// import validator from "validator";
// import { googleSignIn, signUp } from "../api/index";
// import OTP from "./OTP";
// import { useGoogleLogin } from "@react-oauth/google";

// const Container = styled.div`
//   width: 100%;
//   height: 100%;
//   position: absolute;
//   top: 0;
//   left: 0;
//   background-color: #000000a7;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const Wrapper = styled.div`
//   width: 360px;
//   border-radius: 30px;
//   background-color: ${({ theme }) => theme.bgLighter};
//   color: ${({ theme }) => theme.text};
//   padding: 10px;
//   display: flex;
//   flex-direction: column;
//   position: relative;
// `;

// const Title = styled.div`
//   font-size: 22px;
//   font-weight: 500;
//   color: ${({ theme }) => theme.text};
//   margin: 16px 28px;
// `;
// const OutlinedBox = styled.div`
//   height: 44px;
//   border-radius: 12px;
//   border: 1px solid ${({ theme }) => theme.soft2};
//   color: ${({ theme }) => theme.soft2};
//   ${({ googleButton, theme }) =>
//     googleButton &&
//     `
//     user-select: none; 
//   gap: 16px;`}
//   ${({ button, theme }) =>
//     button &&
//     `
//     user-select: none; 
//   border: none;
//     background: ${theme.itemHover};
//     color: '${theme.soft2}';`}
//     ${({ activeButton, theme }) =>
//     activeButton &&
//     `
//     user-select: none; 
//   border: none;
//     background: ${theme.primary};
//     color: white;`}
//   margin: 3px 20px;
//   font-size: 14px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   font-weight: 500;
//   padding: 0px 14px;
// `;
// const GoogleIcon = styled.img`
//   width: 22px;
// `;
// const Divider = styled.div`
//   display: flex;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   color: ${({ theme }) => theme.soft};
//   font-size: 14px;
//   font-weight: 600;
// `;
// const Line = styled.div`
//   width: 80px;
//   height: 1px;
//   border-radius: 10px;
//   margin: 0px 10px;
//   background-color: ${({ theme }) => theme.soft};
// `;

// const TextInput = styled.input`
//   width: 100%;
//   border: none;
//   font-size: 14px;
//   border-radius: 3px;
//   background-color: transparent;
//   outline: none;
//   color: ${({ theme }) => theme.textSoft};
// `;

// const LoginText = styled.div`
//   font-size: 14px;
//   font-weight: 500;
//   color: ${({ theme }) => theme.soft2};
//   margin: 20px 20px 38px 20px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;
// const Span = styled.span`
//   color: ${({ theme }) => theme.primary};
// `;

// const Error = styled.div`
//   color: red;
//   font-size: 10px;
//   margin: 2px 26px 8px 26px;
//   display: block;
//   ${({ error, theme }) =>
//     error === "" &&
//     `    display: none;
//     `}
// `;

// const SignUp = ({ setSignUpOpen, setSignInOpen }) => {

//   const [nameValidated, setNameValidated] = useState(false);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [Loading, setLoading] = useState(false);
//   const [disabled, setDisabled] = useState(true);
//   const [emailError, setEmailError] = useState("");
//   const [credentialError, setcredentialError] = useState("");
//   const [passwordCorrect, setPasswordCorrect] = useState(false);
//   const [nameCorrect, setNameCorrect] = useState(false);
//   const [values, setValues] = useState({
//     password: "",
//     showPassword: false,
//   });

//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);

//   const dispatch = useDispatch();

//   const createAccount = () => {
//     if (otpVerified) {
//       dispatch(loginStart());
//       setDisabled(true);
//       setLoading(true);
//       try {
//         signUp({ name, email, password }).then((res) => {
//           if (res.status === 200) {
//             dispatch(loginSuccess(res.data));
//             dispatch(
//               openSnackbar({ message: `OTP verified & Account created successfully`, severity: "success" })
//             );
//             setLoading(false);
//             setDisabled(false);
//             setSignUpOpen(false);
//             setSignInOpen(false);
//           } else {
//             dispatch(loginFailure());
//             setcredentialError(`${res.data.message}`);
//             setLoading(false);
//             setDisabled(false);
//           }
//         });
//       } catch (err) {
//         dispatch(loginFailure());
//         setLoading(false);
//         setDisabled(false);
//         dispatch(
//           openSnackbar({
//             message: err.message,
//             severity: "error",
//           })
//         );
//       }
//     }
//   };

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     if (!disabled) {
//       setOtpSent(true);
//     }

//     if (name === "" || email === "" || password === "") {
//       dispatch(
//         openSnackbar({
//           message: "Please fill all the fields",
//           severity: "error",
//         })
//       );
//     }
//   };

//   useEffect(() => {
//     if (email !== "") validateEmail();
//     if (password !== "") validatePassword();
//     if (name !== "") validateName();
//     if (
//       name !== "" &&
//       validator.isEmail(email) &&
//       passwordCorrect &&
//       nameCorrect
//     ) {
//       setDisabled(false);
//     } else {
//       setDisabled(true);
//     }
//   }, [name, email, passwordCorrect, password, nameCorrect]);

//   useEffect(() => {
//     createAccount();
//   }, [otpVerified]);

//   //validate email
//   const validateEmail = () => {
//     if (validator.isEmail(email)) {
//       setEmailError("");
//     } else {
//       setEmailError("Enter a valid Email Id!");
//     }
//   };

//   //validate password
//   const validatePassword = () => {
//     if (password.length < 8) {
//       setcredentialError("Password must be atleast 8 characters long!");
//       setPasswordCorrect(false);
//     } else if (password.length > 16) {
//       setcredentialError("Password must be less than 16 characters long!");
//       setPasswordCorrect(false);
//     } else if (
//       !password.match(/[a-z]/g) ||
//       !password.match(/[A-Z]/g) ||
//       !password.match(/[0-9]/g) ||
//       !password.match(/[^a-zA-Z\d]/g)
//     ) {
//       setPasswordCorrect(false);
//       setcredentialError(
//         "Password must contain atleast one lowercase, uppercase, number and special character!"
//       );
//     } else {
//       setcredentialError("");
//       setPasswordCorrect(true);
//     }
//   };

//   //validate name
//   const validateName = () => {
//     if (name.length < 4) {
//       setNameValidated(false);
//       setNameCorrect(false);
//       setcredentialError("Name must be atleast 4 characters long!");
//     } else {
//       setNameCorrect(true);
//       if (!nameValidated) {
//         setcredentialError("");
//         setNameValidated(true);
//       }

//     }
//   };

//   //Google SignIn
//   const googleLogin = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       setLoading(true);
//       const user = await axios.get(
//         'https://www.googleapis.com/oauth2/v3/userinfo',
//         { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
//       ).catch((err) => {
//         dispatch(loginFailure());
//         dispatch(
//           openSnackbar({
//             message: err.message,
//             severity: "error",
//           })
//         );
//       });

//       googleSignIn({
//         name: user.data.name,
//         email: user.data.email,
//         img: user.data.picture,
//       }).then((res) => {
//         console.log(res);
//         if (res.status === 200) {
//           dispatch(loginSuccess(res.data));
//           setSignUpOpen(false);
//           dispatch(
//             openSnackbar({
//               message: "Logged In Successfully",
//               severity: "success",
//             })
//           );

//           setLoading(false);
//         } else {
//           dispatch(loginFailure(res.data));
//           dispatch(
//             openSnackbar({
//               message: res.data.message,
//               severity: "error",
//             })
//           );
//           setLoading(false);
//         }
//       });
//     },
//     onError: errorResponse => {
//       dispatch(loginFailure());
//       dispatch(
//         openSnackbar({
//           message: errorResponse.error,
//           severity: "error",
//         })
//       );
//       setLoading(false);
//     },
//   });


//   const theme = useTheme();
//   //ssetSignInOpen(false)
//   return (
//     <Modal open={true} onClose={() => setSignInOpen(false)}>
//       <Container>
//         <Wrapper>
//           <CloseRounded
//             style={{
//               position: "absolute",
//               top: "24px",
//               right: "30px",
//               cursor: "pointer",
//             }}
//             onClick={() => setSignUpOpen(false)}
//           />
//           {!otpSent ?
//             <>
//               <Title>Sign Up</Title>
//               <OutlinedBox
//                 googleButton={TroubleshootRounded}
//                 style={{ margin: "24px" }}
//                 onClick={() => googleLogin()}
//               >
//                 {Loading ? (
//                   <CircularProgress color="inherit" size={20} />
//                 ) : (
//                   <>
//                     <GoogleIcon src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1000px-Google_%22G%22_Logo.svg.png?20210618182606" />
//                     Sign In with Google</>
//                 )}
//               </OutlinedBox>
//               <Divider>
//                 <Line />
//                 or
//                 <Line />
//               </Divider>
//               <OutlinedBox style={{ marginTop: "24px" }}>
//                 <Person
//                   sx={{ fontSize: "20px" }}
//                   style={{ paddingRight: "12px" }}
//                 />
//                 <TextInput
//                   placeholder="Full Name"
//                   type="text"
//                   onChange={(e) => setName(e.target.value)}
//                 />
//               </OutlinedBox>
//               <OutlinedBox>
//                 <EmailRounded
//                   sx={{ fontSize: "20px" }}
//                   style={{ paddingRight: "12px" }}
//                 />
//                 <TextInput
//                   placeholder="Email Id"
//                   type="email"
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </OutlinedBox>
//               <Error error={emailError}>{emailError}</Error>
//               <OutlinedBox>
//                 <PasswordRounded
//                   sx={{ fontSize: "20px" }}
//                   style={{ paddingRight: "12px" }}
//                 />
//                 <TextInput
//                   type={values.showPassword ? "text" : "password"}
//                   placeholder="password"
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <IconButton
//                   color="inherit"
//                   onClick={() =>
//                     setValues({ ...values, showPassword: !values.showPassword })
//                   }
//                 >
//                   {values.showPassword ? (
//                     <Visibility sx={{ fontSize: "20px" }} />
//                   ) : (
//                     <VisibilityOff sx={{ fontSize: "20px" }} />
//                   )}
//                 </IconButton>
//               </OutlinedBox>
//               <Error error={credentialError}>{credentialError}</Error>
//               <OutlinedBox
//                 button={true}
//                 activeButton={!disabled}
//                 style={{ marginTop: "6px" }}
//                 onClick={handleSignUp}
//               >
//                 {Loading ? (
//                   <CircularProgress color="inherit" size={20} />
//                 ) : (
//                   "Create Account"
//                 )}
//               </OutlinedBox>



//             </>

//             :
//             <OTP email={email} name={name} otpVerified={otpVerified} setOtpVerified={setOtpVerified} />
//           }
//           <LoginText>
//             Already have an account ?
//             <Span
//               onClick={() => {
//                 setSignUpOpen(false);
//                 setSignInOpen(true);
//               }}
//               style={{
//                 fontWeight: "500",
//                 marginLeft: "6px",
//                 cursor: "pointer",
//               }}
//             >
//               Sign In
//             </Span>
//           </LoginText>
//         </Wrapper>
//       </Container>
//     </Modal>
//   );
// };

// export default SignUp;
import {
  CloseRounded,
  EmailRounded,
  PasswordRounded,
  Person,
  Visibility,
  VisibilityOff,
  TroubleshootRounded,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { IconButton, Modal } from "@mui/material";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { openSnackbar } from "../redux/snackbarSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import validator from "validator";
import { googleSignIn, signUp } from "../api/index";
import OTP from "./OTP";
import { useGoogleLogin } from "@react-oauth/google";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.92) 100%);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Wrapper = styled.div`
  width: 400px;
  max-width: 90vw;
  border-radius: 24px;
  background: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 32px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  color: ${({ theme }) => theme.soft2};

  &:hover {
    background: ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.text};
    transform: rotate(90deg);
  }
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.soft2};
  text-align: center;
  margin-bottom: 32px;
`;

const OutlinedBox = styled.div`
  height: 48px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.soft2};
  color: ${({ theme }) => theme.soft2};
  margin-bottom: 16px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  padding: 0px 16px;
  transition: all 0.3s ease;
  cursor: ${({ button, activeButton }) => (button || activeButton) ? 'pointer' : 'default'};

  &:hover {
    ${({ button, activeButton, theme }) =>
      (button || activeButton) &&
      `
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `}
  }

  ${({ googleButton, theme }) =>
    googleButton &&
    `
    user-select: none; 
    gap: 12px;
    border: 1px solid ${theme.soft2};
    background: transparent;
    cursor: pointer;
    
    &:hover {
      background: ${theme.soft};
      border-color: ${theme.primary};
    }
  `}

  ${({ button, theme }) =>
    button &&
    `
    user-select: none; 
    border: 1px solid ${theme.soft2};
    background: ${theme.itemHover};
    color: ${theme.soft2};
  `}

  ${({ activeButton, theme }) =>
    activeButton &&
    `
    user-select: none; 
    border: none;
    background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.primary}dd 100%);
    color: white;
    box-shadow: 0 4px 15px ${theme.primary}40;
    
    &:hover {
      box-shadow: 0 6px 20px ${theme.primary}60;
    }
  `}
`;

const GoogleIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const Divider = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.soft2};
  font-size: 13px;
  font-weight: 500;
  margin: 24px 0;
`;

const Line = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.soft};
  margin: 0 16px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const TextInput = styled.input`
  width: 100%;
  border: none;
  font-size: 14px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
  
  &::placeholder {
    color: ${({ theme }) => theme.soft2};
  }
`;

const LoginText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.soft2};
  margin-top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
`;

const Span = styled.span`
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    text-decoration: underline;
  }
`;

const Error = styled.div`
  color: #ff4444;
  font-size: 12px;
  margin: -12px 0 12px 4px;
  display: ${({ error }) => (error === "" ? "none" : "block")};
  animation: shake 0.3s ease;

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
`;

const SignUp = ({ setSignUpOpen, setSignInOpen }) => {
  const [nameValidated, setNameValidated] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [credentialError, setcredentialError] = useState("");
  const [passwordCorrect, setPasswordCorrect] = useState(false);
  const [nameCorrect, setNameCorrect] = useState(false);
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const dispatch = useDispatch();

  const createAccount = () => {
    if (otpVerified) {
      dispatch(loginStart());
      setDisabled(true);
      setLoading(true);
      try {
        signUp({ name, email, password }).then((res) => {
          if (res.status === 200) {
            dispatch(loginSuccess(res.data));
            dispatch(
              openSnackbar({
                message: `OTP verified & Account created successfully`,
                severity: "success",
              })
            );
            setLoading(false);
            setDisabled(false);
            setSignUpOpen(false);
            setSignInOpen(false);
          } else {
            dispatch(loginFailure());
            setcredentialError(`${res.data.message}`);
            setLoading(false);
            setDisabled(false);
          }
        });
      } catch (err) {
        dispatch(loginFailure());
        setLoading(false);
        setDisabled(false);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      }
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!disabled) {
      setOtpSent(true);
    }

    if (name === "" || email === "" || password === "") {
      dispatch(
        openSnackbar({
          message: "Please fill all the fields",
          severity: "error",
        })
      );
    }
  };

  useEffect(() => {
    if (email !== "") validateEmail();
    if (password !== "") validatePassword();
    if (name !== "") validateName();
    if (
      name !== "" &&
      validator.isEmail(email) &&
      passwordCorrect &&
      nameCorrect
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, email, passwordCorrect, password, nameCorrect]);

  useEffect(() => {
    createAccount();
  }, [otpVerified]);

  //validate email
  const validateEmail = () => {
    if (validator.isEmail(email)) {
      setEmailError("");
    } else {
      setEmailError("Enter a valid Email Id!");
    }
  };

  //validate password
  const validatePassword = () => {
    if (password.length < 8) {
      setcredentialError("Password must be atleast 8 characters long!");
      setPasswordCorrect(false);
    } else if (password.length > 16) {
      setcredentialError("Password must be less than 16 characters long!");
      setPasswordCorrect(false);
    } else if (
      !password.match(/[a-z]/g) ||
      !password.match(/[A-Z]/g) ||
      !password.match(/[0-9]/g) ||
      !password.match(/[^a-zA-Z\d]/g)
    ) {
      setPasswordCorrect(false);
      setcredentialError(
        "Password must contain atleast one lowercase, uppercase, number and special character!"
      );
    } else {
      setcredentialError("");
      setPasswordCorrect(true);
    }
  };

  //validate name
  const validateName = () => {
    if (name.length < 4) {
      setNameValidated(false);
      setNameCorrect(false);
      setcredentialError("Name must be atleast 4 characters long!");
    } else {
      setNameCorrect(true);
      if (!nameValidated) {
        setcredentialError("");
        setNameValidated(true);
      }
    }
  };

  //Google SignIn
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      const user = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .catch((err) => {
          dispatch(loginFailure());
          dispatch(
            openSnackbar({
              message: err.message,
              severity: "error",
            })
          );
        });

      googleSignIn({
        name: user.data.name,
        email: user.data.email,
        img: user.data.picture,
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          dispatch(loginSuccess(res.data));
          setSignUpOpen(false);
          dispatch(
            openSnackbar({
              message: "Logged In Successfully",
              severity: "success",
            })
          );

          setLoading(false);
        } else {
          dispatch(loginFailure(res.data));
          dispatch(
            openSnackbar({
              message: res.data.message,
              severity: "error",
            })
          );
          setLoading(false);
        }
      });
    },
    onError: (errorResponse) => {
      dispatch(loginFailure());
      dispatch(
        openSnackbar({
          message: errorResponse.error,
          severity: "error",
        })
      );
      setLoading(false);
    },
  });

  const theme = useTheme();

  return (
    <Modal open={true} onClose={() => setSignInOpen(false)}>
      <Container>
        <Wrapper>
          <CloseButton onClick={() => setSignUpOpen(false)}>
            <CloseRounded />
          </CloseButton>
          {!otpSent ? (
            <>
              <Title>Create Account</Title>
              <Subtitle>Join us today and get started</Subtitle>
              <OutlinedBox googleButton={true} onClick={() => googleLogin()}>
                {Loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  <>
                   
                    Sign Up with Google
                  </>
                )}
              </OutlinedBox>
              <Divider>
                <Line />
                or
                <Line />
              </Divider>
              <OutlinedBox>
                <Person
                  sx={{ fontSize: "20px" }}
                  style={{ paddingRight: "12px" }}
                />
                <TextInput
                  placeholder="Full Name"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                />
              </OutlinedBox>
              <InputWrapper>
                <OutlinedBox>
                  <EmailRounded
                    sx={{ fontSize: "20px" }}
                    style={{ paddingRight: "12px" }}
                  />
                  <TextInput
                    placeholder="Email Address"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </OutlinedBox>
                <Error error={emailError}>{emailError}</Error>
              </InputWrapper>
              <InputWrapper>
                <OutlinedBox>
                  <PasswordRounded
                    sx={{ fontSize: "20px" }}
                    style={{ paddingRight: "12px" }}
                  />
                  <TextInput
                    type={values.showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <IconButton
                    color="inherit"
                    onClick={() =>
                      setValues({ ...values, showPassword: !values.showPassword })
                    }
                  >
                    {values.showPassword ? (
                      <Visibility sx={{ fontSize: "20px" }} />
                    ) : (
                      <VisibilityOff sx={{ fontSize: "20px" }} />
                    )}
                  </IconButton>
                </OutlinedBox>
                <Error error={credentialError}>{credentialError}</Error>
              </InputWrapper>
              <OutlinedBox
                button={disabled}
                activeButton={!disabled}
                onClick={handleSignUp}
              >
                {Loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  "Create Account"
                )}
              </OutlinedBox>
            </>
          ) : (
            <OTP
              email={email}
              name={name}
              otpVerified={otpVerified}
              setOtpVerified={setOtpVerified}
            />
          )}
          <LoginText>
            Already have an account?
            <Span
              onClick={() => {
                setSignUpOpen(false);
                setSignInOpen(true);
              }}
            >
              Sign In
            </Span>
          </LoginText>
        </Wrapper>
      </Container>
    </Modal>
  );
};

export default SignUp;
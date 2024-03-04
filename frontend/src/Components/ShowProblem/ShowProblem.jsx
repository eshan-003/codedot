import "./ShowProblem.css";
import { useContext, useEffect, useState } from "react";
import Editor from "../Editor";
import {
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  NativeSelect,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import DragHandleIcon from "@mui/icons-material/DragHandle"; // Icon for draggable handle

import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../App";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";

const ShowProblem = ({ user }) => {
  const [loader, setLoader] = useState(false);
  const { isLoggedIn, token } = useContext(UserContext);
  const { problemSlug } = useParams();
  const [problemDescriptionHTML, setProblemDescriptionHTML] = useState("");

  const [code, setCode] = useState("");
  const [lang, setLang] = useState("c_cpp");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [inputPanelHeight, setInputPanelHeight] = useState("auto");
  const [outputPanelHeight, setOutputPanelHeight] = useState("auto");

  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate("/");
  }

  const handleLanguageChange = (event) => {
    setLang(event.target.value);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoader(true);
        const PROBLEM_URL = `https://codedot-backend.vercel.app/api/problem/${problemSlug}`;
        const res = await axios.get(PROBLEM_URL, {
          headers: { Authorization: token },
        });
        if (res.status === 200) {
          setProblemDescriptionHTML(res.data.description);
        }
        setLoader(false);
      } catch (error) {
        console.log(error);
        setLoader(false);
      }
    })();
  }, []);

  const handleCodeRun = async () => {
    try {
      setLoader(true);
      let language;
      if (lang === "c_cpp") {
        language = "cpp";
      } else if (lang === "python") {
        language = "py";
      }
      const RUN_CODE_URL = `https://codedot-backend.vercel.app/api/run`;
      // console.log(input);
      const res = await axios.post(
        RUN_CODE_URL,
        { lang: language, code, input },
        { headers: { Authorization: token } }
      );
      if (res.status === 200) {
        setOutput(res.data);
      }
      setLoader(false);
    } catch (error) {
      setOutput(error.response.data.stderr);
      setLoader(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoader(true);
      let language;
      if (lang === "c_cpp") {
        language = "cpp";
      } else if (lang === "python") {
        language = "py";
      }
      const CHECK_CODE_URL = `https://codedot-backend.vercel.app/api/check/${problemSlug}`;
      const res = await axios.post(
        CHECK_CODE_URL,
        { lang: language, code, email: user.email },
        { headers: { Authorization: token } }
      );
      if (res.status === 200) {
        setOutput(res.data);
      }
      setLoader(false);
    } catch (error) {
      setOutput(error.response.data.stderr);
      setLoader(false);
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Left Section */}
      <Grid item xs={12} md={6}>
        {/* Problem Description */}
        <Paper elevation={3} style={{ height: "50vh", overflowY: "auto" }}>
          <Box p={2}>
            <Typography variant="h6" gutterBottom>
              Problem Description
            </Typography>
            <div dangerouslySetInnerHTML={{ __html: problemDescriptionHTML }} />
          </Box>
        </Paper>

        {/* Input Panel */}
        <Paper elevation={3} style={{ height: "40vh", overflowY: "auto" }}>
          <Box p={2}>
            <Typography variant="h6" gutterBottom>
              Input
            </Typography>
            <TextField
              id="outlined-multiline-static"
              multiline
              fullWidth
              rows={4}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <Box mt={1}>
              <Button variant="contained" color="error" onClick={handleCodeRun}>
                Run Code
              </Button>
            </Box>
            <Box mt={1}>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>

      {/* Right Section */}
      <Grid item xs={12} md={6}>
        {/* Code Editor */}
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Lang
          </InputLabel>
          <NativeSelect
            defaultValue="c_cpp"
            inputProps={{
              name: "lang",
              id: "uncontrolled-native",
            }}
            onChange={handleLanguageChange}
          >
            <option value="c_cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </NativeSelect>
        </FormControl>

        <Editor lang={lang} setCode={setCode} />

        {/* Output Panel */}
        <Paper elevation={3} style={{ height: "25vh", overflowY: "auto" }}>
          <Box p={2}>
            <Typography variant="h6" gutterBottom>
              Output
            </Typography>
            <TextField
              id="outlined-multiline-static"
              multiline
              fullWidth
              rows={4}
              value={output}
            />
          </Box>
        </Paper>
      </Grid>

      {/* Loader */}
      {loader && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#55AAFF", "#55AAFF", "#55AAFF", "#55AAFF", "#55AAFF"]}
          />
        </Box>
      )}
    </Grid>
  );
};

export default ShowProblem;

import './App.css';
import Image from "material-ui-image";
import {Box, Button} from "@mui/material";

function App() {
  return (
    <div className="App">
      <h1>Pool Quiz</h1>
      <Box
          component="img"
          sx={{
            height: 233,
            width: 350,
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
          }}
          src="./img/logo.png"
      />
        <Button href={"/login"} variant="contained">Login</Button>
    </div>
  );
}

export default App;

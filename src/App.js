import "./App.css";
import HomeScreen from "./pages/HomeScreen";
import { Switch, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";

const useStyles = makeStyles({
  // success: { backgroundColor: "#39F2AF" },
  // error: { backgroundColor: "#FF5A5A" },
  // warning: { backgroundColor: "#FFD458" },
});
function App() {
  const classes = useStyles();
  return (
    <SnackbarProvider
      classes={{
        variantSuccess: classes.success,
        variantError: classes.error,
        variantWarning: classes.warning,
        variantInfo: classes.info,
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      maxSnack={3}
    >
      <Switch>
        <Route exact path="/" render={() => <HomeScreen />} />
      </Switch>
    </SnackbarProvider>
  );
}

export default App;

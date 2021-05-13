import { Text, Window, hot, View, Button } from "@nodegui/react-nodegui";
import React from "react";
import { QIcon } from "@nodegui/nodegui";
import { StepOne } from "./components/stepone";
import { StepTwo } from "./components/steptwo";
import nodeguiIcon from "../assets/nodegui.jpg";
import { Css } from "nodegui-plugin-css-classnames";
import { stylesheet } from "./style";

const minSize = { width: 500, height: 520 };
const winIcon = new QIcon(nodeguiIcon);

const style = new Css(stylesheet);
export const css = style.styleByClass.bind(style);

class App extends React.Component {
  render() {
    const style = `
      .dark{
        background-color: gray;
        color: white;
        padding-vertical: 5px;
      }
    `
    
    return (
      <Window windowIcon={winIcon} windowTitle="Hello 👋🏽" minSize={minSize}>
        <View {...css("d-flex")}>
          <Text {...css("welcome-text")}>Welcome to NodeGui 🐕</Text>
          <Text {...css("step-1")}>1. Play around</Text>
          <StepOne />
          <Text {...css("step-1")}>2. Debug</Text>
          <Button {...css("button dark mx-3", style)} text="Button"/>
          <StepTwo />
        </View>
      </Window>
    );
  }
}

export default hot(App);

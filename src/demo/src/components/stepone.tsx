import { Text, View } from "@nodegui/react-nodegui";
import React from "react";
import { css } from "../app";
const dogImg = require("./dog");

export function StepOne() {
  return (
    <View {...css("mx-3 px-2")}>
      <Text wordWrap={true}>Edit App.tsx to make changes to this screen. Then come back to see your changes. Changes should reflect live thanks to Hot Reloading. 🔥</Text>
      <Text>
        {`
          <p style="color: rgb(255,72,38);"> 
            <center>
              <img src="${dogImg}" alt="doggy" />  
            </center>
            <center>You can even use <i><strong>Rich Html</strong></i> text like this if you want 😎.</center>
          </p>
          <hr />
        `}
      </Text>
    </View>
  );
}

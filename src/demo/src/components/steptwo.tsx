import { Text, View, Button, useEventHandler } from "@nodegui/react-nodegui";
import { QPushButtonSignals } from "@nodegui/nodegui";
import React from "react";
import open from "open";
import { css } from "../app";

export function StepTwo() {
  const btnHandler = useEventHandler<QPushButtonSignals>(
    {
      clicked: () => open("https://react.nodegui.org").catch(console.log)
    },
    []
  );
  return (
    <View {...css("d-flex justify-space-around")}>
      <Text {...css("pr-3")} wordWrap={true}>
        {`
          <ol>
            <li>
                Open chrome and navigate to chrome://inspect. You should see a target below with your app.
            </li>
            <br/>
              <li>
                  Next click on  "Open dedicated DevTools for Node"
              </li>
              <br/>
            <li>
                On the dedicated devtools. Click on Source > Node > "Your node process"
            </li>
          </ol>
        `}
      </Text>
      <Button
        {...css("mx-3 h-40", `.h-40{height: 40px;}`)}
        on={btnHandler}
        text={`Open React NodeGui docs`}
      ></Button>
    </View>
  );
}